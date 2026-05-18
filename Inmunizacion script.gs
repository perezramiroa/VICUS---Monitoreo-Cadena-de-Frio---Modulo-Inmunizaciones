/**
 * ============================================================
 *  VICUS - INMUNIZACIÓN |  Google Apps Script (PROFESIONAL V4.2)
 *  Hospital Natalio Burd - Sistema Multi-Centro
 *  Desarrollado por Ingeniero Perez Ramiro
 * ============================================================
 */

const CENTROS = {
  "11 de Octubre": { tecnico: "1-Kb4PZ0atScebpspLL6Ia7c2Obu43XfS", semanal: "16zXWFpfuToLd3R4UMJirI3fHM8WhAnkd", sheet: "10A4D8mwNwFBJS_RqkxsIehDY9-vOB5XS", desvio: "1cd-S5aoIij0Y74gWkZX5efRUu1SVRFVF" },
  "Costa de Reyes": { tecnico: "1O6vrCQW6pSMhW0yXb9K_phm2SKMyXFWA", semanal: "1IDTZVB49ZTcNA7fhq7sQQuVCFjpWVAW-", sheet: "1y0PqA6qtcXD0q4nhg-HBWK5S6EpeU1SM", desvio: "1_yCz-MIXQt6FjBNux5l0jfLUMd-z2NQp" },
  "Hospital Centenario": { tecnico: "1vvtsDsdD3xdqqwTe3_MFdutiRTGNonPg", semanal: "1_6htpYwGwxNkUlZyuBNhyhKbXaNW5IPQ", sheet: "1rxDKuG4knqS5cXSLadklfqFGWB4n3vX2", desvio: "1q0Yrtzv6oSK6l-ykfuZ9ZksVJzwDeOBp" },
  "Hospital Chañar": { tecnico: "1IdwQT3v1T-uHTa0Ni4MZHkWyVAgf8LzK", semanal: "1x2CiZxrfv-iVdVBwAWWQ3vDjqhH9BRff", sheet: "1tKC6qvZ7lMwtw3Uv7EoQRNwUaV0quA3N", desvio: "1q8s4Wllzj4uz_0gf6mbDwPXoDP7cloef" },
  "Nueva España": { tecnico: "1XI_QiSL7VXkI1PaZUM1P8F7iKrcCTNf0", semanal: "1hawLuNoFj3ZMyuSRXxNkye1eruSxO8YI", sheet: "12nVB4HtY56NBsXdipRMVB77H3fLJPmiq", desvio: "1XbjIZ_BA9KWe20TdpxX3WMpJ5NsswxoQ" },
  "Sarmiento 1": { tecnico: "1d9wiHgEoKs4OmgLi9dapvzHCZUUYj-l9", semanal: "1N163HyXD8WCQef5FzANrDwNJ5ZOBfD3q", sheet: "13fkDm_102G6IodfDK3PRTorrYQuqYgqA", desvio: "15im-ylfLRY9wd8_mTpwNUC4FPwxSWGyf" },
  "Sarmiento 2": { tecnico: "1pUwu374roF1-7QOHnt8saAvTD66_k4rv", semanal: "14RSuSAXsOsYdFTlKMeHeP718h7n7glx9", sheet: "1Z_Q4qsi9UitSgpwPjkn4ATQhmyvsyqe9", desvio: "1gQjztb4YUrFqzLUlp_lkutX17NGvMwlk" },
  "VAN": { tecnico: "1iA6WlL387h9lH7LRHyG3KqEKyo1DUIz_", semanal: "10dDvfWEYGC4A8tn-OXsHs6XPyQIvj4gy", sheet: "1VG9Kd-LgF-w4-lAU91SJVDfu0mo50sJV", desvio: "114Q_l-ul61MKeb58B65kN1vOdgDvo47t" },
  "VAS": { tecnico: "1i7TfhLQCl93RXm75K6RzLu67o0fU_Ki6", semanal: "14NejZ-PcK4NUhxUvpDsi9I08BbF94rJF", sheet: "1nduAcMyFPJ7h7PUrDGeUu83aFzJhUAPe", desvio: "1oDwYGACHJt_29IknBSDEGuAJOUJzLd_V" },
  "Villa Obrera": { tecnico: "1-DZsi7UkruU646KlIdfyz7bNt_KVs0V3", semanal: "1pmmAczecphzLSqJ-Tz5aL0oJo5mjeTBt", sheet: "1V9elGuGb09QQ7soIzR4CTMNMiBg9naRX", desvio: "1mm7a6lz3LBF_CnEN9vNiMEIx3_uOL5Ii" },
  "Zona 1": { tecnico: "1_3_S714T-PcwKOHeThZEukkPTUB-rRuS", semanal: "1BEcVkfeGZeKFTvdrKv17tmeo7baGu11r", sheet: "19DEi2CH2d1_PZ5VZQ1HNJEoBXnUWY3_4", desvio: "1_DgTnjYqLgDfQorIinGimNYgmrS4_Peo" }
};

