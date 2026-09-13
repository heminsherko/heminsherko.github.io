/**
 * ==============================================================================
 * Hemin Sherko - Admin CMS Controller (Kurdish RTL)
 * Complete Content Management System powered by Firebase v10 Modular Web SDK
 * ==============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZjxwqKKddb2L2XLR7obZmjlXDYbl6p48",
  authDomain: "hemin-portfolio.firebaseapp.com",
  projectId: "hemin-portfolio",
  storageBucket: "hemin-portfolio.firebasestorage.app",
  messagingSenderId: "52349564982",
  appId: "1:52349564982:web:c09fbe8747b8422572c097"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore General Document Reference
const generalDocRef = doc(db, "siteData", "general");

// DOM Caches
const authLoading = document.getElementById('auth-loading');
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');

const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');

const saveAllBtn = document.getElementById('save-all-btn');
const saveBottomBtn = document.getElementById('save-bottom-btn');
const saveStatus = document.getElementById('save-status');
const syncStatus = document.getElementById('sync-status');
const saveBarIndicatorText = document.getElementById('save-bar-indicator-text');

const sidebarTabs = document.querySelectorAll('.sidebar-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

// Default Content Fallbacks (Sensible Kurdish defaults matching current portfolio)
const defaultSiteData = {
  hero: {
    greeting: "سڵاو، من ناوم",
    name: "هێمن شێرکۆ",
    title: "ئەندازیاری سیستەم",
    description: "پەرەپێدەر و تەلارسازی سیستەمی دیجیتاڵی پێشکەوتوو. یارمەتی کۆمپانیا و براندە بازرگانییەکان دەدەم لە نەخشەسازی ژێرخانی کلاود، پلاتفۆرمی خێرا و پاراستنی سەقامگیری داتابەیس.",
    badge1: "ساڵانێک ئەزموونی پرۆفیشناڵ",
    badge2: "وردەکاری لە ناوەڕۆک و ڕووکاردا",
    image: "./assets/images/my-photo1.png"
  },
  about: {
    leadTitle: "ئەزموونێکی دەوڵەمەند لە بونیاتنانی چارەسەری تەکنیکی بەهێز",
    bio: "من ئەندازیاری سیستەمم و خاوەنی ئەزموونی چەندین ساڵەم لە دیزاینکردنی تەلارسازیی پڕۆگرامینگ، بەڕێوەبردنی سێرڤەر و بەستنەوەی مایکڕۆسێرڤسەکان. سەرنجم لەسەر کەمکردنەوەی خەرجییەکان، خێراترکردنی وەڵامدانەوەی سیستەم و گەیاندنی بەرزترین ئاستی سیکیوریتییە.",
    image: "./assets/images/my-photo2.png"
  },
  skills: [
    { name: "نەخشەسازی و تەلارسازیی سیستەم", percentage: 95 },
    { name: "بەڕێوەبردنی ژێرخانی کلاود و سێرڤەر", percentage: 92 },
    { name: "پەرەپێدانی خزمەتگوزارییەکان و API", percentage: 90 },
    { name: "پاراستنی داتا و سیکیوریتی تۆڕ", percentage: 88 }
  ],
  services: [
    {
      title: "دروستکردنی وێبسایت و سیستەم",
      desc: "دیزاین و پرۆگرامکردنی ماڵپەڕ و وێب ئەپڵیکەیشنی تایبەت بە کوالێتی بەرز، خێرایی بێوێنە و ئەزموونی بەکارهێنەری مۆدێرن.",
      icon: "monitor",
      imageUrl: "./assets/images/service1.svg",
      image: "./assets/images/service1.svg"
    },
    {
      title: "تەلارسازیی کلاود و مایکڕۆسێرڤس",
      desc: "نەخشەسازی سیستەمی کلاود کە توانای هەڵگرتنی بارگرانی و ملیۆنان داواکاری هەبێت بە کەمترین خەرجی مانگانە.",
      icon: "cloud",
      imageUrl: "./assets/images/service2.svg",
      image: "./assets/images/service2.svg"
    },
    {
      title: "سیکیوریتی و پاراستنی داتا",
      desc: "پشکنین و دابینکردنی سەلامەتی سێرڤەر و بەرگرتن لە هێرشە ئەلیکترۆنییەکان لەگەڵ پاراستنی نهێنی داتای بەکارهێنەران.",
      icon: "shield",
      imageUrl: "./assets/images/service3.svg",
      image: "./assets/images/service3.svg"
    },
    {
      title: "چاودێری و باشترکردنی سێرڤەر",
      desc: "بەردەوام چاودێریکردنی کاتی کارکردنی سیستەم و بەرزکردنەوەی خێرایی بە بەکارهێنانی سیستەمی کشکردن و دابەشکردنی لۆد.",
      icon: "activity",
      imageUrl: "./assets/images/service4.svg",
      image: "./assets/images/service4.svg"
    }
  ],
  portfolio: [
    {
      title: "پلاتفۆرمی شیکاری سێرڤەر",
      category: "کلاود",
      imageUrl: "./assets/images/project1.svg",
      image: "./assets/images/project1.svg",
      desc: "سیستەمی چاودێری ڕاستەوخۆی سەرچاوەکان بە پشکنینی ساتەوەخت و بەرهەمهێنانی ڕاپۆرت."
    },
    {
      title: "پۆرتاڵی دەزگای دارایی",
      category: "وێبسایت",
      imageUrl: "./assets/images/project2.svg",
      image: "./assets/images/project2.svg",
      desc: "وێبسایتی پارێزراوی بانکداری ئەلیکترۆنی بە بەکارهێنانی تەکنەلۆجیای نوێ و ستانداردی ئاسایش."
    },
    {
      title: "سیستەمی بەڕێوەبردنی کۆگا",
      category: "ئەپڵیکەیشن",
      imageUrl: "./assets/images/project3.svg",
      image: "./assets/images/project3.svg",
      desc: "ئەپی سەر وێب بۆ چاودێریکردنی کەلوپەل و فرۆش بە بەستنەوەی چەندین لقی کۆمپانیا."
    },
    {
      title: "دەروازەی خێرای API",
      category: "کلاود",
      imageUrl: "./assets/images/project4.svg",
      image: "./assets/images/project4.svg",
      desc: "تەلارسازی بەڕێوەبردنی داواکارییە گەورەکان و دابەشکردنی لۆد لەنێوان سێرڤەرەکاندا."
    },
    {
      title: "ماڵپەڕی بازرگانی فرۆشتن",
      category: "وێبسایت",
      imageUrl: "./assets/images/project5.svg",
      image: "./assets/images/project5.svg",
      desc: "پلاتفۆرمی بازرگانی تەواو بەستراوە بە سیستەمی پارەدانی ئەلیکترۆنی و کارتەکانی کڕین."
    },
    {
      title: "داشبۆردی داتا و ئامار",
      category: "ئەپڵیکەیشن",
      imageUrl: "./assets/images/project6.svg",
      image: "./assets/images/project6.svg",
      desc: "ڕووکاری کارگێڕی بۆ شیکاریکردنی ڕەفتاری بەکارهێنەران و هەڵسەنگاندنی گەشەی پڕۆژە."
    }
  ],
  testimonials: [
    {
      quote: "هێمن یەکێکە لە لێهاتووترین ئەندازیارانی سیستەم کە کارم لەگەڵ کردبێت، ژێرخانی کۆمپانیاکەمانی لە ڕووی خێرایی و سیکیوریتییەوە بە تەواوی گۆڕی.",
      author: "کارزان ڕەحیم",
      role: "بەڕێوەبەری تەکنیکی (CTO)"
    },
    {
      quote: "شارەزایی لە کلاود و دابەشکردنی لۆد بێ وێنەیە، پڕۆژەکانی هەمیشە لە کاتی خۆیدا و بە بەرزترین کوالێتی پێشکەش دەکات.",
      author: "سۆران مەحموود",
      role: "بەڕێوەبەری پڕۆژە (Project Manager)"
    },
    {
      quote: "چارەسەرەکانی بۆ ژێرخانی کلاود خەرجیی سێرڤەرەکانی ئێمەی بە ڕێژەی ٤٠٪ کەمکردەوە و سەقامگیری تەواوی بە پلاتفۆرمەکەمان بەخشی.",
      author: "دکتۆر ئاراس کەریم",
      role: "دامەزرێنەر و بەڕێوەبەر (CEO)"
    }
  ],
  contact: {
    phone: "+964 773 2640262",
    email: "Hemin.Sherko@gmail.com",
    address: "قەزای کەلار - پارێزگای سلێمانی - هەرێمی کوردستان",
    copyright: "هەموو مافەکان پارێزراون",
    social: {
      github: "https://github.com/heminsherko",
      instagram: "https://instagram.com/heminsherko",
      facebook: "https://facebook.com/hemin.sherko1",
      linkedin: "https://www.linkedin.com/in/heminsherko1998/",
      telegram: "https://t.me/heminsherko"
    }
  },
  social: {
    github: "https://github.com/heminsherko",
    instagram: "https://instagram.com/heminsherko",
    facebook: "https://facebook.com/hemin.sherko1",
    linkedin: "https://www.linkedin.com/in/heminsherko1998/",
    telegram: "https://t.me/heminsherko"
  },
  visibility: {
    hero: true,
    about: true,
    services: true,
    portfolio: true,
    testimonials: true,
    contact: true
  }
};

// ==============================================================================
// SECTION VISIBILITY TOGGLES CONTROLLER
// ==============================================================================
const SECTION_KEYS = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'];

/**
 * Updates status label text and visual class for a section toggle
 */
