const helpText = `
DAFTAR COMMAND BOT

Gempa & Cuaca
/quake        → info gempa terkini BMKG
/cuaca jakarta → cuaca kota (ganti jakarta jadi kota lain)

/crypto       → harga 100 koin crypto teratas
/asset        → saham global, emas, BTC, ETH dll
/berita       → 3 berita teknologi terbaru
/games        → game PC gratis & giveaway

/quote        → kutipan random
/meme         → meme dari reddit
/follow halo bro → bot bales: halo bro
/random       → profil orang random di dunia


AI Keren
/ai apa itu quantum → tanya apa aja ke AI
/img pemandangan gunung → bikin gambar pake AI

Fitur Baru
/naruto       → quote + gambar naruto random
/anime        → data anime teratas dari jikan
/wallet       → cek saldo wallet Bitcoin

Lainnya
/start        → menu selamat datang
/help         → kamu lagi baca ini
/menu         → list command singkat

`.trim();

const startMessage = `Halo bro! 

Bot ini punya banyak fitur cakep:
• gempa
• crypto
• AI chat
• gambar AI
• meme
• naruto

Coba ketik /help buat liat semua command atau langsung coba salah satu:
/quake /crypto /meme /img kucing lucu /naruto

Have fun ya!`.trim();

const invalidCommand = `Command salah

Klik panduan buat liat semua perintah yang ada`;

const menuText = `
QUICK MENU

/start /help /menu
/quake /crypto /financial
/berita /games /meme
/cuaca /ai /img
/quote /follow /random
/naruto /anime
`.trim();

module.exports = { 
  helpText, 
  startMessage, 
  invalidCommand, 
  menuText 
};