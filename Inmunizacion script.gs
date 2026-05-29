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

// =====================================================================
// ESTA ES LA FUNCIÓN QUE DEBES SELECCIONAR EN TU ACTIVADOR SEMANAL
// =====================================================================
function iniciarReporteSemanal() {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteProperty("CURRENT_CENTRO_INDEX"); // Asegura que empiece desde cero
  ejecutarReporteSemanal();
}

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

  // Procesar un centro por ejecución para evitar límites de 6 min
  // El índice del centro actual se gestiona a través de las propiedades del script.

  console.log(`Iniciando procesamiento: Centro ${currentCentroIndex + 1} de ${nombresCentros.length}`);
  
  // Procesar solo el centro actual en esta ejecución
  const nombreCentro = nombresCentros[currentCentroIndex];
  console.log(`Procesando centro: ${nombreCentro}`);

  const configCentro = CENTROS[nombreCentro];
  const sensoresDelCentro = SENSORES.filter(s => s.centro === nombreCentro);
  const feedsPorSensor = [];

  sensoresDelCentro.forEach(s => {
    try {
      const data = fetchThingSpeakDataCompleto(s.id, s.k, 7);
      const hasData = (data && data.feeds && data.feeds.length > 0);
      
      const trazabilidad = "AUTO-INM-" + Utilities.formatDate(hoy, "GMT-3", "yyyyMMdd") + "-" + s.id;
      let analizada, conectividad, grafico;

      if (hasData) {
        feedsPorSensor.push({ sensor: s, feeds: data.feeds });
        analizada = analizarDatos(data.feeds, s.field, s);
        conectividad = analizarConectividad(data.feeds, s.field, s);
        grafico = generarGraficoCurva(data.feeds, s.field, s.n);
      } else {
        feedsPorSensor.push({ sensor: s, feeds: [] });
        analizada = {
          alertasFilas: [],
          textoAnalisis: "SENSOR OFFLINE. No se registraron datos en los últimos 7 días.",
          textoRecom: "• Verificar conexión eléctrica y WiFi del equipo.\n• Contactar a soporte técnico de inmediato.",
          notaTecnica: "El sensor no ha transmitido datos hacia la plataforma en el período especificado. Equipo fuera de línea.",
          notaResponsabilidad: "Ante la ausencia de registros de temperatura automatizados, la viabilidad de las vacunas debe justificarse mediante los registros manuales físicos en papel, en estricto cumplimiento de la normativa."
        };
        conectividad = {
          filas: [],
          analisis: "Sensor sin conexión a internet.",
          recom: "Revisar alimentación y red WiFi."
        };
        grafico = generarGraficoCurva([], s.field, s.n);
      }
      
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

  // Actualizar índice para el siguiente bloque
  properties.setProperty("CURRENT_CENTRO_INDEX", (currentCentroIndex + 1).toString());

  if ((currentCentroIndex + 1) >= nombresCentros.length) {
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
  body.appendParagraph("Según Ley Nacional N° 26.492 y Disposición ANMAT N° 2069/2018")
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
    footer.appendParagraph("Hospital Natalio Burd - Programa de Inmunizaciones").setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(8);
  }

  doc.saveAndClose();
  const pdfBlob = DriveApp.getFileById(doc.getId()).getBlob();
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return pdfBlob;
}

function generarSheetSemanal(feedsPorSensor, rango, hoy, sheetId) {
  try {
    const ss = SpreadsheetApp.openById(sheetId);
    const centroNombre = feedsPorSensor[0].sensor.centro;
    const nombreHoja = Utilities.formatDate(hoy, "GMT-3", "dd-MM-yyyy");
    
    let hoja = ss.getSheetByName(nombreHoja);
    if (hoja) ss.deleteSheet(hoja);
    hoja = ss.insertSheet(nombreHoja);
    
    console.log(`[Sheet - ${centroNombre}] Generando planilla consolidada...`);
    
    hoja.getRange("A1").setValue("INFORME CONSOLIDADO SEMANAL - " + centroNombre.toUpperCase())
        .setFontWeight("bold").setFontSize(14).setFontColor("#00384d");
    hoja.getRange("A2").setValue("Período: " + rango).setFontItalic(true);
    
    const encabezados = ["Fecha y Hora"];
    feedsPorSensor.forEach(fs => encabezados.push(fs.sensor.n + " (°C)"));
    
    const filaEncabezado = 4;
    hoja.getRange(filaEncabezado, 1, 1, encabezados.length)
        .setValues([encabezados])
        .setBackground("#00384d")
        .setFontColor("white")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
        
    const todosLosTimestamps = new Set();
    feedsPorSensor.forEach(fs => {
      fs.feeds.forEach(f => {
        const ts = Utilities.formatDate(new Date(f.created_at), "GMT-3", "dd/MM/yyyy HH:mm");
        todosLosTimestamps.add(ts);
      });
    });
    
    const timestampsOrdenados = Array.from(todosLosTimestamps).sort((a, b) => {
      const dateA = new Date(a.split(' ')[0].split('/').reverse().join('-') + 'T' + a.split(' ')[1]);
      const dateB = new Date(b.split(' ')[0].split('/').reverse().join('-') + 'T' + b.split(' ')[1]);
      return dateA - dateB;
    });
    
    const filas = timestampsOrdenados.map(ts => {
      const fila = [ts];
      feedsPorSensor.forEach(fs => {
        const feed = fs.feeds.find(f => Utilities.formatDate(new Date(f.created_at), "GMT-3", "dd/MM/yyyy HH:mm") === ts);
        fila.push(feed ? parseFloat(feed[fs.sensor.field]) : "");
      });
      return fila;
    });
    
    if (filas.length > 0) {
      const filaInicio = filaEncabezado + 1;
      hoja.getRange(filaInicio, 1, filas.length, encabezados.length).setValues(filas);
      
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
      
      console.log(`[Sheet - ${centroNombre}] Aplicando colores alternados...`);
      const colores2D = [];
      for (let i = 0; i < filas.length; i++) {
        const color = i % 2 === 0 ? "#f8fafc" : "#ffffff";
        colores2D.push(Array(encabezados.length).fill(color));
      }
      hoja.getRange(filaInicio, 1, filas.length, encabezados.length).setBackgrounds(colores2D);
      
      hoja.getRange(filaInicio, 2, filas.length, feedsPorSensor.length)
          .setHorizontalAlignment("center").setNumberFormat("0.00");
    }
    
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
    console.log(`[Sheet - ${centroNombre}] ¡generarSheetSemanal completado!`);
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
    
    const ultimoTs = todosLosFeeds.length > 0 
      ? new Date(todosLosFeeds[todosLosFeeds.length - 1].created_at).getTime() 
      : 0;
    
    const nuevos = data.feeds.filter(f => new Date(f.created_at).getTime() > ultimoTs);
    todosLosFeeds = todosLosFeeds.concat(nuevos);
    
    if (data.feeds.length < 8000) break;
    
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

  const numPuntos = 800;
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
