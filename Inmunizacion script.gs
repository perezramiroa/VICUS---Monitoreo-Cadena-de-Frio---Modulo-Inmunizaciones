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
  "Sarmiento 2": { tecnico: "1pUwu374roF1-7QOHnt8saAvTD66_k4rv", semanal: "14RSuSAXsOsYdFTlKMeHeP718h7n7glx9", sheet: "1o9LBBg9yyNe3Y48SAATvSHGZ8kHjltOI", desvio: "1gQjztb4YUrFqzLUlp_lkutX17NGvMwlk" },
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
  const hoy = new Date();
  const haceSieteDias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fechaEmision = Utilities.formatDate(hoy, "GMT-3", "dd/MM/yyyy");
  const rangoTexto = Utilities.formatDate(haceSieteDias, "GMT-3", "dd/MM/yyyy") + " - " + fechaEmision;

  const feedsPorCentro = {};

  SENSORES.forEach(s => {
    try {
      const configCentro = CENTROS[s.centro];
      if (!configCentro) return;

      const data = fetchThingSpeakDataCompleto(s.id, s.k, 7);
      if (!data || !data.feeds || data.feeds.length === 0) return;

      if (!feedsPorCentro[s.centro]) feedsPorCentro[s.centro] = [];
      feedsPorCentro[s.centro].push({ sensor: s, feeds: data.feeds });

      const trazabilidad = "AUTO-INM-" + Utilities.formatDate(hoy, "GMT-3", "yyyyMMdd") + "-" + s.id;
      const analizada = analizarDatos(data.feeds, s.field);
      const conectividad = analizarConectividad(data.feeds, s.field);
      const grafico = generarGraficoCurva(data.feeds, s.field, s.n);

      const pdfBlob = generarPDFOficial(s, fechaEmision, rangoTexto, trazabilidad, analizada, conectividad, grafico);
      
      const carpeta = DriveApp.getFolderById(configCentro.semanal);
      const file = carpeta.createFile(pdfBlob);
      file.setName("Informe_Semanal_" + s.n.replace(/ /g,"_") + "_" + trazabilidad + ".pdf");
    } catch (e) {
      console.error("Error en " + s.n + ": " + e.message);
    }
  });

  for (let nombreCentro in feedsPorCentro) {
    try {
      generarSheetSemanal(feedsPorCentro[nombreCentro], rangoTexto, hoy, CENTROS[nombreCentro].sheet);
    } catch (e) {
      console.error("Error al generar Sheet para " + nombreCentro + ": " + e.message);
    }
  }
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
    let hoja = ss.getSheetByName(nombreHoja);
    if (hoja) ss.deleteSheet(hoja);
    hoja = ss.insertSheet(nombreHoja);
    
    hoja.getRange("A1").setValue("INFORME SEMANAL CONSOLIDADO").setFontWeight("bold");
    hoja.getRange("A2").setValue("Período: " + rangoTexto);
    
    let filaActual = 4;
    feedsPorSensor.forEach(item => {
      hoja.getRange(filaActual, 1).setValue("Sensor: " + item.sensor.n).setBold(true);
      filaActual++;
      const data = item.feeds.map(f => [f.created_at, f[item.sensor.field]]);
      hoja.getRange(filaActual, 1, data.length, 2).setValues(data);
      filaActual += data.length + 2;
    });
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
