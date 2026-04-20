<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JM Edificações | Engenharia Civil em Aracaju</title>
<meta name="description" content="Engenharia civil com planejamento técnico e compromisso. Projetos residenciais, hidráulica, impermeabilização e instalações em Aracaju e região.">
<meta property="og:title" content="JM Edificações | Engenharia Civil em Aracaju">
<meta property="og:description" content="Projetos residenciais, soluções hidráulicas, impermeabilização e instalações — qualidade técnica e compromisso em cada etapa da obra.">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:    #141210;
  --ink2:   #3a3530;
  --muted:  #7a7068;
  --warm:   #f7f3ee;
  --sand:   #e8e0d4;
  --line:   rgba(20,18,16,.1);
  --gold:   #c19a52;
  --gold-d: #8f6e30;
  --white:  #fdfcfa;
  --green:  #25D366;
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
  background: rgba(253,252,250,.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--line);
  transition: box-shadow .3s, background .3s;
}
.nav.scrolled {
  box-shadow: 0 2px 24px rgba(0,0,0,.08);
  background: rgba(253,252,250,.99);
}
.nav-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px; font-weight: 700; color: var(--ink);
  letter-spacing: -0.5px; line-height: 1;
  transition: opacity .2s;
}
.nav-logo:hover { opacity: .75; }
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
.nav-menu a:hover::after, .nav-menu a.active::after { width: 100%; }
.nav-menu a.active { color: var(--ink); }
.nav-wpp {
  display: flex; align-items: center; gap: 8px;
  background: var(--ink); color: var(--white) !important;
  padding: 10px 20px; border-radius: 2px;
  font-size: 13px !important; font-weight: 600 !important;
  letter-spacing: .5px !important; text-transform: none !important;
  transition: background .25s, transform .15s;
}
.nav-wpp:hover { background: var(--gold-d) !important; transform: translateY(-1px); }
.nav-wpp::after { display: none !important; }
.nav-wpp svg { width: 16px; height: 16px; fill: currentColor; flex-shrink: 0; }

