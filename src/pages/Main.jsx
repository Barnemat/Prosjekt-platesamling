import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Collection from './Collection';
import Register from './Register';
import Signin from './Signin';
import Signout from './Signout';
import User from './User';
import FindUser from './FindUser';
import PageNotFound from './PageNotFound';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Collection} />
      <Route path="/collection/:username" component={Collection} />
      <Route path="/register" component={Register} />
      <Route path="/signin" component={Signin} />
      <Route path="/user/:username" component={User} />
      <Route path="/find" component={FindUser} />
      <Route path="/signout" component={Signout} />
      <Route component={PageNotFound} />
    </Switch>
  </main>
);

export default Main;
