import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Budgets() {
  const toast = useToast();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([api.get('/budgets'), api.get('/categories?type=expense')]);
      setBudgets(bRes.data || []);
      setCategories(cRes.data || []);
    } catch { toast.error('Failed to load'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try { await api.delete(`/budgets/${deleteItem.ID}`); toast.success('Budget deleted'); setDeleteItem(null); load(); }
    catch { toast.error('Failed'); }
  };

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Budgets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Set and track spending limits by category</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Add Budget
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Budget</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
          <p className="text-xl font-extrabold text-red-600 dark:text-red-400">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
          <p className={`text-xl font-extrabold ${totalBudget - totalSpent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(totalBudget - totalSpent)}</p>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : budgets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No budgets yet</p>
          <p className="text-xs text-slate-400">Create a budget to start tracking your spending</p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map(b => {
            const status = b.percent >= 100 ? 'exceeded' : b.percent >= 80 ? 'warning' : 'safe';
            return (
              <div key={b.ID} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 group hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status === 'exceeded' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{b.category}</h3>
                      <p className="text-xs text-slate-400 capitalize">{b.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status === 'exceeded' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : status === 'warning' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                      {status === 'exceeded' ? 'Exceeded' : status === 'warning' ? 'Warning' : 'On Track'}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditItem(b); setShowForm(true); }} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button onClick={() => setDeleteItem(b)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden mb-2">
                  <div className={`h-2.5 rounded-full transition-all ${status === 'exceeded' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, b.percent || 0)}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{formatCurrency(b.spent || 0)} spent</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(b.amount)} budget · {Math.round(b.percent || 0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Edit Budget' : 'Add Budget'}>
        <BudgetForm editItem={editItem} categories={categories} onClose={() => { setShowForm(false); setEditItem(null); }} onSuccess={() => { setShowForm(false); setEditItem(null); load(); }} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Budget" message={`Delete budget for "${deleteItem?.category}"?`} />
    </div>
  );
}

function BudgetForm({ editItem, categories, onClose, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: editItem?.category || '',
    amount: editItem?.amount?.toString() || '',
    period: editItem?.period || 'monthly',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) { toast.error('Category and amount required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editItem) {
        await api.put(`/budgets/${editItem.ID}`, payload);
        toast.success('Budget updated');
      } else {
        await api.post('/budgets', payload);
        toast.success('Budget created');
      }
      onSuccess();
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
        <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer">
          <option value="">Select category</option>
          {categories.map(c => <option key={c.ID} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Budget Amount (Rp)</label>
        <input type="number" min="0" value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="0" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Period</label>
        <select value={form.period} onChange={(e) => setForm(f => ({ ...f, period: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50">{loading ? 'Saving...' : editItem ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
