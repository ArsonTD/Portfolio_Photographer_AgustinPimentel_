import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = root.classList.contains('reduce-motion');
const EASE = 'power3.out';

/* ════════════════════════════════════════════════════════════
   1. Preloader (solo en el inicio, una vez por sesión)
   ════════════════════════════════════════════════════════════ */
function preloader(onDone: () => void) {
  const pre = document.getElementById('preloader');

  const finish = () => {
    document.body.classList.remove('is-locked');
    onDone();
  };

  if (!pre) return finish();

  /* La intro sale una vez por sesión para no cansar a quien vuelve al
     inicio. Con ?intro en la URL se fuerza, para poder revisarla. */
  const forzar = new URLSearchParams(location.search).has('intro');

  let seen = false;
  try {
    seen = !forzar && sessionStorage.getItem('ap-intro') === '1';
  } catch {
    /* modo privado */
  }

  if (seen || reduced) {
    pre.remove();
    return finish();
  }

  try {
    sessionStorage.setItem('ap-intro', '1');
  } catch {
    /* modo privado */
  }

  const hellos = Array.from(pre.querySelectorAll<HTMLElement>('[data-hi]'));
  const foot = pre.querySelector<HTMLElement>('.pre__foot');

  const tl = gsap.timeline({
    onComplete: () => {
      pre.remove();
      finish();
    },
  });

  /* 1. Los saludos se encadenan; el último (Hola) se sostiene más */
  tl.fromTo(foot, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0);

  /* Un saludo cada PASO. La salida de uno termina justo cuando entra el
     siguiente, así nunca se ven dos superpuestos. */
  const PASO = 0.17;
  const ENTRA = 0.12;
  const SALE = 0.08;

  hellos.forEach((el, i) => {
    const t = i * PASO;
    tl.fromTo(el, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: ENTRA, ease: 'expo.out' }, t);
    if (i < hellos.length - 1) {
      tl.to(el, { autoAlpha: 0, y: -10, duration: SALE, ease: 'power2.in' }, t + PASO - SALE);
    }
  });

  const finSaludos = (hellos.length - 1) * PASO + ENTRA;

  /* 2. Se retira todo y el panel sube con el borde inferior curvado,
        de modo que el hero se descubre bajo un arco. */
  /* El radio se escribe a mano: GSAP no interpola valores compuestos
     como «60% 22%», así que animamos un número y lo aplicamos aquí. */
  const curva = { r: 0 };
  const dibujarCurva = () => {
    const radio = `${curva.r * 0.6}% ${curva.r * 0.22}%`;
    pre.style.borderBottomLeftRadius = radio;
    pre.style.borderBottomRightRadius = radio;
  };

  tl.to([...hellos, foot], { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, finSaludos + 0.45)
    .to(curva, { r: 100, duration: 0.5, ease: 'power2.out', onUpdate: dibujarCurva }, '<0.1')
    .to(pre, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, '<')
    .to(curva, { r: 0, duration: 0.55, ease: 'power2.in', onUpdate: dibujarCurva }, '<0.5');

}

/* ════════════════════════════════════════════════════════════
   2. Entrada de la cabecera (hero o encabezado de página)
   ════════════════════════════════════════════════════════════ */
