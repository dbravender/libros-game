/*jslint nomen: true*/
/*jslint indent: 2 */
/*global describe, it */
'use strict';

var libros = require('../libros/main.js');
var assert = require('assert');
var _ = require('lodash');

describe('deal', function () {
  it('should return the appropriate number of cards given the number of players', function () {
    assert.strictEqual(80, libros.deal(4).length);
    assert.strictEqual(72, libros.deal(3).length);
    assert.strictEqual(60, libros.deal(2).length);
    assert.strictEqual(87, libros.deal(4, 0, 0).length);
  });
  it('should have the appropriate cards in the deck', function () {
    var deck = libros.deal(4, 0, 0), colorDistribution;

    assert.deepEqual(_.range(87), _(deck).sortBy('id').pluck('id').value());

    colorDistribution = {
      'red': _.zip('ABCDEFGHI', _.repeat('1', 7) + _.repeat('2', 2)),
      'orange': _.zip('ABCDEFGHI', _.repeat('1', 7) + _.repeat('2', 2)),
      'green': _.zip('ABCDEFGHI', _.repeat('1', 7) + _.repeat('2', 2)),
      'blue': _.zip('ABCDEFGHI', _.repeat('2', 4) + _.repeat('3', 3) + _.repeat('4', 2)),
      'brown': _.zip('ABCDEFGHI', _.repeat('2', 4) + _.repeat('3', 3) + _.repeat('4', 2)),
    };

    _.forEach(colorDistribution, function (letterValues, color) {
      _.forEach(letterValues, function (letterValue) {
        var letter = letterValue[0], value = letterValue[1];
        assert.strictEqual(1, _.where(deck, {'letter': letter, 'value': parseInt(value, 10), 'color': color}).length);
      });
    });

    _.forEach(_.range(1, 4), function (goldValue) {
      assert.strictEqual(11, _.where(deck, {'letter': null, 'value': goldValue, 'color': 'gold'}).length);
    });

    _.forEach([-2, -1, 1, 2], function (changeValue) {
      assert.strictEqual(2, _.where(deck, {'letter': null, 'value': changeValue, 'color': 'change'}).length);
    });

    assert.strictEqual(1, _.where(deck, {'letter': null, 'value': 0, 'color': 'change'}).length);
  });
});

describe('player', function () {
  describe('scoreType', function () {
    it('should sum and determine the highest letter for a color', function () {
      var player = new libros.Player();
      player.cards = [{color: 'gold', value: 3, letter: null},
                      {color: 'green', value: 1, letter: 'A'},
                      {color: 'green', value: 2, letter: 'D'}];
      assert.deepEqual(player.scoreType('green'), [3, 'A']);
      assert.deepEqual(player.scoreType('gold'), [3, null]);
      assert.deepEqual(player.scoreType('red'), [0, null]);
    });
  });
});

