const helpText = `
🤖 *PUSAT BANTUAN*

Berikut semua perintah yang tersedia:

🌋 *Info Bencana*
\`/quake\` - Data gempa terkini dari BMKG

💫 *Kutipan Inspirasi*
\`/quote\` - Kutipan motivasi random

💰 *Cryptocurrency*
\`/crypto\` - Harga aset crypto terpopuler

📈 *Pasar Saham*
\`/asset\` - Indeks saham Indonesia

📱 *Berita Teknologi*
\`/berita\` - Berita tech terkini

👥 *Random Profile*
\`/RandomUser\` - Data user acak

🌤️ *Prakiraan Cuaca*
\`/cuaca [kota]\` - Info cuaca daerah
Contoh: \`/cuaca jakarta\`

🔄 *Echo Message*
\`/follow [pesan]\` - Bot mengulang pesanmu
Contoh: \`/follow hello world\`

🧠 *AI Chat*
\`/ai [teks]\` - Berbicara dengan AI untuk menjawab pertanyaanmu
Contoh: \`/ai jelaskan apa itu format\`

🎨 *AI Image*
\`/img [teks]\` - Menghasilkan gambar otomatis dari deskripsi
Contoh: \`/img kota cyberpunk di malam hari\`

---
💡 *Cara Pakai:*
- Ketik perintah tanpa [ ] 
- Untuk perintah dengan parameter, tambahkan teks setelahnya
- Contoh: \`/cuaca bandung\` atau \`/follow halo\`

Butuh bantuan? Silakan gunakan perintah di atas! ✨
`

const startMessage = `
🤖 *Daftar Perintah Bot*

🌋 *Gempa Terkini*
\`/quake\` - Menampilkan informasi gempa bumi terbaru di Indonesia

💫 *Kutipan Inspiratif*
\`/quote\` - Menampilkan kutipan random yang memotivasi

💰 *Cryptocurrency*
\`/crypto\` - Menampilkan data harga aset cryptocurrency terpopuler

📈 *Pasar Saham*
\`/asset\` - Menampilkan harga saham Indonesia terkini

📱 *Berita Teknologi*
\`/berita\` - Menampilkan berita terbaru seputar teknologi

👥 *Random User*
\`/RandomUser\` - Mendapatkan data profil user random

🌤️ *Info Cuaca*
\`/cuaca [nama_kota]\` - Menampilkan informasi cuaca
Contoh: \`/cuaca jakarta\`

🔄 *Follow Text*
\`/follow [teks]\` - Bot akan mengulang teks yang Anda inputkan
Contoh: \`/follow halo semua\`

🧠 *AI Chat*
\`/ai [teks]\` - Gunakan untuk tanya-jawab dengan AI langsung di Telegram
Contoh: \`/ai apa itu AI\`

🎨 *AI Image*
\`/img [teks]\` - Buat gambar otomatis berdasarkan deskripsi
Contoh: \`/img samurai di tengah kota futuristik\`

---
💡 *Tips Penggunaan:*
- Gunakan format perintah dengan benar
- Untuk perintah dengan parameter, sertakan teks setelah perintah

Ketik atau tekan perintah di atas untuk mulai menggunakan fitur yang tersedia. 😊
`

const invalidCommand = `Salah perintah silakan tekan panduan`

const backupCommand = `
Selamat datang, Silakan gunakan command berikut:
/quake => berita gempa terkini
/quote => kutipan random 
/crypto => data asset crypto 
/financial => Untuk menunjukan harga saham indonesia
/berita => berita tentang teknologi
/follow [text] => bot akan mengikuti kata yang kamu inputkan
/RandomUser => dapetin random user
/cuaca [nama daerahnya]
`

module.exports = { 
  helpText, 
  invalidCommand,
  startMessage
}