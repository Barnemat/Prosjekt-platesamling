import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Collection from './Collection.jsx';
import Example from './Example.jsx';

export default class Main extends React.Component {
  render() {
    return (
      <main>
          <Switch>
            <Route exact path='/' component={Collection} />
            <Route path='/example' component={Example} />
          </Switch>
      </main>
    );
  };
}
