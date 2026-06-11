/* ==========================================================================
   Retro 80s GUI Portfolio - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    initDraggableWindows();
    initZoomWindows();
    initTerminal();
    initSystemMenu();
});

/* --------------------------------------------------------------------------
   1. システム時計機能
   -------------------------------------------------------------------------- */
function initClock() {
    const clockEl = document.getElementById('system-clock');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // 0時は12時として表示
        const hoursStr = String(hours).padStart(2, '0');

        clockEl.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   2. ウィンドウ開閉 & フォーカス管理
   -------------------------------------------------------------------------- */
let maxZIndex = 10;

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    // 非表示の場合は表示する
    win.style.display = 'flex';
    
    // 最前面に持ってくる
    focusWindow(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
    }
}

function focusWindow(winElement) {
    // 全てのウィンドウから active-window クラスを除去
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active-window');
    });

    // ターゲットウィンドウを最前面にし、アクティブ化
    maxZIndex += 1;
    winElement.style.zIndex = maxZIndex;
    winElement.classList.add('active-window');
}

// デスクトップの初期配置リセット
function resetWindowPositions() {
    const defaults = {
        'win-welcome': { top: '8%', left: '15%', width: '550px' },
        'win-profile': { top: '15%', left: '35%', width: '500px' },
        'win-projects': { top: '25%', left: '20%', width: '600px' },
        'win-contact': { top: '35%', left: '40%', width: '520px' }
    };

    // 画面幅がモバイル(768px以下)の場合はリセットしない（CSSスタックが効いているため）
    if (window.innerWidth <= 768) return;

    Object.keys(defaults).forEach(id => {
        const win = document.getElementById(id);
        if (win) {
            win.style.display = 'flex';
            win.style.top = defaults[id].top;
            win.style.left = defaults[id].left;
            win.style.width = defaults[id].width;
        }
    });
}

// CRT走査線（Scanline）の切り替え
function toggleScanlines() {
    const crtScreen = document.querySelector('.crt-screen');
    if (crtScreen) {
        crtScreen.classList.toggle('no-scanlines');
    }
}

/* --------------------------------------------------------------------------
   3. ウィンドウドラッグ＆ドロップ機能
   -------------------------------------------------------------------------- */
function initDraggableWindows() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(win => {
        const header = win.querySelector('.js-window-drag');
        if (!header) return;

        // ウィンドウ内をクリックした際にもフォーカスを当てる
        win.addEventListener('mousedown', () => {
            focusWindow(win);
        });

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // 閉じるボタンやズームボタンをクリックした場合はドラッグを開始しない
            if (e.target.classList.contains('window-control-close') || e.target.classList.contains('window-control-zoom')) return;

            e.preventDefault();
            focusWindow(win);

            // マウスの初期位置を取得
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // モバイルなどレスポンシブ適用時はドラッグを無効化
            if (window.innerWidth <= 768) return;

            // 移動量を計算
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // ウィンドウの新しい位置を設定
            win.style.top = (win.offsetTop - pos2) + "px";
            win.style.left = (win.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // ドラッグ終了時にリスナーを解除
            document.onmouseup = null;
            document.onmousemove = null;
        }
    });
}

/* --------------------------------------------------------------------------
   4. インタラクティブ・ターミナル (BBS) 機能
   -------------------------------------------------------------------------- */
function initTerminal() {
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!form || !input || !output) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        input.value = '';

        if (!query) return;

        // ユーザー入力を出力に反映
        appendLine(`<span class="terminal-prompt">&gt;</span> ${query}`);

        // コマンドの解析
        parseCommand(query.toLowerCase(), query);
    });

    function appendLine(htmlContent) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = htmlContent;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight; // 自動スクロール
    }

    function parseCommand(cmd, originalQuery) {
        // コマンド判定
        if (cmd === 'help') {
            appendLine('Available commands:');
            appendLine('  <span class="accent-text">about</span>    - Show profile summary');
            appendLine('  <span class="accent-text">projects</span> - List recent creative archives');
            appendLine('  <span class="accent-text">contact</span>  - Instructions to send mail');
            appendLine('  <span class="accent-text">clear</span>    - Clear the screen');
            appendLine('  <span class="accent-text">mail [msg]</span>- Simulate sending a message to administrator');
        } 
        else if (cmd === 'about') {
            appendLine('--- JustCat (Hauki Saito) ---');
            appendLine('Geoscience B3 student at University of the Ryukyus.');
            appendLine('Passionate about programming and earth sciences.');
            appendLine('Skills: Java, HTML/CSS, Vanilla JavaScript.');
        } 
        else if (cmd === 'projects') {
            appendLine('--- Creative Archives ---');
            appendLine('1. Just Timer [202X] - Chrome Extension');
            appendLine('2. Retro OS Portfolio [2026] - 80s OS Style');
            appendLine('Try checking out the "Projects.exe" window for details!');
        } 
        else if (cmd === 'contact') {
            appendLine('To send a message, please use:');
            appendLine('  mail [Your Message Here]');
            appendLine('Example: <span class="text-muted">mail Hello, I love this 80s OS style!</span>');
        } 
        else if (cmd === 'clear') {
            output.innerHTML = '';
        } 
        else if (cmd.startsWith('mail ')) {
            const message = originalQuery.substring(5).trim();
            if (message.length === 0) {
                appendLine('Error: Mail message is empty.');
            } else {
                appendLine('Connecting to server...');
                setTimeout(() => {
                    appendLine('Sending payload packet...');
                    setTimeout(() => {
                        appendLine('<span class="accent-text">SUCCESS: Mail sent! Thank you for your feedback.</span>');
                    }, 500);
                }, 500);
            }
        } 
        else {
            appendLine(`Command not found: "${cmd}". Type 'help' for command list.`);
        }
    }
}

/* --------------------------------------------------------------------------
   5. システムメニュー外側クリックで閉じる挙動
   -------------------------------------------------------------------------- */
function initSystemMenu() {
    // ドロップダウンを持つすべてのメニュー項目を監視
    const menuItems = document.querySelectorAll('.menu-item');
    
    document.addEventListener('click', (e) => {
        menuItems.forEach(item => {
            if (item.contains(e.target)) {
                // クリックされたメニューをトグル
                item.classList.toggle('active');
            } else {
                // 外側がクリックされたら非表示
                item.classList.remove('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   6. ウィンドウズーム（最大化/元に戻す）機能
   -------------------------------------------------------------------------- */
function initZoomWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        const zoomBtn = win.querySelector('.window-control-zoom');
        if (!zoomBtn) return;

        let originalProps = null;

        zoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (win.classList.contains('window-maximized')) {
                win.classList.remove('window-maximized');
                if (originalProps) {
                    win.style.top = originalProps.top;
                    win.style.left = originalProps.left;
                    win.style.width = originalProps.width;
                    win.style.height = originalProps.height;
                }
            } else {
                originalProps = {
                    top: win.style.top,
                    left: win.style.left,
                    width: win.style.width,
                    height: win.style.height
                };
                win.classList.add('window-maximized');
                win.style.top = '32px'; // メニューバーの下
                win.style.left = '0px';
                win.style.width = '100vw';
                win.style.height = 'calc(100vh - 32px)';
            }
        });
    });
}

/* --------------------------------------------------------------------------
   7. ダークモード / ライトモード切り替え機能
   -------------------------------------------------------------------------- */
function initTheme() {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function toggleThemeMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
}

