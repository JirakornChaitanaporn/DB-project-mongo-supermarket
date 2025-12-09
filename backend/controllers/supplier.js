const { supplierSchema } = require('../schemas/supplier');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllSupplier = async (req, res) => {
    const conn = createConnection();
    const Supplier = conn.model('Supplier', supplierSchema);
    const result = await Supplier.find({})

    conn.close();
    return res.json(result);
}

const insertSupplier = async (req, res) => {

    const conn = createConnection();
    const body = req.body
    const Supplier = conn.model('Supplier', supplierSchema);

    const new_doc = new Supplier(body);
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
    getAllSupplier,
    insertSupplier
}
