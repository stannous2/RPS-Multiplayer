$(function () {
    let player1Div = $('#player1');
    let player1Choice = '';
    let player2Div = $('#player2');
    let player2Choice = '';

    let gameStatus = $('#game-status');
    let player1Name = '';
    let player2Name = '';
    let activePlayer = '';
    let playerNum = 0;
    let name = '';
    let choice = '';
    let wins = 0;
    let losses = 0;
    let tie = 0;
    let currentSnapshot;

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
    writePlayerData(DATABASE, 1, '', '', 0, 0);
    writePlayerData(DATABASE, 2, '', '', 0, 0);


    $('#start-button').on('focus', function () {


        event.preventDefault();

        pullDataFromFirebase(DATABASE, 1);
        console.log('current snapshot player name: --- ' + currentSnapshot.playerName)
        if (currentSnapshot.playerName == null){
            
            //let player1Name = player1Div.html($('.name-box').val());
            player1Div.html($('.name-box').val());
            player1Name = player1Div.html();
            console.log('player 1 name - ' + player1Name);
            
            generateGameOptions(player1Div);
            
            //reset the input box after a player clicks start
            $('.name-box').val('');
            
            //create a player each player
            playerId = 1
            //let playerRef = DATABASE.ref('/players/' + playerId);
            
            debugger
            //console.log('playerRef - ' + playerRef);
            writePlayerData(DATABASE, playerId, player1Name, '', 0, 0)
        } else {
            player2Div.html($('.name-box').val());
            player2Name = player2Div.html();
            console.log('player 2 name - ' + player2Name);

            generateGameOptions(player2Div);

            //reset the input box
            $('.name-box').val('');


            //create a playerRef each player
            playerId = 2;
            writePlayerData(DATABASE, playerId, player2Name, '', 0, 0);
        }

        //pullDataFromFirebase(DATABASE, 2);

        

        // if ($('#player1').html().trim() !== 'Waiting for Player 1') {
        //     player2Div.html($('.name-box').val());
        //     player2Name = player2Div.html();
        //     console.log('player 2 name - ' + player2Name);

        //     generateGameOptions(player2Div);

        //     //reset the input box
        //     $('.name-box').val('');


        //     //create a playerRef each player
        //     playerId = 2;
        //     writePlayerData(DATABASE, playerId, player2Name, '', 0, 0);

        // } else {
        //     //let player1Name = player1Div.html($('.name-box').val());
        //     player1Div.html($('.name-box').val());
        //     player1Name = player1Div.html();
        //     console.log('player 1 name - ' + player1Name);

        //     generateGameOptions(player1Div);

        //     //reset the input box after a player clicks start
        //     $('.name-box').val('');

        //     //create a player each player
        //     playerId = 1
        //     //let playerRef = DATABASE.ref('/players/' + playerId);

        //     //console.log('playerRef - ' + playerRef);
        //     writePlayerData(DATABASE, playerId, player1Name, '', 0, 0)

        // }
    });

    $('.player1-box').on('click', 'button', function () {
        player1Choice = $(this).val();
        console.log('player 1 just selected ...' + player1Choice);
        // $('.player1-box').html(player1Choice);

        activePlayer = player1Name;
        console.log('active player - ' + activePlayer);

        playerId = 1;
        updatePlayerData(DATABASE, playerId, player1Choice);

    })

    $('.player2-box').on('click', 'button', function () {
        player2Choice = $(this).val();
        console.log('player 2 just selected ...' + player2Choice);
        // $('.player2-box').html(player2Choice);

        activePlayer = player2Name;
        console.log('active player - ' + activePlayer);

        playerId = 2;
        updatePlayerData(DATABASE, playerId, player2Choice);

    })


    //console.log('this is before go inside the compare choices function...')
    // compareChoices(player1Choice, player2Choice);
    DATABASE.ref('/players/1').on('value', function (snapshot) {
        // Log everything that's coming out of snapshot
        //console.log('this is the printout of whole snapshot ' + snapshot.val());
        // console.log('this is the printout of snapshot-losses ' + snapshot.val().losses);
        // console.log('this is the printout of snapshot-wins ' + snapshot.val().wins);
        // console.log('this is the printout of snapshot-name ' + snapshot.val().name);

        p1SnapshotChoice = snapshot.val().choice;
        console.log('this is the PLAYER1 of snapshot-choice : ' + p1SnapshotChoice);

        //add to the HTML 
        $('.player1-box').html(p1SnapshotChoice);


        if (typeof p1SnapshotChoice === "string" && typeof p2SnapshotChoice === "string") {
            console.log("this is inside of the player 1 loop... ");

            compareChoices(p1SnapshotChoice, p2SnapshotChoice)
        }

    })
    DATABASE.ref('/players/2').on("child_changed", function (snapshot) {
        console.log('snapshot player2Name: ' + snapshot.val().player2Name);

        p2SnapshotChoice = snapshot.val().choice;
        console.log('this is the PLAYER2 of snapshot-choice : ' + p2SnapshotChoice);

        //append to the HTML
        $('.player2-box').html(p2SnapshotChoice);

        console.log('snapshot player2Choice: ' + p2SnapshotChoice);
        // compareChoices(player1Choice, player2Choice)

        if (typeof p1SnapshotChoice === "string" && typeof p2SnapshotChoice === "string") {
            console.log("this is inside of the player 2 loop... ");

            compareChoices(p1SnapshotChoice, p2SnapshotChoice)
        }
    })

    //######################### Functions ###############################################

    function writePlayerData(database, playerId, playerName, playerChoice, playerLosses, playerWins) {

        database.ref('/players/' + playerId).set({
            name: playerName,
            choice: playerChoice,
            wins: playerWins,
            losses: playerLosses
        });
    }

    function updatePlayerData(database, playerId, playerChoice) {
        database.ref('/players/' + playerId).update({
            choice: playerChoice
        })
    }

    function pullDataFromFirebase(database, playerId) {

        database.ref('/players/' + playerId).on('value', function (snapshot) {
            playerName = snapshot.val().name;
            playerChoice = snapshot.val().choice;
            playerWins = snapshot.val().wins;
            playerLosses = snapshot.val().losses;

            console.log('PLAYER ' + playerId + ' printout of snapshot-name ' + playerName);
            console.log('PLAYER ' + playerId + ' printout of snapshot-choice ' + playerChoice);
            console.log('PLAYER ' + playerId + ' printout of snapshot-losses ' + playerLosses);
            console.log('PLAYER ' + playerId + ' printout of snapshot-wins ' + playerWins);

            return currentSnapshot = snapshot;
        });
       
    }


    function compareChoices(p1Choice, p2Choice) {
        console.log('this is inside comparechoices function...')

        let selection = p1Choice + '-' + p2Choice;
        console.log('selection... ' + selection)

        if (selection === 'rock-scissor' || selection === 'scissor-paper' || selection === 'paper-rock') {
            console.log('player 1 wins...' + p1Choice);
            gameStatus.append(player1Name + ' WINS!!!');
        } else if (selection === 'rock-rock' || selection === 'scissor-scissor' || selection === 'paper-paper') {
            tie++;
            console.log('it is a tie: ', selection);
        } else if (selection === 'rock-paper' || selection === 'scissor-rock' || selection === 'paper-scissor') {
            losses++;
            console.log('player 2 wins...' + p2Choice);
            gameStatus.append(player2Name + ' WINS!!!');
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
