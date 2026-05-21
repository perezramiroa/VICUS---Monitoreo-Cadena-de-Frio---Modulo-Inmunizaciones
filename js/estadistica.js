/**
 * Torre de Control Zona Uno - Módulo de Estadística v4
 * REPLICANDO LA LÓGICA PROBADA DEL DASHBOARD
 */

window.initEstadistica = function () {
  const overlay = document.getElementById('estadisticaOverlay');
  if (!overlay) return;

  const MIN_GEN = 2.0;
  const MAX_GEN = 8.0;
  const MIN_FREEZER = -20;
  const MAX_FREEZER = -15;

  let statsData = {
    sensores: []
  };

  // ============ REFERENCIAS AL DOM ============
  const closeBtn = overlay.querySelector('.close-btn');
  const tabs = overlay.querySelectorAll('.tab');
  const contents = overlay.querySelectorAll('.tab-content');

  // ============ INICIALIZACIÓN ============
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      const target = tab.dataset.tab;
      contents.forEach(c => c.classList.toggle('active', c.id === `tab-${target}`));
    });
  });

  // ============ FUNCIONES DE DATOS ============

  function getConfigActual() {
    try {
      if (typeof CONFIG_INMUNO !== 'undefined' && CONFIG_INMUNO.canales) {
        const canalesArray = [];
        for (const [nombre, config] of Object.entries(CONFIG_INMUNO.canales)) {
          canalesArray.push({
            id: config.id,
            key: config.key,
            nombre: nombre,
            isFreezer: config.isFreezer || false,
            fieldFreezer: config.fieldFreezer || 'field2',
            ...config
          });
        }
        return { canales: canalesArray };
      }

      const config = JSON.parse(sessionStorage.getItem('vicus_inmuno_config'));
      return config || { canales: [] };
    } catch (e) {
      console.error('Error al leer config:', e);
      return { canales: [] };
    }
  }

  /**
   * Carga todos los sensores usando la misma lógica del dashboard
   */
  async function cargarDatos() {
    const config = getConfigActual();
    statsData.sensores = [];

    console.log(`[Estadística] Cargando ${config.canales.length} canales...`);

    for (const canal of config.canales) {
      try {
        // Usar la MISMA URL que el dashboard
        const res = await fetch(`https://api.thingspeak.com/channels/${canal.id}/feeds.json?api_key=${canal.key}&results=100`);
        const data = await res.json();
        
        if (!data.channel || !data.feeds || data.feeds.length === 0) {
          console.warn(`[Estadística] Sin datos para canal ${canal.nombre}`);
          continue;
        }

        // Procesar cada campo (igual que el dashboard)
        ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8'].forEach(f => {
          const label = data.channel[f];
          if (!label) return;

          const labelLower = label.toLowerCase();
          const excludeKeywords = ['ambiente', 'wifi', 'rssi', 'intensidad', 'señal', 'nivel'];
          if (excludeKeywords.some(key => labelLower.includes(key))) return;

          // Extraer todas las temperaturas válidas para análisis
          let tempValues = [];
          let alertasAltas = 0;
          let alertasBasas = 0;
          let lastVal = NaN;
          let lastTime = null;

          let min = MIN_GEN, max = MAX_GEN;
          if (canal.isFreezer && f === canal.fieldFreezer) {
            min = MIN_FREEZER;
            max = MAX_FREEZER;
          }

          // Recorrer feeds para obtener última lectura válida y estadísticas
          for (let i = data.feeds.length - 1; i >= 0; i--) {
            const valTemp = parseFloat(data.feeds[i][f]);
            if (!isNaN(valTemp) && valTemp !== -127) {
              if (isNaN(lastVal)) {
                lastVal = valTemp;
                lastTime = data.feeds[i].created_at;
              }
              tempValues.push(valTemp);
              if (valTemp > max) alertasAltas++;
              if (valTemp < min) alertasBasas++;
            }
          }

          if (tempValues.length === 0) return;

          const tempPromedio = tempValues.reduce((a, b) => a + b, 0) / tempValues.length;
          const tiempoEnRango = ((tempValues.filter(t => t >= min && t <= max).length / tempValues.length) * 100).toFixed(1);

          let criticidad = 'normal';
          if (alertasAltas > 5 || alertasBasas > 5) {
            criticidad = 'critical';
          } else if (alertasAltas > 2 || alertasBasas > 2) {
            criticidad = 'warning';
          }

          statsData.sensores.push({
            nombre: label,
            canal: canal.nombre,
            tempActual: isNaN(lastVal) ? null : lastVal.toFixed(1),
            tempPromedio: tempPromedio.toFixed(1),
            tiempoEnRango: parseFloat(tiempoEnRango),
            alertasAltas,
            alertasBasas,
            estado: 'online',
            criticidad,
            lastTime: lastTime
          });

          console.log(`[Estadística] ${canal.nombre} - ${label}: ${lastVal.toFixed(1)}°C`);
        });
      } catch (e) {
        console.error(`Error procesando canal ${canal.nombre}:`, e);
      }
    }

    // Ordenar por criticidad
    statsData.sensores.sort((a, b) => {
      const orden = { critical: 0, warning: 1, normal: 2 };
      return orden[a.criticidad] - orden[b.criticidad];
    });

    console.log(`[Estadística] Datos cargados. Total: ${statsData.sensores.length} sensores`);
  }

  // ============ RENDERIZADO ============

  function renderResumen() {
    const criticidadList = overlay.querySelector('#criticidadList');
    criticidadList.innerHTML = '';

    if (statsData.sensores.length === 0) {
      criticidadList.innerHTML = '<p class="placeholder">No hay datos disponibles</p>';
      return;
    }

    // Mostrar sugerencias primero
    const sugerencias = [];
    statsData.sensores.forEach(s => {
      if (s.criticidad === 'critical') {
        sugerencias.push(`🚨 **${s.nombre}** (${s.canal}): ${s.tempActual}°C - Contactar responsable`);
      } else if (s.criticidad === 'warning') {
        sugerencias.push(`⚠️ **${s.nombre}** (${s.canal}): Inestabilidad - Revisar equipo`);
      }
    });

    if (sugerencias.length > 0) {
      const sugBox = document.createElement('div');
      sugBox.className = 'section-box';
      sugBox.style.background = 'rgba(59, 130, 246, 0.1)';
      sugBox.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      sugBox.style.marginBottom = '16px';
      sugBox.innerHTML = '<h3>💡 Sugerencias de Gestión</h3>';
      
      const list = document.createElement('ul');
      list.style.paddingLeft = '20px';
      list.style.fontSize = '0.85rem';
      list.style.color = 'var(--text-primary)';
      
      sugerencias.slice(0, 5).forEach(s => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        li.innerHTML = s;
        list.appendChild(li);
      });
      
      sugBox.appendChild(list);
      criticidadList.appendChild(sugBox);
    }

    // Ranking de criticidad
    statsData.sensores.forEach((sensor, idx) => {
      const item = document.createElement('div');
      item.className = `criticidad-item ${sensor.criticidad}`;
      item.innerHTML = `
        <div class="criticidad-info">
          <div class="criticidad-name">#${idx + 1} ${sensor.nombre} (${sensor.canal})</div>
          <div class="criticidad-detail">online • ${sensor.tiempoEnRango}% en rango</div>
        </div>
        <div class="criticidad-value">${sensor.tempActual || '--'}°C</div>
      `;
      criticidadList.appendChild(item);
    });

    // KPIs
    const online = statsData.sensores.length;
    const disponibilidad = 100;
    const tempPromedio = statsData.sensores.length > 0 ? (
      statsData.sensores.reduce((sum, e) => sum + parseFloat(e.tempPromedio), 0) / statsData.sensores.length
    ).toFixed(1) : '--';
    const tiempoPromedio = statsData.sensores.length > 0 ? (
      statsData.sensores.reduce((sum, e) => sum + e.tiempoEnRango, 0) / statsData.sensores.length
    ).toFixed(1) : '--';
    const alertasAltas = statsData.sensores.reduce((sum, e) => sum + e.alertasAltas, 0);
    const alertasBasas = statsData.sensores.reduce((sum, e) => sum + e.alertasBasas, 0);

    overlay.querySelector('#efectoresOnline').textContent = online;
    overlay.querySelector('#efectoresOffline').textContent = 0;
    overlay.querySelector('#disponibilidad').textContent = disponibilidad + '%';
    overlay.querySelector('#desviosPendientes').textContent = '0';
    overlay.querySelector('#kpiTempPromedio').textContent = tempPromedio;
    overlay.querySelector('#kpiTiempoRango').textContent = tiempoPromedio + '%';
    overlay.querySelector('#kpiAlertasAltas').textContent = alertasAltas;
    overlay.querySelector('#kpiAlertasBasas').textContent = alertasBasas;
  }

  function renderGraficoTemperatura() {
    const ctx = overlay.querySelector('#tempChart');
    if (!ctx || !window.Chart) return;

    if (window.tempChartInstance) {
      window.tempChartInstance.destroy();
    }

    if (statsData.sensores.length === 0) return;

    const labels = statsData.sensores.map(s => `${s.nombre}\n(${s.canal})`);
    const datos = statsData.sensores.map(s => parseFloat(s.tempActual) || 0);

    window.tempChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperatura Actual (°C)',
          data: datos,
          backgroundColor: datos.map(temp => {
            if (temp > 8) return 'rgba(239, 68, 68, 0.7)';
            if (temp < 2) return 'rgba(59, 130, 246, 0.7)';
            return 'rgba(16, 185, 129, 0.7)';
          }),
          borderColor: datos.map(temp => {
            if (temp > 8) return 'rgba(239, 68, 68, 1)';
            if (temp < 2) return 'rgba(59, 130, 246, 1)';
            return 'rgba(16, 185, 129, 1)';
          }),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: { labels: { color: 'rgba(229, 231, 235, 0.8)' } }
        },
        scales: {
          x: {
            beginAtZero: true,
            min: -5,
            max: 15,
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            ticks: { color: 'rgba(148, 163, 184, 0.8)', font: { size: 10 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }

  function renderDesvios() {
    const tbody = overlay.querySelector('#desviosTable tbody');
    if (!tbody) return;

    const sensoresConAlerta = statsData.sensores.filter(s => s.alertasAltas > 0 || s.alertasBasas > 0);

    if (sensoresConAlerta.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="placeholder">No hay desvíos registrados</td></tr>`;
      return;
    }

    tbody.innerHTML = sensoresConAlerta.map(s => `
      <tr>
        <td>${s.nombre}</td>
        <td>${s.canal}</td>
        <td>${s.alertasAltas}</td>
        <td>${s.alertasBasas}</td>
        <td>${s.tiempoEnRango}%</td>
        <td>${s.tempActual}°C</td>
      </tr>
    `).join('');
  }

  function renderConectividad() {
    const timeline = overlay.querySelector('#timelineConectividad');
    if (!timeline) return;

    timeline.innerHTML = `
      <p style="margin-bottom: 12px;">
        <strong>Estado de Conectividad:</strong> ${statsData.sensores.length} en línea
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: rgba(16, 185, 129, 1);">${statsData.sensores.length}</div>
          <div style="font-size: 12px; color: rgba(148, 163, 184, 0.8);">Sensores Online</div>
        </div>
      </div>
    `;
  }

  function renderReportes() {
    const btnExportarCsv = overlay.querySelector('#btnExportarCsv');
    if (btnExportarCsv) {
      btnExportarCsv.addEventListener('click', () => exportarCsv());
    }

    const btnGenerarPdfConsolidado = overlay.querySelector('#btnGenerarPdfConsolidado');
    if (btnGenerarPdfConsolidado) {
      btnGenerarPdfConsolidado.addEventListener('click', () => generarPdfConsolidado());
    }
  }

  function exportarCsv() {
    const rows = [['Sensor', 'Canal', 'Temperatura (°C)', 'Promedio (°C)', 'Tiempo en Rango (%)', 'Alertas Altas', 'Alertas Bajas']];

    statsData.sensores.forEach(s => {
      rows.push([
        s.nombre,
        s.canal,
        s.tempActual || '--',
        s.tempPromedio || '--',
        s.tiempoEnRango,
        s.alertasAltas,
        s.alertasBasas
      ]);
    });

    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadistica_sensores_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function generarPdfConsolidado() {
    try {
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        alert('PDF no disponible');
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text('Torre de Control – Zona Uno', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Reporte: ${new Date().toLocaleString('es-AR')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      const tableData = statsData.sensores.map(s => [
        s.nombre.substring(0, 25),
        s.canal.substring(0, 20),
        s.tempActual || '--',
        s.tempPromedio || '--',
        s.tiempoEnRango + '%'
      ]);

      doc.autoTable({
        head: [['Sensor', 'Canal', 'Temp Act.', 'Temp Prom.', 'En Rango']],
        body: tableData,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { textColor: [0, 0, 0], fontSize: 8 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });

      doc.save(`reporte_sensores_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('Error al generar PDF:', e);
      alert('Error: ' + e.message);
    }
  }

  // ============ INICIALIZACIÓN PRINCIPAL ============

  async function init() {
    try {
      console.log('[Estadística] Inicializando...');
      await cargarDatos();
      renderResumen();
      renderGraficoTemperatura();
      renderDesvios();
      renderConectividad();
      renderReportes();
      console.log('[Estadística] Listo');
    } catch (e) {
      console.error('Error:', e);
    }
  }

  init();
};
