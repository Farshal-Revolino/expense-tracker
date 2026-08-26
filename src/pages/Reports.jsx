import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [year]);

  async function loadData() {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        api.get(`/reports/summary?year=${year}`),
        api.get(`/stats/by-category?type=expense&period=year`),
      ]);
      setSummary(sRes.data);
      setCategories(cRes.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  const chartData = summary?.months?.map((m, i) => ({
    name: MONTHS[i],
    income: m.income,
    expense: m.expense,
    net: m.income - m.expense,
  })) || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Financial overview and analytics</p>
        </div>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold outline-none">
          {[...Array(5)].map((_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Income</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.total_income)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Expenses</p>
              <p className="text-xl font-extrabold text-red-600 dark:text-red-400">{formatCurrency(summary.total_expense)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Cash Flow</p>
              <p className={`text-xl font-extrabold ${summary.net >= 0 ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(summary.net)}</p>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Monthly Income vs Expenses</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => v >= 1000000 ? (v/1000000).toFixed(0)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[4,4,0,0]} name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Net Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Net Cash Flow Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => v >= 1000000 ? (v/1000000).toFixed(0)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} name="Net" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          {categories.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Expenses by Category</h3>
              <div className="space-y-3">
                {categories.map((c, i) => {
                  const maxAmount = categories[0]?.amount || 1;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-slate-700 dark:text-slate-300 w-32 truncate font-medium">{c.category}</span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${(c.amount / maxAmount) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white w-28 text-right">{formatCurrency(c.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
