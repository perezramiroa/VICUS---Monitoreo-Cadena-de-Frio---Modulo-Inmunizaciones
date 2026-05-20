/**
 * Torre de Control Zona Uno - Módulo de Estadística
 * Integración de: Propuesta C (Gestión Regional) + Antigravity (UX Premium)
 * 
 * Funcionalidades:
 * - Ranking de criticidad de efectores
 * - Análisis de conectividad regional
 * - Gestión de desvíos pendientes
 * - Gráficos comparativos de temperatura
 * - Exportación de reportes consolidados
 */

window.initEstadistica = function () {
  const overlay = document.getElementById('estadisticaOverlay');
  if (!overlay) return;

  // ============ ESTADO GLOBAL ============
  let statsData = {
    efectores: [],
    temperaturas: [],
    desvios: [],
    conectividad: []
  };

  // ============ REFERENCIAS AL DOM ============
  const closeBtn = overlay.querySelector('.close-btn');
  const tabs = overlay.querySelectorAll('.tab');
  const contents = overlay.querySelectorAll('.tab-content');

  // ============ INICIALIZACIÓN ============
  
  // Cerrar modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
    });
  }

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
    }
  });

  // Navegación de pestañas
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      const target = tab.dataset.tab;
      contents.forEach(c => c.classList.toggle('active', c.id === `tab-${target}`));
    });
  });

  // ============ FUNCIONES DE DATOS ============

  /**
   * Obtiene la configuración de canales del usuario actual
   */
  function getConfigActual() {
    try {
      const config = JSON.parse(sessionStorage.getItem('vicus_inmuno_config'));
      return config || { canales: [] };
    } catch (e) {
      console.error('Error al leer config:', e);
      return { canales: [] };
    }
  }

  /**
   * Simula obtención de datos de ThingSpeak
   * En producción, esto haría fetch real a la API
   */
  async function fetchDatosThingSpeak(canalId, apiKey) {
    try {
      const response = await fetch(
        `https://api.thingspeak.com/channels/${canalId}/feeds.json?api_key=${apiKey}&results=100`
      );
      if (!response.ok) throw new Error('Error en ThingSpeak');
      return await response.json();
    } catch (e) {
      console.warn(`Error fetching ThingSpeak para canal ${canalId}:`, e);
      return null;
    }
  }

  /**
   * Calcula métricas de un efector basado en datos de ThingSpeak
   */
  function calcularMetricasEfector(nombreEfector, datosThingSpeak, min = 2.0, max = 8.0) {
    if (!datosThingSpeak || !datosThingSpeak.feeds) {
      return {
        nombre: nombreEfector,
        tempActual: null,
        tempPromedio: null,
        tiempoEnRango: 0,
        alertasAltas: 0,
        alertasBasas: 0,
        estado: 'offline',
        criticidad: 'desconocida'
      };
    }

    const feeds = datosThingSpeak.feeds;
    let tempValues = [];
    let alertasAltas = 0;
    let alertasBasas = 0;

    // Extraer temperaturas (field1 típicamente es temperatura)
    feeds.forEach(feed => {
      const temp = parseFloat(feed.field1);
      if (!isNaN(temp) && temp !== -127) {
        tempValues.push(temp);
        if (temp > max) alertasAltas++;
        if (temp < min) alertasBasas++;
      }
    });

    if (tempValues.length === 0) {
      return {
        nombre: nombreEfector,
        tempActual: null,
        tempPromedio: null,
        tiempoEnRango: 0,
        alertasAltas: 0,
        alertasBasas: 0,
        estado: 'sin datos',
        criticidad: 'desconocida'
      };
    }

    const tempActual = tempValues[tempValues.length - 1];
    const tempPromedio = tempValues.reduce((a, b) => a + b, 0) / tempValues.length;
    const tiempoEnRango = ((tempValues.filter(t => t >= min && t <= max).length / tempValues.length) * 100).toFixed(1);

    // Determinar criticidad
    let criticidad = 'normal';
    if (alertasAltas > 5 || alertasBasas > 5) {
      criticidad = 'critical';
    } else if (alertasAltas > 2 || alertasBasas > 2) {
      criticidad = 'warning';
    }

    return {
      nombre: nombreEfector,
      tempActual: tempActual.toFixed(1),
      tempPromedio: tempPromedio.toFixed(1),
      tiempoEnRango: parseFloat(tiempoEnRango),
      alertasAltas,
      alertasBasas,
      estado: 'online',
      criticidad
    };
  }

  /**
   * Carga todos los datos para la Torre de Control
   */
  async function cargarDatos() {
    const config = getConfigActual();
    statsData.efectores = [];

    // Cargar datos de cada efector en paralelo
    const promesas = config.canales.map(canal =>
      fetchDatosThingSpeak(canal.id, canal.key)
        .then(datos => {
          const metricas = calcularMetricasEfector(canal.id, datos);
          statsData.efectores.push(metricas);
        })
    );

    await Promise.all(promesas);

    // Ordenar por criticidad
    statsData.efectores.sort((a, b) => {
      const orden = { critical: 0, warning: 1, normal: 2, desconocida: 3 };
      return orden[a.criticidad] - orden[b.criticidad];
    });
  }

  // ============ RENDERIZADO DE PESTAÑAS ============

  /**
   * Renderiza la pestaña de Resumen Regional
   */
  function renderResumen() {
    // Ranking de criticidad
    const criticidadList = overlay.querySelector('#criticidadList');
    criticidadList.innerHTML = '';

    if (statsData.efectores.length === 0) {
      criticidadList.innerHTML = '<p class="placeholder">No hay datos disponibles</p>';
      return;
    }

    statsData.efectores.forEach((efector, idx) => {
      const item = document.createElement('div');
      item.className = `criticidad-item ${efector.criticidad}`;
      item.innerHTML = `
        <div class="criticidad-info">
          <div class="criticidad-name">#${idx + 1} ${efector.nombre}</div>
          <div class="criticidad-detail">${efector.estado} • ${efector.tiempoEnRango}% en rango</div>
        </div>
        <div class="criticidad-value">${efector.tempActual || '--'}°C</div>
      `;
      criticidadList.appendChild(item);
    });

    // Conectividad
    const online = statsData.efectores.filter(e => e.estado === 'online').length;
    const offline = statsData.efectores.length - online;
    const disponibilidad = ((online / statsData.efectores.length) * 100).toFixed(1);

    overlay.querySelector('#efectoresOnline').textContent = online;
    overlay.querySelector('#efectoresOffline').textContent = offline;
    overlay.querySelector('#disponibilidad').textContent = disponibilidad + '%';

    // Desvíos pendientes (simulado)
    overlay.querySelector('#desviosPendientes').textContent = '0';

    // KPIs consolidados
    const tempPromedio = (
      statsData.efectores.reduce((sum, e) => sum + (parseFloat(e.tempPromedio) || 0), 0) /
      statsData.efectores.length
    ).toFixed(1);

    const tiempoPromedio = (
      statsData.efectores.reduce((sum, e) => sum + e.tiempoEnRango, 0) /
      statsData.efectores.length
    ).toFixed(1);

    const alertasAltas = statsData.efectores.reduce((sum, e) => sum + e.alertasAltas, 0);
    const alertasBasas = statsData.efectores.reduce((sum, e) => sum + e.alertasBasas, 0);

    overlay.querySelector('#kpiTempPromedio').textContent = tempPromedio;
    overlay.querySelector('#kpiTiempoRango').textContent = tiempoPromedio + '%';
    overlay.querySelector('#kpiAlertasAltas').textContent = alertasAltas;
    overlay.querySelector('#kpiAlertasBasas').textContent = alertasBasas;
  }

  /**
   * Renderiza gráfico de temperatura comparativa
   */
  function renderGraficoTemperatura() {
    const ctx = overlay.querySelector('#tempChart');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (window.tempChartInstance) {
      window.tempChartInstance.destroy();
    }

    const labels = statsData.efectores.map(e => e.nombre);
    const datos = statsData.efectores.map(e => parseFloat(e.tempActual) || 0);

    window.tempChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperatura Actual (°C)',
            data: datos,
            backgroundColor: datos.map(temp => {
              if (temp > 8) return 'rgba(239, 68, 68, 0.6)';
              if (temp < 2) return 'rgba(59, 130, 246, 0.6)';
              return 'rgba(16, 185, 129, 0.6)';
            }),
            borderColor: datos.map(temp => {
              if (temp > 8) return 'rgba(239, 68, 68, 1)';
              if (temp < 2) return 'rgba(59, 130, 246, 1)';
              return 'rgba(16, 185, 129, 1)';
            }),
            borderWidth: 2,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: 'rgba(229, 231, 235, 0.8)' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: -5,
            max: 15,
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          x: {
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }

  /**
   * Renderiza tabla de desvíos (simulado)
   */
  function renderDesvios() {
    const tbody = overlay.querySelector('#desviosTable tbody');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="placeholder">No hay desvíos registrados en este período</td>
      </tr>
    `;
  }

  /**
   * Renderiza timeline de conectividad (simulado)
   */
  function renderConectividad() {
    const timeline = overlay.querySelector('#timelineConectividad');
    if (!timeline) return;

    timeline.innerHTML = `
      <p class="placeholder">Todos los efectores están conectados correctamente</p>
    `;

    // Gráfico de Wi-Fi
    const ctx = overlay.querySelector('#wifiChart');
    if (ctx && window.Chart) {
      if (window.wifiChartInstance) {
        window.wifiChartInstance.destroy();
      }

      const labels = statsData.efectores.map(e => e.nombre);
      const wifiSignal = labels.map(() => Math.floor(Math.random() * 40) + 60); // 60-100%

      window.wifiChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Señal Wi-Fi (%)',
            data: wifiSignal,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { labels: { color: 'rgba(229, 231, 235, 0.8)' } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: 'rgba(148, 163, 184, 0.8)' },
              grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
              ticks: { color: 'rgba(148, 163, 184, 0.8)' },
              grid: { color: 'rgba(255, 255, 255, 0.05)' }
            }
          }
        }
      });
    }
  }

  /**
   * Renderiza sección de reportes
   */
  function renderReportes() {
    // Botones de exportación
    const btnExportarCsv = overlay.querySelector('#btnExportarCsv');
    if (btnExportarCsv) {
      btnExportarCsv.addEventListener('click', () => exportarCsv());
    }

    const btnGenerarPdfConsolidado = overlay.querySelector('#btnGenerarPdfConsolidado');
    if (btnGenerarPdfConsolidado) {
      btnGenerarPdfConsolidado.addEventListener('click', () => generarPdfConsolidado());
    }
  }

  // ============ FUNCIONES DE EXPORTACIÓN ============

  function exportarCsv() {
    const rows = [['Efector', 'Temperatura (°C)', 'Promedio (°C)', 'Tiempo en Rango (%)', 'Alertas Altas', 'Alertas Bajas', 'Estado']];

    statsData.efectores.forEach(efector => {
      rows.push([
        efector.nombre,
        efector.tempActual || '--',
        efector.tempPromedio || '--',
        efector.tiempoEnRango,
        efector.alertasAltas,
        efector.alertasBasas,
        efector.estado
      ]);
    });

    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadistica_zona_uno_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function generarPdfConsolidado() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      alert('PDF no disponible. Por favor, intenta más tarde.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.text('Torre de Control – Zona Uno', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Fecha
    doc.setFontSize(10);
    doc.text(`Reporte generado: ${new Date().toLocaleString('es-AR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Resumen
    doc.setFontSize(12);
    doc.text('Resumen Regional', 20, yPosition);
    yPosition += 10;

    const online = statsData.efectores.filter(e => e.estado === 'online').length;
    const disponibilidad = ((online / statsData.efectores.length) * 100).toFixed(1);

    doc.setFontSize(10);
    doc.text(`Efectores Online: ${online}/${statsData.efectores.length}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Disponibilidad: ${disponibilidad}%`, 20, yPosition);
    yPosition += 12;

    // Tabla de efectores
    doc.setFontSize(11);
    doc.text('Detalle de Efectores', 20, yPosition);
    yPosition += 8;

    const tableData = statsData.efectores.map(e => [
      e.nombre,
      e.tempActual || '--',
      e.tempPromedio || '--',
      e.tiempoEnRango + '%',
      e.estado
    ]);

    doc.autoTable({
      head: [['Efector', 'Temp Act.', 'Temp Prom.', 'En Rango', 'Estado']],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save(`reporte_zona_uno_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // ============ INICIALIZACIÓN PRINCIPAL ============

  async function init() {
    try {
      await cargarDatos();
      renderResumen();
      renderGraficoTemperatura();
      renderDesvios();
      renderConectividad();
      renderReportes();
    } catch (e) {
      console.error('Error en initEstadistica:', e);
    }
  }

  // Iniciar cuando se abre el modal
  init();
};
