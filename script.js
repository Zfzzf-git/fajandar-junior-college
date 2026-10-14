/**
 * FAJANDAR JUNIOR COLLEGE, VAHOOR - OFFICIAL JAVASCRIPT
 * Phase 3: JavaScript Interactive Functionality
 * Designed & Developed by Mukadam Zakariya © 2026
 *
 * All three academic streams: ARTS, COMMERCE, and SCIENCE are equally represented.
 * Plain vanilla JavaScript without external libraries or frameworks.
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // =========================================================================
    // 1. DYNAMIC ACTIVE NAVIGATION LINK DETECTION
    // =========================================================================
    function initActiveNavigation() {
        const navLinks = document.querySelectorAll('.main-navigation .nav-link');
        if (!navLinks.length) return;

        // Extract current page file name from URL (default to index.html)
        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '' || currentPage === '/') {
            currentPage = 'index.html';
        }

        navLinks.forEach(function (link) {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;

            // Strip any hash or parameters
            const cleanHref = linkHref.split('#')[0].split('?')[0];

            if (cleanHref === currentPage) {
                link.classList.add('active');
                const parentItem = link.closest('.nav-item');
                if (parentItem) {
                    parentItem.classList.add('current-page');
                }
            } else {
                // If not current, remove redundant classes if set
                link.classList.remove('active');
                const parentItem = link.closest('.nav-item');
                if (parentItem && !parentItem.classList.contains('has-submenu')) {
                    parentItem.classList.remove('current-page');
                }
            }
        });
    }

    // =========================================================================
    // 2. MOBILE NAVIGATION DRAWER & TOGGLE
    // =========================================================================
    function initMobileNavigation() {
        const header = document.querySelector('.site-header');
        const headerContainer = document.querySelector('.header-container');
        const nav = document.querySelector('.main-navigation');
        const navMenu = document.querySelector('.nav-menu');

        if (!header || !headerContainer || !nav || !navMenu) return;

        // Check if toggle button already exists, otherwise create it
        let toggleBtn = document.querySelector('.mobile-menu-toggle');
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-menu-toggle';
            toggleBtn.setAttribute('type', 'button');
            toggleBtn.setAttribute('aria-label', 'Toggle main menu navigation');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-controls', 'main-navigation');
            toggleBtn.innerHTML = '<span class="menu-icon-bars" aria-hidden="true"></span><span class="menu-text">Menu</span>';
            
            // Insert toggle button before navigation in header container
            headerContainer.insertBefore(toggleBtn, nav);
        }

        // Toggle mobile menu visibility
        function toggleMenu(forceClose) {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            const shouldOpen = forceClose === true ? false : !isExpanded;

            toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            nav.classList.toggle('is-open', shouldOpen);

            if (shouldOpen) {
                toggleBtn.classList.add('active');
            } else {
                toggleBtn.classList.remove('active');
            }
        }

        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking any nav link
        const allNavLinks = nav.querySelectorAll('a');
        allNavLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                toggleMenu(true);
            });
        });

        // Close menu when clicking outside of nav
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('is-open') && !header.contains(e.target)) {
                toggleMenu(true);
            }
        });

        // Close menu on Escape key for accessibility
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                toggleMenu(true);
                toggleBtn.focus();
            }
        });

        // Close menu on window resize above tablet breakpoint
        window.addEventListener('resize', function () {
            if (window.innerWidth > 1200 && nav.classList.contains('is-open')) {
                toggleMenu(true);
            }
        });
    }

    // =========================================================================
    // 3. SMOOTH INTERNAL ANCHOR NAVIGATION (WITH STICKY HEADER OFFSET)
    // =========================================================================
    function initSmoothInternalNavigation() {
        // Select internal anchor links starting with '#'
        const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href="#!"])');
        const header = document.querySelector('.site-header');

        internalLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jump
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }

                    // Set focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    }

    // =========================================================================
    // 4. BACK TO TOP BUTTON
    // =========================================================================
    function initBackToTop() {
        let backToTopBtn = document.getElementById('back-to-top');

        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'back-to-top';
            backToTopBtn.className = 'back-to-top-btn';
            backToTopBtn.setAttribute('type', 'button');
            backToTopBtn.setAttribute('aria-label', 'Return to top of page');
            backToTopBtn.setAttribute('title', 'Return to top of page');
            backToTopBtn.innerHTML = '&#8679; <span class="top-text">Top</span>';
            document.body.appendChild(backToTopBtn);
        }

        // Toggle visibility based on scroll position
        function checkScrollPosition() {
            if (window.pageYOffset > 320) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        }

        window.addEventListener('scroll', checkScrollPosition, { passive: true });
        checkScrollPosition();

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================================================
    // 5. ACCESSIBLE FAQ ACCORDION ENHANCEMENT (help.html)
    // =========================================================================
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(function (details) {
            const summary = details.querySelector('summary');
            if (!summary) return;

            // Accessibility attributes
            summary.setAttribute('role', 'button');
            summary.setAttribute('aria-expanded', details.hasAttribute('open') ? 'true' : 'false');

            details.addEventListener('toggle', function () {
                summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
            });
        });
    }

    // =========================================================================
    // 6. PHOTO GALLERY LIGHTBOX PREVIEW (gallery.html)
    // =========================================================================
    function initGalleryLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (!galleryItems.length) return;

        // Create Lightbox DOM structure if not present
        let lightbox = document.getElementById('gallery-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'gallery-lightbox';
            lightbox.className = 'gallery-lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-dialog">
                    <button type="button" class="lightbox-close" aria-label="Close photo preview">&times;</button>
                    <div class="lightbox-body">
                        <div class="lightbox-preview-box">
                            <span class="lightbox-tag-display"></span>
                        </div>
                        <p class="lightbox-caption-text"></p>
                    </div>
                </div>
            `;
            document.body.appendChild(lightbox);
        }

        const overlay = lightbox.querySelector('.lightbox-overlay');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const tagDisplay = lightbox.querySelector('.lightbox-tag-display');
        const captionText = lightbox.querySelector('.lightbox-caption-text');

        function openLightbox(item) {
            const placeholderTag = item.querySelector('.placeholder-tag');
            const caption = item.querySelector('.photo-caption');

            if (tagDisplay && placeholderTag) {
                tagDisplay.textContent = placeholderTag.textContent;
            }
            if (captionText && caption) {
                captionText.textContent = caption.textContent;
            }

            lightbox.classList.add('is-active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lightbox-locked');
            if (closeBtn) closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('is-active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-locked');
        }

        galleryItems.forEach(function (item) {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Open full photograph details');

            item.addEventListener('click', function () {
                openLightbox(item);
            });

            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(item);
                }
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (overlay) overlay.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
                closeLightbox();
            }
        });
    }

    // =========================================================================
    // 7. CLIENT-SIDE CONTACT FORM VALIDATION (contact.html)
    // =========================================================================
    function initContactFormValidation() {
        const form = document.getElementById('college-inquiry-form');
        if (!form) return;

        // Container for user feedback messages
        let feedbackContainer = document.getElementById('form-feedback-message');
        if (!feedbackContainer) {
            feedbackContainer = document.createElement('div');
            feedbackContainer.id = 'form-feedback-message';
            feedbackContainer.className = 'form-feedback-container';
            feedbackContainer.setAttribute('role', 'status');
            feedbackContainer.setAttribute('aria-live', 'polite');
            form.insertBefore(feedbackContainer, form.firstChild);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('applicant-name');
            const phoneInput = document.getElementById('applicant-phone');
            const emailInput = document.getElementById('applicant-email');
            const locationInput = document.getElementById('applicant-location');
            const streamInput = document.getElementById('inquiry-stream');
            const typeInput = document.getElementById('inquiry-type');
            const messageInput = document.getElementById('inquiry-message');

            const errors = [];

            // Name validation
            if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 3) {
                errors.push('Please enter a valid applicant or parent full name (at least 3 characters).');
            }

            // Phone validation (10 digits)
            const phoneVal = phoneInput ? phoneInput.value.trim().replace(/[\s-]/g, '') : '';
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneInput || !phoneRegex.test(phoneVal)) {
                errors.push('Please enter a valid 10-digit mobile contact number.');
            }

            // Email validation (optional but validated if provided)
            if (emailInput && emailInput.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    errors.push('Please enter a valid email address or leave the field blank.');
                }
            }

            // Location validation
            if (!locationInput || !locationInput.value.trim()) {
                errors.push('Please provide your residential town or village.');
            }

            // Stream selection
            if (!streamInput || !streamInput.value) {
                errors.push('Please select the academic stream of interest (Arts, Commerce, Science, or General).');
            }

            // Inquiry type
            if (!typeInput || !typeInput.value) {
                errors.push('Please select the nature of your inquiry.');
            }

            // Message validation
            if (!messageInput || !messageInput.value.trim() || messageInput.value.trim().length < 8) {
                errors.push('Please write your specific inquiry or question (at least 8 characters).');
            }

            // Display feedback
            if (errors.length > 0) {
                feedbackContainer.className = 'form-feedback-container error-state';
                feedbackContainer.innerHTML = `
                    <div class="feedback-box error">
                        <h4>Please complete the required fields:</h4>
                        <ul>
                            ${errors.map(err => `<li>${err}</li>`).join('')}
                        </ul>
                    </div>
                `;
                feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                // Successful front-end verification (strictly demo mode, no backend claimed)
                feedbackContainer.className = 'form-feedback-container success-state';
                feedbackContainer.innerHTML = `
                    <div class="feedback-box success">
                        <h4>Inquiry Verified (Demo Presentation)</h4>
                        <p>Thank you, <strong>${escapeHtml(nameInput.value.trim())}</strong>. Your inquiry details for <em>${escapeHtml(streamInput.options[streamInput.selectedIndex].text)}</em> have been validated successfully.</p>
                        <p><small><em>Notice: This form operates in client-side demonstration mode for the College Science Exhibition. No data is transmitted or permanently recorded.</em></small></p>
                    </div>
                `;
                form.reset();
                feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Helper to prevent HTML injection in feedback box
    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, function (tag) {
            const charsToReplace = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            };
            return charsToReplace[tag] || tag;
        });
    }

    // =========================================================================
    // 8. ACADEMIC STREAM INTERACTIVE TAB / JUMP FILTER (academics.html)
    // =========================================================================
    function initAcademicStreamFilter() {
        const jumpNav = document.getElementById('stream-jump-nav');
        if (!jumpNav) return;

        const jumpLinks = jumpNav.querySelectorAll('.stream-jump-list a');
        if (!jumpLinks.length) return;

        const streamSections = document.querySelectorAll('.stream-detail-section, .general-academics-section');

        jumpLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                jumpLinks.forEach(l => l.classList.remove('active-filter'));
                link.classList.add('active-filter');
            });
        });
    }

    // =========================================================================
    // 9. STAFF DIRECTORY FILTER (staff.html)
    // =========================================================================
    function initStaffFilter() {
        const staffJumpNav = document.getElementById('staff-jump-nav');
        if (!staffJumpNav) return;

        const jumpList = staffJumpNav.querySelector('.staff-jump-list');
        if (!jumpList) return;

        const staffBlocks = document.querySelectorAll('.stream-staff-block, .non-teaching-staff-section');
        if (!staffBlocks.length) return;

        // Check if "Show All Staff" button exists, otherwise prepend it
        let allBtn = jumpList.querySelector('.show-all-filter');
        if (!allBtn) {
            const allLi = document.createElement('li');
            allLi.innerHTML = '<a href="#all" class="show-all-filter active-filter">All Staff</a>';
            jumpList.insertBefore(allLi, jumpList.firstChild);
            allBtn = allLi.querySelector('a');
        }

        const filterLinks = jumpList.querySelectorAll('a');

        filterLinks.forEach(function (filterLink) {
            filterLink.addEventListener('click', function (e) {
                e.preventDefault();

                filterLinks.forEach(fl => fl.classList.remove('active-filter'));
                filterLink.classList.add('active-filter');

                const targetHref = filterLink.getAttribute('href');

                if (targetHref === '#all') {
                    staffBlocks.forEach(function (block) {
                        block.style.display = '';
                    });
                } else {
                    const targetId = targetHref.replace('#', '');
                    staffBlocks.forEach(function (block) {
                        if (block.id === targetId) {
                            block.style.display = '';
                        } else {
                            block.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // =========================================================================
    // 10. CINEMATIC SCROLL-LINKED 3D RIBBON CANVAS ANIMATION ENGINE
    //     Shared core engine used by both homepage and subpages.
    //     createRibbonEngine(canvas, getProgress) — reusable factory.
    // =========================================================================

    /**
     * Core ribbon animation engine factory.
     * @param {HTMLCanvasElement} canvas  - The canvas element to render on.
     * @param {Function}          getProgress - Returns a number in [0, 1] representing
     *                                         scroll progress appropriate for this page.
     */
    function createRibbonEngine(canvas, getProgress) {
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return null;

        const TOTAL_FRAMES = 300;
        const frames = new Array(TOTAL_FRAMES + 1);
        const loadedFrames = new Set();
        let targetFrame = 1;
        let currentFrame = 1;
        let lastRenderedIndex = -1;
        let isInitialRenderDone = false;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Path generator for 300 golden glass-ribbon campus animation frames
        function getFramePath(index) {
            const num = String(index).padStart(3, '0');
            return `300frames/ezgif-frame-${num}.png`;
        }

        // DPR-scaled canvas sizing with high-DPI support
        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const container = canvas.parentElement;
            const w = container ? container.offsetWidth : window.innerWidth;
            const h = container ? container.offsetHeight : window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            if (lastRenderedIndex > 0) {
                renderFrame(lastRenderedIndex);
            }
        }

        // Draw image with cover fill and responsive centering
        function drawFrame(img) {
            if (!img || !img.complete || img.naturalWidth === 0) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const canvasRatio = cw / ch;
            const imgRatio = iw / ih;
            let dw, dh, dx, dy;
            if (canvasRatio > imgRatio) {
                dw = cw;
                dh = cw / imgRatio;
                dx = 0;
                dy = (ch - dh) / 2;
            } else {
                dh = ch;
                dw = ch * imgRatio;
                dx = (cw - dw) / 2;
                dy = 0;
            }
            ctx.drawImage(img, dx, dy, dw, dh);
        }

        // Find nearest loaded frame to eliminate black frames or flicker
        function findNearestLoadedFrame(index) {
            if (loadedFrames.has(index)) return frames[index];
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
                if (index - offset >= 1 && loadedFrames.has(index - offset)) return frames[index - offset];
                if (index + offset <= TOTAL_FRAMES && loadedFrames.has(index + offset)) return frames[index + offset];
            }
            return null;
        }

        function renderFrame(index) {
            const img = frames[index];
            if (img && loadedFrames.has(index)) {
                drawFrame(img);
            } else {
                const fallback = findNearestLoadedFrame(index);
                if (fallback) drawFrame(fallback);
                loadSpecificFrame(index);
            }
        }

        // Frame loader with automatic error recovery and caching
        function loadSpecificFrame(index) {
            if (frames[index]) return;
            const img = new Image();
            frames[index] = img;
            img.onload = function () {
                loadedFrames.add(index);
                if (!isInitialRenderDone && index === 1) {
                    isInitialRenderDone = true;
                    drawFrame(img);
                } else if (Math.round(currentFrame) === index) {
                    drawFrame(img);
                }
            };
            img.onerror = function () {
                // Both primary and fallback use the same path; gracefully warn
                console.warn(`[Ribbon Engine] Frame ${index} could not be loaded.`);
            };
            img.src = getFramePath(index);
        }

        // Update scroll progress via the provided strategy function
        function updateScrollProgress() {
            const progress = getProgress();
            targetFrame = 1 + Math.min(1, Math.max(0, progress)) * (TOTAL_FRAMES - 1);
        }

        // Multi-stage intelligent progressive preloader
        function startProgressivePreloader() {
            loadSpecificFrame(1);
            setTimeout(function () {
                for (let i = 2; i <= 35; i++) loadSpecificFrame(i);
            }, 20);
            setTimeout(function () {
                for (let i = 40; i <= TOTAL_FRAMES; i += 10) loadSpecificFrame(i);
            }, 100);
            setTimeout(function () {
                let start = 1;
                function loadNextBatch() {
                    const end = Math.min(TOTAL_FRAMES, start + 15);
                    for (let i = start; i <= end; i++) loadSpecificFrame(i);
                    start = end + 1;
                    if (start <= TOTAL_FRAMES) setTimeout(loadNextBatch, 30);
                }
                loadNextBatch();
            }, 250);
        }

        // Boot
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
        updateScrollProgress();
        currentFrame = targetFrame;
        startProgressivePreloader();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });

        if (prefersReducedMotion) {
            renderFrame(1);
            return { destroy: function () {} };
        }

        // Smooth RAF lerping loop
        let rafId;
        function animationLoop() {
            const diff = targetFrame - currentFrame;
            if (Math.abs(diff) > 0.001) {
                currentFrame += diff * 0.14;
            } else {
                currentFrame = targetFrame;
            }
            const frameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(currentFrame)));
            if (frameIndex !== lastRenderedIndex) {
                renderFrame(frameIndex);
                lastRenderedIndex = frameIndex;
            }
            rafId = requestAnimationFrame(animationLoop);
        }
        rafId = requestAnimationFrame(animationLoop);

        return {
            destroy: function () {
                cancelAnimationFrame(rafId);
            }
        };
    }

    // ---- Homepage fixed-background mode (index.html) ----
    function initScrollLinkedRibbonAnimation() {
        const canvas = document.getElementById('ribbon-canvas');
        if (!canvas) return;

        // Scroll progress = fraction of total page scroll
        function getHomepageProgress() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            return scrollY / maxScroll;
        }

        createRibbonEngine(canvas, getHomepageProgress);
    }

    // ---- Subpage scroll-section mode (all other pages) ----
    function initCinematicSectionAnimation() {
        const section = document.querySelector('.cinematic-scroll-section');
        if (!section) return;

        const canvas = section.querySelector('.cinematic-canvas');
        if (!canvas) return;

        // Scroll progress = fraction of cinematic section traversed
        // When section top reaches viewport top, progress = 0.
        // When section bottom reaches viewport bottom, progress = 1.
        function getSectionProgress() {
            const rect = section.getBoundingClientRect();
            const sectionH = section.offsetHeight;
            const viewportH = window.innerHeight;
            // scrolled distance into the section = -(rect.top)
            // total scrollable distance of section = sectionH - viewportH
            const scrollable = Math.max(1, sectionH - viewportH);
            const scrolled = Math.max(0, -rect.top);
            return Math.min(1, scrolled / scrollable);
        }

        createRibbonEngine(canvas, getSectionProgress);
    }

    // =========================================================================
    // 11. SEARCH MODAL FUNCTIONALITY
    // =========================================================================
    function initSearchModal() {
        const searchBtn = document.getElementById('header-search-btn');
        const modal = document.getElementById('search-modal');
        const closeBtn = document.getElementById('search-close-btn');
        const searchInput = document.getElementById('search-input-box');
        const resultsList = document.getElementById('search-results-list');

        if (!modal) return;

        function openModal() {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }

        function closeModal() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        if (searchInput && resultsList) {
            const items = resultsList.querySelectorAll('.search-result-item');
            searchInput.addEventListener('input', function () {
                const query = this.value.toLowerCase().trim();
                items.forEach(function (item) {
                    const text = item.textContent.toLowerCase();
                    if (query === '' || text.includes(query)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }

    // =========================================================================
    // INITIALIZATION RUNNER
    // =========================================================================
    initActiveNavigation();
    initMobileNavigation();
    initSmoothInternalNavigation();
    initBackToTop();
    initFaqAccordion();
    initGalleryLightbox();
    initContactFormValidation();
    initAcademicStreamFilter();
    initStaffFilter();
    initSearchModal();
    initScrollLinkedRibbonAnimation();   // homepage fixed-canvas
    initCinematicSectionAnimation();      // subpage scroll-section canvas

});
