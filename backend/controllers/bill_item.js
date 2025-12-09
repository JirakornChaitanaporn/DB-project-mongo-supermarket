const { billItemSchema } = require('../schemas/bill_item');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllBillItem = async (req, res) => {
    const conn = createConnection();
    const BillItem = conn.model('BillItem', billItemSchema);
    const result = await BillItem.find({})

    conn.close();
    return res.json(result);
}

const insertBillItem = async (req, res) => {

    const conn = createConnection();
    const body = req.body
    const BillItem = conn.model('BillItem', billItemSchema);

    const new_doc = new BillItem(body);
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
    getAllBillItem,
    insertBillItem
}
