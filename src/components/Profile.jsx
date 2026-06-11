import React from 'react';

export default function Profile() {
  return (
    <div className="profile-layout">
      <div className="profile-avatar-container">
        <svg className="avatar-svg" width="96" height="96" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <span className="system-mono user-tag">USER: JUSTCAT</span>
      </div>
      <div className="profile-details">
        <h2 className="section-title">CREATOR STATUS</h2>
        <table className="status-table system-mono">
          <tbody>
            <tr>
              <td>NAME:</td>
              <td>齋藤 遼樹 (HAUKI SAITO)</td>
            </tr>
            <tr>
              <td>CLASS:</td>
              <td>GEOSCIENCE B3 </td>
            </tr>
            <tr>
              <td>SKILLS:</td>
              <td>JAVA, HTML/CSS, JAVASCRIPT</td>
            </tr>
            <tr>
              <td>GENDER:</td>
              <td>XGENDER</td>
            </tr>
            <tr>
              <td>LOCATION:</td>
              <td>OKINAWA, JAPAN</td>
            </tr>
          </tbody>
        </table>
        <p className="body-text profile-bio">
          琉球大学で地球科学を学びつつ、プログラミングや個人でのものづくりに励んでいます。レトロなテクノロジーと科学の融合に情熱を注いでいます。
        </p>
      </div>
    </div>
  );
}
