// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase;
if (typeof window.supabase !== 'undefined') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Toggle between login and signup forms
document.addEventListener('DOMContentLoaded', () => {
  const showSignupBtn = document.getElementById('showSignup');
  const showLoginBtn = document.getElementById('showLogin');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    });
  }
  
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }
  
  // Handle login form submission
  const loginFormElement = document.getElementById('loginFormElement');
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', handleLogin);
  }
  
  // Handle signup form submission
  const signupFormElement = document.getElementById('signupFormElement');
  if (signupFormElement) {
    signupFormElement.addEventListener('submit', handleSignup);
  }
  
  // Check if user is already logged in
  checkAuth();
  
  // Handle navigation toggle buttons
  setupNavToggle();
});

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!supabase) {
    alert('Supabase is not configured. Please add your Supabase credentials in auth.js');
    return;
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Store user session
    localStorage.setItem('morobo_user', JSON.stringify(data.user));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

// Handle signup
async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  if (!supabase) {
    alert('Supabase is not configured. Please add your Supabase credentials in auth.js');
    return;
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    
    if (error) throw error;
    
    alert('Account created! Please check your email to verify your account.');
    
    // Switch to login form
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  } catch (error) {
    alert('Signup failed: ' + error.message);
  }
}

// Check if user is authenticated
async function checkAuth() {
  if (!supabase) return;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // User is logged in
      const currentPage = window.location.pathname;
      
      // If on auth page, redirect to dashboard
      if (currentPage.includes('auth.html')) {
        window.location.href = 'dashboard.html';
      }
    } else {
      // User is not logged in
      const currentPage = window.location.pathname;
      
      // If on dashboard, redirect to auth
      if (currentPage.includes('dashboard.html')) {
        window.location.href = 'auth.html';
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}

// Handle logout
async function handleLogout() {
  if (!supabase) {
    localStorage.removeItem('morobo_user');
    window.location.href = 'index.html';
    return;
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('morobo_user');
    window.location.href = 'index.html';
  } catch (error) {
    alert('Logout failed: ' + error.message);
  }
}

// Setup navigation toggle
function setupNavToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      if (view === 'home') {
        window.location.href = 'index.html';
      } else if (view === 'profile') {
        // Check if user is logged in
        const user = localStorage.getItem('morobo_user');
        if (user) {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'auth.html';
        }
      }
    });
  });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleLogin,
    handleSignup,
    handleLogout,
    checkAuth,
  };
}
