const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {getAllCustomer, insertCustomer} = require('../controllers/customer') 

// create json parser
jsonParser = bodyParser.json();

router.get('/customer', getAllCustomer);
router.post('/customer', jsonParser, insertCustomer);

module.exports = router;