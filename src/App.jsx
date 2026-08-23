// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import BalanceCard from './components/BalanceCard';
import TransactionForm from './components/TransactionForm';

function App() {
  const [transactions, setTransactions] = useState([]);
  const API_URL = 'http://localhost:8080/transactions';

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleAddTransaction = async (newTransactionData) => {
    try {
      await axios.post(API_URL, newTransactionData);
      fetchTransactions();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 relative">
      {/* Beautiful Soft Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Latar belakang dasar */}
        <div className="absolute inset-0 bg-slate-50"></div>
        {/* Ornamen blur (Blob 1 - Biru) */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
        {/* Ornamen blur (Blob 2 - Ungu/Pink) */}
        <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-2000"></div>
        {/* Ornamen blur (Blob 3 - Hijau/Teal) */}
        <div className="absolute bottom-[-10%] left-[20%] w-[25rem] h-[25rem] bg-teal-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">FinTrack</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Ringkasan Keuangan</h2>
          <p className="text-slate-500 mt-1">Pantau arus kas Anda bulan ini</p>
        </div>

        <BalanceCard income={income} expense={expense} balance={balance} />

        {/* Layout 2 Kolom */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          
          {/* Kolom Kiri: Form */}
          <div className="lg:col-span-1">
             <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* Kolom Kanan: Riwayat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
              
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-lg font-semibold text-slate-800">Riwayat Transaksi</h3>
                <span className="text-sm font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {transactions.length} Transaksi
                </span>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-lg font-medium text-slate-600">Belum ada transaksi</p>
                    <p className="text-sm mt-1">Mulai catat pengeluaran atau pemasukan Anda.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {transactions.slice(0).reverse().map((t) => (
                      <li key={t.ID} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200">
                        
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {t.type === 'expense' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{t.title}</h4>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{t.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-14 sm:pl-0">
                          <span className={`font-semibold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            {t.type === 'expense' ? '-' : '+'} Rp {t.amount.toLocaleString('id-ID')}
                          </span>
                          <button 
                            onClick={() => handleDelete(t.ID)} 
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                            title="Hapus Transaksi"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;