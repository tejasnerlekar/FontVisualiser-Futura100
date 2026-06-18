// ─── Portfolio Template ───────────────────────────────────────────────────────

function injectCSS() {
    if (!document.getElementById('pf-styles')) {
        const link = document.createElement('link');
        link.id   = 'pf-styles';
        link.rel  = 'stylesheet';
        link.href = `css/portfolio.css?v=1.0`;
        document.head.appendChild(link);
    }
}

function buildHTML(c) {
    const { nav, hero, work, about, services, footer } = c;

    // Marquee items: skills doubled for seamless loop
    const mqItemsOnce = [...about.skills, hero.discipline, ...about.skills.slice(0, 3)];
    const mqItems = [...mqItemsOnce, ...mqItemsOnce].map((text, i) =>
        `<span class="pf-mq-item">${text}</span><span class="pf-mq-dot" aria-hidden="true"></span>`
    ).join('');

    // Nav links
    const navLinks = nav.links.map(l =>
        `<li><a href="#">${l}</a></li>`
    ).join('');

    // Hero name lines
    const nameLines = hero.nameLines.map(line =>
        `<span class="pf-hero-name-line">${line}</span>`
    ).join('');

    // Work cards
    const workCards = work.projects.map(p => `
        <div class="pf-work-card" data-pf-reveal>
            <div class="pf-work-card-bg" style="background:${p.bg}"></div>
            <div class="pf-work-card-bg-num" aria-hidden="true">${p.number}</div>
            <div class="pf-work-card-default">
                <span class="pf-work-card-default-title">${p.title}</span>
                <span class="pf-work-card-default-year">${p.year}</span>
            </div>
            <div class="pf-work-card-overlay">
                <div class="pf-work-card-num">${p.number}</div>
                <div class="pf-work-card-title">${p.title}</div>
                <div class="pf-work-card-cat">${p.category}</div>
                <a class="pf-work-card-link" href="#">${work.viewProject}</a>
            </div>
        </div>
    `).join('');

    // About skills
    const skills = about.skills.map(s =>
        `<span class="pf-about-skill">${s}</span>`
    ).join('');

    // Stats
    const stats = (about.stats || []).map(s => `
        <div class="pf-stat">
            <div class="pf-stat-value-wrap">
                <span class="pf-stat-value pf-count" data-target="${s.value}">${s.value}</span>
                <span class="pf-stat-suf">${s.suffix || '+'}</span>
            </div>
            <span class="pf-stat-label">${s.label}</span>
        </div>
    `).join('');

    // Services list
    const serviceItems = services.items.map(s => `
        <li class="pf-service-item" data-pf-reveal>
            <span class="pf-service-num">${s.number}</span>
            <span class="pf-service-name">${s.name}</span>
            <span class="pf-service-detail">${s.detail}</span>
        </li>
    `).join('');

    // Socials
    const socials = footer.socials.map(s =>
        `<li><a href="#">${s}</a></li>`
    ).join('');

    return `
<div class="pf-root" id="pf-root">

    <!-- NAV -->
    <nav class="pf-nav">
        <a class="pf-nav-logo" href="#">${nav.logo}</a>
        <ul class="pf-nav-links">${navLinks}</ul>
    </nav>

    <!-- HERO -->
    <section class="pf-hero" id="pf-hero">
        <div class="pf-hero-circles" aria-hidden="true">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
            <div class="circle c3"></div>
            <div class="circle c4"></div>
        </div>
        <div class="pf-hero-bg-word" aria-hidden="true">${hero.nameLines[0]}</div>
        <div class="pf-hero-content">
            <h1 class="pf-hero-name">${nameLines}</h1>
            <div class="pf-hero-meta">
                <span class="pf-hero-discipline">${hero.discipline}</span>
                <span class="pf-hero-sep" aria-hidden="true"></span>
            </div>
            <p class="pf-hero-tagline">${hero.tagline}</p>
            <div class="pf-hero-actions">
                <a class="pf-btn-primary" href="#">${hero.cta}</a>
                <span class="pf-hero-avail">${hero.availability}</span>
            </div>
        </div>
    </section>

    <!-- WORK -->
    <section class="pf-section" id="pf-work" data-num="01">
        <div class="pf-section-label">${work.sectionLabel}</div>
        <div class="pf-work-grid">${workCards}</div>
    </section>

    <!-- MARQUEE -->
    <div class="pf-marquee" aria-hidden="true">
        <div class="pf-mq-track">${mqItems}</div>
    </div>

    <!-- ABOUT -->
    <section class="pf-section" id="pf-about" data-num="02">
        <div class="pf-section-label">${about.sectionLabel}</div>
        <div class="pf-about-grid">
            <div class="pf-about-left" data-pf-reveal>
                <h2 class="pf-about-heading">${about.heading}</h2>
            </div>
            <div class="pf-about-right">
                <p class="pf-about-bio" data-pf-reveal data-delay="1">${about.bio}</p>
                <div class="pf-about-skills" data-pf-reveal data-delay="2">${skills}</div>
                <p class="pf-about-tagline" data-pf-reveal data-delay="3">${about.tagline}</p>
                ${stats ? `<div class="pf-stats" data-pf-reveal data-delay="4">${stats}</div>` : ''}
            </div>
        </div>
    </section>

    <!-- SERVICES -->
    <section class="pf-section" id="pf-services" data-num="03">
        <div class="pf-section-label">${services.sectionLabel}</div>
        <ul class="pf-services-list">${serviceItems}</ul>
    </section>

    <!-- FOOTER -->
    <footer class="pf-footer">
        <a class="pf-footer-email" href="mailto:${footer.email}">${footer.email}</a>
        <div class="pf-footer-right">
            <ul class="pf-footer-socials">${socials}</ul>
            <span class="pf-footer-copy">${footer.copyright}</span>
        </div>
    </footer>

</div>
    `.trim();
}

