var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

MatchGame.colors = [
  'hsl(25,85%,65%)',
  'hsl(55,85%,65%)',
  'hsl(90,85%,65%)',
  'hsl(160,85%,65%)',
  'hsl(220,85%,65%)',
  'hsl(265,85%,65%)',
  'hsl(310,85%,65%)',
  'hsl(360,85%,65%)'
];

MatchGame.showCard = function($card) {
  $card.html($card.data('value'));
  $card.css('background-color', $card.data('color'));
}

MatchGame.clearCard = function($card) {
  $card.css('background-color', 'rgb(32, 64, 86)');
  $card.empty();
}

MatchGame.setCardFinalState = function($card) {
  $card.css('background-color', 'rgb(153, 153, 153)');
  $card.css('color', 'rgb(32, 64, 86)');
  $card.off('click');
}

/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {
  return [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  $($game).empty();
  for(var i=0; i<cardValues.length; i++) {
	  var $item = $('<div class="card"></div>');
	  $item.data('value', cardValues[i] );
	  $item.data('color', MatchGame.colors[cardValues[i]] );
	  $item.click(function() {
		 MatchGame.flipCard($(this)); 
	  });
	  $game.append($item);
  }
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  if(typeof MatchGame.$firstCard === 'undefined') {
	  MatchGame.$firstCard = $card;
  } else {
	  MatchGame.$secondCard = $card;
  }
  MatchGame.showCard($card);
  if(typeof MatchGame.$secondCard !== 'undefined') {
	if(MatchGame.$firstCard.data('value') === MatchGame.$secondCard.data('value')) {
      MatchGame.setCardFinalState(MatchGame.$firstCard);
      MatchGame.setCardFinalState(MatchGame.$secondCard);
      delete MatchGame.$firstCard;
      delete MatchGame.$secondCard;
	}
    else {
      window.setTimeout(function() {
		  MatchGame.clearCard(MatchGame.$firstCard);
		  MatchGame.clearCard(MatchGame.$secondCard);
		  delete MatchGame.$firstCard;
          delete MatchGame.$secondCard;
	    },1000
      );
    }
  }
};

$(document).ready(function() {
  MatchGame.renderCards(MatchGame.generateCardValues(), $('#GameBoard'));}
);
