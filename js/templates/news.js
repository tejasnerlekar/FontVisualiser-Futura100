export default function renderNewsTemplate(data) {
    if (!data) return '';

    // Load news specialized CSS if not present
    if (!document.getElementById('news-css')) {
        const link = document.createElement('link');
        link.id = 'news-css';
        link.rel = 'stylesheet';
        link.href = 'css/news.css?v=1.5';
        document.head.appendChild(link);
    }

    return `
        <div class="news-layout hybrid-style">
            <!-- Clean Header -->
            <header class="news-header-hybrid">
                <div class="logo-container">
                    <div class="date-top" id="live-date-time">${data.currentDate || "रविवार, २९ मार्च २०२६"}</div>
                    <div class="logo">${data.siteName || "NEWS PATERA"}</div>
                    <div class="theme-placeholder"></div> <!-- For balancing the flexbox -->
                </div>
                <nav class="news-nav-hybrid">
                    ${data.navItems.map(item => `<a href="#">${item}</a>`).join('')}
                </nav>
            </header>
            
            <div class="news-breaking-hybrid">
                <span class="badge">${data.breakingTitle || 'ताज़ा समाचार'}</span>
                <div class="ticker-wrapper">
                    <div class="ticker-content">
                        ${Array.isArray(data.breaking)
            ? [...data.breaking, ...data.breaking].map(item => `<span class="ticker-item">${item}</span>`).join('<span class="ticker-separator">•</span>')
            : `<span class="text">${data.breaking}</span>`
        }
                    </div>
                </div>
            </div>

            <main class="news-main-grid-hybrid">
                <!-- Left Content: Hero + Clean Text Articles -->
                <div class="main-content-left">
                    <section class="hero-section-hybrid">
                        <div class="hero-content">
                            <span class="meta">${data.heroArticle.meta}</span>
                            <h1 class="hero-title">${data.heroArticle.title}</h1>
                            <p class="hero-excerpt">${data.heroArticle.excerpt}</p>
                        </div>
                        <div class="hero-image-placeholder"></div>
                    </section>
                    
                    <div class="sub-hero-grid-hybrid">
                        ${data.sideArticles.slice(0, 2).map(article => `
                            <article class="sub-hero-article">
                                <h4 class="title">${article.title}</h4>
                                <p class="excerpt">${article.excerpt}</p>
                                <p class="meta">${article.meta}</p>
                                <span class="read-more">${data.readMoreText || 'और पढ़ें'}</span>
                            </article>
                        `).join('')}
                    </div>
                </div>

                <aside class="latest-news-sidebar-hybrid">
                    <h3 class="sidebar-title">${data.latestNewsTitle || 'बड़ी ख़बरें'}</h3>
                    <ul class="latest-list-hybrid">
                        ${data.sideArticles.slice(2, 4).map(article => `
                            <li class="latest-item">
                                <span class="meta-time">${article.meta.split(' • ')[1] || article.meta}</span>
                                <h4 class="title">${article.title}</h4>
                                <p class="excerpt">${article.excerpt}</p>
                                <span class="read-more">${data.readMoreText || 'और पढ़ें'}</span>
                            </li>
                        `).join('')}
                        ${data.opinions ? data.opinions.map(opinion => `
                            <li class="latest-item opinion-item">
                                <span class="author-name">${opinion.author}</span>
                                <h4 class="title">${opinion.title}</h4>
                                <p class="excerpt">${opinion.excerpt}</p>
                                <span class="read-more">${data.readMoreText || 'और पढ़ें'}</span>
                            </li>
                        `).join('') : ''}
                    </ul>
                </aside>
            </main>

            ${data.quotes ? data.quotes.map(quote => `
                <section class="quote-section-hybrid">
                    <div class="quote-content">
                        <div class="quote-text">"${quote.text}"</div>
                        <div class="quote-author">— ${quote.author}</div>
                    </div>
                </section>
            `).join('') : ''}

            <!-- Bottom Grid (Typography Focus) -->
            <section class="bottom-grid-hybrid">
                ${data.gridArticles.map(article => `
                    <article class="grid-article-hybrid">
                        <span class="category">${article.category}</span>
                        <h4 class="title">${article.title}</h4>
                        <p class="excerpt">${article.excerpt}</p>
                        <span class="read-more">${data.readMoreText || 'और पढ़ें'}</span>
                    </article>
                `).join('')}
            </section>

            ${data.footer ? `
                <footer class="news-footer-hybrid">
                    <div class="footer-nav">
                        ${data.footer.sections.map(section => `
                            <div class="footer-column">
                                <h4>${section.title}</h4>
                                <ul>
                                    ${section.links.map(link => `<li><a href="#">${link}</a></li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    <div class="footer-copyright">
                        ${data.footer.copyright}
                    </div>
                </footer>
            ` : ''}
        </div>
    `;
}
