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
    hit(deck){
        //draw() a card from the Deck and add it to this instances hand
        let c = deck.draw();
        this.cards.push(c);
        this.score = tallyScore(this.cards);
        return c;
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
    dealerscore = 0,
    playerscore = 0;

//FUNCTIONS

//SCORING

function tallyScore(hand){ //returns the point value of a hand
    let score = 0;
    let aces = false;
    for(let card of hand){
        let cvalue = getScore(card);
        if(cvalue == 1) aces++;
        score += getScore(card);
    }
    if(aces > 0){
        if(score <= 11) score += 10;
    }
    return score;
}

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
const _helpbutton = document.querySelector('.help'), // HELP BUTTON
    _dscore = document.querySelector('#dealer > .score'), // DEALER SCORE ELEMENT
    _dhand = document.querySelector('#dealer > .cards'), // DEALER HAND ELEMENT
    _doutcome = document.querySelector('#dealer > .outcome'), // DEALER OUTCOME ELEMENT
    _pscore = document.querySelector('#player > .score'), // PLAYER SCORE ELEMENT
    _phand = document.querySelector('#player > .cards'), // PLAYER HAND ELEMENT
    _poutcome = document.querySelector('#player > .outcome'), // PLAYER OUTCOME ELEMENT
    _dealbutton = document.querySelector('.deal'), // DEAL BUTTON
    _buttonA = document.getElementById('a'), // BUTTON A
    _buttonB = document.getElementById('b'), // BUTTON B
    _buttonC = document.getElementById('c'), // BUTTON C
    _creditwin = document.querySelector('.win'), //DISPLAYS CREDITS WON
    _bet = document.getElementById('bet'), //DISPLAYS CURRENT BET
    _credits = document.getElementById('credits'); //DISPLAYS CURRENT CREDITS

// startBet() will begin the Betting phase.

function startBet(){
    //Change BUTTONS A,B, & C
    //CHANGE TEXT
    _buttonA.innerHTML = 'BET ONE';
    _buttonB.innerHTML = 'BET MAX';
    _buttonC.innerHTML = 'CLEAR BET';
    //REMOVE PLAY FUNCTIONS
    _buttonA.removeEventListener('click',hit);
    _buttonB.removeEventListener('click',stand);
    _buttonC.removeEventListener('click',doubleDown);
    //ATTACH BET FUNCTIONS
    _buttonA.addEventListener('click',betOne);
    _buttonB.addEventListener('click',betMax);
    _buttonC.addEventListener('click',betClear);
    //DISPLAY DEAL BUTTON
    _dealbutton.className = 'action deal';
    _dealbutton.addEventListener('click', newGame);
    //ENABLE BUTTON C
    _buttonC.disabled = false;
}

// startPlay() will begin the Playing phase.

function startPlay(){
    //Change BUTTONS A,B, & C
    //CHANGE TEXT
    _buttonA.innerHTML = "HIT";
    _buttonB.innerHTML = "STAND";
    _buttonC.innerHTML = "DOUBLE";
    //REMOVE BET FUNCTIONS
    _buttonA.removeEventListener('click',betOne);
    _buttonB.removeEventListener('click',betMax);
    _buttonC.removeEventListener('click',betClear);
    //ATTACH PLAY FUNCTIONS
    _buttonA.addEventListener('click',hit);
    _buttonB.addEventListener('click',stand);
    _buttonC.addEventListener('click',doubleDown);
    //HIDE DEAL BUTTON
    _dealbutton.className = 'action deal hidden';
    _dealbutton.removeEventListener('click', newGame);
    //HIDE OUTCOMES
    _doutcome.className = 'outcome hidden';
    _poutcome.className = 'outcome hidden';
    //HIDE CREDITS WON
    _creditwin.className = 'win hidden';
}

// displayCard

function displayCard(card){
    let container = document.createElement('div'); //The Card
    container.className = 'card';

    if(card.facedown == true){
        container.className = 'card facedown';
        return container;
    }

    let topleft = document.createElement('div'), //The Container for the Top Left Icons
        imgSmall = document.createElement('img'), //The Small image in the Top Left
        imgLarge = document.createElement('img'), //The Main image centered in the card
        sp = document.createElement('p'), //Small text in the Top Left
        lp = document.createElement('p'); //Main text bottom of card

    imgSmall.className = 'mini';
    container.appendChild(topleft);
    topleft.appendChild(sp);
    topleft.appendChild(imgSmall);
    container.appendChild(imgLarge);
    container.appendChild(lp);
        
    //Check Face Value (fvalue)
    //For each case you have to change (sp) and (lp)
    switch(card.fvalue){
        case 'Ace':
        case 'King':
        case 'Queen':
        case 'Jack':
            sp.innerHTML = card.fvalue[0];
            lp.innerHTML = card.fvalue;
            break;
        case '10':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Ten";
            break;
        case '9':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Nine";
            break;
        case '8':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Eight";
            break;
        case '7':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Seven";
            break;
        case '6':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Six";
            break;
        case '5':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Five";
            break;
        case '4':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Four";
            break;
        case '3':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Three";
            break;
        case '2':
            sp.innerHTML = card.fvalue;
            lp.innerHTML = "Two";
            break;
    }

    //Check Suit
    //For each case change imgSmall and imgLarge
    switch(card.suit){
        case 'Clubs':
            imgSmall.src = 'images/Suits-Mini-01.png';
            imgLarge.src = 'images/Suits-01.png';
            break;
        case 'Diamonds':
            imgSmall.src = 'images/Suits-Mini-02.png';
            imgLarge.src = 'images/Suits-02.png';
            break;
        case 'Spades':
            imgSmall.src = 'images/Suits-Mini-03.png';
            imgLarge.src = 'images/Suits-03.png';
            break;
        case 'Hearts':
            imgSmall.src = 'images/Suits-Mini-04.png';
            imgLarge.src = 'images/Suits-04.png';
            break;
    }
    //Return the card element:
    return container;
}

//UPDATE SCORE

function updateScore(hand){
    if(hand == _dscore)_dscore.innerHTML = `DEALER: ${_dealer.score}`;
    if(hand == _pscore)_pscore.innerHTML = `PLAYER: ${_player.score}`;
}

//DISPLAY OUTCOME

function displayOutcome(){
    _doutcome.className = 'outcome';
    _poutcome.className = 'outcome';
}

//CLEAR HANDS

function clearHands(){
    //REMOVE ALL CARDS
    _player.cards = [];
    _dealer.cards = [];
    while(_dhand.firstChild){
        _dhand.removeChild(_dhand.firstChild);
    }
    while(_phand.firstChild){
        _phand.removeChild(_phand.firstChild);
    }
    //MAKE SURE ALL CARDS IN THE DECK ARE FACEUP
    for(let card of _deck.deck){
        card.facedown = false;
    }
    //CLEAR SCORES
    _player.score = 0;
    _dealer.score = 0;
}

//PLAYER CONTROLS

//hit()
function hit(){
    _buttonC.disabled = true;
    let card = _player.hit(_deck);
    _phand.appendChild(displayCard(card));
    updateScore(_pscore);
    if(_player.busted){
        bust();
    }
    return card;
}
//stand()
function stand(){
    //shifts play from the player to the dealer
    //DISABLE PLAYER CONTROLS
    //REVEAL FACE DOWN CARD
    _dealer.cards[0].facedown = false;
    _dhand.replaceChild(displayCard(_dealer.cards[0]),_dhand.firstChild);
    //Dealer hits until they reach a soft 17
    while(_dealer.score < 17){
        let card = _dealer.hit(_deck);
        _dhand.appendChild(displayCard(card));
    }
    updateScore(_dscore);
    determineWinner();
    startBet();
}

//doubleDown()
function doubleDown(){
    credits -= currentbet;
    currentbet = currentbet * 2;
    _bet.innerHTML = currentbet;
    let doubled = hit();
    doubled.className += ' doubled';
    if(!_player.busted){
        stand();
    }else{
        bust();
    }
}
//betOne()
function betOne(){
    if(currentbet < _maxbet)currentbet++;
    _bet.innerHTML = currentbet;
}
//betMax()
function betMax(){
    if(credits < _maxbet){
        currentbet = credits;
    } else {
        currentbet = _maxbet;
    }
    _bet.innerHTML = currentbet;
}
//betClear()
function betClear(){
    currentbet = 1;
    _bet.innerHTML = currentbet;
}

//BUST

function bust(){
    _doutcome.innerHTML = `WINNER`;
    _poutcome.innerHTML = `BUST!`;
    displayOutcome();
    startBet();
}

//DETERMINE WINNER

function determineWinner(){
    let winnings = 0;
    //CHECK FOR BLACKJACK
    if(_player.score == 21 && _player.cards.length == 2 && _dealer.score != 21){
        winnings = currentbet * 3;
        _doutcome.innerHTML = `LOSER`;
        _poutcome.innerHTML = `BLACKJACK!`;
    }else if(_dealer.busted || (_player.score > _dealer.score)){ //PLAYER WINS
        winnings = currentbet*2;
        _credits.innerHTML = `${credits}`;
        _poutcome.innerHTML = `WINNER`;
        _doutcome.innerHTML = `LOSER`;
        if(_dealer.busted)_doutcome.innerHTML = `BUST!`;
    }else if(_dealer.score == _player.score){ //PUSH
        winnings = currentbet;
        _doutcome.innerHTML = `PUSH`;
        _poutcome.innerHTML = `PUSH`;
    }else{ //PLAYER LOSES
        _doutcome.innerHTML = `WINNER`;
        _poutcome.innerHTML = `LOSER`;
    }
    credits += winnings;
    _credits.innerHTML = credits;
    displayOutcome();
    if(winnings > 0){
        _creditwin.innerHTML = `WIN ${winnings}`;
        _creditwin.className = 'win';
    }
}

//NEW GAME

function newGame(){
    //HIDE VISUAL ELEMENTS

    clearHands();
    startPlay();
    
    //TAKE THE PLAYERS MONEY

    credits -= currentbet;
    _credits.innerHTML = credits;

    //BEGIN PLAY
    //SHUFFLE THE DECK

    _deck.shuffle();

    //DEAL EACH HAND

    for(let i = 0; i < 2; i++){
        console.log(i);
        _player.hit(_deck);
        _phand.appendChild(displayCard(_player.cards[i]));
        _dealer.hit(_deck);
        if(i == 0){
            _dealer.cards[i].facedown = true;
        }
        _dhand.appendChild(displayCard(_dealer.cards[i]));
    }

    //CHECK FOR BLACKJACK

    if(_player.score == 21){
        determineWinner();
        startBet();
    }

    //DISPLAY SCORES
    _dscore.innerHTML = 'DEALER: ???';
    updateScore(_pscore);
}

//INITIALIZE
//SETTING A FEW DEFAULT VALUES

_bet.innerHTML = currentbet;
_credits.innerHTML = credits;
startBet();