/*
from libros.game import (
    deal, Game, Player,
    ACTIONS, ACTION_PILE_CARD, ACTION_SHOW_CARD,
    ACTION_TAKE_CARD, ACTION_DISCARD_CARD,
)


class TestGame(TestCase):
    def test_join(self):
        player1 = Player()
        player2 = Player()
        game = Game()
        game.join(player1)
        self.assertEqual(game.state, 'waiting')
        self.assertEqual(game.player_count, 1)
        game.join(player2)
        self.assertEqual(game.state, 'waiting')
        self.assertEqual(game.player_count, 2)
        game.start()
        self.assertEqual(game.state, 'turn')

    def _start_game(self, num_players=2):
        players = [Player() for i in range(num_players)]

        game = Game()

        for player in players:
            game.join(player)

        game.start()

        self.assertEqual(game.state, 'turn')
        self.assertEqual(game.player_count, num_players)

        return game, players

    def _player_turn(self, game, action=None):
        active_player = game.active_player

        player, card, valid_actions = game.turn()

        if action not in valid_actions:
            action = random.choice(valid_actions)

        action = player.act(card, action)

        self.assertIn(action, ACTIONS)
        self.assertEqual(player, active_player)

        return player, card, action

    def _assert_cards_count(self, game, check_player,
                            pile, public, discarded, player):
        self.assertEqual(len(game.pile), pile)
        self.assertEqual(len(game.public), public)
        self.assertEqual(len(game.discarded), discarded)
        self.assertEqual(len(check_player.cards), player)

    def test_pile_card(self):
        game, players = self._start_game()

        active_player = game.active_player

        self._assert_cards_count(
            game, active_player, pile=0, public=0, discarded=0, player=0)

        player, card, action = self._player_turn(game, ACTION_PILE_CARD)

        self.assertEqual(action, ACTION_PILE_CARD)
        self._as    def test_player_score(self):
        player = Player()
        player.cards = [{'type': 'gold', 'value': 3, 'letter': None},
                        {'type': 'green', 'value': 1, 'letter': 'A'},
                        {'type': 'green', 'value': 2, 'letter': 'D'}]
        self.assertEqual(player.score_type('green'), (3, 'A'))
        self.assertEqual(player.score_type('gold'), (3, None))
        self.assertEqual(player.score_type('red'), (0, None))sert_cards_count(
            game, active_player, pile=1, public=0, discarded=0, player=0)

    def test_show_card(self):
        game, players = self._start_game()

        active_player = game.active_player

        self._assert_cards_count(
            game, active_player, pile=0, public=0, discarded=0, player=0)

        player, card, action = self._player_turn(game, ACTION_SHOW_CARD)

        self.assertEqual(action, ACTION_SHOW_CARD)
        self._assert_cards_count(
            game, active_player, pile=0, public=1, discarded=0, player=0)

    def test_take_card(self):
        game, players = self._start_game()

        active_player = game.active_player

        self._assert_cards_count(
            game, active_player, pile=0, public=0, discarded=0, player=0)

        player, card, action = self._player_turn(game, ACTION_TAKE_CARD)

        self.assertEqual(action, ACTION_TAKE_CARD)
        self._assert_cards_count(
            game, active_player, pile=0, public=0, discarded=0, player=1)

    def test_discard_card(self):
        game, players = self._start_game()

        active_player = game.active_player

        self._assert_cards_count(
            game, active_player, pile=0, public=0, discarded=0, player=0)

        with patch.object(game, "deck") as fake_deck:
            change_card = {"type": "change", "letter": None, "value": 2}
            fake_deck.pop.return_value = change_card
            player, card, action = self._player_turn(game, ACTION_DISCARD_CARD)
            self.assertEqual(card, change_card)

        self.assertEqual(action, ACTION_DISCARD_CARD)
        self._assert_cards_count(
            game, active_player, pile=0, public=0, discarded=1, player=0)

    def test_game(self):
        game, players = self._start_game()

        active_player = game.active_player
        deck_count = game.deck_count
        self.assertIn(active_player, players)

        self.assertEqual(set(game.dice.values()), {3})

        for i in range(game.turns_per_player):
            player, card, action = self._player_turn(game)
            self.assertEqual(player, active_player)

        self.assertEqual(game.deck_count, deck_count - game.turns_per_player)

        self.assertEqual(game.public_count, game.player_count - 1)
        self.assertEqual(game.state, 'public')
        self.assertNotEqual(active_player, game.active_player)

        player, card, action = self._player_turn(game)

        self.assertNotEqual(active_player, player)
        self.assertEqual(game.turns_left, 3)

    def test_using_dice_change_cards(self):
        game, players = self._start_game()
        card = {'type': 'change', 'value': -1, 'letter': None}

        game.use_change_card(card, [])
        self.assertEqual(sum(game.dice.values()), 15)

        card['value'] = 2
        game.use_change_card(card, ['brown', 'red'])
        self.assertEqual(sum(game.dice.values()), 17)

        card['value'] = 0
        game.use_change_card(card, ['-blue'])
        self.assertEqual(sum(game.dice.values()), 16)

    def test_until_auction_phase_2_players(self):
        game, players = self._start_game(2)

        self.assertEqual(len(game.deck), 60)

        while game.state != 'auction':
            player, card, action = self._player_turn(game)

        player_cards = sum(len(p.cards) for p in players)

        self.assertEqual(game.public_count, 0)
        self.assertEqual(game.pile_count, 20)
        self.assertEqual(game.discarded_count + player_cards, 40)

        while game.state != 'end':
            player, card, action = self._player_turn(game)

        player_cards = sum(len(p.cards) for p in players)

        self.assertEqual(game.public_count, 0)
        self.assertEqual(game.pile_count, 0)
        self.assertEqual(game.discarded_count + player_cards, 60)

    def test_until_auction_phase_3_players(self):
        game, players = self._start_game(3)

        self.assertEqual(len(game.deck), 72)

        while game.state != 'auction':
            player, card, action = self._player_turn(game)

        player_cards = sum(len(p.cards) for p in players)

        self.assertEqual(game.public_count, 0)
        self.assertEqual(game.pile_count, 18)
        self.assertEqual(game.discarded_count + player_cards, 54)

        while game.state != 'end':
            player, card, action = self._player_turn(game)

        player_cards = sum(len(p.cards) for p in players)

        self.assertEqual(game.public_count, 0)
        self.assertEqual(game.pile_count, 0)
        self.assertEqual(game.discarded_count + player_cards, 72)

    def test_until_auction_phase_4_players(self):
        game, players = self._start_game(4)

        self.assertEqual(len(game.deck), 80)

        while game.state != 'auction':
            player, card, action = self._player_turn(game)

        player_cards = sum(len(p.cards) for p in players)

        self.assertEqual(game.public_count, 0)
        self.assertEqual(game.pile_count, 16)
        self.assertEqual(game.discarded_count + player_cards, 64)

        while game.state != 'end':
            player, card, action = self._player_turn(game)

        player_cards = sum(len(p.cards) for p in players)

        self.assertEqual(game.public_count, 0)
        self.assertEqual(game.pile_count, 0)
        self.assertEqual(game.discarded_count + player_cards, 80)

    def test_player_score(self):
        player = Player()
        player.cards = [{'type': 'gold', 'value': 3, 'letter': None},
                        {'type': 'green', 'value': 1, 'letter': 'A'},
                        {'type': 'green', 'value': 2, 'letter': 'D'}]
        self.assertEqual(player.score_type('green'), (3, 'A'))
        self.assertEqual(player.score_type('gold'), (3, None))
        self.assertEqual(player.score_type('red'), (0, None))

    def test_game_score(self):
        game, players = self._start_game(2)
        game.dice = {'green': 3, 'blue': 1, 'red': 1, 'orange': 1, 'brown': 1}
        players[0].cards = [{'type': 'green', 'value': 2, 'letter': 'D'},
                            {'type': 'blue', 'value': 3, 'letter': 'D'}]
        players[1].cards = [{'type': 'red', 'value': 1, 'letter': 'A'},
                            {'type': 'orange', 'value': 1, 'letter': 'A'},
                            {'type': 'brown', 'value': 3, 'letter': 'D'}]
        self.assertEqual(game.winner(), players[0])

    def test_game_score_gold_tiebreaker(self):
        game, players = self._start_game(2)
        game.dice = {'green': 2, 'blue': 1, 'red': 1, 'orange': 1, 'brown': 1}
        players[0].cards = [{'type': 'green', 'value': 2, 'letter': 'D'},
                            {'type': 'blue', 'value': 3, 'letter': 'D'},
                            {'type': 'gold', 'value': 2, 'letter': None}]
        players[1].cards = [{'type': 'red', 'value': 1, 'letter': 'A'},
                            {'type': 'orange', 'value': 1, 'letter': 'A'},
                            {'type': 'brown', 'value': 3, 'letter': 'D'},
                            {'type': 'gold', 'value': 3, 'letter': None}]
        self.assertEqual(game.winner(), players[1])

    def test_game_score_monk_tiebreaker(self):
        game, players = self._start_game(2)
        game.dice = {'green': 2, 'blue': 1, 'red': 1, 'orange': 1, 'brown': 1}
        players[0].cards = [{'type': 'green', 'value': 2, 'letter': 'D'},
                            {'type': 'brown', 'value': 2, 'letter': 'D'},
                            {'type': 'gold', 'value': 3, 'letter': None}]
        players[1].cards = [{'type': 'red', 'value': 1, 'letter': 'A'},
                            {'type': 'orange', 'value': 1, 'letter': 'A'},
                            {'type': 'blue', 'value': 3, 'letter': 'D'},
                            {'type': 'gold', 'value': 3, 'letter': None}]
        self.assertEqual(game.winner(), players[0])

    def test_game_score_orange_tiebreaker(self):
        game, players = self._start_game(3)
        game.dice = {'green': 2, 'blue': 1, 'red': 1, 'orange': 1, 'brown': 1}
        players[0].cards = [{'type': 'red', 'value': 2, 'letter': 'D'},
                            {'type': 'brown', 'value': 2, 'letter': 'B'},
                            {'type': 'gold', 'value': 3, 'letter': None}]
        players[1].cards = [{'type': 'orange', 'value': 3, 'letter': 'A'},
                            {'type': 'gold', 'value': 3, 'letter': None}]
        # player 2 should not be considered for the tie breaker because his
        # score was too low
        players[2].cards = [{'type': 'brown', 'value': 4, 'letter': 'C'}]
        self.assertEqual(game.winner(), players[1])
*/