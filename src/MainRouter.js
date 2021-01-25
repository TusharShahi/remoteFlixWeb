import React from 'react';
import App from './App';
import HelpBox from './HelpBox';
import { Route, Switch } from 'react-router-dom';

export const MainRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/help" component={HelpBox} />
                <Route path="/" component={App} />
            </Switch>
        </div>
    );
};