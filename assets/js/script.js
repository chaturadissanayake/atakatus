(function($) {
    "use strict";

    $(document).ready(function() {
        const $window = $(window);
        
        // Hide navbar on link click
        $('.nav-link-click').click(() => $('.navbar-collapse').collapse('hide'));

        // Preloader and Document Load Actions
        $window.on('load', () => {
            $('.loader').fadeOut();
            $('#preloader-area').delay(350).fadeOut('slow');

            initializeIsotope('.project-masonry-active', '.item');
            initializeIsotope('.blog-standard-wrap', '.item');

            animatePreloader();
        });

        // Initialize Isotope for Project and Blog filtering
        const initializeIsotope = (selector, itemSelector) => {
            if ($(selector).length) {
                $(selector).imagesLoaded(() => {
                    $(selector).isotope({ itemSelector });
                });
            }
        };

        // Animate preloader SVG and hide
        const animatePreloader = () => {
            const svg = document.getElementById("preloaderSvg");
            const tl = gsap.timeline();
            const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
            const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

            tl.to(".preloader-heading .load-text , .preloader-heading .cont", {
                delay: 1.5, y: -100, opacity: 0
            }).to(svg, {
                duration: 0.5, attr: { d: curve }, ease: "power2.easeIn"
            }).to(svg, {
                duration: 0.5, attr: { d: flat }, ease: "power2.easeOut"
            }).to(".preloader", {
                y: -1500, zIndex: -1, display: "none"
            });
        };

        // Fixed header on scroll
        const headerStyle = () => {
            if ($('.main-header').length) {
                const siteHeader = $('.main-header');
                const scrollLink = $('.scroll-top');
                const windowPos = $window.scrollTop();

                windowPos >= 250 ? siteHeader.addClass('fixed-header') && scrollLink.fadeIn(300) 
                                 : siteHeader.removeClass('fixed-header') && scrollLink.fadeOut(300);
            }
        };
        headerStyle();
        $window.on('scroll', headerStyle);

        // Magnific Popup initialization
        const initMagnificPopup = () => {
            $('.work-popup').magnificPopup({
                type: 'image',
                gallery: { enabled: true }
            });

            $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                type: 'iframe',
                preloader: false,
                fixedContentPos: false
            });
        };
        initMagnificPopup();

        // Scroll to Top logic with progress
        const progressPath = document.querySelector('.progress-wrap path');
        if (progressPath) {
            const pathLength = progressPath.getTotalLength();
            progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
            progressPath.style.strokeDashoffset = pathLength;

            const updateProgress = () => {
                const scroll = $window.scrollTop();
                const height = $(document).height() - $window.height();
                progressPath.style.strokeDashoffset = pathLength - (scroll * pathLength / height);
            };
            $window.on('scroll', updateProgress);
            updateProgress();

            $('.progress-wrap').on('click', (e) => {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, 550);
            });

            $window.on('scroll', function() {
                $(this).scrollTop() > 150 ? $('.progress-wrap').addClass('active-progress') 
                                          : $('.progress-wrap').removeClass('active-progress');
            });
        }

        // Initialize scroller animation if animations are not disabled
        const initScrollerAnimation = () => {
            const scrollers = document.querySelectorAll(".scroller");
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                scrollers.forEach(scroller => {
                    scroller.setAttribute("data-animated", true);
                    const scrollerInner = scroller.querySelector(".scroller__inner");
                    const scrollerContent = [...scrollerInner.children];
                    scrollerContent.forEach(item => scrollerInner.appendChild(item.cloneNode(true)));
                });
            }
        };
        initScrollerAnimation();

        // Custom cursor animation
        const cursorBall = document.getElementById('ball');
        document.addEventListener('mousemove', e => gsap.to(cursorBall, {
            duration: 0.3, x: e.clientX, y: e.clientY, opacity: 1
        }));

        const hoverElements = document.querySelectorAll('a');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorBall.classList.add('hovered');
                gsap.to(cursorBall, { duration: 0.3, scale: 2, opacity: 0 });
            });
            element.addEventListener('mouseleave', () => {
                cursorBall.classList.remove('hovered');
                gsap.to(cursorBall, { duration: 0.3, scale: 1, opacity: 1 });
            });
        });

        // Dropdown menu hover and click behavior
        $('.navigation li.dropdown').hover(function() {
            if ($window.width() >= 992) {
                $(this).children('ul, .megamenu').stop(true, false, true).slideToggle(300);
            }
        }).children('.dropdown-btn').on('click', function() {
            $(this).prev('ul, .megamenu').slideToggle(500);
        });

        // Project Filter with Isotope
        $('.project-filter li').on('click', function() {
            $(".project-filter li").removeClass("current");
            $(this).addClass("current");
            const selector = $(this).data('filter');
            $('.project-masonry-active').isotope({
                filter: selector, itemSelector: '.item', masonry: { columnWidth: '.item' }
            });
        });

        // Testimonials carousel with Slick
        if ($('.testimonials-wrap').length) {
            $('.testimonials-wrap').slick({
                autoplay: true, autoplaySpeed: 2000, speed: 1000, arrows: true,
                prevArrow: '.testimonial-prev', nextArrow: '.testimonial-next',
                slidesToShow: 2, responsive: [{ breakpoint: 767, settings: { slidesToShow: 1 } }]
            });
        }

        // Fact Counter Animation
        $('.counter-text-wrap').appear(() => {
            const $t = $(this), n = $t.find(".count-text").data("stop");
            if (!$t.hasClass("counted")) {
                $t.addClass("counted");
                $({ countNum: $t.find(".count-text").text() }).animate({ countNum: n }, {
                    duration: $t.find(".count-text").data("speed"), step() {
                        $t.find(".count-text").text(Math.floor(this.countNum));
                    }
                });
            }
        });

        // Smooth Scroll to target
        $(".scroll-to-target").on('click', function() {
            const targetSelector = $(this).data('target');
            try {
                const targetElement = document.querySelector(targetSelector);
                if (targetElement) {
                    $('html, body').animate({ scrollTop: $(targetElement).offset().top }, 1000);
                }
            } catch (e) {
                console.error('Invalid selector:', e);
            }
        });

        // Initialize Nice Select
        $('select').niceSelect();

        // Initialize WOW animations
        if ($('.wow').length) {
            new WOW({ offset: 0, mobile: false }).init();
        }

    });

    // Hide dropdowns on window resize
    $window.on('resize', () => $('.navigation li.dropdown').children('ul, .megamenu').hide());

})(jQuery);
