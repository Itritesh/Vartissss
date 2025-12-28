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
    // HELPER: POST JSON with timeout + CORS
    // ========================================================
    async function postJSON(url, payload, timeout = 10000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(id);
            const text = await res.text();
            let data = null;
            try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
            return { res, data, text };
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    // ========================================================
    // CONTACT: hero-form (keeps existing index hero forms working)
    // ========================================================
    (function attachHeroFormHandlers() {
        const forms = document.querySelectorAll('form.hero-form');
        if (!forms || forms.length === 0) return;
        forms.forEach(form => {
            if (form.dataset.handlerAttached) return;
            form.dataset.handlerAttached = '1';
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const payload = {};
                ['name', 'email', 'phone', 'message'].forEach(k => { const v = formData.get(k); if (v !== null) payload[k] = v.toString(); });
                payload.source = (form.id === 'contactForm' || window.location.pathname.includes('contact')) ? 'contact' : 'index';

                const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:');
                const endpoint = isLocal ? 'http://localhost:5000/send-mail' : 'https://vartiss-backend.vercel.app/send-mail';
                let sent = false;
                try {
                    const { res, data, text } = await postJSON(endpoint, payload, 12000);
                    if (res.ok && data && data.success) {
                        sent = true;
                    } else {
                        const errMsg = (data && data.error) ? data.error : (res.statusText || `Status ${res.status}`) || text || 'Unknown error';
                        console.warn('Send-mail failed', errMsg, { res, data, text });
                        alert('Failed to send enquiry: ' + errMsg);
                    }
                } catch (err) {
                    console.error('Send-mail network error', err);
                    if (err.name === 'AbortError') alert('Network timeout. Please try again.');
                    else alert('Network error. Please try again later.');
                }
                if (sent) { alert('Enquiry sent successfully'); form.reset(); }
            });
        });
    })();

    // ========================================================
    // CONTACT: #contactForm (single, cleaned handler)
    // ========================================================
    (function attachContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        if (form.dataset.contactHandlerAttached) return;
        form.dataset.contactHandlerAttached = '1';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector("button[type='submit']");
            const originalText = submitBtn ? submitBtn.innerText : '';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Sending...'; }

            const formData = new FormData(form);
            const payload = {
                name: (formData.get('name') || '').toString().trim(),
                email: (formData.get('email') || '').toString().trim(),
                phone: (formData.get('phone') || '').toString().trim(),
                message: (formData.get('message') || '').toString().trim(),
                source: 'contact'
            };

            if (!payload.name || !payload.email || !payload.message) {
                alert('Please fill in your name, email, and message.');
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; }
                return;
            }

                try {
                    const endpoint = 'https://vartiss-backend.vercel.app/send-mail';
                    const { res, data, text } = await postJSON(endpoint, payload, 12000);
                    if (res.ok && data && data.success) {
                        alert('Message sent successfully');
                        form.reset();
                    } else {
                        const errMsg = (data && data.error) ? data.error : (res.statusText || `Server error (${res.status})`) || text || 'Something went wrong';
                        alert(errMsg || 'Something went wrong');
                    }
                } catch (err) {
                    console.error('Send-mail network error', err);
                    if (err.name === 'AbortError') alert('Network timeout. Please try again.');
                    else alert('Network error. Please try again later.');
                } finally {
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; }
                }
        });
    })();

});

