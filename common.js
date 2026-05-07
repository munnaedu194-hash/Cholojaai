/**
 * Cholo Jaai - Centralized Logic
 * Manages injectible components (Navbar, Footer) and shared helpers.
 */

// Global App Configuration
const APP = window.APP || {};

// 1. Component Injection
APP.initLayout = function () {
  const navbarHTML = `
    <nav class="navbar">
      <div class="container flex items-center justify-between py-3">
        <a href="index.html?v=bypass-cache" class="flex items-center gap-2" style="z-index: 10;">
          <img src="logo.jpg" alt="Logo" width="34" height="34" style="border-radius: var(--radius-sm); filter: drop-shadow(0 0 8px rgba(0,230,118,0.5));">
          <span style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">
            Cholo <span class="text-gradient">Jaai</span>
          </span>
        </a>
        <div class="nav-links">
          <a href="index.html?v=bypass-cache" id="navHomeLink">Home</a>
          <a href="packages.html" class="traveler-only">Packages</a>
          <a href="custom-tour.html" class="traveler-only">Custom Tour</a>
          <a href="guided-tour.html" class="traveler-only">Guided Tour</a>
          
          <div class="nav-dropdown-trigger traveler-only" style="display: none; position: relative; margin-left: 16px; margin-right: -8px;" id="navNotifyContainer">
            <a href="dashboard.html?tab=bookings" class="nav-link" id="navNotifyBtn" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-main);"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span class="badge" id="navNotifyCount" style="position: absolute; top: -2px; right: -2px; background: var(--primary); color: #000; border-radius: 50%; width: 18px; height: 18px; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: bold; border: 2px solid var(--surface); display:none;">0</span>
            </a>
            <div class="nav-dropdown" id="navNotifyDropdown">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                <span style="font-weight: 600; font-size: 0.9rem;">Recent Bookings</span>
                <a href="dashboard.html?tab=bookings" style="font-size: 0.8rem; color: var(--primary); text-decoration: none;">View All</a>
              </div>
              <div id="navNotifyDropdownContent" style="max-height: 300px; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: var(--primary) transparent;">
                <p class="text-muted text-center" style="font-size: 0.85rem; margin: 16px 0;">Loading...</p>
              </div>
            </div>
          </div>
          <a href="register.html" class="btn btn-primary" id="navAuthBtn" style="padding: 8px 18px; margin-left:12px;">Sign In</a>
        </div>
      </div>
    </nav>
  `;

  const footerHTML = `
    <style>
      .custom-tooltip {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }
      .custom-tooltip .tooltip-content {
        visibility: hidden;
        opacity: 0;
        width: 280px;
        background-color: rgba(15,23,42,0.95);
        color: #fff;
        text-align: left;
        border-radius: 12px;
        padding: 16px;
        position: absolute;
        z-index: 100;
        bottom: 125%;
        left: 50%;
        margin-left: -140px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        border: 1px solid rgba(0,230,118,0.3);
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
        font-family: 'Inter', sans-serif;
      }
      .custom-tooltip .tooltip-content::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: rgba(0,230,118,0.3) transparent transparent transparent;
      }
      .custom-tooltip:hover .tooltip-content {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
      }
      .nav-dropdown {
        position: absolute;
        top: 130%;
        right: -20px;
        width: 320px;
        background-color: rgba(15,23,42,0.95);
        border: 1px solid rgba(0,230,118,0.3);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        z-index: 100;
        visibility: hidden;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
        pointer-events: none;
        overflow-x: hidden;
      }
      .nav-dropdown-trigger:hover .nav-dropdown,
      .nav-dropdown.show {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .nav-dropdown::before {
        content: "";
        position: absolute;
        bottom: 100%;
        right: 32px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent rgba(0,230,118,0.3) transparent;
      }
    </style>
    <footer class="footer mt-8">
      <div class="container">
        <div class="flex flex-wrap justify-between items-center gap-6" style="border-bottom: 1px solid var(--border); padding-bottom: 32px; margin-bottom: 32px; text-align: left;">
           <div>
              <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); font-family: 'Outfit', sans-serif;">
                Cholo <span class="text-gradient">Jaai</span>
              </span>
              <p class="mt-2 text-muted" style="max-width: 300px;">Smart trip planning platform for modern explorers.</p>
           </div>
           <div class="flex gap-8">
              <div class="flex" style="flex-direction: column; gap: 8px;">
                 <h4 style="color: var(--text-main); margin-bottom: 8px;">Company</h4>
                 <a class="text-muted custom-tooltip">About Us
                   <div class="tooltip-content">
                     <h5 style="color: var(--primary); font-size: 1.05rem; margin-bottom: 8px; font-weight: 700;">About Cholo Jaai</h5>
                     <p style="font-size: 0.85rem; line-height: 1.5; margin:0; color: #cbd5e1; text-transform: none;">Cholo Jaai is your ultimate smart trip planner. We bring modern explorers together to seamlessly discover, customize, and experience unforgettable adventures with ease.</p>
                   </div>
                 </a>
                 <a href="#" class="text-muted">Careers</a>
              </div>
              <div class="flex" style="flex-direction: column; gap: 8px;">
                 <h4 style="color: var(--text-main); margin-bottom: 8px;">Help</h4>
                 <a class="text-muted custom-tooltip">Support
                   <div class="tooltip-content">
                     <h5 style="color: var(--primary); font-size: 1.05rem; margin-bottom: 12px; font-weight: 700;">24/7 Support Team</h5>
                     <div style="font-size: 0.85rem; color: #cbd5e1; display: flex; flex-direction: column; gap: 8px; text-transform: none;">
                       <div style="display: flex; align-items: center; gap: 8px;">
                         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                         <span>+880 1711-000000</span>
                       </div>
                       <div style="display: flex; align-items: center; gap: 8px;">
                         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                         <span>support@cholojaai.com</span>
                       </div>
                       <div style="display: flex; align-items: center; gap: 8px;">
                         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                         <span>fb.com/CholoJaaiSupport</span>
                       </div>
                     </div>
                   </div>
                 </a>
                 <a href="#" class="text-muted">Terms of Service</a>
              </div>
           </div>
        </div>
        <p style="font-weight: 500; font-family: 'Inter', sans-serif;">Copyright &copy; ${new Date().getFullYear()} by Cholo Jaai. Built beautifully fast.</p>
      </div>
    </footer>
  `;

  // Inject Navbar at the top of body
  if (!document.querySelector('nav.navbar')) {
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    setTimeout(() => {
      const userStr = localStorage.getItem('CJ_USER');
      if (userStr) {
        const user = JSON.parse(userStr);

        // Professional Role Integration in Profile Button
        const btn = document.getElementById('navAuthBtn');
        if (btn) {
          let roleName = user.type || 'Traveler';
          let roleColor = 'var(--primary)';
          let roleBg = 'rgba(0, 230, 118, 0.1)';

          if (user.type === 'Guide') {
            roleColor = 'var(--secondary)';
            roleBg = 'rgba(0, 176, 255, 0.1)';
          } else if (['Master Admin', 'Moderator', 'Support Agent'].includes(user.type)) {
            roleColor = 'var(--accent)';
            roleBg = 'rgba(255, 61, 0, 0.1)';
            roleName = 'Admin';
          }

          btn.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.1; margin-right: 12px;">
              <span style="font-size: 0.85rem; font-weight: 700;">Profile</span>
              <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: rgba(255,255,255,0.7); letter-spacing: 0.5px;">${roleName}</span>
            </div>
            <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: ${roleBg}; border: 1px solid ${roleColor}; display: flex; align-items: center; justify-content: center; color: ${roleColor};">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <div style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: ${roleColor}; border: 2px solid var(--surface); box-shadow: 0 0 5px ${roleColor};"></div>
            </div>
          `;
          btn.href = 'dashboard.html';
          btn.style.display = 'inline-flex';
          btn.style.alignItems = 'center';
          btn.style.padding = '8px 16px';
          btn.style.background = 'rgba(255,255,255,0.03)';
          btn.style.border = '1px solid var(--border)';
          btn.style.boxShadow = 'none';
          btn.classList.add('glass');
        }

        // Add Admin Dashboard link for all Admin roles
        const adminRoles = ['Master Admin', 'Moderator', 'Support Agent'];
        if (adminRoles.includes(user.type)) {
          const navLinks = document.querySelector('.nav-links');
          if (navLinks && btn) {
            const dashboardLink = document.createElement('a');
            dashboardLink.href = 'admin.html';
            dashboardLink.textContent = 'Admin Dashboard';
            dashboardLink.className = 'btn btn-secondary glass';
            dashboardLink.style.marginRight = '8px';
            dashboardLink.style.padding = '8px 14px';
            dashboardLink.style.fontSize = '0.85rem';
            navLinks.insertBefore(dashboardLink, btn);
          }
        }

        // Add Create Admin link ONLY for Master Admin
        if (user.type === 'Master Admin') {
          const navLinks = document.querySelector('.nav-links');
          if (navLinks && btn) {
            const adminLink = document.createElement('a');
            adminLink.href = 'create-admin.html';
            adminLink.textContent = 'Create Admin';
            adminLink.className = 'btn btn-secondary glass';
            adminLink.style.marginRight = '8px';
            adminLink.style.padding = '8px 14px';
            adminLink.style.fontSize = '0.85rem';
            // Find Admin Dashboard link to insert before it
            const dashLink = Array.from(navLinks.children).find(el => el.textContent === 'Admin Dashboard');
            navLinks.insertBefore(adminLink, dashLink || btn);
          }
        }

        // Guides: point Home → guide-home.html and hide traveler-only nav items
        if (user.type === 'Guide') {
          const homeLink = document.getElementById('navHomeLink');
          if (homeLink) homeLink.href = 'guide-home.html';
          document.querySelectorAll('.traveler-only').forEach(el => el.style.display = 'none');
        } else if (user.type === 'Traveler') {
          const notifyContainer = document.getElementById('navNotifyContainer');
          const notifyBtn = document.getElementById('navNotifyBtn');
          if (notifyContainer && notifyBtn) {
            notifyContainer.style.display = 'inline-block';
            notifyBtn.style.display = 'flex';
            
            const email = encodeURIComponent(user.email);
            const phone = user.phone ? encodeURIComponent(user.phone) : '';
            Promise.all([
              APP.API.fetch(`/api/data/bookings?email=${email}&phone=${phone}`),
              APP.API.fetch(`/api/data/customTours?email=${email}&phone=${phone}`),
              APP.API.fetch(`/api/data/guidedTours?email=${email}&phone=${phone}`)
            ]).then(([resB, resC, resG]) => {
              let allTours = [];
              if (resB.success) allTours.push(...resB.data.map(t => ({...t, _type: 'Standard'})));
              if (resC.success) allTours.push(...resC.data.map(t => ({...t, _type: 'Custom'})));
              if (resG.success) allTours.push(...resG.data.map(t => ({...t, _type: 'Guided'})));
              
              allTours.sort((a,b) => b.id - a.id);
              
              const countEl = document.getElementById('navNotifyCount');
              
              // Handle Seen State & Status Changes
              const oldState = JSON.parse(localStorage.getItem('CJ_NOTIFY_STATE') || '{}');
              const newState = {};
              let unseenCount = 0;

              allTours.forEach(t => {
                const key = `${t.id}_${t._type}`;
                newState[key] = t.status || 'Pending';
                
                // If it's a new booking OR the status has changed, it's "unseen"
                if (!oldState[key] || oldState[key] !== newState[key]) {
                  unseenCount++;
                }
              });

              if (countEl && unseenCount > 0) {
                countEl.textContent = unseenCount;
                countEl.style.display = 'flex';
              } else if (countEl) {
                countEl.style.display = 'none';
              }
              
              // Mark as seen on click (Toggle dropdown, No redirect)
              notifyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = document.getElementById('navNotifyDropdown');
                if (dropdown) dropdown.classList.toggle('show');
                
                localStorage.setItem('CJ_NOTIFY_STATE', JSON.stringify(newState));
                if (countEl) countEl.style.display = 'none';
              });

              // Close dropdown when clicking outside
              document.addEventListener('click', (e) => {
                const dropdown = document.getElementById('navNotifyDropdown');
                if (dropdown && !e.target.closest('#navNotifyContainer')) {
                  dropdown.classList.remove('show');
                }
              });

              const dropdownContent = document.getElementById('navNotifyDropdownContent');
              if (dropdownContent) {
                if (allTours.length === 0) {
                  dropdownContent.innerHTML = '<p class="text-muted text-center" style="font-size: 0.85rem; margin: 16px 0;">No new bookings</p>';
                } else {
                  dropdownContent.innerHTML = allTours.slice(0, 5).map(t => {
                    const key = `${t.id}_${t._type}`;
                    const isUpdated = oldState[key] && oldState[key] !== (t.status || 'Pending');
                    return `
                      <a href="dashboard.html?tab=bookings" style="display: block; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; margin-bottom: 10px; border-left: 4px solid ${isUpdated ? 'var(--secondary)' : 'var(--primary)'}; text-decoration: none; transition: all 0.2s; border-right: 1px solid ${isUpdated ? 'rgba(0, 176, 255, 0.3)' : 'transparent'};" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${t.destination || 'Destination'}</div>
                          ${isUpdated ? '<span style="font-size: 0.6rem; background: var(--secondary); color: #000; padding: 1px 4px; border-radius: 2px; font-weight: 800;">UPDATED</span>' : ''}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${t._type}</span>
                          <span style="font-size: 0.75rem; color: ${(t.status === 'Confirmed' || t.status === 'Approved') ? 'var(--primary)' : (t.status === 'Cancelled' ? 'var(--accent)' : 'var(--secondary)')}; font-weight: 800; background: rgba(0,0,0,0.2); padding: 2px 8px; border-radius: 4px;">${t.status || 'Pending'}</span>
                        </div>
                      </a>
                    `;
                  }).join('');
                }
              }
            }).catch(e => console.error(e));
          }
        }
      }
    }, 50);
  }

  // Inject Footer at the bottom of body
  if (!document.querySelector('footer.footer')) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
};

// Universal Success Tick Overlay
APP.showSuccessTick = function(message, callback) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0'; overlay.style.left = '0';
  overlay.style.width = '100vw'; overlay.style.height = '100vh';
  overlay.style.background = 'rgba(15,23,42,0.9)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.backdropFilter = 'blur(10px)';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease';

  overlay.innerHTML = `
    <div style="transform: scale(0.5); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center;" id="tickContainer">
      <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; box-shadow: 0 0 30px rgba(0,230,118,0.5);">
        <svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h2 style="color: #fff; font-family: 'Outfit', sans-serif; font-size: 2.5rem; margin-bottom: 8px;">Booking Requested!</h2>
      <p style="color: var(--primary); font-size: 1.1rem;">${message}</p>
    </div>
  `;

  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '1';
    document.getElementById('tickContainer').style.transform = 'scale(1)';
  }, 10);

  setTimeout(() => {
    if (callback) callback();
  }, 2000);
};

// 2. Mock API Data handling (LocalStorage based for static no-node version)
APP.API = {
  save: async function (model, data) {
    try {
      const result = await this.fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, data })
      });

      return result;
    } catch (error) {
      console.warn('Backend not running, falling back to offline LocalStorage mode:', error);

      // Fallback for when backend is offline
      return new Promise((resolve) => {
        setTimeout(() => {
          let storage = JSON.parse(localStorage.getItem('CJ_DB')) || {};
          if (!storage[model]) storage[model] = [];
          const entry = { id: Date.now(), ...data };
          storage[model].push(entry);
          localStorage.setItem('CJ_DB', JSON.stringify(storage));
          console.log(`[Offline Mode] Saved to ${model}:`, entry);
          resolve({ success: true, message: 'Offline mode: Saved locally!' });
        }, 500);
      });
    }
  },

  getBaseUrl: function () {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isMainServer = window.location.port === '3000';

    return (isLocal && !isMainServer) ? 'http://localhost:3000' : '';
  },

  fetch: async function (endpoint, options = {}) {
    const baseUrl = this.getBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Fetch error for ${url}, checking local fallback:`, error);

      // Fallback for GET requests to /api/data/:model
      if ((!options.method || options.method === 'GET') && endpoint.includes('/api/data/')) {
        const modelWithQuery = endpoint.split('/api/data/')[1] || '';
        const model = modelWithQuery.split('?')[0]; // strip query params
        let storage = JSON.parse(localStorage.getItem('CJ_DB')) || {};
        let records = storage[model] || [];

        // Return in reverse order (latest first) to match server behavior
        return { success: true, data: [...records].reverse() };
      }

      throw error;
    }
  },

  login: async function (email, password) {
    try {
      return await this.fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch (error) {
      if (error.message === 'Oops! Incorrect password. Please try again.' || error.message === 'Invalid credentials') {
        throw error;
      }
      console.warn('Login failed, checking local fallback:', error);

      // Offline fallback: Check local storage
      let storage = JSON.parse(localStorage.getItem('CJ_DB')) || {};
      const users = storage['users'] || [];
      const user = users.find(u => u.email === email);

      if (user) {
        if (user.password === password) {
          const { password: _, ...userData } = user;
          return { success: true, message: 'Offline Login Successful!', data: userData };
        } else {
          throw new Error('Oops! Incorrect password. Please try again.');
        }
      }

      throw new Error('Network Error: Make sure your server is running with "node server.js"');
    }
  },

  generatePDFInvoice: function(booking, type = "Standard Booking") {
    if (!window.jspdf) {
      alert("jsPDF library is not loaded properly.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const invoiceId = booking.id || Date.now().toString().slice(-6);
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A';
    const createdAt = booking.created_at ? new Date(booking.created_at).toLocaleDateString() : new Date().toLocaleDateString();
    
    // BRAND COLORS
    const midnight = [20, 27, 45]; // #141b2d
    const neon = [0, 230, 118];    // #00e676
    const muted = [100, 116, 139]; // #64748b

    // Header Background (Full width top bar)
    doc.setFillColor(midnight[0], midnight[1], midnight[2]);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Neon Accent Line
    doc.setFillColor(neon[0], neon[1], neon[2]);
    doc.rect(14, 38, 50, 2, 'F');

    // Logo - TOP RIGHT
    try {
      doc.addImage('logo.jpg', 'JPEG', 155, 5, 35, 35);
    } catch(e) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("CHOLO JAAI", 196, 25, null, null, "right");
    }
    
    // Top Left: INVOICE Title
    doc.setTextColor(neon[0], neon[1], neon[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("INVOICE", 14, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`REFERENCE: #CJ-${invoiceId}`, 14, 33);
    doc.text(`ISSUED ON: ${createdAt}`, 14, 37);

    // Business Header Info
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Cholo Jaai Travel Agency", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Dhaka, Bangladesh", 14, 65);
    doc.text("contact@cholojai.com | www.cholojai.com", 14, 70);

    // Billed To & Trip Info Grid
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 75, 196, 75);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.text("BILLED TO", 14, 88);
    doc.text("TRIP SUMMARY", 120, 88);
    
    doc.setDrawColor(neon[0], neon[1], neon[2]);
    doc.setLineWidth(0.8);
    doc.line(14, 90, 25, 90);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${booking.name || 'Valued Customer'}`, 14, 98);
    doc.text(`${booking.email || ''}`, 14, 104);
    doc.text(`${booking.mobile || booking.phone || ''}`, 14, 110);
    
    doc.text(`Status: ${booking.status || 'Pending'}`, 120, 98);
    doc.text(`Travel Date: ${dateStr}`, 120, 104);
    doc.text(`Service Type: ${type}`, 120, 110);

    // Table Header
    doc.setFillColor(midnight[0], midnight[1], midnight[2]);
    doc.rect(14, 125, 182, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DESCRIPTION / DESTINATION", 18, 133);
    doc.text("GUESTS", 120, 133);
    doc.text("TOTAL BDT", 160, 133);

    // Table Body
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont("helvetica", "normal");
    doc.text(booking.destination || "Custom Tour Plan", 18, 147);
    doc.text((booking.persons || booking.travelers || "1").toString() + " Person(s)", 120, 147);
    
    const basePrice = booking.budget || (booking.persons ? booking.persons * 4500 : 5000);
    doc.setFont("helvetica", "bold");
    doc.text(`TK ${basePrice.toLocaleString()}`, 160, 147);
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(14, 155, 196, 155);
    
    // Payment Status Badge
    const payment = booking.payment || 'Unpaid';
    doc.setFontSize(10);
    doc.text("PAYMENT STATUS:", 120, 170);
    
    if (payment === 'Paid') {
      doc.setFillColor(220, 252, 231); 
      doc.setTextColor(21, 128, 61);
    } else {
      doc.setFillColor(254, 226, 226);
      doc.setTextColor(185, 28, 28);
    }
    
    doc.roundedRect(160, 164, 36, 8, 2, 2, 'F');
    doc.setFontSize(8);
    doc.text(payment.toUpperCase(), 178, 169.5, null, null, "center");

    // Grand Total Box
    doc.setFillColor(midnight[0], midnight[1], midnight[2]);
    doc.roundedRect(120, 185, 76, 32, 4, 4, 'F');
    
    doc.setTextColor(neon[0], neon[1], neon[2]);
    doc.setFontSize(11);
    doc.text("GRAND TOTAL", 125, 196);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(`TK ${basePrice.toLocaleString()}`, 190, 208, null, null, "right");

    // Terms
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 14, 230);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.text("1. All bookings are subject to our general terms of service.", 14, 238);
    doc.text("2. Please present this computer-generated invoice at arrival.", 14, 243);
    doc.text("3. Cancellations must be made at least 48 hours in advance.", 14, 248);

    // Branded Footer Bar
    doc.setFillColor(neon[0], neon[1], neon[2]);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("THANK YOU FOR TRAVELING WITH CHOLO JAAI!", 105, 293, null, null, "center");

    // Open PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
  APP.initLayout();
});
