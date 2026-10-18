import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight,
  Instagram, MapPin, Menu, MessageCircle, Navigation, Scissors, X,
} from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';

const brand = 'Espaço [seu nome]';
const address = '[seu endereço], [bairro], [cidade - UF]';
const instagramUrl = 'https://www.instagram.com/'; // Substituir pelo Instagram da profissional
const whatsappMessage = 'Olá! Vi seu site e gostaria de saber mais sobre os serviços e horários disponíveis.';
const whatsappUrl = `https://wa.me/SEU_NUMERO_COM_DDI?text=${encodeURIComponent(whatsappMessage)}`; // Substituir pelo WhatsApp da profissional
const serviceWhatsAppUrl = (serviceName: string) => `https://wa.me/SEU_NUMERO_COM_DDI?text=${encodeURIComponent(`Olá! Gostaria de agendar ${serviceName}. Você pode me informar os horários disponíveis?`)}`;
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

/* Imagens ilustrativas de profissionais trabalhando em salão.
   Trocar pelas fotos autorizadas da cabeleireira ao personalizar o site. */
const images = {
  hero: 'https://www.substancesalon.com/blog/images/haircut-styles-for-professional-women-modern-cuts-that-work-with-busy-lifestyles-3.jpg',
  styling: 'https://www.ausbildung-weiterbildung.ch/Bildungshilfe/Selbsttest/Image/coiffeur-coiffeuse-selbsttest.jpg',
  treatment: 'https://static.wixstatic.com/media/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp/v1/fill/w_980%2Ch_620%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp',
  hair: 'https://www.substancesalon.com/blog/images/haircut-styles-for-professional-women-modern-cuts-that-work-with-busy-lifestyles-3.jpg',
  detail: 'https://static.wixstatic.com/media/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp/v1/fill/w_980%2Ch_620%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp',
};
const professionalPhotos = [
  { src: 'https://www.ausbildung-weiterbildung.ch/Bildungshilfe/Selbsttest/Image/coiffeur-coiffeuse-selbsttest.jpg', alt: 'Cabeleireira profissional trabalhando no cabelo de uma cliente' },
  { src: 'https://www.substancesalon.com/blog/images/haircut-styles-for-professional-women-modern-cuts-that-work-with-busy-lifestyles-3.jpg', alt: 'Profissional cabeleireira usando secador e escova em salão' },
  { src: 'https://static.wixstatic.com/media/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp/v1/fill/w_980%2Ch_620%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp', alt: 'Cabeleireira profissional atendendo uma cliente no salão' },
];
const hairResultPhotos = [
  { src: 'https://www.substancesalon.com/blog/images/haircut-styles-for-professional-women-modern-cuts-that-work-with-busy-lifestyles-3.jpg', alt: 'Cabeleireira profissional trabalhando no cabelo de uma cliente' },
  { src: 'https://www.ausbildung-weiterbildung.ch/Bildungshilfe/Selbsttest/Image/coiffeur-coiffeuse-selbsttest.jpg', alt: 'Cabeleireira realizando um corte em salão profissional' },
  { src: 'https://static.wixstatic.com/media/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp/v1/fill/w_980%2Ch_620%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp', alt: 'Profissional de salão preparando o cabelo de uma cliente' },
  { src: 'https://www.substancesalon.com/blog/images/haircut-styles-for-professional-women-modern-cuts-that-work-with-busy-lifestyles-3.jpg', alt: 'Atendimento profissional de cabeleireira em salão' },
  { src: 'https://www.ausbildung-weiterbildung.ch/Bildungshilfe/Selbsttest/Image/coiffeur-coiffeuse-selbsttest.jpg', alt: 'Cabeleireira profissional usando pente e tesoura' },
  { src: 'https://static.wixstatic.com/media/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp/v1/fill/w_980%2Ch_620%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/6b13ad_122c0bf86c224dd8acf20192a34f2b30~mv2.webp', alt: 'Cabeleireira trabalhando em um salão de beleza' },
  { src: 'https://www.substancesalon.com/blog/images/haircut-styles-for-professional-women-modern-cuts-that-work-with-busy-lifestyles-3.jpg', alt: 'Profissional cabeleireira finalizando o cabelo de uma cliente' },
];

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const reveal = {
  hidden: { opacity: 0, y: 34, clipPath: 'inset(8% 0 8% 0)' },
  show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`section-label ${light ? 'section-label-light' : ''}`}><span className="section-dot" />{children}</div>;
}

