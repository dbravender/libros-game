/** @jsx React.DOM */
'use strict';

var GameView = React.createClass({
  getInitialState: function() {
    return {state: 'discard', actionCard: null};
  },
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
    var bidComponent = null;
    if (this.state.state === 'bid') {
      bidComponent = <BidComponent actionCard={this.state.actionCard} minimumBid={this.state.minimumBid}/>;
    }
    for (var type in cardsByType) {
      var cards = cardsByType[type];
      childNodes.push(<CardList state={this.state.state} ref={type} cards={cards}/>);
    }
    var payButton = null;
    if (this.state.state === 'discard') {
      payButton = <button key="button" onClick={this.removeSelectedCards}>pay</button>;
    }
    return <div key="top">{bidComponent}<ul key="list">{childNodes}</ul>{payButton}</div>;
  },
  removeSelectedCards: function () {
    var selectedCards = this.selectedCards();
    alert(selectedCards);
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

var BidComponent = React.createClass({
  render: function () {
    var components = [<Card card={this.props.actionCard}/>, <button onClick={this.bid.bind(this, null)}>pass</button>];
    for (var i=this.props.minimumBid; i < 8 + this.props.minimumBid; i++) {
      components.push(<button onClick={this.bid.bind(this, i)}>{i}</button>);
    }
    return <div>{components}</div>;
  },
  bid: function (amount) {
    alert(amount);
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
    if (this.props.state !== 'discard') {
      return;
    }
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
      return <Card state={self.props.state} ref={card.id} key={card.id} card={card} />;
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

var gameView = React.render(
  <GameView/>,
  document.getElementById('card-list')
);
//gameView.setProps({cards: cards});
//gameView.setProps({minimumBid: 3, actionCard: {value: 4, type: 'blue', 'letter': 'A'}})
//gameView.setState({state: 'bid', minimumBid: 6, actionCard: {type: 'blue', value: 4, letter: 'A'}})

var namespace = '/libros';

var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

socket.on('connect', function() {
  socket.emit('join', {room: '1'});
});

socket.on('update', function (msg) {
  console.log(msg.data);
  gameView.setProps(JSON.parse(msg.data));
});
