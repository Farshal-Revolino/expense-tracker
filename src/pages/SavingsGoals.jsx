import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function SavingsGoals() {
  const toast = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [depositItem, setDepositItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.get('/savings-goals'); setGoals(res.data || []); }
    catch { toast.error('Failed to load'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try { await api.delete(`/savings-goals/${deleteItem.ID}`); toast.success('Goal deleted'); setDeleteItem(null); load(); }
    catch { toast.error('Failed'); }
  };

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Savings Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Set targets and track your savings progress</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Add Goal
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
        <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-2">Total Savings</p>
        <p className="text-3xl font-extrabold">{formatCurrency(totalSaved)}</p>
        <p className="text-xs text-emerald-200 mt-1">of {formatCurrency(totalTarget)} target</p>
        <div className="w-full bg-emerald-500/30 rounded-full h-2 mt-3 overflow-hidden">
          <div className="h-2 bg-white rounded-full transition-all" style={{ width: `${totalTarget > 0 ? Math.min(100, (totalSaved / totalTarget) * 100) : 0}%` }} />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : goals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" /></svg>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No savings goals yet</p>
          <p className="text-xs text-slate-400">Create a goal to start saving</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => {
            const pct = g.target_amount > 0 ? Math.min(100, (g.current_amount / g.target_amount) * 100) : 0;
            const remaining = Math.max(0, g.target_amount - g.current_amount);
            return (
              <div key={g.ID} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (g.color || '#059669') + '20' }}>
                    <svg className="w-5 h-5" fill="none" stroke={g.color || '#059669'} viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" /></svg>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setDepositItem(g)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-600" title="Deposit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </button>
                    <button onClick={() => { setEditItem(g); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => setDeleteItem(g)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{g.name}</h3>
                <p className="text-2xl font-extrabold mb-3" style={{ color: g.color || '#059669' }}>{formatCurrency(g.current_amount)}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden mb-2">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: g.color || '#059669' }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{Math.round(pct)}% of {formatCurrency(g.target_amount)}</span>
                  {remaining > 0 && <span className="text-slate-500">{formatCurrency(remaining)} left</span>}
                </div>
                {pct >= 100 && <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 text-center">Goal reached!</p>}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Edit Goal' : 'Add Goal'}>
        <GoalForm editItem={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} onSuccess={() => { setShowForm(false); setEditItem(null); load(); }} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Goal" message={`Delete "${deleteItem?.name}"?`} />
      <DepositModal isOpen={!!depositItem} goal={depositItem} onClose={() => setDepositItem(null)} onSuccess={() => { setDepositItem(null); load(); }} />
    </div>
  );
}

function GoalForm({ editItem, onClose, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: editItem?.name || '',
    target_amount: editItem?.target_amount?.toString() || '',
    current_amount: editItem?.current_amount?.toString() || '0',
    color: editItem?.color || '#059669',
  });
  const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.target_amount) { toast.error('Name and target required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount) || 0 };
      if (editItem) { await api.put(`/savings-goals/${editItem.ID}`, payload); toast.success('Goal updated'); }
      else { await api.post('/savings-goals', payload); toast.success('Goal created'); }
      onSuccess();
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g., New Laptop" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Target (Rp)</label>
          <input type="number" min="0" value={form.target_amount} onChange={(e) => setForm(f => ({ ...f, target_amount: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Saved (Rp)</label>
          <input type="number" min="0" value={form.current_amount} onChange={(e) => setForm(f => ({ ...f, current_amount: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Color</label>
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`} style={{ backgroundColor: c }} />
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

function DepositModal({ isOpen, goal, onClose, onSuccess }) {
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    setLoading(true);
    try {
      await api.post(`/savings-goals/${goal.ID}/deposit`, { amount: parseFloat(amount) });
      toast.success('Deposit successful');
      onSuccess();
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-modal-in">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Add Deposit</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{goal?.name}</p>
        <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 mb-4" placeholder="Amount (Rp)" />
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={handleDeposit} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all disabled:opacity-50">{loading ? 'Saving...' : 'Deposit'}</button>
        </div>
      </div>
    </div>
  );
}
