//import express from 'express';
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()

// create json parser
jsonParser = bodyParser.json();

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
app.listen(5175, () => {
    console.log('Super market backend listening on port 5175');
})