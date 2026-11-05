// @vitest-environment jsdom
import {it,expect,vi,afterEach} from 'vitest';
import {fetchReply,state,sendMessage,renderMessages} from '../src/chat.js';
afterEach(()=>{vi.unstubAllGlobals();state.messages=[];state.pending=false;state.draft='';state.error='';document.body.innerHTML='';});
it('envía todo el historial sin timestamps',async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({text:'Habla.'})});
 expect(await fetchReply([{role:'user',text:'Hola',at:1}],fetcher)).toBe('Habla.');
 expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({messages:[{role:'user',text:'Hola'}]});
});
it('propaga el error 429',async()=>{await expect(fetchReply([],async()=>({ok:false,json:async()=>({error:'Espera un minuto'})}))).rejects.toThrow('Espera un minuto');});
it('maneja una respuesta no JSON',async()=>{await expect(fetchReply([],async()=>({ok:false,json:async()=>{throw Error();}}))).rejects.toThrow('inesperada');});
it('restaura el borrador si falla la red',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(Error('Sin red')));await sendMessage('Hola');expect(state.messages).toEqual([]);expect(state.draft).toBe('Hola');expect(state.pending).toBe(false);expect(state.error).toBe('Sin red');});
it('conserva la respuesta y el contexto al tener éxito',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({text:'Saludos.'})}));await sendMessage('Hola');expect(state.messages.map(m=>m.role)).toEqual(['user','model']);});
it('renderiza texto sin ejecutar HTML',()=>{document.body.innerHTML='<div id="messages"></div><p id="error"></p><textarea id="input"></textarea><button id="send"></button><button id="clear"></button>';state.messages=[{role:'user',text:'<img src=x onerror=alert(1)>',at:1}];renderMessages();expect(document.querySelector('#messages img')).toBeNull();expect(document.querySelector('#messages').textContent).toContain('<img');});
