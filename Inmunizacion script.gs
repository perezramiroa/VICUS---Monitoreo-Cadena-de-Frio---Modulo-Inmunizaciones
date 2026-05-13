/**
 * ============================================================
 *  VICUS - INMUNIZACIÓN |  Google Apps Script (PROFESIONAL V4.1)
 *  Hospital Natalio Burd - Sistema Multi-Centro
 *  Desarrollado por Ingeniero Perez Ramiro
 * ============================================================
 */

const CENTROS = {
  "11 de Octubre": { tecnico: "1-jS7WJcef_UFzXEBOMqe6nA_nrg2yG5I", semanal: "1rchCT8gT4naLEzz42VBGOBo7bzvDBPS0", sheet: "1R1STBbXgvJCPB8Fg2pkLRxwKhdTSvW5A", desvio: "1tX9iEZ1F5a6a0iHfuk8gEMSzw4tK_1BN" },
  "Costa de Reyes": { tecnico: "1ak_7jReVdrz5SOTnuF7yF25cVf1nmUju", semanal: "1qSRnCLK4scEiRc4viL2qpRP2E7UaVDF5", sheet: "1k51QYualYpOmnIvNfImsReo2iX6XMLyA", desvio: "1pwYUnnVT9ziqFXrw32sX_E2zxB-WjAj3" },
  "Hospital Centenario": { tecnico: "1XxskFD2ntLT2EOUVigPZMw0L90pbXeDi", semanal: "1uUpvDEFGuzS0Izwh8UXmZc0FEe-KxJdQ", sheet: "1Q8yuiISB-Kp7JaHWpcSLOkheuVQ0KeGW", desvio: "1noWUOOfHfDz4NVbGZNUFe9LJkA_UGFdx" },
  "Hospital Chañar": { tecnico: "1TcoL9Y6zUVoHDbzxf54yvUSRbBaLLtKz", semanal: "1XjxfSXiYf9EM0-EYeNOkf_OKwKzOAnP9", sheet: "1YpdJAXtIiRmbB6PS3KGZ37gAaJTLHPXk", desvio: "1a5VS4sQ6oLGhK1MHV4hr5Wn54Jiqoy4p" },
  "Nueva España": { tecnico: "1n9p50J76xx4WWUSqDQYK6iBl8Z2RdN7i", semanal: "1l2G_9EyT0VPAeEw6Ep8yt6RTleUzEBmS", sheet: "1NKSUo7tYd1T2Hz5UVz4YaNlEPJcLOfUu", desvio: "1DE8rZA6a-adfrU_PbB9nsnSRmz7A4UnK" },
  "Sarmiento 1": { tecnico: "1VyjSpe-X_T2fD8fGhvm6XRLUgs5mND0s", semanal: "19k3VD_jSggds4Iy7RmDUqjYWTp2xdeC8", sheet: "1bXawdoEq0EwvjMZJri2X5dNXmcVVZyyh", desvio: "1r4H5cz9N3Kn80_OMueEwy3NPxq-DuJxP" },
  "Sarmiento 2": { tecnico: "1jaCCybkIJQ4Xy5rSXvVnSoL9f0tI9IXH", semanal: "1nPMnNzWnmL3YVfHrp5PFrCOXu4PLmBmU", sheet: "1BW7G9IbehJtTAOzNW-R8hQ_f4AChM397", desvio: "1o9LBBg9yyNe3Y48SAATvSHGZ8kHjltOI" },
  "VAN": { tecnico: "1DLN-1zdRObFRI6KchEw_1ZRMOSah5wL6", semanal: "1WqO7ap0kwLpae77OmiH1X14YwWgpJc6x", sheet: "1No32ZBBW7hUUyqYMT6nzp2oWpHggqjde", desvio: "1M2ciXfvMox1Ga3K8hZ3QDVXjhzSu_4rh" },
  "VAS": { tecnico: "1rGl_4Ok22VwmjxwyPFH0EroBEMjuk5rP", semanal: "1cAd9zTGxNQvuTUyqOPpMIi9fv_b03lxz", sheet: "1i2v2kmW0eOM0_NyyJaC95Y6KDFBF6Qur", desvio: "17qi7Rm4TXjFhC6rBV2lZXIXwazQA5imt" },
  "Villa Obrera": { tecnico: "1CTKmgLvV5SL8KLRz4s3a6hmvMkwELTmq", semanal: "1wLBwGdsTnDMC4ugW-kYhifGuC5vAw8lI", sheet: "18D1-RzkXvTNvHvyJ_3jah4Y1gcRQontn", desvio: "194gfes6URjTN3pVhmIXE5Be4Hnrs4_Dr" },
  "Zona 1": { tecnico: "1_MGzVzijxIZQz90LuBep7I57SmNfa4r8", semanal: "1A4qfHVAcI11QCs5l6yqeW2q-VZlnH0Ht", sheet: "18NxXqHvx4NXoZOmej4HpXoQNlY47gzUX", desvio: "1fFOI0wpgKVy-qOMQaklu_-wEr8prM34G" }
};

