class App {
    constructor() {
        this.config = null;
        this.state = {
            theme:      'light',
            accent:     null,
            genre:      'news',
            language:   'english',
            font:       'futura-latin',
            content:    null,
            deviceMode: 'full'
        };
        this.clockInterval    = null;
        this._cleanupTemplate = null;

        this.el = {
            previewArea:   document.getElementById('preview-area'),
            deviceShell:   document.getElementById('device-shell'),
            btnLight:      document.getElementById('btn-light'),
            btnDark:       document.getElementById('btn-dark'),
            tbGenres:      document.getElementById('tb-genres'),
            tbLangs:       document.getElementById('tb-langs'),
            tbAccents:     document.getElementById('tb-accents'),
            tbDevice:      document.getElementById('tb-device'),
            dynamicStyles: document.getElementById('dynamic-styles')
        };

        this.init();
    }

    // ── Bootstrap ──────────────────────────────────────────────────────
    async init() {
        const res = await fetch(`config.json?v=${Date.now()}`, { cache: 'no-store' });
        this.config = await res.json();
        this.state.accent = this.config.accents[0];
        this.buildToolbar();
        await this.loadContent();
        this.attachEvents();
        this.prewarmFonts();
    }

    // ── Pre-warm all font families so switching is instant ─────────────
    prewarmFonts() {
        if (!('fonts' in document)) return;
        this.config.fonts.forEach(f => {
            // Load regular + bold so both are cached before user switches
            document.fonts.load(`400 1em "${f.family}"`);
            document.fonts.load(`700 1em "${f.family}"`);
        });
    }

    // ── Build toolbar controls from config ─────────────────────────────
    buildToolbar() {
        // Genre tabs
        this.el.tbGenres.innerHTML = this.config.genres.map((g, i) =>
            `<button class="tb-genre-btn${i === 0 ? ' active' : ''}" data-genre="${g.id}">${g.name}</button>`
        ).join('');

        // Language pills — use first 2 chars of name as code (EN, FR, HE, TH)
        this.el.tbLangs.innerHTML = this.config.languages.map((l, i) =>
            `<button class="tb-lang-btn${i === 0 ? ' active' : ''}" data-lang="${l.id}">${l.name.slice(0,2).toUpperCase()}</button>`
        ).join('');

        // Accent dots
        this.el.tbAccents.innerHTML = this.config.accents.map((acc, i) =>
            `<button class="tb-accent-dot${i === 0 ? ' active' : ''}"
                     style="background:${acc.color}; --dot-color:${acc.color}"
                     data-index="${i}"
                     title="${acc.name}"
                     aria-label="Accent: ${acc.name}"></button>`
        ).join('');

        this.applyAccentColor(this.state.accent);
    }

