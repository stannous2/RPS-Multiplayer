$(function() {
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
    $('#start-button').on('focus', function() {
        let player1Name = '';
        let player2Name = '';


        event.preventDefault();
        if ($('#player1').html().trim() !== 'Waiting for Player 1') {
            player2Div.html($('.name-box').val());
            player2Name = player2Div.html();
            console.log('player 2 name - ' + player2Name);

            generateGameOptions(player2Div);
            
            //reset the input box
            $('.name-box').val('');
            
            DATABASE.ref('/player2').push({
                name: player2Name,
            });
        } else {
            //let player1Name = player1Div.html($('.name-box').val());
            player1Div.html($('.name-box').val());
            player1Name = player1Div.html();            
            console.log('player 1 name - ' + player1Name);

            generateGameOptions(player1Div);

            //reset the input box
            $('.name-box').val('');
           
            DATABASE.ref('/player1').push({
                name: player1Name,
            });
        }
    });
    $('.player1-box').on('click', 'button', function() {
        player1Choice = $(this).val();
        console.log('player 1 just selected ...' + player1Choice);
        $('.player1-box').html(player1Choice);
        DATABASE.ref('/player1').push({
            //name: player1Name,
            choice: player1Choice
        });
    })
    $('.player2-box').on('click', 'button', function() {
        player2Choice = $(this).val();
        console.log('player 2 just selected ...' + player2Choice);
        $('.player2-box').html(player2Choice);
        DATABASE.ref('/player2').push({
            choice: player2Choice
        });
    })
    // console.log('this is outside comparechoices function...')
    // compareChoices(player1Choice, player2Choice);
    // Firebase watcher + initial loader HINT: .on("value")
    DATABASE.ref().on("child_added", function(snapshot) {
        // Log everything that's coming out of snapshot
        console.log(snapshot.val());
        console.log(snapshot.val().name);
        console.log(snapshot.val().choice);

        // Change the HTML to reflect
        // $("#name-display").text(snapshot.val().name);
        // $("#email-display").text(snapshot.val().email);
        // $("#age-display").text(snapshot.val().age);
        // $("#comment-display").text(snapshot.val().comment);
        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

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