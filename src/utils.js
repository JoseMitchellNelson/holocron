export const MAX_MESSAGE = 1000;
export function validateMessages(messages) {
  if (!Array.isArray(messages) || !messages.length || messages.length > 40) throw new Error('Envía entre 1 y 40 mensajes. Inicia otra conversación si alcanzaste el límite.');
  return messages.map((m, i) => {
    if (!m || m.role !== (i % 2 === 0 ? 'user' : 'model') || typeof m.text !== 'string' || !m.text.trim() || m.text.length > 2000) throw new Error('Historial inválido.');
    if (m.role === 'user' && m.text.length > MAX_MESSAGE) throw new Error('El mensaje supera los 1000 caracteres.');
    return { role: m.role, parts: [{ text: m.text.trim() }] };
  });
}
export function parseGemini(data) {
  const candidate = data?.candidates?.[0];
  if (data?.promptFeedback?.blockReason || ['SAFETY','RECITATION'].includes(candidate?.finishReason)) throw new Error('La respuesta fue bloqueada. Prueba con otra pregunta.');
  const text = candidate?.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('').trim();
  if (!text) throw new Error('No se recibió una respuesta. Inténtalo de nuevo.');
  return text;
}
export const timeLabel = date => new Intl.DateTimeFormat('es-CO', {hour:'2-digit',minute:'2-digit'}).format(new Date(date));
