const readline = require("readline")
/*
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
*/
//const readline = require('readline');

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

class Card {
  constructor(value) {
    this.value = value;
  }
  getValue(){
    return this.value
  }
  min(value) {
    return this.value < value;
  }
  max(value) {
    return this.value > value;
  }
}
class Rank {
  constructor(value, amount) {
    this.cards = [];
    for (let i = 0; i < amount; i++) {
      let card = new Card(value);
      this.cards.push(card);
    }
  }
}
class Deck {
  constructor() {
    this.cards = [];
    let jester = new Rank(13, 2);
    let peasants = new Rank(12, 12);
    let stonecutter = new Rank(11, 11);
    let shepherdess = new Rank(10, 10);
    let cook = new Rank(9, 9);
    let mason = new Rank(8, 8);
    let seamstress = new Rank(7, 7);
    let knight = new Rank(6, 6);
    let abbess = new Rank(5, 5);
    let baroness = new Rank(4, 4);
    let earlMarshal = new Rank(3, 3);
    let archbishop = new Rank(2, 2);
    let dalmuti = new Rank(1, 1);
    let ranks = [
      jester,
      peasants,
      stonecutter,
      shepherdess,
      cook,
      mason,
      seamstress,
      knight,
      abbess,
      baroness,
      earlMarshal,
      archbishop,
      dalmuti,
    ];
    ranks.forEach((element) => {
      element.cards.forEach((e) => {
        this.cards.push(e);
      });
    });
  }
  shuffle() {
    //fisher-yares knuth
    let currentIndex = this.cards.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.cards[currentIndex], this.cards[randomIndex]] = [
        this.cards[randomIndex],
        this.cards[currentIndex],
      ];
    }
  }
  show() {
    this.cards.forEach((element) => {
      console.log(element.value);
    });
  }
  distribute(playerNumber) {
    //TODO ordenar las cartas de la mano
    let hands = [];
    let deck = [...this.cards];
    //console.log(deck)
    let cardsPerHand = deck.length / playerNumber;
    for (let i = 0; i < playerNumber; i++) {
      let cards = [];
      for (let j = 0; j < cardsPerHand; j++) {
        cards.push(deck.pop());
      }
      cards.sort((a,b)=>{return a.value-b.value})
      let newHand = new Hand(cards,i);

      //console.log(newHand)
      hands.push(newHand);
    }
    //console.log(hands)
    return hands;
  }
}

class Hand {
  constructor(cards, hand) {
    this.cards = cards;
    this.hand = hand;
  }
  checkThrow(indexes, pile) {
    // Check that the indexes are valid
    if (!indexes.every(index => index >= 0 && index < this.cards.length)) {
      console.log("Invalid index(es)!");
      return false;
    }

    // Check that the cards at the specified indexes can be thrown
    let canThrow = indexes.every(index => this.cards[index].canThrowOn(pile.topCard()));

    if (!canThrow) {
      console.log("Selected card(s) cannot be thrown on top of the pile!");
      return false;
    }

    // Return true if both checks pass
    return true;
  }
  throwIndex(indexes, pile) {
    
    indexes.sort();
    indexes = indexes.reverse();
    console.log(indexes)
    let cards = [];
    indexes.forEach((element) => {
      let card = this.cards.splice(element, 1);
      console.log(card[0])
      cards.push(card[0]);
    });
    console.log(this.cards)
    console.log(127,cards)
    let allEqual = (arr) => arr.every((v) => v.value === arr[0].value);
    if (allEqual(cards)) {
      pile.changeCard({
        cards,
        amount: cards.length,
        value: cards[0].value,
        hand: this.hand,
      });
    } else {
      let value = 0;
      let equal = false;
      cards.every((element) => {
        if (element.value === 13 && cards.length > 1) {
          equal = true;
        } else {
          if (value === 0) {
            value = element.value;
          } else if (value === element.value) {
            equal = true;
          } else {
            equal = false;
            return false;
          }
        }
      });
      pile.changeCard({ cards, amount: cards.length, value, hand: this.hand });
    }
  }
  throwValues() {}
  pass() {}
  goingOut() {
    return this.cards.length > 0;
  }
  show() {
    console.log("j");
    for (let index = 0; index < this.cards.length; index++) {
        const element = this.cards[index];
        console.log('('+index+')'+element.value)
        
    }
    this.cards.forEach((element) => {
      //console.log(element.value);
    });
  }
}

class Pile {
  constructor() {
    this.currentCards = {
      amount: 0,
      value: 0,
      hand: 0,
    };
  }
  show(){
    console.log(this.currentCards)
  }
  changeCard(card) {
    if (
      card.amount === this.currentCards.amount &&
      card.value < this.currentCards.value
    ) {
      this.currentCards = {...card};
      return true;
    } else if (this.currentCards.hand === card.hand) {
      this.currentCards = card;
      return true;
    } else {
      return false;
    }
  }
  reset() {}

}
/*
let p = new Pile();
const d = new Deck();
//d.show();
d.shuffle();
//d.show();
let h = d.distribute(5);
h[0].show()
rl.question('what cards are you throwing?',function(answer){
    let stringArray = answer.split(',')
    let intArray = []
    stringArray.forEach(element => {
        intArray.push(parseInt(element))
    });
    h[0].throwIndex(intArray,p)
    //console.clear()
    console.log(p.currentCards)
    rl.close()
})

h.forEach((element) => {
  //element.show()
});
*/
class Game {
  constructor() {
    this.players = [];
    this.deck = new Deck();
    this.pile = new Pile();
  }
  addPlayer(name) {
    let newPlayer = new Player(name);
    this.players.push(newPlayer);
  }
  start() {
    this.deck.shuffle();
    let hands = this.deck.distribute(this.players.length);
    for (let i = 0; i < this.players.length; i++) {
      let newPlayer = this.players[i];
      newPlayer.setHand(hands[i]);
    }
    this.play();
  }
  play() {
    let currentPlayer = 0;
    let playersRemaining = this.players.length;
    while (playersRemaining > 1) {
      let currentHand = this.players[currentPlayer].hand;
      console.log("Current hand: " + currentPlayer);
      currentHand.show();
      console.log("Current pile: ");
      this.pile.show();
      let input = prompt(
        "Choose cards to throw (separated by commas) or type 'pass': "
      );
      if (input.toString().toLowerCase() === "pass") {
        currentPlayer = (currentPlayer + 1) % this.players.length;
        continue;
      }
      let indexes = input.toString().split(",").map((index) => parseInt(index));
      let canThrow = currentHand.checkThrow(indexes, this.pile);
      if (canThrow) {
        currentHand.throw(indexes, this.pile);
        console.log("Player " + currentPlayer + " throws: ");
        this.pile.show();
        if (currentHand.goingOut()) {
          console.log("Player " + currentPlayer + " wins!");
          return;
        }
        currentPlayer = (currentPlayer + 1) % this.players.length;
        continue;
      }
      console.log("You can't throw those cards.");
    }
    console.log("Player " + currentPlayer + " wins!");
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.hand = null;
  }
  setHand(hand) {
    this.hand = hand;
  }
}

let game = new Game();
game.addPlayer("Alice");
game.addPlayer("Bob");
game.addPlayer("Charlie");
game.start();

