import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import '../styles/lightbox.css';

export interface FullShot {
  src: string;
  srcSet: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
}

export interface ProjectGroup {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  blurb: string;
  photos: FullShot[];
}

interface Props {
  groups: ProjectGroup[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: EASE, delay: 0.08 } },
};

const panel: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, y: 12, scale: 0.985, transition: { duration: 0.3, ease: EASE } },
};

const frame: Variants = {
  hidden: (dir: number) => ({
    opacity: 0,
    scale: 0.94,
    x: dir === 0 ? 0 : dir > 0 ? 70 : -70,
  }),
  show: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.65, ease: EASE } },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.97,
    x: dir === 0 ? 0 : dir > 0 ? -50 : 50,
    transition: { duration: 0.35, ease: EASE },
  }),
};

export default function Lightbox({ groups }: Props) {
  const [slug, setSlug] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [dir, setDir] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const bySlug = useMemo(() => new Map(groups.map((g) => [g.slug, g])), [groups]);
  const group = slug ? bySlug.get(slug) : undefined;
  const photo = group?.photos[cursor];
  const many = (group?.photos.length ?? 0) > 1;

  const close = useCallback(() => setSlug(null), []);

  const go = useCallback(
    (step: number) => {
      if (!group || group.photos.length < 2) return;
      setDir(step);
      setCursor((c) => (c + step + group.photos.length) % group.photos.length);
    },
    [group]
  );

  const jump = useCallback(
    (next: number) => {
      setDir(next > cursor ? 1 : next < cursor ? -1 : 0);
      setCursor(next);
    },
    [cursor]
  );

  /* La cuadrícula (script vanilla) dispara este evento con el proyecto */
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string; index?: number }>).detail;
      if (!bySlug.has(detail.slug)) return;
      setSlug(detail.slug);
      setCursor(detail.index ?? 0);
      setDir(0);
    };
    window.addEventListener('ap:lightbox', onOpen as EventListener);
    return () => window.removeEventListener('ap:lightbox', onOpen as EventListener);
  }, [bySlug]);

  /* Teclado + bloqueo de scroll */
  useEffect(() => {
    if (!group) {
      document.body.classList.remove('is-locked');
      return;
    }
    document.body.classList.add('is-locked');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [group, close, go]);

  /* Precarga de la siguiente y la anterior de la misma sesión */
  useEffect(() => {
    if (!group || group.photos.length < 2) return;
    [1, -1].forEach((step) => {
      const next = group.photos[(cursor + step + group.photos.length) % group.photos.length];
      if (next) {
        const img = new Image();
        img.src = next.src;
      }
    });
  }, [group, cursor]);

  /* Mantiene la miniatura activa a la vista dentro del carrusel */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [cursor, slug]);

  return (
    <AnimatePresence>
      {group && photo && (
        <motion.div
          className="lb"
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label={`Sesión de ${group.title}`}
        >
          <div className="lb__scrim" onClick={close} data-cursor="Cerrar" />

          <motion.div className="lb__panel" variants={panel} initial="hidden" animate="show" exit="exit">

          <header className="lb__top">
            <div className="lb__id">
              <span className="lb__brand">{group.title}</span>
              <span className="lb__sub">{group.categoryLabel}</span>
            </div>
            <button className="lb__close" onClick={close} type="button" aria-label="Cerrar (Esc)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="lb__stage">
            {many && (
              <button className="lb__side lb__side--prev" onClick={() => go(-1)} type="button" aria-label="Foto anterior">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={`${group.slug}-${cursor}`}
                className="lb__figure"
                custom={dir}
                variants={frame}
                initial="hidden"
                animate="show"
                exit="exit"
                drag={many ? 'x' : false}
                dragElastic={0.14}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70 || info.velocity.x < -420) go(1);
                  else if (info.offset.x > 70 || info.velocity.x > 420) go(-1);
                }}
              >
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="(max-width: 900px) 94vw, 76vw"
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  draggable={false}
                />
              </motion.figure>
            </AnimatePresence>

            {many && (
              <button className="lb__side lb__side--next" onClick={() => go(1)} type="button" aria-label="Foto siguiente">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          <footer className="lb__bottom">
            <p className="lb__blurb">{group.blurb}</p>

            {many && (
              <div className="lb__rail" ref={railRef} role="tablist" aria-label={`Fotos de ${group.title}`}>
                {group.photos.map((p, i) => (
                  <button
                    key={p.thumb}
                    className={`lb__thumb${i === cursor ? ' is-active' : ''}`}
                    data-active={i === cursor}
                    onClick={() => jump(i)}
                    type="button"
                    role="tab"
                    aria-selected={i === cursor}
                    aria-label={`Ver foto de ${group.title}`}
                  >
                    <img src={p.thumb} alt="" loading="lazy" draggable={false} />
                  </button>
                ))}
              </div>
            )}
          </footer>

          <motion.div
            className="lb__progress"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: group.photos.length ? (cursor + 1) / group.photos.length : 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
