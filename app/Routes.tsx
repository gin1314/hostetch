import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
// import CounterPage from './containers/CounterPage';
import CardPage from './containers/CardPage';
import DefPage from './containers/DefPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={DefPage} />
        <Route path={routes.HOME} component={HomePage} />
        <Route path={routes.CARD} component={CardPage} />
        {/* <Route path={routes.DEF} component={DefPage} /> */}
      </Switch>
    </App>
  );
}
