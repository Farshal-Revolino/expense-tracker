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
    // Background dot pattern seperti referensi
    <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-8 font-sans" 
         style={{ backgroundImage: 'radial-gradient(#e5e5e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header ala Neo-Brutalism */}
        <div className="text-center mb-10 pt-4">
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight uppercase">
            CATATAN <span className="bg-[#facc15] px-2 py-1 border-4 border-black shadow-brutal transform -skew-x-6 inline-block">KEUANGAN</span>
          </h1>
          <p className="text-xl font-bold mt-6 text-black">Kelola pemasukan dan pengeluaran Anda dengan cepat dan brutal.</p>
        </div>

        <BalanceCard income={income} expense={expense} balance={balance} />

        {/* Layout 2 Kolom */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pb-20">
          
          {/* Kolom Kiri: Form */}
          <div className="lg:col-span-5">
             <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* Kolom Kanan: Riwayat */}
          <div className="lg:col-span-7 bg-white border-4 border-black p-6 shadow-brutal h-fit w-full">
            <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
              <h3 className="text-2xl font-black uppercase tracking-wider text-black">Riwayat Transaksi</h3>
              <span className="font-bold bg-black text-white px-3 py-1 border-2 border-black">{transactions.length} ITEM</span>
            </div>
            
            {transactions.length === 0 ? (
              <div className="text-center py-16 border-4 border-dashed border-gray-300">
                <p className="text-xl font-bold text-gray-500 uppercase">Belum Ada Data</p>
              </div>
            ) : (
              <ul className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {transactions.slice(0).reverse().map((t, index) => (
                  <li key={t.ID} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-4 border-black bg-white shadow-brutal hover:bg-gray-50 transition-colors">
                    
                    <div className="flex flex-col mb-4 sm:mb-0 w-full sm:w-auto">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-black text-white font-black text-sm px-2 py-1 border-2 border-black">
                          {transactions.length - index}
                        </span>
                        <h4 className="font-black text-xl text-black uppercase">{t.title}</h4>
                      </div>
                      <p className="text-sm font-bold text-gray-600 uppercase tracking-widest pl-11">{t.category}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-11 sm:pl-0">
                      <span className={`text-xl font-black ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                        {t.type === 'expense' ? '-' : '+'} Rp {t.amount.toLocaleString('id-ID')}
                      </span>
                      <button 
                        onClick={() => handleDelete(t.ID)} 
                        className="bg-black text-white hover:bg-red-600 font-bold px-4 py-2 border-2 border-black active:scale-95 transition-transform"
                      >
                        HAPUS
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
  );
}

export default App;