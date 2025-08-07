# 📍 Aplikasi Pelaporan Jalan Rusak Kabupaten Garut

Repositori ini berisi **aplikasi web full-stack** untuk pelaporan jalan rusak di Kabupaten Garut, terdiri dari **frontend** dan **backend (Next.js API)**. Aplikasi ini ditujukan untuk mengakomodasi masyarakat melaporkan kondisi jalan rusak


## 🚀 Fitur Utama
### 🌐 Untuk Masyarakat
- Pelaporan jalan rusak berbasis lokasi
- Upload foto, deskripsi, dan kategori kerusakan
- Deteksi lokasi otomatis via GPS
- Peta (Leaflet.js)
- Riwayat laporan

### 🛠️ Untuk Admin
- Verifikasi laporan
- riwayat laporan
  
### 🛠️ Untuk Admin
- tindak lanjut laporan
- Tanggapan laporan via editor teks
- manajemen users


## 🧰 Teknologi yang Digunakan

### Frontend (`/frontend`)
- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Leaflet.js](https://leafletjs.com/) & React-Leaflet
- CKEditor 5 (editor teks tanggapan)
- Google OAuth (opsional login sosial)

### Backend (`/backend`)
- Express.js (atau Next.js API Routes)
- MongoDB / PostgreSQL
- JWT untuk autentikasi
- Multer (upload gambar)
- RESTful API

**⚙️ Instalasi & Menjalankan Proyek**
1. Clone repositori
   git clone https://github.com/Iki050901/Pelaporan-Jalan-Rusak.git
2. Menjalankan Backend
   - cd Backend
   - npm install 
   - npx prisma migrate reset
   - npm seed
   - pm2 start src/main.js --name lapor
3. Menjalankan Frontend
   - cd frontend
   - npm install
   - npm run dev

Frontend akan berjalan di **http://localhost:3000**

**🧑‍🎓 Tentang Proyek**

Judul Skripsi: Rancang Bangun Sistem Pelaporan Jalan Rusak Berbasis Web di Kabupaten Garut

Nama Mahasiswa: Rizki Saputra

Program Studi: Teknik Informatika

Universitas: Insitut Teknologi Garut

Tahun: 2025


**📜 Lisensi**

Proyek ini dikembangkan untuk keperluan akademik (Tugas Akhir/Skripsi).

**Tidak diperkenankan untuk penggunaan komersial tanpa izin**   