function updateToggleStatusUI(secName, isChecked) {
  const statusEls = [
    document.getElementById(`status-${secName}`),
    document.getElementById(`status-overview-${secName}`)
  ];
  const activeLabel = "چالاکە (پیشاندراوە)";
  const hiddenLabel = "کوژاوەتەوە (شاراوە)";

  statusEls.forEach(el => {
    if (!el) return;
    el.textContent = isChecked ? activeLabel : hiddenLabel;
    if (isChecked) {
      el.classList.remove('status-hidden');
    } else {
      el.classList.add('status-hidden');
    }
  });
}

/**
 * Sets checked state on both overview and in-section checkboxes and updates UI
 */
function setSectionVisibility(secName, isChecked) {
  const toggleSection = document.getElementById(`toggle-${secName}`);
  const toggleOverview = document.getElementById(`toggle-overview-${secName}`);

  if (toggleSection) toggleSection.checked = isChecked;
  if (toggleOverview) toggleOverview.checked = isChecked;

  updateToggleStatusUI(secName, isChecked);
}

/**
 * Attaches change listeners to synchronize overview toggles with in-section toggles
 */
function initToggleListeners() {
  SECTION_KEYS.forEach(secName => {
    const toggleSection = document.getElementById(`toggle-${secName}`);
    const toggleOverview = document.getElementById(`toggle-overview-${secName}`);

    if (toggleSection) {
      toggleSection.addEventListener('change', (e) => {
        setSectionVisibility(secName, e.target.checked);
      });
    }

    if (toggleOverview) {
      toggleOverview.addEventListener('change', (e) => {
        setSectionVisibility(secName, e.target.checked);
      });
    }
  });
}

