import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContextProvider } from './appcontext';
import App from './app';

const root = document.getElementById('root');

ReactDOM.render(
    <AppContextProvider>
        <Router>
            <App {...(root.dataset)}/>
        </Router>
    </AppContextProvider>,
    root
);