function intro() {
  const head = document.querySelector('.hero') ?? document.querySelector('.ph');
  if (!head) return;

  const masks = head.querySelectorAll<HTMLElement>('[data-reveal="mask"]');
  const fades = head.querySelectorAll<HTMLElement>('.reveal');
  const media = document.querySelector<HTMLElement>('.hero__slide.is-active img');
  const foot = document.querySelector<HTMLElement>('.hero__foot');

  if (reduced) {
    gsap.set([...masks, ...fades], { opacity: 1, y: 0, yPercent: 0 });
    if (foot) gsap.set(foot, { opacity: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.fromTo(masks, { yPercent: 112 }, { yPercent: 0, duration: 1.2, stagger: 0.085 })
    .fromTo(fades, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95, stagger: 0.09 }, 0.35);

  if (media) tl.fromTo(media, { scale: 1.16 }, { scale: 1.08, duration: 2.2 }, 0);
  if (foot) tl.fromTo(foot, { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0.7);
}

/* ════════════════════════════════════════════════════════════
   3. Carrusel del hero
   ════════════════════════════════════════════════════════════ */
function heroSlider() {
  const stage = document.querySelector('.hero__stage');
  if (!stage) return;

  const slides = Array.from(stage.querySelectorAll<HTMLElement>('.hero__slide'));
  const labels = Array.from(document.querySelectorAll<HTMLElement>('[data-slide-label]'));
  const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-slide-btn]'));
  if (slides.length < 2) return;

  const DURATION = 6000;
  let current = 0;
  let timer: number | undefined;

  const paint = (next: number) => {
    labels.forEach((l, i) => l.classList.toggle('is-active', i === next));

    bars.forEach((b, i) => {
      b.classList.remove('is-active', 'is-done');
      if (i < next) b.classList.add('is-done');
    });
    // Reinicia la animación CSS de la barra activa
    const bar = bars[next];
    if (bar) {
      void bar.offsetWidth;
      bar.classList.add('is-active');
    }
  };

  const show = (next: number) => {
    if (next === current) return;
    const from = slides[current];
    const to = slides[next];

    to.classList.add('is-active');

    if (reduced) {
      gsap.set(to, { opacity: 1 });
      gsap.set(from, { opacity: 0 });
      from.classList.remove('is-active');
    } else {
      gsap.fromTo(to, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
      gsap.fromTo(
        to.querySelector('img'),
        { scale: 1.14 },
        { scale: 1.02, duration: DURATION / 1000 + 1.4, ease: 'none' }
      );
      gsap.to(from, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => from.classList.remove('is-active'),
      });
    }

    current = next;
    paint(next);
  };

  const advance = () => show((current + 1) % slides.length);

  const play = () => {
    stop();
    if (!reduced) timer = window.setInterval(advance, DURATION);
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  bars.forEach((bar, i) =>
    bar.addEventListener('click', () => {
      show(i);
      play();
    })
  );

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));

  // Solo corre mientras el hero está a la vista
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top bottom',
    end: 'bottom top',
    onEnter: play,
    onEnterBack: play,
    onLeave: stop,
    onLeaveBack: stop,
  });

  paint(0);
  play();
}

/* ════════════════════════════════════════════════════════════
   4. Reveals al hacer scroll
   ════════════════════════════════════════════════════════════ */
function reveals() {
  if (reduced) {
    gsap.set('.reveal', { opacity: 1, y: 0 });
    return;
  }

  const inHead = (el: Element) => el.closest('.hero') || el.closest('.ph');

  gsap.utils.toArray<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
    if (inHead(el)) return;
    gsap.fromTo(
      el,
      { yPercent: 112 },
      {
        yPercent: 0,
        duration: 1.15,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }
    );
  });

  const groups: Record<string, gsap.TweenVars> = {
    fade: { y: 26, opacity: 0, duration: 0.95 },
    card: { y: 44, opacity: 0, duration: 1.05 },
    row: { y: 22, opacity: 0, duration: 0.85 },
    shot: { y: 46, opacity: 0, scale: 0.985, duration: 1.1 },
  };

  Object.entries(groups).forEach(([key, from]) => {
    const items = gsap.utils.toArray<HTMLElement>(`[data-reveal="${key}"]`).filter((el) => !inHead(el));
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(batch, from, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: (from.duration as number) ?? 1,
          ease: 'expo.out',
          stagger: 0.075,
          overwrite: true,
        }),
    });
  });
}

/* ════════════════════════════════════════════════════════════
   5. Parallax suave
   ════════════════════════════════════════════════════════════ */
