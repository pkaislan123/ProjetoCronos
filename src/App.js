import React from 'react'
import './styles/bulma.scss';
import './styles/global.scss';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import api from './services/api';
import Cookies from 'js-cookie';

import MinhaConta from './pages/MinhaConta';
import Login from './pages/Login';




function isAuthenticated() {
  var token = Cookies.get('token');
  console.log(typeof token)
  if (token === null || token === undefined || token === "undefined") {
    // This means that there's no JWT and no user is logged in.
    api.defaults.headers.common.Authorization = null;
    console.log("token invalido: ");
    return false;
  } else {
    // This means that there's a JWT so someone must be logged in.
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log("token valido, esta autenticado: " + token);
    return true;

  }
};












const PublicRoute = ({component: Component, ...rest}) => {
  return (
      // restricted = false meaning public route
      // restricted = true meaning restricted route
      <Route {...rest} render={props => (
        isAuthenticated() ?
              <Redirect to="/minhaconta" />
          : <Component {...props} />
      )} />
  );
};


const PrivateRoute = ({ component: Component, ...rest }) => {
  return (

    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} render={props => (
      isAuthenticated()  ?
        <Component {...props} />
        : <Redirect to="/login" />
    )} />
  );
};




function App() {


  return (

    <BrowserRouter>

      <Switch>
      
      <PublicRoute  component={Login} path="/login" exact />
      <PrivateRoute  component={MinhaConta} path="/minhaconta" exact />
      <PrivateRoute  component={MinhaConta} path="/" exact />
    


      </Switch>

    </BrowserRouter>

  );
}

export default App;
