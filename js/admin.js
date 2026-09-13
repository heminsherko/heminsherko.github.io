/**
 * ==============================================================================
 * Hemin Sherko - Admin Dashboard Logic
 * Powered by Firebase v10 Modular Web SDK
 * ==============================================================================
 */

// 1. Firebase Modular CDN Imports
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

// 2. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZjxwqKKddb2L2XLR7obZmjlXDYbl6p48",
  authDomain: "hemin-portfolio.firebaseapp.com",
  projectId: "hemin-portfolio",
  storageBucket: "hemin-portfolio.firebasestorage.app",
  messagingSenderId: "52349564982",
  appId: "1:52349564982:web:c09fbe8747b8422572c097"
};

// 3. Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. DOM Elements Cache
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

const contentForm = document.getElementById('content-form');
const heroTitleInput = document.getElementById('hero-title');
const aboutTextInput = document.getElementById('about-text');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');
const syncStatus = document.getElementById('sync-status');

// Firestore Reference for General Site Data
const generalDocRef = doc(db, "siteData", "general");

// ==============================================================================
// 5. AUTHENTICATION STATE OBSERVER
// ==============================================================================
onAuthStateChanged(auth, async (user) => {
  // Hide initial loading screen once auth status is determined
  if (authLoading) {
    authLoading.style.display = 'none';
  }

  if (user) {
    // User is signed in
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';

    if (userEmailDisplay) {
      userEmailDisplay.textContent = user.email || 'Admin';
    }

    // Load website content from Firestore
    await loadWebsiteContent();
  } else {
    // User is signed out
    dashboardContainer.style.display = 'none';
    loginContainer.style.display = 'flex';

    // Clear any previous error states
    hideLoginError();
  }
});

// ==============================================================================
// 6. LOGIN FORM HANDLER
// ==============================================================================
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      showLoginError("Please provide both email and password.");
      return;
    }

    setButtonLoading(loginBtn, true, "Signing in...");
    hideLoginError();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle switching to dashboard view
    } catch (error) {
      console.error("Login failed:", error);
      let userFriendlyMsg = "Authentication failed. Please check your credentials.";

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        userFriendlyMsg = "Invalid email or password. Please verify your credentials.";
      } else if (error.code === 'auth/too-many-requests') {
        userFriendlyMsg = "Access temporarily blocked due to multiple failed login attempts. Please try again later.";
      } else if (error.code === 'auth/network-request-failed') {
        userFriendlyMsg = "Network error. Please check your internet connection.";
      }

      showLoginError(userFriendlyMsg);
    } finally {
      setButtonLoading(loginBtn, false, "Sign In");
    }
  });
}

// ==============================================================================
// 7. LOGOUT HANDLER
// ==============================================================================
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle switching back to login view
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error signing out. Please try again.");
    }
  });
}

// ==============================================================================
// 8. FIRESTORE DATA RETRIEVAL (READ)
// ==============================================================================
async function loadWebsiteContent() {
  updateSyncBadge("Fetching from Firestore...", false);

  try {
    const docSnap = await getDoc(generalDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (heroTitleInput) heroTitleInput.value = data.heroTitle || '';
      if (aboutTextInput) aboutTextInput.value = data.aboutText || '';
      updateSyncBadge("Synced with Firestore", true);
    } else {
      console.info("Document 'siteData/general' does not exist yet. Ready for first save.");
      updateSyncBadge("Ready to initialize", true);
    }
  } catch (error) {
    console.error("Error fetching general site data:", error);
    showStatusMessage(`Error loading content: ${error.message}`, "error");
    updateSyncBadge("Sync error", false);
  }
}

// ==============================================================================
// 9. FIRESTORE DATA PERSISTENCE (WRITE / MERGE)
// ==============================================================================
if (contentForm) {
  contentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const heroTitle = heroTitleInput ? heroTitleInput.value.trim() : '';
    const aboutText = aboutTextInput ? aboutTextInput.value.trim() : '';

    setButtonLoading(saveBtn, true, "Saving Changes...");
    updateSyncBadge("Saving to Firestore...", false);

    try {
      await setDoc(
        generalDocRef, 
        { 
          heroTitle: heroTitle, 
          aboutText: aboutText,
          updatedAt: new Date().toISOString()
        }, 
        { merge: true }
      );

      showStatusMessage("Content changes saved successfully to Firestore!", "success");
      updateSyncBadge("Synced with Firestore", true);
    } catch (error) {
      console.error("Error saving content to Firestore:", error);
      showStatusMessage(`Failed to save changes: ${error.message}`, "error");
      updateSyncBadge("Save failed", false);
    } finally {
      setButtonLoading(saveBtn, false, "Save Changes");
    }
  });
}

// ==============================================================================
// 10. UI UTILITY HELPERS
// ==============================================================================

/**
 * Toggles a button between loading state with spinner and normal state
 */
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

/**
 * Displays an error banner on the login screen
 */
function showLoginError(msg) {
  if (!loginError) return;
  loginError.textContent = msg;
  loginError.style.display = 'block';
}

/**
 * Hides the login error banner
 */
function hideLoginError() {
  if (!loginError) return;
  loginError.textContent = '';
  loginError.style.display = 'none';
}

/**
 * Displays an alert message on the dashboard screen
 */
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

/**
 * Updates the Firestore synchronization indicator
 */
function updateSyncBadge(label, isSynced) {
  if (!syncStatus) return;
  syncStatus.innerHTML = `
    <span class="pulse-indicator" style="background-color: ${isSynced ? '#10b981' : '#f59e0b'}; box-shadow: 0 0 8px ${isSynced ? '#10b981' : '#f59e0b'};"></span>
    ${label}
  `;
}
