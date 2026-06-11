import React from 'react';

export default function Projects() {
  return (
    <div>
      <h2 className="section-title">SELECTED ARCHIVES</h2>
      <div className="projects-grid">
        
        {/* プロジェクトカード 1 */}
        <article className="project-card">
          <div className="project-meta system-mono">
            <span>ID: 001</span>
            <span>YEAR: 202X</span>
          </div>
          <h3 className="project-title">JUST TIMER (CHROME EXTENSION)</h3>
          <p className="project-desc body-text">
            シンプルさを追求したChrome拡張機能タイマー。タイマーの追加・削除、個別のカウントダウン機能、終了アラーム音、および目立たない現在時刻表示機能を搭載。
          </p>
          <a
            href="https://chromewebstore.google.com/detail/justtimer/ddcebdiijkmpcgpaomapcnfmdnlbjigg"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link system-mono"
          >
            &gt; VISIT CHROME WEB STORE
          </a>
        </article>

        {/* プロジェクトカード 2 */}
        <article className="project-card">
          <div className="project-meta system-mono">
            <span>ID: 002</span>
            <span>YEAR: 2026</span>
          </div>
          <h3 className="project-title">RETRO OS PORTFOLIO</h3>
          <p className="project-desc body-text">
            80年代のClassic GUI OSを模した、インタラクティブなポートフォリオWebサイト。CRT走査線エフェクト、重ね合わせウィンドウ、BBS風ターミナルを搭載。
          </p>
          <a href="#" className="project-link system-mono">&gt; VISIT SOURCE</a>
        </article>

      </div>
    </div>
  );
}