const SENSORES = [
  { id: '2986932', k: '9ODQC0Q4Y05C1O1T', n: 'Hosp Vacunatorio 1', eq: 'Equipo Inm', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2986935', k: 'Q1CXSNKL68D24MJH', n: 'Hosp Vacunatorio 2', eq: 'Equipo Inm', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2993812', k: 'PNS5MD5VS74CKIIM', n: 'Depo Vacunatorio 1', eq: 'Equipo Inm', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2993815', k: 'XZ0DG337HFATUG1O', n: 'Depo Vacunatorio 2', eq: 'Freezer Inm', field: 'field2', centro: 'Hospital Centenario' },
  { id: '3003527', k: '9ALDC8QUP8JV6ZDJ', n: 'Sarmiento 1', eq: 'Equipo Inm', field: 'field1', centro: 'Sarmiento 1' },
  { id: '3102139', k: 'YPWRU12M4LY6DBIX', n: 'Sarmiento 2', eq: 'Equipo Inm', field: 'field1', centro: 'Sarmiento 2' },
  { id: '3015641', k: '4IV9V3L1RC08AAQ5', n: 'Villa Obrera', eq: 'Equipo Inm', field: 'field1', centro: 'Villa Obrera' },
  { id: '3018408', k: 'ZY1L55G8AUXGCV9B', n: 'Nueva España', eq: 'Equipo Inm', field: 'field1', centro: 'Nueva España' },
  { id: '3019919', k: 'BGIYFCS3AS3BBQC0', n: '11 de Octubre', eq: 'Equipo Inm', field: 'field1', centro: '11 de Octubre' },
  { id: '3060520', k: 'YBS2XVLA80RQ63J6', n: 'VAN', eq: 'Equipo Inm', field: 'field1', centro: 'VAN' },
  { id: '3079464', k: '18OTBS7ODP225VBW', n: 'VAS', eq: 'Equipo Inm', field: 'field1', centro: 'VAS' },
  { id: '3090672', k: '7K994UH4606YRUE1', n: 'Costa Reyes', eq: 'Equipo Inm', field: 'field1', centro: 'Costa de Reyes' },
  { id: '3082646', k: 'TSE6UAW72LLR8R39', n: 'Hosp Chañar 1', eq: 'Equipo Inm', field: 'field1', centro: 'Hospital Chañar' },
  { id: '3125888', k: 'SCAORB4D3OCPE9DK', n: 'Hosp Chañar 2', eq: 'Equipo Inm', field: 'field1', centro: 'Hospital Chañar' },
  { id: '3016635', k: '8QKPERAJWIATGC5F', n: 'Zona 1 - 1', eq: 'Equipo Inm', field: 'field1', centro: 'Zona 1' },
  { id: '3016636', k: 'SAP43F3FB83V79KP', n: 'Zona 1 - 2', eq: 'Equipo Inm', field: 'field1', centro: 'Zona 1' }
];

function ejecutarReporteSemanal() {
  const properties = PropertiesService.getScriptProperties();
  let currentCentroIndex = parseInt(properties.getProperty("CURRENT_CENTRO_INDEX") || "0");
  
  const nombresCentros = Object.keys(CENTROS);
  
  // Si ya procesamos todos, limpiar y terminar
  if (currentCentroIndex >= nombresCentros.length) {
    properties.deleteProperty("CURRENT_CENTRO_INDEX");
    eliminarTriggersDeContinuacion();
    console.log("¡Reporte Semanal consolidado completado exitosamente para TODOS los centros!");
    return;
  }
  
  const hoy = new Date();
  const haceSieteDias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fechaEmision = Utilities.formatDate(hoy, "GMT-3", "dd/MM/yyyy");
  const rangoTexto = Utilities.formatDate(haceSieteDias, "GMT-3", "dd/MM/yyyy") + " - " + fechaEmision;

  // Procesar un bloque de 3 centros en esta ejecución
  const limite = Math.min(currentCentroIndex + 3, nombresCentros.length);
  console.log(`Iniciando procesamiento de bloque: Centros del ${currentCentroIndex + 1} al ${limite} de ${nombresCentros.length}`);
  
  for (let idx = currentCentroIndex; idx < limite; idx++) {
    const nombreCentro = nombresCentros[idx];
    console.log(`Procesando centro: ${nombreCentro}`);
    
    const configCentro = CENTROS[nombreCentro];
    const sensoresDelCentro = SENSORES.filter(s => s.centro === nombreCentro);
    const feedsPorSensor = [];
    
    sensoresDelCentro.forEach(s => {
      try {
        const data = fetchThingSpeakDataCompleto(s.id, s.k, 7);
        if (!data || !data.feeds || data.feeds.length === 0) return;
        
        feedsPorSensor.push({ sensor: s, feeds: data.feeds });
        
        const trazabilidad = "AUTO-INM-" + Utilities.formatDate(hoy, "GMT-3", "yyyyMMdd") + "-" + s.id;
        const analizada = analizarDatos(data.feeds, s.field);
        const conectividad = analizarConectividad(data.feeds, s.field);
        const grafico = generarGraficoCurva(data.feeds, s.field, s.n);
        
        const pdfBlob = generarPDFOficial(s, fechaEmision, rangoTexto, trazabilidad, analizada, conectividad, grafico);
        
        const carpeta = DriveApp.getFolderById(configCentro.semanal);
        const file = carpeta.createFile(pdfBlob);
        file.setName("Informe_Semanal_" + s.n.replace(/ /g,"_") + "_" + trazabilidad + ".pdf");
        console.log(`  -> PDF generado para: ${s.n}`);
      } catch (e) {
        console.error(`  Error en sensor ${s.n}: ` + e.message);
      }
    });
    
    if (feedsPorSensor.length > 0) {
      try {
        generarSheetSemanal(feedsPorSensor, rangoTexto, hoy, configCentro.sheet);
        console.log(`  -> Planilla consolidada unificada creada para: ${nombreCentro}`);
      } catch (e) {
        console.error(`  Error generando planilla para ${nombreCentro}: ` + e.message);
      }
    }
  }
  
  // Actualizar índice para el siguiente bloque
  properties.setProperty("CURRENT_CENTRO_INDEX", limite.toString());
  
  if (limite >= nombresCentros.length) {
    // Terminamos todo en esta corrida
    properties.deleteProperty("CURRENT_CENTRO_INDEX");
    eliminarTriggersDeContinuacion();
    console.log("¡Reporte Semanal consolidado completado exitosamente para TODOS los centros!");
  } else {
    // Aún quedan centros, programar el siguiente bloque
    crearTriggerDeContinuacion();
    console.log(`Bloque completado. Programando la continuación del siguiente bloque en 1 minuto...`);
  }
}

function crearTriggerDeContinuacion() {
  eliminarTriggersDeContinuacion(); // evitar duplicados
  ScriptApp.newTrigger("ejecutarReporteSemanal")
    .timeBased()
    .after(60000) // ejecutar en 1 minuto (60000 ms es el mínimo soportado por Google)
    .create();
}

function eliminarTriggersDeContinuacion() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => {
    if (t.getHandlerFunction() === "ejecutarReporteSemanal") {
      ScriptApp.deleteTrigger(t);
    }
  });
}

