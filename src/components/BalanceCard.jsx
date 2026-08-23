// client/src/components/BalanceCard.jsx

function BalanceCard({ income, expense, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Saldo Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Saldo</h3>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
          Rp {balance.toLocaleString('id-ID')}
        </p>
      </div>
      
      {/* Pemasukan Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pemasukan</h3>
        </div>
        <p className="text-2xl font-bold text-slate-800">
          Rp {income.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Pengeluaran Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pengeluaran</h3>
        </div>
        <p className="text-2xl font-bold text-slate-800">
          Rp {expense.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}

export default BalanceCard;