/* ==========================================================================
   Retro OS v1.80 - Portfolio Main Application (Vanilla JS)
   ========================================================================== */

// ============================================================
// Blog posts metadata
// ============================================================
const BLOG_POSTS = [
  { id: "1", title: "RQuickShareを使って簡単にファイル共有", date: "2024-12-20", author: "Haruki Saito", fileName: "rquick.md" },
  { id: "2", title: "Linuxディストリビューションについての話", date: "2024-12-19", author: "haruki saito", fileName: "aboutlinux.md" },
  { id: "3", title: "Homepageの更新をしました", date: "2024-12-18", author: "haruki saito", fileName: "firstpost.md" },
];

// ============================================================
// State
// ============================================================
let activeWindowId = 'win-welcome';
let activeMenu = null; // 'file' | 'view' | null

const windowState = {
  'win-welcome':  { open: true,  pos: { top: '8%',  left: '15%' }, size: { w: '550px', h: 'auto' }, maximized: false, statusLeft: 'SYS.STATUS: ONLINE' },
  'win-profile':  { open: false, pos: { top: '15%', left: '32%' }, size: { w: '500px', h: 'auto' }, maximized: false, statusLeft: 'SYS.STATUS: ONLINE' },
  'win-projects': { open: false, pos: { top: '22%', left: '18%' }, size: { w: '600px', h: 'auto' }, maximized: false, statusLeft: 'Total items: 2' },
  'win-blog':     { open: false, pos: { top: '28%', left: '23%' }, size: { w: '650px', h: '460px' }, maximized: false, statusLeft: 'Articles: 3' },
  'win-contact':  { open: false, pos: { top: '35%', left: '38%' }, size: { w: '520px', h: 'auto' }, maximized: false, statusLeft: 'Baud: 9600 bps', statusRight: 'ONLINE' },
};

// ============================================================
// System Clock
// ============================================================
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('system-clock').textContent = `${String(h).padStart(2,'0')}:${m}:${s} ${ampm}`;
}

