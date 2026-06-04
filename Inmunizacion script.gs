/**
 * ============================================================
 *  VICUS - INMUNIZACIÓN |  Google Apps Script (PROFESIONAL V4.3)
 *  Hospital Natalio Burd - Sistema Multi-Centro
 *  Desarrollado por Ingeniero Perez Ramiro
 * ============================================================
 */

const CENTROS = {
  "11 de Octubre":              { tecnico: "1-Kb4PZ0atScebpspLL6Ia7c2Obu43XfS",  semanal: "16zXWFpfuToLd3R4UMJirI3fHM8WhAnkd",  sheetFolder: "10A4D8mwNwFBJS_RqkxsIehDY9-vOB5XS", desvio: "1cd-S5aoIij0Y74gWkZX5efRUu1SVRFVF"  },
  "Costa de Reyes":             { tecnico: "1O6vrCQW6pSMhW0yXb9K_phm2SKMyXFWA",  semanal: "1IDTZVB49ZTcNA7fhq7sQQuVCFjpWVAW-",  sheetFolder: "1y0PqA6qtcXD0q4nhg-HBWK5S6EpeU1SM",  desvio: "1_yCz-MIXQt6FjBNux5l0jfLUMd-z2NQp"  },
  "Hospital Centenario Vacunatorio": { tecnico: "1vvtsDsdD3xdqqwTe3_MFdutiRTGNonPg", semanal: "1_6htpYwGwxNkUlZyuBNhyhKbXaNW5IPQ", sheetFolder: "1rxDKuG4knqS5cXSLadklfqFGWB4n3vX2", desvio: "1q0Yrtzv6oSK6l-ykfuZ9ZksVJzwDeOBp" },
  "Hospital Centenario Deposito":    { tecnico: "1uJG1Q8LZb6fLLuhRt6Pnpk5PzkajXwzt", semanal: "1RfiZGQZyImT6uCY3ch-GleWvMZkr9l4y", sheetFolder: "1Il-daMhqaEztT36YRpfQlETMuKMNiwD9", desvio: "1GtzrChElKllXH9VAqezFtP21R91sdhtF" },
  "Hospital Chañar":            { tecnico: "1IdwQT3v1T-uHTa0Ni4MZHkWyVAgf8LzK",  semanal: "1x2CiZxrfv-iVdVBwAWWQ3vDjqhH9BRff",  sheetFolder: "1tKC6qvZ7lMwtw3Uv7EoQRNwUaV0quA3N",  desvio: "1q8s4Wllzj4uz_0gf6mbDwPXoDP7cloef"  },
  "Nueva España":               { tecnico: "1XI_QiSL7VXkI1PaZUM1P8F7iKrcCTNf0",  semanal: "1hawLuNoFj3ZMyuSRXxNkye1eruSxO8YI",  sheetFolder: "12nVB4HtY56NBsXdipRMVB77H3fLJPmiq",  desvio: "1XbjIZ_BA9KWe20TdpxX3WMpJ5NsswxoQ"  },
  "Sarmiento 1":                { tecnico: "1d9wiHgEoKs4OmgLi9dapvzHCZUUYj-l9",  semanal: "1N163HyXD8WCQef5FzANrDwNJ5ZOBfD3q",  sheetFolder: "13fkDm_102G6IodfDK3PRTorrYQuqYgqA",  desvio: "15im-ylfLRY9wd8_mTpwNUC4FPwxSWGyf"  },
  "Sarmiento 2":                { tecnico: "1pUwu374roF1-7QOHnt8saAvTD66_k4rv",  semanal: "14RSuSAXsOsYdFTlKMeHeP718h7n7glx9",  sheetFolder: "1Z_Q4qsi9UitSgpwPjkn4ATQhmyvsyqe9",  desvio: "1gQjztb4YUrFqzLUlp_lkutX17NGvMwlk"  },
  "VAN":                        { tecnico: "1iA6WlL387h9lH7LRHyG3KqEKyo1DUIz_",  semanal: "10dDvfWEYGC4A8tn-OXsHs6XPyQIvj4gy",  sheetFolder: "1VG9Kd-LgF-w4-lAU91SJVDfu0mo50sJV",  desvio: "114Q_l-ul61MKeb58B65kN1vOdgDvo47t"  },
  "VAS":                        { tecnico: "1i7TfhLQCl93RXm75K6RzLu67o0fU_Ki6",  semanal: "14NejZ-PcK4NUhxUvpDsi9I08BbF94rJF",  sheetFolder: "1nduAcMyFPJ7h7PUrDGeUu83aFzJhUAPe",  desvio: "1oDwYGACHJt_29IknBSDEGuAJOUJzLd_V"  },
  "Villa Obrera":               { tecnico: "1-DZsi7UkruU646KlIdfyz7bNt_KVs0V3",  semanal: "1pmmAczecphzLSqJ-Tz5aL0oJo5mjeTBt",  sheetFolder: "1V9elGuGb09QQ7soIzR4CTMNMiBg9naRX",  desvio: "1mm7a6lz3LBF_CnEN9vNiMEIx3_uOL5Ii"  },
  "Zona 1":                     { tecnico: "1_3_S714T-PcwKOHeThZEukkPTUB-rRuS",  semanal: "1BEcVkfeGZeKFTvdrKv17tmeo7baGu11r",  sheetFolder: "19DEi2CH2d1_PZ5VZQ1HNJEoBXnUWY3_4",  desvio: "1_DgTnjYqLgDfQorIinGimNYgmrS4_Peo"  }
};
// Mapeo de IDs por centro:
//   tecnico     → carpeta "Informes Tecnicos"           (PDFs del técnico, generados desde la app)
//   semanal     → carpeta "Informes Tecnicos Semanales" (PDFs semanales automáticos)
//   sheetFolder → carpeta "Hoja de Calculo Semanales"   (el Sheet se crea aquí automáticamente)
//   desvio      → carpeta "Formulario Desvió Cadena de Frio"