function parallax() {
  if (reduced || window.matchMedia('(max-width: 900px)').matches) return;

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '0.1');
    gsap.to(el, {
      yPercent: amount * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  const stage = document.querySelector('.hero__stage');
  if (stage) {
    gsap.to(stage, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }
}

/* ════════════════════════════════════════════════════════════
   6. Marquee infinito
   ════════════════════════════════════════════════════════════ */
function marquee() {
  const track = document.querySelector<HTMLElement>('[data-marquee]');
  const group = track?.querySelector<HTMLElement>('.mq__group');
  if (!track || !group) return;

  const width = () => group.getBoundingClientRect().width;
  let tween: gsap.core.Tween | undefined;

  const build = () => {
    tween?.kill();
    gsap.set(track, { x: 0 });
    if (reduced) return;
    tween = gsap.to(track, { x: -width(), duration: width() / 55, ease: 'none', repeat: -1 });
  };

  build();

  let resizeId: number;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(build, 250);
  });

  if (!reduced) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        if (!tween) return;
        gsap.to(tween, { timeScale: self.direction === -1 ? -1.4 : 1, duration: 0.5, overwrite: true });
      },
    });
  }
}

/* ════════════════════════════════════════════════════════════
   7. Barra de progreso del proceso
   ════════════════════════════════════════════════════════════ */
function processRail() {
  const fill = document.querySelector<HTMLElement>('[data-proc-fill]');
  if (!fill) return;
  if (reduced) {
    fill.style.transform = 'scaleX(1)';
    return;
  }
  gsap.fromTo(
    fill,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.proc__steps', start: 'top 78%', end: 'bottom 72%', scrub: 0.8 },
    }
  );
}

/* ════════════════════════════════════════════════════════════
   9. Navegación
   ════════════════════════════════════════════════════════════ */
function navigation() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const wa = document.getElementById('wa-float');
  let last = 0;

  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (self) => {
      const y = self.scroll();
      nav?.classList.toggle('is-stuck', y > 60);
      nav?.classList.toggle('is-hidden', y > last && y > 400 && !menu?.classList.contains('is-open'));
      wa?.classList.toggle('is-in', y > 700);
      last = y;
    },
  });

  let menuTl: gsap.core.Timeline | null = null;

  const openMenu = () => {
    if (!menu) return;
    menu.hidden = false;
    document.body.classList.add('is-locked');
    burger?.classList.add('is-open');
    burger?.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menuTl = gsap
      .timeline()
      .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
      .fromTo(
        menu.querySelectorAll('[data-menu-item]'),
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out' },
        '-=0.35'
      );
  };

  const closeMenu = () => {
    if (!menu) return;
    burger?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menuTl?.kill();
    gsap.to(menu, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.55,
      ease: 'expo.inOut',
      onComplete: () => {
        menu.hidden = true;
        document.body.classList.remove('is-locked');
      },
    });
  };

  burger?.addEventListener('click', () =>
    menu?.classList.contains('is-open') ? closeMenu() : openMenu()
  );

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu();
  });

  document.getElementById('to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
}

/* ════════════════════════════════════════════════════════════
   10. Transición entre páginas
   ════════════════════════════════════════════════════════════ */
function pageTransitions() {
  const veil = document.getElementById('page-veil');
  if (!veil) return;

  /* La entrada la resuelve una animación CSS (ver Base.astro), así que
     el velo desaparece aunque este script no llegue a ejecutarse. */
  const showVeil = () => {
    veil.style.animation = 'none';
    veil.style.visibility = 'visible';
  };

  const isInternal = (a: HTMLAnchorElement) => {
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    if (a.getAttribute('href')?.startsWith('#')) return false;
    try {
      return new URL(a.href).origin === location.origin;
    } catch {
      return false;
    }
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const a = (e.target as HTMLElement).closest('a');
    if (!a || !isInternal(a) || a.href === location.href) return;

    e.preventDefault();
    const go = () => (location.href = a.href);

    if (reduced) return go();

    showVeil();
    gsap.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.in', onComplete: go });
  });

  // Al volver con el botón atrás el navegador restaura la página con el velo puesto
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) gsap.set(veil, { opacity: 0, visibility: 'hidden' });
  });
}

/* ════════════════════════════════════════════════════════════
   11. Tema claro / oscuro
   ════════════════════════════════════════════════════════════ */
function theme() {
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('ap-theme', next);
    } catch {
      /* modo privado */
    }
  });
}

/* ════════════════════════════════════════════════════════════
   12. Cursor personalizado
   ════════════════════════════════════════════════════════════ */
