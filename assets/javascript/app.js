let player1 = $('#player1');
let player2 = $('#player2');
let gameStatus = $('#game-status');
let nameBox = $('#name-box');








$('#start-button').on('click', function(){
    event.preventDefault();
    
    if($('#player1').html().trim() !== 'Waiting for Player 1') {
        player2.html($('#name-box').val());
        console.log('player 2 name - ' + player2)
        generateGameOptions($('.player2-box'));
    }else {
        player1.html($('#name-box').val());
        console.log('player 1 name - ' + player1)
        generateGameOptions($('.player1-box'));
    }
});

function generateGameOptions(player){
    let rock = $('<button>');
    rock.attr('id', 'rbutton');
    rock.attr('value', 'r');
    rock.append(player);

    let paper = $('<button>');
    paper.attr('id', 'pbutton');
    paper.attr('value', 'p');
    paper.append(player);

    let scissor = $('<button>');
    scissor.attr('id', 'sbutton');
    scissor.attr('value', 'scissor');
    scissor.append(player);

}