/* ── HAMBURGER ── */
.nav-hamburger {
  display: none; flex-direction: column; gap: 5px;
  cursor: pointer; padding: 6px; border: none;
  background: none; z-index: 210;
}
.nav-hamburger span {
  display: block; width: 24px; height: 2px;
  background: var(--ink); border-radius: 2px;
  transition: transform .35s, opacity .25s, width .3s;
  transform-origin: center;
}
.nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── MOBILE DRAWER ── */
.nav-drawer {
  display: none;
  position: fixed; inset: 0; z-index: 190;
  background: rgba(20,18,16,.55);
  opacity: 0; pointer-events: none;
  transition: opacity .35s;
}
.nav-drawer.open { opacity: 1; pointer-events: all; }
.nav-drawer-inner {
  position: absolute; top: 0; right: 0;
  width: min(320px, 88vw); height: 100%;
  background: var(--white);
  padding: 96px 40px 40px;
  transform: translateX(100%);
  transition: transform .4s cubic-bezier(.25,.46,.45,.94);
  display: flex; flex-direction: column; gap: 0;
}
.nav-drawer.open .nav-drawer-inner { transform: translateX(0); }
.nav-drawer-menu { list-style: none; display: flex; flex-direction: column; }
.nav-drawer-menu li { border-bottom: 1px solid var(--line); }
.nav-drawer-menu a {
  display: block; padding: 18px 0;
  font-size: 20px; font-weight: 500;
  color: var(--ink2); letter-spacing: .3px;
  transition: color .2s, padding-left .2s;
}
.nav-drawer-menu a:hover { color: var(--ink); padding-left: 8px; }
.nav-drawer-wpp {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  background: var(--green); color: #fff;
  padding: 16px; border-radius: 2px;
  font-weight: 600; margin-top: 32px;
  transition: opacity .2s;
}
.nav-drawer-wpp:hover { opacity: .9; }
.nav-drawer-wpp svg { width: 20px; height: 20px; fill: #fff; }

/* ══════════════ HERO ══════════════ */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-top: 72px;
}
.hero-left {
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 64px;
  position: relative;
}
.hero-left::before {
  content: '';
  position: absolute; left: 0; top: 12%; bottom: 12%;
  width: 3px;
  background: linear-gradient(to bottom, transparent, var(--gold) 30%, var(--gold) 70%, transparent);
}
.hero-eyebrow { margin-bottom: 24px; }
.hero-h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(52px, 5.5vw, 80px);
  font-weight: 600; line-height: 1.0;
  color: var(--ink); letter-spacing: -1px;
  animation: fadeUp .9s ease both;
}
.hero-h1 em { font-style: italic; color: var(--gold); }
.hero-desc {
  margin-top: 28px; font-size: 17px; line-height: 1.75;
  color: var(--muted); max-width: 440px;
  animation: fadeUp .9s .12s ease both;
}
.hero-actions {
  display: flex; gap: 14px; margin-top: 44px; flex-wrap: wrap;
  animation: fadeUp .9s .22s ease both;
}
.btn-gold {
  background: var(--gold); color: var(--white);
  padding: 15px 34px; border-radius: 2px;
  font-size: 14px; font-weight: 600; letter-spacing: .3px;
  transition: background .25s, transform .2s, box-shadow .25s;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-gold:hover {
  background: var(--gold-d);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(193,154,82,.3);
}
.btn-outline {
  background: none; border: 1px solid var(--sand);
  color: var(--ink2); padding: 15px 34px; border-radius: 2px;
  font-size: 14px; font-weight: 500;
  transition: border-color .25s, color .25s, background .25s;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-outline:hover { border-color: var(--ink); color: var(--ink); background: var(--warm); }
.hero-badges {
  display: flex; gap: 40px; margin-top: 56px;
  padding-top: 40px; border-top: 1px solid var(--line);
  animation: fadeUp .9s .3s ease both;
  flex-wrap: wrap;
}
.badge-item {}
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
  transition: transform 8s ease;
}
.hero:hover .hero-img { transform: scale(1.03); }
.hero-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, var(--white) 0%, transparent 18%),
              linear-gradient(to top, rgba(20,18,16,.5) 0%, transparent 40%);
  pointer-events: none;
}
.hero-img-caption {
  position: absolute; bottom: 36px; left: 36px; right: 36px;
  color: rgba(255,255,255,.7); font-size: 12px; letter-spacing: 1.5px;
  text-transform: uppercase; pointer-events: none;
}

/* ══════════════ MARQUEE ══════════════ */
.marquee-wrap {
  background: var(--ink); overflow: hidden;
  padding: 18px 0; border-top: 1px solid rgba(255,255,255,.05);
}
.marquee-track {
  display: flex; gap: 0;
  animation: marquee 32s linear infinite;
  white-space: nowrap; width: max-content;
}
.marquee-wrap:hover .marquee-track { animation-play-state: paused; }
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

