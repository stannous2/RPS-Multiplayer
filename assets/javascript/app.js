$(function () {

    let player1Div = $('#player1');
    let player1Choice = '';
    let player2Div = $('#player2');
    let player2Choice = '';
    let win = 0;
    let losses = 0;
    let tie = 0;

    let gameStatus = $('#game-status');

    // configure Firebase
    var config = {
        apiKey: "AIzaSyB60ykuOBZnxaPmlBzdMoPP1uilDCBfIBY",
        authDomain: "stannous2-bootcamp.firebaseapp.com",
        databaseURL: "https://stannous2-bootcamp.firebaseio.com/",
        projectId: "srt-bootcamp",
        storageBucket: "",
        messagingSenderId: "320432472574"
    };

    // initialize Firebase with the config
    firebase.initializeApp(config);

    // initialize an instance of the DB
    const DATABASE = firebase.database();

    $('#start-button').on('focus', function () {
        event.preventDefault();

        if ($('#player1').html().trim() !== 'Waiting for Player 1') {
            player2Div.html($('.name-box').val());
            console.log('player 2 name - ' + player2Div.val());
            generateGameOptions(player2Div);
            $('.name-box').val('');

            let player2Name = player2Div.val();
            DATABASE.ref('/player2').push({
                name: player2Name,
                //choice: player2Choice
            });

        } else {
            player1Div.html($('.name-box').val());
            console.log('player 1 name - ' + player1Div.val());
            generateGameOptions(player1Div);
            $('.name-box').val('');
            
            let player1Name = player1Div.val();
             
            DATABASE.ref('/player1').push({
                name: player1Name,
                //choice: player1Choice,
            });

        }
    });

    $('.player1-box').on('click', 'button', function () {

        player1Choice = $(this).val();
        console.log('player 1 just selected ...' + player1Choice);
        $('.player1-box').html(player1Choice);

        DATABASE.ref('/player1').push({
            //name: player1Name,
            choice: player1Choice
        });
    })

    $('.player2-box').on('click', 'button', function () {

        player2Choice = $(this).val();
        console.log('player 2 just selected ...' + player2Choice);
        $('.player2-box').html(player2Choice);

        DATABASE.ref('/player2').push({
            //name: player2Name,
            choice: player2Choice
        });
    })
    console.log('this is outside comparechoices function...')
    compareChoices(player1Choice, player2Choice);

    function pullData(){
        
    }
    function compareChoices(p1Choice, p2Choice) {
        console.log('this is inside comparechoices function...')

        let r = 'rock';
        let p = 'paper';
        let s = 'scissor';
        let selection = p1Choice + p2Choice;
        console.log('selection... ' + selection)
        if (selection === 'rs' || selection === 'sp' || selection === 'pr') {
            console.log('player 1 wins...' + p1Choice);
        } else if (selection === 'rr' || selection === 'ss' || selection === 'pp') {
            tie++;

            console.log('it is a tie: ' + userChoice);
        } else if (selection === 'rp' || selection === 'sr' || selection === 'ps') {
            losses++;

            console.log('you lose: ' + userChoice);
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