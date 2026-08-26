import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { formatCurrency, formatDate, getGreeting } from '../utils/format';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
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
        <div className="h-8 bg-slate-200 dark:bg-white/[0.06] rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="hero-gradient rounded-2xl p-6 sm:p-8 -mx-4 md:-mx-8 -mt-4 md:-mt-2 px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{getGreeting(user?.name)}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here&apos;s your financial overview</p>
          </div>
          <div className="flex gap-1 glass rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  period === p.value
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Income" value={stats?.total_income} change={stats?.income_change} type="income" icon="M5 10l7-7m0 0l7 7m-7-7v18" />
        <StatCard label="Total Expenses" value={stats?.total_expense} change={stats?.expense_change} type="expense" icon="M19 14l-7 7m0 0l-7-7m7 7V3" />
        <StatCard label="Net Balance" value={stats?.balance} type={stats?.balance >= 0 ? 'income' : 'expense'} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
        <StatCard label="Wallet Balance" value={stats?.wallet_balance} type="neutral" icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 glass glass-hover rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Income vs Expenses</h3>
          {trend.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} stroke="#334155" />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} stroke="#334155" tickFormatter={(v) => v >= 1000000 ? (v/1000000).toFixed(0)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="income" fill="url(#gradientIncome)" radius={[4,4,0,0]} name="Income" />
                  <Bar dataKey="expense" fill="url(#gradientExpense)" radius={[4,4,0,0]} name="Expense" />
                  <defs>
                    <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="glass glass-hover rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Expense Breakdown</h3>
          {categories.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No expenses yet</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} stroke="none">
                      {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {(() => {
                  const total = categories.reduce((sum, c) => sum + c.amount, 0);
                  return categories.map((cat, i) => {
                    const pct = total > 0 ? (cat.amount / total * 100) : 0;
                    return (
                      <div key={cat.category} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{cat.category}</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatCurrency(cat.amount)}</span>
                          </div>
                          <div className="w-full bg-slate-200/50 dark:bg-white/[0.06] rounded-full h-1.5 mt-1 overflow-hidden">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass glass-hover rounded-2xl">
          <div className="px-5 py-4 border-b border-slate-200/50 dark:border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <button onClick={() => setCurrentTab('transactions')} className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 hover:underline">
              View All
            </button>
          </div>
          <div className="p-5">
            {transactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Start by adding your first transaction"
                action={
                  <button onClick={() => setCurrentTab('transactions')} className="text-sm font-semibold text-emerald-500 hover:text-emerald-600">
                    + Add Transaction
                  </button>
                }
              />
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div key={t.ID} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === 'expense' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d={t.type === 'expense' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{t.category || 'Uncategorized'} · {formatDate(t.date)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${t.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Budgets + Savings */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="glass glass-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Budget Overview</h3>
              <button onClick={() => setCurrentTab('budgets')} className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 hover:underline">
                View All
              </button>
            </div>
            {budgets.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No budgets set</p>
            ) : (
              <div className="space-y-3">
                {budgets.slice(0, 4).map((b) => (
                  <div key={b.ID}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{b.category}</span>
                      <span className="text-slate-400 dark:text-slate-500">{formatCurrency(b.spent)} / {formatCurrency(b.amount)}</span>
                    </div>
                    <div className="w-full bg-slate-200/50 dark:bg-white/[0.06] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${b.percent >= 100 ? 'bg-gradient-to-r from-red-500 to-red-400' : b.percent >= 80 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                        style={{ width: `${Math.min(100, b.percent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Savings Goals */}
          <div className="glass glass-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Savings Goals</h3>
              <button onClick={() => setCurrentTab('savings')} className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 hover:underline">
                View All
              </button>
            </div>
            {savingsGoals.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No goals yet</p>
            ) : (
              <div className="space-y-3">
                {savingsGoals.slice(0, 3).map((g) => {
                  const pct = g.target_amount > 0 ? Math.min(100, (g.current_amount / g.target_amount) * 100) : 0;
                  return (
                    <div key={g.ID}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{g.name}</span>
                        <span className="text-emerald-400 font-bold">{Math.round(pct)}%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, type, icon }) {
  const colorMap = {
    income: { text: 'text-emerald-400', icon: 'bg-emerald-500/15', glow: 'glow-emerald', gradient: 'from-emerald-500/10 to-emerald-500/5' },
    expense: { text: 'text-red-400', icon: 'bg-red-500/15', glow: 'glow-red', gradient: 'from-red-500/10 to-red-500/5' },
    neutral: { text: 'text-slate-200', icon: 'bg-white/[0.06]', glow: 'glow-slate', gradient: 'from-slate-400/10 to-slate-400/5' },
  };
  const c = colorMap[type] || colorMap.neutral;

  return (
    <div className={`glass glass-hover rounded-2xl p-5 ${c.glow} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center ${c.text}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xl font-extrabold ${c.text}`}>{formatCurrency(value)}</p>
      {change !== undefined && change !== 0 && (
        <div className="flex items-center gap-1 mt-2">
          <svg className={`w-3 h-3 ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d={change > 0 ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
          </svg>
          <span className={`text-xs font-bold ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{Math.abs(change)}%</span>
          <span className="text-xs text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