/* ══════════════ SERVIÇOS ══════════════ */
.services { padding: 120px 64px; }
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
  transition: gap .2s, opacity .2s;
  white-space: nowrap;
}
.section-link:hover { gap: 14px; opacity: .8; }

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
  height: 3px; width: 0; background: var(--gold);
  transition: width .45s cubic-bezier(.25,.46,.45,.94);
}
.service-card:hover { background: var(--warm); }
.service-card:hover::before { width: 100%; }
.service-icon {
  width: 48px; height: 48px;
  margin-bottom: 24px; color: var(--gold);
  display: flex; align-items: center; justify-content: center;
}
.service-icon svg { width: 36px; height: 36px; stroke: currentColor; fill: none; stroke-width: 1.5; }
.service-num {
  position: absolute; top: 32px; right: 32px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 64px; font-weight: 700;
  color: var(--sand); line-height: 1;
  transition: color .3s;
  user-select: none;
}
.service-card:hover .service-num { color: rgba(193,154,82,.12); }
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
  font-weight: 600; color: var(--white);
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
  transition: background .3s, border-color .3s;
}
.diff-item:hover { background: rgba(255,255,255,.08); border-color: rgba(193,154,82,.2); }
.diff-item-icon {
  color: var(--gold); margin-bottom: 16px;
  width: 32px; height: 32px;
}
.diff-item-icon svg { width: 28px; height: 28px; stroke: currentColor; fill: none; stroke-width: 1.5; }
.diff-item-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 600;
  color: var(--white); margin-bottom: 10px;
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
  cursor: pointer; background: var(--sand);
}
.proj-card img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .65s cubic-bezier(.25,.46,.45,.94), filter .65s;
  filter: brightness(.8) saturate(.7);
}
.proj-card:hover img { transform: scale(1.07); filter: brightness(.65) saturate(.6); }
.proj-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(20,18,16,.92) 0%, transparent 55%);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 32px 28px;
}
.proj-tag {
  font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 8px;
}
.proj-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 600; color: var(--white);
  line-height: 1.2;
}
.proj-arrow {
  position: absolute; top: 24px; right: 24px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(253,252,250,.12);
  border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--white); font-size: 16px;
  opacity: 0; transform: scale(.6) rotate(-45deg);
  transition: opacity .3s, transform .3s;
}
.proj-card:hover .proj-arrow { opacity: 1; transform: scale(1) rotate(0); }
.projects-cta { text-align: center; margin-top: 56px; }

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
  font-size: 140px; line-height: .5;
  color: var(--gold); opacity: .25;
  display: block; margin-bottom: -16px;
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
.testimonial-stars { color: var(--gold); font-size: 20px; margin-bottom: 28px; letter-spacing: 4px; }

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
.contact-info { margin-top: 48px; display: flex; flex-direction: column; gap: 0; }
.contact-row {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 20px 0; border-bottom: 1px solid var(--line);
  transition: background .2s;
}
.contact-row:last-child { border-bottom: none; }
.contact-icon {
  width: 44px; height: 44px; border-radius: 2px;
  background: var(--warm); display: flex;
  align-items: center; justify-content: center;
  color: var(--gold); flex-shrink: 0;
  border: 1px solid var(--sand);
  transition: background .2s, border-color .2s;
}
.contact-row:hover .contact-icon { background: var(--gold); color: var(--white); border-color: var(--gold); }
.contact-icon svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.5; }
.contact-row-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.contact-row-val { font-size: 16px; color: var(--ink); font-weight: 500; }
.contact-row-val a { color: inherit; transition: color .2s; }
.contact-row-val a:hover { color: var(--gold); }

/* ── FORMULÁRIO ── */
.contact-form {
  background: var(--warm);
  border: 1px solid var(--sand);
  border-radius: 4px;
  padding: 48px 44px;
  position: sticky; top: 96px;
}
.form-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 600; color: var(--ink);
  margin-bottom: 32px;
}
.form-group { margin-bottom: 20px; position: relative; }
.form-label {
  display: block; font-size: 12px; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 8px; font-weight: 500;
  transition: color .2s;
}
.form-group:focus-within .form-label { color: var(--gold); }
.form-input, .form-select, .form-textarea {
  width: 100%; background: var(--white);
  border: 1px solid var(--sand); border-radius: 2px;
  padding: 13px 16px; font-size: 15px;
  font-family: 'Outfit', sans-serif; color: var(--ink);
  outline: none; transition: border-color .25s, box-shadow .25s;
  appearance: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(193,154,82,.12);
}
.form-input.error, .form-select.error, .form-textarea.error {
  border-color: #e05a5a;
}
.form-error-msg {
  font-size: 12px; color: #e05a5a;
  margin-top: 6px; display: none;
}
.form-error-msg.show { display: block; }
.form-textarea { min-height: 110px; resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Select arrow */
.select-wrap { position: relative; }
.select-wrap::after {
  content: '';
  position: absolute; right: 14px; top: 50%;
  transform: translateY(-50%);
  width: 0; height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--muted);
  pointer-events: none;
}
.select-wrap select { padding-right: 36px; cursor: pointer; }

