import React from 'react';

export default function Welcome({ onOpenProjects }) {
  return (
    <div className="hero-section">
      <div className="badge system-mono">SYSTEM READY // PORTFOLIO v1.80</div>
      <div className="title-area">
        <h1 className="display-title">HELLO, I AM <span className="accent-text">JUSTCAT</span>.</h1>
      </div>
      <p className="body-text">
        琉球大学理学部で地球科学（Geoscience）を専攻するB3学生であるクリエイター「JustCat」（齋藤 遼樹）のデジタルスペースへようこそ。画面上のウィンドウをドラッグして、私の世界を探検してください。
      </p>
      <div className="hero-cta-wrapper">
        <button className="retro-btn primary-btn" onClick={onOpenProjects}>作品を見る (Projects.exe)</button>
      </div>
    </div>
  );
}
