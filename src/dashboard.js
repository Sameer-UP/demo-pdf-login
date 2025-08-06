function showDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="dashboard-header">
        <h2>Documents Dashboard</h2>
        <button class="logout-btn" onclick="showLogin()">Logout</button>
      </div>
      <div class="cards" id="cardGrid"></div>
    `;
  
    const grid = document.getElementById('cardGrid');
    window.env.PDFS.forEach((pdf, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-thumb" id="thumb${idx}">
          <div class="loading-spinner"></div>
        </div>
        <div class="card-title">${pdf.title}</div>
        <div class="card-subtitle">Click to view</div>
      `;
      card.onclick = () => showPdfViewer(pdf);
      grid.appendChild(card);
  
      // Render PDF first page as thumbnail
      renderPdfThumbnail(pdf.path, `thumb${idx}`, pdf.title);
    });
  }
  
  function renderPdfThumbnail(pdfPath, elemId, title) {
    console.log('Loading thumbnail for:', pdfPath);
    
    // Ensure we're using the correct path
    const path = pdfPath.startsWith('./') ? pdfPath.substring(2) : pdfPath;
    
    const loadingTask = pdfjsLib.getDocument(path);
    loadingTask.promise.then(pdf => {
      console.log('Thumbnail PDF loaded:', title);
      pdf.getPage(1).then(page => {
        const scale = 0.3;
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
  
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
          console.log('Thumbnail rendered:', title);
          const thumbEl = document.getElementById(elemId);
          thumbEl.innerHTML = '';
          thumbEl.appendChild(canvas);
        }).catch(renderError => {
          console.error('Error rendering thumbnail:', renderError);
          const thumbEl = document.getElementById(elemId);
          thumbEl.innerHTML = '<div class="error-thumb">Render Error</div>';
        });
      }).catch(pageError => {
        console.error('Error getting thumbnail page:', pageError);
        const thumbEl = document.getElementById(elemId);
        thumbEl.innerHTML = '<div class="error-thumb">Page Error</div>';
      });
    }).catch((error) => {
      console.error('Error loading PDF thumbnail:', error);
      const thumbEl = document.getElementById(elemId);
      thumbEl.innerHTML = `<div class="error-thumb">${error.message}</div>`;
    });
  }