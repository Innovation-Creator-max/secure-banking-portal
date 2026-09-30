import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Search,
  Lock,
  LogOut,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  CreditCard,
  DollarSign,
  User,
  CheckCircle2,
  X
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard & Privacy State
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Interactive Transfer Modal State
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState('checking');
  const [toAccount, setToAccount] = useState('savings');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferError, setTransferError] = useState('');

  // Account Balances
  const [accounts, setAccounts] = useState({
    checking: {
      name: 'Total Checking',
      number: '4821',
      balance: 5420.50,
      type: 'Checking'
    },
    savings: {
      name: 'Premier Savings',
      number: '9102',
      balance: 12850.00,
      type: 'Savings'
    },
    credit: {
      name: 'Sapphire Preferred',
      number: '3319',
      balance: 412.30,
      type: 'Credit Card'
    }
  });

  // Transaction Logs
  const [transactions, setTransactions] = useState([
    { id: 1, date: 'Sep 29, 2026', description: 'Grocery Market', amount: -84.32, category: 'Food', account: 'checking' },
    { id: 2, date: 'Sep 28, 2026', description: 'Direct Deposit - Employer Inc', amount: 2450.00, category: 'Income', account: 'checking' },
    { id: 3, date: 'Sep 25, 2026', description: 'Electric & Power Utility', amount: -112.40, category: 'Utilities', account: 'checking' },
    { id: 4, date: 'Sep 22, 2026', description: 'Coffee House', amount: -6.50, category: 'Food', account: 'checking' },
    { id: 5, date: 'Sep 20, 2026', description: 'Interest Payment', amount: 15.20, category: 'Income', account: 'savings' }
  ]);

  // Handle Login Action
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== '' && password.trim() !== '') {
      setIsAuthenticated(true);
    }
  };

  // Handle Account Transfers
  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setTransferError('Please enter a valid transfer amount.');
      return;
    }

    if (fromAccount === toAccount) {
      setTransferError('Source and destination accounts must be different.');
      return;
    }

    if (accounts[fromAccount].balance < amountNum && fromAccount !== 'credit') {
      setTransferError('Insufficient funds in the selected source account.');
      return;
    }

    // Process State Update
    setAccounts(prev => {
      const updated = { ...prev };
      updated[fromAccount] = { ...updated[fromAccount], balance: updated[fromAccount].balance - amountNum };
      updated[toAccount] = { ...updated[toAccount], balance: updated[toAccount].balance + amountNum };
      return updated;
    });

    // Add Entry to Activity
    const newTx = {
      id: Date.now(),
      date: 'Today',
      description: `Transfer to ${accounts[toAccount].name}${transferMemo ? ' - ' + transferMemo : ''}`,
      amount: -amountNum,
      category: 'Transfer',
      account: fromAccount
    };

    setTransactions(prev => [newTx, ...prev]);
    setTransferSuccess(true);
    setTransferError('');

    setTimeout(() => {
      setTransferSuccess(false);
      setIsTransferOpen(false);
      setTransferAmount('');
      setTransferMemo('');
    }, 1500);
  };

  // Filter Transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Net Worth
  const totalAssets = accounts.checking.balance + accounts.savings.balance - accounts.credit.balance;

  // Unauthenticated Sign-In View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between font-sans">
        {/* Header */}
        <header className="bg-[#00529B] text-white py-4 px-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-wider uppercase text-white">CHASE</span>
            <span className="text-xs border-l border-blue-400 pl-2 text-blue-100 hidden sm:inline">Official Online Banking Portal</span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="hover:underline cursor-pointer">Commercial</span>
            <span className="hover:underline cursor-pointer">Customer Support</span>
          </div>
        </header>

        {/* Login Body */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-[#0A2540] text-white p-6 text-center">
              <h1 className="text-xl font-bold tracking-wide">Welcome to Chase Online</h1>
              <p className="text-xs text-blue-200 mt-1">Sign in to manage your accounts</p>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username or User ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#00529B] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#00529B] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="rounded text-[#00529B] focus:ring-[#00529B]" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="text-[#00529B] hover:underline font-semibold">Forgot User ID/Password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00529B] hover:bg-[#0A2540] text-white font-bold py-3 rounded transition-colors text-sm shadow"
              >
                Sign In
              </button>

              <div className="pt-4 border-t border-gray-100 flex justify-center items-center space-x-2 text-xs text-gray-500">
                <Shield className="w-4 h-4 text-green-600" />
                <span>256-Bit TLS Encryption Secured</span>
              </div>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
          <p>© 2026 JPMorgan Chase & Co. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-[#00529B] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-black tracking-wider uppercase text-white">CHASE</span>
              <div className="hidden md:flex space-x-4 text-sm font-medium">
                <button
                  onClick={() => setActiveTab('accounts')}
                  className={`px-3 py-2 rounded ${activeTab === 'accounts' ? 'bg-[#0A2540]' : 'hover:bg-blue-700'}`}
                >
                  Accounts Summary
                </button>
                <button
                  onClick={() => setActiveTab('pay')}
                  className={`px-3 py-2 rounded ${activeTab === 'pay' ? 'bg-[#0A2540]' : 'hover:bg-blue-700'}`}
                >
                  Pay & Transfer
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 text-blue-100 hover:text-white rounded hover:bg-blue-700 transition flex items-center space-x-1 text-xs"
              >
                {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{showBalances ? 'Hide Balances' : 'Show Balances'}</span>
              </button>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center space-x-1 bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good day, {username || 'Customer'}</h1>
            <p className="text-xs text-gray-500">Last sign in: Today at 09:15 AM WAT</p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setIsTransferOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#00529B] hover:bg-[#0A2540] text-white px-4 py-2.5 rounded font-semibold text-xs shadow transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer Money</span>
            </button>
          </div>
        </div>

        {/* Net Worth Tile */}
        <div className="bg-gradient-to-r from-[#00529B] to-[#0A2540] text-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">Total Estimated Net Liquid Assets</p>
              <h2 className="text-3xl font-extrabold mt-1">
                {showBalances ? `$${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
              </h2>
            </div>
            <DollarSign className="w-10 h-10 text-blue-300 opacity-50" />
          </div>
        </div>

        {/* Account Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Checking */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{accounts.checking.name}</h3>
                  <p className="text-xs text-gray-500">•••• {accounts.checking.number}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">Checking</span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-gray-500 block">Available Balance</span>
                <span className="text-2xl font-extrabold text-gray-900">
                  {showBalances ? `$${accounts.checking.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                </span>
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{accounts.savings.name}</h3>
                  <p className="text-xs text-gray-500">•••• {accounts.savings.number}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-green-50 text-green-700 rounded">Savings</span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-gray-500 block">Current Balance</span>
                <span className="text-2xl font-extrabold text-gray-900">
                  {showBalances ? `$${accounts.savings.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                </span>
              </div>
            </div>
          </div>

          {/* Credit Card */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{accounts.credit.name}</h3>
                  <p className="text-xs text-gray-500">•••• {accounts.credit.number}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded">Credit Card</span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-gray-500 block">Current Balance Due</span>
                <span className="text-2xl font-extrabold text-gray-900">
                  {showBalances ? `$${accounts.credit.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="font-bold text-gray-900 text-base">Recent Activity</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#00529B] focus:outline-none"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:ring-1 focus:ring-[#00529B] focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Income">Income</option>
                <option value="Utilities">Utilities</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">{tx.date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{tx.description}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {showBalances ? `${tx.amount > 0 ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}` : '••••'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      No matching activity found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsTransferOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-[#00529B]" />
              <span>Internal Account Transfer</span>
            </h2>

            {transferSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-gray-900">Transfer Completed Successfully</h3>
                <p className="text-xs text-gray-500">Your balances have been updated in real-time.</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4">
                {transferError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
                    {transferError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">From Account</label>
                  <select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#00529B] focus:outline-none"
                  >
                    <option value="checking">Total Checking (•••• {accounts.checking.number}) - ${accounts.checking.balance.toFixed(2)}</option>
                    <option value="savings">Premier Savings (•••• {accounts.savings.number}) - ${accounts.savings.balance.toFixed(2)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">To Account</label>
                  <select
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#00529B] focus:outline-none"
                  >
                    <option value="savings">Premier Savings (•••• {accounts.savings.number}) - ${accounts.savings.balance.toFixed(2)}</option>
                    <option value="checking">Total Checking (•••• {accounts.checking.number}) - ${accounts.checking.balance.toFixed(2)}</option>
                    <option value="credit">Sapphire Preferred (•••• {accounts.credit.number})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#00529B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Memo (Optional)</label>
                  <input
                    type="text"
                    placeholder="E.g., Monthly savings build"
                    value={transferMemo}
                    onChange={(e) => setTransferMemo(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#00529B] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsTransferOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00529B] hover:bg-[#0A2540] text-white rounded text-xs font-semibold shadow"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2026 JPMorgan Chase & Co. Member FDIC. Equal Housing Lender.</p>
      </footer>
    </div>
  );
}
