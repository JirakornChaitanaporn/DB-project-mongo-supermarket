//import express from 'express';
const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

dotenv.config()
const app = express()
const port = process.env.EXPRESS_PORT || 5175;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUrl = process.env.MONGO_URL;

// create json parser
jsonParser = bodyParser.json();

mongoose.connect("mongodb://"+mongoUsername+":"+mongoPassword+"@"+mongoUrl)

// end-point
app.get('/test', (req, res) => {
    return res.send("My Test end point 999")
})

app.get('/greeting', (req, res) => {
    const params = req.query;
    return res.send("Greeting my name is "+params.firstname+" "+params.lastname);
    //return res.json(req.query);
})

app.get('/search-prodct/:id', (req, res) => {
    return res.send(`My product id is ${req.params.id}`)
})

app.post('/create-product', jsonParser, (req, res) => {
    return res.json(req.body);
    
})

// run express
app.listen(port, () => {
    console.log('Super market backend listening on port '+port);
})