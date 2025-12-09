const { billSchema } = require('../schemas/bill');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllBill = async (req, res) => {
    const conn = createConnection();
    const Bill = conn.model('Bill', billSchema);
    const result = await Bill.find({})

    conn.close();
    return res.json(result);
}

const insertBill = async (req, res) => {

    const conn = createConnection();
    const body = req.body
    const Bill = conn.model('Bill', billSchema);

    const new_doc = new Bill(body);
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
    getAllBill,
    insertBill
}
