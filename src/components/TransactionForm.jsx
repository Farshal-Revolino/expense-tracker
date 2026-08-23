// client/src/components/TransactionForm.jsx
import { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (e) => {
    // Hanya ambil angka (hapus titik atau karakter lain)
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, amount: rawValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction({ ...formData, amount: parseFloat(formData.amount) || 0 });
    setFormData({ title: '', amount: '', type: 'expense', category: '' });
  };

  // Format angka dengan pemisah ribuan (titik untuk locale Indonesia)
  const displayAmount = formData.amount ? parseInt(formData.amount, 10).toLocaleString('id-ID') : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Input Transaksi Baru</h3>
        <p className="text-sm text-slate-500 mt-1">Catat aktivitas keuangan Anda</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Keterangan</label>
          <input type="text" name="title" required value={formData.title} onChange={handleInputChange} 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-800" 
            placeholder="Misal: Beli Kopi" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nominal (Rp)</label>
          <input type="text" name="amount" required value={displayAmount} onChange={handleAmountChange} 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-800" 
            placeholder="50.000" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe</label>
          <select name="type" value={formData.type} onChange={handleInputChange} 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-800 bg-white cursor-pointer">
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
          <input type="text" name="category" required value={formData.category} onChange={handleInputChange} 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-800" 
            placeholder="Misal: Makanan, Transport, dll" />
        </div>
        
        <button type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all mt-6 flex justify-center items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;