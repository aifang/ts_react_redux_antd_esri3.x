import * as React from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import './App.css';

import reducer from './reducers'
import TodoApp from './view/todoApp';

let store = createStore(reducer)
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" component={TodoApp} />
            <Route path="/:initData" component={TodoApp} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
