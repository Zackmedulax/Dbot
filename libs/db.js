const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function saveOrUpdateUser(userData) {
  const { id, username, first_name, last_name } = userData;
  try {
    let { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, last_active, message_count')
      .eq('id', id)
      .single();
    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    if (existingUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          username: username || null,
          first_name,
          last_name: last_name || null,
          last_active: new Date().toISOString(),
          message_count: (existingUser.message_count || 0) + 1
        })
        .eq('id', id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id,
          username: username || null,
          first_name: first_name || null,
          last_name: last_name || null,
          joined_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          message_count: 1,
          chats: []
        });
      if (insertError) throw insertError;
    }
    console.log(`User ${first_name} (ID: ${id}) saved/updated`);
    return true;
  } catch (error) {
    console.error('Error saving/updating user:', error.message);
    return false;
  }
}

async function logUserMessage(userId, from, text) {
  try {
    let { data: user, error: fetchError } = await supabase
      .from('users')
      .select('chats, message_count')
      .eq('id', userId)
      .single();
    if (fetchError) throw fetchError;
    const newChat = { from, text, time: new Date().toISOString() };
    const updatedChats = [...(user.chats || []), newChat];
    const newMessageCount = (user.message_count || 0) + 1;
    const { error: updateError } = await supabase
      .from('users')
      .update({
        chats: updatedChats,
        message_count: newMessageCount,
        last_active: new Date().toISOString()
      })
      .eq('id', userId);
    if (updateError) throw updateError;
    console.log(`Message logged for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error logging message:', error.message);
    return false;
  }
}

async function getUserList() {
  try {
    const { data, error } = await supabase.from('users').select('id, first_name, username, joined_at, last_active, message_count');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user list:', error.message);
    return [];
  }
}

async function getBroadcast() {
  try {
    const { data, error } = await supabase.from('users').select('id');
    if (error) throw error;
    return data.map(user => user.id);
  } catch (error) {
    console.error('Error getting broadcast list:', error.message);
    return [];
  }
}
// === AI CHAT FUNCTIONS ===
async function getAIChatHistory(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('chats')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return [];
    return data.chats
      .filter(chat => chat.text && chat.text.startsWith('/ai'))
      .map(chat => ({
        role: chat.from === 'assistant' ? 'assistant' : 'user',
        content: chat.text.replace('/ai ', '')
      }))
      .slice(-6);
  } catch (err) {
    console.error('Error get AI history:', err);
    return [];
  }
}

async function addAIChat(userId, role, content) {
  try {
    const { data: user, error: fetchErr } = await supabase
      .from('users')
      .select('chats')
      .eq('id', userId)
      .single();
    if (fetchErr) throw fetchErr;

    const newChat = {
      from: role,
      text: role === 'assistant' ? content : `/ai ${content}`,
      time: new Date().toISOString()
    };

    const updatedChats = [...(user.chats || []), newChat];

    const { error } = await supabase
      .from('users')
      .update({
        chats: updatedChats,
        message_count: updatedChats.length,
        last_active: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error add AI chat:', err);
    return false;
  }
}

async function resetAIChat(userId) {
  try {
    const { data: user, error: fetchErr } = await supabase
      .from('users')
      .select('chats')
      .eq('id', userId)
      .single();
    if (fetchErr) throw fetchErr;

    const filtered = user.chats.filter(chat => !chat.text?.startsWith('/ai'));
    const { error } = await supabase
      .from('users')
      .update({
        chats: filtered,
        message_count: filtered.length,
        last_active: new Date().toISOString()
      })
      .eq('id', userId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error reset AI:', err);
    return false;
  }
}

module.exports = {
  saveOrUpdateUser,
  logUserMessage,
  getUserList,
  getBroadcast,
  getAIChatHistory,
  addAIChat,
  resetAIChat
}