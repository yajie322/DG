from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/guess')
def guess():
  strokes = request.args.get('strokes')
  print strokes                           # Check if strokes have been correctly received
  # TODO RNN analysis
  return jsonify(['a', 'b', 'c'])         # Dummie return to test front-end functions

if __name__ == '__main__':
  app.run(debug=True)
