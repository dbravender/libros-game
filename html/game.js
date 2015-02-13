/** @jsx React.DOM */
'use strict';

var GameView = React.createClass({
  render: function () {
    var cardsByType = {};
    for (var card in this.props.cards) {
      var card = this.props.cards[card];
      var type = card.type;
      if (!cardsByType[type]) {
        cardsByType[type] = [];
      }
      cardsByType[type].push(card);
    }
    var childNodes = [];
    for (var type in cardsByType) {
      var cards = cardsByType[type];
      childNodes.push(<li key={type}><CardList cards={cards}/></li>);
    }
    return <ul>{childNodes}</ul>;
  }
});

var Card = React.createClass({
  getInitialState: function () {
    return {selected: false};
  },
  render: function () {
    return <div key={this.props.card.id} className={'card ' + this.props.card.type + '-type'}>{this.props.card.value} {this.props.card.letter}</div>
  }
});

var CardList = React.createClass({
  render: function () {
    var self = this;
    var totalValue = this.props.cards.reduce(function(x, y) {
      return x + y.value;
    }, 0);
    var lowestLetter = this.props.cards.reduce(function(x, y) {
      return [x, y.letter].sort()[0];
    }, null);
    var cardNodes = this.props.cards.map(function(card) {
      return <Card key={card.id} card={card} />;
    });
    return (
      <div className="card-list">
        <span className={'card-summary badge ' + this.props.cards[0].type + '-type'}>
          {totalValue} {lowestLetter}
        </span>
        {' '}{cardNodes}
      </div>
    );
  }
});

var cards = [
  {value: 1, type: 'red', letter: 'A', 'id': 0},
  {value: 1, type: 'red', letter: 'B', 'id': 1},
  {value: 1, type: 'red', letter: 'C', 'id': 2},
  {value: 1, type: 'red', letter: 'C', 'id': 3},
  {value: 1, type: 'red', letter: 'C', 'id': 4},
  {value: 1, type: 'red', letter: 'C', 'id': 5},
  {value: 1, type: 'red', letter: 'C', 'id': 6},
  {value: 1, type: 'red', letter: 'C', 'id': 7},
  {value: 1, type: 'red', letter: 'C', 'id': 8},
  {value: 1, type: 'red', letter: 'C', 'id': 9},
  {value: 1, type: 'red', letter: 'C', 'id': 10},
  {value: 1, type: 'red', letter: 'C', 'id': 11},
  {value: 1, type: 'red', letter: 'C', 'id': 12},
  {value: 1, type: 'red', letter: 'C', 'id': 13},
  {value: 2, type: 'blue', letter: 'B', 'id': 14},
  {value: 1, type: 'brown', letter: 'A', 'id': 15},
  {value: 1, type: 'green', letter: 'B', 'id': 16},
  {value: 1, type: 'orange', letter: 'C', 'id': 17},
  {value: 2, type: 'gold', letter: null, 'id': 18},
]

var gameView = React.renderComponent(
  <GameView/>,
  document.getElementById('card-list')
);
gameView.setProps({cards: cards});
