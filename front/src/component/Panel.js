/*
 * Panel
 * @author Xiao Xin <xin.xiao@hotmail.com>
 * Date: 09-23-17
 */

import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';

import config from '../config.json';

class Panel extends Component {
  constructor (props) {
    super(props);
    this.host = props.host;
    this.host.panel = this;
    this.startDrawing = this.startDrawing.bind(this);
    this.stopDrawing = this.stopDrawing.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.state = {
                   enabled: false,
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
    ['touchstart', 'mousedown'].forEach((e) => {
      canvas.addEventListener(e, this.startDrawing);
    });
    ['touchend', 'mouseup'].forEach((e) => {
      canvas.addEventListener(e, this.stopDrawing);
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.draw(e.touches[0].clientX, e.touches[0].clientY);
    });
    canvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      this.draw(e.clientX, e.clientY);
    });
    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
    this.context.beginPath();
  }

  startDrawing (e) {
    if (!this.state.enabled)
      return;
    this.setState({ isDrawing: true });
  }

  stopDrawing () {
    if (!this.state.enabled)
      return;
    let current = this.state.current;
    this.state.strokes.push(current);
    this.setState({
                    isDrawing: false,
                    current: [] 
                  });
  };

  encodeStroke () {
    let strokes = this.state.strokes;
    return strokes.map(stroke => stroke.join('|'))
                  .join('-');
  }

  draw (x, y) {
    if (this.state.isDrawing) {
      let currentX = x - this.canvasOffsetX;
      let currentY = y - this.canvasOffsetY;
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
  }

  drawStroke (stroke) {
    let context = this.context;
    for (let i = 2; i < stroke.length; i += 2) {
      context.moveTo(stroke[i - 2], stroke[i - 1]);
      context.lineTo(stroke[i], stroke[i + 1]);
      context.stroke();
    }
  }

  sendStroke (callback) {
    let url = 'http://' + config.host + ':' + config.port +
              '/guess?strokes=' + this.encodeStroke();
    fetch(url, { headers: { 'Access-Control-Allow-Origin':'*' } })
         .then(response => response.json().then(callback));
  }

  resizeCanvas () {
    this.refs.canvas.width = this.canvasFrame.clientWidth - 28;
    for (let i in this.state.strokes)
      this.drawStroke(this.state.strokes[i]);
  }

  clearCanvas () {
    this.refs.canvas.width = this.refs.canvas.width;
    this.context.beginPath();
    this.setState({
                    current: [],
                    strokes: []
                  });
  }

  

  render () {
    let enabled = this.state.enabled;
    let color = enabled ? 'green' : 'red';
    let text = enabled ? 'Drawing is enabled' :
                         'Drawing is disabled';
    return <Segment id='canvasFrame'>
             <Label ribbon 
                    color={ color }>
               { text }
             </Label>
             <div>
               <canvas ref='canvas' 
                       height={ 500 }/>
             </div>
           </Segment>;
  }
}

export default Panel;