.form-submit {
  width: 100%; background: var(--ink); color: var(--white);
  border: none; border-radius: 2px;
  padding: 16px; font-size: 15px; font-weight: 600;
  font-family: 'Outfit', sans-serif; cursor: pointer;
  letter-spacing: .3px;
  transition: background .25s, transform .15s, box-shadow .25s;
  margin-top: 8px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.form-submit:hover {
  background: var(--gold-d);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(143,110,48,.25);
}
.form-submit:active { transform: translateY(0); }
.form-submit svg { width: 18px; height: 18px; fill: #fff; flex-shrink: 0; }
.form-success {
  display: none; text-align: center; padding: 24px;
  background: rgba(37,211,102,.08); border: 1px solid rgba(37,211,102,.2);
  border-radius: 2px; margin-top: 16px;
  color: #1a8a46; font-size: 15px; line-height: 1.5;
}
.form-success.show { display: block; }

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
  font-size: 28px; font-weight: 700; color: var(--white);
  margin-bottom: 16px; display: block;
  transition: opacity .2s;
}
.footer-logo:hover { opacity: .8; }
.footer-logo sup { font-size: 13px; color: var(--gold); }
.footer-tagline { font-size: 14px; line-height: 1.7; max-width: 240px; }
.footer-col h4 {
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 20px;
}
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 12px; }
.footer-col ul li a { color: rgba(253,252,250,.5); font-size: 14px; transition: color .2s; }
.footer-col ul li a:hover { color: var(--white); }
.footer-col p { font-size: 14px; line-height: 1.8; }
.footer-col a { color: rgba(253,252,250,.5); transition: color .2s; }
.footer-col a:hover { color: var(--white); }
.footer-bottom {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: rgba(253,252,250,.3);
}
.footer-socials { display: flex; gap: 12px; }
.social-btn {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.12);
  display: flex; align-items: center; justify-content: center;
  color: rgba(253,252,250,.4);
  transition: all .25s;
}
.social-btn svg { width: 16px; height: 16px; fill: currentColor; }
.social-btn:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

/* ══════════════ FLOAT WPP ══════════════ */
.float-wpp {
  position: fixed; bottom: 32px; right: 32px; z-index: 300;
  width: 58px; height: 58px; border-radius: 50%;
  background: var(--green); color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 24px rgba(37,211,102,.45);
  transition: transform .25s, box-shadow .25s;
}
.float-wpp:hover {
  transform: scale(1.12);
  box-shadow: 0 8px 36px rgba(37,211,102,.55);
}
.float-wpp svg { width: 28px; height: 28px; fill: #fff; }
.float-wpp-pulse {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--green); opacity: .4;
  animation: pulse 2.2s ease-out infinite;
}
@keyframes pulse {
  0% { transform: scale(1); opacity: .4; }
  80%, 100% { transform: scale(1.7); opacity: 0; }
}

/* ══════════════ ANIMAÇÕES ══════════════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* REVEAL — estado inicial antes do IntersectionObserver */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity .85s cubic-bezier(.25,.46,.45,.94),
              transform .85s cubic-bezier(.25,.46,.45,.94);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }
.reveal-delay-3 { transition-delay: .3s; }

