import React from 'react'
import {
  BrowserRouter as Router, Switch, Route, Link
} from 'react-router-dom'
import {Home} from './screens/home'
import {Admin} from './screens/admin'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/home'>
            <Home/>
          </Route>
          <Route path='/admin'>
            <Admin/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
