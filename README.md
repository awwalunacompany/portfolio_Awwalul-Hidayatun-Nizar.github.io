# Portfolio — Awwalul Hidayatun Nizar

Situs statis (HTML5, CSS3, JavaScript) tanpa build step.

## Struktur
- `index.html` — seluruh konten, SEO meta, Open Graph, Twitter Card, JSON-LD Person
- `styles.css` — desain, responsif, `prefers-reduced-motion`
- `main.js` — animasi, tab, dialog proyek, validasi form
- `CV-Awwalul-Hidayatun-Nizar.pdf`, `profile.webp`, `profile.jpg`, `favicon.svg`, `og-image.svg` — CV, foto profil, ikon, dan gambar Open Graph (semua di root, tanpa folder assets)
- `robots.txt`, `sitemap.xml`

## Sebelum dipublikasikan
1. **Domain.** Canonical, Open Graph, sitemap, dan robots memakai `https://awwalulhidayatunnizar.github.io/` (asumsi GitHub Pages dari username GitHub). Ganti jika domain berbeda (cari-ganti di `index.html`, `robots.txt`, `sitemap.xml`).
2. **Gambar Open Graph.** Platform sosial seperti Facebook/LinkedIn sering menolak SVG. Ekspor `og-image.svg` ke `og-image.png` (1200×630) lalu ubah URL di meta `og:image` dan `twitter:image`.
3. **Proyek.** Tombol GitHub Repository dan Live Demo menampilkan "Coming Soon". Saat tautan nyata tersedia, ganti elemen `.soon` pada dialog (`index.html`) dan tambahkan URL di `main.js`.
4. **Pratinjau proyek** adalah ilustrasi SVG konsep. Ganti dengan tangkapan layar asli (WebP/AVIF, `loading="lazy"`) bila tersedia.
5. **Form kontak** memvalidasi input lalu membuka aplikasi email pengunjung (`mailto:`). Untuk pengiriman langsung, sambungkan layanan form (mis. Formspree) di handler submit.
6. **Produksi.** Minifikasi CSS/JS, aktifkan HTTPS (otomatis di GitHub Pages).

## Menjalankan lokal
```
python3 -m http.server 8000
```
Lalu buka http://localhost:8000
