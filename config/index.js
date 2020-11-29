//i//mport express from 'express'
const express = require('express')
const path = require('path')
//import path from 'path'

// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

//const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = require('morgan')
var app = express();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app