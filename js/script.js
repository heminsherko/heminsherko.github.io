/**
 * ==============================================================================
 * Hemin Sherko - Systems Architect | Portfolio Application Scripts
 * Robust Production Version with Strict Null-Checks & Error Handling
 * ==============================================================================
 */

// Firebase Modular Web SDK v10 CDN Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase Configuration (Matching admin credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDZjxwqKKddb2L2XLR7obZmjlXDYbl6p48",
  authDomain: "hemin-portfolio.firebaseapp.com",
  projectId: "hemin-portfolio",
  storageBucket: "hemin-portfolio.firebasestorage.app",
  messagingSenderId: "52349564982",
  appId: "1:52349564982:web:c09fbe8747b8422572c097"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization skipped or failed:", e);
}

/**
 * Fetch and update dynamic content (heroTitle, aboutText) from Firestore (siteData/general).
 * Wrapped in try/catch to ensure resilient fallback if offline or delayed.
 */
async function loadDynamicContent() {
  try {
    if (!db) return;
    const docRef = doc(db, "siteData", "general");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const heroTitleElem = document.getElementById('hero-title');
      const aboutTextElem = document.getElementById('about-text');

      if (heroTitleElem && data.heroTitle) {
        heroTitleElem.textContent = data.heroTitle;
      }
      if (aboutTextElem && data.aboutText) {
        aboutTextElem.textContent = data.aboutText;
      }
    }
  } catch (error) {
    console.warn("Could not load dynamic Firestore content, using static fallback:", error);
  }
}

