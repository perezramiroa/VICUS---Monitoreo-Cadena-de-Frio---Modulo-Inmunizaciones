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
  // --- Hospital Centenario (7 sensores) ---
  { id: '2986932', k: '9ODQC0Q4Y05C1O1T', n: 'Nº1 Sigma NHC9587', eq: 'Vacunatorio 1', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2986932', k: '9ODQC0Q4Y05C1O1T', n: 'Nº2 Briket', eq: 'Vacunatorio 1', field: 'field2', centro: 'Hospital Centenario' },
  { id: '2986935', k: 'Q1CXSNKL68D24MJH', n: 'Nº3 Briket NHC13273', eq: 'Vacunatorio 2', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2986935', k: 'Q1CXSNKL68D24MJH', n: 'Nº4 Angelantoni NHC4621', eq: 'Vacunatorio 2', field: 'field2', centro: 'Hospital Centenario' },
  { id: '2993812', k: 'PNS5MD5VS74CKIIM', n: 'Presvac 1', eq: 'Depo Vacunatorio 1', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2993812', k: 'PNS5MD5VS74CKIIM', n: 'Briket', eq: 'Depo Vacunatorio 1', field: 'field2', centro: 'Hospital Centenario' },
  { id: '2993815', k: 'XZ0DG337HFATUG1O', n: 'Presvac 2', eq: 'Depo Vacunatorio 2', field: 'field1', centro: 'Hospital Centenario' },
  { id: '2993815', k: 'XZ0DG337HFATUG1O', n: 'Freezer Inelro', eq: 'Depo Vacunatorio 2', field: 'field2', centro: 'Hospital Centenario', isFreezer: true },

  // --- Sarmiento 1 (2 sensores) ---
  { id: '3003527', k: '9ALDC8QUP8JV6ZDJ', n: 'Briket NHC11941', eq: 'Sarmiento 1', field: 'field1', centro: 'Sarmiento 1' },
  { id: '3003527', k: '9ALDC8QUP8JV6ZDJ', n: 'Eslabon de Lujo ERA34', eq: 'Sarmiento 1', field: 'field2', centro: 'Sarmiento 1' },

  // --- Sarmiento 2 (2 sensores) ---
  { id: '3102139', k: 'YPWRU12M4LY6DBIX', n: 'Heladera Bambi 1200/1', eq: 'Sarmiento 2', field: 'field1', centro: 'Sarmiento 2' },
  { id: '3102139', k: 'YPWRU12M4LY6DBIX', n: 'heladera Sigma', eq: 'Sarmiento 2', field: 'field2', centro: 'Sarmiento 2' },

  // --- Villa Obrera (1 sensor) ---
  { id: '3015641', k: '4IV9V3L1RC08AAQ5', n: 'Briket BK1F 1211 R1', eq: 'Villa Obrera', field: 'field1', centro: 'Villa Obrera' },

  // --- Nueva España (1 sensor) ---
  { id: '3018408', k: 'ZY1L55G8AUXGCV9B', n: 'Briket NHC13827', eq: 'Nueva España', field: 'field1', centro: 'Nueva España' },

  // --- 11 de Octubre (1 sensor) ---
  { id: '3019919', k: 'BGIYFCS3AS3BBQC0', n: 'Heladera Briket BK2F1310', eq: '11 de Octubre', field: 'field1', centro: '11 de Octubre' },

  // --- VAN (1 sensor) ---
  { id: '3060520', k: 'YBS2XVLA80RQ63J6', n: 'Heladera', eq: 'VAN', field: 'field1', centro: 'VAN' },

  // --- VAS (1 sensor) ---
  { id: '3079464', k: '18OTBS7ODP225VBW', n: 'Heladera Patrick 280', eq: 'VAS', field: 'field1', centro: 'VAS' },

  // --- Costa de Reyes (1 sensor) ---
  { id: '3090672', k: '7K994UH4606YRUE1', n: 'Heladera Briket', eq: 'Costa de Reyes', field: 'field1', centro: 'Costa de Reyes' },

  // --- Hospital Chañar (3 sensores) ---
  { id: '3082646', k: 'TSE6UAW72LLR8R39', n: 'Heladera Briket 1', eq: 'Hospital Chañar 1', field: 'field1', centro: 'Hospital Chañar' },
  { id: '3082646', k: 'TSE6UAW72LLR8R39', n: 'Briket 2', eq: 'Hospital Chañar 1', field: 'field2', centro: 'Hospital Chañar' },
  { id: '3125888', k: 'SCAORB4D3OCPE9DK', n: 'Heladera 3 Eslabon de Lujo', eq: 'Hospital Chañar 2', field: 'field1', centro: 'Hospital Chañar' },

  // --- Zona 1 (4 sensores) ---
  { id: '3016635', k: '8QKPERAJWIATGC5F', n: 'Briket 1', eq: 'Inmuno 1', field: 'field1', centro: 'Zona 1' },
  { id: '3016635', k: '8QKPERAJWIATGC5F', n: 'Briket 2', eq: 'Inmuno 1', field: 'field2', centro: 'Zona 1' },
  { id: '3016636', k: 'SAP43F3FB83V79KP', n: 'Diplomatic 3', eq: 'Inmuno 2', field: 'field1', centro: 'Zona 1' },
  { id: '3016636', k: 'SAP43F3FB83V79KP', n: 'Saiar 4', eq: 'Inmuno 2', field: 'field2', centro: 'Zona 1' }
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

  // Procesar exactamente 1 centro por ejecución para máxima seguridad y evitar límites de 6 min
  const limite = Math.min(currentCentroIndex + 1, nombresCentros.length);
  console.log(`Iniciando procesamiento: Centro ${currentCentroIndex + 1} de ${nombresCentros.length}`);
  
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
        const analizada = analizarDatos(data.feeds, s.field, s);
        const conectividad = analizarConectividad(data.feeds, s.field, s);
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

  // Márgenes mínimos para maximizar espacio
  body.setMarginLeft(20).setMarginRight(20).setMarginTop(20).setMarginBottom(20);
  const anchoMax = 555; // 595 - 40

  // --- CABECERA (aparece en TODAS las páginas) ---
  const logo = buscarLogoEnDrive("logo_rih.jpg");
  const header = doc.addHeader();
  if (logo) {
    const hp = header.appendParagraph("");
    hp.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    hp.appendInlineImage(logo).setWidth(anchoMax).setHeight(60);
  } else {
    header.appendParagraph("PROGRAMA DE INMUNIZACIONES - " + sensor.centro.toUpperCase()).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
  }
  header.appendHorizontalRule();

  // --- TÍTULO ---
  const t1 = body.appendParagraph("INFORME TÉCNICO DE CADENA DE FRÍO\nMONITOREO DE VACUNAS");
  t1.setFontSize(14).setBold(true).setForegroundColor("#00384d").setSpacingAfter(4);

  // --- NORMATIVA ---
  body.appendParagraph("Según Disposición ANMAT 10.872/2020")
    .setFontSize(9).setItalic(true).setSpacingAfter(10);

  // --- DATOS DEL DISPOSITIVO ---
  body.appendParagraph("Dispositivo: " + sensor.n)
    .setBold(true).setFontSize(11).setSpacingBefore(0).setSpacingAfter(2);
  body.appendParagraph("Establecimiento: " + sensor.centro + " | Equipo: " + sensor.eq)
    .setItalic(true).setFontSize(10).setSpacingAfter(2);
  body.appendParagraph("Período: " + rango)
    .setBold(true).setFontSize(10).setSpacingAfter(2);
  body.appendParagraph("Emisión: " + fecha + " | Trazabilidad: " + trazabilidad)
    .setFontSize(8).setSpacingAfter(10);

  // --- GRÁFICO ---
  body.appendParagraph("CURVA TÉRMICA SEMANAL")
    .setBold(true).setFontSize(10).setSpacingBefore(4).setSpacingAfter(4);
  const pChart = body.appendParagraph("");
  pChart.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pChart.appendInlineImage(grafico).setWidth(anchoMax).setHeight(300);

  // --- TABLA DE ALERTAS ---
  const minRange = sensor.isFreezer ? "-28°C" : "2°C";
  const maxRange = sensor.isFreezer ? "-18°C" : "8°C";
  body.appendParagraph(`\nALERTAS Y RECUPERACIONES (${minRange} - ${maxRange})`)
    .setBold(true).setFontSize(10).setSpacingAfter(4);
  const tablaAlertas = [["Fecha y Hora", "Valor", "Estado", "Duración"]];
  if (analizada.alertasFilas.length > 0) {
    analizada.alertasFilas.forEach(f => tablaAlertas.push([f.h, f.v, f.e, f.d]));
  } else {
    tablaAlertas.push(["-", "-", "Sin eventos fuera de rango", "-"]);
  }
  estilizarTabla(body.appendTable(tablaAlertas));

  // --- EVENTOS DE CONECTIVIDAD ---
  body.appendParagraph("\nEVENTOS DETECTADOS (>10 min sin datos)")
    .setBold(true).setFontSize(10).setSpacingAfter(4);
  const tablaWifi = [["Inicio", "Fin", "Tipo de Corte", "T. Antes", "T. Desp.", "Duración"]];
  if (conectividad.filas.length > 0) {
    conectividad.filas.forEach(f => tablaWifi.push([f.inicio, f.fin, f.tipo, f.antes, f.despues, f.duracion]));
  } else {
    tablaWifi.push(["-", "-", "Sin interrupciones significativas", "-", "-", "-"]);
  }
  estilizarTabla(body.appendTable(tablaWifi));

  // --- ANÁLISIS Y RECOMENDACIONES ---
  body.appendParagraph("\nANÁLISIS TÉCNICO:").setBold(true).setFontSize(10);
  if (analizada.textoAnalisis) {
    body.appendParagraph(analizada.textoAnalisis).setFontSize(9).setItalic(true);
  }
  if (conectividad.analisis) {
    body.appendParagraph("\nConectividad:").setBold(true).setFontSize(9);
    body.appendParagraph(conectividad.analisis).setFontSize(9).setItalic(true);
  }

  body.appendParagraph("\nRECOMENDACIONES:").setBold(true).setFontSize(10).setForegroundColor("#00384d");
  body.appendParagraph(analizada.textoRecom + "\n• " + conectividad.recom).setFontSize(9);

  // Nota técnica final
  body.appendParagraph("\nNOTA TÉCNICA:").setBold(true).setFontSize(9).setForegroundColor("#475569");
  body.appendParagraph(analizada.notaTecnica).setFontSize(8).setItalic(true).setForegroundColor("#475569");

  // Nota de responsabilidad
  body.appendParagraph("\nRESPONSABILIDAD:").setBold(true).setFontSize(9).setForegroundColor("#475569");
  body.appendParagraph(analizada.notaResponsabilidad).setFontSize(8).setItalic(true).setForegroundColor("#475569");

  // --- PIE DE PÁGINA con línea separadora arriba ---
  const footer = doc.addFooter();
  footer.appendHorizontalRule();
  const logoF = buscarLogoEnDrive("footer.jpg");
  if (logoF) {
    const fp = footer.appendParagraph("");
    fp.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    fp.appendInlineImage(logoF).setWidth(anchoMax).setHeight(50);
  } else {
    footer.appendParagraph("Hospital Natalio Burd - Vicus Monitoreo").setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(8);
  }

  doc.saveAndClose();
  const pdf = doc.getAs('application/pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return pdf;
}

function analizarConectividad(feeds, field, sensor) {
  let filas = [];
  let totalMinutos = 0;
  const minVal = sensor && sensor.isFreezer ? -28.0 : 2.0;
  const maxVal = sensor && sensor.isFreezer ? -18.0 : 8.0;
  
  for (let i = 1; i < feeds.length; i++) {
    const d1 = new Date(feeds[i-1].created_at);
    const d2 = new Date(feeds[i].created_at);
    const diff = (d2 - d1) / 60000;
    if (diff > 10) {
      const v1 = parseFloat(feeds[i-1][field]);
      const v2 = parseFloat(feeds[i][field]);
      const tipo = (v2 > maxVal || v2 < minVal) && v2 !== -127 ? 'Corte Energía' : 'Corte WiFi';
      filas.push({
        inicio: Utilities.formatDate(d1, "GMT-3", "dd/MM HH:mm"),
        fin: Utilities.formatDate(d2, "GMT-3", "dd/MM HH:mm"),
        tipo: tipo,
        antes: (isNaN(v1) || v1 === -127) ? "--" : v1.toFixed(2) + "°C",
        despues: (isNaN(v2) || v2 === -127) ? "--" : v2.toFixed(2) + "°C",
        duracion: formatDur(diff)
      });
      totalMinutos += diff;
    }
  }
  return {
    filas: filas,
    analisis: filas.length > 0 
      ? `Se detectaron ${filas.length} ${filas.length === 1 ? 'interrupción' : 'interrupciones'} de datos.\n• Tiempo total sin datos: ${formatDur(totalMinutos)}\n• Durante los cortes no se puede garantizar el control de la cadena de frío.` 
      : "Sin problemas de conectividad. Monitoreo continuo confirmado.",
    recom: filas.length > 0
      ? "Verificar el estado del router y la conexión a internet.\n• Revisar la distancia entre el sensor y el punto de acceso WiFi.\n• Considerar registro manual de temperatura durante los períodos sin datos.\n• Evaluar instalación de UPS para el equipo de red."
      : "Mantener el equipo de red en condiciones óptimas para asegurar monitoreo continuo."
  };
}

function analizarDatos(feeds, field, sensor) {
  let alertasFilas = [];
  let lastState = 'normal';
  let startTime = null;
  let stats = [];
  const minVal = sensor && sensor.isFreezer ? -28.0 : 2.0;
  const maxVal = sensor && sensor.isFreezer ? -18.0 : 8.0;

  feeds.forEach(f => {
    const val = parseFloat(f[field]);
    if (isNaN(val) || val === -127) return;
    const state = (val > maxVal) ? 'Alta' : (val < minVal) ? 'Baja' : 'normal';
    if (state !== lastState) {
      const hora = Utilities.formatDate(new Date(f.created_at), "GMT-3", "dd/MM HH:mm");
      if (state !== 'normal') {
        startTime = new Date(f.created_at);
        alertasFilas.push({ h: hora, v: val.toFixed(1) + "°C", e: state === 'Alta' ? `Alerta Alta (>${maxVal}°C)` : `Alerta Baja (<${minVal}°C)`, d: "--" });
      } else if (startTime) {
        const dur = (new Date(f.created_at) - startTime) / 60000;
        alertasFilas.push({ h: hora, v: val.toFixed(1) + "°C", e: "Recuperación", d: formatDur(dur) });
        stats.push({ s: lastState, d: dur });
      }
      lastState = state;
    }
  });

  const tieneAltas = stats.some(s => s.s === 'Alta');
  const tieneBajas = stats.some(s => s.s === 'Baja');
  const durTotal = stats.reduce((a, b) => a + b.d, 0);

  let textoAnalisis = "Estabilidad térmica confirmada. Sin desvíos en el período.";
  let textoRecom = "• Continuar monitoreo habitual.\n• Realizar mantenimiento preventivo según calendario.\n• Verificar calibración del sensor periódicamente.";

  if (stats.length > 0) {
    textoAnalisis = `Se detectaron ${stats.length} ${stats.length === 1 ? 'desvío térmico' : 'desvíos térmicos'} (duración acumulada fuera de rango: ${formatDur(durTotal)}).\n`;
    if (tieneAltas) textoAnalisis += `• Temperatura ALTA (>${maxVal}°C): riesgo de pérdida de potencia y degradación acelerada de vacunas y termolábiles.\n`;
    if (tieneBajas) textoAnalisis += `• Temperatura BAJA (<${minVal}°C): riesgo crítico de congelación (pérdida irreversible de inmunogenicidad en vacunas adyuvadas como Hepatitis B, DPT, etc.).\n`;
    if (durTotal < 30) {
      textoAnalisis += "Los desvíos fueron breves. Se recomienda extremar vigilancia las próximas horas.";
    } else if (durTotal < 120) {
      textoAnalisis += "Desvíos de moderada duración. Evaluar stock afectado según protocolo de cadena de frío.";
    } else {
      textoAnalisis += "Desvíos prolongados. Requiere intervención técnica urgente y auditoría de viabilidad de dosis según Disposición ANMAT 10.872/2020.";
    }

    textoRecom = "";
    if (tieneAltas) {
      textoRecom += `• Temperatura ALTA detectada: comprobar burletes, sellado de puertas y frecuencia de aperturas.\n`;
      textoRecom += "  → Las vacunas expuestas a calor pueden degradarse y perder su efectividad inmunológica de manera acumulativa.\n";
      textoRecom += "• Controlar termostato, limpieza del condensador y estado del compresor.\n";
      textoRecom += "  → Un termostato mal calibrado o fallas en el circuito de refrigeración son las causas principales de alzas térmicas.\n";
      textoRecom += "• Apartar lote afectado de forma preventiva hasta dictamen de viabilidad.\n";
      textoRecom += "  → El Programa Nacional de Inmunizaciones exige resguardo preventivo de dosis ante rupturas de cadena de frío.\n";
    }
    if (tieneBajas) {
      textoRecom += `• Temperatura BAJA detectada: verificar calibración del termostato (subir nivel de temperatura).\n`;
      textoRecom += "  → La congelación destruye instantáneamente la estructura coloidal de las vacunas adyuvadas por aluminio.\n";
      textoRecom += "• Reubicar dosis lejos de las placas de evaporación directa.\n";
      textoRecom += "  → Las cajas de vacunas en contacto con la pared del evaporador pueden congelarse aun con promedio de aire normal.\n";
      textoRecom += "• Ejecutar el Test de Vacunación / Test de Agitación si se sospecha congelamiento.\n";
    }
    textoRecom += "• Asentar el incidente completo en la planilla física de desvíos del sector.\n";
    textoRecom += "  → Todo desvío térmico debe contar con trazabilidad documentada para auditorías sanitarias del Ministerio de Salud.\n";
  }

  const notaTecnica = "NOTA TÉCNICA: Ante cualquier desvío térmico o falla del equipo, la intervención correctiva debe ser realizada por personal técnico de refrigeración calificado o servicio técnico autorizado. Toda intervención de mantenimiento debe quedar asentada con fecha, firma del técnico actuante y descripción detallada, conforme a la Disposición ANMAT 10.872/2020 y las directrices del Programa Provincial de Inmunizaciones.";

  const notaResponsabilidad = "RESPONSABILIDAD: La responsabilidad del estricto cumplimiento de las condiciones de conservación, cadena de frío y viabilidad de las vacunas en el sector de Inmunizaciones recae sobre la Jefatura de Inmunizaciones y la Dirección del Hospital, conforme a la Ley Nacional de Vacunas N° 27.491. Ante todo desvío térmico confirmado, se debe notificar inmediatamente a las autoridades competentes y al referente del Programa de Inmunizaciones antes de descartar o utilizar cualquier lote.";

  return { alertasFilas, textoAnalisis, textoRecom, notaTecnica, notaResponsabilidad };
}

function generarSheetSemanal(feedsPorSensor, rangoTexto, fechaHoy, folderId) {
  const centroNombre = feedsPorSensor[0].sensor.centro;
  console.log(`[Sheet - ${centroNombre}] Iniciando generarSheetSemanal...`);
  try {
    console.log(`[Sheet - ${centroNombre}] Conectando con Google Drive folder: ${folderId}`);
    const carpeta = DriveApp.getFolderById(folderId);
    const nombreArchivo = "Consolidado Semanal - " + centroNombre;
    
    console.log(`[Sheet - ${centroNombre}] Buscando archivo: "${nombreArchivo}"`);
    const archivos = carpeta.getFilesByName(nombreArchivo);
    let ss;
    if (archivos.hasNext()) {
      const archivo = archivos.next();
      console.log(`[Sheet - ${centroNombre}] Archivo existente encontrado. Abriendo Spreadsheet ID: ${archivo.getId()}`);
      ss = SpreadsheetApp.openById(archivo.getId());
    } else {
      console.log(`[Sheet - ${centroNombre}] Archivo no encontrado. Creando nueva planilla...`);
      ss = SpreadsheetApp.create(nombreArchivo);
      const archivoDrive = DriveApp.getFileById(ss.getId());
      carpeta.addFile(archivoDrive);
      DriveApp.getRootFolder().removeFile(archivoDrive);
      console.log(`[Sheet - ${centroNombre}] Nueva planilla creada y movida a su carpeta.`);
    }
    
    const nombreHoja = "Semana " + Utilities.formatDate(fechaHoy, "GMT-3", "dd-MM-yyyy");
    console.log(`[Sheet - ${centroNombre}] Creando/reemplazando hoja: "${nombreHoja}"`);
    
    const hojaExistente = ss.getSheetByName(nombreHoja);
    if (hojaExistente) {
      console.log(`[Sheet - ${centroNombre}] Hoja previa duplicada encontrada. Eliminándola...`);
      ss.deleteSheet(hojaExistente);
    }
    
    const hoja = ss.insertSheet(nombreHoja);
    console.log(`[Sheet - ${centroNombre}] Hoja insertada con éxito.`);
    
    // ── ENCABEZADO PRINCIPAL ──────────────────────────────────
    hoja.getRange("A1").setValue("REGISTRO SEMANAL DE TEMPERATURAS - INMUNIZACIÓN");
    hoja.getRange("A1").setFontSize(13).setFontWeight("bold").setFontColor("#00384d");
    hoja.getRange("A2").setValue("Período: " + rangoTexto);
    hoja.getRange("A2").setFontSize(10).setFontStyle("italic");
    hoja.getRange("A3").setValue("Generado: " + Utilities.formatDate(fechaHoy, "GMT-3", "dd/MM/yyyy HH:mm"));
    hoja.getRange("A3").setFontSize(9).setFontColor("#64748b");
    
    // ── CONSTRUIR COLUMNAS DINÁMICAMENTE ─────────────────────
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
    console.log(`[Sheet - ${centroNombre}] Agrupando y alineando lecturas por minuto en memoria...`);
    const mapaTemp = {};
    feedsPorSensor.forEach((fs, idx) => {
      fs.feeds.forEach(feed => {
        const val = parseFloat(feed[fs.sensor.field]);
        if (isNaN(val) || val === -127) return;
        
        // Parsear fecha y truncar segundos y milisegundos para alinear al minuto
        const d = new Date(feed.created_at);
        d.setSeconds(0, 0);
        d.setMilliseconds(0);
        const ts = d.getTime();
        
        if (!mapaTemp[ts]) mapaTemp[ts] = { ts: ts, valores: {} };
        if (mapaTemp[ts].valores[idx] !== undefined) {
          mapaTemp[ts].valores[idx] = (mapaTemp[ts].valores[idx] + val) / 2;
        } else {
          mapaTemp[ts].valores[idx] = val;
        }
      });
    });
    
    // Ordenar los timestamps numéricos de manera ascendente
    const timestamps = Object.keys(mapaTemp).map(Number).sort((a, b) => a - b);
    
    // Función auxiliar ultra-rápida para formatear fecha a GMT-3 en JS puro
    const formatFechaGMT3 = ts => {
      const shifted = new Date(ts - 3 * 60 * 60 * 1000);
      const pad = n => String(n).padStart(2, '0');
      const dia = pad(shifted.getUTCDate());
      const mes = pad(shifted.getUTCMonth() + 1);
      const anio = shifted.getUTCFullYear();
      const hora = pad(shifted.getUTCHours());
      const min = pad(shifted.getUTCMinutes());
      return `${dia}/${mes}/${anio} ${hora}:${min}`;
    };
    
    const filas = timestamps.map(ts => {
      const entrada = mapaTemp[ts];
      const fechaStr = formatFechaGMT3(ts);
      const fila = [fechaStr];
      feedsPorSensor.forEach((_, idx) => {
        const v = entrada.valores[idx];
        fila.push(v !== undefined ? Math.round(v * 100) / 100 : "");
      });
      return fila;
    });
    
    console.log(`[Sheet - ${centroNombre}] Cantidad total de filas unificadas a escribir: ${filas.length}`);
    if (filas.length > 0) {
      const filaInicio = filaEncabezado + 1;
      console.log(`[Sheet - ${centroNombre}] Escribiendo matriz de lecturas en lote...`);
      hoja.getRange(filaInicio, 1, filas.length, encabezados.length).setValues(filas);
      
      console.log(`[Sheet - ${centroNombre}] Aplicando reglas de Formato Condicional Dinámico...`);
      feedsPorSensor.forEach((fs, idx) => {
        const col = idx + 2;
        const rangoCol = hoja.getRange(filaInicio, col, filas.length, 1);
        
        const minVal = fs.sensor.isFreezer ? -28.0 : 2.0;
        const maxVal = fs.sensor.isFreezer ? -18.0 : 8.0;
        
        const reglAlta = SpreadsheetApp.newConditionalFormatRule()
          .whenNumberGreaterThan(maxVal)
          .setBackground("#fecaca")
          .setFontColor("#dc2626")
          .setRanges([rangoCol])
          .build();
          
        const reglBaja = SpreadsheetApp.newConditionalFormatRule()
          .whenNumberLessThan(minVal)
          .setBackground("#bfdbfe")
          .setFontColor("#1d4ed8")
          .setRanges([rangoCol])
          .build();
          
        const reglas = hoja.getConditionalFormatRules();
        reglas.push(reglAlta);
        reglas.push(reglBaja);
        hoja.setConditionalFormatRules(reglas);
      });
      

      
      hoja.setColumnWidth(1, 140);
      feedsPorSensor.forEach((_, idx) => hoja.setColumnWidth(idx + 2, 130));
      
      console.log(`[Sheet - ${centroNombre}] Aplicando colores alternados en un único lote ultra-veloz...`);
      const colores2D = [];
      for (let i = 0; i < filas.length; i++) {
        const color = i % 2 === 0 ? "#f8fafc" : "#ffffff";
        colores2D.push(Array(encabezados.length).fill(color));
      }
      hoja.getRange(filaInicio, 1, filas.length, encabezados.length).setBackgrounds(colores2D);
      
      hoja.getRange(filaInicio, 2, filas.length, feedsPorSensor.length)
          .setHorizontalAlignment("center").setNumberFormat("0.00");
    }
    
    console.log(`[Sheet - ${centroNombre}] Generando bloque de Resumen Estadístico...`);
    const filaResumen = filaEncabezado + filas.length + 2;
    hoja.getRange(filaResumen, 1).setValue("RESUMEN ESTADÍSTICO")
        .setFontWeight("bold").setFontColor("#00384d").setFontSize(10);
        
    const etiquetas = ["Mínimo (°C)", "Máximo (°C)", "Promedio (°C)", "Lecturas totales"];
    etiquetas.forEach((etiq, i) => {
      hoja.getRange(filaResumen + 1 + i, 1).setValue(etiq).setFontWeight("bold");
    });
    
    feedsPorSensor.forEach((fs, idx) => {
      const col = idx + 2;
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
    
    hoja.getRange(filaResumen + 1, 1, 4, encabezados.length)
        .setBackground("#f1f5f9").setBorder(true, true, true, true, true, true);
        
    hoja.setFrozenRows(filaEncabezado);
    console.log(`[Sheet - ${centroNombre}] ¡generarSheetSemanal completado de forma ultra-rápida!`);
  } catch(e) { console.error("Error en Sheet: " + e.message); }
}

function fetchThingSpeakDataCompleto(id, key, dias) {
  const ahora = new Date();
  const inicio = new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000);
  
  let todosLosFeeds = [];
  let fechaDesde = new Date(inicio);
  let intentos = 0;
  const MAX_INTENTOS = 5; // máximo 5 páginas = 40.000 registros

  while (intentos < MAX_INTENTOS) {
    const startStr = Utilities.formatDate(fechaDesde, "GMT-3", "yyyy-MM-dd'T'HH:mm:ss");
    const endStr   = Utilities.formatDate(ahora,      "GMT-3", "yyyy-MM-dd'T'HH:mm:ss");
    
    const url = `https://api.thingspeak.com/channels/${id}/feeds.json?api_key=${key}&start=${startStr}-03:00&end=${endStr}-03:00&results=8000`;
    const res = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const data = JSON.parse(res.getContentText());
    
    if (!data.feeds || data.feeds.length === 0) break;
    
    // Agregar feeds nuevos (evitar duplicados por timestamp)
    const ultimoTs = todosLosFeeds.length > 0 
      ? new Date(todosLosFeeds[todosLosFeeds.length - 1].created_at).getTime() 
      : 0;
    
    const nuevos = data.feeds.filter(f => new Date(f.created_at).getTime() > ultimoTs);
    todosLosFeeds = todosLosFeeds.concat(nuevos);
    
    // Si devolvió menos de 8000, ya tenemos todo
    if (data.feeds.length < 8000) break;
    
    // Avanzar desde el último registro recibido
    fechaDesde = new Date(data.feeds[data.feeds.length - 1].created_at);
    fechaDesde = new Date(fechaDesde.getTime() + 60000); // +1 minuto
    intentos++;
    
    Utilities.sleep(500); // respetar rate limit de ThingSpeak
  }
  
  return { feeds: todosLosFeeds };
}

function generarGraficoCurva(feeds, field, nombre) {
  const dataTable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, "Tiempo")
    .addColumn(Charts.ColumnType.NUMBER, "°C");

  let vals = feeds.map(f => parseFloat(f[field])).filter(v => !isNaN(v));
  if (vals.length === 0) vals = [5];
  let minVal = Math.min(...vals);
  let maxVal = Math.max(...vals);

  let yMin = minVal - 0.5;
  let yMax = maxVal + 0.5;

  const numPuntos = 800; // Mucho más detalle para igualar al reporte manual
  const step = Math.max(1, Math.floor(feeds.length / numPuntos));
  
  for (let i = 0; i < feeds.length; i += step) {
    let f = feeds[i];
    let val = parseFloat(f[field]);
    let date = new Date(f.created_at);
    
    if (!isNaN(val) && !isNaN(date.getTime())) {
      let label = Utilities.formatDate(date, "GMT-3", "dd/MM HH:mm");
      dataTable.addRow([label, val]);
    }
  }

  return Charts.newLineChart()
    .setDataTable(dataTable)
    .setDimensions(2200, 520)
    .setColors(["#3b82f6"]) 
    .setOption("areaOpacity", 0.1) 
    .setOption("lineWidth", 1.5) 
    .setOption("vAxis", { 
      gridlines: { count: 8, color: '#cbd5e1' }, 
      viewWindow: { min: yMin, max: yMax },
      format: '#.0°C',
      textStyle: { fontSize: 14, color: '#000000', bold: true },
      textPosition: 'out'
    })
    .setOption("hAxis", { 
      slantedText: true, 
      slantedTextAngle: 45,
      textStyle: { fontSize: 12, color: '#000000', bold: true }, 
      gridlines: { color: 'none' },
      showTextEvery: 60 
    })
    .setOption("chartArea", { width: '94%', height: '70%', left: '4%', right: '1%', top: '4%' })
    .setOption("legend", { position: 'none' })
    .setOption("backgroundColor", "white")
    .build().getAs('image/png');
}

function estilizarTabla(t) {
  const r0 = t.getRow(0);
  for(let i=0; i<r0.getNumCells(); i++) r0.getCell(i).setBackgroundColor("#f1f5f9").setBold(true).setFontSize(9);
  for(let i=1; i<t.getNumRows(); i++) {
    for(let j=0; j<t.getRow(i).getNumCells(); j++) t.getRow(i).getCell(j).setFontSize(8);
  }
}
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

function buscarLogoEnDrive(n) {
  const f = DriveApp.getFilesByName(n);
  return f.hasNext() ? f.next().getBlob() : null;
}