function cursor() {
  const ring = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  const label = document.getElementById('cursor-label');

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!ring || !dot || !fine || reduced) {
    ring?.remove();
    dot?.remove();
    return;
  }

  root.classList.add('has-cursor');

  const setDotX = gsap.quickSetter(dot, 'x', 'px');
  const setDotY = gsap.quickSetter(dot, 'y', 'px');
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3' });

  let shown = false;

  /* Qué estado corresponde a lo que hay bajo el puntero */
  const resolve = (el: Element | null) => {
    if (!el) return { state: '', text: '' };

    // Los campos de formulario recuperan el cursor nativo
    if (el.closest('input, textarea, select, [contenteditable]')) {
      return { state: 'off', text: '' };
    }

    const marked = el.closest<HTMLElement>('[data-cursor]');
    const text = marked?.dataset.cursor;
    if (text && text !== 'true') return { state: 'media', text };

    const link = el.closest<HTMLElement>('a, button, [role="button"], label, summary');
    if (!link) return { state: '', text: '' };

    if (link instanceof HTMLAnchorElement && link.target === '_blank') {
      return { state: 'ext', text: '' };
    }
    return { state: 'link', text: '' };
  };

  let last = '';
  const apply = (el: Element | null) => {
    const { state, text } = resolve(el);
    const key = `${state}|${text}`;
    if (key === last) return;
    last = key;

    ring.classList.remove('is-link', 'is-media', 'is-ext', 'is-off');
    dot.classList.remove('is-off');

    if (state === 'off') {
      ring.classList.add('is-off');
      dot.classList.add('is-off');
      return;
    }
    if (state) ring.classList.add(`is-${state}`);
    if (label) label.textContent = text;
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      if (!shown) {
        shown = true;
        ring.classList.add('is-on');
        dot.classList.add('is-on');
      }

      apply(e.target as Element);
    },
    { passive: true }
  );

  window.addEventListener('pointerdown', () => ring.classList.add('is-press'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-press'));

  document.addEventListener('pointerleave', () => {
    ring.classList.remove('is-on');
    dot.classList.remove('is-on');
    shown = false;
  });

  /* Tras cambios de DOM (visor, filtros) recalcula sin esperar a moverse */
  document.addEventListener('ap:rebind', () => {
    last = '';
  });
}

/* ════════════════════════════════════════════════════════════
   13. Galería: filtros + visor
   ════════════════════════════════════════════════════════════ */
function gallery() {
  const grid = document.getElementById('gal-grid');
  if (!grid) return;

  const shots = Array.from(grid.querySelectorAll<HTMLElement>('.shot'));
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const empty = document.getElementById('gal-empty');
  let active = 'todo';

  const applyFilter = (id: string) => {
    active = id;
    const matched: HTMLElement[] = [];

    shots.forEach((shot) => {
      const ok = id === 'todo' || shot.dataset.cat === id;
      shot.hidden = !ok;
      if (ok) matched.push(shot);
    });

    if (empty) empty.hidden = matched.length > 0;

    if (!reduced) {
      gsap.fromTo(
        matched,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.02, ease: 'expo.out', overwrite: true }
      );
    }
    ScrollTrigger.refresh();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.filter === active) return;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      applyFilter(tab.dataset.filter || 'todo');
    });
  });

  // Cada tarjeta abre la sesión completa de ese proyecto en el modal
  grid.addEventListener('click', (e) => {
    const shot = (e.target as HTMLElement).closest<HTMLElement>('.shot');
    const slug = shot?.dataset.shot;
    if (!slug) return;
    window.dispatchEvent(new CustomEvent('ap:lightbox', { detail: { slug } }));
  });
}

/* ════════════════════════════════════════════════════════════
   14. Reels de Instagram
   ════════════════════════════════════════════════════════════ */
