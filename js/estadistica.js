// Estadistica modal logic
// This script is loaded lazily when the modal HTML is fetched.
// It registers a global initEstadistica function that sets up all UI interactions,
// loads data (CSV or Google Sheet), computes KPIs, renders charts and tables.

window.initEstadistica = function () {
  const overlay = document.getElementById('estadisticaOverlay');
  if (!overlay) return;

  // ---------- Helper: load external script (e.g., Chart.js) ----------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // ---------- Close button ----------
  const closeBtn = overlay.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('visible'));
  }

  // ---- Tab navigation ----
  const tabs = overlay.querySelectorAll('.tab');
  const contents = overlay.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Activate selected tab
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      const target = tab.dataset.tab;
      contents.forEach(c => c.classList.toggle('active', c.id === `tab-${target}`));
    });
  });

  // ---- Export CSV ----
  const exportCsvBtn = overlay.querySelector('#exportCsv');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const rows = [];
      const grid = overlay.querySelector('.kpi-grid');
      if (grid) {
        grid.querySelectorAll('.kpi-card').forEach(card => {
          const label = card.querySelector('.label')?.textContent.trim() || '';
          const value = card.querySelector('.value')?.textContent.trim() || '';
          rows.push([label, value]);
        });
        const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""') }"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'estadistica.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  // ---- Export PDF (using html2pdf.js) ----
  const exportPdfBtn = overlay.querySelector('#exportPdf');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      const modalContent = overlay.querySelector('.modal');
      if (window.html2pdf && modalContent) {
        window.html2pdf().from(modalContent).save('estadistica.pdf');
      } else {
        alert('Exportar a PDF no está disponible en este entorno.');
      }
    });
  }
};