// Initialize toggle listeners on load
initToggleListeners();

// ==============================================================================
// CLIENT-SIDE IMAGE COMPRESSOR & DIRECT FIRESTORE STORAGE
// ==============================================================================

/**
 * Compresses an image client-side using an HTML5 Canvas to WebP format.
 * Max dimension: 1000px, quality: 0.75.
 * Shrinks 5MB-10MB mobile camera photos down to 40KB-80KB WebP Data URL.
 * 100% Free - no Firebase Storage or Blaze billing required!
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>} Base64 Data URL string
 */
function compressImageToWebP(file, maxWidth = 800, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error("تکایە فایلی وێنە هەڵبژێرە."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("هەڵە لە خوێندنەوەی فایل."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("هەڵە لە بارکردنی وێنە."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize dynamically preserving aspect ratio (max 800px)
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP Data URL (fall back to JPEG if WebP is unsupported)
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Wire an image uploader component with instant client-side compression and auto-save
 */
function setupImageUploadHandler({ btnId, inputId, previewId, hiddenInputId, statusId, maxWidth = 800, maxHeight = 800, onSaved }) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const hiddenInput = document.getElementById(hiddenInputId);
  const status = statusId ? document.getElementById(statusId) : null;

  if (!input) return;

  if (btn) {
    btn.addEventListener('click', () => {
      input.click();
    });
  }

  input.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (status) {
      status.textContent = "خەریکی کەمکردنەوەی قەبارە و سەیڤکردنە...";
      status.style.display = "inline-block";
    }

    try {
      // 1-4. Compress to WebP Data URL (max 800px, 0.75 quality)
      const dataUrl = await compressImageToWebP(file, maxWidth, maxHeight, 0.75);

      // 5. Show compressed preview immediately
      if (preview) {
        preview.src = dataUrl;
      }
      if (hiddenInput) {
        hiddenInput.value = dataUrl;
      }

      // 6. Automatically save into Firestore
      if (onSaved) {
        await onSaved(dataUrl);
      }

      // 7. Show Kurdish success message
      showStatusMessage("وێنەکە بە سەرکەوتوویی کەمکرایەوە و سەیڤ کرا! 🎉", "success");
      if (status) {
        status.textContent = "سەیڤ کرا! (WebP)";
        setTimeout(() => {
          if (status) status.style.display = "none";
        }, 3000);
      }
    } catch (err) {
      console.error("Image compression error:", err);
      showStatusMessage(`هەڵە لە کەمکردنەوەی وێنە: ${err.message}`, "error");
      if (status) status.style.display = "none";
    } finally {
      input.value = ""; // Reset to allow re-selecting same file
    }
  });
}

function initAllImageUploaders() {
  // Hero Image
  setupImageUploadHandler({
    btnId: 'hero-file-btn',
    inputId: 'hero-file-input',
    previewId: 'hero-preview',
    hiddenInputId: 'hero-img',
    statusId: 'hero-upload-status',
    maxWidth: 1000,
    maxHeight: 1000,
    onSaved: async (dataUrl) => {
      await setDoc(generalDocRef, {
        hero: { image: dataUrl },
        heroImageUrl: dataUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  });

  // About Image
  setupImageUploadHandler({
    btnId: 'about-file-btn',
    inputId: 'about-file-input',
    previewId: 'about-preview',
    hiddenInputId: 'about-img',
    statusId: 'about-upload-status',
    maxWidth: 1000,
    maxHeight: 1000,
    onSaved: async (dataUrl) => {
      await setDoc(generalDocRef, {
        about: { image: dataUrl },
        aboutImageUrl: dataUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  });

  // Services 0-3 Image Uploaders
  for (let i = 0; i < 4; i++) {
    setupImageUploadHandler({
      btnId: `service-file-btn-${i}`,
      inputId: `service-file-input-${i}`,
      previewId: `service-preview-${i}`,
      hiddenInputId: `service-img-${i}`,
      maxWidth: 800,
      maxHeight: 800,
      onSaved: async (dataUrl) => {
        const docSnap = await getDoc(generalDocRef);
        if (docSnap.exists()) {
          const remoteServices = docSnap.data().services || [];
          if (remoteServices[i]) {
            remoteServices[i].imageUrl = dataUrl;
            remoteServices[i].image = dataUrl;
          } else {
            remoteServices[i] = { imageUrl: dataUrl, image: dataUrl };
          }
          await setDoc(generalDocRef, { services: remoteServices, updatedAt: new Date().toISOString() }, { merge: true });
        }
      }
    });
  }

  // Portfolio Projects 0-5 Image Uploaders
  for (let i = 0; i < 6; i++) {
    setupImageUploadHandler({
      btnId: `portfolio-file-btn-${i}`,
      inputId: `portfolio-file-input-${i}`,
      previewId: `portfolio-preview-${i}`,
      hiddenInputId: `portfolio-img-${i}`,
      maxWidth: 800,
      maxHeight: 800,
      onSaved: async (dataUrl) => {
        const docSnap = await getDoc(generalDocRef);
        if (docSnap.exists()) {
          const remotePortfolio = docSnap.data().portfolio || [];
          if (remotePortfolio[i]) {
            remotePortfolio[i].imageUrl = dataUrl;
            remotePortfolio[i].image = dataUrl;
          } else {
            remotePortfolio[i] = { imageUrl: dataUrl, image: dataUrl };
          }
          await setDoc(generalDocRef, { portfolio: remotePortfolio, updatedAt: new Date().toISOString() }, { merge: true });
        }
      }
    });
  }
}

// Initialize image uploaders on load
initAllImageUploaders();

// ==============================================================================
// MOBILE OFF-CANVAS HAMBURGER DRAWER CONTROLLER
// ==============================================================================
const adminHamburger = document.getElementById('adminHamburger');
const dashboardSidebar = document.getElementById('dashboardSidebar') || document.querySelector('.dashboard-sidebar');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');

function openDrawer() {
  if (adminHamburger) adminHamburger.classList.add('open');
  if (dashboardSidebar) dashboardSidebar.classList.add('open');
  if (drawerOverlay) drawerOverlay.classList.add('active');
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  if (adminHamburger) adminHamburger.classList.remove('open');
  if (dashboardSidebar) dashboardSidebar.classList.remove('open');
  if (drawerOverlay) drawerOverlay.classList.remove('active');
  document.body.classList.remove('drawer-open');
}

if (adminHamburger) {
  adminHamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dashboardSidebar && dashboardSidebar.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
}

if (drawerOverlay) {
  drawerOverlay.addEventListener('click', closeDrawer);
}

if (drawerCloseBtn) {
  drawerCloseBtn.addEventListener('click', closeDrawer);
}

// ==============================================================================
// TAB NAVIGATION LOGIC
// ==============================================================================
sidebarTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTabId = tab.getAttribute('data-tab');

    sidebarTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Automatically close the mobile slide-in drawer on selection
    closeDrawer();

    const targetPanel = document.getElementById(targetTabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

// ==============================================================================
// AUTHENTICATION STATE OBSERVER
// ==============================================================================
onAuthStateChanged(auth, async (user) => {
  if (authLoading) {
    authLoading.style.display = 'none';
  }

  if (user) {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';

    if (userEmailDisplay) {
      userEmailDisplay.textContent = user.email || 'Admin';
    }

    // Load full CMS configuration from Firestore
    await loadAllCMSData();
  } else {
    dashboardContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    hideLoginError();
  }
});

// ==============================================================================
// LOGIN HANDLER
// ==============================================================================
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      showLoginError("تکایە هەردوو ئیمەیڵ و تێپەڕەوشە بنووسە.");
      return;
    }

    setButtonLoading(loginBtn, true, "خەریکی چوونەژوورەوەیە...");
    hideLoginError();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error);
      let userFriendlyMsg = "چوونەژوورەوە سەرکەوتوو نەبوو. تکایە زانیارییەکانت بپشکنە.";

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        userFriendlyMsg = "ئیمەیڵ یان وشەی نهێنی نادروستە!";
      } else if (error.code === 'auth/too-many-requests') {
        userFriendlyMsg = "هەوڵدانی زۆر، بە شێوەیەکی کاتی بلۆک کرا. تکایە دواتر تاقی بکەرەوە.";
      } else if (error.code === 'auth/network-request-failed') {
        userFriendlyMsg = "کێشەی هێڵی ئینتەرنێت، پەیوەستبوون بەردەست نییە.";
      }

      showLoginError(userFriendlyMsg);
    } finally {
      setButtonLoading(loginBtn, false, "چوونەژوورەوە");
    }
  });
}

// ==============================================================================
// LOGOUT HANDLER
// ==============================================================================
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      alert("هەڵەیەک ڕوویدا لە کاتی دەرچووندا.");
    }
  });
}

