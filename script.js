document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================================
    // 0. INITIALIZE LOCOMOTIVE SCROLL (The "Smooth" Part)
    // ========================================================
    const scrollContainer = document.querySelector('[data-scroll-container]');
    let locoScroll = null;

    if (scrollContainer) {
        locoScroll = new LocomotiveScroll({
            el: scrollContainer,
            smooth: true,
            multiplier: 1, // Scroll speed (1 is default)
            tablet: { smooth: true }, // Smooth on tablets
            smartphone: { smooth: true } // Smooth on phones
        });
    }

    // ========================================================
    // 1. PRELOADER (Enhanced Logic)
    // ========================================================
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.loader-progress');
    const loaderText = document.querySelector('.loader-text');

    if(preloader && progress) {
        let count = 0;
        const tick = setInterval(() => {
            count = Math.min(100, count + 4);
            progress.style.width = `${count}%`;
            if (loaderText) loaderText.textContent = `${count}%`;
            if (count >= 100) clearInterval(tick);
        }, 70);

        // Hide preloader after animation completes
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { 
                preloader.style.display = 'none'; 
                // CRITICAL: Update Locomotive Scroll once DOM is fully visible
                if(locoScroll) locoScroll.update();
                
                // TRIGGER NEW SERVICE HEADER ANIMATION
                animateServiceHeader();
                
            }, 500);
        }, 1800);
    }

    // ========================================================
    // 2. THEME TOGGLE (Preserved)
    // ========================================================
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

    // ========================================================
    // 3. MOBILE MENU (Integrated with Smooth Scroll)
    // ========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if(hamburger && navLinks) {
        // Toggle Menu
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu & Smooth Scroll to section on click
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');

                // Get target href (e.g., #services)
                const anchor = link.querySelector('a');
                const targetId = anchor ? anchor.getAttribute('href') : null;

                // If it's a hash link on the same page
                if(targetId && targetId.startsWith('#') && locoScroll) {
                    e.preventDefault();
                    const targetEl = document.querySelector(targetId);
                    if(targetEl) {
                        locoScroll.scrollTo(targetEl);
                    }
                }
            });
        });
    }

    // ========================================================
    // 4. BACK TO TOP BUTTON (Locomotive Compatible)
    // ========================================================
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if(backToTopBtn) {
        if(locoScroll) {
            // Locomotive Scroll Listener
            locoScroll.on('scroll', (args) => {
                if (args.scroll.y > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });

            backToTopBtn.addEventListener('click', () => {
                locoScroll.scrollTo(0); // Scroll to top
            });
        } else {
            // Fallback for pages without Locomotive
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
    }

    // ========================================================
    // 5. GSAP SCROLL REVEAL (Legacy Support)
    // ========================================================
    if(typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        // Select elements ONLY if they don't have data-scroll (to avoid conflict)
        document.querySelectorAll('.step, .service-item, .team-item').forEach(el => {
            if(!el.hasAttribute('data-scroll')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease-out';
                observer.observe(el);
            }
        });
    }

    // ========================================================
    // 6. HOME PAGE: DRAGGABLE OBJECT
    // ========================================================
    if (document.querySelector('.drag-object') && window.innerWidth > 1024) {
        gsap.registerPlugin(Draggable);
        document.querySelectorAll(".drag-object").forEach(obj => {
            const boundsEl = obj.closest('[data-scroll-section]') || ".hero";
            Draggable.create(obj, {
                type: "x,y",
                bounds: boundsEl,
                inertia: true,
                edgeResistance: 0.65,
                onDragStart: function() {
                    this.target.style.cursor = 'grabbing';
                    this.target.style.filter = 'blur(0px)';
                },
                onDragEnd: function() {
                    this.target.style.cursor = 'grab';
                    this.target.style.filter = 'blur(18px)';
                }
            });
        });
    }

    // ========================================================
    // 7. SERVICES PAGE: FAQ ACCORDION (Preserved)
    // ========================================================
    const faqs = document.querySelectorAll('.faq-item');
    if(faqs.length > 0) {
        faqs.forEach(faq => {
            faq.addEventListener('click', () => {
                faq.classList.toggle('active');
                // Update locomotive scroll layout when accordion expands
                setTimeout(() => { if(locoScroll) locoScroll.update(); }, 500);
            });
        });
    }

    // ========================================================
    // 8. TEAM PAGE: CINEMATIC HOVER (Preserved)
    // ========================================================
    const teamItems = document.querySelectorAll('.team-item');
    const cursorImgContainer = document.querySelector('.cursor-img-container');
    const cursorImg = document.querySelector('.cursor-img');

    if (teamItems.length > 0) {
        if (window.innerWidth > 900) {
            // Desktop Hover Effect
            teamItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const imgUrl = item.getAttribute('data-img');
                    if(cursorImg && imgUrl) cursorImg.src = imgUrl;
                    
                    if(cursorImgContainer) {
                        gsap.to(cursorImgContainer, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
                    }
                    
                    // Dim others
                    teamItems.forEach(other => { if(other !== item) other.style.opacity = '0.3'; });
                });

                item.addEventListener('mouseleave', () => {
                    if(cursorImgContainer) {
                        gsap.to(cursorImgContainer, { opacity: 0, scale: 0.8, duration: 0.3 });
                    }
                    // Reset opacity
                    teamItems.forEach(other => { other.style.opacity = '1'; });
                });

                item.addEventListener('mousemove', (e) => {
                    if(cursorImgContainer) {
                        gsap.to(cursorImgContainer, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
                    }
                });
            });
        } else {
            // Mobile Card Injection
            teamItems.forEach(item => {
                if(!item.querySelector('.mobile-team-img')) {
                    const imgUrl = item.getAttribute('data-img');
                    if(imgUrl) {
                        const img = document.createElement('img');
                        img.src = imgUrl;
                        img.classList.add('mobile-team-img');
                        img.style.width = '100%';
                        img.style.height = '250px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '10px';
                        img.style.marginBottom = '20px';
                        item.insertBefore(img, item.firstChild);
                    }
                }
            });
        }
    }

    // ========================================================
    // 9. WINDOW RESIZE HANDLER
    // ========================================================
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            if(locoScroll) locoScroll.update();
        }, 100);
    });

    // ========================================================
    // 10. NEW: SERVICES HEADER ANIMATION
    // ========================================================
    function animateServiceHeader() {
        const filledText = document.querySelector('.crazy-title .filled');
        const subtitle = document.querySelector('.crazy-subtitle');

        if(filledText) {
            // Fill the text (width 0 -> 100%)
            setTimeout(() => {
                filledText.style.width = '100%';
            }, 300);
        }

        if(subtitle) {
            // Fade in subtitle
            gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 1,
                ease: "power2.out"
            });
        }
    }

});
