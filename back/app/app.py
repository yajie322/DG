from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def decodeStrokes(strokes):
  return [[int(x) for x in s.split('|')] for s in strokes.split('-')]

@app.route('/guess')
def guess():
  # TODO RNN analysis
  return jsonify(['xin', 'zhao', 'wang'])         # Dummie return to test front-end functions

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')
