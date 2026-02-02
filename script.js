document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 0. INITIALIZE LOCOMOTIVE SCROLL (The "Smooth" Part)
    // ========================================================
    const scrollContainer = document.querySelector('[data-scroll-container]');
    let locoScroll = null;

    if (scrollContainer && typeof LocomotiveScroll !== 'undefined') {
        locoScroll = new LocomotiveScroll({
            el: scrollContainer,
            smooth: true,
            multiplier: 1,
            tablet: { smooth: true },
            smartphone: { smooth: true }
        });
    }

    // ========================================================
    // 1. PRELOADER
    // ========================================================
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.loader-progress');
    const loaderText = document.querySelector('.loader-text');

    if (preloader && progress) {
        let count = 0;
        const tick = setInterval(() => {
            count = Math.min(100, count + 4);
            progress.style.width = `${count}%`;
            if (loaderText) loaderText.textContent = `${count}%`;
            if (count >= 100) clearInterval(tick);
        }, 70);

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                if (locoScroll) locoScroll.update();
                if (typeof animateServiceHeader === 'function') animateServiceHeader();
            }, 500);
        }, 1800);
    }

    // ========================================================
    // 2. THEME TOGGLE
    // ========================================================
    const themeBtn = document.querySelector('.theme-btn');
    const icon = themeBtn ? themeBtn.querySelector('span') : null;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '🌙';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (icon) icon.textContent = '☀️';
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (icon) icon.textContent = '🌙';
            }
        });
    }

    // ========================================================
    // 3. MOBILE MENU
    // ========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                const anchor = link.querySelector('a');
                const targetId = anchor ? anchor.getAttribute('href') : null;
                if (targetId && targetId.startsWith('#') && locoScroll) {
                    e.preventDefault();
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) locoScroll.scrollTo(targetEl);
                }
            });
        });
    }

    // ========================================================
    // 4. BACK TO TOP
    // ========================================================
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        if (locoScroll && locoScroll.on) {
            locoScroll.on('scroll', (args) => {
                if (args.scroll && args.scroll.y > 300) backToTopBtn.style.display = 'flex';
                else backToTopBtn.style.display = 'none';
            });
            backToTopBtn.addEventListener('click', () => locoScroll.scrollTo(0));
        } else {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) backToTopBtn.style.display = 'flex';
                else backToTopBtn.style.display = 'none';
            });
            backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }

    // ========================================================
    // 5. GSAP / IntersectionObserver
    // ========================================================
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.step, .service-item, .team-item').forEach(el => {
            if (!el.hasAttribute('data-scroll')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease-out';
                observer.observe(el);
            }
        });
    }

    // ========================================================
    // 6. DRAGGABLE OBJECT
    // ========================================================
    if (document.querySelector('.drag-object') && window.innerWidth > 1024 && typeof Draggable !== 'undefined') {
        if (typeof gsap !== 'undefined' && gsap.registerPlugin) gsap.registerPlugin(Draggable);
        document.querySelectorAll('.drag-object').forEach(obj => {
            const boundsEl = obj.closest('[data-scroll-section]') || '.hero';
            Draggable.create(obj, {
                type: 'x,y',
                bounds: boundsEl,
                inertia: true,
                edgeResistance: 0.65,
                onDragStart() { this.target.style.cursor = 'grabbing'; this.target.style.filter = 'blur(0px)'; },
                onDragEnd() { this.target.style.cursor = 'grab'; this.target.style.filter = 'blur(18px)'; }
            });
        });
    }

    // ========================================================
    // 7. FAQ ACCORDION
    // ========================================================
    const faqs = document.querySelectorAll('.faq-item');
    if (faqs.length) {
        faqs.forEach(faq => {
            faq.addEventListener('click', () => {
                faq.classList.toggle('active');
                setTimeout(() => { if (locoScroll) locoScroll.update(); }, 500);
            });
        });
    }

    // ========================================================
    // 8. TEAM HOVER
    // ========================================================
    const teamItems = document.querySelectorAll('.team-item');
    const cursorImgContainer = document.querySelector('.cursor-img-container');
    const cursorImg = document.querySelector('.cursor-img');

    if (teamItems.length) {
        if (window.innerWidth > 900) {
            teamItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const imgUrl = item.getAttribute('data-img');
                    if (cursorImg && imgUrl) cursorImg.src = imgUrl;
                    if (cursorImgContainer) gsap.to(cursorImgContainer, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
                    teamItems.forEach(other => { if (other !== item) other.style.opacity = '0.3'; });
                });
                item.addEventListener('mouseleave', () => {
                    if (cursorImgContainer) gsap.to(cursorImgContainer, { opacity: 0, scale: 0.8, duration: 0.3 });
                    teamItems.forEach(other => { other.style.opacity = '1'; });
                });
                item.addEventListener('mousemove', (e) => { if (cursorImgContainer) gsap.to(cursorImgContainer, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' }); });
            });
        } else {
            teamItems.forEach(item => {
                if (!item.querySelector('.mobile-team-img')) {
                    const imgUrl = item.getAttribute('data-img');
                    if (imgUrl) {
                        const img = document.createElement('img');
                        img.src = imgUrl; img.classList.add('mobile-team-img'); img.style.width = '100%'; img.style.height = '250px'; img.style.objectFit = 'cover'; img.style.borderRadius = '10px'; img.style.marginBottom = '20px';
                        item.insertBefore(img, item.firstChild);
                    }
                }
            });
        }
    }

    // ========================================================
    // 9. RESIZE
    // ========================================================
    window.addEventListener('resize', () => { clearTimeout(window.resizeTimer); window.resizeTimer = setTimeout(() => { if (locoScroll) locoScroll.update(); }, 100); });

    // ========================================================
    // 10. SERVICE HEADER ANIMATION
    // ========================================================
    function animateServiceHeader() {
        const filledText = document.querySelector('.crazy-title .filled');
        const subtitle = document.querySelector('.crazy-subtitle');
        if (filledText) setTimeout(() => { filledText.style.width = '100%'; }, 300);
        if (subtitle) gsap.to(subtitle, { opacity: 1, y: 0, duration: 1, delay: 1, ease: 'power2.out' });
    }

    // ========================================================
    // HELPER: POST JSON (no AbortController)
    // Removed AbortController/timeouts to avoid premature aborts
    // during Vercel cold starts and SMTP delays.
    // ========================================================
    async function postJSON(url, payload) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const text = await res.text();
            let data = null;
            try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
            return { res, data, text };
        } catch (err) {
            throw err;
        }
    }

    // ========================================================
    // HELPER: sendMail - centralized mail sender (uses absolute backend)
    // ========================================================
    async function sendMail(payload) {
        // Production backend (Railway) — used when the site is deployed to Netlify
        const PROD_ENDPOINT = 'https://vartiss-backend-production.up.railway.app/send-mail';
        const LOCAL_ENDPOINTS = [
            // local dev http server
            'http://localhost:5000/send-mail',
            'http://localhost:5001/send-mail',
            // relative fallback when frontend is served from the same origin
            '/send-mail'
        ];

        // Try prod first, then fall back to local endpoints to aid local development
        try {
            return await postJSON(PROD_ENDPOINT, payload);
        } catch (err) {
            console.warn('Prod endpoint failed, attempting local fallbacks', err);
            for (const ep of LOCAL_ENDPOINTS) {
                try {
                    const resp = await postJSON(ep, payload);
                    return resp;
                } catch (e) {
                    console.warn('Fallback endpoint failed:', ep, e);
                }
            }
            // If all endpoints fail, rethrow the original error
            throw err;
        }
    }



    // Attach submit listeners to ALL forms safely
    (function attachAllForms() {
        const forms = document.querySelectorAll('form');
        if (!forms || forms.length === 0) return;

        forms.forEach(form => {
            // prevent double-binding
            if (form.dataset.handlerAttached === '1') return;
            form.dataset.handlerAttached = '1';

            // per-form in-flight guard to prevent duplicate POSTs
            form.dataset.sending = '0';

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (form.dataset.sending === '1') {
                    // already sending, ignore duplicate submit
                    return;
                }
                form.dataset.sending = '1';

                const submitBtn = form.querySelector("button[type='submit']");
                const originalText = submitBtn ? submitBtn.innerText : '';
                if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Sending...'; }

                try {
                    const formData = new FormData(form);

                    // Normalize payload to the exact schema required
                    const getVal = (key) => {
                        const v = formData.get(key);
                        if (v === null) return '';
                        const s = v.toString().trim();
                        // treat placeholder-like values as empty
                        if (s === '' || s.toLowerCase() === 'select' || s.toLowerCase() === 'please select' || s.toLowerCase() === 'choose') return '';
                        return s;
                    };

                    const payload = {
                        name: getVal('name'),
                        email: getVal('email'),
                        phone: getVal('phone'),
                        message: getVal('message'),
                        source: (form.id && form.id.toLowerCase().includes('contact')) || window.location.pathname.toLowerCase().includes('contact') ? 'contact' : 'index'
                    };

                    const { res, data, text } = await sendMail(payload);

                    // Successful send
                    if (res && res.ok && data && (data.success === true || data.success === 'true')) {
                        if (submitBtn) submitBtn.innerText = 'Sent';
                        try { form.reset(); } catch (e) { /* ignore reset errors */ }
                    } else {
                        const errMsg = (data && (data.error || data.message)) ? (data.error || data.message) : (res && res.statusText) ? res.statusText : (res ? `Server error (${res.status})` : (text || 'Failed to send'));
                        console.error('Email send failed:', errMsg, { res, data, text });
                        if (submitBtn) submitBtn.innerText = 'Error';
                        if (submitBtn && errMsg) submitBtn.title = String(errMsg);
                    }
                } catch (err) {
                    console.error('Send-mail network error', err);
                    if (submitBtn) submitBtn.innerText = 'Network Error';
                    if (submitBtn) submitBtn.title = err && err.message ? err.message : 'Network error';
                } finally {
                    // restore button state after short delay so user sees status
                    setTimeout(() => {
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; submitBtn.title = ''; }
                        form.dataset.sending = '0';
                    }, 1200);
                }
            });
        });
    })();


});