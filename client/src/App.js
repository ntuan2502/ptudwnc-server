import React from 'react';
import store from './myStore';
import TopBar from './components/topBar/TopBar';
import Home from './pages/Home';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Login from './pages/Login';
import history from './history';

const PrivateRoute = ({ component: Component, ...rest }) => 
(  
  <Route {...rest} render={props => 
  (
    store.getState().auth.isSignedIn ? <Component {...props} /> : <Redirect to={{pathname: '/login'}}/>
  )}/>
);

function App() {
  return (
    <Router history={history}>
      <TopBar />
        <Switch>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/login" exact>
            <Login />
          </Route>
        </Switch>
    </Router>
  )
}

export default App
