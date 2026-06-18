// ─── Ecommerce Template ──────────────────────────────────────────────────────

function injectCSS() {
    if (!document.getElementById('ec-styles')) {
        const link = document.createElement('link');
        link.id   = 'ec-styles';
        link.rel  = 'stylesheet';
        link.href = `css/ecommerce.css?v=1.0`;
        document.head.appendChild(link);
    }
}

function buildHTML(c) {
    const { nav, hero, products, feature, categories, newsletter, footer, strip } = c;

    // ── Trust strip (doubled for seamless loop) ──────────────────────
    const stripItems = strip && strip.length
        ? [...strip, ...strip].map(item =>
            `<span class="ec-strip-item"><span class="ec-strip-icon" aria-hidden="true">✦</span>${item}</span>`
        ).join('')
        : '';

    // ── Feature stats ────────────────────────────────────────────────
    const fstats = (feature.stats || []).map(s => `
        <div class="ec-fstat">
            <div class="ec-fstat-value-wrap">
                <span class="ec-fstat-num ec-count" data-target="${s.value}">${s.value}</span>
                <span class="ec-fstat-suf">${s.suffix || '+'}</span>
            </div>
            <span class="ec-fstat-label">${s.label}</span>
        </div>
    `).join('');

    // ── Nav ──────────────────────────────────────────────────────────
    // Last nav link is Cart — rendered separately with badge
    const mainLinks = nav.links.slice(0, -1).map(l =>
        `<li><a href="#">${l}</a></li>`
    ).join('');
    const cartLabel = nav.links[nav.links.length - 1];

    // ── Product cards ────────────────────────────────────────────────
    const productCards = products.items.map((p, i) => {
        const delay = (i % 4) + 1;
        const tagClass = p.tag.toLowerCase() === 'sale' || p.tag.toLowerCase() === 'מבצע' || p.tag.toLowerCase() === 'promo' || p.tag.toLowerCase() === 'ลดราคา'
            ? 'ec-tag-sale' : '';
        return `
        <div class="ec-product-card" data-ec-reveal data-delay="${delay}">
            <div class="ec-product-image-wrap">
                <div class="ec-product-image" style="background:${p.bg}"></div>
                <span class="ec-product-tag ${tagClass}">${p.tag}</span>
                <div class="ec-product-quick">${products.quickAdd}</div>
            </div>
            <div class="ec-product-cat">${p.category}</div>
            <div class="ec-product-name">${p.name}</div>
            <div class="ec-product-price">${p.price}</div>
        </div>
        `;
    }).join('');

    // ── Category cards ───────────────────────────────────────────────
    const categoryCards = categories.items.map(cat => `
        <div class="ec-category-card" data-ec-reveal>
            <div class="ec-category-bg" style="background:${cat.bg}"></div>
            <div class="ec-category-overlay">
                <div class="ec-category-name">${cat.name}</div>
                <div class="ec-category-count">${cat.count}</div>
            </div>
        </div>
    `).join('');

    // ── Footer columns ───────────────────────────────────────────────
    const footerCols = footer.columns.map(col => {
        const links = col.links.map(l => `<li><a href="#">${l}</a></li>`).join('');
        return `
        <div>
            <div class="ec-footer-col-heading">${col.heading}</div>
            <ul class="ec-footer-col-links">${links}</ul>
        </div>
        `;
    }).join('');

    const socials = footer.socials.map(s =>
        `<li><a href="#">${s}</a></li>`
    ).join('');

    return `
<div class="ec-root" id="ec-root">

    <!-- NAV -->
    <nav class="ec-nav">
        <a class="ec-nav-logo" href="#">${nav.logo}</a>
        <ul class="ec-nav-links">${mainLinks}</ul>
        <a class="ec-nav-cart" href="#">
            ${cartLabel}
            <span class="ec-cart-badge">${nav.cartCount}</span>
        </a>
    </nav>

    <!-- HERO -->
    <section class="ec-hero">
        <div class="ec-hero-content">
            <div class="ec-hero-eyebrow">${hero.eyebrow}</div>
            <h1 class="ec-hero-headline">${hero.headline}</h1>
            <p class="ec-hero-subline">${hero.subline}</p>
            <div class="ec-hero-actions">
                <a class="ec-btn-primary" href="#">${hero.cta}</a>
                <a class="ec-btn-ghost"   href="#">${hero.ctaSecondary}</a>
            </div>
        </div>
        <div class="ec-hero-image">
            <div class="ec-hero-image-inner" id="ec-hero-img" style="background:${hero.imageBg}"></div>
        </div>
    </section>

    <!-- TRUST STRIP -->
    ${stripItems ? `
    <div class="ec-strip" aria-hidden="true">
        <div class="ec-strip-track">${stripItems}</div>
    </div>` : ''}

    <!-- PRODUCTS -->
    <section class="ec-section" id="ec-products">
        <div class="ec-section-header">
            <span class="ec-section-label">${products.sectionLabel}</span>
            <a class="ec-section-view-all" href="#">View all →</a>
        </div>
        <div class="ec-product-grid">${productCards}</div>
    </section>

    <!-- FEATURE -->
    <section class="ec-feature" id="ec-feature">
        <div class="ec-feature-image">
            <div style="position:absolute;inset:0;background:${feature.imageBg}"></div>
        </div>
        <div class="ec-feature-content">
            <div class="ec-feature-eyebrow" data-ec-reveal>${feature.eyebrow}</div>
            <h2 class="ec-feature-heading" data-ec-reveal data-delay="1">${feature.heading}</h2>
            <p class="ec-feature-body" data-ec-reveal data-delay="2">${feature.body}</p>
            <a class="ec-btn-light" href="#" data-ec-reveal data-delay="3">${feature.cta}</a>
            ${fstats ? `<div class="ec-fstats" data-ec-reveal data-delay="4">${fstats}</div>` : ''}
        </div>
    </section>

    <!-- CATEGORIES -->
    <section class="ec-section" id="ec-categories">
        <div class="ec-section-header">
            <span class="ec-section-label">${categories.sectionLabel}</span>
        </div>
        <div class="ec-category-grid">${categoryCards}</div>
    </section>

    <!-- NEWSLETTER -->
    <section class="ec-newsletter" id="ec-newsletter">
        <h2 class="ec-newsletter-heading" data-ec-reveal>${newsletter.heading}</h2>
        <p class="ec-newsletter-sub" data-ec-reveal data-delay="1">${newsletter.subline}</p>
        <div class="ec-newsletter-form" data-ec-reveal data-delay="2">
            <input class="ec-newsletter-input" type="email" placeholder="${newsletter.placeholder}" />
            <button class="ec-newsletter-btn">${newsletter.cta}</button>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="ec-footer">
        <div class="ec-footer-top">
            <div>
                <div class="ec-footer-brand-logo">${footer.logo}</div>
                <div class="ec-footer-brand-tag">${footer.tagline}</div>
            </div>
            ${footerCols}
        </div>
        <div class="ec-footer-bottom">
            <span class="ec-footer-copy">${footer.copyright}</span>
            <ul class="ec-footer-socials">${socials}</ul>
        </div>
    </footer>

</div>
    `.trim();
}