/* ══════════════ MOBILE ══════════════ */
@media (max-width: 960px) {
  .nav { padding: 0 24px; }
  .nav-menu { display: none; }
  .nav-hamburger { display: flex; }
  .nav-drawer { display: block; }

  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-left { padding: 60px 24px 48px; }
  .hero-left::before { display: none; }
  .hero-right { height: 340px; }
  .hero-badges { flex-wrap: wrap; gap: 24px; }

  .services { padding: 72px 24px; }
  .section-head { flex-direction: column; align-items: flex-start; gap: 24px; }
  .services-grid { grid-template-columns: 1fr; }

  .diff { grid-template-columns: 1fr; padding: 72px 24px; gap: 48px; }
  .diff-items { grid-template-columns: 1fr 1fr; }

  .projects { padding: 72px 24px; }
  .projects-grid { grid-template-columns: 1fr 1fr; }

  .testimonial { padding: 72px 24px; }

  .contact { grid-template-columns: 1fr; padding: 72px 24px; gap: 48px; }
  .contact-form { position: static; }

  footer { padding: 60px 24px 32px; }
  .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
  .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .projects-grid { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr; }
  .diff-items { grid-template-columns: 1fr; }
  .float-wpp { bottom: 20px; right: 20px; width: 52px; height: 52px; }
}
</style>
</head>
<body>

<!-- NAV DRAWER (mobile) -->
<div class="nav-drawer" id="navDrawer" aria-hidden="true" role="dialog">
  <div class="nav-drawer-inner">
    <ul class="nav-drawer-menu">
      <li><a href="index.html">Início</a></li>
      <li><a href="portfolio.html">Portfólio</a></li>
      <li><a href="sobre.html">Sobre</a></li>
      <li><a href="servicos.html">Serviços</a></li>
      <li><a href="contato.html">Contato</a></li>
    </ul>
    <a href="https://wa.me/5579991373093" class="nav-drawer-wpp">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
  </div>
</div>

<!-- NAV -->
<nav class="nav" id="nav" role="navigation" aria-label="Navegação principal">
  <a href="index.html" class="nav-logo">JM Edifica<sup>ções</sup></a>
  <ul class="nav-menu" role="list">
    <li><a href="index.html" class="active">Início</a></li>
    <li><a href="portfolio.html">Portfólio</a></li>
    <li><a href="sobre.html">Sobre</a></li>
    <li><a href="servicos.html">Serviços</a></li>
    <li><a href="contato.html">Contato</a></li>
    <li>
      <a href="https://wa.me/5579991373093" class="nav-wpp" aria-label="Falar no WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
    </li>
  </ul>
  <button class="nav-hamburger" id="hamburger" aria-label="Abrir menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- HERO -->
<section class="hero" aria-label="Apresentação">
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
      <div class="badge-item">
        <div class="badge-num">8<span>+</span></div>
        <div class="badge-txt">Projetos<br>concluídos</div>
      </div>
      <div class="badge-item">
        <div class="badge-num">5<span>★</span></div>
        <div class="badge-txt">Avaliação<br>dos clientes</div>
      </div>
      <div class="badge-item">
        <div class="badge-num">3<span>+</span></div>
        <div class="badge-txt">Anos de<br>experiência</div>
      </div>
    </div>
  </div>
  <div class="hero-right">
    <img class="hero-img"
      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
      alt="Engenharia civil — obra em construção"
      loading="eager">
    <div class="hero-img-overlay" aria-hidden="true"></div>
    <p class="hero-img-caption" aria-hidden="true">Projetos residenciais · Aracaju e região</p>
  </div>
</section>

