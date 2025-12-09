const { productSchema } = require('../schemas/product');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllProduct = async (req, res) => {
    const conn = createConnection();
    const Product = conn.model('Product', productSchema);
    const result = await Product.find({})

    conn.close();
    return res.json(result);
}

const insertProduct = async (req, res) => {

    const conn = createConnection();
    const body = req.body
    const Product = conn.model('Product', productSchema);

    const new_doc = new Product(body);
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
    getAllProduct,
    insertProduct
}
