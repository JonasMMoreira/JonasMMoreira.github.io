<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JM Edificações | Engenharia Civil em Aracaju</title>
<meta name="description" content="Engenharia civil com planejamento técnico e compromisso. Projetos residenciais, hidráulica, impermeabilização e instalações em Aracaju e região.">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:      #141210;
  --ink2:     #3a3530;
  --muted:    #7a7068;
  --warm:     #f7f3ee;
  --sand:     #e8e0d4;
  --line:     rgba(20,18,16,.1);
  --gold:     #c19a52;
  --gold-d:   #8f6e30;
  --white:    #fdfcfa;
}

html { scroll-behavior: smooth; font-size: 16px; }
body { font-family: 'Outfit', sans-serif; background: var(--white); color: var(--ink); overflow-x: hidden; }
a { text-decoration: none; }
img { display: block; max-width: 100%; }

/* ── UTILITY ── */
.serif { font-family: 'Cormorant Garamond', serif; }
.label {
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
  font-weight: 600; color: var(--gold);
}

/* ══════════════ NAV ══════════════ */
.nav {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 64px; height: 72px;
  background: rgba(253,252,250,.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
  transition: box-shadow .3s;
}
.nav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,.07); }
.nav-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px; font-weight: 700; color: var(--ink);
  letter-spacing: -0.5px; line-height: 1;
}
.nav-logo sup { font-size: 13px; color: var(--gold); vertical-align: super; }
.nav-menu { display: flex; align-items: center; gap: 40px; list-style: none; }
.nav-menu a {
  font-size: 13px; font-weight: 500; letter-spacing: .8px;
  color: var(--ink2); text-transform: uppercase;
  position: relative; padding-bottom: 2px;
  transition: color .2s;
}
.nav-menu a::after {
  content: ''; position: absolute; bottom: 0; left: 0;
  height: 1px; width: 0; background: var(--gold);
  transition: width .3s;
}
.nav-menu a:hover { color: var(--ink); }
.nav-menu a:hover::after { width: 100%; }
.nav-wpp {
  display: flex; align-items: center; gap: 8px;
  background: var(--ink); color: var(--white) !important;
  padding: 10px 20px; border-radius: 2px;
  font-size: 13px !important; font-weight: 600 !important;
  letter-spacing: .5px !important; text-transform: none !important;
  transition: background .25s;
}
.nav-wpp:hover { background: var(--gold-d) !important; }
.nav-wpp::after { display: none !important; }
.nav-wpp svg { width: 16px; height: 16px; fill: currentColor; }

