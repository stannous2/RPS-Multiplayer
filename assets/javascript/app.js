$(function() {    // let player1Div = $('.p1-optionsDiv');    let player1Choice = '';    // let player2Div = $('#player2');    let player2Choice = '';    let gameStatus = $('#game-status');    let player1Name = '';    let player2Name = '';    let winner = '';    let name = '';    let choice = '';    let winCount = 0;    let lossCount = 0;    let tie = 0;    let playerName = '';    let playerChoice = '';    // configure Firebase    var config = {        apiKey: "AIzaSyDBGKGEFQ8Ue3jp9xgJGqCtqVjyjW1knqE",        authDomain: "stannous2-bootcamp.firebaseapp.com",        databaseURL: "https://stannous2-bootcamp.firebaseio.com",        projectId: "stannous2-bootcamp",        storageBucket: "stannous2-bootcamp.appspot.com",        messagingSenderId: "639531251680"    };    // initialize Firebase with the config    firebase.initializeApp(config);    // initialize an instance of the DB    const DATABASE = firebase.database();    let dbListener = DATABASE.ref;    //reset player info before game starts    writePlayerData(DATABASE, 1, '', '', winCount, lossCount, tie);    writePlayerData(DATABASE, 2, '', '', winCount, lossCount, tie);        $('#start-button').on('click', function() {        event.preventDefault();        //getting the initial player data from DB        pullDataFromFirebase(DATABASE, 1);        console.log('current snapshot player name: --- ' + playerName)        if (playerName === '') {            //display enterred name on HTML            $('.p1-nameDiv').html($('.name-box').val());            player1Name = $('.p1-nameDiv').html();            //reset the input box after player clicks start            $('.name-box').val('');            //create a player each player            playerId = 1            writePlayerData(DATABASE, playerId, player1Name, '', winCount, lossCount, tie)            generateGameOptions($('.p1-optionsDiv'));        } else if (playerName !== '') {            //display enterred name on HTML            $('.p2-nameDiv').html($('.name-box').val());            player2Name = $('.p2-nameDiv').html();            console.log('player 2 name - ' + player2Name);            //reset the input box after player clicks start            $('.name-box').val('');            playerId = 2;            writePlayerData(DATABASE, playerId, player2Name, '', winCount, lossCount, tie);            generateGameOptions($('.p2-optionsDiv'));        }    });    $('.p1-optionsDiv').on('click', 'button', function() {        player1Choice = $(this).val();        playerId = 1;        updatePlayerData(DATABASE, playerId, player1Choice);        pullDataFromFirebase(DATABASE, playerId);        $('.p1-optionsDiv').html(playerChoice);        //run the compareresults function        if (player1Choice !== '' && player2Choice !== '') {            compareChoices(player1Choice, player2Choice);        }    })    $('.p2-optionsDiv').on('click', 'button', function() {        player2Choice = $(this).val();        playerId = 2;        updatePlayerData(DATABASE, playerId, player2Choice);        pullDataFromFirebase(DATABASE, playerId);        $('.p2-optionsDiv').html(playerChoice);         //run the compareresults function        if (player1Choice !== '' && player2Choice !== '') {            compareChoices(player1Choice, player2Choice);        }    });    // Listener for player 1    DATABASE.ref('/players/1').on('value', function(snapshot) {        player1Name = snapshot.val().name;        player1Choice = snapshot.val().choice;        player1Wins = snapshot.val().wins;        player1Losses = snapshot.val().losses;        player1Tie = snapshot.val().tie;                $('.p1-nameDiv').html(player1Name);        showWinner(player1Name, player2Name);                let p1Stats = $('.p1-stats');        $('#p1-win').html('Wins: ' + player1Wins);        $('#p1-loss').html('Losses: ' + player1Losses);            });    // Listener for player 2    DATABASE.ref('/players/2').on('value', function(snapshot) {        player2Name = snapshot.val().name;        player2Choice = snapshot.val().choice;        player2Wins = snapshot.val().wins;        player2Losses = snapshot.val().losses;        player2Tie = snapshot.val().tie;                $('.p2-nameDiv').html(player2Name);        showWinner(player1Name, player2Name);                let p2Stats = $('.p2-stats');        $('#p2-win').html('Wins: ' + player2Wins);        $('#p2-loss').html('Losses: ' + player2Losses);    });    //######################### Functions ###############################################    function writePlayerData(database, playerId, playerName, playerChoice, playerWins, playerLosses, playerTie) {        database.ref('/players/' + playerId).set({            name: playerName,            choice: playerChoice,            wins: playerWins,            losses: playerLosses,            tie: playerTie        });    }    function updatePlayerData(database, playerId, playerChoice) {        database.ref('/players/' + playerId).update({            choice: playerChoice,        })    }    function updatePlayerWinStats(database, playerId) {        console.log("is this win-update even run....")        database.ref('/players/' + playerId).update({            wins: winCount        })    }    function updatePlayerLossStats(database, playerId) {        console.log("is this loss-update even run....")        database.ref('/players/' + playerId).update({            losses: lossCount        })    }    function pullDataFromFirebase(database, playerId) {        database.ref('/players/' + playerId).on('value', function(snapshot) {            playerName = snapshot.val().name;            playerChoice = snapshot.val().choice;            playerWins = snapshot.val().wins;            playerLosses = snapshot.val().losses;        });    }    function compareChoices(p1Choice, p2Choice) {        console.log('this is inside comparechoices function...')        let selection = p1Choice + '-' + p2Choice;        console.log('selection... ' + selection)        if (selection === 'rock-scissor' || selection === 'scissor-paper' || selection === 'paper-rock') {            winCount++;            lossCount++;            winner = player1Name;            //gameStatus.append('Player ' + player1Name + ' Wins!!!');            updatePlayerWinStats(DATABASE, 1)            updatePlayerLossStats(DATABASE, 2)        } else if (selection === 'rock-rock' || selection === 'scissor-scissor' || selection === 'paper-paper') {            tie++;            console.log('it is a tie: ', selection);            gameStatus.append('It is a TIE ...');        } else if (selection === 'rock-paper' || selection === 'scissor-rock' || selection === 'paper-scissor') {            lossCount++;            winCount++;            console.log('player 2 wins...' + p2Choice);            winner = player2Name;            //gameStatus.append('Player ' + player2Name + ' Wins!!!');            updatePlayerWinStats(DATABASE, 2)            updatePlayerLossStats(DATABASE, 1)        }    }    function generateGameOptions(player) {        let rock = $('<button class=btn-secondary >');        rock.attr('id', 'rbutton');        rock.attr('value', 'rock');        rock.attr('type', 'button');        rock.text('Rock');        player.append(rock);        let paper = $('<button class=btn-secondary>');        paper.attr('id', 'pbutton');        paper.attr('value', 'paper');        paper.attr('type', 'button');        paper.text('Paper');        player.append(paper);        let scissor = $('<button class=btn-secondary>');        scissor.attr('id', 'sbutton');        scissor.attr('value', 'scissor');        scissor.attr('type', 'button');        scissor.text('Scissor');        player.append(scissor);    }    function showWinner(player1, player2) {        if (player1 !== '' && player2 !== ''){            if(player1 === winner){                gameStatus.html('Player ' + player1 + ' Wins!!!');            } else if (player2 === winner) {                gameStatus.html('Player ' + player1 + ' Wins!!!');            }else                gameStatus.html('')        }else            return;            }})