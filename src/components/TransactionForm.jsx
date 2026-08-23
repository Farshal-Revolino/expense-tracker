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

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction({ ...formData, amount: parseFloat(formData.amount) });
    setFormData({ title: '', amount: '', type: 'expense', category: '' });
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-brutal h-fit w-full">
      <div className="bg-black text-white p-3 mb-6 -mt-6 -mx-6 border-b-4 border-black flex justify-center">
        <h3 className="text-xl font-black uppercase tracking-wider">Input Transaksi</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">Keterangan</label>
          <input type="text" name="title" required value={formData.title} onChange={handleInputChange} 
            className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-0 focus:bg-gray-100 font-bold text-lg" 
            placeholder="MISAL: BELI KOPI" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">Nominal (Rp)</label>
          <input type="number" name="amount" required value={formData.amount} onChange={handleInputChange} 
            className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-0 focus:bg-gray-100 font-bold text-lg" 
            placeholder="50000" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">Tipe</label>
          <select name="type" value={formData.type} onChange={handleInputChange} 
            className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-0 focus:bg-gray-100 font-bold text-lg bg-white appearance-none cursor-pointer">
            <option value="expense">PENGELUARAN</option>
            <option value="income">PEMASUKAN</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">Kategori</label>
          <input type="text" name="category" required value={formData.category} onChange={handleInputChange} 
            className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-0 focus:bg-gray-100 font-bold text-lg" 
            placeholder="MAKANAN" />
        </div>
        
        <button type="submit" 
          className="w-full bg-[#facc15] hover:bg-yellow-300 text-black font-black uppercase tracking-widest py-4 border-4 border-black shadow-brutal active:shadow-brutal-hover active:translate-y-[2px] active:translate-x-[2px] transition-all mt-4">
          SIMPAN DATA
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;