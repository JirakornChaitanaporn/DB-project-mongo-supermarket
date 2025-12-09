const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { getAllPromotion, insertPromotion } = require('../controllers/promotion')

// create json parser
jsonParser = bodyParser.json();

router.get('/promotion', getAllPromotion);
router.post('/promotion', jsonParser, insertPromotion);

module.exports = router;
