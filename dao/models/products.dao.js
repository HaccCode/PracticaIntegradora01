import Products from "../schemas/products.schema.js"

class ProductDAO {

    static async getAll() {
        return Products.find().lean()
    }

    static async getAllWIthStocks() {
        return Products.find({stock:{$gt:0}}).lean()
    }

    static async getById(id) {
        return Products.findOne({_id: id }).lean()
    }

    static async add(title, description, thumbnails, price, stock, code, category){
        return new Product({title, description, thumbnails, price, stock, code, category}).save()
    }

    static async update(id, data) {
        return Products.findOneAndUpdate({_id: id}, data)
    }

    static async remove(id) {
        return Products.findByIdAndDelete(id)
    }

}

export default ProductsDAO