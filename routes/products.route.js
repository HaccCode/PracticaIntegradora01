import { Router } from "express";
import upload from "../utils/upload.middleware.js";

import ProductsDAO from "../dao/products.dao.js";"

const router = Router()
export default router

router.get("/", async (req, res) => {

    let withStock = req.query.stock;

    let products
    if(withStock === undefined){
        products = await ProductsDAO. getAllWithStock()
    }

    res.render("products", {products})

})

router.get("/new", (req, res) => {
    res.render("new-product")
})

router.get("/:id", async (req, res) => {
    
})