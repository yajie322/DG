import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Control extends Component {
  constructor (props) {
    super(props);
    this.host = props.host;
    this.controlCanvas = this.controlCanvas.bind(this);
  }

  controlCanvas () {
    this.host.setState({ enabled: !this.host.state.enabled });
  }

  render () {
    let enabled = this.host.state.enabled;
    let text = enabled ? 'Disable' : 'Enable';
    return <Button onClick={ this.controlCanvas }>{ text }</Button>
  }
}

export default Control;