// ==============================================================================
// FIRESTORE: LOAD FULL CMS CONFIGURATION
// ==============================================================================
async function loadAllCMSData() {
  updateSyncBadge("خەریکی خوێندنەوەی داتایە...", false);

  try {
    const docSnap = await getDoc(generalDocRef);
    let data = defaultSiteData;

    if (docSnap.exists()) {
      const remoteData = docSnap.data();
      // Deep merge with defaults to ensure all keys exist
      data = {
        hero: { ...defaultSiteData.hero, ...(remoteData.hero || {}) },
        about: { ...defaultSiteData.about, ...(remoteData.about || {}) },
        skills: remoteData.skills && remoteData.skills.length ? remoteData.skills : defaultSiteData.skills,
        services: remoteData.services && remoteData.services.length ? remoteData.services : defaultSiteData.services,
        portfolio: remoteData.portfolio && remoteData.portfolio.length ? remoteData.portfolio : defaultSiteData.portfolio,
        testimonials: remoteData.testimonials && remoteData.testimonials.length ? remoteData.testimonials : defaultSiteData.testimonials,
        contact: {
          ...defaultSiteData.contact,
          ...(remoteData.contact || {}),
          social: {
            ...defaultSiteData.contact.social,
            ...(remoteData.contact?.social || remoteData.social || {})
          }
        },
        social: {
          ...defaultSiteData.social,
          ...(remoteData.social || remoteData.contact?.social || {})
        },
        visibility: { ...defaultSiteData.visibility, ...(remoteData.visibility || {}) }
      };

      // Backwards compatibility fallbacks
      if (remoteData.heroTitle && !remoteData.hero?.title) data.hero.title = remoteData.heroTitle;
      if (remoteData.aboutText && !remoteData.about?.bio) data.about.bio = remoteData.aboutText;
      if (remoteData.heroImageUrl && !remoteData.hero?.image) data.hero.image = remoteData.heroImageUrl;
      if (remoteData.aboutImageUrl && !remoteData.about?.image) data.about.image = remoteData.aboutImageUrl;
    }

    populateFormWithData(data);
    updateSyncBadge("سەیڤ بووە", true);
  } catch (error) {
    console.error("Error loading CMS data from Firestore:", error);
    showStatusMessage(`هەڵە لە هێنانی داتاکان: ${error.message}`, "error");
    updateSyncBadge("کێشە لە پەیوەستبوون", false);
    // Populate defaults so the user is never stuck with an empty form
    populateFormWithData(defaultSiteData);
  }
}

