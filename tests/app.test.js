// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {initRouter,normalizeRoute} from '../src/app.js';
it('normaliza la raíz y el slash final',()=>{expect(normalizeRoute('/')).toBe('/home');expect(normalizeRoute('/chat/')).toBe('/chat');});
it('navega con pushState y responde a popstate',()=>{
 document.body.innerHTML='<nav><a href="/home" data-link>Inicio</a><a href="/about" data-link>Proyecto</a></nav><main id="main" tabindex="-1"></main>';
 vi.stubGlobal('scrollTo',vi.fn());history.replaceState({},'','/home');initRouter();
 document.querySelector('a[href="/about"]').click();expect(location.pathname).toBe('/about');expect(document.querySelector('#main').textContent).toContain('Ficción');
 history.replaceState({},'','/home');window.dispatchEvent(new PopStateEvent('popstate'));expect(document.querySelector('#main').textContent).toContain('Otra');
 vi.unstubAllGlobals();
});
