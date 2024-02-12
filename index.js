const express = require('express');
const fs = require('fs/promises');
// const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

const validateFields = (req, res, next) => {
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send(`El campo ${field} es obligatorio.`);
        }
    }
    next();
};

const checkFilesExistence = async (req, res, next) => {
    try {
        await fs.access('productos.json');
    } catch (error) {
        await fs.writeFile('productos.json', '[]');
    }

    try {
        await fs.access('carrito.json');
    } catch (error) {
        await fs.writeFile('carrito.json', '[]');
    }

    next();
};

app.use(express.json());
app.use(checkFilesExistence);

const productsRouter = express.Router();
productsRouter.get('/', async (req, res) => {
    try {
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        const product = products.find((p) => p.id === productId);

        if (!product) {
            res.status(404).send('404 Not Found!!');
        } else {
            res.json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.post('/', validateFields, async (req, res) => {
    try {
        const newProduct = {
            id: uuidv4(),
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || [],
        };

        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        products.push(newProduct);

        await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        
        const productsData = await fs.readFile('productos.json', 'utf-8');
        let products = JSON.parse(productsData);
        const index = products.findIndex((p) => p.id === productId);
        const currentProduct = products[index];
        const updatedProduct = {
            id: productId,
            title: req.body.title || currentProduct.title,
            description: req.body.description || currentProduct.description,
            code: req.body.code || currentProduct.code,
            price: req.body.price || currentProduct.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock || currentProduct.stock,
            category: req.body.category || currentProduct.category,
            thumbnails: req.body.thumbnails || currentProduct.thumbnails || [],
        };
        if (index !== -1) {
            products[index] = updatedProduct;
            await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
            res.json(updatedProduct);
        } else {
            res.status(404).send('404 Not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const productsData = await fs.readFile('productos.json', 'utf-8');
        let products = JSON.parse(productsData);
        products = products.filter((p) => p.id !== productId);

        await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

        res.send('Producto eliminado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});
app.use('/api/products', productsRouter);

const cartsRouter = express.Router();
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = {
            id: uuidv4(),
            products: [],
        };

        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);
        carts.push(newCart);

        await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));

        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find((c) => c.id === cartId);

        if (!cart) {
            res.status(404).send('404 Not Found');
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        let carts = JSON.parse(cartsData);
        const cartIndex = carts.findIndex((c) => c.id === cartId);

        if (cartIndex !== -1) {
            const productIndex = carts[cartIndex].products.findIndex((p) => p.product === productId);

            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += quantity;
            } else {
                carts[cartIndex].products.push({ product: productId, quantity });
            }

            await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));

            res.json(carts[cartIndex]);
        } else {
            res.status(404).send('404 Not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