function reels() {
  const grid = document.getElementById('reels-grid');
  if (!grid) return;

  const slots = Array.from(grid.querySelectorAll<HTMLElement>('[data-reel-slot]'));
  if (!slots.length) return;

  let started = false;

  const render = () => {
    const instgrm = (window as any).instgrm;
    if (!instgrm?.Embeds) return;
    instgrm.Embeds.process();
    // El iframe tarda un poco en medirse; marcamos cuando ya hay algo
    window.setTimeout(() => {
      slots.forEach((slot) => {
        if (slot.querySelector('iframe')) slot.classList.add('is-ready');
      });
      ScrollTrigger.refresh();
    }, 900);
  };

  /* El script de Instagram solo se descarga cuando la sección se acerca:
     nadie paga ese peso si no llega hasta aquí. */
  const load = () => {
    if (started) return;
    started = true;

    const existing = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');
    if (existing) return render();

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = render;
    script.onerror = () => {
      // Sin script queda el enlace de reserva dentro del blockquote
      slots.forEach((slot) => slot.classList.add('is-ready'));
    };
    document.body.appendChild(script);
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        load();
        io.disconnect();
      }
    },
    { rootMargin: '400px' }
  );
  io.observe(grid);
}

/* ════════════════════════════════════════════════════════════
   15. Formulario → WhatsApp
   ════════════════════════════════════════════════════════════ */
function contactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const ok = document.getElementById('form-ok');
  const reset = document.getElementById('form-reset');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const nombre = String(data.get('nombre') || '').trim();
    const marca = String(data.get('marca') || '').trim();
    const servicio = String(data.get('servicio') || '');
    const mensaje = String(data.get('mensaje') || '').trim();

    const text =
      `Hola Agustín, soy ${nombre}` +
      (marca ? ` de ${marca}` : '') +
      `.\n\nServicio de interés: ${servicio}\n\n${mensaje}`;

    window.open(`https://wa.me/18494528731?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

    form.hidden = true;
    if (ok) ok.hidden = false;
    if (!reduced && ok) {
      gsap.fromTo(ok, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
    }
  });

  reset?.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    if (ok) ok.hidden = true;
  });
}

/* ════════════════════════════════════════════════════════════
   Arranque
   ════════════════════════════════════════════════════════════ */

/* Toda carga empieza por el principio de la página, igual que al pulsar
   el logo. Se respeta el ancla cuando la URL trae una (#galeria, etc.). */
function toTop() {
  if (location.hash) return;
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  } catch {
    window.scrollTo(0, 0);
  }
}

/* ScrollTrigger memoriza la posición de scroll y la reaplica en cada
   refresh; sin esto la página volvía sola a media altura tras recargar. */
ScrollTrigger.clearScrollMemory();
toTop();

/* El navegador puede recolocar la página cuando terminan de cargar las
   imágenes, así que lo reafirmamos al 'load' —pero solo si nadie se ha
   movido todavía. Escuchamos el scroll en sí, no la rueda ni el táctil:
   así también cuenta arrastrar la barra o saltar a un ancla. */
let yaSeMovio = false;
requestAnimationFrame(() => {
  window.addEventListener('scroll', () => (yaSeMovio = true), { passive: true, once: true });
});

if (document.getElementById('preloader')) document.body.classList.add('is-locked');

/* Si un módulo falla, el resto de la página debe seguir viva */
const safe = (fn: () => void) => {
  try {
    fn();
  } catch (err) {
    console.error(`[ap] ${fn.name} falló:`, err);
  }
};

[
  pageTransitions,
  navigation,
  theme,
  cursor,
  gallery,
  contactForm,
  reels,
  reveals,
  parallax,
  marquee,
  processRail,
].forEach(safe);

/* Red de seguridad: el preloader nunca puede dejar la página bloqueada */
const escapeHatch = window.setTimeout(() => {
  document.getElementById('preloader')?.remove();
  document.body.classList.remove('is-locked');
  gsap.set('.reveal, [data-reveal="mask"]', { opacity: 1, y: 0, yPercent: 0 });
}, 6000);

safe(() =>
  preloader(() => {
    window.clearTimeout(escapeHatch);
    safe(intro);
    safe(heroSlider);
    ScrollTrigger.refresh();
  })
);

window.addEventListener('load', () => {
  if (!yaSeMovio) {
    ScrollTrigger.clearScrollMemory();
    toTop();
  }
  ScrollTrigger.refresh();
});
