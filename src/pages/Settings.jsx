export default function Settings() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your application preferences</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Currency</p>
              <p className="text-xs text-slate-400">Indonesian Rupiah (IDR)</p>
            </div>
            <span className="text-sm text-slate-500">Rp</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Date Format</p>
              <p className="text-xs text-slate-400">How dates are displayed</p>
            </div>
            <span className="text-sm text-slate-500">DD MMM YYYY</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">App Version</p>
              <p className="text-xs text-slate-400">FinTrack Personal Finance</p>
            </div>
            <span className="text-sm text-slate-500">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