const SENSORES = [
  // --- Hospital Centenario Vacunatorio (4 sensores) ---
  { id: '2986932', k: '9ODQC0Q4Y05C1O1T', n: 'Nº1 Sigma NHC9587',       eq: 'Vacunatorio 1', field: 'field1', centro: 'Hospital Centenario Vacunatorio' },
  { id: '2986932', k: '9ODQC0Q4Y05C1O1T', n: 'Nº2 Briket',               eq: 'Vacunatorio 1', field: 'field2', centro: 'Hospital Centenario Vacunatorio' },
  { id: '2986935', k: 'Q1CXSNKL68D24MJH', n: 'Nº3 Briket NHC13273',      eq: 'Vacunatorio 2', field: 'field1', centro: 'Hospital Centenario Vacunatorio' },
  { id: '2986935', k: 'Q1CXSNKL68D24MJH', n: 'Nº4 Angelantoni NHC4621',  eq: 'Vacunatorio 2', field: 'field2', centro: 'Hospital Centenario Vacunatorio' },

  // --- Hospital Centenario Deposito (4 sensores) ---
  { id: '2993812', k: 'PNS5MD5VS74CKIIM', n: 'Presvac 1',    eq: 'Depo Vacunatorio 1', field: 'field1', centro: 'Hospital Centenario Deposito' },
  { id: '2993812', k: 'PNS5MD5VS74CKIIM', n: 'Briket',        eq: 'Depo Vacunatorio 1', field: 'field2', centro: 'Hospital Centenario Deposito' },
  { id: '2993815', k: 'XZ0DG337HFATUG1O', n: 'Presvac 2',    eq: 'Depo Vacunatorio 2', field: 'field1', centro: 'Hospital Centenario Deposito' },
  { id: '2993815', k: 'XZ0DG337HFATUG1O', n: 'Freezer Inelro', eq: 'Depo Vacunatorio 2', field: 'field2', centro: 'Hospital Centenario Deposito', isFreezer: true },

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
  { id: '3060534', k: '3X1IJ2GK7WUKCNZ8', n: 'Heladera', eq: 'VAN', field: 'field1', centro: 'VAN' },

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
  properties.deleteProperty("CURRENT_CENTRO_INDEX");
  properties.deleteProperty("CURRENT_PHASE");
  ejecutarReporteSemanal();
}

/**
 * Cada ejecución hace UNA sola cosa:
 *   phase "pdfs"  → genera todos los PDFs del centro actual
 *   phase "sheet" → genera la planilla consolidada del centro actual
 * Al terminar cada fase programa el trigger para la siguiente.
 */
