export function formatCurrency(amount) {
  if (amount == null) return 'Rp 0';
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateInput(dateStr) {
  if (!dateStr) {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

export function parseCurrencyInput(value) {
  return value.replace(/\D/g, '');
}

export function displayCurrency(value) {
  const num = parseInt(value, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('id-ID');
}

export function getGreeting(name) {
  const h = new Date().getHours();
  let greet = 'Good evening';
  if (h >= 5 && h < 12) greet = 'Good morning';
  else if (h >= 12 && h < 17) greet = 'Good afternoon';
  else if (h >= 17 && h < 21) greet = 'Good evening';
  else greet = 'Good night';
  return name ? `${greet}, ${name}` : greet;
}

export function percentChange(current, prev) {
  if (!prev || prev === 0) return 0;
  return Math.round(((current - prev) / Math.abs(prev)) * 10000) / 100;
}
