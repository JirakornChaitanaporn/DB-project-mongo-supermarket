const dotenv = require('dotenv')

//import express from 'express';
const express = require('express');
const customerRouter = require('./routes/customer')
const employeeRouter = require('./routes/employee')
const roleRouter = require('./routes/role')

dotenv.config()
const port = process.env.EXPRESS_PORT || 5175;

const app = express()
app.use(customerRouter);
app.use(employeeRouter);
app.use(roleRouter);
// end-point
/*app.get('/test', (req, res) => {
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
    
})*/



// run express
app.listen(port, () => {
    console.log('Super market backend listening on port '+port);
})