    // ── Event wiring ───────────────────────────────────────────────────
    attachEvents() {
        // Theme
        this.el.btnLight.addEventListener('click', () => this.setTheme('light'));
        this.el.btnDark.addEventListener('click',  () => this.setTheme('dark'));

        // Genre tabs
        this.el.tbGenres.addEventListener('click', async (e) => {
            const btn = e.target.closest('.tb-genre-btn');
            if (!btn) return;
            this.el.tbGenres.querySelectorAll('.tb-genre-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.genre = btn.dataset.genre;
            await this.loadContent();
        });

        // Language pills
        this.el.tbLangs.addEventListener('click', async (e) => {
            const btn = e.target.closest('.tb-lang-btn');
            if (!btn) return;
            this.el.tbLangs.querySelectorAll('.tb-lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.language = btn.dataset.lang;
            await this.loadContent();
        });

        // Accent dots
        this.el.tbAccents.addEventListener('click', (e) => {
            const dot = e.target.closest('.tb-accent-dot');
            if (!dot) return;
            this.el.tbAccents.querySelectorAll('.tb-accent-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            this.setAccentColor(this.config.accents[dot.dataset.index]);
        });

        // Device mode
        this.el.tbDevice.addEventListener('click', (e) => {
            const btn = e.target.closest('.tb-device-btn');
            if (!btn) return;
            this.el.tbDevice.querySelectorAll('.tb-device-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.setDeviceMode(btn.dataset.mode);
        });
    }

    // ── Theme ──────────────────────────────────────────────────────────
    setTheme(theme) {
        this.state.theme = theme;
        document.body.classList.toggle('dark-mode',  theme === 'dark');
        document.body.classList.toggle('light-mode', theme === 'light');
        this.el.btnLight.classList.toggle('active', theme === 'light');
        this.el.btnDark.classList.toggle('active',  theme === 'dark');
    }

    // ── Accent ─────────────────────────────────────────────────────────
    // ── Device mode ────────────────────────────────────────────────────
    setDeviceMode(mode) {
        this.state.deviceMode = mode;
        this.el.deviceShell.classList.remove('mode-full', 'mode-desktop', 'mode-mobile');
        this.el.deviceShell.classList.add(`mode-${mode}`);
        this.el.previewArea.classList.toggle('preview-mobile', mode === 'mobile');
    }

    setAccentColor(acc) { this.state.accent = acc; this.applyAccentColor(acc); }

    applyAccentColor(acc) {
        document.documentElement.style.setProperty('--accent-color', acc.color);
        document.documentElement.style.setProperty('--accent-hover', acc.hover);
        document.documentElement.style.setProperty('--cp-accent',    acc.color);
    }

    // ── Load & render ──────────────────────────────────────────────────
    async loadContent() {
        const langConfig = this.config.languages.find(l => l.id === this.state.language);
        if (!langConfig) return;

        try {
            if (langConfig.defaultFontId) this.state.font = langConfig.defaultFontId;
            this.el.previewArea.setAttribute('dir', langConfig.dir || 'ltr');

            const res = await fetch(
                `content/${this.state.genre}_${this.state.language}.json?v=${Date.now()}`,
                { cache: 'no-store' }
            );
            this.state.content = await res.json();

            this.applyFont();
            await this.renderLayout();
        } catch (err) {
            console.error('Failed to load content:', err);
            this.el.previewArea.innerHTML =
                `<div style="padding:2rem;font-family:sans-serif;color:#888;font-size:13px">
                    Error loading: ${this.state.genre} / ${this.state.language}
                 </div>`;
        }
    }

    applyFont() {
        const fontConfig = this.config.fonts.find(f => f.id === this.state.font);
        if (!fontConfig) return;

        // Build a full Futura stack: active font first, then all other Futura
        // variants as fallbacks, so we never fall straight to a system font.
        const others = this.config.fonts
            .filter(f => f.id !== fontConfig.id)
            .map(f => `"${f.family}"`)
            .join(', ');
        const stack = others
            ? `"${fontConfig.family}", ${others}, sans-serif`
            : `"${fontConfig.family}", sans-serif`;

        this.el.previewArea.style.fontFamily = stack;

        // Update toolbar variant label
        const variantEl = document.getElementById('tb-font-variant');
        if (variantEl) variantEl.textContent = fontConfig.name;
    }

    async renderLayout() {
        if (this.clockInterval) { clearInterval(this.clockInterval); this.clockInterval = null; }

        if (this._cleanupTemplate) {
            try { this._cleanupTemplate(); } catch (_) {}
            this._cleanupTemplate = null;
        }

        try {
            const { default: renderTemplate } =
                await import(`./templates/${this.state.genre}.js?v=4.0`);

            const result = renderTemplate(this.state.content);

            if (typeof result === 'string') {
                this.el.previewArea.innerHTML = result;
                if (this.state.genre === 'news') this.startLiveClock();
            } else if (result?.html) {
                this.el.previewArea.innerHTML = result.html;
                if (result.init) {
                    setTimeout(() => {
                        const cleanup = result.init();
                        if (typeof cleanup === 'function') this._cleanupTemplate = cleanup;
                    }, 50);
                }
            }
        } catch (err) {
            console.error('Template render error:', err);
            this.el.previewArea.innerHTML =
                `<div style="padding:2rem;font-family:sans-serif;color:#c00;font-size:13px">${err.message}</div>`;
        }
    }

    // ── Live clock (news template) ─────────────────────────────────────
    startLiveClock() {
        if (this.clockInterval) clearInterval(this.clockInterval);

        const tick = () => {
            const el = document.getElementById('live-date-time');
            if (!el) { clearInterval(this.clockInterval); return; }
            const langConfig = this.config.languages.find(l => l.id === this.state.language);
            const locale   = langConfig?.dateLocale || 'en-GB';
            const timezone = langConfig?.timezone   || 'UTC';
            const now = new Date();
            const dateStr = new Intl.DateTimeFormat(locale, { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now);
            const timeStr = new Intl.DateTimeFormat(locale, { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
            el.innerHTML = `${dateStr} &nbsp;|&nbsp; ${timeStr}`;
        };

        tick();
        this.clockInterval = setInterval(tick, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
