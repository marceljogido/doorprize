# digiOH Event Doorprize App

Aplikasi doorprize digital untuk event digiOH yang dibangun dengan React dan TypeScript.

## Fitur

- Sistem doorprize digital dengan animasi menarik
- Banyak sesi doorprize 
- Grand prize dengan efek trophy rain
- Import data peserta dari file Excel
- UI yang responsif dan modern
- Integrasi Three.js untuk animasi 3D

## Teknologi yang Digunakan

- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Three.js untuk animasi 3D
- XLSX untuk membaca file Excel

## Cara Instalasi & Menjalankan

1. **Clone repository**
   ```bash
   git clone https://github.com/marceljogido/doorprize.git
   cd doorprize
   ```

2. **Install dependency**
   ```bash
   npm install
   ```

3. **Install Three.js (jika belum otomatis terinstall)**
   ```bash
   npm install three
   ```
   > Jika sudah ada di package.json, langkah ini bisa dilewati.

4. **Jalankan aplikasi**
   ```bash
   npm start
   ```

5. **Akses aplikasi**
   Buka browser ke [http://localhost:3000](http://localhost:3000)

## Struktur Proyek

```
src/
├── components/     # Komponen React
├── pages/          # Halaman aplikasi
├── context/        # Context API
├── routes/         # Konfigurasi routing
└── utils/          # Utility functions
public/             # Asset statis
package.json        # Dependencies dan scripts
```

## Catatan

- Pastikan Node.js & npm sudah terinstall di komputer Anda.
- Untuk pengembangan animasi, cek dokumentasi [Three.js](https://threejs.org/docs/).
- Untuk import data peserta, gunakan template Excel yang tersedia di folder `public/template/`.

