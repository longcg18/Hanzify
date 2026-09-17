import React, { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const PdfPage = ({ documentProxy, pageNumber }) => {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '900px 0px' });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !documentProxy || !hostRef.current || !canvasRef.current) return undefined;

    let cancelled = false;
    let renderTask;

    const renderPage = async () => {
      try {
        const page = await documentProxy.getPage(pageNumber);
        if (cancelled) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(280, hostRef.current.clientWidth - 16);
        const cssScale = availableWidth / baseViewport.width;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: cssScale * pixelRatio });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
        canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
      } catch (error) {
        if (!cancelled && error?.name !== 'RenderingCancelledException') setRenderError(true);
      }
    };

    renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [documentProxy, isVisible, pageNumber]);

  return (
    <section ref={hostRef} className="pdf-page-card" aria-label={`Trang ${pageNumber}`}>
      <div className="pdf-page-number">Trang {pageNumber}</div>
      {renderError ? (
        <div className="pdf-page-error">Không thể hiển thị trang này.</div>
      ) : (
        <canvas ref={canvasRef} className="pdf-page-canvas" />
      )}
    </section>
  );
};

export const PdfDocumentViewer = ({ url, title }) => {
  const [documentProxy, setDocumentProxy] = useState(null);
  const [loadState, setLoadState] = useState({ status: 'loading', progress: 0 });

  useEffect(() => {
    let active = true;
    setDocumentProxy(null);
    setLoadState({ status: 'loading', progress: 0 });

    const loadingTask = getDocument({ url });
    loadingTask.onProgress = ({ loaded, total }) => {
      if (!active || !total) return;
      setLoadState({ status: 'loading', progress: Math.min(100, Math.round((loaded / total) * 100)) });
    };
    loadingTask.promise
      .then((pdf) => {
        if (!active) {
          pdf.destroy();
          return;
        }
        setDocumentProxy(pdf);
        setLoadState({ status: 'ready', progress: 100 });
      })
      .catch(() => {
        if (active) setLoadState({ status: 'error', progress: 0 });
      });

    return () => {
      active = false;
      loadingTask.destroy();
    };
  }, [url]);

  return (
    <div className="pdf-viewer-shell">
      <div className="pdf-viewer-toolbar">
        <span>
          <i className="fa-regular fa-file-pdf"></i>
          {loadState.status === 'ready' ? `${documentProxy.numPages} trang` : loadState.status === 'loading' ? `Đang tải PDF${loadState.progress ? ` ${loadState.progress}%` : '…'}` : 'PDF không tải được'}
        </span>
        <a href={url} target="_blank" rel="noreferrer" aria-label={`Mở ${title} trong tab mới`}>
          Mở PDF riêng <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>

      <div className="er-paper-viewer" role="document" aria-label={title}>
        {loadState.status === 'loading' && (
          <div className="pdf-viewer-state"><i className="fa-solid fa-spinner fa-spin"></i> Đang tải đề thi…</div>
        )}
        {loadState.status === 'error' && (
          <div className="pdf-viewer-state pdf-viewer-error">
            <strong>Không thể hiển thị PDF trong trang.</strong>
            <span>Hãy dùng nút “Mở PDF riêng” phía trên.</span>
          </div>
        )}
        {documentProxy && Array.from({ length: documentProxy.numPages }, (_, index) => (
          <PdfPage key={index + 1} documentProxy={documentProxy} pageNumber={index + 1} />
        ))}
      </div>
    </div>
  );
};
