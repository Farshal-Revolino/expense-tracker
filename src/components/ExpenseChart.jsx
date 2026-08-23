// client/src/components/ExpenseChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function ExpenseChart({ transactions }) {
  // 1. Filter hanya transaksi pengeluaran (expense)
  const expenses = transactions.filter(t => t.type === 'expense');

  // 2. Kelompokkan dan jumlahkan pengeluaran berdasarkan kategori
  const dataMap = expenses.reduce((acc, curr) => {
    // Ubah kategori menjadi huruf kecil untuk konsistensi (misal: "Makanan" dan "makanan" jadi satu)
    const category = curr.category.toLowerCase();
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += curr.amount;
    return acc;
  }, {});

  // 3. Format data agar sesuai dengan struktur yang diminta Recharts [{name: 'Makan', value: 50000}, ...]
  const data = Object.keys(dataMap).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // Kapitalisasi huruf pertama
    value: dataMap[key]
  }));

  // Warna-warni untuk potongan pie chart
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

  // Fungsi untuk memformat angka di tooltip menjadi Rupiah
  const formatTooltip = (value) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full text-left">Distribusi Pengeluaran</h3>
      
      {data.length === 0 ? (
         <div className="flex-grow flex items-center justify-center text-gray-400 text-sm py-8">
           <p>Belum ada pengeluaran.</p>
         </div>
      ) : (
        <div className="w-full h-64"> {/* Tinggi tetap 64 (256px) agar tidak lonjong */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80} // Dikecilkan sedikit
                paddingAngle={5}
                dataKey="value"
                stroke="none" // Menghilangkan garis pinggir agar lebih bersih
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;