function initializePortfolio() {
  'use strict';

  // Asynchronously fetch and render dynamic Firestore content
  loadDynamicContent();

  // ============================================================================
  // 1. DOM ELEMENT SELECTIONS (GROUPED & NULL-SAFE)
  // ============================================================================

  // Header & Navigation
  const header = document.getElementById('header');
  const hamburger = document.querySelector('.hamburger') || document.getElementById('hamburger') || document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinksContainer = document.querySelector('.nav-links') || navMenu;
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Theme Controls
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Language Switcher Controls
  const langSwitcher = document.getElementById('lang-switcher');
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const currentLangText = document.getElementById('current-lang-text');
  const langOptions = document.querySelectorAll('.lang-option');

  // Scroll & Progress Indicators
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('backToTop') || document.getElementById('back-to-top');
  const customCursor = document.querySelector('.custom-cursor') || document.getElementById('custom-cursor');

  // About & Skills Section
  const aboutSection = document.getElementById('about');
  const progressFills = document.querySelectorAll('.progress-fill');

  // Portfolio Section & Modals
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const projectModal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const closeModalBtn = projectModal ? projectModal.querySelector('.close-modal') : null;

  // Hero Typewriter Element
  const typewriterTextElem = document.querySelector('.typewriter-text');

  // Footer & Misc
  const currentYearSpan = document.getElementById('current-year');

  // Media query detections for mobile and fine pointer safety
  const isFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // ============================================================================
  // 2. FOOTER COPYRIGHT YEAR
  // ============================================================================
  if (currentYearSpan) {
    try {
      currentYearSpan.textContent = new Date().getFullYear();
    } catch (err) {
      console.warn('Failed to set current year:', err);
    }
  }

  // ============================================================================
  // 3. THEME SYSTEM (DARK / LIGHT MODE)
  // ============================================================================
  const THEME_STORAGE_KEY = 'hemin_corp_portfolio_theme';

  /**
   * Retrieves user's saved theme safely from localStorage.
   * @returns {string} 'light' or 'dark'
   */
  const getPreferredTheme = () => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      console.warn('localStorage is not accessible for theme reading:', e);
    }
    return 'light';
  };

  /**
   * Applies the theme attribute to the HTML root and persists it safely.
   * @param {string} theme - 'light' or 'dark'
   */
  const applyTheme = (theme) => {
    if (!document.documentElement) return;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('localStorage is not accessible for theme writing:', e);
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement && document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // ============================================================================
  // 4. MULTI-LANGUAGE SWITCHER (GOOGLE TRANSLATE & RTL/LTR TOGGLE)
  // ============================================================================
  const LANG_STORAGE_KEY = 'hemin_portfolio_language';

  const langNames = {
    ku: 'کوردی',
    en: 'English',
    ar: 'العربية'
  };

  /**
   * Sets Google Translate cookies safely.
   * @param {string} langCode - Language code ('ku', 'en', 'ar')
   */
  const setGoogleTranslateCookie = (langCode) => {
    try {
      if (langCode === 'ku') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (window.location && window.location.hostname) {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        }
      } else {
        const cookieValue = `/ku/${langCode}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`;
        if (window.location && window.location.hostname) {
          document.cookie = `googtrans=${cookieValue}; domain=.${window.location.hostname}; path=/;`;
          document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/;`;
        }
      }
    } catch (e) {
      console.warn('Cookie access error:', e);
    }
  };

  /**
   * Triggers Google Translate dropdown with retry attempts.
   * @param {string} langCode - Target language code
   */
  const triggerGoogleTranslate = (langCode) => {
    setGoogleTranslateCookie(langCode);

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      try {
        const selectElem = document.querySelector('.goog-te-combo');
        if (selectElem) {
          let valueToSet = langCode;
          if (langCode === 'ku') {
            const options = Array.from(selectElem.options);
            const hasKu = options.some(opt => opt.value === 'ku');
            const hasCkb = options.some(opt => opt.value === 'ckb');
            if (hasKu) {
              valueToSet = 'ku';
            } else if (hasCkb) {
              valueToSet = 'ckb';
            } else {
              valueToSet = '';
            }
          }
          selectElem.value = valueToSet;
          selectElem.dispatchEvent(new Event('change'));
          clearInterval(interval);
        }
      } catch (err) {
        console.warn('Google Translate change dispatch failed:', err);
      }
      if (attempts >= 30) {
        clearInterval(interval);
      }
    }, 150);
  };

  /**
   * Applies the chosen language direction, attributes, and UI labels.
   * @param {string} langCode - Language code ('ku', 'en', 'ar')
   * @param {boolean} shouldTriggerGT - Whether to trigger Google Translate
   */
  const applyLanguage = (langCode, shouldTriggerGT = true) => {
    let normalizedLang = langCode;
    if (normalizedLang !== 'en' && normalizedLang !== 'ar') {
      normalizedLang = 'ku';
    }

    if (document.documentElement) {
      if (normalizedLang === 'en') {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', normalizedLang === 'ar' ? 'ar' : 'ku');
      }
    }

    if (currentLangText) {
      currentLangText.textContent = langNames[normalizedLang] || 'کوردی';
    }

    if (langOptions && langOptions.length > 0) {
      langOptions.forEach(opt => {
        if (!opt) return;
        const optLang = opt.getAttribute('data-lang');
        if (optLang === normalizedLang) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }

    try {
      localStorage.setItem(LANG_STORAGE_KEY, normalizedLang);
    } catch (e) {
      console.warn('localStorage is not accessible for language saving:', e);
    }

    if (shouldTriggerGT) {
      triggerGoogleTranslate(normalizedLang);
    }
  };

  // Safe initial language resolution
  const getInitialLanguage = () => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && (saved === 'ku' || saved === 'en' || saved === 'ar')) {
        return saved;
      }
    } catch (e) {
      // Ignore localStorage error
    }

    try {
      const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
      if (match && match[1]) {
        const parts = match[1].split('/');
        const langInCookie = parts[parts.length - 1];
        if (langInCookie === 'en' || langInCookie === 'ar') {
          return langInCookie;
        }
      }
    } catch (e) {
      // Ignore cookie error
    }

    return 'ku';
  };

  applyLanguage(getInitialLanguage(), false);

  // Toggle language dropdown
  if (langToggleBtn && langSwitcher) {
    langToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSwitcher.classList.toggle('open');
      langToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!langSwitcher.contains(e.target)) {
        langSwitcher.classList.remove('open');
        langToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Language option selection handlers
  if (langOptions && langOptions.length > 0) {
    langOptions.forEach(optionBtn => {
      if (!optionBtn) return;
      optionBtn.addEventListener('click', () => {
        const chosenLang = optionBtn.getAttribute('data-lang');
        applyLanguage(chosenLang, true);
        if (langSwitcher) {
          langSwitcher.classList.remove('open');
        }
        if (langToggleBtn) {
          langToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ============================================================================
  // 5. SKILLS PROGRESS BARS (INTERSECTION OBSERVER)
  // ============================================================================
  if (progressFills && progressFills.length > 0) {
    if ('IntersectionObserver' in window && aboutSection) {
      try {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              progressFills.forEach(bar => {
                if (!bar) return;
                const target = bar.getAttribute('data-progress');
                if (target) {
                  bar.style.width = target;
                }
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.25 });

        skillsObserver.observe(aboutSection);
      } catch (err) {
        console.warn('Skills observer failed:', err);
        progressFills.forEach(bar => {
          if (bar) bar.style.width = bar.getAttribute('data-progress') || '85%';
        });
      }
    } else {
      progressFills.forEach(bar => {
        if (bar) bar.style.width = bar.getAttribute('data-progress') || '85%';
      });
    }
  }

  // ============================================================================
  // 6. SCROLL PROGRESS BAR (TOP OF VIEWPORT)
  // ============================================================================
  if (scrollProgressBar) {
    const updateScrollProgress = () => {
      try {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight || 0) - (document.documentElement.clientHeight || window.innerHeight || 0);
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
      } catch (err) {
        console.warn('Scroll progress calculation error:', err);
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  // ============================================================================
  // 7. HEADER SCROLL & BACK TO TOP BUTTON
  // ============================================================================
  const handleScroll = () => {
    const scrollY = window.pageYOffset || window.scrollY || 0;

    // Header sticky shadow
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('show');
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.classList.remove('show');
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      try {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    });

    // Custom Cursor interaction (only for fine-pointer mouse devices)
    if (isFinePointer && customCursor) {
      backToTopBtn.addEventListener('mouseenter', () => {
        customCursor.classList.add('cursor-hover', 'active', 'hover');
      });
      backToTopBtn.addEventListener('mouseleave', () => {
        customCursor.classList.remove('cursor-hover', 'active', 'hover');
      });
    }
  }

  // Safe custom cursor tracking for fine pointer devices
  if (isFinePointer && customCursor) {
    document.addEventListener('mousemove', (e) => {
      try {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
      } catch (err) {
        // Ignore cursor position errors
      }
    });
  }

  // ============================================================================
  // 8. MOBILE NAVIGATION (HAMBURGER MENU)
  // ============================================================================
  const toggleMobileMenu = () => {
    if (hamburger && navLinksContainer) {
      const isActive = navLinksContainer.classList.toggle('active');
      navLinksContainer.classList.toggle('open', isActive);
      hamburger.classList.toggle('toggle', isActive);
      hamburger.classList.toggle('open', isActive);
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
  };

  const closeMobileMenu = () => {
    if (hamburger && navLinksContainer) {
      navLinksContainer.classList.remove('active');
      navLinksContainer.classList.remove('open');
      hamburger.classList.remove('toggle');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (navLinks && navLinks.length > 0) {
    navLinks.forEach(link => {
      if (!link) return;
      link.addEventListener('click', closeMobileMenu);
    });
  }

  document.addEventListener('click', (e) => {
    if (navLinksContainer && (navLinksContainer.classList.contains('active') || navLinksContainer.classList.contains('open'))) {
      if (header && !header.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // ============================================================================
  // 9. SCROLLSPY (ACTIVE NAV LINK ON SCROLL)
  // ============================================================================
  if (sections && sections.length > 0 && navLinks && navLinks.length > 0) {
    const updateActiveNavLink = () => {
      const scrollPos = (window.pageYOffset || window.scrollY || 0) + 140;

      sections.forEach(section => {
        if (!section) return;
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            if (!link) return;
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  }

  // ============================================================================
  // 10. PORTFOLIO FILTERING
  // ============================================================================
  if (filterButtons && filterButtons.length > 0 && portfolioCards && portfolioCards.length > 0) {
    filterButtons.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          if (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          }
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
          if (!card) return;
          const cat = card.getAttribute('data-category');
          const match = filter === 'all' || cat === filter;

          if (match) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });

        // Safe AOS refresh
        try {
          if (typeof AOS !== 'undefined' && AOS.refresh) {
            setTimeout(() => {
              AOS.refresh();
            }, 220);
          }
        } catch (error) {
          console.warn('AOS library refresh failed:', error);
        }

        // Safe VanillaTilt re-initialization (Desktop only)
        try {
          if (!isMobile && typeof VanillaTilt !== 'undefined' && VanillaTilt.init) {
            setTimeout(() => {
              const cardsToTilt = document.querySelectorAll(".service-card, .portfolio-card");
              if (cardsToTilt && cardsToTilt.length > 0) {
                VanillaTilt.init(cardsToTilt, {
                  max: 15,
                  speed: 400,
                  glare: true,
                  "max-glare": 0.2,
                  scale: 1.05
                });
              }
            }, 220);
          }
        } catch (error) {
          console.warn('VanillaTilt library re-initialization failed:', error);
        }
      });
    });
  }

  // ============================================================================
  // 11. HERO TYPEWRITER EFFECT
  // ============================================================================
  if (typewriterTextElem) {
    const initTypewriter = () => {
      const textArray = [
        "نەخشەسازی سیستەم",
        "بەڕێوەبردنی سێرڤەر",
        "پاراستنی داتا",
        "دروستکردنی وێبسایت"
      ];

      let arrayIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const typeSpeed = 100;
      const deleteSpeed = 50;
      const holdDelay = 2000;
      const nextWordDelay = 500;

      const type = () => {
        if (!typewriterTextElem) return;
        const currentString = textArray[arrayIndex];
        if (!currentString) return;

        if (isDeleting) {
          charIndex--;
          typewriterTextElem.textContent = currentString.substring(0, charIndex);
        } else {
          charIndex++;
          typewriterTextElem.textContent = currentString.substring(0, charIndex);
        }

        let timeoutDuration = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentString.length) {
          timeoutDuration = holdDelay;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          arrayIndex = (arrayIndex + 1) % textArray.length;
          timeoutDuration = nextWordDelay;
        }

        setTimeout(type, timeoutDuration);
      };

      setTimeout(type, 400);
    };

    initTypewriter();
  }

  // ============================================================================
  // 12. PROJECT MODAL / LIGHTBOX
  // ============================================================================
  if (projectModal && modalImg && modalTitle && modalDesc) {
    let lastFocusedElement = null;

    const openModal = (card) => {
      if (!card) return;
      lastFocusedElement = document.activeElement;
      const img = card.querySelector('img');
      const title = card.querySelector('.portfolio-title');
      const desc = card.querySelector('.portfolio-desc');

      if (img && modalImg) {
        modalImg.src = img.src || '';
        modalImg.alt = img.alt || 'Project Preview';
      }
      if (title && modalTitle) {
        modalTitle.textContent = title.textContent.trim();
      }
      if (desc && modalDesc) {
        modalDesc.textContent = desc.textContent.trim();
      }

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (closeModalBtn) {
        closeModalBtn.focus();
      }
    };

    const closeModal = () => {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    };

    if (portfolioCards && portfolioCards.length > 0) {
      portfolioCards.forEach(card => {
        if (!card) return;
        card.addEventListener('click', () => {
          openModal(card);
        });
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ============================================================================
  // 13. SECURE CONTACT / BOT-SCRAPING PROTECTION
  // ============================================================================
  const secureContacts = document.querySelectorAll('.secure-contact');
  secureContacts.forEach(contact => {
    contact.addEventListener('click', (e) => {
      e.preventDefault();
      const type = contact.getAttribute('data-type');
      const part1 = contact.getAttribute('data-part1') || '';
      const part2 = contact.getAttribute('data-part2') || '';

      if (type === 'email') {
        window.location.href = `mailto:${part1}@${part2}`;
      } else if (type === 'whatsapp') {
        window.open(`https://wa.me/${part1}${part2}`, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // ============================================================================
  // 14. THIRD-PARTY LIBRARIES (SAFELY INITIALIZED WITH TRY-CATCH)
  // ============================================================================

  // AOS (Animate On Scroll)
  try {
    if (typeof AOS !== 'undefined' && AOS.init) {
      AOS.init({ duration: 800, once: true, offset: 100, easing: 'ease-in-out' });
    }
  } catch (error) {
    console.warn('AOS library failed to load or initialize:', error);
  }

  // VanillaTilt 3D Effect (Desktop only)
  try {
    if (!isMobile && typeof VanillaTilt !== 'undefined' && VanillaTilt.init) {
      const cards = document.querySelectorAll(".service-card, .portfolio-card");
      if (cards && cards.length > 0) {
        VanillaTilt.init(cards, {
          max: 15,
          speed: 400,
          glare: true,
          "max-glare": 0.2,
          scale: 1.05
        });
      }
    }
  } catch (error) {
    console.warn('VanillaTilt library failed to load or initialize:', error);
  }

  // Particles.js Interactive Network (Desktop only)
  try {
    if (!isMobile && typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
      particlesJS("particles-js", {
        "particles": {
          "number": { "value": 70 },
          "color": { "value": "#253ca7" },
          "shape": { "type": "circle" },
          "opacity": { "value": 0.4 },
          "size": { "value": 3 },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#253ca7",
            "opacity": 0.3,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            }
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 0.8
              }
            }
          }
        },
        "retina_detect": true
      });
    }
  } catch (error) {
    console.warn('Particles.js library failed to load or initialize:', error);
  }

  // Swiper Safeguard (if dynamically loaded)
  try {
    if (typeof Swiper !== 'undefined' && document.querySelector('.swiper')) {
      // Swiper initialization placeholder if added
    }
  } catch (error) {
    console.warn('Swiper library failed to load or initialize:', error);
  }
}

// Execute portfolio initialization safely across document lifecycle states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}

// ==============================================================================
// 15. GLOBAL GOOGLE TRANSLATE CALLBACK (SAFEGUARDED)
// ==============================================================================
window.googleTranslateElementInit = function() {
  try {
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'ku',
        includedLanguages: 'ku,en,ar,ckb',
        autoDisplay: false
      }, 'google_translate_element');
    }
  } catch (error) {
    console.warn('Google Translate failed to load or initialize:', error);
  }
};
