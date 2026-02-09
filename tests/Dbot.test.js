import { describe, it, expect, vi, beforeEach } from 'vitest';
const Dbot = require('../app/Dbot.js');
const commands = require('../libs/commands.js');
const constants = require('../libs/consttand.js');
const db = require('../libs/db.js');

describe('Dbot Full System Test', () => {
  let bot;

  beforeEach(() => {
    bot = new Dbot('123:ABC', { polling: false });
  });

  it('Harus terhubung dengan semua modul libs', () => {
    expect(Dbot).toBeDefined();
    expect(commands).toBeDefined();
    expect(constants).toBeDefined();
    expect(db).toBeDefined();
  });
});
