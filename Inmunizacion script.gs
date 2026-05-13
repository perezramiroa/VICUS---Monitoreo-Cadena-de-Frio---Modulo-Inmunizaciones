/**
 * VICUS INMUNIZACIÓN - SISTEMA DE ALMACENAMIENTO DE INFORMES TÉCNICOS
 * Versión: 2.3
 */

function doPost(e) {
  try {
    // 1. Recibir y procesar los datos enviados desde el reporte
    var data = JSON.parse(e.postData.contents);
    
    if (data.action === 'guardarPDF') {
      // 2. Decodificar el archivo PDF (Base64 a Blob)
      var pdfData = Utilities.base64Decode(data.pdfData);
      var blob = Utilities.newBlob(pdfData, 'application/pdf', data.filename);
      
      // 3. Determinar la carpeta destino
      // Si por alguna razón no llega un folderId, podrías poner uno fijo aquí entre comillas
      var targetFolderId = data.folderId; 
      
      if (!targetFolderId) {
        throw new Error("No se especificó un ID de carpeta destino.");
      }
      
      // 4. Acceder a la carpeta y crear el archivo
      var folder = DriveApp.getFolderById(targetFolderId);
      var file = folder.createFile(blob);
      
      // 5. Responder con éxito
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'success',
        'fileId': file.getId(),
        'filename': data.filename,
        'trazabilidad': data.trazabilidad
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    // En caso de error, responder con el detalle
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función simple para verificar que el script está online
 */
function doGet(e) {
  return ContentService.createTextOutput("Vicus Inmunización Apps Script: Conexión Establecida.");
}
