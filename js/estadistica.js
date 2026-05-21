/**
 * Torre de Control Zona Uno - Módulo de Estadística v9 FINAL
 * REPLICANDO LÓGICA EXACTA DEL DASHBOARD
 */

window.initEstadistica = function () {
  const overlay = document.getElementById('estadisticaOverlay');
  if (!overlay) return;

  const MIN_GEN = 2.0;
  const MAX_GEN = 8.0;
  const MIN_FREEZER = -28;
  const MAX_FREEZER = -18;
  const TIMEOUT_OFFLINE_MS = 30 * 60 * 1000; // 30 minutos

  let statsData = {
    sensores: [],
    wifiData: [],
    wifiTimeSeries: []
  };

  // ============ REFERENCIAS AL DOM ============
  const closeBtn = overlay.querySelector('.close-btn');
  const tabs = overlay.querySelectorAll('.tab');
  const contents = overlay.querySelectorAll('.tab-content');

  // ============ INICIALIZACIÓN ============
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
      overlay.classList.add('hidden');
      // Asegurar que el overlay se oculte completamente
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
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
      const config = JSON.parse(sessionStorage.getItem('vicus_inmuno_config'));
      return config || { canales: [] };
    } catch (e) {
      console.error('Error al leer config:', e);
      return { canales: [] };
    }
  }

  /**
   * Carga todos los sensores usando EXACTAMENTE la misma lógica del dashboard
   */
  async function cargarDatos() {
    const config = getConfigActual();
    statsData.sensores = [];
    statsData.wifiData = [];
    statsData.wifiTimeSeries = [];
    const ahora = Date.now();

    console.log(`[Estadística] Cargando ${config.canales.length} canales...`);

    for (const c of config.canales) {
      try {
        const res = await fetch(`https://api.thingspeak.com/channels/${c.id}/feeds.json?api_key=${c.key}&results=100`);
        const data = await res.json();
        
        if (!data.channel || !data.feeds || data.feeds.length === 0) {
          console.warn(`[Estadística] Sin datos para canal ${c.id}`);
          continue;
        }

        const nombreEfector = data.channel.name || c.id;

        // Procesar cada campo (EXACTAMENTE como el dashboard)
        ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8'].forEach(f => {
          const label = data.channel[f];
          if (!label) return;

          const labelLower = label.toLowerCase();
          const excludeKeywords = ['ambiente', 'wifi', 'rssi', 'intensidad', 'señal', 'nivel'];
          const isWifi = excludeKeywords.some(key => labelLower.includes(key));

          // Buscar la última lectura válida
          let lastVal = NaN;
          let lastTime = null;
          for (let i = data.feeds.length - 1; i >= 0; i--) {
            const valTemp = parseFloat(data.feeds[i][f]);
            if (!isNaN(valTemp) && valTemp !== -127) {
              lastVal = valTemp;
              lastTime = data.feeds[i].created_at;
              break;
            }
          }

          // Determinar rango
          let min = MIN_GEN, max = MAX_GEN;
          let isFreezer = false;
          
          if (c.isFreezer && f === c.fieldFreezer) {
            min = MIN_FREEZER;
            max = MAX_FREEZER;
            isFreezer = true;
          }

          // Calcular tiempo de inactividad
          let tiempoInactividad = 0;
          let fechaUltimaLectura = null;
          if (lastTime) {
            const lastTimeMs = new Date(lastTime).getTime();
            tiempoInactividad = Math.floor((ahora - lastTimeMs) / 1000 / 60);
            const d = new Date(lastTime);
            const pad = n => String(n).padStart(2, '0');
            fechaUltimaLectura = `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
          }

          // Procesar datos históricos
          let tempValues = [];
          let wifiValues = [];
          let alertasAltas = 0;
          let alertasBasas = 0;
          let wifiTimeSeries = [];

          for (let i = data.feeds.length - 1; i >= 0; i--) {
            const valTemp = parseFloat(data.feeds[i][f]);
            if (!isNaN(valTemp) && valTemp !== -127) {
              if (isWifi) {
                wifiValues.push(valTemp);
                const d = new Date(data.feeds[i].created_at);
                const pad = n => String(n).padStart(2, '0');
                const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
                wifiTimeSeries.push({ time: timeStr, value: valTemp });
              } else {
                tempValues.push(valTemp);
                if (valTemp > max) alertasAltas++;
                if (valTemp < min) alertasBasas++;
              }
            }
          }

          // Formatear fecha y hora
          let lastTimeStr = '--/-- --:--';
          if (lastTime) {
            const d = new Date(lastTime);
            const pad = n => String(n).padStart(2, '0');
            lastTimeStr = `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
          }

          if (isWifi && wifiValues.length > 0) {
            const wifiPromedio = wifiValues.reduce((a, b) => a + b, 0) / wifiValues.length;
            const wifiMax = Math.max(...wifiValues);
            const wifiMin = Math.min(...wifiValues);
            
            // Calcular período de lectura
            const primeraTiempoMs = new Date(data.feeds[0].created_at).getTime();
            const ultimaTiempoMs = new Date(data.feeds[data.feeds.length - 1].created_at).getTime();
            const minutosTranscurridos = Math.floor((ultimaTiempoMs - primeraTiempoMs) / 1000 / 60);
            const periodoLectura = minutosTranscurridos > 60 
              ? `${Math.floor(minutosTranscurridos / 60)}h ${minutosTranscurridos % 60}m`
              : `${minutosTranscurridos}m`;
            
            statsData.wifiData.push({
              nombre: label,
              nombreEfector: nombreEfector,
              canalId: c.id,
              promedio: wifiPromedio.toFixed(1),
              max: wifiMax.toFixed(1),
              min: wifiMin.toFixed(1),
              actual: lastVal.toFixed(1),
              lastTimeStr: lastTimeStr,
              periodoLectura: periodoLectura,
              color: generarColorUnico(c.id + f),
              timeSeries: wifiTimeSeries
            });

            statsData.wifiTimeSeries.push({
              nombre: label,
              nombreEfector: nombreEfector,
              canalId: c.id,
              color: generarColorUnico(c.id + f),
              data: wifiTimeSeries
            });
          } else if (tempValues.length > 0) {
            const tempPromedio = tempValues.reduce((a, b) => a + b, 0) / tempValues.length;
            const tiempoEnRango = ((tempValues.filter(t => t >= min && t <= max).length / tempValues.length) * 100).toFixed(1);

            let criticidad = 'normal';
            let esAlerta = false;
            let estado = 'online';
            let mensajeOffline = null;
            
            if (!isNaN(lastVal)) {
              if (lastVal > max || lastVal < min) {
                criticidad = 'critical';
                esAlerta = true;
              }
            }

            // Detectar offline
            if (tiempoInactividad > 30) {
              estado = 'offline';
              criticidad = 'warning';
              mensajeOffline = `OFFLINE desde ${fechaUltimaLectura}`;
            }

            // Encontrar desvío más significativo
            let desvioMasSignificativo = null;
            let maxDesviacion = 0;
            
            for (let i = data.feeds.length - 1; i >= 0; i--) {
              const valTemp = parseFloat(data.feeds[i][f]);
              if (!isNaN(valTemp) && valTemp !== -127) {
                let desviacion = 0;
                if (valTemp > max) {
                  desviacion = valTemp - max;
                } else if (valTemp < min) {
                  desviacion = min - valTemp;
                }
                
                if (desviacion > maxDesviacion) {
                  maxDesviacion = desviacion;
                  const d = new Date(data.feeds[i].created_at);
                  const pad = n => String(n).padStart(2, '0');
                  const desvioTime = `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                  desvioMasSignificativo = {
                    temp: valTemp.toFixed(1),
                    time: desvioTime,
                    tipo: valTemp > max ? 'ALTA' : 'BAJA'
                  };
                }
              }
            }

            const tempMax = Math.max(...tempValues);
            const tempMin = Math.min(...tempValues);

            statsData.sensores.push({
              nombre: label,
              nombreEfector: nombreEfector,
              canalId: c.id,
              canalInterno: c.nombre || c.id,
              tempActual: isNaN(lastVal) ? null : lastVal.toFixed(1),
              tempPromedio: tempPromedio.toFixed(1),
              tempMax: tempMax.toFixed(1),
              tempMin: tempMin.toFixed(1),
              tiempoEnRango: parseFloat(tiempoEnRango),
              alertasAltas,
              alertasBasas,
              estado: estado,
              criticidad,
              esAlerta,
              lastTime: lastTime,
              lastTimeStr: lastTimeStr,
              tiempoInactividad: tiempoInactividad,
              min: min,
              max: max,
              isFreezer: isFreezer,
              rango: isFreezer ? `${min}°C a ${max}°C (Freezer)` : `${min}°C a ${max}°C (Heladera)`,
              desvioMasSignificativo: desvioMasSignificativo,
              rangoAnalisis: '(últimas ~2 horas)',
              tieneFormulario: false,
              mensajeOffline: mensajeOffline
            });

            console.log(`[Estadística] ${nombreEfector} - ${label}: ${lastVal.toFixed(1)}°C (${lastTimeStr}) - ${estado}`);
          }
        });
      } catch (e) {
        console.error(`Error procesando canal ${c.id}:`, e);
      }
    }

    // Ordenar por criticidad
    statsData.sensores.sort((a, b) => {
      const orden = { critical: 0, warning: 1, normal: 2 };
      return orden[a.criticidad] - orden[b.criticidad];
    });

    console.log(`[Estadística] Datos cargados. Total: ${statsData.sensores.length} sensores`);
  }

  // ============ UTILIDADES ============

  function generarColorUnico(seed) {
    const colores = [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    return colores[Math.abs(hash) % colores.length];
  }

  function calcularTiempoAnalisis() {
    if (statsData.sensores.length === 0) return 'N/A';
    return 'últimas ~2 horas (100 lecturas)';
  }

  // ============ RENDERIZADO ============

  function renderResumen() {
    const criticidadList = overlay.querySelector('#criticidadList');
    criticidadList.innerHTML = '';

    if (statsData.sensores.length === 0) {
      criticidadList.innerHTML = '<p class="placeholder">No hay datos disponibles</p>';
      return;
    }

    // Mostrar sugerencias
    const sugerencias = [];
    
    statsData.sensores.forEach(s => {
      if (s.estado === 'offline') {
        sugerencias.push({
          tipo: 'offline',
          texto: `📡 **${s.nombre}** (${s.nombreEfector}): OFFLINE ${s.mensajeOffline} - Revisar conectividad`
        });
      } else if (s.esAlerta) {
        const tipo = s.tempActual > s.max ? 'ALTA' : 'BAJA';
        sugerencias.push({
          tipo: 'actual',
          texto: `🚨 **${s.nombre}** (${s.nombreEfector}): ${s.tempActual}°C - Temperatura ${tipo} - Contactar responsable`
        });
      } else if (s.desvioMasSignificativo && s.desvioMasSignificativo.temp) {
        sugerencias.push({
          tipo: 'historico',
          texto: `⚠️ **${s.nombre}** (${s.nombreEfector}): Desvío detectado - ${s.desvioMasSignificativo.temp}°C (${s.desvioMasSignificativo.tipo}) el ${s.desvioMasSignificativo.time}`
        });
      }
    });

    if (sugerencias.length > 0) {
      const sugBox = document.createElement('div');
      sugBox.className = 'section-box';
      sugBox.style.background = 'rgba(239, 68, 68, 0.1)';
      sugBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      sugBox.style.marginBottom = '16px';
      sugBox.innerHTML = '<h3>💡 Sugerencias de Gestión</h3>';
      
      const list = document.createElement('ul');
      list.style.paddingLeft = '20px';
      list.style.fontSize = '0.85rem';
      list.style.color = 'var(--text-primary)';
      
      sugerencias.slice(0, 10).forEach(s => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        li.innerHTML = s.texto;
        list.appendChild(li);
      });
      
      sugBox.appendChild(list);
      criticidadList.appendChild(sugBox);
    }

    // Ranking de criticidad
    statsData.sensores.forEach((sensor, idx) => {
      const item = document.createElement('div');
      item.className = `criticidad-item ${sensor.criticidad}`;
      const estadoIcon = sensor.estado === 'offline' ? '📡' : '✓';
      item.innerHTML = `
        <div class="criticidad-info">
          <div class="criticidad-name">#${idx + 1} ${sensor.nombre}</div>
          <div class="criticidad-detail">${sensor.nombreEfector}</div>
          <div class="criticidad-detail" style="font-size: 0.75rem; color: rgba(148, 163, 184, 0.8);">Rango: ${sensor.rango} | Última: ${sensor.lastTimeStr}</div>
          <div class="criticidad-detail">${estadoIcon} ${sensor.estado} • ${sensor.tiempoEnRango}% en rango</div>
        </div>
        <div class="criticidad-value">${sensor.tempActual || '--'}°C</div>
      `;
      criticidadList.appendChild(item);
    });

    // KPIs
    const online = statsData.sensores.filter(s => s.estado === 'online').length;
    const offline = statsData.sensores.length - online;
    const disponibilidad = statsData.sensores.length > 0 ? ((online / statsData.sensores.length) * 100).toFixed(1) : 0;
    
    const sensoresOnline = statsData.sensores.filter(s => s.estado === 'online');
    const heladeras = sensoresOnline.filter(s => !s.isFreezer);
    const freezers = sensoresOnline.filter(s => s.isFreezer);
    
    const tempPromedioHeladeras = heladeras.length > 0 ? (
      heladeras.reduce((sum, e) => sum + parseFloat(e.tempPromedio), 0) / heladeras.length
    ).toFixed(1) : '--';
    
    const tempPromedioFreezers = freezers.length > 0 ? (
      freezers.reduce((sum, e) => sum + parseFloat(e.tempPromedio), 0) / freezers.length
    ).toFixed(1) : '--';
    
    const tiempoPromedio = sensoresOnline.length > 0 ? (
      sensoresOnline.reduce((sum, e) => sum + e.tiempoEnRango, 0) / sensoresOnline.length
    ).toFixed(1) : '--';
    
    const alertasAltas = statsData.sensores.reduce((sum, e) => sum + e.alertasAltas, 0);
    const alertasBasas = statsData.sensores.reduce((sum, e) => sum + e.alertasBasas, 0);

    overlay.querySelector('#efectoresOnline').textContent = online;
    overlay.querySelector('#efectoresOffline').textContent = offline;
    overlay.querySelector('#disponibilidad').textContent = disponibilidad + '%';
    overlay.querySelector('#desviosPendientes').textContent = sugerencias.length;
    overlay.querySelector('#kpiTempPromedio').textContent = `H: ${tempPromedioHeladeras}°C | F: ${tempPromedioFreezers}°C`;
    overlay.querySelector('#kpiTiempoRango').textContent = tiempoPromedio + '%';
    overlay.querySelector('#kpiAlertasAltas').textContent = alertasAltas;
    overlay.querySelector('#kpiAlertasBasas').textContent = alertasBasas;

    // Vincular botón "Ver detalles" con pestaña de desvíos
    const desviosBtn = overlay.querySelector('[onclick*="desvios"]') || 
                       Array.from(overlay.querySelectorAll('button')).find(b => b.textContent.includes('detalles'));
    if (desviosBtn) {
      desviosBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const desviosTab = overlay.querySelector('[data-tab="desvios"]');
        if (desviosTab) desviosTab.click();
      });
    }
  }

  function renderGraficoTemperatura() {
    const ctx = overlay.querySelector('#tempChart');
    if (!ctx || !window.Chart) return;

    if (window.tempChartInstance) {
      window.tempChartInstance.destroy();
    }

    const sensoresOnline = statsData.sensores.filter(s => s.estado === 'online');
    if (sensoresOnline.length === 0) return;

    const labels = sensoresOnline.map(s => `${s.nombre}\n${s.nombreEfector}\n${s.rango}`);
    const datos = sensoresOnline.map(s => parseFloat(s.tempActual) || 0);
    const colores = sensoresOnline.map((s, idx) => generarColorUnico(s.canalId + s.nombre));

    window.tempChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperatura Actual (°C)',
          data: datos,
          backgroundColor: colores.map(c => c + 'B3'),
          borderColor: colores,
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
            min: -30,
            max: 30,
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            ticks: { color: 'rgba(148, 163, 184, 0.8)', font: { size: 9 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }

  function renderDesvios() {
    const tbody = overlay.querySelector('#desviosTable tbody');
    if (!tbody) return;

    const sensoresConAlerta = statsData.sensores.filter(s => s.esAlerta || s.desvioMasSignificativo || s.estado === 'offline');

    if (sensoresConAlerta.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="placeholder">No hay alertas ni desvíos registrados</td></tr>`;
      return;
    }

    tbody.innerHTML = sensoresConAlerta.map(s => {
      const desvio = s.desvioMasSignificativo ? `${s.desvioMasSignificativo.temp}°C` : '--';
      const desvioTime = s.desvioMasSignificativo ? s.desvioMasSignificativo.time : '--';
      const estadoIcon = s.estado === 'offline' ? '📡 OFFLINE' : s.esAlerta ? '🚨 ALERTA' : '⚠️ DESVÍO';
      const formulario = s.tieneFormulario ? '✓ Sí' : '✗ No';
      return `
        <tr>
          <td>${s.nombreEfector}</td>
          <td>${s.nombre}</td>
          <td>${desvio}</td>
          <td>${desvioTime}</td>
          <td>${estadoIcon}</td>
          <td>${formulario}</td>
        </tr>
      `;
    }).join('');
  }

  function renderConectividad() {
    const timeline = overlay.querySelector('#timelineConectividad');
    if (!timeline) return;

    const sensoresOnline = statsData.sensores.filter(s => s.estado === 'online').length;
    const sensoresOffline = statsData.sensores.length - sensoresOnline;

    // Estado de conectividad
    let html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: rgba(16, 185, 129, 1);">${sensoresOnline}</div>
          <div style="font-size: 12px; color: rgba(148, 163, 184, 0.8);">Sensores Online</div>
        </div>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: rgba(239, 68, 68, 1);">${sensoresOffline}</div>
          <div style="font-size: 12px; color: rgba(148, 163, 184, 0.8);">Sensores Offline</div>
        </div>
      </div>
      <div style="font-size: 0.85rem; color: rgba(148, 163, 184, 0.9); margin-bottom: 20px;">
        <p><strong>Disponibilidad:</strong> ${((sensoresOnline / statsData.sensores.length) * 100).toFixed(1)}%</p>
        <p><strong>Rango de Análisis:</strong> ${calcularTiempoAnalisis()}</p>
      </div>

      <h4 style="margin-bottom: 16px;">📊 Gráfica de Niveles de Wi-Fi por Sensor</h4>
      <div style="margin-bottom: 20px;">
        <canvas id="wifiChart" style="max-height: 300px;"></canvas>
      </div>

      <h4 style="margin-bottom: 12px;">📈 Estadísticas de Wi-Fi (Máx, Mín, Promedio)</h4>
      <div style="overflow-x: auto; font-size: 0.8rem;">
        <table style="width: 100%; border-collapse: collapse; color: var(--text-primary);">
          <thead>
            <tr style="background: rgba(16, 185, 129, 0.1); border-bottom: 1px solid rgba(16, 185, 129, 0.3);">
              <th style="padding: 8px; text-align: left;">Sensor</th>
              <th style="padding: 8px; text-align: center;">Efector</th>
              <th style="padding: 8px; text-align: center;">Máx (%)</th>
              <th style="padding: 8px; text-align: center;">Mín (%)</th>
              <th style="padding: 8px; text-align: center;">Prom (%)</th>
              <th style="padding: 8px; text-align: center;">Período de Lectura</th>
            </tr>
          </thead>
          <tbody>
    `;

    statsData.wifiData.forEach(w => {
      html += `
        <tr style="background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
          <td style="padding: 8px;">${w.nombre}</td>
          <td style="padding: 8px; text-align: center; font-size: 0.75rem;">${w.nombreEfector}</td>
          <td style="padding: 8px; text-align: center;">${w.max}</td>
          <td style="padding: 8px; text-align: center;">${w.min}</td>
          <td style="padding: 8px; text-align: center;">${w.promedio}</td>
          <td style="padding: 8px; text-align: center;">${w.periodoLectura}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    timeline.innerHTML = html;

    // Renderizar gráfica de Wi-Fi
    setTimeout(() => renderGraficoWifi(), 100);
  }

  function renderGraficoWifi() {
    const ctx = overlay.querySelector('#wifiChart');
    if (!ctx || !window.Chart || statsData.wifiTimeSeries.length === 0) return;

    if (window.wifiChartInstance) {
      window.wifiChartInstance.destroy();
    }

    // Obtener el máximo número de puntos para alinear todos los gráficos
    const maxPuntos = Math.max(...statsData.wifiTimeSeries.map(s => s.data.length));
    const labels = Array.from({ length: maxPuntos }, (_, i) => `${i + 1}`);

    const datasets = statsData.wifiTimeSeries.map(serie => ({
      label: `${serie.nombre} (${serie.nombreEfector})`,
      data: serie.data.map(d => d.value),
      borderColor: serie.color,
      backgroundColor: serie.color + '33',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: serie.color,
      pointBorderColor: '#fff',
      pointBorderWidth: 1
    }));

    window.wifiChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            labels: { color: 'rgba(229, 231, 235, 0.8)', font: { size: 10 } },
            maxHeight: 100
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: 'rgba(148, 163, 184, 0.8)' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Nivel de Wi-Fi (%)' }
          },
          x: {
            ticks: { color: 'rgba(148, 163, 184, 0.8)', font: { size: 8 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Número de Lectura (100 total)' }
          }
        }
      }
    });
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
    const rows = [['Efector', 'Sensor', 'Rango', 'Temp Actual (°C)', 'Temp Máx (°C)', 'Temp Mín (°C)', 'Temp Prom (°C)', 'Tiempo en Rango (%)', 'Última Lectura', 'Tiempo Inactividad (min)', 'Estado']];

    statsData.sensores.forEach(s => {
      rows.push([
        s.nombreEfector,
        s.nombre,
        s.rango,
        s.tempActual || '--',
        s.tempMax || '--',
        s.tempMin || '--',
        s.tempPromedio || '--',
        s.tiempoEnRango,
        s.lastTimeStr,
        s.tiempoInactividad,
        s.estado
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
        s.nombreEfector.substring(0, 20),
        s.nombre.substring(0, 20),
        s.rango,
        s.tempActual || '--',
        s.tempMax || '--',
        s.tempMin || '--',
        s.tempPromedio || '--',
        s.tiempoEnRango + '%',
        s.lastTimeStr,
        s.tiempoInactividad,
        s.estado
      ]);

      doc.autoTable({
        head: [['Efector', 'Sensor', 'Rango', 'Actual', 'Máx', 'Mín', 'Prom', 'En Rango', 'Última', 'Inact', 'Estado']],
        body: tableData,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 6 },
        bodyStyles: { textColor: [0, 0, 0], fontSize: 5 },
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
