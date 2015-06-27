from gevent import monkey
monkey.patch_all()

from flask import Flask, render_template, request
from flask.ext.socketio import (
    SocketIO, emit, join_room, leave_room, close_room, disconnect
)
import json

from libros.game import Game, deal

app = Flask(__name__, static_url_path='')
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

games = {}


@app.route('/')
def root():
    return app.send_static_file('index.html')


@socketio.on('join', namespace='/libros')
def join(message):
    room = message['room']
    if room not in games:
        games[room] = Game()
        games[room].deck = deal(2)
    game = games[room]
    join_room(room)
    emit('update', {'data': json.dumps({'cards': game.deck})}, room=room)


if __name__ == '__main__':
    socketio.run(app)
