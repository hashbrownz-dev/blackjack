/*

==== CITY POP BLACKJACK ====
=======   ver  1.0   =======
============================

A simple game of Blackjack with a distinct city pop retro aesthetic.  This game utilizes HTML, CSS, and Vanilla Javascript.  All graphics and animations are handled with HTML and CSS.

*/
//Class Declarations

class Card{
    constructor(suit, fvalue, facedown){
        this.suit = suit;
        this.fvalue = fvalue;
        this.facedown = facedown;
    }
    get name(){
        if(!this.facedown){
            return `${this.fvalue} of ${this.suit}`;
        }else{
            return `?`;
        }
    }
}

class Deck{
    constructor(deck){
        this.deck = deck;
    }

    shuffle(){
        for(let i = this.deck.length - 1; i >= 0; i--){
            let k = Math.floor(Math.random()*i);
            let temp = this.deck[k];
            this.deck[k] = this.deck[i];
            this.deck[i] = temp;
        }
        return this.deck;
    }
    draw(){
        let c = this.deck.pop(); //remove the last element and store it in c
        this.deck.unshift(c); //place the last element at the beginning of the array
        return c; //return c
    }
    static populate(){
        let suits = _suits,
            faces = _cardfaces,
            d = [];
        for(let s = suits.length - 1; s >= 0; s--){
            for(let f = faces.length - 1; f >= 0; f--){
                d.push(new Card(suits[s], faces[f], false));
            }
        }
        return new Deck(d);
    }
}

class Hand{
    constructor(cards, score){
        this.cards = cards; //an array of card objects
        this.score = score; //total points in hand
    }
    hit(deck = _deck){
        //draw() a card from the Deck and add it to this instances hand
        let c = deck.draw();
        this.cards.push(c);
        this.score = this.tallyScore;
        //return c;
    }
    get tallyScore(){
        let score = 0;
        let aces = false;
        for(let card of this.cards){
            let cvalue = getScore(card);
            if(cvalue == 1) aces++;
            score += getScore(card);
        }
        if(aces > 0){
            if(score <= 11) score += 10;
        }
        return score;
    }
    get busted(){
        if (this.score > 21){
            return true;
        } else {
            return false;
        }
    }
    static deal(deck){
        return new Hand([],0);
    }
}

//Global constants
const _cardfaces = ["Ace","King","Queen","Jack","10","9","8","7","6","5","4","3","2"],
    _suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts'],
    _startingcredits = 100,
    _maxbet = 20,
    _player = Hand.deal(),
    _dealer = Hand.deal(),
    _deck = Deck.populate();

//Global variables
let credits = _startingcredits,
    currentbet = 1,
    winnings = 0;

//FUNCTIONS

//SCORING

function getScore(card){ //returns the point value of a single card
    let score;
    switch (card.fvalue){
        case 'King':
        case 'Queen':
        case 'Jack':
        case '10':
            score = 10;
            break;
        case '9':
        case '8':
        case '7':
        case '6':
        case '5':
        case '4':
        case '3':
        case '2':
            score = parseInt(card.fvalue);
            break;
        case 'Ace':
            score = 1;
            break;
        default:
            score = 0;
            break;
    }
    return score;
}

//INTERFACE
const _btn_help = document.getElementById('help'),  //HELP BUTTON
    _score_d = document.getElementById('dscore'),   //DEALER SCORE ELEMENT
    _score_p = document.getElementById('pscore'),   //PLAYER SCORE ELEMENT
    _hand_d = document.querySelector('#dealer > .cards'),   //DEALER HAND
    _hand_p = document.querySelector('#player > .cards'),   //PLAYER HAND
    _result_d = document.getElementById('dresults'),    //DEALER RESULTS
    _result_p = document.getElementById('presults'),    //PLAYER RESULTS
    _btn_A = document.getElementById('buttonA'),    //BUTTON A
    _btn_B = document.getElementById('buttonB'),    //BUTTON B
    _btn_C = document.getElementById('buttonC'),    //BUTTON C
    _btn_D = document.getElementById('buttonD'),    //BUTTON D
    _bet = document.getElementById('bet'),  //CURRENT BET
    _won = document.getElementById('won'),  //CREDITS WON
    _credits = document.getElementById('credits');  //CURRENT CREDITS