// CONFIGURACIÓN DE SENSORES (Asociados a su centro)
const SENSORES = [
  { id: '2561917', k: 'M3R9T3F6Q0O5A1S1', n: 'Heladera 1', eq: 'Equipo Inm 1', field: 'field1', centro: 'Zona 1' },
  { id: '2561918', k: 'X6V7B2N9M1K0L4J8', n: 'Heladera 2', eq: 'Equipo Inm 2', field: 'field1', centro: 'Zona 1' }
];

/**
 * Genera reportes semanales automáticos para cada sensor
 * y los guarda en la carpeta 'semanal' de su centro respectivo.
 */
function ejecutarReporteSemanal() {
  const hoy = new Date();
  const haceSieteDias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fechaEmision = Utilities.formatDate(hoy, "GMT-3", "dd/MM/yyyy");
  const rangoTexto = Utilities.formatDate(haceSieteDias, "GMT-3", "dd/MM/yyyy") + " - " + fechaEmision;

  // Agrupamos feeds por centro para generar sheets consolidados
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

  // Generar Sheets semanales para cada centro
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

  const logo = buscarLogoEnDrive("logo_rih.jpg");
  const header = doc.addHeader();
  if (logo) {
    const hp = header.appendParagraph("");
    hp.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    hp.appendInlineImage(logo).setWidth(anchoMax).setHeight(60);
  }
  header.appendHorizontalRule();

  const t1 = body.appendParagraph("INFORME TÉCNICO DE CADENA DE FRÍO\nPROGRAMA DE INMUNIZACIONES - " + sensor.centro.toUpperCase());
  t1.setFontSize(14).setBold(true).setForegroundColor("#00384d").setSpacingAfter(4);
  body.appendParagraph("Según Disposición ANMAT 10.872/2020").setFontSize(9).setItalic(true).setSpacingAfter(10);

  body.appendParagraph("Dispositivo: " + sensor.n).setBold(true).setFontSize(11);
  body.appendParagraph("Período: " + rango).setBold(true).setFontSize(10);
  body.appendParagraph("Emisión: " + fecha + " | Trazabilidad: " + trazabilidad).setFontSize(8).setSpacingAfter(10);

  body.appendParagraph("CURVA TÉRMICA SEMANAL").setBold(true).setFontSize(10);
  const pChart = body.appendParagraph("");
  pChart.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pChart.appendInlineImage(grafico).setWidth(anchoMax).setHeight(280);

  const tablaAlertas = [["Fecha y Hora", "Valor", "Estado", "Duración"]];
  if (analizada.alertasFilas.length > 0) analizada.alertasFilas.forEach(f => tablaAlertas.push([f.h, f.v, f.e, f.d]));
  else tablaAlertas.push(["-", "-", "✅ Sin eventos fuera de rango", "-"]);
  estilizarTabla(body.appendTable(tablaAlertas));

  body.appendParagraph("\nANÁLISIS TÉCNICO:").setBold(true).setFontSize(10);
  body.appendParagraph(analizada.textoAnalisis).setFontSize(9).setItalic(true);
  
  body.appendParagraph("\nRECOMENDACIONES:").setBold(true).setFontSize(10).setForegroundColor("#00384d");
  body.appendParagraph(analizada.textoRecom).setFontSize(9);

  body.appendParagraph("\n⚙️ NOTA TÉCNICA:").setBold(true).setFontSize(9).setForegroundColor("#475569");
  body.appendParagraph(analizada.notaTecnica).setFontSize(8).setItalic(true).setForegroundColor("#475569");

  const footer = doc.addFooter();
  footer.appendHorizontalRule();
  const logoF = buscarLogoEnDrive("footer.jpg");
  if (logoF) footer.appendParagraph("").setAlignment(DocumentApp.HorizontalAlignment.CENTER).appendInlineImage(logoF).setWidth(anchoMax).setHeight(50);

  doc.saveAndClose();
  const pdf = doc.getAs('application/pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return pdf;
}

function generarSheetSemanal(feedsPorSensor, rangoTexto, fechaHoy, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const nombreHoja = "Semana " + Utilities.formatDate(fechaHoy, "GMT-3", "dd-MM-yyyy");
  const hojaExistente = ss.getSheetByName(nombreHoja);
  if (hojaExistente) ss.deleteSheet(hojaExistente);
  const hoja = ss.insertSheet(nombreHoja);
  hoja.getRange("A1").setValue("REGISTRO SEMANAL UNIFICADO - INMUNIZACIÓN").setFontWeight("bold").setFontSize(14).setFontColor("#00384d");
  hoja.getRange("A2").setValue("Período: " + rangoTexto).setFontStyle("italic");
  // ... resto de la lógica de consolidación ...
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
    textoRecom: "• Continuar monitoreo.\n• Verificar sellado de puertas.",
    notaTecnica: "NOTA TÉCNICA: La intervención correctiva debe ser realizada por personal técnico calificado conforme a la Disposición ANMAT 10.872/2020."
  };
}

