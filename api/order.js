const MAX = {name:80,contact:80,email:120,bank:80,iban:64,paymentMethod:40,reference:100,comment:500,direction:30,sendAmount:30,sendCurrency:10,receiveAmount:30,receiveCurrency:10,rate:80,fee:80};
function clean(value,key){return String(value??'').trim().slice(0,MAX[key]||500)}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
module.exports = async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Метод не поддерживается'});
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return res.status(500).json({error:'Telegram ещё не настроен на сервере'});
  const b=req.body||{};
  if(clean(b.website,'comment')) return res.status(200).json({ok:true,orderId:'EB-SPAM'});
  const data={}; for(const k of Object.keys(MAX)) data[k]=clean(b[k],k);
  if(!data.name||!data.contact||!data.email||!data.bank||!data.iban||!data.sendAmount||!data.receiveAmount) return res.status(400).json({error:'Заполните обязательные поля'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return res.status(400).json({error:'Проверьте email'});
  const orderId='EB-'+Date.now().toString(36).toUpperCase();
  const message=[
    `🟣 <b>Новая заявка EuroBridge</b>`,
    `<b>ID:</b> ${orderId}`,
    ``,
    `<b>Направление:</b> ${escapeHtml(data.direction)}`,
    `<b>Отправляет:</b> ${escapeHtml(data.sendAmount)} ${escapeHtml(data.sendCurrency)}`,
    `<b>Получает:</b> ${escapeHtml(data.receiveAmount)} ${escapeHtml(data.receiveCurrency)}`,
    `<b>Курс:</b> ${escapeHtml(data.rate)}`,
    `<b>Комиссия:</b> ${escapeHtml(data.fee)}`,
    ``,
    `👤 <b>Клиент</b>`,
    `<b>Имя:</b> ${escapeHtml(data.name)}`,
    `<b>Контакт:</b> ${escapeHtml(data.contact)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
    ``,
    `🏦 <b>Получение</b>`,
    `<b>Банк:</b> ${escapeHtml(data.bank)}`,
    `<b>IBAN/реквизиты:</b> <code>${escapeHtml(data.iban)}</code>`,
    `<b>Способ оплаты:</b> ${escapeHtml(data.paymentMethod)}`,
    data.reference?`<b>Референс:</b> ${escapeHtml(data.reference)}`:'',
    data.comment?`<b>Комментарий:</b> ${escapeHtml(data.comment)}`:'',
    ``,
    `🕒 ${new Date().toISOString()}`
  ].filter(Boolean).join('\n');
  try{
    const tg=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text:message,parse_mode:'HTML',disable_web_page_preview:true})});
    const result=await tg.json();
    if(!tg.ok||!result.ok) throw new Error(result.description||'Telegram API error');
    return res.status(200).json({ok:true,orderId});
  }catch(err){console.error(err);return res.status(502).json({error:'Не удалось доставить заявку в Telegram'});}
}
