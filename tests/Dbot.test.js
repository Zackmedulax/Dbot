import { describe, it, expect, vi, beforeEach } from 'vitest';

// Bot lo tetep pake require
const Dbot = require('../app/Dbot.js');

describe('Dbot Test Suite', () => {
  let bot;

  beforeEach(() => {
    // Kita spy onText SEBELUM bikin instance bot kalau bisa, 
    // atau langsung spy pada instance-nya.
    bot = new Dbot('123:ABC', { polling: false });
    
    // Mata-matai onText dan sendMessage
    vi.spyOn(bot, 'onText');
    vi.spyOn(bot, 'sendMessage').mockImplementation(() => Promise.resolve());
  });

  it('Harus bisa load class Dbot', () => {
    expect(bot).toBeDefined();
  });

  it('Cek API Kanye (Quote)', async () => {
    // 1. Jalankan method yang meregistrasi listener
    bot.getQuote();
    
    // 2. Sekarang bot.onText sudah dipanggil oleh getQuote()
    // Kita cari panggilannya
    const allCalls = bot.onText.mock.calls;
    const quoteEntry = allCalls.find(call => call[0].toString().includes('quote'));
    
    expect(quoteEntry, 'Listener /quote tidak ditemukan!').toBeDefined();
    
    // 3. Jalankan callback-nya (simulasi user ngetik /quote)
    const callback = quoteEntry[1];
    await callback({ from: { id: 123, first_name: 'TermuxUser' } });

    // 4. Cek apakah sendMessage dipanggil
    expect(bot.sendMessage).toHaveBeenCalled();
    
    const sentMessage = bot.sendMessage.mock.calls[0][1];
    console.log('--- Hasil Real API Kanye ---');
    console.log(sentMessage);
    
    expect(typeof sentMessage).toBe('string');
  });
});
