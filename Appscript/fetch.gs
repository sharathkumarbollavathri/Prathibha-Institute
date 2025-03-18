function doGet(e) {
  var userType = e.parameter.userType;
  var sheet;
  
  if (userType === "Faculty") {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("teacherCredentials");
  } else if (userType === "Admin") {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("adminCredentials");
  } else {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  }

  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ records: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var jsonData = { records: [] };
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j].toLowerCase()] = data[i][j];
    }
    jsonData.records.push(row);
  }

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}