// ============================================================
// Dark Mode
// ============================================================
function applyTheme(dark) {
  if (dark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function toggleThemeMode() {
  const isDark = document.body.classList.contains('dark-mode');
  applyTheme(!isDark);
  localStorage.setItem('themeMode', !isDark ? 'dark' : 'light');
  closeMenu();
}

// ============================================================
// CRT Scanlines
// ============================================================
let scanlinesOff = false;
function toggleScanlines() {
  scanlinesOff = !scanlinesOff;
  document.getElementById('crt-screen').classList.toggle('no-scanlines', scanlinesOff);
  closeMenu();
}

// ============================================================
// Menu Bar
// ============================================================
function openMenu(menuType, e) {
  e.stopPropagation();
  if (activeMenu === menuType) {
    closeMenu();
    return;
  }
  activeMenu = menuType;
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  document.getElementById('menu-' + menuType).classList.add('active');
}

function closeMenu() {
  activeMenu = null;
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
}

// ============================================================
// Window Management
// ============================================================
function openWindow(id) {
  const state = windowState[id];
  if (!state) return;
  state.open = true;
  renderWindow(id);
  focusWindow(id);
  closeMenu();
}

function closeWindow(id) {
  const state = windowState[id];
  if (!state) return;
  state.open = false;
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function focusWindow(id) {
  activeWindowId = id;
  document.querySelectorAll('.window').forEach(w => {
    w.classList.remove('active-window');
    w.style.zIndex = 5;
  });
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active-window');
    el.style.zIndex = 100;
  }
}

function maximizeWindow(id) {
  const state = windowState[id];
  const el = document.getElementById(id);
  if (!state || !el) return;

  state.maximized = !state.maximized;
  if (state.maximized) {
    el.classList.add('window-maximized');
    el.style.top = '32px';
    el.style.left = '0px';
    el.style.width = '100vw';
    el.style.height = 'calc(100vh - 32px)';
    // hide resize handle
    const rh = el.querySelector('.window-resize-handle');
    if (rh) rh.style.display = 'none';
  } else {
    el.classList.remove('window-maximized');
    el.style.top = state.pos.top;
    el.style.left = state.pos.left;
    el.style.width = state.size.w;
    el.style.height = state.size.h;
    const rh = el.querySelector('.window-resize-handle');
    if (rh) rh.style.display = '';
  }
}

function cleanDesktop() {
  Object.keys(windowState).forEach(id => {
    const state = windowState[id];
    state.open = true;
    state.maximized = false;
    renderWindow(id);
    const el = document.getElementById(id);
    if (el) {
      el.style.top = state.pos.top;
      el.style.left = state.pos.left;
      el.style.width = state.size.w;
      el.style.height = state.size.h;
      el.classList.remove('window-maximized');
      el.style.display = 'flex';
    }
  });
  focusWindow('win-welcome');
  closeMenu();
}

// ============================================================
// Drag & Drop
// ============================================================
function initDrag(windowEl, headerEl, id) {
  headerEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-control-close') || e.target.closest('.window-control-zoom')) return;
    const state = windowState[id];
    if (state.maximized) return;
    if (window.innerWidth <= 768) return;

    e.preventDefault();
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = windowEl.getBoundingClientRect();
    const initLeft = rect.left;
    const initTop = rect.top;

    function onMove(e) {
      const newLeft = initLeft + (e.clientX - startX);
      const newTop = initTop + (e.clientY - startY);
      windowEl.style.left = newLeft + 'px';
      windowEl.style.top = newTop + 'px';
      state.pos.left = newLeft + 'px';
      state.pos.top = newTop + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ============================================================
// Resize
// ============================================================
function initResize(windowEl, handleEl, id) {
  handleEl.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = windowEl.getBoundingClientRect();
    const startW = rect.width;
    const startH = rect.height;
    const state = windowState[id];

    function onMove(e) {
      const newW = Math.max(250, startW + (e.clientX - startX));
      const newH = Math.max(150, startH + (e.clientY - startY));
      windowEl.style.width = newW + 'px';
      windowEl.style.height = newH + 'px';
      state.size.w = newW + 'px';
      state.size.h = newH + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ============================================================
// Window Rendering
// ============================================================
function renderWindow(id) {
  const state = windowState[id];
  let el = document.getElementById(id);

  if (!state.open) {
    if (el) el.style.display = 'none';
    return;
  }

  if (!el) {
    el = createWindowElement(id);
    document.getElementById('desktop').appendChild(el);
  }

  el.style.display = 'flex';
  el.style.top = state.pos.top;
  el.style.left = state.pos.left;
  el.style.width = state.size.w;
  el.style.height = state.size.h;
  el.style.zIndex = activeWindowId === id ? 100 : 5;
}

function createWindowElement(id) {
  const state = windowState[id];
  const titles = {
    'win-welcome':  'Welcome.txt',
    'win-profile':  'Profile.sys',
    'win-projects': 'Projects.exe',
    'win-blog':     'Blog.exe',
    'win-contact':  'Terminal.com',
  };
  const title = titles[id] || id;

  const win = document.createElement('div');
  win.id = id;
  win.className = 'window' + (activeWindowId === id ? ' active-window' : '');
  win.style.cssText = `top:${state.pos.top};left:${state.pos.left};width:${state.size.w};height:${state.size.h};display:flex;z-index:${activeWindowId === id ? 100 : 5};`;

  // Header
  const header = document.createElement('div');
  header.className = 'window-header js-window-drag';

  const closeBtn = document.createElement('div');
  closeBtn.className = 'window-control-close';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(id); });
  closeBtn.addEventListener('mousedown', (e) => e.stopPropagation());

  const titleSpan = document.createElement('span');
  titleSpan.className = 'window-title system-mono';
  titleSpan.textContent = title;

  const zoomBtn = document.createElement('div');
  zoomBtn.className = 'window-control-zoom';
  zoomBtn.title = 'Zoom';
  zoomBtn.addEventListener('click', (e) => { e.stopPropagation(); maximizeWindow(id); focusWindow(id); });
  zoomBtn.addEventListener('mousedown', (e) => e.stopPropagation());

  header.appendChild(closeBtn);
  header.appendChild(titleSpan);
  header.appendChild(zoomBtn);

  // Body
  const body = document.createElement('div');
  body.className = 'window-body' + (id === 'win-blog' ? ' blog-body' : '') + (id === 'win-contact' ? '' : '');
  body.innerHTML = getWindowContent(id);

  // Status Bar
  const status = document.createElement('div');
  status.className = 'window-status system-mono';
  const leftSpan = document.createElement('span');
  leftSpan.textContent = state.statusLeft || 'SYS.STATUS: ONLINE';
  status.appendChild(leftSpan);
  if (state.statusRight) {
    const rightSpan = document.createElement('span');
    rightSpan.textContent = state.statusRight;
    status.appendChild(rightSpan);
  }
  // Resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'window-resize-handle';
  status.appendChild(resizeHandle);

  win.appendChild(header);
  win.appendChild(body);
  win.appendChild(status);

  // Event listeners
  win.addEventListener('mousedown', () => focusWindow(id));
  initDrag(win, header, id);
  initResize(win, resizeHandle, id);

  // Post-mount initialization
  if (id === 'win-blog') {
    initBlog(body);
  } else if (id === 'win-contact') {
    initTerminal(body);
  }

  return win;
}

// ============================================================
// Window Content HTML
// ============================================================
function getWindowContent(id) {
  switch(id) {
    case 'win-welcome':  return getWelcomeHTML();
    case 'win-profile':  return getProfileHTML();
    case 'win-projects': return getProjectsHTML();
    case 'win-blog':     return getBlogHTML();
    case 'win-contact':  return getTerminalHTML();
    default: return '';
  }
}

function getWelcomeHTML() {
  return `
    <div class="hero-section">
      <div class="badge system-mono">SYSTEM READY // PORTFOLIO v1.80</div>
      <div class="title-area">
        <h1 class="display-title">HELLO, I AM <span class="accent-text">JUSTCAT</span>.</h1>
      </div>
      <p class="body-text">
        琉球大学理学部で地球科学（Geoscience）を専攻するB3学生であるクリエイター「JustCat」（齋藤 遼樹）のデジタルスペースへようこそ。画面上のウィンドウをドラッグして、私の世界を探検してください。
      </p>
      <div class="hero-cta-wrapper">
        <button class="retro-btn primary-btn" onclick="openWindow('win-projects')">作品を見る (Projects.exe)</button>
      </div>
    </div>
  `;
}

function getProfileHTML() {
  return `
    <div class="profile-layout">
      <div class="profile-avatar-container">
        <svg class="avatar-svg" width="96" height="96" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="12" height="12" fill="var(--bg-window)"/>
          <rect x="3" y="1" width="6" height="3" fill="var(--color-text)"/>
          <rect x="2" y="2" width="8" height="4" fill="var(--color-text)"/>
          <rect x="3" y="4" width="6" height="4" fill="var(--bg-canvas)"/>
          <rect x="4" y="8" width="4" height="1" fill="var(--bg-canvas)"/>
          <rect x="4" y="5" width="1" height="1" fill="var(--color-accent)"/>
          <rect x="7" y="5" width="1" height="1" fill="var(--color-accent)"/>
          <rect x="2" y="9" width="8" height="3" fill="var(--color-accent)"/>
          <rect x="4" y="9" width="4" height="1" fill="var(--color-text)"/>
        </svg>
        <span class="system-mono user-tag">USER: JUSTCAT</span>
      </div>
      <div class="profile-details">
        <h2 class="section-title">CREATOR STATUS</h2>
        <table class="status-table system-mono">
          <tbody>
            <tr><td>NAME:</td><td>齋藤 遼樹 (HARUKI SAITO)</td></tr>
            <tr><td>CLASS:</td><td>GEOSCIENCE B3</td></tr>
            <tr><td>SKILLS:</td><td>JAVA, HTML/CSS, JAVASCRIPT</td></tr>
            <tr><td>GENDER:</td><td>XGENDER</td></tr>
            <tr><td>LOCATION:</td><td>OKINAWA, JAPAN</td></tr>
          </tbody>
        </table>
        <p class="body-text profile-bio">
          琉球大学で地球科学を学びつつ、プログラミングや個人でのものづくりに励んでいます。レトロなテクノロジーと科学の融合に情熱を注いでいます。
        </p>
      </div>
    </div>
  `;
}

function getProjectsHTML() {
  return `
    <div>
      <h2 class="section-title">SELECTED ARCHIVES</h2>
      <div class="projects-grid">
        <article class="project-card">
          <div class="project-meta system-mono"><span>ID: 001</span><span>YEAR: 202X</span></div>
          <h3 class="project-title">JUST TIMER (CHROME EXTENSION)</h3>
          <p class="project-desc body-text">
            シンプルさを追求したChrome拡張機能タイマー。タイマーの追加・削除、個別のカウントダウン機能、終了アラーム音、および目立たない現在時刻表示機能を搭載。
          </p>
          <a href="https://chromewebstore.google.com/detail/justtimer/ddcebdiijkmpcgpaomapcnfmdnlbjigg" target="_blank" rel="noopener noreferrer" class="project-link system-mono">&gt; VISIT CHROME WEB STORE</a>
        </article>
        <article class="project-card">
          <div class="project-meta system-mono"><span>ID: 002</span><span>YEAR: 2026</span></div>
          <h3 class="project-title">RETRO OS PORTFOLIO</h3>
          <p class="project-desc body-text">
            80年代のClassic GUI OSを模した、インタラクティブなポートフォリオWebサイト。CRT走査線エフェクト、重ね合わせウィンドウ、BBS風ターミナルを搭載。
          </p>
          <a href="https://github.com/JustCat3456/JustCat3456.github.io" target="_blank" rel="noopener noreferrer" class="project-link system-mono">&gt; VISIT SOURCE</a>
        </article>
      </div>
    </div>
  `;
}

function getBlogHTML() {
  const sidebarItems = BLOG_POSTS.map(p => `
    <div class="blog-item" data-post-id="${p.id}">
      <div class="blog-item-title">${p.title}</div>
      <div class="blog-item-date">${p.date}</div>
    </div>
  `).join('');

  return `
    <div class="blog-layout">
      <aside class="blog-sidebar system-mono" id="blog-sidebar">
        ${sidebarItems}
      </aside>
      <section class="blog-content-pane" id="blog-content">
        <div class="system-mono">記事を選択してください...</div>
      </section>
    </div>
  `;
}

function getTerminalHTML() {
  return `
    <div class="terminal-body">
      <div class="terminal-output system-mono" id="terminal-output">
        <div class="terminal-line text-muted">RetroOS Terminal v1.80 [BBS Client Mode]</div>
        <div class="terminal-line text-muted">Type 'help' to list available commands.</div>
        <div class="terminal-line">Guest node connected from remote host...</div>
        <div class="terminal-line">Welcome! Please type your name to leave a message.</div>
        <div id="terminal-output-end"></div>
      </div>
      <form class="terminal-input-area" id="terminal-form" autocomplete="off">
        <span class="terminal-prompt system-mono">&gt;</span>
        <input type="text" id="terminal-input" class="terminal-input system-mono" placeholder="Type here..." autofocus />
      </form>
    </div>
  `;
}

// ============================================================
// Blog Logic
// ============================================================
function initBlog(bodyEl) {
  const sidebar = bodyEl.querySelector('#blog-sidebar');
  const contentPane = bodyEl.querySelector('#blog-content');

  // Select first post
  loadBlogPost(BLOG_POSTS[0], sidebar, contentPane);

  sidebar.querySelectorAll('.blog-item').forEach(item => {
    item.addEventListener('click', () => {
      const postId = item.dataset.postId;
      const post = BLOG_POSTS.find(p => p.id === postId);
      if (post) loadBlogPost(post, sidebar, contentPane);
    });
  });
}

function loadBlogPost(post, sidebar, contentPane) {
  // Update active state in sidebar
  sidebar.querySelectorAll('.blog-item').forEach(item => {
    item.classList.toggle('active-post', item.dataset.postId === post.id);
  });

  contentPane.innerHTML = '<div class="system-mono">LOADING ARTICLE...</div>';

  fetch(`posts/${post.fileName}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load');
      return res.text();
    })
    .then(text => {
      const cleanMd = text.replace(/^---[\s\S]*?---/, '').trim();
      const html = marked.parse(cleanMd);
      contentPane.innerHTML = `
        <h1 class="blog-content-title">${post.title}</h1>
        <div class="blog-content-meta">Date: ${post.date} | Author: ${post.author}</div>
        <div class="blog-content-body">${html}</div>
      `;
    })
    .catch(() => {
      contentPane.innerHTML = `<p class="system-mono" style="color:red;">ERROR: 記事の読み込みに失敗しました。</p>`;
    });
}

// ============================================================
// Terminal Logic
// ============================================================
function initTerminal(bodyEl) {
  const form = bodyEl.querySelector('#terminal-form');
  const input = bodyEl.querySelector('#terminal-input');
  const output = bodyEl.querySelector('#terminal-output');
  const outputEnd = bodyEl.querySelector('#terminal-output-end');

  function appendLine(text, type = 'normal') {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    if (type === 'muted') div.classList.add('text-muted');
    if (type === 'accent') div.classList.add('accent-text');
    if (type === 'error') div.style.color = 'red';

    if (text.startsWith('> ')) {
      div.innerHTML = `<span class="terminal-prompt">&gt;</span> ${text.substring(2)}`;
    } else {
      div.textContent = text;
    }

    output.insertBefore(div, outputEnd);
    outputEnd.scrollIntoView({ behavior: 'smooth' });
  }

  function parseCommand(cmd, original, args) {
    if (cmd === 'help') {
      appendLine('Available commands:');
      appendLine('  about    - Show profile summary', 'accent');
      appendLine('  projects - List recent creative archives', 'accent');
      appendLine('  blog     - List recent blog posts', 'accent');
      appendLine('  blog [id]- View blog post details (e.g. blog 1)', 'accent');
      appendLine('  contact  - Instructions to send mail', 'accent');
      appendLine('  clear    - Clear the screen', 'accent');
      appendLine('  mail [msg]- Simulate sending a message', 'accent');
    } else if (cmd === 'about') {
      appendLine('--- JustCat (Haruki Saito) ---');
      appendLine('Geoscience B3 student at University of the Ryukyus.');
      appendLine('Passionate about programming and earth sciences.');
      appendLine('Skills: Java, HTML/CSS, Vanilla JavaScript.');
    } else if (cmd === 'projects') {
      appendLine('--- Creative Archives ---');
      appendLine('1. Just Timer [202X] - Chrome Extension');
      appendLine('2. Retro OS Portfolio [2026] - 80s OS Style');
      appendLine('Try checking out the "Projects.exe" window for details!');
    } else if (cmd === 'blog') {
      if (args.length === 1) {
        appendLine('--- Recent Blog Posts ---');
        BLOG_POSTS.forEach(p => appendLine(`[${p.id}] ${p.title} (${p.date})`));
        appendLine('Type "blog [ID]" to read a specific post (e.g., blog 1)');
      } else {
        const targetId = args[1];
        const post = BLOG_POSTS.find(p => p.id === targetId);
        if (post) {
          appendLine('Connecting to file server...');
          fetch(`posts/${post.fileName}`)
            .then(res => { if (!res.ok) throw new Error(); return res.text(); })
            .then(text => {
              appendLine(`=== ${post.title} ===`);
              appendLine(`Date: ${post.date} | Author: ${post.author}`);
              appendLine('--------------------------------------------');
              const cleanMd = text.replace(/^---[\s\S]*?---/, '').trim();
              const plain = cleanMd
                .replace(/#+\s+(.*)/g, '\n=== $1 ===\n')
                .replace(/-\s+/g, '• ')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .trim();
              plain.split('\n').forEach(line => appendLine(line));
            })
            .catch(() => appendLine('Error: Failed to fetch post content.', 'error'));
        } else {
          appendLine(`Error: Post ID "${targetId}" not found.`, 'error');
        }
      }
    } else if (cmd === 'contact') {
      appendLine('To send a message, please use:');
      appendLine('  mail [Your Message Here]');
      appendLine('Example: mail Hello, I love this 80s OS style!', 'muted');
    } else if (cmd === 'clear') {
      output.querySelectorAll('.terminal-line').forEach(l => l.remove());
    } else if (cmd === 'mail') {
      const message = original.substring(5).trim();
      if (!message) {
        appendLine('Error: Mail message is empty.', 'error');
      } else {
        appendLine('Connecting to server...');
        setTimeout(() => {
          appendLine('Sending payload packet...');
          setTimeout(() => appendLine('SUCCESS: Mail sent! Thank you for your feedback.', 'accent'), 500);
        }, 500);
      }
    } else {
      appendLine(`Command not found: "${cmd}". Type 'help' for command list.`);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    appendLine(`> ${query}`, 'user-query');
    input.value = '';
    const cmd = query.toLowerCase().split(/\s+/)[0];
    const args = query.trim().split(/\s+/);
    parseCommand(cmd, query, args);
  });
}

// ============================================================
// Desktop Icons
// ============================================================
function createDesktopIcons() {
  const icons = [
    {
      id: 'win-welcome', label: 'Welcome.txt',
      svg: `<svg class="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 1h6l4 4v10H3V1z" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1.2" style="shape-rendering:crispEdges"/>
        <path d="M9 1v4h4" fill="none" stroke="var(--color-text)" stroke-width="1.2" style="shape-rendering:crispEdges"/>
        <path d="M5 6h6M5 8h6M5 10h6M5 12h4" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
      </svg>`
    },
    {
      id: 'win-profile', label: 'Profile.sys',
      svg: `<svg class="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 頭 -->
        <rect x="5" y="1" width="6" height="5" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <!-- 目 -->
        <rect x="6" y="3" width="1" height="1" fill="var(--color-accent)" style="shape-rendering:crispEdges"/>
        <rect x="9" y="3" width="1" height="1" fill="var(--color-accent)" style="shape-rendering:crispEdges"/>
        <!-- 胴体 -->
        <rect x="4" y="6" width="8" height="5" fill="var(--color-accent)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <!-- 左腕 -->
        <rect x="2" y="6" width="2" height="4" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <!-- 右腕 -->
        <rect x="12" y="6" width="2" height="4" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <!-- 左足 -->
        <rect x="5" y="11" width="2" height="4" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <!-- 右足 -->
        <rect x="9" y="11" width="2" height="4" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
      </svg>`
    },
    {
      id: 'win-projects', label: 'Projects.exe',
      svg: `<svg class="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3h5l2 2h7v9H1V3z" fill="var(--bg-window)" stroke="var(--color-text)" stroke-width="1.2" style="shape-rendering:crispEdges"/>
        <rect x="3" y="6" width="10" height="6" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
      </svg>`
    },
    {
      id: 'win-blog', label: 'Blog.exe',
      svg: `<svg class="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="1" width="12" height="14" fill="var(--bg-canvas)" stroke="var(--color-text)" stroke-width="1.2" style="shape-rendering:crispEdges"/>
        <line x1="5" y1="4" x2="11" y2="4" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <line x1="5" y1="6" x2="11" y2="6" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <line x1="5" y1="10" x2="9" y2="10" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <rect x="11" y="9" width="2" height="4" fill="var(--color-accent)"/>
      </svg>`
    },
    {
      id: 'win-contact', label: 'Terminal.com',
      svg: `<svg class="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="12" height="9" fill="var(--bg-window)" stroke="var(--color-text)" stroke-width="1.2" style="shape-rendering:crispEdges"/>
        <rect x="4" y="4" width="8" height="5" fill="#1A1A18" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <path d="M5 5.5l1 1-1 1" stroke="var(--color-accent)" stroke-width="1" fill="none" style="shape-rendering:crispEdges"/>
        <path d="M6 11l-1 2h6l-1-2" fill="var(--bg-window)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
        <rect x="2" y="13" width="12" height="2" fill="var(--bg-window)" stroke="var(--color-text)" stroke-width="1" style="shape-rendering:crispEdges"/>
      </svg>`
    },
  ];

  const container = document.querySelector('.desktop-icons');
  icons.forEach(({ id, label, svg }) => {
    const btn = document.createElement('button');
    btn.className = 'shortcut-icon';
    btn.innerHTML = `<div class="icon-visual">${svg}</div><div class="icon-label">${label}</div>`;
    btn.addEventListener('click', () => openWindow(id));
    container.appendChild(btn);
  });
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const savedTheme = localStorage.getItem('themeMode');
  applyTheme(savedTheme === 'dark');

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Menu bar clicks
  document.getElementById('menu-trigger-file').addEventListener('click', (e) => openMenu('file', e));
  document.getElementById('menu-trigger-view').addEventListener('click', (e) => openMenu('view', e));
  document.addEventListener('click', () => closeMenu());

  // Desktop icons
  createDesktopIcons();

  // Initial window (welcome)
  renderWindow('win-welcome');
});