/* ══════════════ HERO ══════════════ */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-top: 72px;
}
.hero-left {
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 64px 80px 64px;
  position: relative;
}
.hero-left::before {
  content: '';
  position: absolute; left: 0; top: 10%; bottom: 10%;
  width: 3px; background: linear-gradient(to bottom, transparent, var(--gold), transparent);
}
.hero-eyebrow { margin-bottom: 24px; }
.hero-h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(52px, 5.5vw, 80px);
  font-weight: 600; line-height: 1.0;
  color: var(--ink); letter-spacing: -1px;
  animation: up .9s ease both;
}
.hero-h1 em { font-style: italic; color: var(--gold); }
.hero-desc {
  margin-top: 28px; font-size: 17px; line-height: 1.75;
  color: var(--muted); max-width: 440px;
  animation: up .9s .12s ease both;
}
.hero-actions {
  display: flex; gap: 14px; margin-top: 44px;
  animation: up .9s .22s ease both;
}
.btn-gold {
  background: var(--gold); color: var(--white);
  padding: 15px 34px; border-radius: 2px;
  font-size: 14px; font-weight: 600; letter-spacing: .3px;
  transition: background .25s, transform .2s;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-gold:hover { background: var(--gold-d); transform: translateY(-2px); }
.btn-outline {
  background: none; border: 1px solid var(--sand);
  color: var(--ink2); padding: 15px 34px; border-radius: 2px;
  font-size: 14px; font-weight: 500;
  transition: border-color .25s, color .25s;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-outline:hover { border-color: var(--ink); color: var(--ink); }
.hero-badges {
  display: flex; gap: 32px; margin-top: 56px;
  padding-top: 40px; border-top: 1px solid var(--line);
  animation: up .9s .3s ease both;
}
.badge-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px; font-weight: 700; line-height: 1;
  color: var(--ink);
}
.badge-num span { color: var(--gold); }
.badge-txt {
  font-size: 12px; color: var(--muted); letter-spacing: .5px;
  margin-top: 4px; line-height: 1.4;
}

.hero-right {
  position: relative; overflow: hidden;
}
.hero-img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(.88) saturate(.85);
}
.hero-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, var(--white) 0%, transparent 18%),
              linear-gradient(to top, rgba(20,18,16,.5) 0%, transparent 40%);
}
.hero-img-caption {
  position: absolute; bottom: 36px; left: 36px; right: 36px;
  color: rgba(255,255,255,.75); font-size: 12px; letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* ══════════════ MARQUEE ══════════════ */
.marquee-wrap {
  background: var(--ink); overflow: hidden;
  padding: 18px 0; border-top: 1px solid rgba(255,255,255,.05);
}
.marquee-track {
  display: flex; gap: 0;
  animation: marquee 28s linear infinite;
  white-space: nowrap;
}
.marquee-item {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 0 32px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; color: rgba(255,255,255,.45);
  letter-spacing: 1px; font-style: italic;
}
.marquee-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--gold); flex-shrink: 0;
}
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ══════════════ SERVIÇOS ══════════════ */
.services {
  padding: 120px 64px;
}
.section-head {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 72px;
}
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(38px, 4vw, 56px);
  font-weight: 600; line-height: 1.1; color: var(--ink);
  max-width: 400px;
}
.section-title em { font-style: italic; color: var(--gold); }
.section-link {
  font-size: 13px; font-weight: 600; letter-spacing: 1px;
  text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 6px;
  border-bottom: 1px solid var(--gold); padding-bottom: 2px;
  transition: gap .2s;
}
.section-link:hover { gap: 12px; }

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--sand);
}
.service-card {
  background: var(--white);
  padding: 48px 40px;
  position: relative; overflow: hidden;
  transition: background .3s;
  cursor: default;
}
.service-card::before {
  content: '';
  position: absolute; bottom: 0; left: 0;
  height: 2px; width: 0; background: var(--gold);
  transition: width .4s;
}
.service-card:hover { background: var(--warm); }
.service-card:hover::before { width: 100%; }
.service-icon {
  font-size: 36px; margin-bottom: 24px;
  line-height: 1;
}
.service-num {
  position: absolute; top: 32px; right: 32px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 64px; font-weight: 700;
  color: var(--sand); line-height: 1;
  transition: color .3s;
  user-select: none;
}
.service-card:hover .service-num { color: rgba(193,154,82,.15); }
.service-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 600; color: var(--ink);
  margin-bottom: 14px; line-height: 1.2;
}
.service-desc {
  font-size: 15px; line-height: 1.7; color: var(--muted);
}

/* ══════════════ DIFERENCIAIS ══════════════ */
.diff {
  padding: 120px 64px;
  background: var(--ink);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.diff-left .label { color: var(--gold); }
.diff-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(38px, 4vw, 58px);
  font-weight: 600; color: #fdfcfa;
  line-height: 1.1; margin-top: 16px;
}
.diff-title em { font-style: italic; color: var(--gold); }
.diff-body {
  margin-top: 28px; font-size: 16px; line-height: 1.8;
  color: rgba(253,252,250,.6); max-width: 440px;
}
.diff-cta { margin-top: 48px; }

.diff-items {
  display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
}
.diff-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  padding: 36px 32px;
  border-radius: 2px;
  transition: background .3s;
}
.diff-item:hover { background: rgba(255,255,255,.08); }
.diff-item-icon {
  font-size: 28px; margin-bottom: 16px;
}
.diff-item-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 600;
  color: #fdfcfa; margin-bottom: 10px;
}
.diff-item-desc {
  font-size: 14px; line-height: 1.65;
  color: rgba(253,252,250,.5);
}

