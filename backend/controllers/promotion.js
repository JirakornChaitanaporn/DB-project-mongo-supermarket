const { promotionSchema } = require('../schemas/promotion');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllPromotion = async (req, res) => {
    const conn = createConnection();
    const Promotion = conn.model('Promotion', promotionSchema);
    const result = await Promotion.find({})

    conn.close();
    return res.json(result);
}

const insertPromotion = async (req, res) => {

    const conn = createConnection();
    const body = req.body
    const Promotion = conn.model('Promotion', promotionSchema);

    const new_doc = new Promotion(body);
    const error = await new_doc.validateSync();

    if (error) {
        console.log(error.errors);
        return res.status(400).json({ msg: getMongoErrorMsg(error.errors) })
    }
    await new_doc.save();
    conn.close();

    return res.status(201).json(new_doc);
}

module.exports = {
    getAllPromotion,
    insertPromotion
}
