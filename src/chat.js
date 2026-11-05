import {timeLabel} from './utils.js';
export async function fetchReply(messages, fetcher = fetch) {
  const response = await fetcher('/api/functions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:messages.map(({role,text})=>({role,text}))}),signal:AbortSignal.timeout(29000)});
  let data;
  try {data = await response.json();} catch {throw new Error('Respuesta inesperada del servidor.');}
  if (!response.ok) throw new Error(data.error || 'No se pudo enviar el mensaje.');
  if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('La respuesta está vacía.');
  return data.text;
}
export const state = {messages:[],pending:false,error:'',draft:''};
export async function sendMessage(text) {
  if (state.pending || !text.trim() || text.length > 1000) return;
  state.pending = true; state.error = ''; state.draft = '';
  const message = {role:'user',text:text.trim(),at:Date.now()};
  state.messages.push(message); renderMessages();
  try {state.messages.push({role:'model',text:await fetchReply(state.messages),at:Date.now()});}
  catch(error) {state.messages.pop();state.draft = text;state.error = error.name === 'TimeoutError' ? 'La respuesta tardó demasiado. Inténtalo de nuevo.' : error.message;}
  finally {state.pending = false;renderMessages();}
}
export function renderMessages() {
  const log = document.querySelector('#messages'); if (!log) return;
  log.replaceChildren();
  const all = [{role:'model',text:'He sentido tu presencia. Dime, ¿qué deseas saber sobre el poder de la Fuerza?',at:null},...state.messages];
  all.forEach(m=>{
    const article = document.createElement('article'); article.className = `message ${m.role}`;
    const label = document.createElement('div'); label.className = 'message-label';label.textContent = m.role === 'user' ? 'TÚ' : '◈ DARTH VADER';
    const p = document.createElement('p'); p.textContent = m.text;
    const meta = document.createElement('div');meta.className = 'message-meta';
    if(m.at){const time = document.createElement('time');time.dateTime = new Date(m.at).toISOString();time.textContent = timeLabel(m.at);meta.append(time);}
    if(m.role === 'model'){const copy = document.createElement('button');copy.textContent = 'Copiar';copy.className = 'copy';copy.onclick = async()=>{try {await navigator.clipboard.writeText(m.text);copy.textContent='Copiado';}catch {copy.textContent='No se pudo copiar';}};meta.append(copy);}
    article.append(label,p,meta);log.append(article);
  });
  if(state.pending){const typing=document.createElement('p');typing.className='typing';typing.textContent='Vader está escribiendo';typing.setAttribute('role','status');log.append(typing);}
  document.querySelector('#error').textContent = state.error;
  const input=document.querySelector('#input');input.value=state.draft;input.disabled=state.pending;
  document.querySelector('#send').disabled=state.pending;document.querySelector('#clear').disabled=state.pending;
  log.scrollTop=log.scrollHeight;
}
export function mountChat() {
  renderMessages();
  document.querySelector('#form').onsubmit=e=>{e.preventDefault();sendMessage(document.querySelector('#input').value);};
  document.querySelector('#input').oninput=e=>{state.draft=e.target.value;};
  document.querySelector('#input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();document.querySelector('#form').requestSubmit();}};
  document.querySelector('#clear').onclick=()=>{state.messages=[];state.error='';state.draft='';renderMessages();};
  document.querySelectorAll('[data-question]').forEach(button=>button.onclick=()=>sendMessage(button.textContent));
}