function initEcommerce() {
    const previewArea = document.getElementById('preview-area');
    if (!previewArea) return;

    // ── Hero image subtle zoom ─────────────────────────────────────
    const heroImg = document.getElementById('ec-hero-img');
    if (heroImg) {
        setTimeout(() => heroImg.classList.add('is-zoomed'), 300);
    }

    // ── Scroll reveal ─────────────────────────────────────────────
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: previewArea,
        threshold: 0.1
    });

    document.querySelectorAll('[data-ec-reveal]').forEach(el => observer.observe(el));

    // ── Parallax on feature image ──────────────────────────────────
    const featureImg = document.querySelector('.ec-feature-image');
    let rafId = null;

    const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            if (featureImg) {
                const rect = featureImg.getBoundingClientRect();
                const viewH = previewArea.clientHeight;
                const progress = (viewH - rect.top) / (viewH + rect.height);
                const shift = (progress - 0.5) * 40;
                const inner = featureImg.querySelector('div');
                if (inner) inner.style.transform = `translateY(${shift}px)`;
            }
            rafId = null;
        });
    };

    previewArea.addEventListener('scroll', onScroll, { passive: true });

    // ── Count-up for feature stats ─────────────────────────────────
    const countEls = document.querySelectorAll('.ec-count');

    const countUp = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
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

    return () => {
        observer.disconnect();
        previewArea.removeEventListener('scroll', onScroll);
        if (rafId) cancelAnimationFrame(rafId);
    };
}

export default function renderEcommerce(content) {
    injectCSS();
    const html = buildHTML(content);
    return { html, init: initEcommerce };
}
