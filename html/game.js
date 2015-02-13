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
    return <div key={this.props.card.id} className={'card ' + this.props.card.color + '-card'}>{this.props.card.value} {this.props.card.letter}</div>
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
        <span className="badge">{totalValue} {lowestLetter}</span>
        <div>{cardNodes}</div>
      </div>
    );
  }
});

var cards = [
  {value: 1, type: 'red', letter: 'A', 'id': 0},
  {value: 1, type: 'red', letter: 'B', 'id': 1},
  {value: 1, type: 'red', letter: 'C', 'id': 2},
  {value: 2, type: 'blue', letter: 'B', 'id': 3}
]

var gameView = React.renderComponent(
  <GameView/>,
  document.getElementById('card-list')
);
gameView.setProps({cards: cards});