function fetchThingSpeakDataCompleto(id, key, dias) {
  const res = UrlFetchApp.fetch(`https://api.thingspeak.com/channels/${id}/feeds.json?api_key=${key}&minutes=${dias*1440}&results=8000`);
  return JSON.parse(res.getContentText());
}

function generarGraficoCurva(feeds, field, nombre) {
  const dataTable = Charts.newDataTable().addColumn(Charts.ColumnType.STRING, "T").addColumn(Charts.ColumnType.NUMBER, "°C");
  const step = Math.max(1, Math.floor(feeds.length / 400));
  for (let i = 0; i < feeds.length; i += step) {
    let val = parseFloat(feeds[i][field]);
    if (!isNaN(val)) dataTable.addRow([Utilities.formatDate(new Date(feeds[i].created_at), "GMT-3", "dd/MM HH:mm"), val]);
  }
  return Charts.newLineChart().setDataTable(dataTable).setDimensions(1000, 300).setOption("vAxis", { viewWindow: { min: 0, max: 15 } }).build().getAs('image/png');
}

function estilizarTabla(t) { t.getRow(0).setBackgroundColor("#f1f5f9").setBold(true); }
function formatDur(m) { return m < 60 ? Math.round(m) + "m" : Math.floor(m/60) + "h " + Math.round(m%60) + "m"; }
function buscarLogoEnDrive(n) { const f = DriveApp.getFilesByName(n); return f.hasNext() ? f.next().getBlob() : null; }

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  
  if (body.action === 'guardarPDF') {
    const bytes = Utilities.base64Decode(body.pdfData);
    const blob = Utilities.newBlob(bytes, 'application/pdf', body.filename);
    
    // Ruteo dinámico de carpeta
    let folderId = body.folderId;
    
    // Si viene de un Acta de Desvío, buscamos la carpeta específica de desvío del centro
    if (body.type === 'desvio' && body.centro && CENTROS[body.centro]) {
      folderId = CENTROS[body.centro].desvio;
    } else if (body.type === 'tecnico' && body.centro && CENTROS[body.centro]) {
      folderId = CENTROS[body.centro].tecnico;
    }

    const file = DriveApp.getFolderById(folderId).createFile(blob);
    return ContentService.createTextOutput(JSON.stringify({result: true, url: file.getUrl()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) { return ContentService.createTextOutput("Vicus Multi-Centro Online."); }
