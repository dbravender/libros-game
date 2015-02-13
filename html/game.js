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
      childNodes.push(<CardList ref={type} cards={cards}/>);
    }
    return <div key="top"><ul key="list">{childNodes}</ul><button key="button" onClick={this.removeSelectedCards}>removeSelectedCards</button></div>;
  },
  removeSelectedCards: function () {
    var selectedCards = this.selectedCards();
    this.setProps({cards: this.props.cards.filter(function (card) { return selectedCards.indexOf(card.id) === -1; })})
  },
  selectedCards: function () {
    var refs = [];
    for (var ref in this.refs) {
      refs.push(this.refs[ref]);
    }
    var childNodeSelectedCards = [];
    for (var ref in refs) {
      var childNode = refs[ref];
      childNodeSelectedCards.push(childNode.selectedCards());
    }
    return [].concat.apply([], childNodeSelectedCards);
  }
});

var Card = React.createClass({
  getInitialState: function () {
    return {selected: false};
  },
  render: function () {
    return <div onClick={this.toggle} key={this.props.card.id} className={(this.state.selected ? 'selected' : '') + ' card ' + this.props.card.type + '-type'}>{this.props.card.value} {this.props.card.letter}</div>
  },
  toggle: function() {
    this.setState({selected: !this.state.selected})
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
      return <Card ref={card.id} key={card.id} card={card} />;
    });
    return (
      <li className="card-list">
        <span className={'card-summary badge ' + this.props.cards[0].type + '-type'}>
          {totalValue} {lowestLetter}
        </span>
        {' '}{cardNodes}
      </li>
    );
  },
  selectedCards: function () {
    var refs = [];
    for (var ref in this.refs) {
      refs.push(this.refs[ref]);
    }
    return refs.filter(function (cardNode) { return cardNode.state.selected; })
               .map(function (cardNode) { return cardNode.props.card.id; })
  }
});

var cards = [
  {value: 1, type: 'red', letter: 'A'},
  {value: 1, type: 'red', letter: 'B'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 1, type: 'red', letter: 'C'},
  {value: 2, type: 'blue', letter: 'B'},
  {value: 1, type: 'brown', letter: 'A'},
  {value: 1, type: 'green', letter: 'B'},
  {value: 1, type: 'orange', letter: 'C'},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
  {value: 2, type: 'gold', letter: null},
]

var id = 0;
for (var card in cards) {
  cards[card]['id'] = id++;
}

var gameView = React.renderComponent(
  <GameView/>,
  document.getElementById('card-list')
);
gameView.setProps({cards: cards});