//TEXT
const _txt_win = `won: ${winnings}`,
    _txt_bet = `bet: ${currentbet}`,
    _txt_score_d = `dealer: ${_dealer.score}`,
    _txt_credits = `credits: ${credits}`;

//CREATES AND RETURNS A CARD ELEMENT
function displayCard(card){
    const container = document.createElement('div');
    container.className = 'card';

    if(card.facedown == true){
        container.className = 'card facedown';
        return container;
    }
    const topleft = document.createElement('div'),
        imgSmall = document.createElement('img'),
        imgLarge = document.createElement('img'),
        face = document.createElement('p');

    face.className = 'face';
    topleft.appendChild(face);
    topleft.appendChild(imgSmall);
    container.appendChild(topleft);
    container.appendChild(imgLarge);

    //Check Face Value (fvalue)
    switch(card.fvalue){
        case 'Ace':
        case 'King':
        case 'Queen':
        case 'Jack':
            face.innerHTML = card.fvalue[0];
            break;
        case '10':
            face.innerHTML = card.fvalue;
            break;
        case '9':
            face.innerHTML = card.fvalue;
            break;
        case '8':
            face.innerHTML = card.fvalue;
            break;
        case '7':
            face.innerHTML = card.fvalue;
            break;
        case '6':
            face.innerHTML = card.fvalue;
            break;
        case '5':
            face.innerHTML = card.fvalue;
            break;
        case '4':
            face.innerHTML = card.fvalue;
            break;
        case '3':
            face.innerHTML = card.fvalue;
            break;
        case '2':
            face.innerHTML = card.fvalue;
            break;
    }
    //Check Suit
    //For each case change imgSmall and imgLarge
    switch(card.suit){
        case 'Clubs':
            imgSmall.src = 'images/Suits_Club-Mini.png';
            imgLarge.src = 'images/Suits_Club.png';
            break;
        case 'Diamonds':
            imgSmall.src = 'images/Suits_Diamond-Mini.png';
            imgLarge.src = 'images/Suits_Diamond.png';
            break;
        case 'Spades':
            imgSmall.src = 'images/Suits_Spade-Mini.png';
            imgLarge.src = 'images/Suits_Spade.png';
            break;
        case 'Hearts':
            imgSmall.src = 'images/Suits_Heart-Mini.png';
            imgLarge.src = 'images/Suits_Heart.png';
            break;
    }
    //Return the card element:
    return container;
}
//DRAW THE HAND ELEMENT
//takes hand (_player.cards || _dealer.cards) && element (_hand_d || _hand_p)
function displayHand(player, element){
    let hand = player.cards;
    //CLEAR
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
    //REDRAW
    let new_width = Math.max(60 + (hand.length * 40), 140);
    element.style.width = `${new_width}px`;
    for(let i=0; i<hand.length; i++){
        let cardelement = displayCard(hand[i]);
        let offset = i * 40;
        element.appendChild(cardelement);
        cardelement.style.left = `${offset}px`;
    }
}
//DRAW THE SCORE ELEMENT
function displayScore(){
    _score_d.innerHTML = `dealer: ${_dealer.score}`;
    _score_p.innerHTML = `player: ${_player.score}`;
}
//DRAW THE BET ELEMENT
function displayBet(){
    _bet.innerHTML = `bet: ${currentbet}`;
}
//DRAW RESULTS
function displayResult(){
    _hand_d.appendChild(_result_d);
    _hand_p.appendChild(_result_p);
}
//PLAYER CONTROLS

function hit(){
    //AFTER HITTING, THE PLAYER CAN NO LONGER DOUBLE DOWN
    _btn_C.disabled = true;
    _player.hit();
    displayHand(_player,_hand_p);
    displayScore();
    if(_player.busted){
        bust();
    }
}

function stand(){
    //SHIFTS PLAY FROM THE PLAYER TO THE DEALER
    //DISABLE PLAYER CONTROLS
    //REVEAL FACE DOWN CARD
    _dealer.cards[0].facedown = false;
    displayHand(_dealer,_hand_d);
    //DEALER HITS UNTIL THEY REACH SOFT 17
    while(_dealer.score < 17){
        _dealer.hit();
    }
    displayHand(_dealer,_hand_d);
    displayScore();
    getWinner();
    placeBet();
}

function doubleDown(){
    credits -= currentbet;
    currentbet = currentbet * 2;
    displayBet();
    hit();
    if(_player.busted){
        bust();
    }else{
        stand();
    }
}

