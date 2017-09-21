import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class Panel extends Component {
  constructor (props) {
    super(props);
    this.host = props.host;
    this.state = {
                   isDrawing: false,
                   current: [],
                   strokes: []
                 };
  }

  componentDidMount () {
    let canvas = this.refs.canvas;
    let rect = canvas.getBoundingClientRect();
    this.canvasOffsetX = rect.left;
    this.canvasOffsetY = rect.top;
    this.canvasFrame = document.getElementById('canvasFrame');
    this.context = this.refs.canvas.getContext('2d');
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    canvas.addEventListener('mousedown', 
                            this.startDrawing.bind(this));
    canvas.addEventListener('mouseup', 
                            this.stopDrawing.bind(this));
    canvas.addEventListener('mousemove',
                            this.draw.bind(this));
    this.resizeCanvas();
  }

  startDrawing () {
    if (!this.host.state.enabled)
      return;
    this.setState({ isDrawing: true });
  }

  stopDrawing () {
    if (!this.host.state.enabled)
      return;
    let current = this.state.current;
    this.state.strokes.push(current);
    this.setState({
                    isDrawing: false,
                    current: [] 
                  });
  };

  draw (e) {
    if (!this.state.isDrawing)
      return;
    let currentX = e.clientX - this.canvasOffsetX;
    let currentY = e.clientY - this.canvasOffsetY;
    let stroke = this.state.current;
    if (stroke.length) {
      let lastX = stroke[stroke.length - 2];
      let lastY = stroke[stroke.length - 1];
      let context = this.context;
      context.moveTo(lastX, lastY);
      context.lineTo(currentX, currentY);
      context.stroke();
    }
    stroke.push(currentX);
    stroke.push(currentY);
  }

  drawStroke (stroke) {
    for (let i = 2; i < stroke.length; i += 2) {
      this.context.moveTo(stroke[i - 2], stroke[i - 1]);
      this.context.lineTo(stroke[i], stroke[i + 1]);
      this.context.stroke();
    }
  }

  resizeCanvas () {
    this.refs.canvas.width = this.canvasFrame.clientWidth - 28;
    for (let i in this.state.strokes)
      this.drawStroke(this.state.strokes[i]);
  }

  generateStatusBar () {
    let enabled = this.host.state.enabled;
    let color = enabled ? 'green' : 'red';
    let text = enabled ? 'Panel is enabled' :
                         'Panel is disabled';
    return <Segment color={ color }>{ text }</Segment>;
  }

  generateCanvas () {
    return <Segment id='canvasFrame'>
             <canvas ref='canvas' 
                     height={ 350 }/>
           </Segment>;
  }

  render () {
    return <div>
             { this.generateStatusBar() }
             { this.generateCanvas() }
           </div>;
  }
}

export default Panel;
