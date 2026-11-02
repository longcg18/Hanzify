import React, { useState, useEffect, useRef } from 'react';

export const SlidePresentationViewer = ({ isOpen, onClose, lesson }) => {
  const [embedMode, setEmbedMode] = useState('office'); // 'office' | 'google'
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
  }, [lesson?.pptUrl, embedMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lesson) return null;

  const pptUrl = lesson.pptUrl;
  const encodedUrl = encodeURIComponent(pptUrl || '');

  const officeEmbedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  const googleEmbedUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;

  const activeSrc = embedMode === 'office' ? officeEmbedUrl : googleEmbedUrl;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullscreen ? 0 : '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: isFullscreen ? '100vw' : '1280px',
          height: isFullscreen ? '100vh' : '90vh',
          backgroundColor: '#0f172a',
          borderRadius: isFullscreen ? 0 : '16px',
          border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          height: '56px',
          padding: '0 18px',
          background: '#1e293b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0
        }}>
          {/* Title Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{
              background: '#ea580c',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}>
              <i className="fa-solid fa-file-powerpoint" /> PPT
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {lesson.title}
                {lesson.chineseTitle && (
                  <span style={{ color: '#94a3b8', marginLeft: '6px', fontWeight: 400 }}>
                    ({lesson.chineseTitle})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                type="button"
                onClick={() => setEmbedMode('office')}
                style={{
                  background: embedMode === 'office' ? '#b91c1c' : 'transparent',
                  color: embedMode === 'office' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Sử dụng trình chiếu Microsoft Office Online"
              >
                Office
              </button>
              <button
                type="button"
                onClick={() => setEmbedMode('google')}
                style={{
                  background: embedMode === 'google' ? '#b91c1c' : 'transparent',
                  color: embedMode === 'google' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Sử dụng trình chiếu Google Docs Viewer"
              >
                Google
              </button>
            </div>

            {/* Open in new tab */}
            <a
              href={officeEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              title="Mở trình chiếu toàn màn hình ở tab mới"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '11px' }} />
              <span className="hidden-mobile">Tab mới</span>
            </a>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              title="Phóng to toàn màn hình"
            >
              <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} style={{ fontSize: '12px' }} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'opacity 0.15s ease'
              }}
              title="Đóng trình chiếu (Esc)"
              aria-label="Đóng"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Presentation Body Frame */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#000000' }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0f172a',
              color: '#94a3b8',
              gap: '12px',
              zIndex: 10
            }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px', color: '#ea580c' }} />
              <div style={{ fontSize: '14px' }}>Đang tải bài giảng Slide PPT...</div>
            </div>
          )}

          {pptUrl ? (
            <iframe
              src={activeSrc}
              title={`Slide bài giảng: ${lesson.title}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
              onLoad={() => setIsLoading(false)}
              allow="fullscreen"
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              gap: '10px'
            }}>
              <i className="fa-regular fa-folder-open" style={{ fontSize: '36px' }} />
              <div>Bài học này chưa có tệp Slide PPT đính kèm.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