function ejecutarReporteSemanal() {
  const properties     = PropertiesService.getScriptProperties();
  const centroIndex    = parseInt(properties.getProperty("CURRENT_CENTRO_INDEX") || "0");
  const phase          = properties.getProperty("CURRENT_PHASE") || "pdfs";
  const nombresCentros = Object.keys(CENTROS);

  // Fin de todo el proceso
  if (centroIndex >= nombresCentros.length) {
    properties.deleteProperty("CURRENT_CENTRO_INDEX");
    properties.deleteProperty("CURRENT_PHASE");
    eliminarTriggersDeContinuacion();
    console.log("¡Reporte Semanal completado exitosamente para TODOS los centros!");
    return;
  }

  const hoy           = new Date();
  const haceSieteDias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fechaEmision  = Utilities.formatDate(hoy, "GMT-3", "dd/MM/yyyy");
  const rangoTexto    = Utilities.formatDate(haceSieteDias, "GMT-3", "dd/MM/yyyy") + " - " + fechaEmision;

  const nombreCentro      = nombresCentros[centroIndex];
  const configCentro      = CENTROS[nombreCentro];
  const sensoresDelCentro = SENSORES.filter(s => s.centro === nombreCentro);

  console.log(`Centro ${centroIndex + 1}/${nombresCentros.length}: ${nombreCentro} | Fase: ${phase}`);

  if (phase === "pdfs") {
    // ── FASE 1: generar todos los PDFs del centro ──────────────────────
    sensoresDelCentro.forEach(s => {
      try {
        const data    = fetchThingSpeakDataCompleto(s.id, s.k, 7);
        const hasData = data && data.feeds && data.feeds.length > 0;
        const trazabilidad = "AUTO-INM-" + Utilities.formatDate(hoy, "GMT-3", "yyyyMMdd") + "-" + s.id;

        let analizada, conectividad, grafico;
        if (hasData) {
          analizada    = analizarDatos(data.feeds, s.field, s);
          conectividad = analizarConectividad(data.feeds, s.field, s);
          grafico      = generarGraficoCurva(data.feeds, s.field, s.n);
        } else {
          analizada = {
            alertasFilas: [],
            textoAnalisis: "SENSOR OFFLINE. No se registraron datos en los últimos 7 días.",
            textoRecom: "• Verificar conexión eléctrica y WiFi del equipo.\n• Contactar a soporte técnico de inmediato.",
            notaTecnica: "El sensor no ha transmitido datos hacia la plataforma en el período especificado. Equipo fuera de línea.",
            notaResponsabilidad: "Ante la ausencia de registros de temperatura automatizados, la viabilidad de las vacunas debe justificarse mediante los registros manuales físicos en papel, en estricto cumplimiento de la normativa."
          };
          conectividad = { filas: [], analisis: "Sensor sin conexión a internet.", recom: "Revisar alimentación y red WiFi." };
          grafico      = generarGraficoCurva([], s.field, s.n);
        }

        const pdfBlob = generarPDFOficial(s, fechaEmision, rangoTexto, trazabilidad, analizada, conectividad, grafico);
        const carpetaSemanal = DriveApp.getFolderById(configCentro.semanal);
        const file = carpetaSemanal.createFile(pdfBlob);
        file.setName("Informe_Semanal_" + s.n.replace(/ /g, "_") + "_" + trazabilidad + ".pdf");
        console.log(`  -> PDF generado para: ${s.n}`);
      } catch (e) {
        console.error(`  Error en sensor ${s.n}: ` + e.message);
      }
    });

    // Pasar a fase sheet
    properties.setProperty("CURRENT_PHASE", "sheet");
    crearTriggerDeContinuacion();
    console.log(`  PDFs completados. Generando planilla en 1 minuto...`);

  } else {
    // ── FASE 2: generar la planilla consolidada ────────────────────────
    try {
      // Volver a pedir los feeds (no los guardamos entre ejecuciones)
      const feedsPorSensor = [];
      sensoresDelCentro.forEach(s => {
        try {
          const data = fetchThingSpeakDataCompleto(s.id, s.k, 7);
          feedsPorSensor.push({
            sensor: s,
            feeds: (data && data.feeds) ? data.feeds : []
          });
        } catch(e) {
          console.error(`  Error obteniendo feeds para planilla, sensor ${s.n}: ` + e.message);
          feedsPorSensor.push({ sensor: s, feeds: [] });
        }
      });

      if (feedsPorSensor.length > 0) {
        generarSheetSemanal(feedsPorSensor, rangoTexto, hoy, configCentro.sheetFolder);
        console.log(`  -> Planilla consolidada creada para: ${nombreCentro}`);
      }
    } catch (e) {
      console.error(`  Error generando planilla para ${nombreCentro}: ` + e.message);
    }

    // Pasar al siguiente centro, volver a fase pdfs
    const siguienteCentro = centroIndex + 1;
    if (siguienteCentro >= nombresCentros.length) {
      properties.deleteProperty("CURRENT_CENTRO_INDEX");
      properties.deleteProperty("CURRENT_PHASE");
      eliminarTriggersDeContinuacion();
      console.log("¡Reporte Semanal completado exitosamente para TODOS los centros!");
    } else {
      properties.setProperty("CURRENT_CENTRO_INDEX", siguienteCentro.toString());
      properties.setProperty("CURRENT_PHASE", "pdfs");
      crearTriggerDeContinuacion();
      console.log(`  Centro completado. Continuando con el siguiente en 1 minuto...`);
    }
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
  const t1 = body.appendParagraph("INFORME TÉCNICO DE CADENA DE FRÍO - MONITOREO DE VACUNAS");
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
  body.appendParagraph("ALERTAS Y RECUPERACIONES (" + minRange + " - " + maxRange + ")")
    .setBold(true).setFontSize(10).setSpacingAfter(4);
  const tablaAlertas = [["Fecha y Hora", "Valor", "Estado", "Duración", "Pico Registrado"]];
  if (analizada.alertasFilas.length > 0) {
    analizada.alertasFilas.forEach(f => tablaAlertas.push([f.h, f.v, f.e, f.d, f.p || "--"]));
  } else {
    tablaAlertas.push(["-", "-", "Sin eventos fuera de rango", "-", "-"]);
  }
  estilizarTabla(body.appendTable(tablaAlertas));

  // --- EVENTOS DE CONECTIVIDAD ---
  body.appendParagraph("EVENTOS DETECTADOS (>10 min sin datos)")
    .setBold(true).setFontSize(10).setSpacingAfter(4);
  const tablaWifi = [["Inicio", "Fin", "Tipo de Corte", "T. Antes", "T. Desp.", "Duración"]];
  if (conectividad.filas.length > 0) {
    conectividad.filas.forEach(f => tablaWifi.push([f.inicio, f.fin, f.tipo, f.antes, f.despues, f.duracion]));
  } else {
    tablaWifi.push(["-", "-", "Sin interrupciones significativas", "-", "-", "-"]);
  }
  estilizarTabla(body.appendTable(tablaWifi));

  // --- ANÁLISIS Y RECOMENDACIONES ---
  body.appendParagraph("ANÁLISIS TÉCNICO:").setBold(true).setFontSize(10);
  if (analizada.textoAnalisis) {
    body.appendParagraph(analizada.textoAnalisis).setFontSize(9).setItalic(true);
  }
  if (conectividad.analisis) {
    body.appendParagraph("Conectividad:").setBold(true).setFontSize(9);
    body.appendParagraph(conectividad.analisis).setFontSize(9).setItalic(true);
  }

  body.appendParagraph("RECOMENDACIONES:").setBold(true).setFontSize(10).setForegroundColor("#00384d");
  body.appendParagraph(analizada.textoRecom + "\n• " + conectividad.recom).setFontSize(9);

  // Nota técnica final
  body.appendParagraph("NOTA TÉCNICA:").setBold(true).setFontSize(9).setForegroundColor("#475569");
  body.appendParagraph(analizada.notaTecnica).setFontSize(8).setItalic(true).setForegroundColor("#475569");

  // Nota de responsabilidad
  body.appendParagraph("RESPONSABILIDAD:").setBold(true).setFontSize(9).setForegroundColor("#475569");
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
  
  // Esperar a que Google Drive consolide el archivo antes de convertirlo a PDF
  Utilities.sleep(2000);
  
  let pdfBlob = null;
  const docId = doc.getId();
  for (let i = 0; i < 3; i++) {
    try {
      pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
      break; // Éxito, salir del loop
    } catch (e) {
      console.warn("Intento " + (i+1) + " de generar PDF falló. Reintentando...");
      Utilities.sleep(3000);
    }
  }
  
  DriveApp.getFileById(docId).setTrashed(true);
  
  if (!pdfBlob) {
    throw new Error("No se pudo generar el PDF por error de servidor en Google Drive.");
  }
  
  return pdfBlob;
}

/**
 * Busca un Google Sheet dentro de la carpeta indicada.
 * Si no existe, lo crea ahí mismo.
 * Devuelve el objeto SpreadsheetApp listo para usar.
 */
function abrirOCrearSheet(sheetFolderId, centroNombre) {
  const carpeta = DriveApp.getFolderById(sheetFolderId);
  const nombreSheet = "VICUS_Inmunizacion_" + centroNombre.replace(/ /g, "_");

  // Buscar si ya existe un Sheet en esa carpeta
  const archivos = carpeta.getFilesByType(MimeType.GOOGLE_SHEETS);
  while (archivos.hasNext()) {
    const f = archivos.next();
    if (f.getName() === nombreSheet) {
      return SpreadsheetApp.openById(f.getId());
    }
  }

  // No existe — crear uno nuevo dentro de la carpeta
  console.log(`[Sheet - ${centroNombre}] Creando nueva planilla en la carpeta...`);
  const nuevaSS = SpreadsheetApp.create(nombreSheet);
  const file = DriveApp.getFileById(nuevaSS.getId());
  carpeta.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  console.log(`[Sheet - ${centroNombre}] Planilla creada: ${nuevaSS.getId()}`);
  return nuevaSS;
}

function generarSheetSemanal(feedsPorSensor, rango, hoy, sheetFolderId) {
  try {
    const centroNombre = feedsPorSensor[0].sensor.centro;
    const ss = abrirOCrearSheet(sheetFolderId, centroNombre);
    const nombreHoja = Utilities.formatDate(hoy, "GMT-3", "dd-MM-yyyy");
    
    let hoja = ss.getSheetByName(nombreHoja);
    if (hoja) ss.deleteSheet(hoja);
    hoja = ss.insertSheet(nombreHoja);
    
    console.log(`[Sheet - ${centroNombre}] Generando planilla consolidada...`);
    
    // --- ENCABEZADO ---
    const encabezados = ["Fecha y Hora"];
    feedsPorSensor.forEach(fs => encabezados.push(fs.sensor.n + " (°C)"));
    const numCols = encabezados.length;
    const filaEncabezado = 4;

    // Título y período en batch
    hoja.getRange("A1:A2").setValues([
      ["INFORME CONSOLIDADO SEMANAL - " + centroNombre.toUpperCase()],
      ["Período: " + rango]
    ]);
    hoja.getRange("A1").setFontWeight("bold").setFontSize(14).setFontColor("#00384d");
    hoja.getRange("A2").setFontStyle("italic");

    // Fila de encabezados de columnas
    hoja.getRange(filaEncabezado, 1, 1, numCols)
        .setValues([encabezados])
        .setBackground("#00384d")
        .setFontColor("white")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");

    // --- CONSTRUIR MATRIZ DE DATOS agrupando por minuto ---
    // Los sensores no envían exactamente al mismo segundo;
    // agrupar por minuto evita filas duplicadas y reduce el tamaño de la planilla.
    const mapaTemp = {};
    feedsPorSensor.forEach((fs, idx) => {
      fs.feeds.forEach(f => {
        const val = parseFloat(f[fs.sensor.field]);
        if (isNaN(val) || val === -127) return;
        const clave = fmtFecha(new Date(f.created_at));
        if (!mapaTemp[clave]) mapaTemp[clave] = { valores: {} };
        if (mapaTemp[clave].valores[idx] !== undefined) {
          mapaTemp[clave].valores[idx] = (mapaTemp[clave].valores[idx] + val) / 2;
        } else {
          mapaTemp[clave].valores[idx] = val;
        }
      });
    });

    const toDate = s => {
      const [fecha, hora] = s.split(' ');
      const [d, m, y] = fecha.split('/');
      return new Date(`${y}-${m}-${d}T${hora}:00`);
    };

    const claves = Object.keys(mapaTemp).sort((a, b) => toDate(a) - toDate(b));

    const filas = claves.map(clave => {
      const fila = [clave];
      feedsPorSensor.forEach((_, idx) => {
        const v = mapaTemp[clave].valores[idx];
        fila.push((v !== undefined && !isNaN(v)) ? Math.round(v * 100) / 100 : "");
      });
      return fila;
    });

    if (filas.length > 0) {
      const filaInicio = filaEncabezado + 1;
      const numFilas = filas.length;

      // Escribir todos los datos en UNA sola llamada
      hoja.getRange(filaInicio, 1, numFilas, numCols).setValues(filas);

      // Formato numérico y alineación en batch
      if (numCols > 1) {
        hoja.getRange(filaInicio, 2, numFilas, numCols - 1)
            .setHorizontalAlignment("center")
            .setNumberFormat("0.00");
      }

      // Formato condicional: construir TODAS las reglas juntas y aplicar en UNA llamada
      const todasLasReglas = [];
      feedsPorSensor.forEach((fs, idx) => {
        const col = idx + 2;
        const rangoCol = hoja.getRange(filaInicio, col, numFilas, 1);
        const minVal = fs.sensor.isFreezer ? -28.0 : 2.0;
        const maxVal = fs.sensor.isFreezer ? -18.0 : 8.0;
        todasLasReglas.push(
          SpreadsheetApp.newConditionalFormatRule()
            .whenNumberGreaterThan(maxVal)
            .setBackground("#fecaca").setFontColor("#dc2626")
            .setRanges([rangoCol]).build(),
          SpreadsheetApp.newConditionalFormatRule()
            .whenNumberLessThan(minVal)
            .setBackground("#bfdbfe").setFontColor("#1d4ed8")
            .setRanges([rangoCol]).build()
        );
      });
      hoja.setConditionalFormatRules(todasLasReglas);

      // Anchos de columna en batch
      hoja.setColumnWidth(1, 140);
      for (let i = 0; i < feedsPorSensor.length; i++) {
        hoja.setColumnWidth(i + 2, 130);
      }
    }

    // --- RESUMEN ESTADÍSTICO en batch ---
    const filaResumen = filaEncabezado + filas.length + 2;
    const etiquetas = ["RESUMEN ESTADÍSTICO", "Mínimo (°C)", "Máximo (°C)", "Promedio (°C)", "Lecturas totales"];
    
    // Escribir etiquetas en una sola llamada
    hoja.getRange(filaResumen, 1, etiquetas.length, 1)
        .setValues(etiquetas.map(e => [e]));
    hoja.getRange(filaResumen, 1).setFontWeight("bold").setFontColor("#00384d").setFontSize(10);
    hoja.getRange(filaResumen + 1, 1, 4, 1).setFontWeight("bold");

    // Calcular y escribir estadísticas en batch por sensor
    feedsPorSensor.forEach((fs, idx) => {
      const col = idx + 2;
      const valores = filas
        .map(f => f[col - 1])
        .filter(v => v !== "" && !isNaN(v))
        .map(Number);

      let stats;
      if (valores.length > 0) {
        const minVal = Math.min(...valores);
        const maxVal = Math.max(...valores);
        const avg = Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100;
        stats = [[minVal], [maxVal], [avg], [valores.length]];
      } else {
        stats = [["--"], ["--"], ["--"], [0]];
      }
      // Una sola llamada por sensor en lugar de 4
      hoja.getRange(filaResumen + 1, col, 4, 1).setValues(stats);
    });

    hoja.getRange(filaResumen + 1, 1, 4, numCols)
        .setBackground("#f1f5f9")
        .setBorder(true, true, true, true, true, true);

    hoja.setFrozenRows(filaEncabezado);
    console.log(`[Sheet - ${centroNombre}] ¡generarSheetSemanal completado!`);
  } catch(e) { console.error("Error en Sheet: " + e.message); }
}

function fetchThingSpeakDataCompleto(id, key, dias) {
  const ahora   = new Date();
  const inicio  = new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000);
  
  let todosLosFeeds = [];
  let fechaHasta    = new Date(ahora);
  let intentos      = 0;
  const MAX_INTENTOS = 10; // hasta 80.000 registros

  while (intentos < MAX_INTENTOS) {
    const startStr = Utilities.formatDate(inicio,     "GMT-3", "yyyy-MM-dd'T'HH:mm:ss");
    const endStr   = Utilities.formatDate(fechaHasta, "GMT-3", "yyyy-MM-dd'T'HH:mm:ss");

    const url = `https://api.thingspeak.com/channels/${id}/feeds.json?api_key=${key}&start=${startStr}-03:00&end=${endStr}-03:00&results=8000`;
    const res  = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const data = JSON.parse(res.getContentText());

    if (!data.feeds || data.feeds.length === 0) break;

    // Prepend: los feeds vienen en orden ascendente, los agregamos al inicio
    const primerTs = todosLosFeeds.length > 0
      ? new Date(todosLosFeeds[0].created_at).getTime()
      : Infinity;

    const nuevos = data.feeds.filter(f => new Date(f.created_at).getTime() < primerTs);
    todosLosFeeds = nuevos.concat(todosLosFeeds);

    // Si devolvió menos de 8000 ya tenemos todo el período
    if (data.feeds.length < 8000) break;

    // Retroceder: el siguiente bloque termina justo antes del primer feed recibido
    fechaHasta = new Date(new Date(data.feeds[0].created_at).getTime() - 60000);

    // Si ya llegamos al inicio del período, terminamos
    if (fechaHasta <= inicio) break;

    intentos++;
    Utilities.sleep(500);
  }

  // Filtrar solo los feeds dentro del período solicitado
  const inicioMs = inicio.getTime();
  todosLosFeeds = todosLosFeeds.filter(f => new Date(f.created_at).getTime() >= inicioMs);

  return { feeds: todosLosFeeds };
}

