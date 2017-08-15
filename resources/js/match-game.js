var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

/*
  Colors of the cards when they are display to find a match
 */
MatchGame.frontSideColors = [
  'hsl(25,85%,65%)',  // Front side color of card '1'
  'hsl(55,85%,65%)',  // Front side color of card '2'
  'hsl(90,85%,65%)',  // Front side color of card '3'
  'hsl(160,85%,65%)', // Front side color of card '4'
  'hsl(220,85%,65%)', // Front side color of card '5'
  'hsl(265,85%,65%)', // Front side color of card '6'
  'hsl(310,85%,65%)', // Front side color of card '7'
  'hsl(360,85%,65%)'  // Front side color of card '8'
];

/*
  Colors of the card's text when they are display to find a match
 */
MatchGame.textColor = 'rgb(255,255,255)';

/*
 Color of the back side of the cards
 */
MatchGame.backSideColor = 'rgb(32, 64, 86)';

/*
 Color of the front side of a matched card
 */
MatchGame.matchFrontSideColor = 'rgb(153, 153, 153)';

/*
 Color of the text of a matched card
 */
MatchGame.matchTextColor = 'rgb(204, 204, 204)';

/*
  Make that the card can be flipped by the user
 */
MatchGame.makeCardFlippable = function($card) {
    $card.click(function() {
        MatchGame.flipCard($(this));
    });
}

/*
 Make that the card can't be flipped by the user
 */
MatchGame.makeCardUnflippable = function($card) {
    $card.off('click');
}

/*
  Show a card to find a match
 */
MatchGame.showCard = function($card) {
  $card.html($card.data('value')); // show the text on the card
  $card.css('background-color', $card.data('color')); // set the front side color of the card
  $card.css('color', MatchGame.textColor); // set the text color of the card
  MatchGame.makeCardUnflippable($card); // the card can't be anymore flipped by user
}

/*
  Hide a card
 */
MatchGame.hideCard = function($card) {
  $card.css('background-color', MatchGame.backSideColor); // set the back side color of the card
  $card.empty(); // remove the text of the card
  MatchGame.makeCardFlippable($card); // the card can be again flipped by user
}

/*
 Set the look of the card when it has been matched
 */
MatchGame.setCardMatchFoundLook = function($card) {
  $card.css('background-color', MatchGame.matchFrontSideColor); // set the front side color of a matched card
  $card.css('color', MatchGame.matchTextColor); // set the text color of a matched card
  MatchGame.makeCardUnflippable($card); // the card can't be anymore flipped by user
}

/*
  Generates and returns an array of matching card values.
 */
MatchGame.generateCardValues = function () {
  var cardValues = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]; // The ordered card values
  // we toss the array
  for(var i = 0; i<1000; i++) {
      var pos1 = Math.floor(Math.random() * cardValues.length);
      var pos2 = Math.floor(Math.random() * cardValues.length);
      var tmp = cardValues[pos1];
      cardValues[pos1] = cardValues[pos2];
      cardValues[pos2] = tmp;
  }
  return cardValues; // we return the unordered card values
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/
MatchGame.renderCards = function(cardValues, $game) {
  MatchGame.$gameBoard = $game; // We maintain a reference to the game board
  $($game).empty(); // remove all existing cards for the game board
  for(var i=0; i<cardValues.length; i++) {
      // for each card value
	  var $card = $('<div class="card col-xs-3"></div>'); // we create a card object
      $card.data('value', cardValues[i] ); // we store the card value in the card
      $card.data('color', MatchGame.frontSideColors[cardValues[i]] ); // we store the card front face color in the card
	  MatchGame.hideCard($card); // we hide the card value to the user
	  $game.append($card);
  }
};

/*

 */
MatchGame.checkGameEnded = function () {
    var $cards = MatchGame.$gameBoard.find('.card'); // We get all the cards
    var $dummy = $('<div></div>');
    $dummy.css('background-color', MatchGame.matchFrontSideColor);
    var $matchedCards = $cards.filter(function(index) {
        return $(this).css('background-color') === $dummy.css('background-color');
    });
    console.log("cards : " + $cards.length);
    console.log("matchedCards : " + $matchedCards.length);
    return $matchedCards.length === $cards.length;
}

/*
  Bolean used to protect game logic processing if user click to quickly
 */
MatchGame.isFlippingCard = false;

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */
MatchGame.flipCard = function($card, $game) {
  if(MatchGame.isFlippingCard) return; // User click to quickly, we don't have finished to process previous click
  MatchGame.isFlippingCard = true; // We are processing the current click
  /*
    NB) We will store the pair data (i.e. the 2 cards in the MatchGame object
        in the following variables:

        MatchGame.$firstCard ==> the first card of the pair
        MatchGame.$secondCard ==> the second card of the pair
  */
  if(typeof MatchGame.$firstCard === 'undefined') {
      // it's the first card of a pair match
	  MatchGame.$firstCard = $card; // we store the first card to remember it
  } else {
      // it's the second card of a pair match
	  MatchGame.$secondCard = $card; // we store the second card to remember it
  }
  MatchGame.showCard($card); // we show the card to the user
  if(typeof MatchGame.$secondCard !== 'undefined') {
    // we have a pair but we need to check if they match
	if(MatchGame.$firstCard.data('value') === MatchGame.$secondCard.data('value')) {
	  // the two cards matches
      MatchGame.setCardMatchFoundLook(MatchGame.$firstCard); // we set the final look to the first card
      MatchGame.setCardMatchFoundLook(MatchGame.$secondCard); // we set the final look to the second card
      // we reset the pair data
      delete MatchGame.$firstCard;
      delete MatchGame.$secondCard;
      MatchGame.isFlippingCard = false; // We have finished processing the current click
      // We check if all the pairs has been found
      if(MatchGame.checkGameEnded()) {
          $('#GameEnded').modal("show");
      }
	}
    else {
	  // the two cards don't match
      window.setTimeout(function() {
		  MatchGame.hideCard(MatchGame.$firstCard); // we hide the first card to the user
		  MatchGame.hideCard(MatchGame.$secondCard); // we hide the second card to the user
          // we reset the pair data
		  delete MatchGame.$firstCard;
          delete MatchGame.$secondCard;
          MatchGame.isFlippingCard = false; // We have finished processing the current click
	    },750
      );
    }
  }
  else {
    // Click that select the first card ==> nothing more to do
    MatchGame.isFlippingCard = false; // We have finished processing the current click
  }
};

 /*
   Start the game
 */
$(document).ready(function() {
  $('.modal-footer .button').click(function() {
    MatchGame.renderCards(MatchGame.generateCardValues(), $('#GameBoard'));
    $('#GameEnded').modal('hide');
  });
  MatchGame.renderCards(MatchGame.generateCardValues(), $('#GameBoard'));
});
