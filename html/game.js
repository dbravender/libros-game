/** @jsx React.DOM */

var Card = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },
  render: function () {
    return <div key={this.props.card.id} className={'card ' + this.props.card.color + '-card'}>{this.props.card.value} {this.props.card.letter}</div>
  }
});

var CardList = React.createClass({
  getInitialState: function() {
    return {cards: []};
  },
  render: function() {
    var self = this;
    var totalValue = this.state.cards.reduce(function(x, y) {
      return x + y.value;
    }, 0);
    var lowestLetter = this.state.cards.reduce(function(x, y) {
      return [x, y.letter].sort()[0];
    }, null);
    var cardNodes = this.state.cards.map(function(card) {
      return <Card card={card} />;
    });
    return (
      <div className="card-list">
        <span class="badge">{totalValue} {lowestLetter}</span>
        <div>{cardNodes}</div>
      </div>
    );
  }
});

var cards = [
  {value: 1, color: 'red', letter: 'A', 'id': 0},
  {value: 1, color: 'red', letter: 'B', 'id': 1},
  {value: 1, color: 'red', letter: 'C', 'id': 2},
  {value: 2, color: 'blue', letter: 'B', 'id': 3}
]

var cardList = React.renderComponent(
  <CardList/>,
  document.getElementById('card-list')
);
cardList.setState({cards: cards});