/* ══════════════ PROJETOS ══════════════ */
.projects { padding: 120px 64px; }
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px; margin-top: 72px;
}
.proj-card {
  position: relative; overflow: hidden;
  border-radius: 3px; aspect-ratio: 3/4;
  cursor: pointer;
  background: var(--sand);
}
.proj-card img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .6s cubic-bezier(.25,.46,.45,.94);
  filter: brightness(.8) saturate(.7);
}
.proj-card:hover img { transform: scale(1.07); filter: brightness(.65) saturate(.6); }
.proj-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(20,18,16,.9) 0%, transparent 55%);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 32px 28px;
}
.proj-tag {
  font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 8px;
}
.proj-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 600; color: #fdfcfa;
  line-height: 1.2;
}
.proj-arrow {
  position: absolute; top: 24px; right: 24px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(253,252,250,.12);
  display: flex; align-items: center; justify-content: center;
  color: #fdfcfa; font-size: 18px;
  opacity: 0; transform: scale(.7);
  transition: opacity .3s, transform .3s;
}
.proj-card:hover .proj-arrow { opacity: 1; transform: scale(1); }

.projects-cta {
  text-align: center; margin-top: 56px;
}

/* ══════════════ DEPOIMENTO ══════════════ */
.testimonial {
  padding: 120px 64px;
  background: var(--warm);
  border-top: 1px solid var(--sand);
  border-bottom: 1px solid var(--sand);
}
.testimonial-inner {
  max-width: 780px; margin: 0 auto; text-align: center;
}
.testimonial-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 400; font-style: italic;
  line-height: 1.5; color: var(--ink);
  position: relative;
}
.testimonial-quote::before {
  content: '\201C';
  font-size: 120px; line-height: .5;
  color: var(--gold); opacity: .3;
  display: block; margin-bottom: -10px;
  font-family: 'Cormorant Garamond', serif;
}
.testimonial-author {
  margin-top: 36px; font-size: 14px;
  color: var(--muted); letter-spacing: 1px; text-transform: uppercase;
}
.testimonial-author strong {
  color: var(--ink); font-weight: 600;
  display: block; font-size: 16px;
  letter-spacing: 0; text-transform: none;
  margin-bottom: 4px;
}
.testimonial-stars { color: var(--gold); font-size: 18px; margin-bottom: 28px; }