function generarGraficoCurva(feeds, field, nombre) {
  const dataTable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, "Tiempo")
    .addColumn(Charts.ColumnType.NUMBER, "°C");

  // Filtrar -127 y calcular min/max para el eje Y
  const vals = feeds.map(f => parseFloat(f[field])).filter(v => !isNaN(v) && v !== -127);
  if (vals.length === 0) {
    // Sin datos válidos: gráfico vacío con punto dummy
    dataTable.addRow(["Sin datos", 5]);
    return Charts.newLineChart()
      .setDataTable(dataTable)
      .setDimensions(2200, 520)
      .setColors(["#3b82f6"])
      .setOption("backgroundColor", "white")
      .build().getAs('image/png');
  }

  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  const yMin = minVal - 0.5;
  const yMax = maxVal + 0.5;

  const numPuntos = 800;
  const step = Math.max(1, Math.floor(feeds.length / numPuntos));

  // PASO 1: Detectar gaps REALES en los datos CRUDOS (>10 min sin lecturas)
  // Esto se hace ANTES del muestreo para no perder precisión.
  const UMBRAL_GAP_MS = 10 * 60 * 1000; // 10 minutos
  const gapsReales = []; // Array de { desde: ms, hasta: ms }
  for (let i = 1; i < feeds.length; i++) {
    const t1 = new Date(feeds[i - 1].created_at).getTime();
    const t2 = new Date(feeds[i].created_at).getTime();
    if ((t2 - t1) > UMBRAL_GAP_MS) {
      gapsReales.push({ desde: t1, hasta: t2 });
    }
  }

  // PASO 2: Muestrear para el gráfico
  const puntosMuestreados = [];
  for (let i = 0; i < feeds.length; i += step) {
    puntosMuestreados.push(feeds[i]);
  }

  // PASO 3: Construir la tabla del gráfico, insertando null donde haya un gap real
  let ultimoTsValido = null;

  for (let i = 0; i < puntosMuestreados.length; i++) {
    const f = puntosMuestreados[i];
    const val = parseFloat(f[field]);
    const date = new Date(f.created_at);

    if (isNaN(date.getTime())) continue;

    const esInvalido = isNaN(val) || val === -127;

    // ¿Hay algún gap real entre el último punto válido y este?
    if (ultimoTsValido !== null) {
      const hayGap = gapsReales.some(g => g.desde >= ultimoTsValido && g.hasta <= date.getTime());
      if (hayGap) {
        dataTable.addRow([fmtFecha(date).slice(0, 13), null]);
      }
    }

    if (esInvalido) {
      // Punto inválido: insertar null para dejar espacio vacío
      dataTable.addRow([fmtFecha(date).slice(0, 13), null]);
      // No actualizamos ultimoTsValido para que el gap se siga calculando
    } else {
      dataTable.addRow([fmtFecha(date).slice(0, 13), val]);
      ultimoTsValido = date.getTime();
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

// =====================================================================
//  ANÁLISIS DE DATOS DE TEMPERATURA
// =====================================================================
function analizarDatos(feeds, field, sensor) {
  const isFreezer = sensor.isFreezer || false;
  const minOk = isFreezer ? -28.0 : 2.0;
  const maxOk = isFreezer ? -18.0 : 8.0;

  const alertasFilas = [];
  let enAlerta = false;
  let inicioAlerta = null;
  let valorAlerta = null;
  let tipoAlerta = null;
  let picoValor = null;
  let picoTs = null;

  const valores = feeds
    .map(f => ({ ts: new Date(f.created_at), val: parseFloat(f[field]) }))
    .filter(f => !isNaN(f.val) && f.val !== -127);

  valores.forEach(punto => {
    const fuera = punto.val < minOk || punto.val > maxOk;
    const tipo = punto.val > maxOk ? "ALTA" : punto.val < minOk ? "BAJA" : null;

    if (fuera && !enAlerta) {
      enAlerta = true;
      inicioAlerta = punto.ts;
      valorAlerta = punto.val;
      tipoAlerta = tipo;
      picoValor = punto.val;
      picoTs = punto.ts;
    } else if (fuera && enAlerta) {
      // Actualizar pico: máximo si es ALTA, mínimo si es BAJA
      if (tipoAlerta === "ALTA" && punto.val > picoValor) { picoValor = punto.val; picoTs = punto.ts; }
      if (tipoAlerta === "BAJA" && punto.val < picoValor) { picoValor = punto.val; picoTs = punto.ts; }
    } else if (!fuera && enAlerta) {
      const durMin = (punto.ts - inicioAlerta) / 60000;
      const picoStr = picoValor !== null ? picoValor.toFixed(1) + "°C (" + fmtFecha(picoTs) + ")" : "--";
      alertasFilas.push({
        h: fmtFecha(inicioAlerta),
        v: valorAlerta.toFixed(1) + "°C",
        e: tipoAlerta === "ALTA" ? "⚠ TEMP. ALTA" : "❄ TEMP. BAJA",
        d: formatDur(durMin),
        p: picoStr
      });
      enAlerta = false;
      picoValor = null;
      picoTs = null;
    }
  });

  // Alerta abierta al final del período
  if (enAlerta && inicioAlerta) {
    const ultimo = valores[valores.length - 1].ts;
    const durMin = (ultimo - inicioAlerta) / 60000;
    const picoStr = picoValor !== null ? picoValor.toFixed(1) + "°C (" + fmtFecha(picoTs) + ")" : "--";
    alertasFilas.push({
      h: fmtFecha(inicioAlerta),
      v: valorAlerta.toFixed(1) + "°C",
      e: (tipoAlerta === "ALTA" ? "⚠ TEMP. ALTA" : "❄ TEMP. BAJA") + " (en curso)",
      d: formatDur(durMin),
      p: picoStr
    });
  }

  // Estadísticas generales
  const vals = valores.map(f => f.val);
  const minVal = vals.length ? Math.min(...vals) : null;
  const maxVal = vals.length ? Math.max(...vals) : null;
  const avg    = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  const pctFuera = vals.length ? (vals.filter(v => v < minOk || v > maxOk).length / vals.length * 100) : 0;
  const pctFueraStr = pctFuera < 0.1 && pctFuera > 0 ? pctFuera.toFixed(2) : pctFuera.toFixed(1);

  // Calcular duración total de eventos para el análisis clínico
  const totalDurMin = alertasFilas.reduce((acc, f) => {
    const parts = f.d.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
    if (!parts) return acc;
    if (parts[1]) return acc + parseInt(parts[1]) * 60 + parseInt(parts[2] || 0);
    if (parts[3]) return acc + parseInt(parts[3]) * 60;
    if (parts[4]) return acc + parseInt(parts[4]);
    return acc;
  }, 0);

  const tieneAltas = alertasFilas.some(f => f.e.includes("ALTA"));
  const tieneBajas = alertasFilas.some(f => f.e.includes("BAJA"));

  let textoAnalisis = "";
  let textoRecom = "";
  let notaTecnica = "";
  let notaResponsabilidad = "";

  if (vals.length === 0) {
    textoAnalisis = "No se registraron datos en el período analizado.";
    textoRecom = "• Verificar conexión del sensor.\n• Revisar alimentación eléctrica del equipo.";
    notaTecnica = "Sin datos disponibles para el período.";
    notaResponsabilidad = "Ante la ausencia de registros automatizados, la viabilidad de las vacunas debe justificarse mediante registros manuales físicos.";
  } else {
    const rangoStr = isFreezer ? "-28°C a -18°C" : "2°C a 8°C";

    if (alertasFilas.length === 0) {
      textoAnalisis = "No se registraron desvíos de temperatura en el período analizado. El equipo se mantuvo dentro del rango térmico de seguridad programado.";
      textoRecom = "• Continuar con el monitoreo automático y rutinario.\n• Verificar el correcto cierre hermético de puertas.\n• Mantener actualizados los inventarios de vacunas.";
    } else {
      textoAnalisis = "Se registraron desvíos térmicos acumulados por un total de " + formatDur(totalDurMin) + ".\n";
      textoAnalisis += "• Incidentes de calor (>" + maxOk + "°C): " + alertasFilas.filter(f => f.e.includes("ALTA")).length + "\n";
      textoAnalisis += "• Incidentes de frío (<" + minOk + "°C): " + alertasFilas.filter(f => f.e.includes("BAJA")).length + "\n";
      if (tieneBajas) {
        textoAnalisis += "\n⚠ ADVERTENCIA CRÍTICA: Se detectó riesgo de CONGELACIÓN. La exposición a temperaturas inferiores a " + minOk + "°C puede inactivar de forma irreversible la potencia de vacunas adyuvadas (Hepatitis B, Gripal, Neumococo, VPH, DPT). Esto compromete seriamente la efectividad de los esquemas vacunales y requiere especial atención.\n";
      }
      if (totalDurMin < 15) {
        textoAnalisis += "\nLos desvíos detectados fueron cortos. Se asume que no hay degradación de los antígenos, pero se sugiere supervisar hermeticidad y termostatos.";
      } else if (totalDurMin < 120) {
        textoAnalisis += "\nDesvío térmico moderado. Se recomienda formalizar la novedad en el libro de incidencias y reportar al Referente de Vacunas para su supervisión.";
      } else {
        textoAnalisis += "\nDESVÍO CRÍTICO Y PROLONGADO: Se sugiere apartar de manera temporal el lote involucrado colocándolo en un contenedor seguro rotulado 'NO UTILIZAR - BLOQUEADO', suspender temporalmente su colocación y realizar la consulta formal de estabilidad al Departamento de Inmunizaciones provincial.";
      }

      textoRecom = "";
      if (tieneAltas) {
        textoRecom += "• Calor excesivo: Comprobar el cierre magnético de las puertas y la limpieza del radiador externo del motor.\n";
        textoRecom += "• Mantener la colocación de botellas de agua fría en la parte inferior para aumentar la inercia térmica.\n";
      }
      if (tieneBajas) {
        textoRecom += "• Frío extremo: Comprobar que los empaques no estén en contacto con la pared fría trasera del refrigerador.\n";
        textoRecom += "• Ejecutar el 'Test de Agitación' en vacunas combinadas adyuvadas en caso de sospechar cristalización.\n";
      }
      textoRecom += "• Registrar obligatoriamente el incidente clínico en el registro manual de novedades de la cadena de frío.\n";
      textoRecom += "• Calibrar y constatar la lectura del datalogger con un termómetro patrón habilitado.";
    }

    notaTecnica = "Las calibraciones de los registradores continuos de temperatura deben realizarse al menos anualmente por " +
      "laboratorios acreditados, según la Disposición ANMAT N° 2069/2018. Las intervenciones correctivas del equipamiento de frío " +
      "serán ejecutadas por personal técnico de mantenimiento calificado. Ante oscilaciones térmicas persistentes, notificar de " +
      "inmediato a la Jefatura Sanitaria para activar los planes de contingencia (que incluyen el uso de grupo electrógeno de " +
      "respaldo o traslado a conservadoras). Toda novedad operativa debe registrarse de forma trazable en el libro de control " +
      "firmado por el responsable, en cumplimiento de la Resolución N° 527/2005 (Neuquén) y la Ley Nacional de Vacunas N° 27.491.";

    notaResponsabilidad = "La preservación de la cadena de frío, potencia y custodia de los inmunobiológicos es responsabilidad directa " +
      "e indelegable del personal a cargo de los vacunatorios y sus autoridades de jefatura, conforme a la Ley Nacional " +
      "N° 27.491 (reglamentada por Decreto 439/2023) y la Resolución N° 527/2005 (Neuquén) de habilitación de vacunatorios. " +
      "Ante cualquier incidente crítico, notificar de inmediato.";
  }

  return { alertasFilas, textoAnalisis, textoRecom, notaTecnica, notaResponsabilidad };
}

// =====================================================================
//  ANÁLISIS DE CONECTIVIDAD (cortes > 10 minutos)
// =====================================================================
function analizarConectividad(feeds, field, sensor) {
  const UMBRAL_MIN = 10; // minutos sin datos = corte
  const filas = [];

  const puntos = feeds
    .map(f => ({ ts: new Date(f.created_at), val: parseFloat(f[field]) }))
    .filter(f => !isNaN(f.ts.getTime()) && f.val !== -127)
    .sort((a, b) => a.ts - b.ts);

  for (let i = 1; i < puntos.length; i++) {
    const gapMin = (puntos[i].ts - puntos[i - 1].ts) / 60000;
    if (gapMin >= UMBRAL_MIN) {
      const tempAntes = puntos[i - 1].val;
      const tempDesp = puntos[i].val;
      let tipo = "Sin datos";
      if (!isNaN(tempAntes) && !isNaN(tempDesp)) {
        const diff = tempDesp - tempAntes;
        tipo = Math.abs(diff) < 0.5 ? "Corte WiFi/Red" : diff > 0 ? "Corte + Suba de temp." : "Corte + Baja de temp.";
      }
      filas.push({
        inicio: fmtFecha(puntos[i - 1].ts),
        fin:    fmtFecha(puntos[i].ts),
        tipo:   tipo,
        antes:   isNaN(tempAntes) ? "--" : tempAntes.toFixed(1) + "°C",
        despues: isNaN(tempDesp)  ? "--" : tempDesp.toFixed(1)  + "°C",
        duracion: formatDur(gapMin)
      });
    }
  }

  let analisis = "";
  let recom = "";

  if (filas.length === 0) {
    analisis = "Transmisión continua de datos WiFi confirmada. No se registraron brechas de trazabilidad digital en el período.";
    recom = "• Mantener los equipos de comunicación de red WiFi conectados de manera ininterrumpida.\n• Revisar periódicamente la señal (RSSI) del dispositivo datalogger.";
  } else {
    const totalDurMin = filas.reduce((acc, f) => {
      const parts = f.duracion.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
      if (!parts) return acc;
      if (parts[1]) return acc + parseInt(parts[1]) * 60 + parseInt(parts[2] || 0);
      if (parts[3]) return acc + parseInt(parts[3]) * 60;
      if (parts[4]) return acc + parseInt(parts[4]);
      return acc;
    }, 0);
    analisis = "Interrupciones de transmisión de datos detectadas: " + filas.length + ".\n";
    analisis += "• Duración acumulada sin datos: " + formatDur(totalDurMin) + "\n";
    if (totalDurMin < 60) {
      analisis += "\nLos cortes de señal WiFi fueron breves y no comprometen la trazabilidad clínica global. Se asume estabilidad de la heladera.";
    } else {
      analisis += "\nLas interrupciones prolongadas representan una brecha de trazabilidad. Es mandatorio constatar los registros de control manual en las planillas del Vacunatorio para el período afectado.";
    }
    recom = "• Verificar el suministro de alimentación eléctrica del router local (se aconseja usar UPS).\n";
    recom += "• Asegurar la correcta orientación de la antena del datalogger y evitar barreras metálicas.\n";
    recom += "• Ante cortes de señal recurrentes, asentar lecturas de temperatura de forma manual en planillas oficiales cada 4 horas.";
  }

  return { filas, analisis, recom };
}

function estilizarTabla(t) {
  const r0 = t.getRow(0);
  for(let i=0; i<r0.getNumCells(); i++) r0.getCell(i).setBackgroundColor("#f1f5f9").setBold(true).setFontSize(9);
  for(let i=1; i<t.getNumRows(); i++) {
    for(let j=0; j<t.getRow(i).getNumCells(); j++) t.getRow(i).getCell(j).setFontSize(8);
  }
}
function formatDur(m) { return m < 60 ? Math.round(m) + "m" : Math.floor(m/60) + "h " + Math.round(m%60) + "m"; }

/**
 * Formatea una fecha a GMT-3 sin usar Utilities.formatDate (10-20x más rápido).
 * Formato: dd/MM/yyyy HH:mm  o  dd/MM/yyyy HH:mm:ss según el parámetro.
 */
function fmtFecha(date, conSegundos) {
  const d = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  const p = n => String(n).padStart(2, '0');
  const base = `${p(d.getUTCDate())}/${p(d.getUTCMonth()+1)}/${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
  return conSegundos ? base + ':' + p(d.getUTCSeconds()) : base;
}

function doPost(e) {
  try {
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
    return ContentService.createTextOutput(JSON.stringify({result: false, error: "Acción no reconocida"})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({result: false, error: e.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) { return ContentService.createTextOutput("Vicus Multi-Centro Online."); }

function buscarLogoEnDrive(n) {
  const f = DriveApp.getFilesByName(n);
  return f.hasNext() ? f.next().getBlob() : null;
}

function diagnosticarSensor() {
  const s = { id: '3003527', k: '9ALDC8QUP8JV6ZDJ', n: 'Briket NHC11941', field: 'field1' };
  const t0 = new Date();
  const data = fetchThingSpeakDataCompleto(s.id, s.k, 7);
  console.log("Feeds obtenidos: " + data.feeds.length + " en " + ((new Date()-t0)/1000).toFixed(1) + "s");
}
