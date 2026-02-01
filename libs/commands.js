const commands = {
  start: /^\/start$/,
  quote: /^\/quote$/,
  quake: /^\/quake$/,
  follow: /^\/follow\s+(.+)/,
  menu: /^\/menu$/,
  berita: /^\/berita$/,
  crypto: /^\/crypto$/,
  help: /^\/help$/,
  financial: /^\/asset$/,
  userRandom: /^\/random$/,
  cuaca: /^\/cuaca\s+(.+)$/i,
  games: /^\/games$/,
  broadcast: /^\/broadcast$/,
  ai: /^\/ai\s+(.+)$/i,
  img: /^\/img\s+(.+)$/i,
  meme: /^\/meme$/,
  userlist: /^\/userlist$/,
  naruto: /^\/naruto$/,
  wallet: /^\/wallet\s+(.+)/, 
  anime: /^\/anime$/,
  // Cobba 
  ip: /^\/ip$/
}

module.exports = commands