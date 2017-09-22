import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';

import '../style/App.css';

import Panel from './Panel.js';
import Control from './Control.js';

class App extends Component {
  render() {
    return <div>
             <Header id='title'
                     as='h1' textAlign='center'>
               Draw & Guess
             </Header>
             <Grid divided='vertically'
                   id='frame'>
               <Grid.Row columns={ 2 }>
                 <Grid.Column width={ 10 }>
                   <Panel host={ this } />
                 </Grid.Column>
                 <Grid.Column width={ 6 }>
                   <Control host={ this } />
                 </Grid.Column>
               </Grid.Row>
             </Grid>
           </div>;
  }
}

export default App;