/**
 * Fills all inputs and textareas across all CMS tabs with data
 */
function populateFormWithData(data) {
  // 0. Section Visibility Controls
  const visibility = data.visibility || {};
  SECTION_KEYS.forEach(secName => {
    const isVisible = visibility[secName] !== false; // Default true if unspecified
    setSectionVisibility(secName, isVisible);
  });

  // 1. Hero Section
  setInputValue('hero-greeting', data.hero?.greeting);
  setInputValue('hero-name', data.hero?.name);
  setInputValue('hero-title', data.hero?.title);
  setInputValue('hero-desc', data.hero?.description);
  setInputValue('input-badge-1', data.hero?.badge1 || "ساڵانێک ئەزموونی پرۆفیشناڵ");
  setInputValue('input-badge-2', data.hero?.badge2 || "وردەکاری لە ناوەڕۆک و ڕووکاردا");
  const heroImage = data.hero?.image || data.heroImageUrl;
  if (heroImage) {
    setInputValue('hero-img', heroImage);
    setImagePreviewSrc('hero-preview', heroImage);
  }

  // 2. About & Skills
  setInputValue('about-lead-title', data.about?.leadTitle);
  setInputValue('about-bio', data.about?.bio);
  const aboutImage = data.about?.image || data.aboutImageUrl;
  if (aboutImage) {
    setInputValue('about-img', aboutImage);
    setImagePreviewSrc('about-preview', aboutImage);
  }
  if (Array.isArray(data.skills)) {
    data.skills.forEach((skill, i) => {
      setInputValue(`skill-name-${i}`, skill.name);
      setInputValue(`skill-pct-${i}`, skill.percentage);
    });
  }

  // 3. Services
  if (Array.isArray(data.services)) {
    data.services.forEach((service, i) => {
      setInputValue(`service-title-${i}`, service.title);
      setInputValue(`service-desc-${i}`, service.desc);
      setInputValue(`service-icon-${i}`, service.icon);
      const serviceImg = service.imageUrl || service.image;
      if (serviceImg) {
        setInputValue(`service-img-${i}`, serviceImg);
        setImagePreviewSrc(`service-preview-${i}`, serviceImg);
      }
    });
  }

  // 4. Portfolio
  if (Array.isArray(data.portfolio)) {
    data.portfolio.forEach((proj, i) => {
      setInputValue(`portfolio-title-${i}`, proj.title);
      setInputValue(`portfolio-cat-${i}`, proj.category);
      const projImg = proj.imageUrl || proj.image;
      if (projImg) {
        setInputValue(`portfolio-img-${i}`, projImg);
        setImagePreviewSrc(`portfolio-preview-${i}`, projImg);
      }
      setInputValue(`portfolio-desc-${i}`, proj.desc);
    });
  }

  // 5. Testimonials
  if (Array.isArray(data.testimonials)) {
    data.testimonials.forEach((t, i) => {
      setInputValue(`testimonial-quote-${i}`, t.quote);
      setInputValue(`testimonial-author-${i}`, t.author);
      setInputValue(`testimonial-role-${i}`, t.role);
    });
  }

  // 6. Contact & Footer
  setInputValue('contact-phone', data.contact?.phone);
  setInputValue('contact-email', data.contact?.email);
  setInputValue('contact-address', data.contact?.address);
  setInputValue('footer-copyright', data.contact?.copyright);

  // Social Media Links
  const socialData = data.contact?.social || data.social || {};
  setInputValue('social-github', socialData.github || defaultSiteData.contact.social.github);
  setInputValue('social-instagram', socialData.instagram || defaultSiteData.contact.social.instagram);
  setInputValue('social-facebook', socialData.facebook || defaultSiteData.contact.social.facebook);
  setInputValue('social-linkedin', socialData.linkedin || defaultSiteData.contact.social.linkedin);
  setInputValue('social-telegram', socialData.telegram || defaultSiteData.contact.social.telegram);
}

