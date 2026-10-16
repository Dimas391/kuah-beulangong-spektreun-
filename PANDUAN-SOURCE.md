# Kari Kambing Cb Sp Ektreun

Website company profile kuliner Aceh berbahasa Indonesia. Desain terinspirasi situs Siha: foto lebar, hijau hutan, putih bersih, tipografi editorial, dan aksen rust yang terbatas.

## Menjalankan source
1. Instal Bun dan gunakan Node 22+ bila diperlukan oleh tooling.
2. Jalankan `bun install`.
3. Buat `.env` dari `.env.example`. Nilai publishable untuk browser dapat dilihat dalam konfigurasi proyek Lovable; jangan isi dengan service key.
4. Jalankan `bun run dev`. Buka alamat yang dicetak Vite.
5. Jalankan `bun run test` untuk tes. `bun run build` untuk menghasilkan aplikasi.

Aplikasi menggunakan React, TanStack Start, Tailwind v4, dan Lovable Cloud. Bukan Next.js atau aplikasi HTML statis. Pengaturan server Lovable mengisi kredensial server melalui lingkungan runtime. Jangan menyimpan kunci pribadi di source atau mengubahnya menjadi variabel berawalan VITE_. Untuk hosting mandiri, siapkan layanan data dan rahasia server milik Anda sesuai dokumentasi platform hosting. Kunci administratif Lovable Cloud tidak tersedia untuk diekspor.

## Halaman
- `/`: beranda
- `/menu`: kategori, pencarian menu, status ketersediaan, dan rincian pesanan
- `/cerita`: cerita tradisi kuah beulangong
- `/katering`: paket, kalkulator porsi, dan formulir pengajuan
- `/lokasi`: status toko, jam operasional, peta dan kontak
- `/galeri`: ilustrasi hidangan dan proses memasak
- `/jurnal`: catatan kuliner

## Mengelola isi (CMS)
Buka **Cloud → Database** pada editor Lovable:
- `menu_items`: ubah `price` (Rupiah), `available`, nama dan deskripsi. Harga kosong ditampilkan sebagai “Harga dikonfirmasi”.
- `restaurant_settings`: isi `whatsapp` dengan nomor internasional (62...), `address`, `maps_url`, `instagram_url`, `tiktok_url`, `opening_time`, `closing_time`, dan `seats`.
- `status`: `unconfirmed`, `open`, `closed`, atau `sold_out`. Status diatur pengelola, bukan dihitung dari jam buka. Informasi publik diperiksa ulang setiap 60 detik.
- `catering_requests`: pengajuan pelanggan, termasuk nama, nomor WhatsApp, tanggal, lokasi, jumlah porsi, paket dan catatan. Pengunjung tidak dapat membaca data ini.

Pemutakhiran dilakukan melalui Cloud oleh pengelola proyek, bukan halaman admin publik. Source memuat migrasi skema beserta katalog menu awal di `drizzle/migrations`.

## Pemesanan dan pengajuan
Jika nomor WhatsApp sudah diisi, tombol pemesanan membuka WhatsApp dengan pesan terisi. Sebelum nomor resmi tersedia, pelanggan hanya dapat menyalin rincian; pesanan belum dikirim. Clipboard yang diblokir akan menampilkan teks untuk disalin manual.

Formulir katering menyimpan data melalui fungsi server setelah validasi dan pembatasan frekuensi (5 pengajuan per identitas jaringan per jam). Pengajuan bukan konfirmasi pesanan. Data disimpan di `catering_requests`; email pengelola BELUM dikirim. Email membutuhkan paket berbayar, domain milik pengelola yang terverifikasi, alamat email penerima, serta pengaktifan notifikasi.

Kalkulator menggunakan 1 porsi/tamu, dengan pilihan cadangan 10%; kapasitas satu blangong belum diketahui sehingga tidak ditebak.

## Data yang belum diberikan
Harga asli, nomor WhatsApp, jam buka, pin Maps yang tepat, akun sosial, kapasitas, sejarah usaha, foto/video tempat asli, testimoni serta liputan media. Semuanya belum diisi atau ditampilkan sebagai belum dikonfirmasi. Peta saat ini pencarian nama/area, bukan koordinat resmi. Tidak ada testimoni, rating atau liputan palsu.

Foto yang disertakan adalah ilustrasi buatan AI, BUKAN foto lokasi atau makanan asli. Ganti dengan materi resmi sebelum menggunakannya sebagai dokumentasi. Detail fasilitas berasal dari brief dan kapasitasnya tetap perlu diverifikasi.

## Struktur utama
- `src/styles.css`: token dan desain global
- `src/components/restaurant.tsx`: navigasi, footer, katalog dan rincian pesanan
- `src/routes/`: halaman dengan metadata SEO terpisah
- `src/lib/restaurant.functions.ts`: pembacaan data publik dan penyimpanan katering
- `src/lib/restaurant-schema.ts`: validasi dan perhitungan porsi
- `src/integrations/`: koneksi Cloud yang dikelola platform
- `src/test/`: tes rute dan perhitungan

## Catatan penyerahan
ZIP tidak berisi `.git`, `node_modules`, hasil build, `.env`, kredensial server, atau data pengajuan pelanggan. Source ini perlu koneksi Cloud yang aktif untuk memuat halaman. Situs belum dipublikasikan. Tidak ada jaminan waktu muat ≤2 detik sebelum pengukuran pada perangkat/jaringan target dan deployment final.
