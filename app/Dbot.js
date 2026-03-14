const TelegramBot = require("node-telegram-bot-api")
const fetch = require("node-fetch")
const commands = require('../libs/commands.js')
const { helpText, invalidCommand, startMessage } = require('../libs/consttand.js')
const { saveOrUpdateUser, logUserMessage } = require("../libs/db.js")

// code setting bot 
class Dbot extends TelegramBot {
  constructor(token, options) {
    super(token, options)
    this.on("message", (data) => {
      saveOrUpdateUser(data.from)
      logUserMessage(data.from.id, "user", data.text)
      const isInCommand = Object.values(commands).some(keyword => keyword.test(data.text))
      if (!isInCommand) {
        console.log(`Salah perintah oleh ${data.from.first_name} ini textnya ${data.text}`)
        this.sendMessage(data.from.id, invalidCommand, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Panduan",
                  callback_data: "go_to_invalid_help",
                }
              ]
            ]
          }
        })
      }
    })
    this.on("callback_query", (callback) => {
      const callbackName = callback.data
      if (callbackName == "go_to_invalid_help") {
        this.sendMessage(callback.from.id, helpText)
      }
    })
  }
  getStart() {
    this.onText(commands.start, (data) => {
      console.log(`Fitur /start di gunakan oleh ` + data.from.first_name)
      const welcomeMessage = `
Halo ${data.from.first_name}! 👋

Selamat datang di bot ini. Saya siap membantu Anda.

Tekan help untuk melihat panduan lengkap.
    `
      this.sendMessage(data.from.id, welcomeMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "help",
                callback_data: "go_to_start",
              }
            ]
          ]
        }
      })
    })

    this.on("callback_query", (callback) => {
      const callbackName = callback.data
      if (callbackName == "go_to_start") {
        this.answerCallbackQuery(callback.id)
        this.sendMessage(callback.from.id, startMessage)
      }
    })
  }
  getSticker() {
    this.on("sticker", (data) => {
      console.log("Fitur sticker di pake " + data.from.first_name)
      this.sendMessage(data.from.id, data.sticker.emoji)
    })
  }
  getFollow() {
    this.onText(commands.follow, (data, after) => {
      console.log("Fitur follow di pake " + data.from.first_name)
      this.sendMessage(data.from.id, `${after[1]}`)
    })
  }
  getQuote() {
    this.onText(commands.quote, async (data) => {
      console.log("Fitur quote di pake " + data.from.first_name)
      const quotes = "https://api.kanye.rest/"
      try {
        const apiCall = await fetch(quotes)
        const { quote } = await apiCall.json()
        this.sendMessage(data.from.id, quote)
      } catch (err) {
        console.error(err)
        this.sendMessage(data.from.id, err)
      }
    })
  }
  getNews() {
    const newsEndpoint = "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=59d0824f25274c9a86ca24b07c0aa44b"

    this.onText(commands.berita, async (data) => {
      console.log("Fitur berita di pake " + data.from.first_name)
      try {
        const apiCall = await fetch(newsEndpoint)
        const response = await apiCall.json()
        const { status, articles } = response

        if (status === "ok" && articles.length > 0) {
          articles.slice(0, 3).forEach((article, index) => {
            const message = `${index + 1}. ${article.title}\n🔗 ${article.url}`
            this.sendMessage(data.from.id, message)
          })
        } else {
          this.sendMessage(data.from.id, "Tidak ada berita ditemukan")
        }
      } catch (err) {
        console.error(err)
        this.sendMessage(data.from.id, "Error mengambil berita")
      }
    })
  }
  getMenu() {
    this.onText(commands.menu, (data) => {
      console.log("Fitur menu di pake " + data.from.first_name)
      this.sendMessage(data.from.id, "Berikut menu yang terdaftar\n/follow (isi textnya apa)\n/quote\n/berita\n/crypto\n/quake\n/help")
    })
  }
  getQuake() {
    const quakeEdnpoint = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
    try {
      this.onText(commands.quake, async (data) => {
        this.sendMessage(data.from.id, "Mohon Tunggu sebentar ya")
        console.log("Fitur quake di pake " + data.from.first_name)

        const apiCall = await fetch(quakeEdnpoint)
        const response = await apiCall.json()
        const { gempa } = response.Infogempa

        const {
          Wilayah,
          Kedalaman,
          Jam,
          Tanggal,
          Magnitude,
          Shakemap,
          Dirasakan,
          Potensi,
          Coordinates,
          DateTime
        } = gempa

        const potoGempa = "https://data.bmkg.go.id/DataMKG/TEWS/" + Shakemap

        try {

          const resImg = await fetch(potoGempa)
          const contentType = resImg.headers.get("content-type")


          if (!contentType || !contentType.startsWith("image/")) {
            return this.sendMessage(data.from.id, `
Info gempa terkini:
Wilayah: ${Wilayah}
Jam: ${Jam}
Tanggal: ${Tanggal}
Kordinat: ${Coordinates}
Potensi: ${Potensi}
Dirasakan: ${Dirasakan}
Besaran: ${Magnitude} SR
Kedalaman: ${Kedalaman}
${DateTime}
(⚠️ Shakemap tidak tersedia)
          `)
          }


          const buffer = await resImg.arrayBuffer()

          await this.sendPhoto(data.from.id, Buffer.from(buffer), {
            caption: `
Info gempa terkini:
Wilayah: ${Wilayah}
Jam: ${Jam}
Tanggal: ${Tanggal}
Kordinat: ${Coordinates}
Potensi: ${Potensi}
Dirasakan: ${Dirasakan}
Besaran: ${Magnitude} SR
Kedalaman: ${Kedalaman}
${DateTime}
          `
          })
        } catch (err) {
          console.error("Gagal kirim gambar BMKG:", err)
          this.sendMessage(
            data.from.id,
            "Gagal menampilkan gambar, tapi data gempanya berhasil diambil."
          )
        }
      })
    } catch (err) {
      console.error(err)
      this.sendMessage(data.from.id, "mohon maaf opsi ini sedang error")
    }
  }
  // F Crypto API Err
  getCrypto() {
    const cryptoUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

    try {
      this.onText(commands.crypto, async (data) => {
        console.log("Fitur crypto dipake " + data.from.first_name);
        await this.sendMessage(data.from.id, "🔎 Mengambil data crypto...");

        // fetch
        const apiCall = await fetch(cryptoUrl);
        if (!apiCall.ok) {
          return this.sendMessage(data.from.id, `Error: gagal ambil data (status ${apiCall.status})`);
        }
        const response = await apiCall.json();

        const maxLen = 3800;
        let current = `📊 Top ${response.length} Crypto Market (USD) 📊\n\n`;
        const messages = [];

        response.forEach((coin, index) => {
          const name = coin.name ?? "N/A";
          const symbol = (coin.symbol ?? "").toUpperCase();
          const price = coin.current_price != null ? coin.current_price : "N/A";
          const marketCap = coin.market_cap != null ? coin.market_cap : "N/A";
          const change24 = coin.price_change_percentage_24h != null ? coin.price_change_percentage_24h : "N/A";
          const ath = coin.ath != null ? coin.ath : "N/A";
          const atl = coin.atl != null ? coin.atl : "N/A";
          const img = coin.image ?? "N/A";
          const last = coin.last_updated ?? "N/A";

          const block =
            `${index + 1}. ${name} (${symbol})
Harga: $${price}
Market Cap: $${marketCap}
24h Change: ${change24} %
ATH: $${ath} | ATL: $${atl}
Gambar: ${img}
Update: ${last}

`;


          if (current.length + block.length > maxLen) {
            messages.push(current);
            current = block;
          } else {
            current += block;
          }
        });

        if (current.length) messages.push(current);

        for (const msg of messages) {
          await this.sendMessage(data.from.id, msg);
        }
      });
    } catch (err) {
      console.error("getCrypto error:", err);
    }
  }
  // F Crypto API Err end
  getFinancial() {
    const symbols = [
      "NVDA", "MSFT", "AAPL", "GOOG", "GOOGL", "AMZN", "META", "TSLA",
      "BRK.B", "JPM", "V", "WMT", "LLY", "ORCL", "AVGO", "TCEHY",
      "TSM", "2222.SR", "XAUUSD", "XAGUSD", "BTCUSD", "ETHUSD", "NICKELUSD"
    ]

    try {
      this.onText(commands.financial, async (data) => {
        console.log("Fitur financial dipake " + data.from.first_name);
        await this.sendMessage(data.from.id, "📊 Mengambil data aset global...")
        let pesan = "🌐 *The World's Top Global Assets* 🌐\n\n";

        for (const sym of symbols) {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=55M8GQAVDBENWTE2`;
          const apiCall = await fetch(url);

          if (!apiCall.ok) {
            pesan += `⚠️ ${sym} gagal diambil (${apiCall.status})\n\n`;
            continue;
          }

          const json = await apiCall.json();
          const quote = json["Global Quote"] || {};

          pesan += `💡 *${sym}*\n`;
          pesan += `💰 Harga: $${quote["05. price"] || "N/A"}\n`;
          pesan += `📊 Perubahan: ${quote["09. change"] || "N/A"} (${quote["10. change percent"] || "N/A"})\n`;
          pesan += `🚪 Open: $${quote["02. open"] || "N/A"}\n`;
          pesan += `🔼 High: $${quote["03. high"] || "N/A"}\n`;
          pesan += `🔽 Low: $${quote["04. low"] || "N/A"}\n\n`;
        }

        this.sendMessage(data.from.id, pesan, { parse_mode: "Markdown" });
      });
    } catch (err) {
      console.error("Financial error:", err);
      this.sendMessage(data.from.id, "⚠️ Mohon maaf, fitur sedang error")
    }
  }
  getRandom() {
    const randomEndpoint = "https://randomuser.me/api/";

    try {
      this.onText(commands.userRandom, async (data) => {
        console.log("Fitur userRandom di pake " + data.from.first_name)
        const apiCall = await fetch(randomEndpoint);
        const response = await apiCall.json();

        const user = response.results[0];
        const name = `${user.name.first} ${user.name.last}`;
        const gender = user.gender;
        const country = user.location.country;
        const email = user.email;
        const phone = user.phone;
        const picture = user.picture.large;

        const message = `
👤 *Random User Generated*  
━━━━━━━━━━━━━━━━━━  
*Name:* ${name}  
*Gender:* ${gender}  
*Country:* ${country}  
*Email:* ${email}  
*Phone:* ${phone}  
*Picture:* ${picture}
      `.trim();

        this.sendMessage(data.from.id, message, { parse_mode: "Markdown" });
      });
    } catch (err) {
      console.error(err);
    }
  }
  getWeather() {
    this.onText(commands.cuaca, async (data, match) => {
      try {
        console.log("Fitur cuaca di pake oleh " + data.from.first_name)
        const city = match[1]
        const apiKey = "8b7535b42fe1c551f18028f64e8688f7"
        const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`

        const response = await fetch(weatherEndpoint)

        if (!response.ok) {
          throw new Error(`Kota ${city} tidak ditemukan`)
        }

        const weatherData = await response.json()

        const weatherInfo = `
🌤️ **CUACA DI ${weatherData.name.toUpperCase()}**
📊 Suhu: ${weatherData.main.temp}°C
💨 Kelembaban: ${weatherData.main.humidity}%
🌪️ Tekanan: ${weatherData.main.pressure} hPa
💨 Angin: ${weatherData.wind.speed} m/s
📝 Deskripsi: ${weatherData.weather[0].description}
            `.trim()

        this.sendMessage(data.from.id, weatherInfo)

      } catch (err) {
        console.error("Weather error:", err)
        this.sendMessage(data.from.id, `❌ Error: ${err.message}`)
      }
    })
  }
  getGame() {
    const gameEndpoint = "https://gamerpower.com/api/giveaways"
    this.onText(commands.games, async (data) => {
      try {
        console.log(`Fitur game di gunakan oleh ` + data.from.first_name)
        const apiCall = await fetch(gameEndpoint)
        const games = await apiCall.json()

        const limitedGames = games.slice(0, 3)


        for (const game of limitedGames) {
          const caption = `
🎮 <b>${game.title}</b>

💰 <b>Nilai:</b> ${game.worth}
📱 <b>Platform:</b> ${game.platforms}
📅 <b>Berakhir:</b> ${game.end_date}
📊 <b>Status:</b> ${game.status}

${game.description}

🔗 <a href="${game.open_giveaway_url}">KLIK DI SINI UNTUK DAPATKAN GAME</a>
          `

          await this.sendPhoto(data.from.id, game.image, {
            caption: caption,
            parse_mode: "HTML"
          })

          await new Promise(resolve => setTimeout(resolve, 1000))
        }

      } catch (err) {
        console.error(err)
      }
    })
  }
  getHelp() {
    try {
      this.onText(commands.help, async (data) => {
        console.log("Fitur help di pake " + data.from.first_name)
        const botProfil = await this.getMe()
        this.sendMessage(data.from.id, helpText)
      })
    } catch (err) {
      console.error(err)
    }
  }
  // Fitur Owner
  getBroadcast() {
    this.onText(commands.broadcast, async (data) => {
      try {
        const fromId = data.from.id;
        const OWNER_ID = 6982797728;

        if (fromId !== OWNER_ID) {
          return this.sendMessage(fromId, "Maaf, fitur ini hanya untuk owner.");
        }

        const pesan = `
        Hallo kok ga di pake pake
        `.trim();

        const { getBroadcast } = require("../libs/db.js");
        const userIds = await getBroadcast();

        if (!userIds || userIds.length === 0) {
          return this.sendMessage(fromId, "DB belum benar: tidak ada user.");
        }

        const failList = [];
        for (const id of userIds) {
          try {
            await this.sendMessage(id, pesan, { parse_mode: "Markdown" });
          } catch (err) {
            console.error(`Gagal kirim ke ${id}:`, err);
            failList.push(id);
          }
          await new Promise((r) => setTimeout(r, 200))
        }

        let reply = `Broadcast selesai ke ${userIds.length} user.`;
        if (failList.length > 0) {
          reply += `\nGagal ke: ${failList.join(", ")}`;
        }
        this.sendMessage(fromId, reply);

      } catch (err) {
        console.error("Error di broadcast:", err);
        this.sendMessage(data.from.id, "Terjadi kesalahan saat broadcast.");
      }
    })
  }
  // Fitur Owner end
  getAIChat() {
    this.onText(commands.ai, async (data, match) => {
      console.log("Fitur Ai di pake " + data.from.first_name)
      const prompt = match[1]
      try {
        await this.sendMessage(data.from.id, "Sedang berpikir…");

        const url = `https://freegpt4.ddns.net/?text=${encodeURIComponent(prompt)}`;
        const resp = await fetch(url);
        const result = await resp.text();

        const reply = result || "Maaf, saya belum bisa menjawab itu.";
        await this.sendMessage(data.from.id, reply);

      } catch (err) {
        console.error("Error di AI chat:", err);
        await this.sendMessage(data.from.id, "⚠️ Terjadi kesalahan ketika memproses AI chat.");
      }
    })
  }
  getAIImage() {
    this.onText(commands.img, async (data, match) => {
      console.log("Fitur img di pake " + data.from.first_name)
      const prompt = match[1];
      try {
        await this.sendMessage(data.from.id, "Menghasilkan gambar…");

        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        await this.sendPhoto(data.from.id, imageUrl, {
          caption: ` Gambar untuk: "${prompt}"`
        });

      } catch (err) {
        console.error("Error di AI image:", err);
        await this.sendMessage(data.from.id, "Terjadi kesalahan saat menghasilkan gambar.");
      }
    })
  }
  getMeme() {
    this.onText(commands.meme, async (data) => {
      console.log("Fitur meme di pake " + data.from.first_name)
      try {
        await this.sendMessage(data.from.id, "Nyari meme dulu bentar...")
        const subreddits = ["memes", "dankmemes", "ProgrammerHumor"];
        const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];
        const url = `https://meme-api.com/gimme/${randomSub}`;

        const resp = await fetch(url);
        const json = await resp.json();

        if (json && json.url) {
          await this.sendPhoto(data.from.id, json.url, {
            caption: `*${json.title}*\n\n💬 Subreddit: r/${randomSub}`,
            parse_mode: "Markdown"
          });
        } else {
          throw new Error("Gagal ambil meme.");
        }
      } catch (err) {
        console.error("Error di /meme:", err);
        this.sendMessage(data.from.id, "⚠️ Gagal ngambil meme, coba lagi nanti ya.");
      }
    })
  }
  // Fitur Owner
  getUserList() {
    this.onText(commands.userlist, async (data) => {
      try {
        const OWNER_ID = 6982797728;
        const fromId = data.from.id;

        if (fromId !== OWNER_ID) {
          return this.sendMessage(fromId, "⚠️ Fitur ini cuma buat owner ya.");
        }
        const { getUserList } = require("../libs/db.js");
        const users = await getUserList();

        if (!users || users.length === 0) {
          return this.sendMessage(fromId, "📭 Belum ada user yang terdaftar di database.");
        }

        let list = users
          .map((u, i) => {
            const firstName = u.first_name ? u.first_name : "(tanpa nama)";
            const username = u.username ? `(@${u.username})` : "";
            const joined = new Date(u.joined_at).toLocaleDateString("id-ID");
            const last = new Date(u.last_active).toLocaleDateString("id-ID");
            const count = u.message_count || 0;

            return (
              `<b>${i + 1}.</b> 🧑 ${firstName} ${username}\n` +
              `🆔 <code>${u.id}</code>\n` +
              `🕐 Joined: ${joined}\n` +
              `💬 Pesan: ${count}\n` +
              `🟢 Aktif: ${last}\n`
            );
          })
          .join("\n");

        const text = `👥 <b>Daftar User Terdaftar</b>\n\n${list}\n📊 Total: <b>${users.length}</b> user.`;

        this.sendMessage(fromId, text, { parse_mode: "HTML" });
      } catch (err) {
        console.error("Error di /userlist:", err);
        this.sendMessage(data.from.id, "⚠️ Gagal menampilkan daftar user.");
      }
    })
  }
  // Fitur Owner end
  getNaruto() {
    const narutoEndpoint = "https://api.jikan.moe/v4/anime?q=naruto&limit=5"
    this.onText(commands.naruto, async (data) => {
      console.log("Fitur naruto dipake " + data.from.first_name)
      try {
        const apiCall = await fetch(narutoEndpoint)
        const response = await apiCall.json()

        const list = response.data

        if (!list || list.length === 0) {
          return this.sendMessage(data.from.id, "Ga ada data Naruto")
        }

        const limitedList = list.slice(0, 3)

        for (const anime of limitedList) {
          const caption = `*${anime.title}*\nScore: ${anime.score}\nEpisodes: ${anime.episodes}\nStatus: ${anime.status}`

          await this.sendPhoto(
            data.from.id,
            anime.images.jpg.image_url,
            { caption, parse_mode: "Markdown" }
          )
        }

      } catch (err) {
        console.log(err)
        this.sendMessage(data.from.id, `⚠️ Error brayy: ${err.message}`)
      }
    })
  }
  getWallet() {
    this.onText(commands.wallet, async (data, match) => {
      const address = match[1].trim();
      const url = `https://blockstream.info/api/address/${address}`;
      console.log("Fitur wallet dipake " + data.from.first_name);

      try {
        const apiCall = await fetch(url);

        if (!apiCall.ok) {
          return this.sendMessage(data.from.id, "⚠️ Alamat tidak ditemukan atau API bermasalah.");
        }

        const res = await apiCall.json();

        const totalReceived = res.chain_stats.funded_txo_sum;
        const totalSent = res.chain_stats.spent_txo_sum;
        const balanceSat = totalReceived - totalSent;
        const balanceBTC = (balanceSat / 100000000).toFixed(8);

        let message = `₿ITCOIN WALLET INFO\n\n`;
        message += `*Address:* \`${res.address}\`\n`;
        message += `--- --- --- --- --- --- --- ---\n`;
        message += `*💰 Saldo Saat Ini:* \`${balanceBTC} BTC\`\n`;
        message += `*📥 Total Diterima:* ${(totalReceived / 100000000).toFixed(8)} BTC\n`;
        message += `*📤 Total Dikirim:* ${(totalSent / 100000000).toFixed(8)} BTC\n\n`;

        message += `*🔄 Transaksi Terkonfirmasi:* ${res.chain_stats.tx_count}\n`;

        if (res.mempool_stats.tx_count > 0) {
          const pendingSat = res.mempool_stats.funded_txo_sum - res.mempool_stats.spent_txo_sum;
          message += `*⏳ Pending (Mempool):* ${(pendingSat / 100000000).toFixed(8)} BTC (${res.mempool_stats.tx_count} tx)\n`;
        } else {
          message += `*⏳ Pending:* Tidak ada\n`;
        }

        await this.sendMessage(data.from.id, message, {
          parse_mode: "Markdown"
        });

      } catch (err) {
        console.error(err);
        this.sendMessage(data.from.id, "⚠️ Error brayy, gagal memproses data wallet!");
      }
    });
  }
  getAnime() {
    const animeEndpoint = "https://api.jikan.moe/v4/top/anime?limit=5"
    this.onText(commands.anime, async (data) => {
      let statusMsg = null
      try {
        console.log("Fitur anime di pake " + data.from.first_name);

        try {
          statusMsg = await this.sendMessage(data.from.id, "🔎 Mengambil data 5 anime teratas...", {
            parse_mode: "Markdown"
          });
        } catch (sendErr) {
          console.log("Error", sendErr);
        }

        const apiCall = await fetch(animeEndpoint);

        if (!apiCall.ok) {
          throw new Error(`Gagal mengambil data anime (Status: ${apiCall.status})`);
        }

        const response = await apiCall.json();

        if (!response.data || response.data.length === 0) {
          if (statusMsg) {
            await this
              .deleteMessage(data.from.id, statusMsg.message_id).catch(() => { });
          }
          return this.sendMessage(data.from.id, "⚠️ Tidak ada data anime yang ditemukan.")
        }

        if (statusMsg) {
          await this.deleteMessage(data.from.id, statusMsg.message_id).catch(() => { });
        }

        const topAnimes = response.data.slice(0, 5);

        for (const anime of topAnimes) {
          const title = anime.title_english || anime.title
          const score = anime.score || "N/A"
          const rank = anime.rank || "N/A"
          const url = anime.url
          const episodes = anime.episodes || "N/A"

          let synopsis = anime.synopsis ? anime.synopsis.substring(0, 200).trim() + '...' : "Tidak ada sinopsis."


          const message = `
🌟 **TOP ${rank}: ${title}**
━━━━━━━━━━━━━━━━━━
⭐ **Score:** ${score} / 10
📺 **Episode:** ${episodes}
🔗 **Link:** [Lihat di MAL](${url})

📝 *${synopsis}*
            `.trim()


          await this.sendMessage(data.from.id, message, {
            parse_mode: "Markdown"
          })

          await new Promise(resolve => setTimeout(resolve, 300))
        }

      } catch (err) {
        console.error("Error di getAnime:", err)
        this.sendMessage(data.from.id, `⚠️ Maaf, terjadi kesalahan saat mengambil data anime: ${err.message}`)
      }
    })
  }
  getDownload() {
    this.onText(commands.download, async (data, match) => {
      const url = match[1].trim();
      const chatId = data.from.id;

      console.log(`Fitur download dipake ` + data.from.first_name + ` - URL: ${url}`);

      const statusMsg = await this.sendMessage(chatId, " *Downloading...* Mohon tunggu", {
        parse_mode: "Markdown"
      });

      try {
        const ytdlp = require('yt-dlp-exec');
        const fs = require('fs');
        const path = require('path');


        const downloadDir = './temp_downloads';
        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir);
        }


        const fileName = `video_${Date.now()}.mp4`;
        const filePath = path.join(downloadDir, fileName);

        await ytdlp(url, {
          output: filePath,
          format: 'mp4',
          noCheckCertificates: true
        });


        const stats = fs.statSync(filePath);
        const fileSizeMB = stats.size / (1024 * 1024);

        if (fileSizeMB > 50) {
          fs.unlinkSync(filePath);
          return this.editMessageText(` Video terlalu besar (${fileSizeMB.toFixed(2)}MB)\nMax 50MB`, {
            chat_id: chatId,
            message_id: statusMsg.message_id,
            parse_mode: "Markdown"
          });
        }


        await this.deleteMessage(chatId, statusMsg.message_id);


        await this.sendVideo(chatId, filePath, {
          caption: `*Download selesai!*`,
          parse_mode: "Markdown"
        });


        fs.unlinkSync(filePath);

      } catch (err) {
        console.error("Error download:", err);
        await this.editMessageText(`agal download: ${err.message}`, {
          chat_id: chatId,
          message_id: statusMsg.message_id,
          parse_mode: "Markdown"
        });
      }
    });
  }
  // Uji coba API
  getIp() {
    this.onText(commands.ip, async (msg, data) => {
      const chatId = msg.chat.id;
      console.log("Fitur ip dipake " + data.from.first_name);

      const pesan = `
*Cek Alamat IP Kamu*

Untuk alasan keamanan, Telegram tidak membagikan alamat IP kamu ke Bot. 
Silakan klik tombol di bawah untuk melihat detail koneksi kamu:
    `;

      const options = {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌐 Cek IP Saya",
                url: "https://ipapi.co/json/"
              }
            ]
          ]
        }
      };

      try {
        await this.sendMessage(chatId, pesan, options);
      } catch (e) {
        console.error("Error mengirim pesan:", e);
      }
    });
  }
  getQc() {
    this.onText(commands.qr, async (data, match) => {
      try {
        const userId = data.from.id;
        const textToEncode = match[1];
        console.log("Fitur qrcode dipake " + data.from.first_name);

        if (!textToEncode || textToEncode.trim() === '') {
          this.sendMessage(userId, "Silakan ketik teks setelah /qr\nContoh: /qr https://example.com");
          return;
        }

        const encodedText = encodeURIComponent(textToEncode);
        const qrcodeEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}&format=png`;

        this.sendMessage(userId, "🔄 Membuat QR Code...");

        this.sendPhoto(userId, qrcodeEndpoint, {
          caption: `QR Code untuk: ${textToEncode}`
        });

      } catch (err) {
        console.log("Error membuat QR:", err);
        this.sendMessage(data.from.id, "❌ Gagal membuat QR Code. Silakan coba lagi.");
      }
    });

    this.onText(/^\/qr$/, (data) => {
      this.sendMessage(data.from.id,
        "Format: /qr [teks atau url]\n" +
        "Contoh:\n" +
        "/qr https://google.com\n" +
        "/qr Hello World\n" +
        "/qr WA:08123456789"
      );
    });
  }
  getDogs() {
    const dogsEndpoint = "https://dog.ceo/api/breeds/image/random"
    this.onText(commands.dogs, async(data) => {
      try {
        const apiCall = await fetch(dogsEndpoint)
        const response = await apiCall.json()
        console.log(response)
        this.sendMessage(data.from.id, "runn")
      } catch(err) {
        this.sendMessage(data.from.id, "Error bray")
      }
    })
  }
  initFeatures() {
    this.getMeme()
    this.getUserList()
    this.getStart()
    this.getHelp()
    this.getAIChat()
    this.getAIImage()
  }
}

module.exports = Dbot
