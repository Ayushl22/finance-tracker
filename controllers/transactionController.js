const Transaction = require('../models/Transaction');

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other']
};

exports.getDashboard = async (req, res) => {
  const userId = req.session.userId;
  
  const transactions = await Transaction.find({ userId })
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const allTransactions = await Transaction.find({ userId }).lean();
  
  const totalIncome = allTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = allTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  res.render('dashboard', {
    totalIncome,
    totalExpense,
    balance,
    transactions
  });
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ userId: req.session.userId })
    .sort({ date: -1 })
    .lean();
  res.render('transactions/index', { transactions });
};

exports.getNewTransaction = (req, res) => {
  res.render('transactions/new', { categories: CATEGORIES });
};

exports.postTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    await Transaction.create({
      amount: parseFloat(amount),
      type,
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      userId: req.session.userId
    });
    res.redirect('/transactions');
  } catch (err) {
    res.render('transactions/new', {
      categories: CATEGORIES,
      error: err.message
    });
  }
};

exports.getEditTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!transaction) {
    return res.redirect('/transactions');
  }

  res.render('transactions/edit', {
    transaction,
    categories: CATEGORIES
  });
};

exports.putTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      {
        amount: parseFloat(req.body.amount),
        type: req.body.type,
        category: req.body.category,
        description: req.body.description || '',
        date: req.body.date ? new Date(req.body.date) : new Date()
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.redirect('/transactions');
    }

    res.redirect('/transactions');
  } catch (err) {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.session.userId
    }).lean();
    res.render('transactions/edit', {
      transaction,
      categories: CATEGORIES,
      error: err.message
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.session.userId
  });
  res.redirect('/transactions');
};
