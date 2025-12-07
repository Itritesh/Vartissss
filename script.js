document.addEventListener("DOMContentLoaded", () => {
    
    // 1. PRELOADER
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.loader-progress');
    if(preloader && progress) {
        setTimeout(() => { progress.style.width = "100%"; }, 500);
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => { preloader.style.display = 'none'; }, 500);
            }, 1000);
        });
    }

    // 2. THEME TOGGLE
    const themeBtn = document.querySelector('.theme-btn');
    const icon = themeBtn ? themeBtn.querySelector('span') : null;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if(icon) icon.textContent = '🌙';
    }

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                icon.textContent = '☀️';
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                icon.textContent = '🌙';
            }
        });
    }

    // 3. MOBILE MENU
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 4. BACK TO TOP BUTTON
    const backToTopBtn = document.querySelector('.back-to-top');
    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. GSAP SCROLL REVEAL (Run on all pages)
    if(typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.work-card, .section-title, .step, .service-item, .team-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    // 6. HOME PAGE: DRAGGABLE OBJECT
    if (document.querySelector('.drag-object')) {
        gsap.registerPlugin(Draggable);
        Draggable.create(".drag-object", {
            type: "x,y",
            bounds: ".hero",
            inertia: true,
            edgeResistance: 0.65,
            onDragStart: function() {
                this.target.style.cursor = 'grabbing';
                this.target.style.filter = 'blur(0px)';
            },
            onDragEnd: function() {
                this.target.style.cursor = 'grab';
                this.target.style.filter = 'blur(20px)';
            }
        });
    }

    // 7. SERVICES PAGE: FAQ ACCORDION
    const faqs = document.querySelectorAll('.faq-item');
    if(faqs.length > 0) {
        faqs.forEach(faq => {
            faq.addEventListener('click', () => {
                faq.classList.toggle('active');
            });
        });
    }

    // 8. TEAM PAGE: CINEMATIC HOVER
    const teamItems = document.querySelectorAll('.team-item');
    const cursorImgContainer = document.querySelector('.cursor-img-container');
    const cursorImg = document.querySelector('.cursor-img');

    if (teamItems.length > 0) {
        if (window.innerWidth > 900) {
            // Desktop Hover Effect
            teamItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const imgUrl = item.getAttribute('data-img');
                    if(cursorImg) cursorImg.src = imgUrl;
                    
                    gsap.to(cursorImgContainer, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
                    
                    // Dim others
                    teamItems.forEach(other => { if(other !== item) other.style.opacity = '0.3'; });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(cursorImgContainer, { opacity: 0, scale: 0.8, duration: 0.3 });
                    // Reset opacity
                    teamItems.forEach(other => { other.style.opacity = '1'; });
                });

                item.addEventListener('mousemove', (e) => {
                    gsap.to(cursorImgContainer, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
                });
            });
        } else {
            // Mobile Card Injection
            teamItems.forEach(item => {
                const imgUrl = item.getAttribute('data-img');
                const img = document.createElement('img');
                img.src = imgUrl;
                img.style.width = '100%';
                img.style.height = '250px';
                img.style.objectFit = 'cover';
                item.insertBefore(img, item.firstChild);
            });
        }
    }
});