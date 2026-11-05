# Validación realizada y pendiente

## Realizada el 5 de noviembre de 2026

- `npm test`: 21 pruebas aprobadas en 4 archivos. Toda respuesta de Gemini en los tests está simulada.
- `npm run build`: build de Vite generado correctamente.
- Navegador: Home, Chat y About visibles; enlace de navegación cambia la URL; atrás regresa de About a Chat.
- Chat inicial: saludo estático, formulario, botón de envío y botón de nueva conversación visibles.
- Responsive: chat cargado en iframes locales de 390×844, 768×1024 y 1440×900. Anchos útiles medidos: 375, 768 y 1425 px (las barras de scroll descuentan 15 px). `scrollWidth` fue igual a `clientWidth` en los tres casos: sin desbordamiento horizontal dentro de la aplicación.
- Capturas locales: `home-desktop.jpg` y `chat-desktop.jpg`. No son evidencia de Gemini en producción.

## Pendiente antes de entregar a evaluación

- Configurar `GEMINI_API_KEY` en el servidor y verificar una respuesta real.
- Probar continuidad de varios turnos y voz del personaje con el guion de `USO_DE_IA.md`.
- Publicar repositorio GitHub y desplegar en Vercel.
- Abrir directamente y recargar las tres rutas en producción.
- Verificar atrás/adelante en producción y conservar el historial entre rutas.
- Probar el teclado virtual en un teléfono real; los iframes no simulan su comportamiento.
- Probar chat real, copiar y modo claro en móvil, tablet y escritorio.
- Capturar la aplicación desplegada y registrar los enlaces reales en README.

## Entorno

Node 24.22.1; Vite 7.3.7; Vitest 3.2.7. El lockfile fija las versiones instaladas. Vercel CLI no tenía credenciales disponibles; no se realizó despliegue. La vista previa usa Vite, por lo que no ejecuta la Vercel Function. La función fue comprobada con tests aislados.
