/* BLACKJACK v2.0 */

//CLASSES

class Card{
    constructor(suit, rank){
        this.suit = suit;
        this.rank = rank;
    }
    get score(){
        switch(this.rank){
            case 'king':
            case 'queen':
            case 'jack':
            case '10':
                return 10;
            case '9':
            case '8':
            case '7':
            case '6':
            case '5':
            case '4':
            case '3':
            case '2':
                return parseInt(this.rank);
            case 'ace':
                return 1;
            default:
                return 0;
        }
    }
}
class Deck{
    constructor(){
        const ranks = ['ace','king','queen','jack','10','9','8','7','6','5','4','3','2'],
            suits = ['clubs', 'diamonds', 'spades', 'hearts'];
        this.cards = [];
        for(let s = suits.length-1; s >= 0; s--){
            for(let r = ranks.length - 1; r >=0; r--){
                this.cards.push(new Card(suits[s], ranks[r]));
            }
        }
    }
    shuffle(){
        for(let i = this.cards.length - 1; i >= 0; i--){
            let k = Math.floor(Math.random() * i);
            let temp = this.cards[k];
            this.cards[k] = this.cards[i];
            this.cards[i] = temp;
        }
    }
    draw(){
        let c = this.cards.pop();   //remove the last element and store it in a variable
        this.cards.unshift(c);          //place the last element at the beginning of the array
        return c;
    }
}
class Hand{
    constructor(){
        this.cards = [];
    }
    get score(){
        let score = 0;
        let aces = 0;
        for(let card of this.cards){
            if(card.rank == 'ace') aces++;
            score+=card.score;
        }
        if(aces && score <= 11)score += 10;
        return score;
    }
}

//CONTROLS
const controlsBet = [
    makeButton('bet one', 'buttonA', function(){bet = betOne(); document.getElementById('bet').innerHTML = `bet: ${bet}`}),
    makeButton('bet max', 'buttonB', function(){bet = betMax(); document.getElementById('bet').innerHTML = `bet: ${bet}`}),
    makeButton('clear bet', 'buttonC', function(){bet = 1; document.getElementById('bet').innerHTML = `bet: ${bet}`}),
    makeButton('deal', 'buttonD', dealGame)
];
const controlsPlay = [
    makeButton('hit', 'buttonA', hit),
    makeButton('double','buttonB', double),
    makeButton('', 'buttonC'),
    makeButton('stand', 'buttonD', stand)
];
//The C button doesn't have a function during the play phase, however we use it as filler to maintain consistency with the button layout.
controlsPlay[2].disabled = true;

function makeButton(text, id, action){
    let button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    button.innerHTML = text;
    button.addEventListener('click', action);
    return button;
}

//GAME PHASES
//PHASE 1 BET
const maxbet = 20;
let bet = 1, credits = 100;

function betOne(){
    let b = bet + 1;
    return b > betMax() ? betMax() : b;
}
function betMax(){
    return Math.min(maxbet, credits);
}
function phaseBet(){
    let controls = document.getElementById('controls');
    while(controls.firstChild){
        controls.removeChild(controls.firstChild);
    }
    for(let button of controlsBet){
        controls.appendChild(button);
    }
    if(bet > maxbet || bet > credits)bet = betMax();
    document.getElementById('bet').innerHTML = `bet: ${bet}`;
}
phaseBet();

//PHASE 2 DEAL
const dealer = new Hand,
    player = new Hand,
    deck = new Deck;

function dealGame(){
    //clear results
    let results = document.querySelectorAll('.result');
    for(let element of results){
        element.remove();
    }
    //clear controls
    let controls = document.getElementById('controls');
    while(controls.firstChild){
        controls.removeChild(controls.firstChild);
    }

    credits -= bet;
    document.getElementById('credits').innerHTML = `credits: ${credits}`;
    deck.shuffle();
    player.cards = [];
    dealer.cards = [];
    let i = 0;
    function animateDeal(){
        i++;
        if(i > 4){
            if(player.score == 21 && dealer.score < 21)return blackjack();
            if(dealer.score == 21)return stand();
            return phasePlay();
        }
        if(i % 2){
            //player
            player.cards.push(deck.draw());
            displayHand(player, document.querySelector('#player > .cards'));
            document.getElementById('score-player').innerHTML = `player: ${player.score}`;
        }else{
            //dealer
            dealer.cards.push(deck.draw());
            displayHand(dealer, document.querySelector('#dealer > .cards'));
            //keep the first card facedown
            let firstcard = document.querySelector('#dealer > .cards > .card');
            firstcard.className = 'card facedown';
            if(i < 4)firstcard.className += ' dealt';
            document.getElementById('score-dealer').innerHTML = `dealer: ??`;
        }
        setTimeout(animateDeal, 250);
    }
    animateDeal();
}