function setInputValue(elementId, value) {
  const el = document.getElementById(elementId);
  if (el && value !== undefined && value !== null) {
    el.value = value;
  }
}

function setImagePreviewSrc(elementId, src) {
  const el = document.getElementById(elementId);
  if (el && src) {
    el.src = src;
  }
}

// ==============================================================================
// FIRESTORE: SAVE FULL CMS CONFIGURATION
// ==============================================================================
async function saveAllCMSData() {
  setButtonLoading(saveAllBtn, true, "خەریکی سەیڤکردنە...");
  setButtonLoading(saveBottomBtn, true, "خەریکی سەیڤکردنە...");
  updateSyncBadge("خەریکی پاشەکەوتکردنە...", false);

  // Extract section visibility states
  const visibility = {};
  SECTION_KEYS.forEach(secName => {
    const el = document.getElementById(`toggle-${secName}`) || document.getElementById(`toggle-overview-${secName}`);
    visibility[secName] = el ? el.checked : true;
  });

  // Extract social media links
  const socialLinks = {
    github: getInputValue('social-github') || "https://github.com/heminsherko",
    instagram: getInputValue('social-instagram') || "https://instagram.com/heminsherko",
    facebook: getInputValue('social-facebook') || "https://facebook.com/hemin.sherko1",
    linkedin: getInputValue('social-linkedin') || "https://www.linkedin.com/in/heminsherko1998/",
    telegram: getInputValue('social-telegram') || "https://t.me/heminsherko"
  };

  // Extract all fields into the complete structured JSON object
  const fullData = {
    visibility,
    hero: {
      greeting: getInputValue('hero-greeting'),
      name: getInputValue('hero-name'),
      title: getInputValue('hero-title'),
      description: getInputValue('hero-desc'),
      badge1: getInputValue('input-badge-1') || "ساڵانێک ئەزموونی پرۆفیشناڵ",
      badge2: getInputValue('input-badge-2') || "وردەکاری لە ناوەڕۆک و ڕووکاردا",
      image: getInputValue('hero-img')
    },
    about: {
      leadTitle: getInputValue('about-lead-title'),
      bio: getInputValue('about-bio'),
      image: getInputValue('about-img')
    },
    skills: [
      { name: getInputValue('skill-name-0'), percentage: parseInt(getInputValue('skill-pct-0'), 10) || 0 },
      { name: getInputValue('skill-name-1'), percentage: parseInt(getInputValue('skill-pct-1'), 10) || 0 },
      { name: getInputValue('skill-name-2'), percentage: parseInt(getInputValue('skill-pct-2'), 10) || 0 },
      { name: getInputValue('skill-name-3'), percentage: parseInt(getInputValue('skill-pct-3'), 10) || 0 }
    ],
    services: [
      {
        title: getInputValue('service-title-0'),
        desc: getInputValue('service-desc-0'),
        icon: getInputValue('service-icon-0'),
        imageUrl: getInputValue('service-img-0'),
        image: getInputValue('service-img-0')
      },
      {
        title: getInputValue('service-title-1'),
        desc: getInputValue('service-desc-1'),
        icon: getInputValue('service-icon-1'),
        imageUrl: getInputValue('service-img-1'),
        image: getInputValue('service-img-1')
      },
      {
        title: getInputValue('service-title-2'),
        desc: getInputValue('service-desc-2'),
        icon: getInputValue('service-icon-2'),
        imageUrl: getInputValue('service-img-2'),
        image: getInputValue('service-img-2')
      },
      {
        title: getInputValue('service-title-3'),
        desc: getInputValue('service-desc-3'),
        icon: getInputValue('service-icon-3'),
        imageUrl: getInputValue('service-img-3'),
        image: getInputValue('service-img-3')
      }
    ],
    portfolio: [
      {
        title: getInputValue('portfolio-title-0'),
        category: getInputValue('portfolio-cat-0'),
        imageUrl: getInputValue('portfolio-img-0'),
        image: getInputValue('portfolio-img-0'),
        desc: getInputValue('portfolio-desc-0')
      },
      {
        title: getInputValue('portfolio-title-1'),
        category: getInputValue('portfolio-cat-1'),
        imageUrl: getInputValue('portfolio-img-1'),
        image: getInputValue('portfolio-img-1'),
        desc: getInputValue('portfolio-desc-1')
      },
      {
        title: getInputValue('portfolio-title-2'),
        category: getInputValue('portfolio-cat-2'),
        imageUrl: getInputValue('portfolio-img-2'),
        image: getInputValue('portfolio-img-2'),
        desc: getInputValue('portfolio-desc-2')
      },
      {
        title: getInputValue('portfolio-title-3'),
        category: getInputValue('portfolio-cat-3'),
        imageUrl: getInputValue('portfolio-img-3'),
        image: getInputValue('portfolio-img-3'),
        desc: getInputValue('portfolio-desc-3')
      },
      {
        title: getInputValue('portfolio-title-4'),
        category: getInputValue('portfolio-cat-4'),
        imageUrl: getInputValue('portfolio-img-4'),
        image: getInputValue('portfolio-img-4'),
        desc: getInputValue('portfolio-desc-4')
      },
      {
        title: getInputValue('portfolio-title-5'),
        category: getInputValue('portfolio-cat-5'),
        imageUrl: getInputValue('portfolio-img-5'),
        image: getInputValue('portfolio-img-5'),
        desc: getInputValue('portfolio-desc-5')
      }
    ],
    testimonials: [
      { quote: getInputValue('testimonial-quote-0'), author: getInputValue('testimonial-author-0'), role: getInputValue('testimonial-role-0') },
      { quote: getInputValue('testimonial-quote-1'), author: getInputValue('testimonial-author-1'), role: getInputValue('testimonial-role-1') },
      { quote: getInputValue('testimonial-quote-2'), author: getInputValue('testimonial-author-2'), role: getInputValue('testimonial-role-2') }
    ],
    contact: {
      phone: getInputValue('contact-phone'),
      email: getInputValue('contact-email'),
      address: getInputValue('contact-address'),
      copyright: getInputValue('footer-copyright'),
      social: socialLinks
    },
    social: socialLinks,
    // Backwards compatibility roots for general consumers:
    heroTitle: getInputValue('hero-title'),
    aboutText: getInputValue('about-bio'),
    heroImageUrl: getInputValue('hero-img'),
    aboutImageUrl: getInputValue('about-img'),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(generalDocRef, fullData, { merge: true });
    showStatusMessage("گۆڕانکارییەکان بە سەرکەوتوویی لە فایەربەیس سەیڤ کران!", "success");
    updateSyncBadge("سەیڤ بووە", true);
  } catch (error) {
    console.error("Error saving CMS data to Firestore:", error);
    showStatusMessage(`شکستی هێنا لە سەیڤکردندا: ${error.message}`, "error");
    updateSyncBadge("سەیڤ نەکرا", false);
  } finally {
    setButtonLoading(saveAllBtn, false, "پاشەکەوتکردنی هەموو گۆڕانکارییەکان");
    setButtonLoading(saveBottomBtn, false, "پاشەکەوتکردنی هەموو گۆڕانکارییەکان");
  }
}