function ActionButton({ children, href = whatsappUrl, light = false }: { children: React.ReactNode; href?: string; light?: boolean }) {
  const external = href.startsWith('http');
  return <motion.a className={`action-button ${light ? 'action-button-light' : ''}`} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} whileHover={{ y: -3 }} whileTap={{ scale: .97 }}>
    <span>{children}</span><span className="button-icon"><ArrowUpRight size={17} /></span>
  </motion.a>;
}

const services = [
  { name: 'Escova', price: 'A partir de R$ 65,00', description: 'Finalização para deixar os fios alinhados, leves e com movimento.' },
  { name: 'Lavagem simples', price: 'R$ 35,00', description: 'Cuidado essencial para limpar e preparar os fios.' },
  { name: 'Lavagem especial', price: 'R$ 45,00', description: 'Um momento extra de cuidado para os cabelos.' },
  { name: 'Corte', price: 'R$ 100,00', description: 'Inclui lavagem, secagem e finalização.' },
  { name: 'Coloração', price: 'R$ 160,00', description: 'Coloração com produtos adequados às necessidades dos fios.' },
  { name: 'Progressiva com formol', price: 'Consulte valores pelo WhatsApp', description: 'Retoque de raiz a partir de R$ 250,00.' },
  { name: 'Selagem', price: 'Consulte valores pelo WhatsApp', description: 'Retoque de raiz a partir de R$ 280,00.' },
  { name: 'Tratamento com ozônio', price: 'R$ 109,90', description: 'Cuidado capilar com ozônio, de acordo com a necessidade dos fios.' },
  { name: 'Tratamento instantâneo', price: 'R$ 39,90', description: 'Uma opção prática de cuidado para os cabelos.' },
  { name: 'Protocolo Fiber', price: 'R$ 219,90', description: 'Protocolo de tratamento capilar.' },
];

const faqItems = [
  ['Como faço para agendar?', 'Clique em qualquer botão de WhatsApp desta página para conversar diretamente com [seu nome] e consultar os horários disponíveis. O atendimento é feito com hora marcada.'],
  ['Quais serviços têm valores definidos?', 'Os valores informados estão na seção de serviços. Para progressiva com formol, selagem e serviços sem preço publicado, fale com [seu nome] pelo WhatsApp.'],
  ['A coloração pode ser feita com qualquer produto?', 'A indicação de produtos para coloração deve ser confirmada diretamente com [seu nome] antes do atendimento.'],
  ['Como funcionam os cronogramas capilares?', 'O cronograma Lowell inclui três tratamentos: hidratação, nutrição e reconstrução, todos com ozônio e finalização. A quarta sessão é gratuita e inclui detox para auxiliar na oxigenação do couro cabeludo. O cronograma Toctus inclui três tratamentos, todos com ozônio e finalização, por R$ 380,00. Converse com [seu nome] para confirmar a indicação.'],
  ['Onde fica o espaço?', 'O espaço fica no endereço informado pela profissional. Atualize esta resposta com bairro, cidade e orientações de chegada. Os botões de rota abrem o endereço no Google Maps ou no Waze.'],
];

