import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/LoadingSpinner';

export default function Transactions() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, sort });
      if (search) params.set('search', search);
      if (typeFilter) params.set('type', typeFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await api.get(`/transactions?${params}`);
      setTransactions(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, categoryFilter, sort]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/wallets')])
        .then(([c, w]) => { setCategories(c.data || []); setWallets(w.data || []); });
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await api.delete(`/transactions/${deleteItem.ID}`);
      toast.success('Transaction deleted');
      setDeleteItem(null);
      loadTransactions();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your income and expenses</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
          <option value="">All Categories</option>
          {[...new Set(categories.map(c => c.name))].map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {/* Transaction List */}
      {loading ? (
        <SkeletonList count={5} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description={search || typeFilter || categoryFilter ? 'Try adjusting your filters' : 'Start by adding your first transaction'}
          action={
            !search && !typeFilter && !categoryFilter && (
              <button onClick={() => { setEditItem(null); setShowForm(true); }} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                + Add Transaction
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.ID} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'expense' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={t.type === 'expense' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.category || 'Uncategorized'} · {formatDate(t.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${t.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditItem(t); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => setDeleteItem(t)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Prev
              </button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Transaction Form Modal */}
      <TransactionFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditItem(null); }}
        editItem={editItem}
        categories={categories}
        wallets={wallets}
        onSuccess={() => { setShowForm(false); setEditItem(null); loadTransactions(); }}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteItem?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}

function TransactionFormModal({ isOpen, onClose, editItem, categories, wallets, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    wallet_id: '',
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        title: editItem.title || '',
        amount: editItem.amount?.toString() || '',
        type: editItem.type || 'expense',
        category: editItem.category || '',
        date: editItem.date ? new Date(editItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: editItem.notes || '',
        wallet_id: editItem.wallet_id?.toString() || '',
      });
    } else {
      setForm({ title: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], notes: '', wallet_id: '' });
    }
    setErrors({});
  }, [editItem, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Amount must be greater than 0';
    if (!form.type) e.type = 'Type is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        wallet_id: form.wallet_id ? parseInt(form.wallet_id) : 0,
      };
      if (editItem) {
        await api.put(`/transactions/${editItem.ID}`, payload);
        toast.success('Transaction updated');
      } else {
        await api.post('/transactions', payload);
        toast.success('Transaction added');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === form.type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          {['expense', 'income'].map(t => (
            <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t, category: '' }))} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${form.type === t ? (t === 'expense' ? 'bg-red-600 text-white shadow' : 'bg-emerald-600 text-white shadow') : 'text-slate-500 dark:text-slate-400'}`}>
              {t === 'expense' ? 'Expense' : 'Income'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Amount (Rp)</label>
          <input type="number" min="0" step="any" value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${errors.amount ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} placeholder="0" />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border text-sm font-medium text-slate-900 dark:text-white outline-none transition-all ${errors.title ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} placeholder="e.g., Lunch at cafe" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
          <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border text-sm font-medium text-slate-900 dark:text-white outline-none transition-all appearance-none cursor-pointer ${errors.category ? 'border-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`}>
            <option value="">Select category</option>
            {filteredCategories.map(c => <option key={c.ID} value={c.name}>{c.name}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        {/* Date & Wallet */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border text-sm font-medium text-slate-900 dark:text-white outline-none transition-all ${errors.date ? 'border-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Wallet</label>
            <select value={form.wallet_id} onChange={(e) => setForm(f => ({ ...f, wallet_id: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer">
              <option value="">None</option>
              {wallets.map(w => <option key={w.ID} value={w.ID}>{w.name}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
          <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none" placeholder="Additional notes..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50">
            {loading ? 'Saving...' : editItem ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
