$(function() {
    // let player1Div = $('.p1-optionsDiv');
    let player1Choice = '';
    // let player2Div = $('#player2');
    let player2Choice = '';
    let gameStatus = $('#game-status');
    let player1Name = '';
    let player2Name = '';
   
    let name = '';
    let choice = '';
    let wins = 0;
    let losses = 20;
    let tie = 0;
    let playerName = '';
    let playerChoice = '';
    // configure Firebase
    var config = {
        apiKey: "AIzaSyDBGKGEFQ8Ue3jp9xgJGqCtqVjyjW1knqE",
        authDomain: "stannous2-bootcamp.firebaseapp.com",
        databaseURL: "https://stannous2-bootcamp.firebaseio.com",
        projectId: "stannous2-bootcamp",
        storageBucket: "stannous2-bootcamp.appspot.com",
        messagingSenderId: "639531251680"
    };
    // initialize Firebase with the config
    firebase.initializeApp(config);
    // initialize an instance of the DB
    const DATABASE = firebase.database();

    //reset player info before game starts
    writePlayerData(DATABASE, 1, '', '', wins, losses, tie);
    writePlayerData(DATABASE, 2, '', '', wins, losses, tie);

    $('#start-button').on('click', function() {
        event.preventDefault();
        //getting the initial player data from DB
        pullDataFromFirebase(DATABASE, 1);
        console.log('current snapshot player name: --- ' + playerName)
        if (playerName === '') {
            //display enterred name on HTML
            $('.p1-nameDiv').html($('.name-box').val());
            player1Name = $('.p1-nameDiv').html();
            
            //reset the input box after player clicks start
            $('.name-box').val('');

            //create a player each player
            playerId = 1
            writePlayerData(DATABASE, playerId, player1Name, '', wins, losses, tie)
            
        } else if (playerName !== '') {

            //display enterred name on HTML
            $('.p2-nameDiv').html($('.name-box').val());
            player2Name = $('.p2-nameDiv').html();
            
            console.log('player 2 name - ' + player2Name);
            
            //reset the input box after player clicks start
            $('.name-box').val('');

            playerId = 2;
            writePlayerData(DATABASE, playerId, player2Name, '', wins, losses, tie);
            
        }
    });
    $('.p1-optionsDiv').on('click', 'button', function() {
        player1Choice = $(this).val();
        
        playerId = 1;
        updatePlayerData(DATABASE, playerId, player1Choice);
        pullDataFromFirebase(DATABASE, playerId);

        $('.p1-optionsDiv').html(playerChoice);
        console.log('snapshot player 1 choice --- ' + playerChoice);
        
        //run the compareresults function
        if (player1Choice !== '' && player2Choice !== '') {
            compareChoices(player1Choice, player2Choice);
        }
    })
    $('.player2-box').on('click', 'button', function() {
        player2Choice = $(this).val();
        
        playerId = 2;
        updatePlayerData(DATABASE, playerId, player2Choice);
        pullDataFromFirebase(DATABASE, playerId);

        //run the compareresults function
        if (player1Choice !== '' && player2Choice !== '') {
            compareChoices(player1Choice, player2Choice);
        }
    })

        DATABASE.ref('/players/1').on('value', function(snapshot) {
        player1Name = snapshot.val().name;
        player1Wins = snapshot.val().wins;
        player1Losses = snapshot.val().losses;
        player1Tie = snapshot.val().tie;

        console.log('player1Name from the listener - ' + player1Name)

        $('.p1-nameDiv').html(player1Name);

        if (player1Name !== ''){
            generateGameOptions($('.p1-optionsDiv'));
        }
        // if(player1Choice !== ''){    
        //     $('.player1-box').html(player1Choice);
        // }

    });
        DATABASE.ref('/players/2').on('value', function(snapshot) {
        player2Name = snapshot.val().name;
        player2Wins = snapshot.val().wins;
        player2Losses = snapshot.val().losses;
        player2Tie = snapshot.val().tie;

        $('.p2-nameDiv').html(player2Name);
        generateGameOptions($('.p2-optionsDiv'));

        // if (player2Name !== ''){
        // }

        // if(player2Choice !== ''){
        //     $('.player2-box').html(player2Choice);
        // }
        
    });
    //######################### Functions ###############################################
    function writePlayerData(database, playerId, playerName, playerChoice, playerWins, playerLosses, playerTie) {
        database.ref('/players/' + playerId).set({
            name: playerName,
            choice: playerChoice,
            wins: playerWins,
            losses: playerLosses,
            tie: playerTie
        });
    }

    function updatePlayerData(database, playerId, playerChoice) {
        database.ref('/players/' + playerId).update({
            choice: playerChoice
        })
    }

    function pullDataFromFirebase(database, playerId) {
        database.ref('/players/' + playerId).on('value', function(snapshot) {
            playerName = snapshot.val().name;
            playerChoice = snapshot.val().choice;
            playerWins = snapshot.val().wins;
            playerLosses = snapshot.val().losses;
        });
    }

    function compareChoices(p1Choice, p2Choice) {
        console.log('this is inside comparechoices function...')
        let selection = p1Choice + '-' + p2Choice;
        console.log('selection... ' + selection)
        if (selection === 'rock-scissor' || selection === 'scissor-paper' || selection === 'paper-rock') {
            console.log('player 1 wins...' + p1Choice);
            gameStatus.append('Player ' + player1Name + ' WINS!!!');
        } else if (selection === 'rock-rock' || selection === 'scissor-scissor' || selection === 'paper-paper') {
            tie++;
            console.log('it is a tie: ', selection);
            gameStatus.append('It is a TIE ...');
        } else if (selection === 'rock-paper' || selection === 'scissor-rock' || selection === 'paper-scissor') {
            losses++;
            console.log('player 2 wins...' + p2Choice);
            gameStatus.append('Player ' + player2Name + ' WINS!!!');
        }
    }

    function generateGameOptions(player) {
        let rock = $('<button class=btn-secondary >');
        rock.attr('id', 'rbutton');
        rock.attr('value', 'rock');
        rock.attr('type', 'button');
        rock.text('Rock');
        player.append(rock);

        let paper = $('<button class=btn-secondary>');
        paper.attr('id', 'pbutton');
        paper.attr('value', 'paper');
        paper.attr('type', 'button');
        paper.text('Paper');
        player.append(paper);

        let scissor = $('<button class=btn-secondary>');
        scissor.attr('id', 'sbutton');
        scissor.attr('value', 'scissor');
        scissor.attr('type', 'button');
        scissor.text('Scissor');
        player.append(scissor);
    }
})