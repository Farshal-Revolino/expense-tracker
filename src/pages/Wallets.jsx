import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const WALLET_TYPES = [
  { value: 'cash', label: 'Cash', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { value: 'bank', label: 'Bank Account', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { value: 'ewallet', label: 'E-Wallet', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { value: 'credit', label: 'Credit Card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export default function Wallets() {
  const toast = useToast();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.get('/wallets'); setWallets(res.data || []); }
    catch { toast.error('Failed to load'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try { await api.delete(`/wallets/${deleteItem.ID}`); toast.success('Wallet deleted'); setDeleteItem(null); load(); }
    catch { toast.error('Failed'); }
  };

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Wallets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your accounts and balances</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Add Wallet
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Balance</p>
        <p className="text-3xl font-extrabold">{formatCurrency(totalBalance)}</p>
        <p className="text-xs text-slate-400 mt-1">{wallets.length} account{wallets.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map(w => {
            const typeInfo = WALLET_TYPES.find(t => t.value === w.type) || WALLET_TYPES[0];
            return (
              <div key={w.ID} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-sm transition-all group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (w.color || '#059669') + '20' }}>
                    <svg className="w-5 h-5" fill="none" stroke={w.color || '#059669'} viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={typeInfo.icon} /></svg>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditItem(w); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => setDeleteItem(w)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{typeInfo.label}</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{w.name}</p>
                <p className="text-xl font-extrabold" style={{ color: w.color || '#059669' }}>{formatCurrency(w.balance)}</p>
              </div>
            );
          })}

          {/* Add Wallet Card */}
          <button onClick={() => { setEditItem(null); setShowForm(true); }} className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-400 transition-all min-h-[160px]">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span className="text-sm font-semibold">Add Wallet</span>
          </button>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Edit Wallet' : 'Add Wallet'}>
        <WalletForm editItem={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} onSuccess={() => { setShowForm(false); setEditItem(null); load(); }} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Wallet" message={`Delete "${deleteItem?.name}"? This cannot be undone.`} />
    </div>
  );
}

function WalletForm({ editItem, onClose, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: editItem?.name || '',
    type: editItem?.type || 'cash',
    balance: editItem?.balance?.toString() || '0',
    color: editItem?.color || COLORS[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, balance: parseFloat(form.balance) || 0 };
      if (editItem) {
        await api.put(`/wallets/${editItem.ID}`, payload);
        toast.success('Wallet updated');
      } else {
        await api.post('/wallets', payload);
        toast.success('Wallet created');
      }
      onSuccess();
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g., My Bank" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Type</label>
        <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer">
          {WALLET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Balance (Rp)</label>
        <input type="number" value={form.balance} onChange={(e) => setForm(f => ({ ...f, balance: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Color</label>
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50">{loading ? 'Saving...' : editItem ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