/* ══════════════ CONTATO ══════════════ */
.contact {
  padding: 120px 64px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: start;
}
.contact-left .label { margin-bottom: 16px; display: block; }
.contact-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(38px, 4vw, 56px);
  font-weight: 600; color: var(--ink); line-height: 1.1;
}
.contact-title em { font-style: italic; color: var(--gold); }
.contact-desc {
  margin-top: 24px; font-size: 16px; line-height: 1.8; color: var(--muted);
}
.contact-info { margin-top: 48px; display: flex; flex-direction: column; gap: 24px; }
.contact-row {
  display: flex; align-items: flex-start; gap: 16px;
  padding-bottom: 24px; border-bottom: 1px solid var(--line);
}
.contact-row:last-child { border-bottom: none; }
.contact-icon {
  width: 44px; height: 44px; border-radius: 2px;
  background: var(--warm); display: flex;
  align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.contact-row-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.contact-row-val { font-size: 16px; color: var(--ink); font-weight: 500; }
.contact-row-val a { color: inherit; }

.contact-form {
  background: var(--warm);
  border: 1px solid var(--sand);
  border-radius: 4px;
  padding: 48px 44px;
}
.form-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 600; color: var(--ink);
  margin-bottom: 32px;
}
.form-group { margin-bottom: 20px; }
.form-label {
  display: block; font-size: 12px; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 8px; font-weight: 500;
}
.form-input, .form-select, .form-textarea {
  width: 100%; background: var(--white);
  border: 1px solid var(--sand); border-radius: 2px;
  padding: 13px 16px; font-size: 15px;
  font-family: 'Outfit', sans-serif; color: var(--ink);
  outline: none; transition: border-color .2s;
  appearance: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--gold);
}
.form-textarea { min-height: 110px; resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-submit {
  width: 100%; background: var(--ink); color: var(--white);
  border: none; border-radius: 2px;
  padding: 16px; font-size: 15px; font-weight: 600;
  font-family: 'Outfit', sans-serif; cursor: pointer;
  letter-spacing: .3px;
  transition: background .25s;
  margin-top: 8px;
}
.form-submit:hover { background: var(--gold-d); }

/* ══════════════ FOOTER ══════════════ */
footer {
  background: var(--ink); color: rgba(253,252,250,.5);
  padding: 80px 64px 40px;
}
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 64px;
  padding-bottom: 64px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  margin-bottom: 40px;
}
.footer-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 700; color: #fdfcfa;
  margin-bottom: 16px;
}
.footer-logo sup { font-size: 13px; color: var(--gold); }
.footer-tagline { font-size: 14px; line-height: 1.7; max-width: 240px; }
.footer-col h4 {
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 20px;
}
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 12px; }
.footer-col ul li a { color: rgba(253,252,250,.5); font-size: 14px; transition: color .2s; }
.footer-col ul li a:hover { color: #fdfcfa; }
.footer-col p { font-size: 14px; line-height: 1.8; }
.footer-col a { color: rgba(253,252,250,.5); transition: color .2s; }
.footer-col a:hover { color: #fdfcfa; }
.footer-bottom {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: rgba(253,252,250,.3);
}
.footer-socials { display: flex; gap: 12px; }
.social-btn {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.12);
  display: flex; align-items: center; justify-content: center;
  color: rgba(253,252,250,.4); font-size: 13px; font-weight: 600;
  transition: all .2s;
}
.social-btn:hover { border-color: var(--gold); color: var(--gold); }

/* ══════════════ FLOAT WPP ══════════════ */
.float-wpp {
  position: fixed; bottom: 32px; right: 32px; z-index: 300;
  width: 56px; height: 56px; border-radius: 50%;
  background: #25D366; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 24px rgba(37,211,102,.4);
  transition: transform .25s, box-shadow .25s;
}
.float-wpp:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(37,211,102,.5); }
.float-wpp svg { width: 28px; height: 28px; fill: #fff; }

/* ══════════════ ANIMATIONS ══════════════ */
@keyframes up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════════ MOBILE ══════════════ */
@media (max-width: 960px) {
  .nav { padding: 0 24px; }
  .nav-menu { display: none; }
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-left { padding: 60px 24px 48px; }
  .hero-left::before { display: none; }
  .hero-right { height: 340px; }
  .hero-badges { flex-wrap: wrap; gap: 20px; }
  .services { padding: 72px 24px; }
  .section-head { flex-direction: column; align-items: flex-start; gap: 20px; }
  .services-grid { grid-template-columns: 1fr; }
  .diff { grid-template-columns: 1fr; padding: 72px 24px; gap: 48px; }
  .diff-items { grid-template-columns: 1fr; }
  .projects { padding: 72px 24px; }
  .projects-grid { grid-template-columns: 1fr 1fr; }
  .testimonial { padding: 72px 24px; }
  .contact { grid-template-columns: 1fr; padding: 72px 24px; gap: 48px; }
  footer { padding: 60px 24px 32px; }
  .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
  .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .projects-grid { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<!-- NAV -->
<nav class="nav" id="nav">
  <a href="index.html" class="nav-logo">JM Edifica<sup>ções</sup></a>
  <ul class="nav-menu">
    <li><a href="index.html">Início</a></li>
    <li><a href="portfolio.html">Portfólio</a></li>
    <li><a href="sobre.html">Sobre</a></li>
    <li><a href="servicos.html">Serviços</a></li>
    <li><a href="contato.html">Contato</a></li>
    <li>
      <a href="https://wa.me/5579991373093" class="nav-wpp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
    </li>
  </ul>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <p class="label hero-eyebrow">Engenharia Civil · Aracaju-SE</p>
    <h1 class="hero-h1">
      Sua obra<br>com <em>precisão</em><br>e excelência
    </h1>
    <p class="hero-desc">
      Projetos residenciais, soluções hidráulicas, impermeabilização e instalações — entregando qualidade técnica e compromisso em cada etapa da obra.
    </p>
    <div class="hero-actions">
      <a href="https://wa.me/5579991373093" class="btn-gold">
        Solicitar Orçamento →
      </a>
      <a href="portfolio.html" class="btn-outline">
        Ver Portfólio
      </a>
    </div>
    <div class="hero-badges">
      <div>
        <div class="badge-num">8<span>+</span></div>
        <div class="badge-txt">Projetos<br>concluídos</div>
      </div>
      <div>
        <div class="badge-num">5<span>★</span></div>
        <div class="badge-txt">Avaliação<br>dos clientes</div>
      </div>
      <div>
        <div class="badge-num">3<span>+</span></div>
        <div class="badge-txt">Anos de<br>experiência</div>
      </div>
    </div>
  </div>
  <div class="hero-right">
    <img class="hero-img"
      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
      alt="Engenharia civil — obra em construção">
    <div class="hero-img-overlay"></div>
    <p class="hero-img-caption">Projetos residenciais · Aracaju e região</p>
  </div>
</section>

<!-- MARQUEE -->
<div class="marquee-wrap">
  <div class="marquee-track">
    <!-- duplicado para loop contínuo -->
    <span class="marquee-item"><span class="marquee-dot"></span>Projetos Residenciais</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Hidráulica</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Impermeabilização</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Instalações Elétricas</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Forro & Cobertura</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Laudos Técnicos</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Projetos Residenciais</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Hidráulica</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Impermeabilização</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Instalações Elétricas</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Forro & Cobertura</span>
    <span class="marquee-item"><span class="marquee-dot"></span>Laudos Técnicos</span>
  </div>
</div>

<!-- SERVIÇOS -->
<section class="services">
  <div class="section-head">
    <div>
      <p class="label" style="margin-bottom:14px;">O que fazemos</p>
      <h2 class="section-title">Soluções técnicas<br>para sua <em>obra</em></h2>
    </div>
    <a href="servicos.html" class="section-link">Ver todos os serviços →</a>
  </div>

  <div class="services-grid">
    <div class="service-card">
      <span class="service-num">01</span>
      <div class="service-icon">🏠</div>
      <div class="service-name">Projetos Residenciais</div>
      <p class="service-desc">Planta baixa, cortes, fachadas e memorial descritivo para sua residência, com rigor técnico e dentro das normas da ABNT.</p>
    </div>
    <div class="service-card">
      <span class="service-num">02</span>
      <div class="service-icon">💧</div>
      <div class="service-name">Hidráulica e Sanitário</div>
      <p class="service-desc">Diagnóstico, reparo e instalação de sistemas hidráulicos — reservatórios, tubulações, refluxo e estanqueidade.</p>
    </div>
    <div class="service-card">
      <span class="service-num">03</span>
      <div class="service-icon">🔒</div>
      <div class="service-name">Impermeabilização</div>
      <p class="service-desc">Tratamento de trincas, patologias e impermeabilização de lajes, calhas, terraços e reservatórios de concreto.</p>
    </div>
    <div class="service-card">
      <span class="service-num">04</span>
      <div class="service-icon">⚡</div>
      <div class="service-name">Instalações Elétricas</div>
      <p class="service-desc">Pontos de luz, tomadas, ventiladores e circuitos elétricos instalados com segurança e acabamento profissional.</p>
    </div>
    <div class="service-card">
      <span class="service-num">05</span>
      <div class="service-icon">🏗️</div>
      <div class="service-name">Forro e Cobertura</div>
      <p class="service-desc">Instalação de forro de PVC com barreiras térmicas, manta aluminizada e poliestireno para conforto e economia.</p>
    </div>
    <div class="service-card">
      <span class="service-num">06</span>
      <div class="service-icon">📋</div>
      <div class="service-name">Laudos Técnicos</div>
      <p class="service-desc">Elaboração de laudos e ART para regularização, vistoria, avaliação de imóveis e diagnóstico de patologias.</p>
    </div>
  </div>
</section>

<!-- DIFERENCIAIS -->
<section class="diff">
  <div class="diff-left">
    <p class="label">Por que nos escolher</p>
    <h2 class="diff-title">Engenharia que<br>você pode <em>confiar</em></h2>
    <p class="diff-body">
      Cada projeto é tratado com atenção técnica, prazo cumprido e comunicação clara. Do diagnóstico à entrega, você acompanha cada etapa.
    </p>
    <div class="diff-cta">
      <a href="sobre.html" class="btn-outline" style="border-color:rgba(255,255,255,.2);color:#fdfcfa;">Conhecer mais →</a>
    </div>
  </div>
  <div class="diff-right">
    <div class="diff-items">
      <div class="diff-item">
        <div class="diff-item-icon">🎯</div>
        <div class="diff-item-title">Precisão técnica</div>
        <p class="diff-item-desc">Projetos elaborados conforme normas ABNT, com memorial descritivo e documentação completa.</p>
      </div>
      <div class="diff-item">
        <div class="diff-item-icon">🤝</div>
        <div class="diff-item-title">Compromisso</div>
        <p class="diff-item-desc">Prazos respeitados e comunicação direta durante toda a execução da obra.</p>
      </div>
      <div class="diff-item">
        <div class="diff-item-icon">📍</div>
        <div class="diff-item-title">Atendimento local</div>
        <p class="diff-item-desc">Baseados em Aracaju, atendemos toda a região com agilidade e conhecimento do mercado local.</p>
      </div>
      <div class="diff-item">
        <div class="diff-item-icon">💡</div>
        <div class="diff-item-title">Soluções inteligentes</div>
        <p class="diff-item-desc">Diagnóstico correto antes de qualquer intervenção — economizando tempo e recursos do cliente.</p>
      </div>
    </div>
  </div>
</section>

<!-- PROJETOS -->
<section class="projects">
  <div class="section-head">
    <div>
      <p class="label" style="margin-bottom:14px;">Portfólio</p>
      <h2 class="section-title">Projetos <em>realizados</em></h2>
    </div>
    <a href="portfolio.html" class="section-link">Ver portfólio completo →</a>
  </div>

  <div class="projects-grid">
    <div class="proj-card">
      <img src="https://static.wixstatic.com/media/b1bbd7_9b31ca22f9d649ffbc10602a7bc5c23a~mv2.png/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/b1bbd7_9b31ca22f9d649ffbc10602a7bc5c23a~mv2.png"
           alt="Solução Hidráulica"
           onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'">
      <div class="proj-overlay">
        <div class="proj-tag">Hidráulica</div>
        <div class="proj-name">Controle de Refluxo em Reservatório</div>
      </div>
      <div class="proj-arrow">↗</div>
    </div>
    <div class="proj-card">
      <img src="https://static.wixstatic.com/media/b1bbd7_e71de871477d40c5af08c51a1ed1432e~mv2.png/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/b1bbd7_e71de871477d40c5af08c51a1ed1432e~mv2.png"
           alt="Projeto Residencial"
           onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'">
      <div class="proj-overlay">
        <div class="proj-tag">Projeto Residencial</div>
        <div class="proj-name">Casa Residencial — Planta e Fachada</div>
      </div>
      <div class="proj-arrow">↗</div>
    </div>
    <div class="proj-card">
      <img src="https://static.wixstatic.com/media/b1bbd7_f9c1c389a6f34d0080565ffcd612453f~mv2.jpg/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/b1bbd7_f9c1c389a6f34d0080565ffcd612453f~mv2.jpg"
           alt="Impermeabilização"
           onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80'">
      <div class="proj-overlay">
        <div class="proj-tag">Impermeabilização</div>
        <div class="proj-name">Tratamento de Trincas em Calhas</div>
      </div>
      <div class="proj-arrow">↗</div>
    </div>
  </div>

  <div class="projects-cta">
    <a href="portfolio.html" class="btn-gold">Ver todos os projetos →</a>
  </div>
</section>

<!-- DEPOIMENTO -->
<section class="testimonial">
  <div class="testimonial-inner">
    <div class="testimonial-stars">★★★★★</div>
    <p class="testimonial-quote">
      Serviço impecável, do diagnóstico até a entrega. O profissional identificou o problema com precisão e resolveu de forma definitiva. Recomendo sem hesitar.
    </p>
    <div class="testimonial-author">
      <strong>Cliente JM Edificações</strong>
      Aracaju, Sergipe
    </div>
  </div>
</section>

<!-- CONTATO -->
<section class="contact">
  <div class="contact-left">
    <span class="label">Entre em contato</span>
    <h2 class="contact-title">Vamos falar<br>sobre seu <em>projeto</em></h2>
    <p class="contact-desc">Atendemos toda Aracaju e região. Entre em contato para uma visita técnica ou orçamento sem compromisso.</p>
    <div class="contact-info">
      <div class="contact-row">
        <div class="contact-icon">📞</div>
        <div>
          <div class="contact-row-label">Telefone / WhatsApp</div>
          <div class="contact-row-val"><a href="tel:+5579991373093">(79) 99137-3093</a></div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">✉️</div>
        <div>
          <div class="contact-row-label">E-mail</div>
          <div class="contact-row-val"><a href="mailto:jmedf.contato@gmail.com">jmedf.contato@gmail.com</a></div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">📍</div>
        <div>
          <div class="contact-row-label">Área de atendimento</div>
          <div class="contact-row-val">Aracaju e toda a região</div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">🕐</div>
        <div>
          <div class="contact-row-label">Horário</div>
          <div class="contact-row-val">Seg–Sex: 8h–18h &nbsp;|&nbsp; Sáb–Dom: 9h–13h</div>
        </div>
      </div>
    </div>
  </div>

  <div class="contact-form">
    <div class="form-title">Solicite seu orçamento</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" type="text" placeholder="Seu nome completo">
      </div>
      <div class="form-group">
        <label class="form-label">Telefone</label>
        <input class="form-input" type="tel" placeholder="(79) 00000-0000">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">E-mail</label>
      <input class="form-input" type="email" placeholder="seu@email.com">
    </div>
    <div class="form-group">
      <label class="form-label">Serviço desejado</label>
      <select class="form-select">
        <option value="">Selecione um serviço...</option>
        <option>Projeto Residencial</option>
        <option>Hidráulica / Sanitário</option>
        <option>Impermeabilização</option>
        <option>Instalações Elétricas</option>
        <option>Forro e Cobertura</option>
        <option>Laudo Técnico</option>
        <option>Outro</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Mensagem</label>
      <textarea class="form-textarea" placeholder="Descreva brevemente seu projeto ou dúvida..."></textarea>
    </div>
    <button class="form-submit" onclick="sendWhatsApp()">Enviar pelo WhatsApp →</button>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-top">
    <div>
      <div class="footer-logo">JM Edifica<sup>ções</sup></div>
      <p class="footer-tagline">Engenharia civil com planejamento técnico e compromisso. Aracaju e região.</p>
    </div>
    <div class="footer-col">
      <h4>Navegação</h4>
      <ul>
        <li><a href="index.html">Início</a></li>
        <li><a href="portfolio.html">Portfólio</a></li>
        <li><a href="sobre.html">Sobre</a></li>
        <li><a href="servicos.html">Serviços</a></li>
        <li><a href="contato.html">Contato</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Serviços</h4>
      <ul>
        <li><a href="servicos.html">Projetos Residenciais</a></li>
        <li><a href="servicos.html">Hidráulica</a></li>
        <li><a href="servicos.html">Impermeabilização</a></li>
        <li><a href="servicos.html">Instalações Elétricas</a></li>
        <li><a href="servicos.html">Laudos Técnicos</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contato</h4>
      <p>
        <a href="tel:+5579991373093">(79) 99137-3093</a><br>
        <a href="mailto:jmedf.contato@gmail.com">jmedf.contato@gmail.com</a><br><br>
        Seg–Sex: 8h às 18h<br>
        Sáb–Dom: 9h às 13h
      </p>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 JM Edificações. Todos os direitos reservados.</span>
    <div class="footer-socials">
      <a href="https://www.facebook.com/profile.php?id=61582820973803" class="social-btn" title="Facebook">f</a>
      <a href="#" class="social-btn" title="Instagram">ig</a>
      <a href="https://wa.me/5579991373093" class="social-btn" title="WhatsApp">w</a>
    </div>
  </div>
</footer>

<!-- WHATSAPP FLOAT -->
<a href="https://wa.me/5579991373093" class="float-wpp" title="Falar no WhatsApp">
  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<script>
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

function sendWhatsApp() {
  const nome = document.querySelector('input[placeholder="Seu nome completo"]').value;
  const servico = document.querySelector('.form-select').value;
  const msg = document.querySelector('.form-textarea').value;
  const texto = `Olá! Meu nome é ${nome || 'cliente'}. Tenho interesse em: ${servico || 'um serviço'}. ${msg}`;
  window.open('https://wa.me/5579991373093?text=' + encodeURIComponent(texto), '_blank');
}
</script>
</body>
</html>