export default function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState('Todos');
  const [showAllServices, setShowAllServices] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [activeRitual, setActiveRitual] = useState(0);
  const [activeProfessionalPhoto, setActiveProfessionalPhoto] = useState(0);
  const [activeHairResult, setActiveHairResult] = useState(0);
  const hairResultsTrackRef = useRef<HTMLDivElement>(null);
  const professionalTrackRef = useRef<HTMLDivElement>(null);
  const ritualTrackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroProgress = useScroll({ target: heroRef, offset: ['start start', 'end start'] }).scrollYProgress;
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.07]);
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '10%']);
  const processProgress = useScroll({ target: processRef, offset: ['start end', 'end start'] }).scrollYProgress;
  const processY = useTransform(processProgress, [0, 1], ['-2%', '6%']);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyCta(!entry.isIntersecting), { threshold: 0.05 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const filteredServices = activeService === 'Todos' ? services : services.filter((service) =>
    activeService === 'Tratamentos' ? /tratamento|protocolo|cronograma/i.test(service.name) :
    activeService === 'Química e cor' ? /progressiva|selagem|coloração/i.test(service.name) :
    /escova|lavagem|corte/i.test(service.name));

  return <div className={`site-shell ${introVisible ? 'site-is-intro' : 'site-is-ready'}`} aria-busy={introVisible}>
    <AnimatePresence>
      {introVisible && <motion.div className="brand-intro" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .65, ease: 'easeInOut' } }} aria-label="Espaço [seu nome]">
        <motion.span className="intro-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .65, ease: 'easeOut' }} />
        <motion.span className="intro-logo-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7 }}>[seu nome]</motion.span>
        <motion.p className="intro-location" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .85, duration: .6 }}>ESPAÇO DE BELEZA · [CIDADE - UF]</motion.p>
        <motion.span className="intro-rule intro-rule-bottom" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .55, duration: .65, ease: 'easeOut' }} />
      </motion.div>}
    </AnimatePresence>
    <motion.div className="site-content" initial={false} animate={{ opacity: introVisible ? 0 : 1 }} transition={{ duration: .65, delay: introVisible ? 0 : .05 }} style={{ pointerEvents: introVisible ? 'none' : 'auto' }}>
    <motion.div className="reading-progress" style={{ scaleX: progress }} />
    <header className="site-nav">
      <a href="#inicio" className="brand" onClick={closeMenu} aria-label="Espaço [seu nome], início">
        <span className="brand-template-name">[seu nome]</span>
      </a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <a href="#servicos">Serviços</a><a href="#cronogramas">Cronogramas</a><a href="#sobre">Sobre [seu nome]</a><a href="#localizacao">Localização</a>
      </nav>
      <div className="nav-actions">
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="nav-cta">Agendar horário <ArrowUpRight size={15} /></a>
        <button type="button" className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>
    <AnimatePresence>
      {menuOpen && <motion.nav className="mobile-menu" aria-label="Menu mobile" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}>
        <span className="mobile-menu-label">Explore o espaço</span>
        {[['Serviços', '#servicos'], ['Cronogramas capilares', '#cronogramas'], ['Sobre [seu nome]', '#sobre'], ['Localização', '#localizacao'], ['Falar no WhatsApp', '#contato']].map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}<ArrowRight size={17} /></a>)}
        <div className="mobile-menu-footer">ESPAÇO [SEU NOME] · [CIDADE - UF]</div>
      </motion.nav>}
    </AnimatePresence>

    <main>
      <section ref={heroRef} id="inicio" className="hero">
        <motion.div className="hero-image" style={{ scale: heroScale, y: heroY }}><img src={images.hero} alt="Cabeleireira profissional em ambiente de salão" fetchPriority="high" decoding="async" /></motion.div>
        <div className="hero-overlay" /><div className="hero-grain" />
        <div className="page-width hero-content">
          <motion.div variants={fade} initial="hidden" animate="show" className="hero-copy">
            <h1>Seu cabelo merece <em>cuidado de verdade.</em><span>Beleza que respeita a essência dos seus fios.</span></h1>
            <p className="hero-description">Procedimentos químicos, tratamentos capilares, coloração e cortes com atenção aos detalhes e um olhar personalizado para cada cabelo.</p>
            <div className="hero-buttons"><ActionButton>Agendar pelo WhatsApp</ActionButton><a href="#servicos" className="text-link light-link">Conhecer os serviços <ArrowDown size={15} /></a></div>
          </motion.div>
        </div>
        <div className="hero-bottom page-width"><span>Deslize para conhecer</span><div className="hero-line"><span /></div><span>01 — 06</span></div>
      </section>

      <section className="intro section-light">
        <div className="page-width intro-grid">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}><SectionLabel>O cuidado começa nos detalhes</SectionLabel></motion.div>
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} className="intro-statement">
            <p className="giant-copy">Mais do que transformar o visual, <em>é sobre cuidar dos fios, valorizar sua beleza e se sentir bem consigo mesma.</em></p>
            <ActionButton href="#sobre" light>Conheça [seu nome]</ActionButton>
          </motion.div>
        </div>
      </section>

      <section id="servicos" className="services-section">
        <div className="page-width">
          <div className="services-heading">
            <div><SectionLabel light>Menu de serviços</SectionLabel><h2>Seu próximo momento de <em>cuidado.</em></h2></div>
            <p>Escolha o serviço que procura e fale diretamente com [seu nome] para confirmar disponibilidade e detalhes.</p>
          </div>
          <div className="service-filters" role="group" aria-label="Filtrar serviços">
            {['Todos', 'Corte e finalização', 'Química e cor', 'Tratamentos'].map((filter) => <button key={filter} type="button" className={activeService === filter ? 'active' : ''} onClick={() => setActiveService(filter)}>{filter}</button>)}
          </div>
          <div className={`service-grid ${showAllServices ? 'services-expanded' : 'services-collapsed'}`} data-total-services={filteredServices.length}>
            {filteredServices.map((service, index) => <motion.article key={service.name} className="service-card" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }} transition={{ delay: index * .035 }}>
              <div className="service-card-top"><span className="service-index">0{(services.indexOf(service) + 1)}</span><span className="service-symbol"><Scissors size={17} /></span></div>
              <h3>{service.name}</h3><p>{service.description}</p><div className="service-price">{service.price}</div>
              <a href={serviceWhatsAppUrl(service.name)} target="_blank" rel="noreferrer" className="service-link">Consultar e agendar <ArrowUpRight size={16} /></a>
            </motion.article>)}
          </div>
          <button type="button" className="services-toggle" onClick={() => setShowAllServices(!showAllServices)} aria-expanded={showAllServices}>
            <span>{showAllServices ? 'Mostrar menos serviços' : 'Ver todos os serviços'}</span><ChevronDown size={17} className={showAllServices ? 'toggle-chevron is-open' : 'toggle-chevron'} />
          </button>
          <p className="service-note">* Os valores e serviços devem ser revisados conforme a realidade da profissional. Serviços sem preço definido devem ser consultados diretamente. Procedimentos podem exigir avaliação prévia.</p>
        </div>
      </section>

      <section className="hair-portfolio-section section-light" aria-labelledby="hair-portfolio-title">
        <div className="page-width">
          <div className="hair-portfolio-heading">
            <SectionLabel>Referências visuais</SectionLabel>
            <div><h2 id="hair-portfolio-title">Cuidado que aparece <em>nos detalhes.</em></h2><p>Imagens ilustrativas de profissionais de cabelo. Deslize para ver as fotos; elas serão substituídas pelas imagens da cabeleireira.</p></div>
          </div>
          <div className="hair-results-track" ref={hairResultsTrackRef} onScroll={(event) => {
            const track = event.currentTarget;
            const cards = Array.from(track.children) as HTMLElement[];
            if (!cards.length) return;
            const nearest = cards.reduce((best, card, index) => {
              const distance = Math.abs(card.offsetLeft - track.scrollLeft);
              return distance < best.distance ? { index, distance } : best;
            }, { index: 0, distance: Number.POSITIVE_INFINITY });
            setActiveHairResult(nearest.index);
          }}>
            {hairResultPhotos.map((photo, index) => <figure className="hair-result-card" key={photo.src}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              <figcaption><span>Imagem ilustrativa</span><small>Será substituída · 0{index + 1}</small></figcaption>
            </figure>)}
          </div>
          <p className="hair-portfolio-instruction">Arraste para o lado <ArrowRight size={15} /></p>
          <div className="hair-results-dots" role="group" aria-label="Escolher resultado de cabelo">
            {hairResultPhotos.map((photo, index) => <button key={photo.src} type="button" aria-label={`Ver resultado ${index + 1}`} aria-pressed={activeHairResult === index} className={activeHairResult === index ? 'active' : ''} onClick={() => {
              const track = hairResultsTrackRef.current;
              const card = track?.children[index] as HTMLElement | undefined;
              if (track && card) track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
              setActiveHairResult(index);
            }} />)}
          </div>
        </div>
      </section>

      <section ref={processRef} className="process-section section-light">
        <div className="page-width process-intro"><SectionLabel>Uma experiência personalizada</SectionLabel><div><h2>Cada cabelo tem sua história. <em>O cuidado também.</em></h2><p>[Seu nome] trabalha com atenção às características dos fios e aos desejos de cada cliente, buscando uma transformação que combine beleza, técnica e cuidado.</p></div></div>
        <div className="page-width process-story">
          <div className="process-image-wrap"><motion.div className="process-image" style={{ y: processY }}><img src={images.styling} alt="Cabeleireira profissional trabalhando no cabelo de uma cliente" loading="lazy" decoding="async" /></motion.div><div className="process-stamp">[SEU NOME]</div></div>
          <div className="process-steps">
            {[
              ['01', 'Ouvir', 'Entender o que você deseja e conhecer as características dos seus fios.'],
              ['02', 'Escolher', 'Conversar sobre o serviço e o cuidado mais adequado para o seu cabelo.'],
              ['03', 'Cuidar', 'Realizar o procedimento com atenção à técnica e aos detalhes.'],
              ['04', 'Finalizar', 'Valorizar o resultado com uma finalização que completa a experiência.'],
            ].map(([number, title, text], index) => <motion.div key={number} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} transition={{ delay: index * .07 }} className="process-step"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></motion.div>)}
            <div className="process-inline-cta"><span>Quer saber qual serviço faz sentido para você?</span><a href={whatsappUrl} target="_blank" rel="noreferrer">Converse com [seu nome] <ArrowRight size={15} /></a></div>
          </div>
        </div>
      </section>

      <section id="cronogramas" className="ritual-section">
        <div className="page-width">
          <div className="ritual-heading"><SectionLabel light>Tratamentos capilares</SectionLabel><h2>Um plano de cuidado para <em>seus fios.</em></h2><p>Conheça as opções de cronograma capilar e consulte pelo WhatsApp qual é a mais indicada para seu cabelo.</p></div>
          <p className="ritual-instruction">Arraste para o lado para conhecer os cronogramas.</p>
          <div className="ritual-grid" ref={ritualTrackRef} onScroll={(event) => {
            const track = event.currentTarget;
            const cards = Array.from(track.children) as HTMLElement[];
            if (!cards.length) return;
            const nearest = cards.reduce((best, card, index) => {
              const distance = Math.abs(card.offsetLeft - track.scrollLeft);
              return distance < best.distance ? { index, distance } : best;
            }, { index: 0, distance: Number.POSITIVE_INFINITY });
            setActiveRitual(nearest.index);
          }}>
            <motion.article className="ritual-card ritual-featured" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }}>
              <div className="ritual-image"><img src={images.treatment} alt="Cabeleireira profissional atendendo uma cliente no salão" loading="lazy" /></div>
              <div className="ritual-body"><span className="ritual-eyebrow">CRONOGRAMA CAPILAR</span><h3>Lowell</h3><p>Uma sequência com hidratação, nutrição e reconstrução. Todos os tratamentos incluem ozônio e finalização.</p><ul><li><Check size={16} /> Hidratação, nutrição e reconstrução</li><li><Check size={16} /> Ozônio em todos os tratamentos</li><li><Check size={16} /> 4ª sessão gratuita com detox para auxiliar na oxigenação do couro cabeludo</li><li><Check size={16} /> Valor informado: <strong>R$ 430,00</strong></li></ul><a href={serviceWhatsAppUrl('o cronograma capilar Lowell')} target="_blank" rel="noreferrer" className="ritual-link">Consultar e agendar <ArrowUpRight size={16} /></a></div>
            </motion.article>
            <motion.article className="ritual-card" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }} transition={{ delay: .1 }}>
              <div className="ritual-image"><img src={images.hair} alt="Profissional cabeleireira finalizando o cabelo de uma cliente" loading="lazy" /></div>
              <div className="ritual-body"><span className="ritual-eyebrow">CRONOGRAMA CAPILAR</span><h3>Toctus</h3><p>Três tratamentos capilares, todos com ozônio e finalização.</p><ul><li><Check size={16} /> 3 sessões de tratamento</li><li><Check size={16} /> Ozônio em todas as sessões</li><li><Check size={16} /> Finalização incluída</li></ul><p className="ritual-price">R$ 380,00</p><a href={serviceWhatsAppUrl('o cronograma capilar Toctus')} target="_blank" rel="noreferrer" className="ritual-link">Consultar e agendar <ArrowUpRight size={16} /></a></div>
            </motion.article>
          </div>
          <div className="ritual-pagination" role="group" aria-label="Escolher cronograma">
            {[0, 1].map((index) => <button key={index} type="button" aria-label={`Ver cronograma ${index === 0 ? 'Lowell' : 'Toctus'}`} aria-pressed={activeRitual === index} className={activeRitual === index ? 'active' : ''} onClick={() => {
              const track = ritualTrackRef.current;
              const card = track?.children[index] as HTMLElement | undefined;
              if (track && card) track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
              setActiveRitual(index);
            }} />)}
          </div>
          <div className="ritual-note"><p>Inclua aqui informações sobre tratamentos específicos oferecidos pela profissional, com indicação e orientações confirmadas por ela.</p></div>
        </div>
      </section>

      <section id="sobre" className="about-section section-light">
        <div className="page-width about-grid">
          <div className="about-photo-wrap">
            <div className="about-photo-track" ref={professionalTrackRef} onScroll={(event) => {
              const track = event.currentTarget;
              const cards = Array.from(track.children) as HTMLElement[];
              if (!cards.length) return;
              const nearest = cards.reduce((best, card, index) => {
                const distance = Math.abs(card.offsetLeft - track.scrollLeft);
                return distance < best.distance ? { index, distance } : best;
              }, { index: 0, distance: Number.POSITIVE_INFINITY });
              setActiveProfessionalPhoto(nearest.index);
            }}>
              {professionalPhotos.map((photo, index) => <motion.figure className="about-photo" key={photo.src} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }}>
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                <figcaption className="about-caption"><span>[seu nome]</span><small>Beleza · Cuidado · Autoestima</small></figcaption>
              </motion.figure>)}
            </div>
            <div className="about-photo-controls" role="group" aria-label="Fotos ilustrativas da profissional">
              <span>0{activeProfessionalPhoto + 1} <i>/ 0{professionalPhotos.length}</i></span>
              <div className="about-photo-dots">{professionalPhotos.map((photo, index) => <button type="button" key={photo.src} aria-label={`Ver foto ilustrativa ${index + 1}`} aria-pressed={activeProfessionalPhoto === index} className={activeProfessionalPhoto === index ? 'active' : ''} onClick={() => {
                const track = professionalTrackRef.current;
                const card = track?.children[index] as HTMLElement | undefined;
                if (track && card) track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
                setActiveProfessionalPhoto(index);
              }} />)}</div>
            </div>
          </div>
          <div className="about-copy"><div className="personalization-note"><strong>Modelo demonstrativo</strong><p>Esta imagem será substituída pela foto da cabeleireira. O site será personalizado para a realidade da profissional, incluindo serviços, valores, identidade visual e formas de contato.</p></div><SectionLabel>Prazer, sou [seu nome]!</SectionLabel><h2>Seu cabelo em boas mãos, <em>com atenção a cada detalhe.</em></h2>
            <p>Sou [seu nome], cabeleireira apaixonada por transformar cabelos e realçar a beleza de cada cliente. Meu trabalho é voltado para o cuidado e a valorização dos fios, unindo técnica, conhecimento e atenção aos detalhes.</p>
            <p>Atuo com procedimentos químicos, tratamentos capilares, coloração e cortes, buscando sempre respeitar as características de cada cabelo e os desejos de cada cliente.</p>
            <p>Meu propósito é oferecer um atendimento personalizado, proporcionando uma experiência de cuidado, autoestima e confiança.</p>
            <div className="about-facts"><div><strong>Atendimento</strong><span>Com hora marcada</span></div><div><strong>Especialidades</strong><span>Química · Tratamentos · Corte</span></div><div><strong>Local</strong><span>[bairro] · [cidade - UF]</span></div></div>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-link"><Instagram size={17} /> Acompanhe no Instagram <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-image"><img src={images.detail} alt="Imagem ilustrativa de cabeleireira profissional" loading="lazy" /></div>
        <div className="experience-panel"><SectionLabel>Seu momento de cuidado</SectionLabel><h2>Um atendimento pensado para <em>valorizar você.</em></h2>
          <div className="experience-list">{['Atendimento personalizado', 'Cuidado com as características dos fios', 'Procedimentos e tratamentos capilares', 'Finalização para completar o resultado'].map((item, i) => <motion.div key={item} whileHover={{ x: 5 }}><span>0{i + 1}</span><p>{item}</p><Check size={16} /></motion.div>)}</div>
          <ActionButton>Vamos conversar</ActionButton>
        </div>
      </section>

      <section id="localizacao" className="location-section section-light">
        <div className="page-width"><div className="location-heading"><SectionLabel>Como chegar</SectionLabel><div><h2>Seu próximo momento de cuidado fica <em>perto de você.</em></h2><p>Consulte o endereço e abra a rota no aplicativo de sua preferência.</p></div></div>
          <div className="location-layout"><motion.div className="location-map" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }}><iframe title="Localização do espaço da profissional" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="location-map-overlay"><div className="location-pin"><MapPin size={17} /></div><div><strong>Espaço [seu nome]</strong><span>[bairro] · [cidade - UF]</span></div></div></motion.div>
            <motion.div className="location-info" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: .1 }}><span className="location-eyebrow"><MapPin size={14} /> ENDEREÇO</span><h3>{address}</h3><p>Atendimento de terça a sábado, somente com agendamento prévio.</p>
              <div className="location-actions"><a href={mapsUrl} target="_blank" rel="noreferrer" className="route-card"><span className="route-icon"><MapPin size={17} /></span><span><strong>Google Maps</strong><small>Abrir rota</small></span><ArrowUpRight size={17} /></a><a href={wazeUrl} target="_blank" rel="noreferrer" className="route-card"><span className="route-icon"><Navigation size={17} /></span><span><strong>Waze</strong><small>Navegar até o espaço</small></span><ArrowUpRight size={17} /></a></div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="location-contact-link">Quer confirmar o endereço ou horário? <span>Fale com [seu nome]</span><ArrowRight size={15} /></a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="faq-section section-light">
        <div className="page-width faq-grid"><div><SectionLabel>Dúvidas frequentes</SectionLabel><h2>Antes de <em>agendar.</em></h2><p>Algumas informações para ajudar você a dar o próximo passo com tranquilidade.</p></div>
          <div className="faq-list">{faqItems.map(([question, answer], index) => <motion.div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question} layout><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`}><span>{question}</span><span className="faq-icon"><ChevronDown size={18} /></span></button><motion.div id={`faq-answer-${index}`} initial={false} animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }} className="faq-answer"><p>{answer}</p></motion.div></motion.div>)}</div>
        </div>
        <div className="page-width faq-bottom-cta"><span>Não encontrou sua dúvida?</span><a href={whatsappUrl} target="_blank" rel="noreferrer">Converse com [seu nome] <ArrowRight size={15} /></a></div>
      </section>

      <section id="contato" className="contact-section"><div className="contact-bg"><img src={images.hero} alt="" loading="lazy" /></div><div className="contact-overlay" />
        <div className="page-width contact-content"><SectionLabel light>Seu próximo passo</SectionLabel><p className="contact-eyebrow">ESPAÇO [SEU NOME]</p><h2>Vamos cuidar do seu cabelo e realçar a sua beleza?</h2><p>Entre em contato para consultar serviços, tirar dúvidas e encontrar um horário para você.</p>
          <div className="contact-actions"><ActionButton>Agendar pelo WhatsApp</ActionButton><a href={instagramUrl} target="_blank" rel="noreferrer" className="contact-whatsapp"><Instagram size={17} /> Instagram</a></div>
          <div className="contact-meta"><span><MapPin size={15} /> [bairro] · [cidade - UF]</span><span><Scissors size={15} /> Terça a sábado · com agendamento</span><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @[seu instagram]</a></div>
        </div>
      </section>
    </main>

    <footer className="footer"><div className="page-width footer-inner"><a href="#inicio" className="brand footer-brand"><span className="brand-template-name">[seu nome]</span></a><span>© {new Date().getFullYear()} Espaço [seu nome]</span><a href="#inicio">Voltar ao topo ↑</a></div><div className="footer-disclaimer">MODELO DEMONSTRATIVO: as fotos ilustrativas serão substituídas pelas fotos da profissional. O site será personalizado para a realidade da cabeleireira, incluindo identidade, serviços, valores, localização e formas de contato.</div></footer>

    <AnimatePresence>{showStickyCta && <motion.a href={whatsappUrl} target="_blank" rel="noreferrer" className="mobile-sticky-cta" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ duration: .4, ease: [0.16, 1, 0.3, 1] }} whileTap={{ scale: .97 }}><span>Agendar com [seu nome]</span><MessageCircle size={18} /></motion.a>}</AnimatePresence>
    </motion.div>
  </div>;
}
