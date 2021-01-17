/*const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/views')));
app.use(express.static(path.join(__dirname, '../frontend/js')));

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3030);

app.listen(app.get('port'), function() {
    console.log('Listening');
});*/

import 'reflect-metadata';
import 'source-map-support/register';
import 'ts-helpers';

import { Application } from './config/Application';
export default new Application();
