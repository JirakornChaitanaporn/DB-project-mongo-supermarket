const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { getAllProduct, insertProduct } = require('../controllers/product')

// create json parser
jsonParser = bodyParser.json();

router.get('/product', getAllProduct);
router.post('/product', jsonParser, insertProduct);

module.exports = router;