function generarPDFOficial(sensor, fecha, rango, trazabilidad, analizada, conectividad, grafico) {
  const doc = DocumentApp.create('Temp_Reporte_' + sensor.n);
  const body = doc.getBody();
  body.setMarginLeft(25).setMarginRight(25).setMarginTop(25).setMarginBottom(25);
  const anchoMax = 545;

  const header = doc.addHeader();
  header.appendParagraph("PROGRAMA DE INMUNIZACIONES - " + sensor.centro.toUpperCase()).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
  header.appendHorizontalRule();

  const t1 = body.appendParagraph("INFORME TÉCNICO DE CADENA DE FRÍO");
  t1.setFontSize(14).setBold(true).setForegroundColor("#00384d").setSpacingAfter(4);
  body.appendParagraph("Según Disposición ANMAT 10.872/2020").setFontSize(9).setItalic(true).setSpacingAfter(10);

  body.appendParagraph("Dispositivo: " + sensor.n).setBold(true).setFontSize(11);
  body.appendParagraph("Período: " + rango).setBold(true).setFontSize(10);
  body.appendParagraph("Emisión: " + fecha + " | Trazabilidad: " + trazabilidad).setFontSize(8).setSpacingAfter(10);

  body.appendParagraph("CURVA TÉRMICA SEMANAL").setBold(true).setFontSize(10);
  body.appendParagraph("").setAlignment(DocumentApp.HorizontalAlignment.CENTER).appendInlineImage(grafico).setWidth(anchoMax).setHeight(250);

  const tablaAlertas = [["Fecha y Hora", "Valor", "Estado", "Duración"]];
  if (analizada.alertasFilas.length > 0) analizada.alertasFilas.forEach(f => tablaAlertas.push([f.h, f.v, f.e, f.d]));
  else tablaAlertas.push(["-", "-", "✅ Sin eventos fuera de rango", "-"]);
  estilizarTabla(body.appendTable(tablaAlertas));

  body.appendParagraph("\nCONECTIVIDAD:").setBold(true).setFontSize(10);
  body.appendParagraph(conectividad.texto).setFontSize(9);

  body.appendParagraph("\nANÁLISIS TÉCNICO:").setBold(true).setFontSize(10);
  body.appendParagraph(analizada.textoAnalisis).setFontSize(9).setItalic(true);

  const footer = doc.addFooter();
  footer.appendHorizontalRule();
  footer.appendParagraph("Hospital Natalio Burd - Vicus Monitoreo").setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(8);

  doc.saveAndClose();
  const pdf = doc.getAs('application/pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return pdf;
}

function analizarConectividad(feeds, field) {
  let cortes = 0;
  for (let i = 1; i < feeds.length; i++) {
    const diff = (new Date(feeds[i].created_at) - new Date(feeds[i-1].created_at)) / 60000;
    if (diff > 15) cortes++;
  }
  return { texto: cortes > 0 ? `Se detectaron ${cortes} interrupciones de señal mayores a 15 min.` : "Conectividad estable durante el período." };
}

function analizarDatos(feeds, field) {
  let alertasFilas = [];
  let lastState = 'normal';
  let startTime = null;
  feeds.forEach(f => {
    const val = parseFloat(f[field]);
    if (isNaN(val)) return;
    const state = (val > 8.0) ? 'Alta' : (val < 2.0) ? 'Baja' : 'normal';
    if (state !== lastState) {
      const hora = Utilities.formatDate(new Date(f.created_at), "GMT-3", "dd/MM HH:mm");
      if (state !== 'normal') {
        startTime = new Date(f.created_at);
        alertasFilas.push({ h: hora, v: val.toFixed(1) + "°C", e: state === 'Alta' ? "⚠️ Alerta Alta" : "⚠️ Alerta Baja", d: "--" });
      } else if (startTime) {
        const dur = (new Date(f.created_at) - startTime) / 60000;
        alertasFilas.push({ h: hora, v: val.toFixed(1) + "°C", e: "✅ Recuperación", d: formatDur(dur) });
      }
      lastState = state;
    }
  });
  return { 
    alertasFilas, 
    textoAnalisis: "Estabilidad térmica analizada según normativa.", 
    textoRecom: "• Continuar monitoreo.",
    notaTecnica: "NOTA TÉCNICA: ANMAT 10.872/2020."
  };
}

function generarSheetSemanal(feedsPorSensor, rangoTexto, fechaHoy, folderId) {
  try {
    const carpeta = DriveApp.getFolderById(folderId);
    const nombreArchivo = "Consolidado Semanal - " + feedsPorSensor[0].sensor.centro;
    
    // Buscar si ya existe una planilla con este nombre en la carpeta
    const archivos = carpeta.getFilesByName(nombreArchivo);
    let ss;
    if (archivos.hasNext()) {
      const archivo = archivos.next();
      ss = SpreadsheetApp.openById(archivo.getId());
    } else {
      // Si no existe, crear una nueva planilla
      ss = SpreadsheetApp.create(nombreArchivo);
      // Mover la planilla recién creada a la carpeta correspondiente
      const archivoDrive = DriveApp.getFileById(ss.getId());
      carpeta.addFile(archivoDrive);
      DriveApp.getRootFolder().removeFile(archivoDrive);
    }
    
    const nombreHoja = "Semana " + Utilities.formatDate(fechaHoy, "GMT-3", "dd-MM-yyyy");
    
    // Eliminar hoja si ya existe (re-ejecución)
    const hojaExistente = ss.getSheetByName(nombreHoja);
    if (hojaExistente) ss.deleteSheet(hojaExistente);
    
    const hoja = ss.insertSheet(nombreHoja);
    
    // ── ENCABEZADO PRINCIPAL ──────────────────────────────────
    hoja.getRange("A1").setValue("REGISTRO SEMANAL DE TEMPERATURAS - INMUNIZACIÓN");
    hoja.getRange("A1").setFontSize(13).setFontWeight("bold").setFontColor("#00384d");
    hoja.getRange("A2").setValue("Período: " + rangoTexto);
    hoja.getRange("A2").setFontSize(10).setFontStyle("italic");
    hoja.getRange("A3").setValue("Generado: " + Utilities.formatDate(fechaHoy, "GMT-3", "dd/MM/yyyy HH:mm"));
    hoja.getRange("A3").setFontSize(9).setFontColor("#64748b");
    
    // ── CONSTRUIR COLUMNAS DINÁMICAMENTE ─────────────────────
    // Col 1: Fecha/Hora | Col 2..N: un sensor por columna
    const encabezados = ["Fecha / Hora"];
    feedsPorSensor.forEach(fs => {
      encabezados.push(fs.sensor.n + "\n(" + fs.sensor.eq + ")");
    });
    
    const filaEncabezado = 5;
    const rangoEnc = hoja.getRange(filaEncabezado, 1, 1, encabezados.length);
    rangoEnc.setValues([encabezados]);
    rangoEnc.setBackground("#00384d").setFontColor("#ffffff").setFontWeight("bold")
            .setFontSize(10).setWrap(true).setVerticalAlignment("middle")
            .setHorizontalAlignment("center");
    hoja.setRowHeight(filaEncabezado, 45);
    
    // ── UNIFICAR TIMESTAMPS AGRUPANDO POR MINUTO ─────────────
    // Se agrupa por minuto para tener una sola fila limpia de tiempo
    const mapaTemp = {};
    feedsPorSensor.forEach((fs, idx) => {
      fs.feeds.forEach(feed => {
        const val = parseFloat(feed[fs.sensor.field]);
        if (isNaN(val) || val === -127) return;
        const d = new Date(feed.created_at);
        // Clave por minuto: "dd/MM/yyyy HH:mm"
        const clave = Utilities.formatDate(d, "GMT-3", "dd/MM/yyyy HH:mm");
        if (!mapaTemp[clave]) mapaTemp[clave] = { fecha: clave, valores: {} };
        // Si ya hay un valor para ese sensor en ese minuto, promediamos
        if (mapaTemp[clave].valores[idx] !== undefined) {
          mapaTemp[clave].valores[idx] = (mapaTemp[clave].valores[idx] + val) / 2;
        } else {
          mapaTemp[clave].valores[idx] = val;
        }
      });
    });
    
    // Ordenar por clave de fecha de manera cronológica
    const claves = Object.keys(mapaTemp).sort((a, b) => {
      const toDate = s => {
        const [fecha, hora] = s.split(' ');
        const [d, m, y] = fecha.split('/');
        return new Date(`${y}-${m}-${d}T${hora}:00`);
      };
      return toDate(a) - toDate(b);
    });
    
    // ── ESCRIBIR DATOS EN LOTES ──────────────────────────────
    const filas = claves.map(clave => {
      const entrada = mapaTemp[clave];
      const fila = [entrada.fecha];
      feedsPorSensor.forEach((_, idx) => {
        const v = entrada.valores[idx];
        fila.push(v !== undefined ? Math.round(v * 100) / 100 : "");
      });
      return fila;
    });
    
    if (filas.length > 0) {
      const filaInicio = filaEncabezado + 1;
      hoja.getRange(filaInicio, 1, filas.length, encabezados.length).setValues(filas);
      
      // ── FORMATO CONDICIONAL: rojo si fuera de rango (2°C - 8°C) ──
      feedsPorSensor.forEach((_, idx) => {
        const col = idx + 2; // Col 1 = fecha, sensores desde col 2
        const rangoCol = hoja.getRange(filaInicio, col, filas.length, 1);
        
        // Regla: valor > 8 → fondo rojo claro
        const reglAlta = SpreadsheetApp.newConditionalFormatRule()
          .whenNumberGreaterThan(8.0)
          .setBackground("#fecaca")
          .setFontColor("#dc2626")
          .setRanges([rangoCol])
          .build();
          
        // Regla: valor < 2 → fondo azul claro
        const reglBaja = SpreadsheetApp.newConditionalFormatRule()
          .whenNumberLessThan(2.0)
          .setBackground("#bfdbfe")
          .setFontColor("#1d4ed8")
          .setRanges([rangoCol])
          .build();
          
        const reglas = hoja.getConditionalFormatRules();
        reglas.push(reglAlta);
        reglas.push(reglBaja);
        hoja.setConditionalFormatRules(reglas);
      });
      
      // ── FORMATO DE COLUMNAS ───────────────────────────────────
      hoja.setColumnWidth(1, 140); // Fecha/Hora
      feedsPorSensor.forEach((_, idx) => hoja.setColumnWidth(idx + 2, 130));
      
      // Alternar colores de filas para legibilidad en un lote unificado (ultra-rápido)
      const colores2D = [];
      for (let i = 0; i < filas.length; i++) {
        const color = i % 2 === 0 ? "#f8fafc" : "#ffffff";
        colores2D.push(Array(encabezados.length).fill(color));
      }
      hoja.getRange(filaInicio, 1, filas.length, encabezados.length).setBackgrounds(colores2D);
      
      // Centrar columnas de temperatura
      hoja.getRange(filaInicio, 2, filas.length, feedsPorSensor.length)
          .setHorizontalAlignment("center").setNumberFormat("0.00");
    }
    
    // ── FILA DE RESUMEN ESTADÍSTICO ───────────────────────────
    const filaResumen = filaEncabezado + filas.length + 2;
    hoja.getRange(filaResumen, 1).setValue("RESUMEN ESTADÍSTICO")
        .setFontWeight("bold").setFontColor("#00384d").setFontSize(10);
        
    const etiquetas = ["Mínimo (°C)", "Máximo (°C)", "Promedio (°C)", "Lecturas totales"];
    etiquetas.forEach((etiq, i) => {
      hoja.getRange(filaResumen + 1 + i, 1).setValue(etiq).setFontWeight("bold");
    });
    
    feedsPorSensor.forEach((fs, idx) => {
      const col = idx + 2;
      
      // Calcular estadísticas directamente desde los datos unificados
      const valores = filas
        .map(f => f[col - 1])
        .filter(v => v !== "" && !isNaN(v))
        .map(Number);
        
      if (valores.length > 0) {
        const minVal = Math.min(...valores);
        const maxVal = Math.max(...valores);
        const avg = Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100;
        hoja.getRange(filaResumen + 1, col).setValue(minVal);
        hoja.getRange(filaResumen + 2, col).setValue(maxVal);
        hoja.getRange(filaResumen + 3, col).setValue(avg);
        hoja.getRange(filaResumen + 4, col).setValue(valores.length);
      } else {
        hoja.getRange(filaResumen + 1, col).setValue("--");
        hoja.getRange(filaResumen + 2, col).setValue("--");
        hoja.getRange(filaResumen + 3, col).setValue("--");
        hoja.getRange(filaResumen + 4, col).setValue(0);
      }
    });
    
    // Estilo del bloque de resumen
    hoja.getRange(filaResumen + 1, 1, 4, encabezados.length)
        .setBackground("#f1f5f9").setBorder(true, true, true, true, true, true);
        
    // Congelar fila de encabezado
    hoja.setFrozenRows(filaEncabezado);
  } catch(e) { console.error("Error en Sheet: " + e.message); }
}

function fetchThingSpeakDataCompleto(id, key, dias) {
  const url = `https://api.thingspeak.com/channels/${id}/feeds.json?api_key=${key}&minutes=${dias*1440}&results=8000`;
  const res = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
  return JSON.parse(res.getContentText());
}

function generarGraficoCurva(feeds, field, nombre) {
  const dataTable = Charts.newDataTable().addColumn(Charts.ColumnType.STRING, "T").addColumn(Charts.ColumnType.NUMBER, "°C");
  const step = Math.max(1, Math.floor(feeds.length / 300));
  for (let i = 0; i < feeds.length; i += step) {
    let val = parseFloat(feeds[i][field]);
    if (!isNaN(val)) dataTable.addRow([Utilities.formatDate(new Date(feeds[i].created_at), "GMT-3", "dd/MM HH:mm"), val]);
  }
  return Charts.newLineChart().setDataTable(dataTable).setDimensions(800, 300).build().getAs('image/png');
}

function estilizarTabla(t) { t.getRow(0).setBackgroundColor("#f1f5f9").setBold(true); }
function formatDur(m) { return m < 60 ? Math.round(m) + "m" : Math.floor(m/60) + "h " + Math.round(m%60) + "m"; }

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.action === 'guardarPDF') {
    const bytes = Utilities.base64Decode(body.pdfData);
    const blob = Utilities.newBlob(bytes, 'application/pdf', body.filename);
    let folderId = body.folderId;
    if (body.type === 'desvio' && body.centro && CENTROS[body.centro]) folderId = CENTROS[body.centro].desvio;
    else if (body.type === 'tecnico' && body.centro && CENTROS[body.centro]) folderId = CENTROS[body.centro].tecnico;
    const file = DriveApp.getFolderById(folderId).createFile(blob);
    return ContentService.createTextOutput(JSON.stringify({result: true, url: file.getUrl()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) { return ContentService.createTextOutput("Vicus Multi-Centro Online."); }
