function showPdfViewer(pdf) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="viewer-header">
        <span class="viewer-back" onclick="showDashboard()">← Back to Dashboard</span>
        <h2>${pdf.title}</h2>
      </div>
      <div class="pdf-container">
        <div id="pdfContainer" class="pdf-content">
          <div class="loading-spinner"></div>
        </div>
      </div>
    `;
  
    // Render only first page
    const container = document.getElementById('pdfContainer');
    
    console.log('Loading PDF:', pdf.path);
    
    // Ensure we're using the correct path
    const pdfPath = pdf.path.startsWith('./') ? pdf.path.substring(2) : pdf.path;
    
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    loadingTask.promise.then(pdfDoc => {
      console.log('PDF loaded successfully, pages:', pdfDoc.numPages);
      pdfDoc.getPage(1).then(page => {
        const scale = 1.2;
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = 'pdf-canvas';
  
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
          console.log('PDF rendered successfully');
          container.innerHTML = '';
          container.appendChild(canvas);
        }).catch(renderError => {
          console.error('Error rendering PDF:', renderError);
          container.innerHTML = `
            <div class="error-message">
              <h3>Error Rendering PDF</h3>
              <p>Unable to render "${pdf.title}". Please try again later.</p>
              <button onclick="showPdfViewer(${JSON.stringify(pdf)})">Retry</button>
            </div>
          `;
        });
      }).catch(pageError => {
        console.error('Error getting page:', pageError);
        container.innerHTML = `
          <div class="error-message">
            <h3>Error Loading Page</h3>
            <p>Unable to load first page of "${pdf.title}". Please try again later.</p>
            <button onclick="showPdfViewer(${JSON.stringify(pdf)})">Retry</button>
          </div>
        `;
      });
    }).catch((error) => {
      console.error('Error loading PDF:', error);
      container.innerHTML = `
        <div class="error-message">
          <h3>Error Loading PDF</h3>
          <p>Unable to load "${pdf.title}".</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Path:</strong> ${pdfPath}</p>
          <button onclick="showPdfViewer(${JSON.stringify(pdf)})">Retry</button>
          <button onclick="showDashboard()">Back to Dashboard</button>
        </div>
      `;
    });
  }