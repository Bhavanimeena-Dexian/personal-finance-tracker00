import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Filter, X, Info, Lightbulb } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment'],
  expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills']
};

const categoryIcons: Record<string, string> = {
  Food: '🍽️',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '📋',
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈'
};

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'Food'
  });

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('financeTracker');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('financeTracker', JSON.stringify(transactions));
  }, [transactions]);

  // Update category when type changes
  useEffect(() => {
    const newCategory = categories[formData.type][0];
    setFormData(prev => ({ ...prev, category: newCategory }));
  }, [formData.type]);

  const calculateStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Food'
    });
    setShowModal(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              💰 Finance Tracker
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-income/20">
                <TrendingUp className="text-income" size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Income</p>
                <p className="text-2xl font-bold text-income">
                  {formatAmount(stats.income)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-expense/20">
                <TrendingDown className="text-expense" size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Expenses</p>
                <p className="text-2xl font-bold text-expense">
                  {formatAmount(stats.expenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <DollarSign className="text-primary-glow" size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Balance</p>
                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatAmount(stats.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-muted-foreground" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === 'all' ? 'btn-primary' : 'btn-glass'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === 'income' ? 'btn-income' : 'btn-glass'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === 'expense' ? 'btn-expense' : 'btn-glass'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="glass-card p-6 animate-slide-up">
          <h2 className="text-xl font-bold mb-4 text-foreground">Recent Transactions</h2>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground text-lg">No transactions yet</p>
              <p className="text-muted-foreground">Start by adding your first transaction!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="glass-card p-4 animate-scale-in hover:scale-[1.02] transition-transform duration-200"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg category-${transaction.category.toLowerCase()}`}>
                        <span className="text-lg">
                          {categoryIcons[transaction.category] || '💰'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {transaction.description}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xl font-bold ${
                          transaction.type === 'income' ? 'text-income' : 'text-expense'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatAmount(transaction.amount)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 rounded-lg bg-expense/20 text-expense hover:bg-expense/30 transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to Use Instructions */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-primary-glow" size={24} />
            <h2 className="text-xl font-bold text-foreground">How to Use This App</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <div className="space-y-2">
              <p><span className="text-foreground font-medium">➕ Add Transactions:</span> Click "Add Transaction" to record income or expenses</p>
              <p><span className="text-foreground font-medium">🔍 Filter View:</span> Use All/Income/Expenses buttons to filter your transactions</p>
              <p><span className="text-foreground font-medium">📊 Track Balance:</span> Monitor your financial health with real-time balance updates</p>
            </div>
            <div className="space-y-2">
              <p><span className="text-foreground font-medium">🗂️ Categorize:</span> Organize transactions by category for better insights</p>
              <p><span className="text-foreground font-medium">🗑️ Delete:</span> Remove incorrect transactions using the trash icon</p>
              <p><span className="text-foreground font-medium">💾 Auto-Save:</span> Your data is automatically saved to your browser</p>
            </div>
          </div>
        </div>

        {/* Personal Finance Tips */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold text-foreground">Smart Finance Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">💡 Budgeting Basics</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
                <p>• Track every expense, no matter how small</p>
                <p>• Set monthly spending limits for each category</p>
                <p>• Review your expenses weekly to stay on track</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">🎯 Saving Strategies</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>• Build an emergency fund worth 6 months of expenses</p>
                <p>• Automate your savings - pay yourself first</p>
                <p>• Start investing early, even small amounts help</p>
                <p>• Compare prices before making large purchases</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">🚫 Avoid These Mistakes</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>• Don't ignore small recurring subscriptions</p>
                <p>• Avoid impulse buying - wait 24 hours for big purchases</p>
                <p>• Don't rely solely on credit cards</p>
                <p>• Never skip tracking your expenses</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">📈 Indian Finance Tips</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>• Invest in PPF and ELSS for tax savings</p>
                <p>• Use UPI and digital payments for better tracking</p>
                <p>• Consider SIPs in mutual funds for long-term wealth</p>
                <p>• Take advantage of cashback and reward programs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-card p-6 w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Add Transaction</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg bg-muted hover:bg-secondary transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    className="input-glass"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="input-glass"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        formData.type === 'income' ? 'btn-income' : 'btn-glass'
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        formData.type === 'expense' ? 'btn-expense' : 'btn-glass'
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="select-glass"
                  >
                    {categories[formData.type].map(category => (
                      <option key={category} value={category}>
                        {categoryIcons[category]} {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-glass flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}