//PHASE 3 PLAY
function phasePlay(){
    let controls = document.getElementById('controls');
    for(let button of controlsPlay){
        controls.appendChild(button);
    }
}
function hit(){
    player.cards.push(deck.draw());
    displayHand(player, document.querySelector('#player > .cards'));
    document.getElementById('score-player').innerHTML = `player: ${player.score}`;
    if(player.score > 21)bust();
}
function double(){
    credits -= bet;
    document.getElementById('credits').innerHTML = `credits: ${credits}`;
    bet += bet;
    document.getElementById('bet').innerHTML = `bet: ${bet}`;
    hit();
    if(player.score <= 21) stand();
}
function stand(){
    function playdealer(){
        if(dealer.score < 17){
            dealer.cards.push(deck.draw());
            displayHand(dealer, document.querySelector('#dealer > .cards'));
            document.getElementById('score-dealer').innerHTML = `dealer: ${dealer.score}`;
        }else{
            return phaseResult();
        }
        setTimeout(playdealer, 250);
    }
    document.querySelector('.facedown').className = 'card';
    document.getElementById('score-dealer').innerHTML = `dealer: ${dealer.score}`;
    setTimeout(playdealer, 250);
}
//PHASE 4 RESULTS

function displayResult(ptext, pclass, dtext, dclass){
    let p = document.createElement('p'),
        d = document.createElement('p');
    p.className = 'result ' + pclass;
    p.innerHTML = ptext;
    document.getElementById('player').appendChild(p);

    if(dtext){
        d.className = 'result ' +dclass;
        d.innerHTML = dtext;
        document.getElementById('dealer').appendChild(d);
    }
}
function displayWinnings(winnings){
    //add the winnings to the credits in increments of 1 over a set period of time.
    //we need a callback function that we call in intervals.  then we'll clear that interval once its up.
    let w = winnings;
    //show our little winnings.

    let element = document.createElement('p');
    element.className = 'winnings';
    element.innerHTML = `+${w}`;
    document.querySelector('.credits').appendChild(element);
    element.addEventListener('animationend', () => {
        element.remove();
    });

    function stack(){
        if (w <= 0){
            clearInterval(stacker);
        }else{
            w--;
            credits++;
            document.getElementById('credits').innerHTML = `credits: ${credits}`;
        }
    }
    let stacker = setInterval(stack, 50);
}

function blackjack(){
    displayWinnings(bet*3);
    displayResult('blackjack','bj','loser','l');
    phaseBet();
}
function bust(){
    //Display BUST for the player.  The Dealer's hand and status remain hidden.
    displayResult('bust','bj');
    phaseBet();
}
function phaseResult(){
    //PUSH
    if(player.score == dealer.score){
        displayWinnings(bet);
        displayResult('push','l','push','l')
        return phaseBet();
    }
    //WIN
    if((player.score > dealer.score && player.score < 22) || dealer.score > 21){
        displayWinnings(bet*2);
        displayResult('winner','w','loser','l');
        return phaseBet();
    }
    //LOSE
    if(dealer.score == 21 && dealer.cards.length == 2){
        displayResult('loser','l','blackjack','bj');    //BJ LOSS
    }else{
        displayResult('loser','l','winner','w');    //NORMAL LOSS
    }
    phaseBet();
}
//DRAWING

function displayCard(card, facedown = false){
    const container = document.createElement('div');
    container.className = 'card';

    if(facedown == true){
        container.className = 'card facedown';
        return container;
    }

    const div = document.createElement('div'),  // The container for rank and suit_sm
        rank = document.createElement('p'),     // The rank of the card
        suit_sm = document.createElement('img'),// A small image of the suit
        suit_lg = document.createElement('img');// A large image of the suit

    rank.className = 'rank';
    div.appendChild(rank);
    div.appendChild(suit_sm);
    container.appendChild(div);
    container.append(suit_lg);

    //Check Rank
    switch(card.rank){
        case 'ace':
        case 'king':
        case 'queen':
        case 'jack':
            rank.innerHTML = card.rank[0].toUpperCase();
            break;
        default:
            rank.innerHTML = card.rank;
            break;  
    }
    //Check Suit
    //For each case change suit_sm and suit_lg
    switch(card.suit){
        case 'clubs':
            suit_sm.src = 'images/Suits_Club-Mini.png';
            suit_lg.src = 'images/Suits_Club.png';
            break;
        case 'diamonds':
            suit_sm.src = 'images/Suits_Diamond-Mini.png';
            suit_lg.src = 'images/Suits_Diamond.png';
            break;
        case 'spades':
            suit_sm.src = 'images/Suits_Spade-Mini.png';
            suit_lg.src = 'images/Suits_Spade.png';
            break;
        case 'hearts':
            suit_sm.src = 'images/Suits_Heart-Mini.png';
            suit_lg.src = 'images/Suits_Heart.png';
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
    (new_width > 140) ? element.className = 'cards expand' : element.className = 'cards';
    element.style.width = `${new_width}px`;
    for(let i=0; i<hand.length; i++){
        let cardelement = displayCard(hand[i]);
        let offset = i * 40;
        element.appendChild(cardelement);
        cardelement.style.left = `${offset}px`;
        if(i == hand.length - 1)cardelement.className += ' dealt';
    }
}