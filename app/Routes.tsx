import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import IndexPage from './containers/IndexPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.INDEX} component={IndexPage} />
      </Switch>
    </App>
  );
}
