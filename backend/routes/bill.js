const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { getAllBill, insertBill } = require('../controllers/bill')

// create json parser
jsonParser = bodyParser.json();

router.get('/bill', getAllBill);
router.post('/bill', jsonParser, insertBill);

module.exports = router;
