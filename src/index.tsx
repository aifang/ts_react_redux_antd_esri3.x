import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// import reducer from './reducers'
// import TodoApp from './view/todoApp';

import OneMap, { reducer } from './view/oneMap';


//__REDUX_DEVTOOLS_EXTENSION__,搭配chrome redux devtools extension 使用
let store = createStore(reducer, window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']())

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={OneMap} />
        {/* <Route path="/todo" component={TodoApp} /> */}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
