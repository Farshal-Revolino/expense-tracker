import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { formatCurrency, formatDate, getGreeting } from '../utils/format';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Dashboard({ setCurrentTab, user }) {
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  async function loadData() {
    setLoading(true);
    try {
      const [statsRes, trendRes, catRes, txRes, budRes, savRes] = await Promise.all([
        api.get(`/stats/summary?period=${period}`),
        api.get('/stats/monthly-trend?months=6'),
        api.get(`/stats/by-category?type=expense&period=${period}`),
        api.get('/transactions?limit=5'),
        api.get('/budgets'),
        api.get('/savings-goals'),
      ]);
      setStats(statsRes.data);
      setTrend(trendRes.data || []);
      setCategories(catRes.data || []);
      setTransactions(txRes.data?.data || []);
      setBudgets(budRes.data || []);
      setSavingsGoals(savRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-slate-200 dark:bg-white/[0.06] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Greeting */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {getGreeting(user?.name)}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back to FinTrack</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>

      {/* Main Bank Card (Balance) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-slate-900 shadow-xl shadow-blue-900/20 text-white p-6 sm:p-8">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <svg className="w-32 h-32 transform rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.26-.87-2.32-1.92H7.9c.1 1.7 1.4 2.85 3 3.22V19h2.33v-1.65c1.71-.34 2.93-1.4 2.93-2.93-.01-1.98-1.63-2.75-3.85-3.28z" /></svg>
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Total Net Balance</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatCurrency(stats?.balance || 0)}
            </h1>
            <p className="text-blue-300 text-xs mt-2 tracking-widest font-mono">**** **** **** {stats?.wallet_balance ? '1234' : '0000'}</p>
          </div>
          
          <div className="flex items-end justify-between mt-8">
            <div className="flex gap-6">
              <div>
                <p className="text-blue-200/80 text-[10px] uppercase tracking-wider mb-1">Income</p>
                <p className="text-sm font-semibold text-emerald-300">+{formatCurrency(stats?.total_income || 0)}</p>
              </div>
              <div>
                <p className="text-blue-200/80 text-[10px] uppercase tracking-wider mb-1">Expense</p>
                <p className="text-sm font-semibold text-red-300">-{formatCurrency(stats?.total_expense || 0)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200/80 text-[10px] uppercase tracking-wider mb-1">Wallet</p>
              <p className="text-sm font-semibold">{formatCurrency(stats?.wallet_balance || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (M-Banking Style) */}
      <div className="grid grid-cols-4 gap-4 px-2">
        <QuickAction icon="M12 4v16m8-8H4" label="Transaksi" color="bg-blue-500 text-white" onClick={() => setCurrentTab('transactions')} />
        <QuickAction icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" label="Top Up" color="bg-emerald-500 text-white" onClick={() => setCurrentTab('wallets')} />
        <QuickAction icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" label="Budget" color="bg-amber-500 text-white" onClick={() => setCurrentTab('budgets')} />
        <QuickAction icon="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" label="Analytics" color="bg-purple-500 text-white" onClick={() => setCurrentTab('reports')} />
      </div>

      {/* Area Chart: Financial Trend */}
      <div className="glass rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white">Financial Portfolio</h3>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  period === p.value
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        
        {trend.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No data available</div>
        ) : (
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => v >= 1000000 ? (v/1000000).toFixed(0)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                <Tooltip 
                  formatter={(v) => formatCurrency(v)} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} 
                  className="dark:!bg-slate-800 dark:!text-white"
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (Bank Statement Style) */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.05]">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <button onClick={() => setCurrentTab('transactions')} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              See All
            </button>
          </div>
          <div className="p-2">
            {transactions.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="No transactions yet"
                  description="Your recent activity will appear here"
                  action={
                    <button onClick={() => setCurrentTab('transactions')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Add Transaction
                    </button>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {transactions.map((t) => (
                  <div key={t.ID} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'expense' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d={t.type === 'expense' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.category || 'Transfer'} • {formatDate(t.date)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${t.type === 'expense' ? 'text-slate-900 dark:text-white' : 'text-emerald-500 dark:text-emerald-400'}`}>
                      {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="glass rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Expense by Category</h3>
          {categories.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No expenses yet</div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} stroke="none">
                      {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} className="dark:!bg-slate-800" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {categories.map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <div className="flex-1 flex justify-between items-center min-w-0">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-2">{cat.category}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatCurrency(cat.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-md group-hover:scale-105 transition-transform duration-200`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
    </button>
  );
}
