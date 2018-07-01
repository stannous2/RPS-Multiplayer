$(function () {
    let player1Div = $('#player1');
    let player1Choice = '';
    let player2Div = $('#player2');
    let player2Choice = '';
    let win = 0;
    let losses = 0;
    let tie = 0;
    let gameStatus = $('#game-status');
    let player1Name = '';
    let player2Name = '';
    let activePlayer = '';
    let playerNum = 0;

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
    //create a playerRef each player
    // let playerRef = DATABASE.ref('/players/' + playerNum);

    $('#start-button').on('focus', function () {
        let name = '';
        let choice = '';
        let wins = 0;
        let losses = 0;
        
        event.preventDefault();

        if ($('#player1').html().trim() !== 'Waiting for Player 1') {
            player2Div.html($('.name-box').val());
            player2Name = player2Div.html();
            console.log('player 2 name - ' + player2Name);

            generateGameOptions(player2Div);

            //reset the input box
            $('.name-box').val('');


            //create a playerRef each player
            playerNum = 2;
            let playerRef = DATABASE.ref('/players/' + playerNum);
            playerRef.set({
                name: player2Name,
                choice: null,
                wins: 0,
                losses: 0
            })

            // DATABASE.ref(playerRef).update({
            //     name: player2Name,
            // });
        } else {
            //let player1Name = player1Div.html($('.name-box').val());
            player1Div.html($('.name-box').val());
            player1Name = player1Div.html();
            console.log('player 1 name - ' + player1Name);

            generateGameOptions(player1Div);

            //reset the input box after a player clicks start
            $('.name-box').val('');
            
            //create a player each player
            playerNum = 1
            let playerRef = DATABASE.ref('/players/' + playerNum);
            console.log('playerRef - ' + playerRef);
            
            playerRef.set({
                name: player1Name,
                choice: null,
                wins: 0,
                losses: 0
            })

            // DATABASE.ref(playerRef).update({
            //     name: player1Name,
            // });
        }
    });

    $('.player1-box').on('click', 'button', function () {
        player1Choice = $(this).val();
        //console.log('player 1 just selected ...' + player1Choice);
        // $('.player1-box').html(player1Choice);

        activePlayer = player1Name;
        console.log('active player - ' + activePlayer);

        DATABASE.ref('/players/1').update({
            choice: player1Choice
        });

    })

    $('.player2-box').on('click', 'button', function () {
        player2Choice = $(this).val();
        //console.log('player 2 just selected ...' + player2Choice);
        // $('.player2-box').html(player2Choice);

        activePlayer = player2Name;
        console.log('active player - ' + activePlayer);

        DATABASE.ref('/players/2').update({
            choice: player2Choice
        });

    })
    // console.log('this is outside comparechoices function...')
    // compareChoices(player1Choice, player2Choice);
    DATABASE.ref('/players/1').on("child_added", function (snapshot) {
        // Log everything that's coming out of snapshot
        console.log(snapshot.val());

        player1Choice = snapshot.val().choice;
        //add to the HTML 
        $('.player1-box').html(player1Choice);

        console.log('snapshot player1Choice: ' + player1Choice);
        // compareChoices(player1Choice, player2Choice)

        if (typeof player1Choice === "string" && typeof player2Choice === "string") {
            console.log("this is inside of the player 1 loop... ");

            compareChoices(player1Choice, player2Choice)
        }

    })
    DATABASE.ref('/players/2').on("child_added", function (snapshot) {
        //console.log('snapshot player2Name: ' + snapshot.val().player2Name);

        player2Choice = snapshot.val().choice;
        $('.player2-box').html(player2Choice);

        console.log('snapshot player2Choice: ' + player2Choice);
        // compareChoices(player1Choice, player2Choice)

        if (typeof player1Choice === "string" && typeof player2Choice === "string") {
            console.log("this is inside of the player 2 loop... ");

            compareChoices(player1Choice, player2Choice)
        }
    })


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
        let rock = $('<button class=btn-secondary>');
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