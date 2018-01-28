import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Collection from './Collection';
import Example from './Example';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Collection} />
      <Route path="/example" component={Example} />
    </Switch>
  </main>
);

export default Main;
