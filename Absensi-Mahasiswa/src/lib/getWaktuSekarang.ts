export function getWaktuSekarang() {
  const now = new Date();

  // Konversi dari UTC ke WIB (+7 jam)

  const pad = (n: number) => n.toString().padStart(2, "0");

  const tahun = now.getFullYear();
  const bulan = pad(now.getMonth() + 1);
  const tanggal = pad(now.getDate());
  const jam = pad(now.getHours());
  const menit = pad(now.getMinutes());
  const detik = pad(now.getSeconds());

  const mysqlString = `${tahun}-${bulan}-${tanggal} ${jam}:${menit}:${detik}`;

  return {
    mysql: mysqlString,
    date: now,
  };
}
