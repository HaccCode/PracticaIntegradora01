import { Router } from "express";
import upload from "../utils/upload.middleware.js";

import ProductsDAO from "../dao/products.dao.js";

const router = Router();
export default router;

router.get("/", async (req, res) => {
  let withStock = req.query.stock;

  let products;
  if (withStock === undefined) {
    products = await ProductsDAO.getAll();
  } else {
    products = await ProductsDAO.getAllWithStock();
  }

  res.render("products", { products });
});

router.get("/new", (req, res) => {
  res.render("new-product");
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/products/");
  }

  res.render("products", {
    title: product.title,
    description: product.description,
    price: product.price,
    isStock: product.stock > 0,
    thumnails: product.thumbnails,
    category: product.category,
    code: product.code,
  });
});

router.post("/", upload.single("image"), async (req, res) => {
  let filename = req.file.filename;
  let product = req.body;

  await ProductDAO.add(
    product.title,
    product.description,
    product.price,
    product.stock,
    product.thumnails,
    product.category,
    product.code,
    filename
  );
  res.redirect("/products");
});