function getInputValue(elementId) {
  const el = document.getElementById(elementId);
  return el ? el.value.trim() : '';
}

// Bind save actions
if (saveAllBtn) {
  saveAllBtn.addEventListener('click', saveAllCMSData);
}

if (saveBottomBtn) {
  saveBottomBtn.addEventListener('click', saveAllCMSData);
}

const cmsForm = document.getElementById('cms-form');
if (cmsForm) {
  cmsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveAllCMSData();
  });
}

// ==============================================================================
// UI HELPERS & UTILITIES
// ==============================================================================
function setButtonLoading(btn, isLoading, labelText) {
  if (!btn) return;
  const btnText = btn.querySelector('.btn-text');
  const btnSpinner = btn.querySelector('.btn-spinner');

  btn.disabled = isLoading;

  if (btnText) {
    if (isLoading) {
      if (!btn.dataset.originalHtml) {
        btn.dataset.originalHtml = btnText.innerHTML;
      }
      btnText.textContent = labelText;
    } else {
      if (btn.dataset.originalHtml) {
        btnText.innerHTML = btn.dataset.originalHtml;
      } else {
        btnText.textContent = labelText;
      }
    }
  }

  if (btnSpinner) {
    btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
  }
}

function showLoginError(msg) {
  if (!loginError) return;
  loginError.textContent = msg;
  loginError.style.display = 'block';
}

function hideLoginError() {
  if (!loginError) return;
  loginError.textContent = '';
  loginError.style.display = 'none';
}

let statusTimeout = null;
function showStatusMessage(msg, type = "success") {
  if (!saveStatus) return;

  saveStatus.textContent = msg;
  saveStatus.className = `alert-banner ${type === 'success' ? 'alert-success' : 'alert-error'}`;
  saveStatus.style.display = 'block';

  if (statusTimeout) clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    saveStatus.style.display = 'none';
  }, 4500);
}

function updateSyncBadge(label, isSynced) {
  if (syncStatus) {
    syncStatus.textContent = label;
    syncStatus.style.color = isSynced ? '#10b981' : '#f59e0b';
  }
  if (saveBarIndicatorText) {
    saveBarIndicatorText.textContent = label;
  }
}
