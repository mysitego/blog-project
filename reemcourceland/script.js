// JavaScript for Creative Writing Course Landing Page

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar functionality
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonials Carousel functionality
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');
    const carouselContainer = document.querySelector('.carousel-container');
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    // Initialize 3-card carousel system
    function initializeCarousel() {
        updateCarousel();
    }

    // Update carousel to show only 3 cards (prev, active, next)
    function updateCarousel() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        const totalCards = testimonialCards.length;
        
        testimonialCards.forEach((card, index) => {
            // Remove all positioning classes
            card.classList.remove('active', 'prev', 'next');
            
            // Calculate positions for 3-card display
            if (index === currentSlide) {
                // Center card (active/focus)
                card.classList.add('active');
            } else if (index === (currentSlide - 1 + totalCards) % totalCards) {
                // Left background card
                card.classList.add('prev');
            } else if (index === (currentSlide + 1) % totalCards) {
                // Right background card
                card.classList.add('next');
            }
            
            // Add transition class for smooth animation
            card.classList.add('transitioning');
        });
        
        updateIndicators();
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
            testimonialCards.forEach(card => {
                card.classList.remove('transitioning');
            });
        }, 800);
    }

    // Update indicators
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Next slide
    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = currentSlide === 0 ? testimonialCards.length - 1 : currentSlide - 1;
        updateCarousel();
    }

    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        currentSlide = index;
        updateCarousel();
    }

    // Auto-play functionality
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Event listeners for carousel controls
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });
    }

    // Indicator navigation
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopAutoPlay();
            goToSlide(index);
            startAutoPlay();
        });
    });

    // Card click navigation for 3-card system
    testimonialCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (card.classList.contains('next')) {
                // Click on right background card - go to next
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            } else if (card.classList.contains('prev')) {
                // Click on left background card - go to previous
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            }
            // Active card in center doesn't trigger navigation
        });
    });

    // Pause auto-play on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch/Swipe support for mobile
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const deltaX = startX - endX;
        const deltaY = startY - endY;
        const minSwipeDistance = 50;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            stopAutoPlay();
            if (deltaX > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            startAutoPlay();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });

    // Initialize and start the carousel
    if (testimonialCards.length > 0) {
        initializeCarousel();
        startAutoPlay();
    }

    // Scroll animations for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Observe partner items
    const partnerItems = document.querySelectorAll('.partner-item');
    partnerItems.forEach(item => {
        observer.observe(item);
    });

    // Pricing cards hover effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured') ? 
                'scale(1.05) translateY(-10px)' : 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('featured') ? 
                'scale(1.05)' : 'none';
        });
    });

    // Floating animation for hero cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index}s`;
    });

    // WhatsApp button click tracking
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    whatsappBtn.addEventListener('click', function() {
        // You can add analytics tracking here
        console.log('WhatsApp button clicked');
    });

    // CTA button click tracking
    const ctaButtons = document.querySelectorAll('.cta-primary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // You can add analytics tracking here
            console.log('CTA button clicked');
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        const rate = scrolled * -0.5;
        
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.cta-primary, .whatsapp-btn, .slider-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .loaded {
            opacity: 1;
        }

        body {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #d4af37, #b8941f);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // Add typing effect to hero title (disabled for better UX)
    // const heroTitle = document.querySelector('.hero-title');
    // const titleText = heroTitle.innerHTML;
    // heroTitle.innerHTML = '';
    
    // let i = 0;
    // function typeWriter() {
    //     if (i < titleText.length) {
    //         heroTitle.innerHTML += titleText.charAt(i);
    //         i++;
    //         setTimeout(typeWriter, 50);
    //     }
    // }
    
    // Start typing effect after a short delay
    // setTimeout(typeWriter, 1000);

    // Add counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    };

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Add custom cursor effect (optional)
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(212, 175, 55, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    cursorElement.style.left = e.clientX - 10 + 'px';
    cursorElement.style.top = e.clientY - 10 + 'px';
});