<!-- MARQUEE -->
<div class="marquee-wrap" aria-hidden="true">
  <div class="marquee-track">
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
<section class="services reveal" id="servicos" aria-labelledby="services-title">
  <div class="section-head">
    <div>
      <p class="label" style="margin-bottom:14px;">O que fazemos</p>
      <h2 class="section-title" id="services-title">Soluções técnicas<br>para sua <em>obra</em></h2>
    </div>
    <a href="servicos.html" class="section-link">Ver todos os serviços →</a>
  </div>

  <div class="services-grid">
    <!-- Projetos Residenciais -->
    <div class="service-card">
      <span class="service-num" aria-hidden="true">01</span>
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <div class="service-name">Projetos Residenciais</div>
      <p class="service-desc">Planta baixa, cortes, fachadas e memorial descritivo para sua residência, com rigor técnico e dentro das normas da ABNT.</p>
    </div>
    <!-- Hidráulica -->
    <div class="service-card">
      <span class="service-num" aria-hidden="true">02</span>
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
      </div>
      <div class="service-name">Hidráulica e Sanitário</div>
      <p class="service-desc">Diagnóstico, reparo e instalação de sistemas hidráulicos — reservatórios, tubulações, refluxo e estanqueidade.</p>
    </div>
    <!-- Impermeabilização -->
    <div class="service-card">
      <span class="service-num" aria-hidden="true">03</span>
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div class="service-name">Impermeabilização</div>
      <p class="service-desc">Tratamento de trincas, patologias e impermeabilização de lajes, calhas, terraços e reservatórios de concreto.</p>
    </div>
    <!-- Instalações Elétricas -->
    <div class="service-card">
      <span class="service-num" aria-hidden="true">04</span>
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <div class="service-name">Instalações Elétricas</div>
      <p class="service-desc">Pontos de luz, tomadas, ventiladores e circuitos elétricos instalados com segurança e acabamento profissional.</p>
    </div>
    <!-- Forro e Cobertura -->
    <div class="service-card">
      <span class="service-num" aria-hidden="true">05</span>
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><polyline points="4 15 4 19 8 19"/><polyline points="20 15 20 19 16 19"/><polyline points="4 9 4 5 8 5"/><polyline points="20 9 20 5 16 5"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
      </div>
      <div class="service-name">Forro e Cobertura</div>
      <p class="service-desc">Instalação de forro de PVC com barreiras térmicas, manta aluminizada e poliestireno para conforto e economia.</p>
    </div>
    <!-- Laudos Técnicos -->
    <div class="service-card">
      <span class="service-num" aria-hidden="true">06</span>
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
      <div class="service-name">Laudos Técnicos</div>
      <p class="service-desc">Elaboração de laudos e ART para regularização, vistoria, avaliação de imóveis e diagnóstico de patologias.</p>
    </div>
  </div>
</section>

<!-- DIFERENCIAIS -->
<section class="diff reveal" aria-labelledby="diff-title">
  <div class="diff-left">
    <p class="label">Por que nos escolher</p>
    <h2 class="diff-title" id="diff-title">Engenharia que<br>você pode <em>confiar</em></h2>
    <p class="diff-body">
      Cada projeto é tratado com atenção técnica, prazo cumprido e comunicação clara. Do diagnóstico à entrega, você acompanha cada etapa.
    </p>
    <div class="diff-cta">
      <a href="sobre.html" class="btn-outline" style="border-color:rgba(255,255,255,.2);color:rgba(253,252,250,.85);">Conhecer mais →</a>
    </div>
  </div>
  <div class="diff-right">
    <div class="diff-items">
      <div class="diff-item">
        <div class="diff-item-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
        </div>
        <div class="diff-item-title">Precisão técnica</div>
        <p class="diff-item-desc">Projetos elaborados conforme normas ABNT, com memorial descritivo e documentação completa.</p>
      </div>
      <div class="diff-item">
        <div class="diff-item-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div class="diff-item-title">Compromisso</div>
        <p class="diff-item-desc">Prazos respeitados e comunicação direta durante toda a execução da obra.</p>
      </div>
      <div class="diff-item">
        <div class="diff-item-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div class="diff-item-title">Atendimento local</div>
        <p class="diff-item-desc">Baseados em Aracaju, atendemos toda a região com agilidade e conhecimento do mercado local.</p>
      </div>
      <div class="diff-item">
        <div class="diff-item-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        </div>
        <div class="diff-item-title">Soluções inteligentes</div>
        <p class="diff-item-desc">Diagnóstico correto antes de qualquer intervenção — economizando tempo e recursos do cliente.</p>
      </div>
    </div>
  </div>
</section>

