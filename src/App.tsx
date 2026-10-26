import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import {
  Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Clock, Copy, Instagram,
  MapPin, Menu, MessageCircle, Navigation, Phone, Plus, X,
} from 'lucide-react';
import {
  AnimatePresence, MotionConfig, animate, motion, useReducedMotion, useScroll, useSpring,
} from 'framer-motion';

/* =========================================================
   Espaço de Beleza Diana Beatris
   ========================================================= */

const brand = 'Espaço de Beleza Diana Beatris';
const phoneDigits = '5531991157470';
const phoneDisplay = '(31) 99115-7470';
const telUrl = `tel:+${phoneDigits}`;
const address = 'Rua do Rosário, 1242, Angola, Betim - MG';
const instagramHandle = '@salaodadianabeatris';
const instagramUrl = 'https://www.instagram.com/salaodadianabeatris/';

const waLink = (text: string) => `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
const whatsappUrl = waLink(
  'Olá, Diana! Vi o site do Espaço de Beleza Diana Beatris e gostaria de saber mais sobre os serviços e horários disponíveis.',
);
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

/* Fotos reais do espaço, na pasta public/. */
const images = {
  hero: '/profissionalHero.jpeg',
  logo: '/logo.png',
};

const professionalPhotos = [
  { src: '/profissional.jpeg', alt: 'Diana Beatris, profissional da beleza' },
  { src: '/profissional1.jpeg', alt: 'Diana Beatris e seu trabalho no espaço de beleza' },
  { src: '/profissional2.jpeg', alt: 'Profissional do Espaço de Beleza Diana Beatris' },
  { src: '/profissional3.jpeg', alt: 'Retrato profissional do Espaço de Beleza Diana Beatris' },
];

type GalleryCategory = 'Alisamento' | 'Escova' | 'Transformações' | 'Unhas';
type GalleryFilter = 'Todos' | GalleryCategory;

const galleryPhotos: { src: string; alt: string; category: GalleryCategory }[] = [
  { src: '/resultado1.jpeg', alt: 'Resultado de transformação capilar', category: 'Transformações' },
  { src: '/resultado2.jpeg', alt: 'Resultado de cabelo realizado no salão', category: 'Transformações' },
  { src: '/resultado3.jpeg', alt: 'Finalização capilar', category: 'Transformações' },
  { src: '/alisamento.jpeg', alt: 'Resultado de alisamento capilar', category: 'Alisamento' },
  { src: '/alisamento1.jpeg', alt: 'Resultado de tratamento e alisamento', category: 'Alisamento' },
  { src: '/escovaModelada.jpeg', alt: 'Cabelo com escova modelada', category: 'Escova' },
  { src: '/unhas.jpeg', alt: 'Trabalho de manicure', category: 'Unhas' },
  { src: '/unhas1.jpeg', alt: 'Resultado de unhas', category: 'Unhas' },
  { src: '/unhas2.jpeg', alt: 'Trabalho de beleza das unhas', category: 'Unhas' },
  { src: '/unhas3.jpeg', alt: 'Resultado de manicure e unhas', category: 'Unhas' },
];

const galleryFilters: GalleryFilter[] = ['Todos', 'Alisamento', 'Escova', 'Transformações', 'Unhas'];

const categoryPhrase: Record<GalleryCategory, string> = {
  Alisamento: 'alisamento',
  Escova: 'escova',
  Transformações: 'transformação capilar',
  Unhas: 'unhas',
};

/* ---------- Serviços ---------- */

type ServiceCategory = 'Alongamento' | 'Cor' | 'Tratamentos' | 'Corte e escova' | 'Unhas';
type ServiceFilter = 'Todos' | ServiceCategory;

type Service = {
  id: string;
  name: string;
  description: string;
  from: number | null;
  fixed?: boolean;
  category: ServiceCategory;
};

const services: Service[] = [
  { id: 'escova', name: 'Escova', from: 55, category: 'Corte e escova', description: '' },
  { id: 'progressiva', name: 'Progressiva', from: 200, category: 'Tratamentos', description: '' },
  { id: 'botox', name: 'Botox', from: 220, category: 'Tratamentos', description: '' },
  { id: 'coloracao', name: 'Coloração', from: 120, category: 'Cor', description: 'Com tinta profissional.' },
  { id: 'mechas', name: 'Mechas/luzes', from: 380, category: 'Cor', description: '' },
  { id: 'mega-hair', name: 'Mega Hair', from: 350, category: 'Alongamento', description: '' },
  { id: 'rapunzel', name: 'Pacote Rapunzel', from: 1699, category: 'Alongamento', description: '' },
  { id: 'manicure', name: 'Manicure e pedicure', from: 70, fixed: true, category: 'Unhas', description: '' },
  { id: 'gel', name: 'Unhas em gel', from: 70, category: 'Unhas', description: '' },
  { id: 'corte', name: 'Cortes', from: 70, category: 'Corte e escova', description: '' },
  { id: 'hidratacao', name: 'Hidratação', from: 80, category: 'Tratamentos', description: '' },
];

const serviceFilters: ServiceFilter[] = ['Todos', 'Alongamento', 'Cor', 'Tratamentos', 'Corte e escova', 'Unhas'];

const brl = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const periods = [
  { id: 'qualquer', label: 'Qualquer horário', hint: '', phrase: '' },
  { id: 'manha', label: 'Manhã', hint: '8h às 12h', phrase: 'de manhã' },
  { id: 'tarde', label: 'Tarde', hint: '12h às 18h', phrase: 'à tarde' },
];

const faqItems: [string, string][] = [
  ['Como funciona o agendador do site?', 'Você escolhe os serviços, o dia e o período e envia o pedido pelo WhatsApp. A Diana confirma a disponibilidade e o horário com você.'],
  ['Os preços são fixos?', 'Os serviços informados como “a partir de” podem variar conforme o comprimento, o volume e as necessidades do cabelo ou do serviço. Manicure e pedicure têm valor de R$ 70,00. Confirme o valor final com a Diana antes do atendimento.'],
  ['O que está incluído no Pacote Rapunzel?', 'O Pacote Rapunzel reúne a venda e a aplicação de cabelos de alta qualidade, a partir de R$ 1.699,00. Converse com a Diana para conhecer as opções e os detalhes do pacote.'],
  ['Quais são os dias e horários de atendimento?', 'De terça a sábado, das 8h às 18h. Domingo e segunda o espaço fica fechado.'],
  ['Onde fica o espaço?', 'Na Rua do Rosário, 1242, bairro Angola, em Betim, Minas Gerais. Use os botões de rota para abrir o endereço no Google Maps ou no Waze.'],
  ['Preciso agendar antes de ir?', 'Sim. Chame a Diana pelo WhatsApp ou monte seu atendimento aqui no site para combinar o melhor horário.'],
];

const sections = [
  { id: 'inicio', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'rapunzel', label: 'Rapunzel' },
  { id: 'antes-depois', label: 'Antes e depois' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'agendar', label: 'Agendar' },
  { id: 'localizacao', label: 'Onde estamos' },
  { id: 'duvidas', label: 'Dúvidas' },
];
const sectionIds = sections.map((section) => section.id);

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- Horário de funcionamento em tempo real ---------- */

const TZ = 'America/Sao_Paulo';
const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

function spNow(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    day: weekdayIndex[read('weekday')] ?? 0,
    minutes: Number(read('hour')) * 60 + Number(read('minute')),
  };
}

type OpenStatus = { open: boolean; text: string; detail: string };

function getOpenStatus(): OpenStatus {
  const { day, minutes } = spNow();
  const workDay = day >= 2 && day <= 6;

  if (workDay && minutes >= 8 * 60 && minutes < 18 * 60) {
    return { open: true, text: 'Aberto agora', detail: 'Atendemos até as 18h' };
  }

  let ahead = 0;
  if (!(workDay && minutes < 8 * 60)) {
    for (ahead = 1; ahead <= 7; ahead += 1) {
      const next = (day + ahead) % 7;
      if (next >= 2 && next <= 6) break;
    }
  }

  const target = (day + ahead) % 7;
  const when = ahead === 0 ? 'hoje' : ahead === 1 ? 'amanhã' : dayNames[target];
  return { open: false, text: 'Fechado agora', detail: `Abrimos ${when} às 8h` };
}

function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus>(getOpenStatus);

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}

/* Próximos dias de atendimento (terça a sábado) para o agendador. */
type BookingDay = { key: string; weekday: string; number: number; month: string; full: string; today: boolean };

function getBookingDays(count: number): BookingDay[] {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date()).split('-').map(Number);
  const { minutes } = spNow();
  const days: BookingDay[] = [];

  for (let i = 0; days.length < count && i < 40; i += 1) {
    const date = new Date(Date.UTC(y, m - 1, d + i, 12));
    const weekday = date.getUTCDay();
    if (weekday < 2 || weekday > 6) continue;
    if (i === 0 && minutes >= 17 * 60) continue;

    days.push({
      key: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }).replace('.', ''),
      number: date.getUTCDate(),
      month: date.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', ''),
      full: date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }),
      today: i === 0,
    });
  }

  return days;
}

/* ---------- Utilidades ---------- */

function trackPointer(event: ReactPointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function shouldShowIntro() {
  return typeof window !== 'undefined';
}

/* =========================================================
   Componentes
   ========================================================= */

function StatusChip({ status }: { status: OpenStatus }) {
  return (
    <p className={`status-chip ${status.open ? 'is-open' : 'is-closed'}`}>
      <span className="status-dot" aria-hidden="true" />
      <strong>{status.text}</strong>
      <span>{status.detail}</span>
    </p>
  );
}

function PageTape({ active, progress }: { active: string; progress: ReturnType<typeof useSpring> }) {
  return (
    <nav className="tape" aria-label="Seções da página">
      <div className="tape-rail" aria-hidden="true">
        <motion.span style={{ scaleY: progress }} />
      </div>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={active === section.id ? 'is-active' : ''}
              aria-current={active === section.id ? 'true' : undefined}
            >
              <span>{section.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Simulador de comprimento ---------- */

const SIM_MIN = 190;
const SIM_MAX = 470;
const SIM_H = 520;
const landmarks = [
  { label: 'Ombros', y: 205 },
  { label: 'Meio das costas', y: 300 },
  { label: 'Cintura', y: 375 },
  { label: 'Quadril', y: 450 },
];

const labelForY = (y: number) =>
  landmarks.reduce((best, item) => (Math.abs(item.y - y) < Math.abs(best.y - y) ? item : best), landmarks[0]).label;

const clampY = (y: number) => Math.min(SIM_MAX, Math.max(SIM_MIN, y));

function hairPath(end: number) {
  const span = end - 136;
  const a = 112 + span * 0.3;
  const b = 112 + span * 0.7;
  const xs = [94, 116, 138, 160, 182, 204, 226];
  let d = `M160 38 C118 38 98 74 100 112 C97 ${a} 91 ${b} 94 ${end - 8}`;

  for (let i = 1; i < xs.length; i += 1) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    const cy = end + (i % 2 === 1 ? 9 : -4);
    const y = end - 6 + (i % 2 === 1 ? 2 : 0);
    d += ` Q${cx} ${cy} ${xs[i]} ${y}`;
  }

  return `${d} C229 ${b} 223 ${a} 220 112 C222 74 202 38 160 38 Z`;
}

function strandPaths(end: number) {
  return [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const t = i / 7;
    const xt = 126 + t * 68;
    const xb = 98 + t * 124;
    const wave = (i % 2 === 1 ? 1 : -1) * 6;
    return `M${xt} 44 C${xt + (t - 0.5) * -14} ${end * 0.28} ${xb + wave} ${end * 0.6} ${xb} ${end - 4}`;
  });
}

function HairSimulator({
  rapunzelOn,
  onToggleRapunzel,
  onPick,
}: {
  rapunzelOn: boolean;
  onToggleRapunzel: () => void;
  onPick: (label: string) => void;
}) {
  const [endY, setEndY] = useState(375);
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const tween = useRef<{ stop: () => void } | null>(null);

  const label = labelForY(endY);
  const shape = hairPath(endY);

  const update = (y: number) => {
    const next = clampY(y);
    setEndY(next);
    onPick(labelForY(next));
  };

  const goTo = (y: number) => {
    tween.current?.stop();
    if (reduceMotion) {
      update(y);
      return;
    }
    onPick(labelForY(y));
    tween.current = animate(endY, y, { duration: 0.8, ease, onUpdate: (value) => setEndY(value) });
  };

  const fromPointer = (clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    update(((clientY - rect.top) / rect.height) * SIM_H);
  };

  return (
    <div className="rapunzel-grid">
      <div className="rapunzel-copy">
        <h2>Até onde vai o seu sonho?</h2>
        <p className="lead">
          Pacote Rapunzel: venda e aplicação de cabelos de alta qualidade, selecionados para
          beleza, comprimento, volume e um resultado sofisticado.
        </p>

        <div className="sim-readout" aria-live="polite">
          <span>Comprimento escolhido</span>
          <strong>{label}</strong>
        </div>

        <label className="sim-slider">
          <span className="sr-only">Comprimento do cabelo</span>
          <input
            type="range"
            min={SIM_MIN}
            max={SIM_MAX}
            step={1}
            value={Math.round(endY)}
            aria-valuetext={label}
            onChange={(event) => {
              tween.current?.stop();
              update(Number(event.target.value));
            }}
          />
          <span className="sim-slider-hint">Arraste a régua ou toque em uma altura do corpo.</span>
        </label>

        <dl className="sim-prices">
          <div>
            <dt>Mega Hair</dt>
            <dd>a partir de {brl(350)}</dd>
          </div>
          <div>
            <dt>Pacote Rapunzel</dt>
            <dd>a partir de {brl(1699)}</dd>
          </div>
        </dl>
        <p className="fine">
          O valor final depende do comprimento, do volume e do tipo de cabelo. A Diana confirma tudo no WhatsApp.
        </p>

        <div className="sim-actions">
          <a
            className="btn btn-gold"
            href={waLink(
              `Olá, Diana! Quero Mega Hair ou Pacote Rapunzel com o cabelo na altura de ${label.toLowerCase()}. Pode me passar os valores e os horários disponíveis?`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> Pedir orçamento deste comprimento
          </a>
          <button type="button" className={`btn btn-ghost ${rapunzelOn ? 'is-on' : ''}`} onClick={onToggleRapunzel}>
            {rapunzelOn ? <Check size={18} /> : <Plus size={18} />}
            {rapunzelOn ? 'Pacote Rapunzel no seu atendimento' : 'Adicionar o Pacote Rapunzel'}
          </button>
        </div>
      </div>

      <div className="sim-wrap">
        <div className="sim-rule">
          {landmarks.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sim-mark ${label === item.label ? 'is-active' : ''}`}
              style={{ top: `${(item.y / SIM_H) * 100}%` }}
              onClick={() => goTo(item.y)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="sim-stage" ref={stageRef}>
          <svg viewBox={`0 0 320 ${SIM_H}`} role="img" aria-label={`Silhueta com cabelo na altura de ${label.toLowerCase()}`}>
            <defs>
              <linearGradient id="simHair" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2e2108" />
                <stop offset="0.5" stopColor="#8a6a24" />
                <stop offset="1" stopColor="#d9b765" />
              </linearGradient>
              <filter id="simGlow" x="-40%" y="-10%" width="180%" height="130%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <clipPath id="simClip">
                <path d={shape} />
              </clipPath>
            </defs>

            <g fill="rgba(243,234,217,0.04)" stroke="rgba(243,234,217,0.28)" strokeWidth="1">
              <path d="M146 150 L146 176 C110 184 78 196 72 226 C70 260 84 300 96 340 C102 364 104 390 98 420 C94 438 92 456 96 500 L224 500 C228 456 226 438 222 420 C216 390 218 364 224 340 C236 300 250 260 248 226 C242 196 210 184 174 176 L174 150" />
              <ellipse cx="160" cy="98" rx="40" ry="50" />
            </g>

            <path d={shape} fill="#c9a24b" opacity="0.32" filter="url(#simGlow)" />
            <path d={shape} fill="url(#simHair)" />
            <g clipPath="url(#simClip)" fill="none" strokeLinecap="round">
              {strandPaths(endY).map((d, index) => (
                <path key={d + index} d={d} stroke="#f0d58a" strokeWidth="0.9" opacity={index % 2 === 0 ? 0.55 : 0.28} />
              ))}
            </g>

            <line x1="26" x2="294" y1={endY} y2={endY} stroke="#f0d58a" strokeWidth="1" strokeDasharray="2 6" opacity="0.8" />
          </svg>

          <div
            className="sim-handle"
            style={{ top: `${(endY / SIM_H) * 100}%` }}
            aria-hidden="true"
            onPointerDown={(event) => {
              dragging.current = true;
              tween.current?.stop();
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => { if (dragging.current) fromPointer(event.clientY); }}
            onPointerUp={() => { dragging.current = false; }}
            onPointerCancel={() => { dragging.current = false; }}
          >
            <ChevronsUpDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}



/* ---------- Antes e depois interativo ---------- */

const beforeAfterPhotos = [
  { src: '/antesDepoisMegaHair.jpeg', title: 'Transformação Mega Hair 01', alt: 'Colagem de antes e depois de Mega Hair' },
  { src: '/antesDepoisMegaHair1.jpeg', title: 'Transformação Mega Hair 02', alt: 'Colagem de antes e depois de Mega Hair' },
];

function BeforeAfter() {
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState(50);
  const active = beforeAfterPhotos[selected];

  return (
    <section id="antes-depois" className="before-after sec">
      <div className="page-width">
        <header className="sec-head">
          <span className="eyebrow">Resultados reais</span>
          <h2>Antes & depois</h2>
          <p>Escolha uma transformação e revele a foto aos poucos para ver o resultado completo.</p>
        </header>

        <div className="before-after-choices" role="group" aria-label="Escolha uma transformação">
          {beforeAfterPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`before-after-choice ${selected === index ? 'is-active' : ''}`}
              aria-pressed={selected === index}
              onClick={() => { setSelected(index); setPosition(50); }}
            >
              <span>Transformação {String(index + 1).padStart(2, '0')}</span>
              <strong>{photo.title}</strong>
            </button>
          ))}
        </div>

        <div className="before-after-card">
          <div
            className="before-after-compare"
            style={{ '--compare-position': `${position}%` } as CSSProperties}
          >
            <div className="before-after-photo-frame">
              <img className="before-after-photo" src={active.src} alt={active.alt} draggable={false} />
            </div>
            <span className="before-after-label before">ANTES</span>
            <span className="before-after-label after">DEPOIS</span>
            <div className="before-after-divider" aria-hidden="true">
              <span>↔</span>
            </div>
            <input
              className="before-after-range"
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label="Arraste para revelar a foto do antes ao depois"
            />
          </div>
          <p className="before-after-hint">Arraste a linha para revelar a foto do antes ao depois.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Galeria com visualização ampliada ---------- */