function betOne(){
    if(currentbet < _maxbet && credits > 0)currentbet+=1;
    displayBet();
}

function betMax(){
    currentbet = credits<_maxbet ? credits : _maxbet;
    displayBet();
}

function betClear(){
    currentbet = 1;
    displayBet();
}

//PLAY PHASES
//BETTING PHASE
function placeBet(){
    //CHANGE BUTTONS A,B, & C
    _btn_A.innerHTML = 'bet one';
    _btn_B.innerHTML = 'bet max';
    _btn_C.innerHTML = 'deal';
    //REMOVE PLAY FUNCTIONS
    _btn_A.removeEventListener('click',hit);
    _btn_B.removeEventListener('click',stand);
    _btn_C.removeEventListener('click',doubleDown);
    //ATTACH BET FUNCTIONS
    _btn_A.addEventListener('click',betOne);
    _btn_B.addEventListener('click',betMax);
    _btn_C.addEventListener('click',dealGame);
    _btn_D.addEventListener('click',betClear);
    //ENABLE BUTTON C & D
    _btn_C.disabled = false;
    _btn_D.disabled = false;
}
//PLAY PHASE
function startPlay(){
    //CHANGE BUTTONS A,B, & C
    _btn_A.innerHTML = 'hit';
    _btn_B.innerHTML = 'stand';
    _btn_C.innerHTML = 'double';
    //REMOVE BET FUNCTIONS
    _btn_A.removeEventListener('click',betOne);
    _btn_B.removeEventListener('click',dealGame);
    _btn_C.removeEventListener('click',betMax);
    //ATTACH PLAY FUNCTIONS
    _btn_A.addEventListener('click',hit);
    _btn_B.addEventListener('click',stand);
    _btn_C.addEventListener('click',doubleDown);
    //DISABLE BUTTON D
    _btn_D.disabled = true;
}
//RESET
function reset(){
    //REMOVE ALL CARDS FROM PLAYER HANDS
    _player.cards = [];
    _dealer.cards = [];
    displayHand(_dealer, _hand_d);
    displayHand(_player, _hand_p);
    for(let card of _deck.deck){
        card.facedown = false;
    }
    //CLEAR SCORES
    _player.score = 0;
    _dealer.score = 0;
    displayScore();
}

//GET RESULTS
function bust(){
    _result_d.innerHTML = 'winner';
    _result_p.innerHTML = 'bust!'
    displayResult();
    placeBet();
}

function getWinner(){
    //CHECK FOR BLACKJACK
    if(_player.score == 21 && _player.cards.length == 2 && _dealer.score != 21){
        _result_d.innerHTML = 'loser';
        _result_p.innerHTML = 'blackjack!';
        credits += currentbet * 3;
        _credits.innerHTML = `credits: ${credits}`;
        displayResult();
        return;
    }
    if(_dealer.busted || _player.score > _dealer.score){
        _result_d.innerHTML = _dealer.busted ? 'bust!' : 'loser';
        _result_p.innerHTML = 'winner';
        credits += currentbet*2;
        _credits.innerHTML = `credits: ${credits}`;
        displayResult();
        return;
    }
    if(_dealer.score == _player.score){
        _result_d.innerHTML = 'push';
        _result_p.innerHTML = 'push';
        credits += currentbet;
        _credits.innerHTML = `credits: ${credits}`;
        displayResult();
        return;
    }
    _result_d.innerHTML = 'winner';
    _result_p.innerhtml = 'loser';
    displayResult();
}

//DEAL GAME

function dealGame(){
    reset();
    startPlay();

    //TAKE THE PLAYERS MONEY

    credits-=currentbet;
    _credits.innerHTML = `credits: ${credits}`;

    //BEGIN PLAY
    //SHUFFLE THE DECK

    _deck.shuffle();

    //DEAL EACH HAND

    for(let i=0; i < 2; i++){
        _player.hit();
        _dealer.hit();
    }
    _dealer.cards[0].facedown = true;
    displayHand(_dealer, _hand_d);
    displayHand(_player, _hand_p);

    //CHECK FOR BLACKJACK

    if(_player.score == 21){
        getWinner();
        placeBet();
    }

    //DISPLAY SCORES
    displayScore();
    displayScore();
}

//INIT
reset();
displayBet();
placeBet();