/* ==========================================================================
   PawsHope — Donor Dashboard JS
   Module switching, sidebar toggle, counters, logout, interactions
   ========================================================================== */


document.addEventListener("DOMContentLoaded", () => {

    const currentUser = JSON.parse(
        sessionStorage.getItem("stacklyCurrentUser")
    );

    if (!currentUser) {
        return;
    }

    /* =========================================
       DYNAMIC PROFILE NAME
    ========================================= */

    document.querySelectorAll(".profileName").forEach(element => {
        element.textContent = currentUser.name || "User";
    });


    /* =========================================
       DYNAMIC AVATAR LETTER
    ========================================= */

    const firstLetter = currentUser.name
        ? currentUser.name.trim().charAt(0).toUpperCase()
        : "?";

    document.querySelectorAll(".avatarLetter").forEach(element => {
        element.textContent = firstLetter;
    });

});

// =============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Sidebar toggle (mobile) ---- */
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var toggle  = document.getElementById('menuToggle');
  var closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ---- Module switching ---- */
  var navItems = document.querySelectorAll('.nav-item[data-module]');
  var modules  = document.querySelectorAll('.module');
  var topTitle = document.getElementById('topbarTitle');
  var titleMap = {
    overview: 'Overview', donate: 'Make a Donation', history: 'Donation History',
    campaigns: 'Active Campaigns', impact: 'My Impact', profile: 'Profile & Settings'
  };

  function switchModule(name) {
    navItems.forEach(function (n) { n.classList.remove('active'); });
    modules.forEach(function (m) { m.classList.remove('active'); });
    var navEl = document.querySelector('.nav-item[data-module="' + name + '"]');
    var modEl = document.getElementById('m-' + name);
    if (navEl) navEl.classList.add('active');
    if (modEl) {
      modEl.classList.add('active');
      modEl.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.remove('visible');
      });
      requestAnimationFrame(function () { triggerReveal(); });
    }
    if (topTitle) topTitle.textContent = titleMap[name] || 'Dashboard';
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      switchModule(item.getAttribute('data-module'));
    });
  });

  /* link-btn that switch module */
  document.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      switchModule(el.getAttribute('data-go'));
    });
  });

  /* ---- Reveal observer ---- */
  var revealEls = document.querySelectorAll('.reveal');
  function triggerReveal() {
    revealEls.forEach(function (el) {
      if (el.closest('.module.active')) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 80) el.classList.add('visible');
      }
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }
  /* trigger visible state for active module on load */
  setTimeout(triggerReveal, 100);

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounters() {
    counters.forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1600, t0 = null;
      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(ease * target);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      }
      requestAnimationFrame(tick);
    });
  }
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); cObs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else { runCounters(); }

  /* ---- Amount buttons ---- */
  var amountBtns = document.querySelectorAll('.amount-btn');
  var donateSubmit = document.getElementById('donateSubmit');
  var currentAmount = 25;
  amountBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      amountBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var val = btn.textContent.trim();
      if (val === 'Custom') {
        var input = prompt('Enter custom amount ($):', '75');
        if (input) { currentAmount = parseInt(input, 10) || 75; btn.textContent = '$' + currentAmount; }
      } else {
        currentAmount = parseInt(val.replace('$', ''), 10) || 25;
      }
      if (donateSubmit) donateSubmit.textContent = 'Donate $' + currentAmount + ' Now \u2764';
    });
  });

  /* ---- Frequency toggle ---- */
  var freqBtns = document.querySelectorAll('.freq-btn');
  freqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      freqBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  /* ---- Donate submit (demo) ---- */
  if (donateSubmit) {
    donateSubmit.addEventListener('click', function () {
      this.textContent = 'Processing...';
      var self = this;
      setTimeout(function () {
        self.textContent = 'Thank You! \u2764';
        self.style.background = 'linear-gradient(135deg,#18B7A0,#0E5A66)';
        showToast('Donation of $' + currentAmount + ' received! Thank you \u2764');
        setTimeout(function () {
          self.textContent = 'Donate $' + currentAmount + ' Now \u2764';
          self.style.background = '';
        }, 3000);
      }, 1200);
    });
  }

  /* ---- Save profile ---- */
  var saveProfile = document.getElementById('saveProfile');
  if (saveProfile) {
    saveProfile.addEventListener('click', function () {
      this.textContent = 'Saving...';
      var self = this;
      setTimeout(function () {
        self.textContent = 'Saved!';
        showToast('Profile updated successfully');
        setTimeout(function () { self.textContent = 'Save Changes'; }, 2000);
      }, 800);
    });
  }

  /* ---- History search/filter ---- */
  var searchInput = document.getElementById('historySearch');
  var filterSel = document.getElementById('historyFilter');
  var historyBody = document.getElementById('historyBody');
  if (searchInput && historyBody) {
    function filterRows() {
      var q = searchInput.value.toLowerCase();
      var rows = historyBody.querySelectorAll('tr');
      rows.forEach(function (row) {
        var text = row.textContent.toLowerCase();
        row.style.display = text.indexOf(q) > -1 ? '' : 'none';
      });
    }
    searchInput.addEventListener('input', filterRows);
    if (filterSel) filterSel.addEventListener('change', filterRows);
  }

  /* ---- Campaign donate buttons ---- */
  document.querySelectorAll('.btn-card').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.campaign-card');
      var title = card.querySelector('h3').textContent;
      switchModule('donate');
      showToast('Selected: ' + title);
    });
  });

  /* ---- Logout modal ---- */
  var logoutBtn = document.getElementById('logoutBtn');
  var logoutModal = document.getElementById('logoutModal');
  var logoutCancel = document.getElementById('logoutCancel');
  var logoutConfirm = document.getElementById('logoutConfirm');

  if (logoutBtn) logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    logoutModal.classList.add('show');
  });
  if (logoutCancel) logoutCancel.addEventListener('click', function () {
    logoutModal.classList.remove('show');
  });
  if (logoutConfirm) logoutConfirm.addEventListener('click', function () {
    logoutModal.classList.remove('show');
    showToast('Logged out. Redirecting...');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1500);
  });
  if (logoutModal) logoutModal.addEventListener('click', function (e) {
    if (e.target === logoutModal) logoutModal.classList.remove('show');
  });

  /* ---- Toast ---- */
  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#0B1F2A;color:#fff;padding:16px 24px;border-radius:14px;font-family:Manrope,sans-serif;font-weight:600;font-size:14px;box-shadow:0 12px 32px rgba(0,0,0,.25);z-index:3000;opacity:0;transform:translateY(20px);transition:all .35s cubic-bezier(.22,1,.36,1);';
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(function () { toast.remove(); }, 400);
    }, 2800);
  }

  /* ---- Escape closes sidebar/modal ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSidebar();
      if (logoutModal) logoutModal.classList.remove('show');
    }
  });

});
