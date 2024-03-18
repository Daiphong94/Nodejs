const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const path = require('path');

// Cấu hình thư mục chứa views
const viewsDir = path.join(__dirname, '..', 'views');
router.use(express.static(viewsDir)); // Cho phép truy cập các file tĩnh trong thư mục views

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index.html', { products }); // Sử dụng file index.html trong thư mục views
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/addProduct', async (req, res) => {
    const { ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode } = req.body;
    
    try {
        const newProduct = new Product({
            ProductCode,
            ProductName,
            ProductDate,
            ProductOriginPrice,
            Quantity,
            ProductStoreCode
        });
        await newProduct.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/deleteProduct', async (req, res) => {
    const productId = req.body.productId;
    try {
        await Product.findByIdAndDelete(productId);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route để thêm một sản phẩm mới
router.post('/products', async (req, res) => {
    const { ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode } = req.body;
    
    try {
        const newProduct = new Product({
            ProductCode,
            ProductName,
            ProductDate,
            ProductOriginPrice,
            Quantity,
            ProductStoreCode
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad Request' });
    }
});

// Route để xóa một sản phẩm
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;