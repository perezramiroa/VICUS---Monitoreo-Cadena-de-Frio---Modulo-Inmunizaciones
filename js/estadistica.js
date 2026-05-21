/**
 * Torre de Control Zona Uno - Módulo de Estadística v3
 * Integración de: Propuesta C (Gestión Regional) + Antigravity (UX Premium)
 * 
 * CAMBIO FUNDAMENTAL:
 * - Analiza SENSORES INDIVIDUALES (campos de ThingSpeak) en lugar de canales
 * - Usa los nombres reales de sensores del dashboard
 * - Filtra solo campos de temperatura (excluye Wi-Fi, humedad, etc.)
 */

window.initEstadistica = function () {
  const overlay = document.getElementById('estadisticaOverlay');
  if (!overlay) return;

  // ============ ESTADO GLOBAL ============
  let statsData = {
    sensores: [], // Array de sensores individuales
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
      // Primero intentar usar CONFIG_INMUNO
      if (typeof CONFIG_INMUNO !== 'undefined' && CONFIG_INMUNO.canales) {
        const canalesArray = [];
        for (const [nombre, config] of Object.entries(CONFIG_INMUNO.canales)) {
          canalesArray.push({
            id: config.id,
            key: config.key,
            nombre: nombre,
            ...config
          });
        }
        return { canales: canalesArray };
      }

      // Fallback a sessionStorage
      const config = JSON.parse(sessionStorage.getItem('vicus_inmuno_config'));
      return config || { canales: [] };
    } catch (e) {
      console.error('Error al leer config:', e);
      return { canales: [] };
    }
  }

  /**
   * Obtiene metadatos del canal usando feeds con results=0
   * Esta es una forma más confiable que el endpoint .json directo
   */
  async function fetchMetadatosThingSpeak(canalId, apiKey) {
    try {
      const response = await fetch(
        `https://api.thingspeak.com/channels/${canalId}/feeds.json?api_key=${apiKey}&results=0`
      );
      
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn(`Error fetching metadatos para canal ${canalId}:`, e);
      return null;
    }
  }

  /**
   * Obtiene datos históricos de un campo específico
   */
  async function fetchCampoHistorico(canalId, apiKey, field) {
    try {
      const response = await fetch(
        `https://api.thingspeak.com/channels/${canalId}/fields/${field}.json?api_key=${apiKey}&results=100`
      );
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn(`Error fetching campo ${field} del canal ${canalId}:`, e);
      return null;
    }
  }

  /**
   * Calcula métricas de un sensor individual
   */
  function calcularMetricasSensor(nombreSensor, nombreCanal, datosHistorico, min = 2.0, max = 8.0) {
    if (!datosHistorico || !datosHistorico.feeds || datosHistorico.feeds.length === 0) {
      return {
        nombre: nombreSensor,
        canal: nombreCanal,
        tempActual: null,
        tempPromedio: null,
        tiempoEnRango: 0,
        alertasAltas: 0,
        alertasBasas: 0,
        estado: 'sin datos',
        criticidad: 'desconocida',
        datos: []
      };
    }

    const feeds = datosHistorico.feeds;
    let tempValues = [];
    let alertasAltas = 0;
    let alertasBasas = 0;
    let datos = [];

    // Extraer temperaturas (field_value es el formato de feeds.json)
    feeds.forEach(feed => {
      const temp = parseFloat(feed.field_value);
      if (!isNaN(temp) && temp !== null && temp !== -127 && feed.field_value !== '') {
        tempValues.push(temp);
        datos.push({
          timestamp: feed.created_at,
          temp: temp
        });
        if (temp > max) alertasAltas++;
        if (temp < min) alertasBasas++;
      }
    });

    if (tempValues.length === 0) {
      return {
        nombre: nombreSensor,
        canal: nombreCanal,
        tempActual: null,
        tempPromedio: null,
        tiempoEnRango: 0,
        alertasAltas: 0,
        alertasBasas: 0,
        estado: 'sin datos',
        criticidad: 'desconocida',
        datos: []
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
      nombre: nombreSensor,
      canal: nombreCanal,
      tempActual: tempActual.toFixed(1),
      tempPromedio: tempPromedio.toFixed(1),
      tiempoEnRango: parseFloat(tiempoEnRango),
      alertasAltas,
      alertasBasas,
      estado: 'online',
      criticidad,
      datos: datos
    };
  }

  /**
   * Carga todos los sensores individuales
   */
  async function cargarDatos() {
    const config = getConfigActual();
    statsData.sensores = [];

    console.log(`[Estadística] Cargando sensores de ${config.canales.length} canales...`);

    // Para cada canal, obtener metadatos y luego datos de cada campo
    for (const canal of config.canales) {
      try {
        const metadatos = await fetchMetadatosThingSpeak(canal.id, canal.key);
        if (!metadatos || !metadatos.channel) continue;

        // Procesar cada campo del canal
        for (let i = 1; i <= 8; i++) {
          const fieldName = `field${i}`;
          const fieldLabel = metadatos.channel[fieldName] || metadatos.channel[`${fieldName}_name`];
          
          if (!fieldLabel) continue;

          // Filtrar solo campos de temperatura (excluir Wi-Fi, RSSI, humedad ambiente, etc.)
          const labelLower = fieldLabel.toLowerCase();
          const excludeKeywords = ['ambiente', 'wifi', 'rssi', 'intensidad', 'señal', 'nivel', 'humedad ext'];
          if (excludeKeywords.some(key => labelLower.includes(key))) {
            console.log(`[Estadística] Ignorando campo no-temperatura: ${fieldLabel}`);
            continue;
          }

          // Obtener datos históricos del campo
          const datosHistorico = await fetchCampoHistorico(canal.id, canal.key, i);
          const nombreCanal = canal.nombre || `Canal ${canal.id}`;
          const metricas = calcularMetricasSensor(fieldLabel, nombreCanal, datosHistorico);
          statsData.sensores.push(metricas);

          console.log(`[Estadística] ${canal.nombre} - ${fieldLabel}: ${metricas.tempActual}°C (${metricas.estado})`);
        }
      } catch (e) {
        console.error(`Error procesando canal ${canal.id}:`, e);
      }
    }

    // Ordenar por criticidad
    statsData.sensores.sort((a, b) => {
      const orden = { critical: 0, warning: 1, normal: 2, desconocida: 3 };
      return orden[a.criticidad] - orden[b.criticidad];
    });

    console.log(`[Estadística] Datos cargados. Total: ${statsData.sensores.length} sensores`);
  }

  // ============ RENDERIZADO DE PESTAÑAS ============

  /**
   * Renderiza la pestaña de Resumen Regional
   */
  function renderResumen() {
    // Ranking de criticidad
    const criticidadList = overlay.querySelector('#criticidadList');
    criticidadList.innerHTML = '';

    if (statsData.sensores.length === 0) {
      criticidadList.innerHTML = '<p class="placeholder">No hay datos disponibles</p>';
      return;
    }

    statsData.sensores.forEach((sensor, idx) => {
      const item = document.createElement('div');
      item.className = `criticidad-item ${sensor.criticidad}`;
      item.innerHTML = `
        <div class="criticidad-info">
          <div class="criticidad-name">#${idx + 1} ${sensor.nombre} (${sensor.canal})</div>
          <div class="criticidad-detail">${sensor.estado} • ${sensor.tiempoEnRango}% en rango</div>
        </div>
        <div class="criticidad-value">${sensor.tempActual || '--'}°C</div>
      `;
      criticidadList.appendChild(item);
    });

    // Conectividad
    const online = statsData.sensores.filter(e => e.estado === 'online').length;
    const offline = statsData.sensores.length - online;
    const disponibilidad = statsData.sensores.length > 0 ? ((online / statsData.sensores.length) * 100).toFixed(1) : '0';

    overlay.querySelector('#efectoresOnline').textContent = online;
    overlay.querySelector('#efectoresOffline').textContent = offline;
    overlay.querySelector('#disponibilidad').textContent = disponibilidad + '%';

    // Desvíos pendientes
    overlay.querySelector('#desviosPendientes').textContent = '0';

    // KPIs consolidados
    const tempPromedio = statsData.sensores.length > 0 ? (
      statsData.sensores.reduce((sum, e) => sum + (parseFloat(e.tempPromedio) || 0), 0) /
      statsData.sensores.length
    ).toFixed(1) : '--';

    const tiempoPromedio = statsData.sensores.length > 0 ? (
      statsData.sensores.reduce((sum, e) => sum + e.tiempoEnRango, 0) /
      statsData.sensores.length
    ).toFixed(1) : '--';

    const alertasAltas = statsData.sensores.reduce((sum, e) => sum + e.alertasAltas, 0);
    const alertasBasas = statsData.sensores.reduce((sum, e) => sum + e.alertasBasas, 0);

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
    if (!ctx || !window.Chart) {
      console.warn('Chart.js no está disponible o el canvas no existe');
      return;
    }

    // Destruir gráfico anterior si existe
    if (window.tempChartInstance) {
      window.tempChartInstance.destroy();
    }

    if (statsData.sensores.length === 0) {
      console.warn('No hay datos para mostrar en el gráfico');
      return;
    }

    // Mostrar todos los sensores en un gráfico scrolleable
    const labels = statsData.sensores.map(s => `${s.nombre}\n(${s.canal})`);
    const datos = statsData.sensores.map(s => parseFloat(s.tempActual) || 0);

    window.tempChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
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
            borderWidth: 2,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            labels: { color: 'rgba(229, 231, 235, 0.8)' }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const sensor = statsData.sensores[context.dataIndex];
                return `Rango: 2-8°C | En rango: ${sensor.tiempoEnRango}%`;
              }
            }
          }
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

  /**
   * Renderiza tabla de desvíos
   */
  function renderDesvios() {
    const tbody = overlay.querySelector('#desviosTable tbody');
    if (!tbody) return;

    // Mostrar sensores con alertas
    const sensoresConAlerta = statsData.sensores.filter(s => s.alertasAltas > 0 || s.alertasBasas > 0);

    if (sensoresConAlerta.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="placeholder">No hay desvíos registrados en este período</td>
        </tr>
      `;
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

  /**
   * Renderiza timeline de conectividad
   */
  function renderConectividad() {
    const timeline = overlay.querySelector('#timelineConectividad');
    if (!timeline) return;

    const online = statsData.sensores.filter(s => s.estado === 'online').length;
    const offline = statsData.sensores.length - online;

    timeline.innerHTML = `
      <p style="margin-bottom: 12px;">
        <strong>Estado de Conectividad:</strong> ${online} en línea, ${offline} sin datos
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: rgba(16, 185, 129, 1);">${online}</div>
          <div style="font-size: 12px; color: rgba(148, 163, 184, 0.8);">Sensores Online</div>
        </div>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: rgba(239, 68, 68, 1);">${offline}</div>
          <div style="font-size: 12px; color: rgba(148, 163, 184, 0.8);">Sin Datos</div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza sección de reportes
   */
  function renderReportes() {
    const btnExportarCsv = overlay.querySelector('#btnExportarCsv');
    if (btnExportarCsv) {
      btnExportarCsv.addEventListener('click', () => exportarCsv());
    }

    const btnGenerarPdfConsolidado = overlay.querySelector('#btnGenerarPdfConsolidado');
    if (btnGenerarPdfConsolidado) {
      btnGenerarPdfConsolidado.addEventListener('click', () => generarPdfConsolidado());
    }

    const btnExportarDesviosCsv = overlay.querySelector('#btnExportarDesviosCsv');
    if (btnExportarDesviosCsv) {
      btnExportarDesviosCsv.addEventListener('click', () => exportarDesviosCsv());
    }
  }

  // ============ FUNCIONES DE EXPORTACIÓN ============

  function exportarCsv() {
    const rows = [['Sensor', 'Canal', 'Temperatura (°C)', 'Promedio (°C)', 'Tiempo en Rango (%)', 'Alertas Altas', 'Alertas Bajas', 'Estado']];

    statsData.sensores.forEach(sensor => {
      rows.push([
        sensor.nombre,
        sensor.canal,
        sensor.tempActual || '--',
        sensor.tempPromedio || '--',
        sensor.tiempoEnRango,
        sensor.alertasAltas,
        sensor.alertasBasas,
        sensor.estado
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

  function exportarDesviosCsv() {
    const sensoresConAlerta = statsData.sensores.filter(s => s.alertasAltas > 0 || s.alertasBasas > 0);
    const rows = [['Sensor', 'Canal', 'Alertas Altas', 'Alertas Bajas', 'Tiempo en Rango (%)']];

    sensoresConAlerta.forEach(s => {
      rows.push([
        s.nombre,
        s.canal,
        s.alertasAltas,
        s.alertasBasas,
        s.tiempoEnRango
      ]);
    });

    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `desvios_sensores_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function generarPdfConsolidado() {
    try {
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        alert('PDF no disponible. Por favor, intenta más tarde.');
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Título
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text('Torre de Control – Zona Uno', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Fecha
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Reporte generado: ${new Date().toLocaleString('es-AR')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Resumen
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumen de Sensores', 20, yPosition);
      yPosition += 10;

      const online = statsData.sensores.filter(s => s.estado === 'online').length;
      const disponibilidad = statsData.sensores.length > 0 ? ((online / statsData.sensores.length) * 100).toFixed(1) : '0';

      doc.setFontSize(10);
      doc.text(`Total de Sensores: ${statsData.sensores.length}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Sensores Online: ${online}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Disponibilidad: ${disponibilidad}%`, 20, yPosition);
      yPosition += 12;

      // Tabla de sensores
      doc.setFontSize(11);
      doc.text('Detalle de Sensores', 20, yPosition);
      yPosition += 8;

      const tableData = statsData.sensores.map(s => [
        s.nombre.substring(0, 25),
        s.canal.substring(0, 20),
        s.tempActual || '--',
        s.tempPromedio || '--',
        s.tiempoEnRango + '%',
        s.estado
      ]);

      doc.autoTable({
        head: [['Sensor', 'Canal', 'Temp Act.', 'Temp Prom.', 'En Rango', 'Estado']],
        body: tableData,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { textColor: [0, 0, 0], fontSize: 8 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 }
        }
      });

      doc.save(`reporte_sensores_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el PDF: ' + e.message);
    }
  }

  /**
   * Motor de Sugerencias de Gestión
   */
  function generarSugerencias() {
    const sugerencias = [];
    
    statsData.sensores.forEach(s => {
      if (s.criticidad === 'critical') {
        sugerencias.push({
          tipo: 'error',
          texto: `🚨 **${s.nombre}** (${s.canal}) requiere acción inmediata. Temperatura actual: ${s.tempActual}°C.`,
          accion: 'Verificar equipo y contactar responsable.'
        });
      } else if (s.criticidad === 'warning') {
        sugerencias.push({
          tipo: 'warning',
          texto: `⚠️ **${s.nombre}** (${s.canal}) presenta inestabilidad (${s.tiempoEnRango}% en rango).`,
          accion: 'Revisar aislamiento y funcionamiento del equipo.'
        });
      }
    });

    // Mostrar sugerencias en el modal
    const container = overlay.querySelector('#criticidadList');
    if (container && sugerencias.length > 0) {
      const sugBox = document.createElement('div');
      sugBox.className = 'section-box';
      sugBox.style.background = 'rgba(59, 130, 246, 0.1)';
      sugBox.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      sugBox.innerHTML = '<h3>💡 Sugerencias de Gestión</h3>';
      
      const list = document.createElement('ul');
      list.style.paddingLeft = '20px';
      list.style.fontSize = '0.85rem';
      list.style.color = 'var(--text-primary)';
      
      sugerencias.slice(0, 5).forEach(s => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.innerHTML = `${s.texto} <br><span style="color:var(--accent-teal); font-size:0.75rem;">↳ ${s.accion}</span>`;
        list.appendChild(li);
      });
      
      sugBox.appendChild(list);
      container.prepend(sugBox);
    }
  }

  // ============ INICIALIZACIÓN PRINCIPAL ============

  async function init() {
    try {
      console.log('[Estadística] Inicializando Torre de Control (Sensores Individuales)...');
      await cargarDatos();
      renderResumen();
      generarSugerencias();
      renderGraficoTemperatura();
      renderDesvios();
      renderConectividad();
      renderReportes();
      console.log('[Estadística] Torre de Control lista');
    } catch (e) {
      console.error('Error en initEstadistica:', e);
    }
  }

  // Iniciar cuando se abre el modal
  init();
};