<!-- PROJETOS -->
<section class="projects reveal" id="portfolio" aria-labelledby="projects-title">
  <div class="section-head">
    <div>
      <p class="label" style="margin-bottom:14px;">Portfólio</p>
      <h2 class="section-title" id="projects-title">Projetos <em>realizados</em></h2>
    </div>
    <a href="portfolio.html" class="section-link">Ver portfólio completo →</a>
  </div>

  <div class="projects-grid">
    <div class="proj-card">
      <img src="https://static.wixstatic.com/media/b1bbd7_9b31ca22f9d649ffbc10602a7bc5c23a~mv2.png/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/b1bbd7_9b31ca22f9d649ffbc10602a7bc5c23a~mv2.png"
           alt="Controle de Refluxo em Reservatório"
           loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'">
      <div class="proj-overlay">
        <div class="proj-tag">Hidráulica</div>
        <div class="proj-name">Controle de Refluxo em Reservatório</div>
      </div>
      <div class="proj-arrow" aria-hidden="true">↗</div>
    </div>
    <div class="proj-card">
      <img src="https://static.wixstatic.com/media/b1bbd7_e71de871477d40c5af08c51a1ed1432e~mv2.png/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/b1bbd7_e71de871477d40c5af08c51a1ed1432e~mv2.png"
           alt="Casa Residencial — Planta e Fachada"
           loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'">
      <div class="proj-overlay">
        <div class="proj-tag">Projeto Residencial</div>
        <div class="proj-name">Casa Residencial — Planta e Fachada</div>
      </div>
      <div class="proj-arrow" aria-hidden="true">↗</div>
    </div>
    <div class="proj-card">
      <img src="https://static.wixstatic.com/media/b1bbd7_f9c1c389a6f34d0080565ffcd612453f~mv2.jpg/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/b1bbd7_f9c1c389a6f34d0080565ffcd612453f~mv2.jpg"
           alt="Tratamento de Trincas em Calhas"
           loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80'">
      <div class="proj-overlay">
        <div class="proj-tag">Impermeabilização</div>
        <div class="proj-name">Tratamento de Trincas em Calhas</div>
      </div>
      <div class="proj-arrow" aria-hidden="true">↗</div>
    </div>
  </div>

  <div class="projects-cta">
    <a href="portfolio.html" class="btn-gold">Ver todos os projetos →</a>
  </div>
</section>

<!-- DEPOIMENTO -->
<section class="testimonial reveal" aria-labelledby="testimonial-label">
  <div class="testimonial-inner">
    <div class="testimonial-stars" aria-label="5 estrelas">★★★★★</div>
    <blockquote class="testimonial-quote">
      Serviço impecável, do diagnóstico até a entrega. O profissional identificou o problema com precisão e resolveu de forma definitiva. Recomendo sem hesitar.
    </blockquote>
    <div class="testimonial-author">
      <strong>Cliente JM Edificações</strong>
      Aracaju, Sergipe
    </div>
  </div>
</section>

