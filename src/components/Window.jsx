import React, { useState, useRef, useEffect } from 'react';

export default function Window({
  id,
  title,
  isOpen,
  onClose,
  activeWindowId,
  onFocus,
  defaultPos = { top: '10%', left: '10%' },
  defaultSize = { width: '500px', height: 'auto' },
  resetTrigger = 0,
  children,
  statusLeft,
  statusRight
}) {
  const [position, setPosition] = useState(defaultPos);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);

  // ドラッグ追跡
  const handleHeaderMouseDown = (e) => {
    if (e.target.closest('.window-control-close') || e.target.closest('.window-control-zoom')) {
      return;
    }
    if (isMaximized) return;
    if (window.innerWidth <= 768) return; // モバイルはドラッグ不可

    e.preventDefault();
    onFocus(id);

    const startX = e.clientX;
    const startY = e.clientY;
    
    const rect = windowRef.current.getBoundingClientRect();
    const currentLeft = rect.left;
    const currentTop = rect.top;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setPosition({
        top: `${currentTop + deltaY}px`,
        left: `${currentLeft + deltaX}px`
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // リサイズ追跡
  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = windowRef.current.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setSize({
        width: `${Math.max(250, startWidth + deltaX)}px`,
        height: `${Math.max(150, startHeight + deltaY)}px`
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleZoomClick = (e) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
    onFocus(id);
  };

  // 親からリセットシグナルが送られたら位置・サイズを初期位置に戻す
  useEffect(() => {
    setPosition(defaultPos);
    setSize(defaultSize);
    setIsMaximized(false);
  }, [resetTrigger, defaultPos, defaultSize]);

  if (!isOpen) return null;

  const isActive = activeWindowId === id;

  const windowStyle = isMaximized
    ? {
        top: '32px',
        left: '0px',
        width: '100vw',
        height: 'calc(100vh - 32px)',
        display: 'flex',
        zIndex: isActive ? 100 : 5
      }
    : {
        top: position.top,
        left: position.left,
        width: size.width,
        height: size.height,
        display: 'flex',
        zIndex: isActive ? 100 : 5
      };

  return (
    <div
      ref={windowRef}
      id={id}
      className={`window ${isActive ? 'active-window' : ''} ${isMaximized ? 'window-maximized' : ''}`}
      style={windowStyle}
      onMouseDown={() => onFocus(id)}
    >
      <div className="window-header js-window-drag" onMouseDown={handleHeaderMouseDown}>
        <div
          className="window-control-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="Close"
        />
        <span className="window-title system-mono">{title}</span>
        <div
          className="window-control-zoom"
          onClick={handleZoomClick}
          onMouseDown={(e) => e.stopPropagation()}
          title="Zoom"
        />
      </div>
      <div className="window-body">
        {children}
      </div>
      <div className="window-status system-mono">
        <span>{statusLeft || 'SYS.STATUS: ONLINE'}</span>
        {statusRight && <span>{statusRight}</span>}
        {!isMaximized && (
          <div className="window-resize-handle" onMouseDown={handleResizeMouseDown} />
        )}
      </div>
    </div>
  );
}
