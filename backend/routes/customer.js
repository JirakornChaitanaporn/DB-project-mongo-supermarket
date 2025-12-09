const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {getAllCustomer, getCustomerByID, getCustomerByFirstname, insertCustomer} = require('../controllers/customer') 

// create json parser
jsonParser = bodyParser.json();

router.get('/customer', getAllCustomer);
router.get('/customer-by-id/:id', getCustomerByID);
router.get('/customer-by-firstname/:firstname', getCustomerByFirstname)
router.post('/customer', jsonParser, insertCustomer);

module.exports = router;