"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("source-map-support/register");
require("ts-helpers");
var Application_1 = require("./config/Application");
exports.default = new Application_1.Application();
//# sourceMappingURL=server.js.map