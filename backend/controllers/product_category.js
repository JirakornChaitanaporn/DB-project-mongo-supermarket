const { productCategorySchema } = require('../schemas/product_category');
const { getMongoErrorMsg } = require('../utils/mongo');
const { createConnection } = require('../utils/mongo')

const getAllProductCategory = async (req, res) => {
    const conn = createConnection();
    const ProductCategory = conn.model('ProductCategory', productCategorySchema);
    const result = await ProductCategory.find({})

    conn.close();
    return res.json(result);
}

const insertProductCategory = async (req, res) => {

    const conn = createConnection();
    const body = req.body
    const ProductCategory = conn.model('ProductCategory', productCategorySchema);

    const new_doc = new ProductCategory(body);
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
    getAllProductCategory,
    insertProductCategory
}
