/*
 * index
 * @author Xiao Xin <xin.xiao@hotmail.com>
 * Date: 09-23-17
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import registerServiceWorker from './registerServiceWorker'

import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
