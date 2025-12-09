const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { getAllBillItem, insertBillItem } = require('../controllers/bill_item')

// create json parser
jsonParser = bodyParser.json();

router.get('/bill_item', getAllBillItem);
router.post('/bill_item', jsonParser, insertBillItem);

module.exports = router;