<!-- CONTATO -->
<section class="contact reveal" id="contato" aria-labelledby="contact-title">
  <div class="contact-left">
    <span class="label">Entre em contato</span>
    <h2 class="contact-title" id="contact-title">Vamos falar<br>sobre seu <em>projeto</em></h2>
    <p class="contact-desc">Atendemos toda Aracaju e região. Entre em contato para uma visita técnica ou orçamento sem compromisso.</p>
    <div class="contact-info">
      <div class="contact-row">
        <div class="contact-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        </div>
        <div>
          <div class="contact-row-label">Telefone / WhatsApp</div>
          <div class="contact-row-val"><a href="tel:+5579991373093">(79) 99137-3093</a></div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div>
          <div class="contact-row-label">E-mail</div>
          <div class="contact-row-val"><a href="mailto:jmedf.contato@gmail.com">jmedf.contato@gmail.com</a></div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div>
          <div class="contact-row-label">Área de atendimento</div>
          <div class="contact-row-val">Aracaju e toda a região</div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div class="contact-row-label">Horário</div>
          <div class="contact-row-val">Seg–Sex: 8h–18h &nbsp;|&nbsp; Sáb–Dom: 9h–13h</div>
        </div>
      </div>
    </div>
  </div>

  <div class="contact-form" role="form" aria-label="Formulário de orçamento">
    <div class="form-title">Solicite seu orçamento</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="f-nome">Nome</label>
        <input class="form-input" id="f-nome" type="text" placeholder="Seu nome completo" autocomplete="name">
        <span class="form-error-msg" id="err-nome">Por favor, informe seu nome.</span>
      </div>
      <div class="form-group">
        <label class="form-label" for="f-tel">Telefone</label>
        <input class="form-input" id="f-tel" type="tel" placeholder="(79) 00000-0000" autocomplete="tel">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="f-email">E-mail</label>
      <input class="form-input" id="f-email" type="email" placeholder="seu@email.com" autocomplete="email">
      <span class="form-error-msg" id="err-email">Por favor, informe um e-mail válido.</span>
    </div>
    <div class="form-group">
      <label class="form-label" for="f-servico">Serviço desejado</label>
      <div class="select-wrap">
        <select class="form-select" id="f-servico">
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
    </div>
    <div class="form-group">
      <label class="form-label" for="f-msg">Mensagem</label>
      <textarea class="form-textarea" id="f-msg" placeholder="Descreva brevemente seu projeto ou dúvida..."></textarea>
    </div>
    <button class="form-submit" id="formBtn" type="button" onclick="sendWhatsApp()">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Enviar pelo WhatsApp
    </button>
    <div class="form-success" id="formSuccess">
      ✓ Redirecionando para o WhatsApp… em alguns segundos você continuará a conversa com Jonas.
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer role="contentinfo">
  <div class="footer-top">
    <div>
      <a href="index.html" class="footer-logo">JM Edifica<sup>ções</sup></a>
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
      <a href="https://www.facebook.com/profile.php?id=61582820973803" class="social-btn" title="Facebook" aria-label="Facebook">
        <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
      </a>
      <a href="#" class="social-btn" title="Instagram" aria-label="Instagram">
        <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      </a>
      <a href="https://wa.me/5579991373093" class="social-btn" title="WhatsApp" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  </div>
</footer>

<!-- WHATSAPP FLOAT -->
<a href="https://wa.me/5579991373093" class="float-wpp" title="Falar no WhatsApp" aria-label="Abrir WhatsApp">
  <span class="float-wpp-pulse" aria-hidden="true"></span>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<script>
// ── NAV scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER / DRAWER ──
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('navDrawer');

function openDrawer() {
  drawer.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawer.addEventListener('click', (e) => {
  if (e.target === drawer) closeDrawer();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// ── REVEAL (IntersectionObserver) ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── FORMULÁRIO COM VALIDAÇÃO ──
function sendWhatsApp() {
  const nome   = document.getElementById('f-nome');
  const email  = document.getElementById('f-email');
  const servico = document.getElementById('f-servico');
  const msg    = document.getElementById('f-msg');
  let valid = true;

  // reset errors
  [nome, email].forEach(f => {
    f.classList.remove('error');
  });
  document.querySelectorAll('.form-error-msg').forEach(el => el.classList.remove('show'));

  if (!nome.value.trim()) {
    nome.classList.add('error');
    document.getElementById('err-nome').classList.add('show');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value && !emailRegex.test(email.value)) {
    email.classList.add('error');
    document.getElementById('err-email').classList.add('show');
    valid = false;
  }

  if (!valid) return;

  const texto = `Olá! Meu nome é ${nome.value.trim()}.${servico.value ? ' Tenho interesse em: ' + servico.value + '.' : ''} ${msg.value.trim()}`.trim();

  document.getElementById('formSuccess').classList.add('show');
  document.getElementById('formBtn').disabled = true;

  setTimeout(() => {
    window.open('https://wa.me/5579991373093?text=' + encodeURIComponent(texto), '_blank');
  }, 600);
}

// ── TELEFONE MASK ──
document.getElementById('f-tel').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) {
    v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
  } else if (v.length > 2) {
    v = '(' + v.slice(0,2) + ') ' + v.slice(2);
  }
  this.value = v;
});
</script>
</body>
</html>
