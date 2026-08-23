// client/src/components/BalanceCard.jsx

function BalanceCard({ income, expense, balance }) {
  return (
    <div className="bg-[#facc15] border-4 border-black p-8 rounded-none shadow-brutal flex flex-col md:flex-row justify-between items-center w-full max-w-4xl mx-auto mt-8 mb-12">
      <div className="text-center md:text-left mb-6 md:mb-0 w-full md:w-1/2">
        <h3 className="text-xl font-black text-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4 inline-block">TOTAL SALDO</h3>
        <p className="text-5xl font-black text-black tracking-tighter">
          Rp {balance.toLocaleString('id-ID')}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full md:w-1/2 justify-end">
        <div className="bg-white border-4 border-black p-4 shadow-brutal w-full sm:w-1/2 text-center">
          <h4 className="text-sm font-black text-black uppercase mb-2">PEMASUKAN</h4>
          <p className="text-2xl font-black text-green-600">Rp {income.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border-4 border-black p-4 shadow-brutal w-full sm:w-1/2 text-center">
          <h4 className="text-sm font-black text-black uppercase mb-2">PENGELUARAN</h4>
          <p className="text-2xl font-black text-red-600">Rp {expense.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;