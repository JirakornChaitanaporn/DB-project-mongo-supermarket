const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');
const customerRouter = require('./routes/customer')
const employeeRouter = require('./routes/employee')
const roleRouter = require('./routes/role')
const productCategoryRouter = require('./routes/product_category')
const supplierRouter = require('./routes/supplier')
const productRouter = require('./routes/product')
const billRouter = require('./routes/bill')
const billItemRouter = require('./routes/bill_item')
const promotionRouter = require('./routes/promotion')

dotenv.config()
const port = process.env.EXPRESS_PORT || 5175;

const app = express()

// Add CORS middleware
app.use(cors());

// Add body parser middleware BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add routes
app.use(customerRouter);
app.use(employeeRouter);
app.use(roleRouter);

app.use(productCategoryRouter);
app.use(supplierRouter);
app.use(productRouter);
app.use(billRouter);
app.use(billItemRouter);
app.use(promotionRouter);
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
    console.log('Super market backend listening on port ' + port);
})