function Gallery() {
  const [filter, setFilter] = useState<GalleryFilter>('Todos');
  const [limit, setLimit] = useState(8);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const swipeStart = useRef<number | null>(null);

  const list = filter === 'Todos' ? galleryPhotos : galleryPhotos.filter((photo) => photo.category === filter);
  const shown = list.slice(0, limit);
  const isOpen = openIndex !== null;
  const listLength = list.length;
  const current = openIndex !== null ? list[openIndex] : null;

  const closeLightbox = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback((delta: number) => {
    setOpenIndex((index) => (index === null ? index : (index + delta + listLength) % listLength));
  }, [listLength]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeLightbox, step]);

  return (
    <>
      <div className="chips" role="group" aria-label="Filtrar fotos">
        {galleryFilters.map((item) => (
          <button
            key={item}
            type="button"
            className={`chip ${filter === item ? 'is-active' : ''}`}
            aria-pressed={filter === item}
            onClick={() => { setFilter(item); setLimit(8); }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="shots">
        {shown.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className="shot"
            aria-label={`Ampliar foto: ${photo.alt}`}
            onClick={(event) => { triggerRef.current = event.currentTarget; setOpenIndex(index); }}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
            <span>{photo.category}</span>
          </button>
        ))}
      </div>

      {list.length > limit && (
        <button type="button" className="btn btn-ghost shots-more" onClick={() => setLimit(list.length)}>
          Ver todas as fotos ({list.length})
        </button>
      )}

      <AnimatePresence>
        {current && openIndex !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Foto ampliada"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="lightbox-top">
              <span>{openIndex + 1} de {listLength}</span>
              <button ref={closeRef} type="button" className="icon-btn" onClick={closeLightbox} aria-label="Fechar foto">
                <X size={22} />
              </button>
            </div>

            <div
              className="lightbox-stage"
              onPointerDown={(event) => { swipeStart.current = event.clientX; }}
              onPointerUp={(event) => {
                if (swipeStart.current === null) return;
                const delta = event.clientX - swipeStart.current;
                swipeStart.current = null;
                if (delta > 60) step(-1);
                if (delta < -60) step(1);
              }}
            >
              <button type="button" className="icon-btn lightbox-arrow" onClick={() => step(-1)} aria-label="Foto anterior">
                <ChevronLeft size={26} />
              </button>

              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease }}
                draggable={false}
              />

              <button type="button" className="icon-btn lightbox-arrow" onClick={() => step(1)} aria-label="Próxima foto">
                <ChevronRight size={26} />
              </button>
            </div>

            <div className="lightbox-bottom">
              <p>{current.alt}</p>
              <a
                className="btn btn-gold"
                href={waLink(`Olá, Diana! Vi uma foto de ${categoryPhrase[current.category]} no seu site e quero um resultado assim. Pode me passar valores e horários?`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> Quero um resultado assim
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Fotos da Diana: pilha que se arrasta ---------- */

function PhotoDeck() {
  const [order, setOrder] = useState(() => professionalPhotos.map((_, index) => index));
  const next = () => setOrder((current) => [...current.slice(1), current[0]]);
  const prev = () => setOrder((current) => [current[current.length - 1], ...current.slice(0, -1)]);

  return (
    <div className="deck">
      <div className="deck-stage">
        {professionalPhotos.map((photo, index) => {
          const pos = order.indexOf(index);
          const isTop = pos === 0;

          return (
            <motion.figure
              key={photo.src}
              className="deck-card"
              style={{ zIndex: order.length - pos }}
              animate={{
                scale: 1 - pos * 0.045,
                y: pos * 18,
                rotate: isTop ? 0 : (pos % 2 === 1 ? 2.4 : -2.4) * pos * 0.7,
                opacity: pos > 2 ? 0 : 1,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              drag={isTop ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.7}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) next();
              }}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable={false} />
            </motion.figure>
          );
        })}
      </div>

      <div className="deck-controls">
        <button type="button" className="icon-btn" onClick={prev} aria-label="Foto anterior">
          <ChevronLeft size={20} />
        </button>
        <span>
          {order[0] + 1} de {professionalPhotos.length}
          <small>Arraste a foto para ver a próxima</small>
        </span>
        <button type="button" className="icon-btn" onClick={next} aria-label="Próxima foto">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   Página
   ========================================================= */

type WatchKey = 'hero' | 'agendar' | 'footer' | 'cta';

export default function App() {
  const [introVisible, setIntroVisible] = useState(shouldShowIntro);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('Todos');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [selected, setSelected] = useState<string[]>([]);
  const [hairLength, setHairLength] = useState<string | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [period, setPeriod] = useState('qualquer');
  const [clientName, setClientName] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [seen, setSeen] = useState<Record<WatchKey, boolean>>({ hero: true, agendar: false, footer: false, cta: false });

  const heroRef = useRef<HTMLElement>(null);
  const agendarRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const status = useOpenStatus();
  const activeSection = useActiveSection(sectionIds);
  const bookingDays = useMemo(() => getBookingDays(10), []);

  const { scrollYProgress } = useScroll();
  const tapeFill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  }, []);

  /* Título e descrição da página */
  useEffect(() => {
    document.title = 'Espaço de Beleza Diana Beatris | Mega Hair e Pacote Rapunzel em Betim';
    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setMeta('description', 'Mega Hair, Pacote Rapunzel, coloração, progressiva, botox e hidratação em Betim. Monte seu atendimento e agende pelo WhatsApp. Terça a sábado, das 8h às 18h.');
    setMeta('theme-color', '#000000');
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  /* Splash Screen: aparece na entrada e some suavemente após a apresentação da marca. */
  useEffect(() => {
    if (!introVisible) return;
    const timer = window.setTimeout(() => setIntroVisible(false), 2800);
    const skip = () => setIntroVisible(false);
    window.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
    };
  }, [introVisible]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  /* Os botões flutuantes só aparecem quando não há outro botão de agendar na tela. */
  useEffect(() => {
    const targets: [WatchKey, HTMLElement | null][] = [
      ['hero', heroRef.current],
      ['agendar', agendarRef.current],
      ['cta', ctaRef.current],
      ['footer', footerRef.current],
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        setSeen((current) => {
          const next = { ...current };
          entries.forEach((entry) => {
            const key = (entry.target as HTMLElement).dataset.watch as WatchKey | undefined;
            if (key) next[key] = entry.isIntersecting;
          });
          return next;
        });
      },
      { threshold: 0.05 },
    );

    targets.forEach(([key, element]) => {
      if (element) {
        element.dataset.watch = key;
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  /* ---------- Seleção de serviços ---------- */

  const toggleService = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
      return;
    }

    let next = [...selected, id];
    const swapped = (id === 'rapunzel' && selected.includes('mega-hair')) || (id === 'mega-hair' && selected.includes('rapunzel'));

    if (id === 'rapunzel') next = next.filter((item) => item !== 'mega-hair');
    if (id === 'mega-hair') next = next.filter((item) => item !== 'rapunzel');
    if (swapped) showToast('Mega Hair e Pacote Rapunzel não se somam, então troquei um pelo outro.');

    setSelected(next);
  };

  const selectedServices = selected
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is Service => service !== undefined);

  const totalFrom = selectedServices.reduce((sum, service) => sum + (service.from ?? 0), 0);
  const hasConsult = selectedServices.some((service) => service.from === null);

  const totalLabel =
    selectedServices.length === 0
      ? ''
      : totalFrom === 0
        ? 'valor sob consulta'
        : `a partir de ${brl(totalFrom)}${hasConsult ? ' + itens sob consulta' : ''}`;

  const filteredServices =
    serviceFilter === 'Todos' ? services : services.filter((service) => service.category === serviceFilter);

  const rapunzelOn = selected.includes('rapunzel');

  /* ---------- Mensagem do agendador ---------- */

  const bookingMessage = useMemo(() => {
    const lines: string[] = [];
    const name = clientName.trim();
    lines.push(name ? `Olá, Diana! Aqui é ${name}.` : 'Olá, Diana!');
    lines.push('Gostaria de agendar:');

    selectedServices.forEach((service) => {
      lines.push(`• ${service.name} ${service.from !== null ? `(${service.fixed ? brl(service.from) : `a partir de ${brl(service.from)}`})` : '(valor sob consulta)'}`);
    });

    if (totalLabel) lines.push(`Estimativa inicial: ${totalLabel}.`);

    if (hairLength && (selected.includes('mega-hair') || selected.includes('rapunzel'))) {
      lines.push(`Comprimento desejado: na altura de ${hairLength.toLowerCase()}.`);
    }

    const day = bookingDays.find((item) => item.key === dayKey);
    const when = periods.find((item) => item.id === period);
    const preference = [day ? day.full : '', when && when.phrase ? when.phrase : ''].filter(Boolean).join(', ');
    lines.push(preference ? `Preferência: ${preference}.` : 'Sem preferência de dia ou horário.');
    lines.push('Pode me confirmar a disponibilidade?');

    return lines.join('\n');
  }, [clientName, selectedServices, selected, totalLabel, hairLength, bookingDays, dayKey, period]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      showToast('Endereço copiado.');
    } catch {
      showToast('Não foi possível copiar. Toque e segure o endereço para copiar.');
    }
  };

  const dockVisible = !seen.hero && !seen.agendar && !seen.cta && !seen.footer && !menuOpen && !introVisible;
  const barVisible = selected.length > 0 && !seen.agendar && !seen.footer && !menuOpen && !introVisible;

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-shell ${introVisible ? 'site-is-intro' : 'site-is-ready'}`} aria-busy={introVisible}>
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>

        <AnimatePresence>
          {introVisible && (
            <motion.div
              className="intro"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
              onClick={() => setIntroVisible(false)}
              aria-label={brand}
            >
              <motion.div
                className="intro-logo"
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.9, ease }}
              >
                <img src={images.logo} alt="" aria-hidden="true" />
              </motion.div>
              <motion.small initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.65, ease }}>
                Espaço de Beleza
              </motion.small>
              <motion.strong initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease }}>
                Diana Beatris
              </motion.strong>
              <motion.span className="intro-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.9, ease }} />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}>
                Mega Hair em Betim
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="site-content"
          initial={false}
          animate={{ opacity: introVisible ? 0 : 1 }}
          transition={{ duration: 0.6, delay: introVisible ? 0 : 0.05 }}
          style={{ pointerEvents: introVisible ? 'none' : 'auto' }}
        >
          <header className={`site-nav ${navSolid || menuOpen ? 'is-solid' : ''}`}>
            <a href="#inicio" className="nav-brand" onClick={closeMenu} aria-label={`${brand}, início`}>
              <img src={images.logo} alt={brand} />
            </a>

            <nav className="nav-links" aria-label="Navegação principal">
              <a href="#servicos">Serviços</a>
              <a href="#rapunzel">Pacote Rapunzel</a>
              <a href="#galeria">Galeria</a>
              <a href="#sobre">Sobre a Diana</a>
              <a href="#localizacao">Onde estamos</a>
            </nav>

            <div className="nav-actions">
              <a href="#agendar" className="btn btn-gold nav-cta">Agendar horário</a>
              <button
                ref={menuButtonRef}
                type="button"
                className="icon-btn menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </header>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="menu-mobile"
                className="mobile-menu"
                aria-label="Menu mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {[
                  ['Serviços', '#servicos'],
                  ['Pacote Rapunzel', '#rapunzel'],
                  ['Galeria', '#galeria'],
                  ['Sobre a Diana', '#sobre'],
                  ['Agendar horário', '#agendar'],
                  ['Onde estamos', '#localizacao'],
                ].map(([label, href]) => (
                  <a key={href} href={href} onClick={closeMenu}>{label}</a>
                ))}

                <div className="mobile-menu-foot">
                  <StatusChip status={status} />
                  <a href={telUrl}><Phone size={18} /> {phoneDisplay}</a>
                  <a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={18} /> {instagramHandle}</a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          <PageTape active={activeSection} progress={tapeFill} />

          <main id="conteudo" tabIndex={-1}>
            {/* ---------- Início ---------- */}
            <section ref={heroRef} id="inicio" className={`hero ${introVisible ? '' : 'is-in'}`} onPointerMove={trackPointer}>
              <svg className="hero-strands" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <linearGradient id="strandGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f0d58a" />
                    <stop offset="0.55" stopColor="#c9a24b" />
                    <stop offset="1" stopColor="#8a6a24" />
                  </linearGradient>
                </defs>
                {[
                  'M1180 -40 C1020 160 1090 330 900 470 S520 640 300 840',
                  'M1120 -60 C960 140 1040 320 840 460 S470 650 230 850',
                  'M1240 20 C1060 220 1130 360 960 500 S600 660 420 850',
                  'M1000 -80 C860 120 930 300 740 430 S400 620 160 840',
                  'M1300 120 C1120 280 1160 420 1010 540 S700 690 560 860',
                  'M900 -90 C780 80 840 260 650 390 S330 590 80 820',
                ].map((d, index) => (
                  <path
                    key={d}
                    className="strand"
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="url(#strandGold)"
                    strokeWidth={index % 3 === 0 ? 1.6 : 0.9}
                    style={{ '--i': index } as CSSProperties}
                  />
                ))}
              </svg>

              <div className="page-width hero-layout">
                <div className="hero-photo hero-rise" style={{ '--d': '0.4s' } as CSSProperties}>
                  <img src={images.hero} alt="Imagem de abertura do Espaço de Beleza Diana Beatris" fetchPriority="high" decoding="async" />
                </div>

                <div className="hero-inner">
                <div className="hero-rise" style={{ '--d': '0.9s' } as CSSProperties}>
                  <StatusChip status={status} />
                </div>

                <h1>
                  <span className="hero-line"><span>Beleza, sofisticação</span></span>
                  <span className="hero-line hero-line-gold"><span>e cabelos dos sonhos.</span></span>
                </h1>

                <p className="hero-lead hero-rise" style={{ '--d': '1.05s' } as CSSProperties}>
                  Espaço de Beleza Diana Beatris. Mega Hair, Pacote Rapunzel, cor, alisamentos e tratamentos em Betim.
                </p>

                <div className="hero-actions hero-rise" style={{ '--d': '1.2s' } as CSSProperties}>
                  <a className="btn btn-gold" href="#agendar">Montar meu atendimento</a>
                  <a className="btn btn-ghost" href={whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageCircle size={18} /> Chamar no WhatsApp
                  </a>
                </div>
              </div>

              <ul className="hero-facts hero-rise" style={{ '--d': '1.4s' } as CSSProperties}>
                <li><Clock size={16} /> Terça a sábado, 8h às 18h</li>
                <li><MapPin size={16} /> Angola, Betim</li>
                <li><Phone size={16} /> <a href={telUrl}>{phoneDisplay}</a></li>
              </ul>
              </div>
            </section>

            {/* ---------- Manifesto ---------- */}
            <section className="manifesto sec">
              <div className="page-width">
                <blockquote>
                  <p>
                    Mais do que transformar cabelos, nosso propósito é transformar a maneira como você se sente:
                    mais bonita, confiante e poderosa.
                  </p>
                  <footer>Diana Beatris</footer>
                </blockquote>
              </div>
            </section>

            {/* ---------- Serviços ---------- */}
            <section id="servicos" className="services sec">
              <div className="page-width">
                <header className="sec-head">
                  <h2>Monte o seu atendimento.</h2>
                  <p>
                    Toque em Adicionar para somar os serviços e ver a estimativa. Os valores indicados como “a partir de” podem variar conforme o serviço.
                  </p>
                </header>

                <div className="chips" role="group" aria-label="Filtrar serviços">
                  {serviceFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`chip ${serviceFilter === filter ? 'is-active' : ''}`}
                      aria-pressed={serviceFilter === filter}
                      onClick={() => setServiceFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <ul className="menu-list">
                  {filteredServices.map((service) => {
                    const on = selected.includes(service.id);

                    return (
                      <li key={service.id} className={`menu-row ${on ? 'is-on' : ''}`} onPointerMove={trackPointer}>
                        <div className="menu-head">
                          <h3>{service.name}</h3>
                          <span className="menu-leader" aria-hidden="true" />
                          <p className="menu-price">
                            {service.from !== null ? (
                              <>
                                <small>{service.fixed ? 'valor' : 'a partir de'}</small>
                                <strong>{brl(service.from)}</strong>
                              </>
                            ) : (
                              <strong>Sob consulta</strong>
                            )}
                          </p>
                        </div>

                        {service.description && <p className="menu-desc">{service.description}</p>}

                        <button
                          type="button"
                          className="add"
                          aria-label={on ? `Adicionado: ${service.name}. Toque para remover` : `Adicionar ${service.name}`}
                          onClick={() => toggleService(service.id)}
                        >
                          {on ? <Check size={17} /> : <Plus size={17} />}
                          <span>{on ? 'Adicionado' : 'Adicionar'}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p className="fine">
                  Valores iniciais. Confirme o preço final, a disponibilidade e os detalhes diretamente com a Diana.{' '}
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">Não achou o que procura? Fale com a Diana.</a>
                </p>
              </div>
            </section>

            {/* ---------- Pacote Rapunzel + simulador ---------- */}
            <section id="rapunzel" className="rapunzel sec">
              <div className="page-width">
                <HairSimulator
                  rapunzelOn={rapunzelOn}
                  onToggleRapunzel={() => toggleService('rapunzel')}
                  onPick={setHairLength}
                />
              </div>
            </section>

            {/* ---------- Antes e depois ---------- */}
            <BeforeAfter />

            {/* ---------- Galeria ---------- */}
            <section id="galeria" className="gallery sec">
              <div className="page-width">
                <header className="sec-head">
                  <h2>Galeria</h2>
                  <p>Registros do trabalho do espaço. Toque em uma foto para ampliar.</p>
                </header>
                <Gallery />
              </div>
            </section>

            {/* ---------- Sobre ---------- */}
            <section id="sobre" className="about sec">
              <div className="page-width about-grid">
                <PhotoDeck />

                <div className="about-copy">
                  <h2>Diana Beatris</h2>
                  <p className="about-role">Profissional da beleza e especialista em Mega Hair</p>

                  <p>
                    Sou apaixonada por transformar cabelos, realçar a beleza feminina e elevar a autoestima de cada cliente.
                  </p>
                  <p>
                    No Espaço de Beleza Diana Beatris, cada atendimento é pensado com carinho, dedicação e atenção aos
                    detalhes, com experiências personalizadas e resultados que valorizam a beleza e a essência de cada mulher.
                  </p>
                  <p>
                    Somos especialistas em Mega Hair e trabalhamos com diferentes técnicas de alongamento capilar, sempre
                    buscando naturalidade, harmonia e excelência nos resultados.
                  </p>
                  <p>
                    Contamos também com escova, coloração, progressivas, botox capilar e hidratação, cuidando dos seus cabelos em cada etapa.
                  </p>

                  <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
                    <Instagram size={18} /> Acompanhe {instagramHandle} no Instagram
                  </a>
                </div>
              </div>
            </section>

            {/* ---------- Agendar ---------- */}
            <section ref={agendarRef} id="agendar" className="book sec">
              <div className="page-width">
                <header className="sec-head">
                  <h2>Peça seu horário em 3 passos.</h2>
                  <p>O pedido segue pelo WhatsApp e a Diana confirma a disponibilidade com você.</p>
                </header>

                <div className="book-grid">
                  <div className="book-steps">
                    <fieldset className="step">
                      <legend><b>1</b> O que você quer fazer?</legend>
                      <div className="chips chips-wrap">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            className={`chip ${selected.includes(service.id) ? 'is-active' : ''}`}
                            aria-pressed={selected.includes(service.id)}
                            onClick={() => toggleService(service.id)}
                          >
                            {service.name}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className="step">
                      <legend><b>2</b> Qual dia e período você prefere?</legend>
                      <div className="days" role="group" aria-label="Dias de atendimento">
                        {bookingDays.map((day) => (
                          <button
                            key={day.key}
                            type="button"
                            className={`day ${dayKey === day.key ? 'is-active' : ''}`}
                            aria-pressed={dayKey === day.key}
                            aria-label={day.full}
                            onClick={() => setDayKey(dayKey === day.key ? null : day.key)}
                          >
                            <small>{day.today ? 'hoje' : day.weekday}</small>
                            <strong>{day.number}</strong>
                            <small>{day.month}</small>
                          </button>
                        ))}
                      </div>

                      <div className="chips chips-wrap" role="group" aria-label="Período">
                        {periods.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={`chip ${period === item.id ? 'is-active' : ''}`}
                            aria-pressed={period === item.id}
                            onClick={() => setPeriod(item.id)}
                          >
                            {item.label}
                            {item.hint && <small>{item.hint}</small>}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="step">
                      <label htmlFor="nome"><b>3</b> Como a Diana pode te chamar?</label>
                      <input
                        id="nome"
                        type="text"
                        className="field"
                        placeholder="Seu nome"
                        autoComplete="given-name"
                        value={clientName}
                        onChange={(event) => setClientName(event.target.value)}
                      />
                    </div>
                  </div>

                  <aside className="summary" aria-label="Resumo do atendimento">
                    <h3>Seu atendimento</h3>

                    {selectedServices.length === 0 ? (
                      <p className="summary-empty">Nenhum serviço ainda. Escolha no passo 1 ou na lista de serviços.</p>
                    ) : (
                      <ul className="summary-list">
                        {selectedServices.map((service) => (
                          <li key={service.id}>
                            <span>{service.name}</span>
                            <em>{service.from !== null ? brl(service.from) : 'sob consulta'}</em>
                            <button type="button" className="icon-btn icon-btn-sm" onClick={() => toggleService(service.id)} aria-label={`Remover ${service.name}`}>
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {totalLabel && (
                      <p className="summary-total">
                        <span>Estimativa inicial</span>
                        <strong>{totalLabel}</strong>
                      </p>
                    )}

                    <p className="summary-pref">
                      {dayKey ? bookingDays.find((day) => day.key === dayKey)?.full : 'Sem dia definido'}
                      {period !== 'qualquer' ? `, ${periods.find((item) => item.id === period)?.phrase}` : ''}
                    </p>

                    {selectedServices.length > 0 ? (
                      <a className="btn btn-gold btn-block" href={waLink(bookingMessage)} target="_blank" rel="noreferrer">
                        <MessageCircle size={18} /> Enviar pedido pelo WhatsApp
                      </a>
                    ) : (
                      <button type="button" className="btn btn-gold btn-block" disabled>
                        Escolha um serviço para continuar
                      </button>
                    )}

                    <p className="fine">Isto é um pedido de horário, não uma reserva. A Diana confirma pelo WhatsApp.</p>
                  </aside>
                </div>
              </div>
            </section>

            {/* ---------- Onde estamos ---------- */}
            <section id="localizacao" className="place sec">
              <div className="page-width place-grid">
                <div className="place-info">
                  <h2>Rua do Rosário, 1242</h2>
                  <p className="place-sub">Bairro Angola, Betim, Minas Gerais</p>

                  <StatusChip status={status} />

                  <dl className="hours">
                    <div><dt>Terça a sábado</dt><dd>8h às 18h</dd></div>
                    <div><dt>Domingo e segunda</dt><dd>Fechado</dd></div>
                  </dl>

                  <div className="place-actions">
                    <a className="btn btn-gold" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Google Maps</a>
                    <a className="btn btn-waze" href={wazeUrl} target="_blank" rel="noreferrer"><Navigation size={18} /> Waze</a>
                    <button type="button" className="btn btn-ghost" onClick={copyAddress}><Copy size={18} /> Copiar endereço</button>
                    <a className="btn btn-call" href={telUrl}><Phone size={18} /> Ligar</a>
                  </div>
                </div>

                <div className="place-map">
                  <iframe
                    title="Localização do Espaço de Beleza Diana Beatris"
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </section>

            {/* ---------- Dúvidas ---------- */}
            <section id="duvidas" className="faq sec">
              <div className="page-width faq-grid">
                <header className="sec-head">
                  <h2>Dúvidas</h2>
                  <p>
                    Não encontrou a sua?{' '}
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">Pergunte para a Diana.</a>
                  </p>
                </header>

                <div className="faq-list">
                  {faqItems.map(([question, answer], index) => {
                    const open = openFaq === index;

                    return (
                      <div className={`faq-item ${open ? 'is-open' : ''}`} key={question}>
                        <h3>
                          <button
                            type="button"
                            id={`faq-q-${index}`}
                            aria-expanded={open}
                            aria-controls={`faq-a-${index}`}
                            onClick={() => setOpenFaq(open ? null : index)}
                          >
                            <span>{question}</span>
                            <ChevronDown size={20} />
                          </button>
                        </h3>
                        <div className="faq-panel" id={`faq-a-${index}`} role="region" aria-labelledby={`faq-q-${index}`}>
                          <div><p>{answer}</p></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ---------- Chamada final ---------- */}
            <section ref={ctaRef} className="cta">
              <div className="page-width cta-inner">
                <h2>Seu sonho de cabelo longo, bonito e saudável começa aqui.</h2>
                <div className="cta-actions">
                  <a className="btn btn-dark" href="#agendar">Montar meu atendimento</a>
                  <a className="btn btn-outline-dark" href={instagramUrl} target="_blank" rel="noreferrer">
                    <Instagram size={18} /> {instagramHandle}
                  </a>
                </div>
              </div>
            </section>
          </main>

          <footer ref={footerRef} className="footer">
            <div className="page-width footer-grid">
              <a href="#inicio" className="footer-brand" aria-label="Voltar ao início">
                <img src={images.logo} alt={brand} />
              </a>

              <div>
                <h3>Horário</h3>
                <p>Terça a sábado<br />8h às 18h</p>
              </div>

              <div>
                <h3>Contato</h3>
                <p>
                  <a href={telUrl}>{phoneDisplay}</a><br />
                  <a href={instagramUrl} target="_blank" rel="noreferrer">{instagramHandle}</a>
                </p>
              </div>

              <div>
                <h3>Endereço</h3>
                <p>Rua do Rosário, 1242<br />Angola, Betim, MG</p>
              </div>
            </div>

            <div className="page-width footer-legal">
              <span>© {new Date().getFullYear()} {brand}</span>
              <p>
                Os resultados apresentados correspondem aos registros visuais disponibilizados pelo espaço. Consulte
                valores, disponibilidade e detalhes dos serviços pelo WhatsApp.
              </p>
              <a href="#inicio">Voltar ao topo</a>
            </div>
          </footer>

          {/* Botões flutuantes */}
          <AnimatePresence>
            {barVisible && (
              <motion.div
                className="selection-bar"
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 90, opacity: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="selection-info">
                  <strong>{selected.length} {selected.length === 1 ? 'serviço' : 'serviços'}</strong>
                  <span>{totalLabel}</span>
                </div>
                <button type="button" className="icon-btn icon-btn-sm" onClick={() => setSelected([])} aria-label="Limpar seleção">
                  <X size={18} />
                </button>
                <a className="btn btn-gold" href="#agendar">Finalizar</a>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {dockVisible && !barVisible && (
              <motion.div
                className="dock"
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 90, opacity: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <a className="btn btn-gold" href="#agendar">Agendar horário</a>
                <a className="icon-btn dock-icon" href={telUrl} aria-label="Ligar para a Diana"><Phone size={20} /></a>
                <a className="icon-btn dock-icon" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">
                  <MessageCircle size={20} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="toast-region" role="status" aria-live="polite">
            <AnimatePresence>
              {toast && (
                <motion.p
                  key={toast}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.25 }}
                >
                  {toast}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}