import React, { useState, useEffect } from 'react';
import Window from './components/Window';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Terminal from './components/Terminal';

export default function App() {
  const [activeWindowId, setActiveWindowId] = useState('win-welcome');
  const [openWindows, setOpenWindows] = useState({
    'win-welcome': true,
    'win-profile': false,
    'win-projects': false,
    'win-blog': false,
    'win-contact': false
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [noScanlines, setNoScanlines] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null); // 'file' | 'view' | null
  const [timeStr, setTimeStr] = useState('12:00:00 AM');

  // システム時計
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = String(hours).padStart(2, '0');
      setTimeStr(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ダークモード適用と復元
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleThemeMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('themeMode', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('themeMode', 'light');
    }
  };

  const openWindow = (id) => {
    setOpenWindows(prev => ({ ...prev, [id]: true }));
    setActiveWindowId(id);
  };

  const closeWindow = (id) => {
    setOpenWindows(prev => ({ ...prev, [id]: false }));
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
  };

  const cleanDesktop = () => {
    setOpenWindows({
      'win-welcome': true,
      'win-profile': true,
      'win-projects': true,
      'win-blog': true,
      'win-contact': true
    });
    setResetTrigger(prev => prev + 1);
  };

  // メニュー以外のクリックでメニューを閉じる
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenu(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [activeMenu]);

  const handleMenuClick = (menuType, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuType ? null : menuType);
  };

  return (
    <>
      {/* CRTモニターシミュレーション層 */}
      <div className={`crt-screen ${noScanlines ? 'no-scanlines' : ''}`} />
      <div className="crt-bezel" />

      <div className="os-container">
        {/* 上部OSシステムメニューバー */}
        <header className="menu-bar">
          <div className="menu-left">
            <span className="menu-brand">
              <svg className="pixel-icon icon-floppy" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1h8l2 2v8H1V1z" fill="var(--bg-canvas)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                <rect x="3" y="1" width="5" height="3" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                <rect x="3" y="7" width="6" height="4" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                <rect x="7" y="8" width="1" height="2" fill="var(--color-muted)" style={{ shapeRendering: 'crispEdges' }} />
              </svg>
              RetroOS
            </span>
            <nav className="menu-nav">
              <div className={`menu-item ${activeMenu === 'file' ? 'active' : ''}`}>
                <span className="menu-trigger" onClick={(e) => handleMenuClick('file', e)}>File</span>
                <div className="dropdown">
                  <button onClick={() => openWindow('win-welcome')}>Welcome.txt</button>
                  <button onClick={() => openWindow('win-profile')}>Profile.sys</button>
                  <button onClick={() => openWindow('win-projects')}>Projects.exe</button>
                  <button onClick={() => openWindow('win-blog')}>Blog.exe</button>
                  <button onClick={() => openWindow('win-contact')}>Terminal.com</button>
                </div>
              </div>
              <div className={`menu-item ${activeMenu === 'view' ? 'active' : ''}`}>
                <span className="menu-trigger" onClick={(e) => handleMenuClick('view', e)}>View</span>
                <div className="dropdown">
                  <button onClick={cleanDesktop}>Clean Desktop</button>
                  <button onClick={() => setNoScanlines(!noScanlines)}>Toggle CRT Scanline</button>
                  <button onClick={toggleThemeMode}>Toggle Dark Mode</button>
                </div>
              </div>
            </nav>
          </div>
          <div className="menu-right">
            <span id="system-clock" className="system-mono">{timeStr}</span>
          </div>
        </header>

        {/* デスクトップ本体 */}
        <main className="desktop" id="desktop">
          {/* デスクトップのショートカットアイコン */}
          <div className="desktop-icons">
            <button className="shortcut-icon" onClick={() => openWindow('win-welcome')}>
              <div className="icon-visual">
                <svg className="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 1h6l4 4v10H3V1z" fill="var(--bg-canvas)" stroke="var(--color-text)" strokeWidth="1.2" style={{ shapeRendering: 'crispEdges' }} />
                  <path d="M9 1v4h4" fill="none" stroke="var(--color-text)" strokeWidth="1.2" style={{ shapeRendering: 'crispEdges' }} />
                  <path d="M5 6h6M5 8h6M5 10h6M5 12h4" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                </svg>
              </div>
              <div className="icon-label">Welcome.txt</div>
            </button>

            <button className="shortcut-icon" onClick={() => openWindow('win-profile')}>
              <div className="icon-visual">
                <svg className="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="12" height="12" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1.2" style={{ shapeRendering: 'crispEdges' }} />
                  <rect x="5" y="5" width="6" height="6" fill="var(--bg-canvas)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <circle cx="8" cy="8" r="1.5" fill="var(--color-accent)" />
                </svg>
              </div>
              <div className="icon-label">Profile.sys</div>
            </button>

            <button className="shortcut-icon" onClick={() => openWindow('win-projects')}>
              <div className="icon-visual">
                <svg className="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3h5l2 2h7v9H1V3z" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1.2" style={{ shapeRendering: 'crispEdges' }} />
                  <rect x="3" y="6" width="10" height="6" fill="var(--bg-canvas)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                </svg>
              </div>
              <div className="icon-label">Projects.exe</div>
            </button>

            <button className="shortcut-icon" onClick={() => openWindow('win-blog')}>
              <div className="icon-visual">
                <svg className="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="1" width="12" height="14" fill="var(--bg-canvas)" stroke="var(--color-text)" strokeWidth="1.2" style={{ shapeRendering: 'crispEdges' }} />
                  <line x1="5" y1="4" x2="11" y2="4" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <line x1="5" y1="6" x2="11" y2="6" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <line x1="5" y1="8" x2="11" y2="8" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <line x1="5" y1="10" x2="9" y2="10" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <rect x="11" y="9" width="2" height="4" fill="var(--color-accent)" />
                </svg>
              </div>
              <div className="icon-label">Blog.exe</div>
            </button>

            <button className="shortcut-icon" onClick={() => openWindow('win-contact')}>
              <div className="icon-visual">
                <svg className="pixel-icon" width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="12" height="9" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1.2" style={{ shapeRendering: 'crispEdges' }} />
                  <rect x="4" y="4" width="8" height="5" fill="#1A1A18" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <path d="M5 5.5l1 1-1 1" stroke="var(--color-accent)" strokeWidth="1" fill="none" style={{ shapeRendering: 'crispEdges' }} />
                  <path d="M6 11l-1 2h6l-1-2" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                  <rect x="2" y="13" width="12" height="2" fill="var(--bg-window)" stroke="var(--color-text)" strokeWidth="1" style={{ shapeRendering: 'crispEdges' }} />
                </svg>
              </div>
              <div className="icon-label">Terminal.com</div>
            </button>
          </div>

          {/* 各ウィンドウのレンダリング */}
          <Window
            id="win-welcome"
            title="Welcome.txt"
            isOpen={openWindows['win-welcome']}
            onClose={closeWindow}
            activeWindowId={activeWindowId}
            onFocus={focusWindow}
            defaultPos={{ top: '8%', left: '15%' }}
            defaultSize={{ width: '550px', height: 'auto' }}
            resetTrigger={resetTrigger}
            statusLeft="SYS.STATUS: ONLINE"
          >
            <Welcome onOpenProjects={() => openWindow('win-projects')} />
          </Window>

          <Window
            id="win-profile"
            title="Profile.sys"
            isOpen={openWindows['win-profile']}
            onClose={closeWindow}
            activeWindowId={activeWindowId}
            onFocus={focusWindow}
            defaultPos={{ top: '15%', left: '32%' }}
            defaultSize={{ width: '500px', height: 'auto' }}
            resetTrigger={resetTrigger}
            statusLeft="SYS.STATUS: ONLINE"
          >
            <Profile />
          </Window>

          <Window
            id="win-projects"
            title="Projects.exe"
            isOpen={openWindows['win-projects']}
            onClose={closeWindow}
            activeWindowId={activeWindowId}
            onFocus={focusWindow}
            defaultPos={{ top: '22%', left: '18%' }}
            defaultSize={{ width: '600px', height: 'auto' }}
            resetTrigger={resetTrigger}
            statusLeft="Total items: 2"
          >
            <Projects />
          </Window>

          <Window
            id="win-blog"
            title="Blog.exe"
            isOpen={openWindows['win-blog']}
            onClose={closeWindow}
            activeWindowId={activeWindowId}
            onFocus={focusWindow}
            defaultPos={{ top: '28%', left: '23%' }}
            defaultSize={{ width: '650px', height: 'auto' }}
            resetTrigger={resetTrigger}
            statusLeft="Articles: 3"
          >
            <Blog />
          </Window>

          <Window
            id="win-contact"
            title="Terminal.com"
            isOpen={openWindows['win-contact']}
            onClose={closeWindow}
            activeWindowId={activeWindowId}
            onFocus={focusWindow}
            defaultPos={{ top: '35%', left: '38%' }}
            defaultSize={{ width: '520px', height: 'auto' }}
            resetTrigger={resetTrigger}
            statusLeft="Baud: 9600 bps"
            statusRight="ONLINE"
          >
            <Terminal />
          </Window>
        </main>
      </div>
    </>
  );
}
