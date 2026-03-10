const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const isLoggedIn = require('../middleware/isLoggedIn');

// All transaction routes require authentication
router.use(isLoggedIn);

router.get('/', transactionController.getTransactions);
router.get('/new', transactionController.getNewTransaction);
router.post('/', transactionController.postTransaction);
router.get('/:id/edit', transactionController.getEditTransaction);
router.put('/:id', transactionController.putTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
