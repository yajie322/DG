/*
 * Control
 * @author Xiao Xin <xin.xiao@hotmail.com>
 * Date: 09-23-17
 */

import React, { Component } from 'react';
import { Label, Segment, Grid } from 'semantic-ui-react';

import '../style/Control.css';

const CONVERSATION = [ 'Hi, Welcome to the Draw & Guess Game!',
                       'Want to start now?',
                       'Yeeee, let\'s start the game!',
                       'Nope, not in the mood right now.',
                       'OK, let me know when you want to start.',
                       'Start the game, now!',
                       'Please draw an airplane, a cat, or a dog.',
                       'Let me know if you have finished or want to clear your current drawing',
                       'I\'m done with my drawing',
                       'Oops, I did something wrong. Please erase the whole thing',
                       'OK, let me guess...',
                       'All right, all erased, now you can start over',
                       'Yes!',
                       'No...',
                       'Hooray! Ain\'t I awesome!',
                       'Wanna start over to the next round?',
                       'Sorry I can\'t figure out your drawing :( ...'];
 

class Control extends Component {
  constructor (props) {
    super(props);
    this.panel = props.host.panel;
    this.state = { conversation: [] };
    this.start = this.start.bind(this);
  }

  componentDidMount () {
    this.start();
    this.control = document.getElementById('control');
  }

  componentDidUpdate () {
    this.scollToBottom();
  }

  dialog (i, disabled) {
    return <Grid.Row 
                     style={{ paddingTop: '0px' }}>
             <Label color='blue'>
               { CONVERSATION[i] }
             </Label>
           </Grid.Row>;
  }

  scollToBottom () {
    this.control.scrollTop = this.control.scrollHeight;    
  }

  action (i, todo) {
    return <Grid.Row 
                     textAlign='right'
                     style={{ paddingTop: '0px' }}>
             <Label color='red'
                    style={{ marginLeft: 'auto' }}
                    onClick={ todo }> 
               { CONVERSATION[i] }
             </Label>
           </Grid.Row>;
  }

  answer (text) {
    return <Grid.Row 
                     style={{ paddingTop: '0px' }}>
             <Label color='blue'>
               { 'I think you just drew ' + text }
             </Label>
           </Grid.Row>;
  }

  start () {
    this.panel.clearCanvas();
    let conversation = [0, 1].map(this.dialog);
    conversation.push(this.action(2, () => {
      conversation.pop();
      conversation.pop();
      conversation.push(this.action(2));
      this.draw();
    }));
    conversation.push(this.action(3, () => {
      conversation.pop();
      conversation.pop();
      conversation.push(this.action(3));
      conversation.push(this.dialog(4));
      conversation.push(this.action(5, () => {
        conversation.pop();
        conversation.push(this.action(5));
        this.draw();
      }));
      this.setState({ conversation: conversation });
    }));
    this.setState({ conversation: conversation });
  }

  draw () {
    this.panel.setState({ enabled: true });
    let conversation = this.state.conversation;
    conversation.push(this.dialog(6));
    conversation.push(this.dialog(7));
    conversation.push(this.action(8, () => {
      this.check();
    }));
    conversation.push(this.action(9, () => {
      this.panel.clearCanvas();
      conversation.pop();
      conversation.pop();
      conversation.push(this.action(9));
      conversation.push(this.dialog(11));
      this.draw();
    }));
    this.setState({ conversation: conversation });
  }

  check () {
    this.panel.setState({ enabled: false });
    let conversation = this.state.conversation;
    conversation.pop();
    conversation.pop();
    conversation.push(this.action(8));
    conversation.push(this.dialog(10));
    this.setState({ conversation: conversation });
    this.panel.sendStroke((result) => {
      this.round(0, result);
    });
  }

  round (i, result) {
    let conversation = this.state.conversation;
    if (i < result.length) {
      conversation.push(this.answer(result[i]));
      conversation.push(this.action(12, () => {
        conversation.pop();
        conversation.pop();
        conversation.push(this.action(12));
        conversation.push(this.dialog(14));
        conversation.push(this.dialog(15));
        conversation.push(this.action(12, this.start));
        this.setState({ conversation: conversation });
      }));
      conversation.push(this.action(13, () => {
        conversation.pop();
        conversation.pop();
        conversation.push(this.action(13));
        this.round(i + 1, result);
      }));
    } else if (i === result.length) {
        conversation.push(this.dialog(16));
        conversation.push(this.dialog(15));
        conversation.push(this.action(12, this.start));
        this.setState({ conversation: conversation });
    }
    this.setState({ conversation: conversation });
  }

  render () {
    return <Segment id='control'
                    style={{ overflow: 'scroll' }}>
             <Grid style={{ padding: '14px' }}>
               { this.state.conversation }
             </Grid>
           </Segment>;
  }
}

export default Control;