function initPortfolio() {
    const previewArea = document.getElementById('preview-area');
    if (!previewArea) return;

    // ── Hero entrance ─────────────────────────────────────────────────
    requestAnimationFrame(() => {
        document.querySelectorAll('.pf-hero-name-line').forEach((el, i) => {
            setTimeout(() => el.classList.add('is-in'), 80 + i * 120);
        });
        const meta    = document.querySelector('.pf-hero-meta');
        const tagline = document.querySelector('.pf-hero-tagline');
        const actions = document.querySelector('.pf-hero-actions');
        if (meta)    setTimeout(() => meta.classList.add('is-in'), 350);
        if (tagline) setTimeout(() => tagline.classList.add('is-in'), 480);
        if (actions) setTimeout(() => actions.classList.add('is-in'), 620);
    });

    // ── Scroll reveal (IntersectionObserver) ──────────────────────────
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: previewArea,
        threshold: 0.12
    });

    document.querySelectorAll('[data-pf-reveal]').forEach(el => observer.observe(el));

    // ── Scroll parallax on hero circles container ──────────────────────
    const circlesEl = document.querySelector('.pf-hero-circles');
    let rafScroll = null;

    const onScroll = () => {
        if (rafScroll) return;
        rafScroll = requestAnimationFrame(() => {
            const sy = previewArea.scrollTop;
            if (circlesEl) circlesEl.style.transform = `translateY(${sy * 0.25}px)`;
            rafScroll = null;
        });
    };

    previewArea.addEventListener('scroll', onScroll, { passive: true });

    // ── Mouse repulsion on hero circles ───────────────────────────────
    //
    // Each circle has a different "mass" — the outer ring barely moves,
    // the solid dot moves most. This breaks concentricity as the mouse
    // approaches, creating an organic, offset feel.
    //
    // Origin of the group is derived from the CSS layout values so it
    // stays stable regardless of any transform already applied to c4.
    //   c4 → right:12pc, top:11pc, size:4pc  →  center at (w - 14pc, 13pc)
    //   1pc ≈ 16px at standard 96dpi

    const hero = document.getElementById('pf-hero');
    const c1   = document.querySelector('.pf-hero-circles .c1');
    const c2   = document.querySelector('.pf-hero-circles .c2');
    const c3   = document.querySelector('.pf-hero-circles .c3');
    const c4   = document.querySelector('.pf-hero-circles .c4');

    // Measure 1pc in pixels once from the live DOM
    let ppcPx = 16;
    if (hero) {
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;width:1pc;height:0;visibility:hidden;pointer-events:none';
        hero.appendChild(probe);
        ppcPx = probe.offsetWidth || 16;
        hero.removeChild(probe);
    }

    let rafMouse = null;

    const onMouseMove = (e) => {
        if (rafMouse) return;
        rafMouse = requestAnimationFrame(() => {
            const heroRect = hero.getBoundingClientRect();
            const mx = e.clientX - heroRect.left;
            const my = e.clientY - heroRect.top;

            // Stable anchor — c4 CSS center relative to hero
            const originX = heroRect.width - 14 * ppcPx;
            const originY = 13 * ppcPx;

            const dx   = originX - mx;
            const dy   = originY - my;
            const dist = Math.hypot(dx, dy);

            if (dist < 1) { rafMouse = null; return; }

            // Influence fades out beyond ~320px
            const t    = Math.max(0, 1 - dist / 320);
            const ease = t * t * (3 - 2 * t); // smoothstep — no sharp edges
            const base = ease * 36;            // max displacement in px

            const nx = dx / dist; // unit vector pointing away from mouse
            const ny = dy / dist;

            // Different weights per ring → they drift apart from each other
            if (c1) c1.style.transform = `translate(${nx * base * 0.10}px, ${ny * base * 0.10}px)`;
            if (c2) c2.style.transform = `translate(${nx * base * 0.28}px, ${ny * base * 0.28}px)`;
            if (c3) c3.style.transform = `translate(${nx * base * 0.60}px, ${ny * base * 0.60}px)`;
            if (c4) c4.style.transform = `translate(${nx * base * 1.00}px, ${ny * base * 1.00}px)`;

            rafMouse = null;
        });
    };

    const onMouseLeave = () => {
        // CSS transition brings them home smoothly
        if (c1) c1.style.transform = '';
        if (c2) c2.style.transform = '';
        if (c3) c3.style.transform = '';
        if (c4) c4.style.transform = '';
        if (rafMouse) { cancelAnimationFrame(rafMouse); rafMouse = null; }
    };

    if (hero) {
        hero.addEventListener('mousemove', onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);
    }

    // ── Count-up for stat numbers ──────────────────────────────────────
    const countEls = document.querySelectorAll('.pf-count');

    const countUp = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
            el.textContent = Math.round(ease * target);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (countEls.length) {
        const countObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    countObs.unobserve(entry.target);
                }
            });
        }, { root: previewArea, threshold: 0.5 });

        countEls.forEach(el => countObs.observe(el));
    }

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
        observer.disconnect();
        previewArea.removeEventListener('scroll', onScroll);
        if (rafScroll) cancelAnimationFrame(rafScroll);
        if (rafMouse)  cancelAnimationFrame(rafMouse);
        if (hero) {
            hero.removeEventListener('mousemove', onMouseMove);
            hero.removeEventListener('mouseleave', onMouseLeave);
        }
    };
}

export default function renderPortfolio(content) {
    injectCSS();
    const html = buildHTML(content);
    return { html, init: initPortfolio };
}
