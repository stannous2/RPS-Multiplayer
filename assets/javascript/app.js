$(function () {

    let player1 = $('#player1');
    let player2 = $('#player2');
    let gameStatus = $('#game-status');
    let nameBox = $('#name-box');


    $('#start-button').on('click', function () {
        event.preventDefault();

        if ($('#player1').html().trim() !== 'Waiting for Player 1') {
            player2.html($('#name-box').val());
            // console.log('player 2 name - ' + player2)
            generateGameOptions(player2);
        } else {
            player1.html($('#name-box').val());
            // console.log('player 1 name - ' + player1)
            console.log('player1 - ' + player1);
            generateGameOptions(player1);
        }
    });

    function displayPlayerSelection(player){
        console.log('this is a test...');

        $('')
    }

    function generateGameOptions(player) {
        // console.log('this is working...', player1)
        let rock = $('<button class=btn-secondary>');
        // console.log(rock)
        rock.attr('id', 'rbutton');
        rock.text('Rock');
        rock.attr('type', 'button');
        player.append(rock);
         console.log(rock)

        let paper = $('<button class=btn-secondary>');
        paper.attr('id', 'pbutton');
        rock.attr('type', 'button');
        paper.text('Paper');

        player.append(paper);

        let scissor = $('<button class=btn-secondary>');
        scissor.attr('id', 'sbutton');
        scissor.text('Scissor');
        rock.attr('type', 'button');
        player.append(scissor);

    }

})