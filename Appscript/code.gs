function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Invalid request: No parameters received."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = e.parameter.role;
    const isFaculty = role === "Faculty";
    const action = e.parameter.action || "register";

    Logger.log(`Received request: action=${action}, role=${role}`);

    const sheetName = isFaculty ? "teacherCredentials" : "Sheet1";
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: `Sheet "${sheetName}" not found`
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const studentHeaders = ["First Name", "Last Name", "DOB", "Email", "Mobile Number", "Address", "Guardian Name", "Guardian Number", "Password", "DeviceID", "LoginTime", "Active", "MultipleDevices"];
    const facultyHeaders = ["First Name", "Last Name", "DOB", "Email", "Mobile Number", "Address", "Department", "Password"];
    const headers = isFaculty ? facultyHeaders : studentHeaders;

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    if (action === "register") {
      const firstName = e.parameter.firstName || "";
      const lastName = e.parameter.lastName || "";
      const dob = e.parameter.dob || ""; 
      const email = e.parameter.email || "";
      const mobile = e.parameter.mobile || "";
      const address = e.parameter.address || "";
      const guardianName = e.parameter.guardianName || ""; 
      const guardianMobile = e.parameter.guardianMobile || ""; 
      const department = isFaculty ? e.parameter.department || "" : ""; 
      const password = e.parameter.password || "";
      const confirmPassword = e.parameter.confirmPassword || "";

      Logger.log(`Registering: role=${role}, email=${email}`);

      const rowData = isFaculty
        ? [firstName, lastName, dob, email, mobile, address, department, password]
        : [firstName, lastName, dob, email, mobile, address, guardianName, guardianMobile, password, "", "", "", ""];

      sheet.appendRow(rowData);

      var response = {
        status: "success",
        message: "Data saved successfully"
      };
    } else if (action === "login" && !isFaculty) {
      const email = e.parameter.email || "";
      const password = e.parameter.password || "";
      const deviceId = e.parameter.deviceId || "";

      Logger.log(`Login attempt: email=${email}, password=${password}, deviceId=${deviceId}`);

      const data = sheet.getDataRange().getValues();
      const userRowIndex = data.slice(1).findIndex(row => row[3].toLowerCase() === email.toLowerCase() && row[8] === password);

      Logger.log(`User row index: ${userRowIndex}`);

      if (userRowIndex === -1) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Invalid credentials"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const userRow = data[userRowIndex + 1];
      const currentDeviceId = userRow[9] || "";
      const currentActive = userRow[11] || "";
      let multipleDevices = userRow[12] || "No";

      if (currentActive === "Yes" && currentDeviceId !== "" && currentDeviceId !== deviceId) {
        multipleDevices = "Yes";
        sheet.getRange(userRowIndex + 2, 13).setValue(multipleDevices);
        return ContentService.createTextOutput(JSON.stringify({
          status: "device_error",
          message: "Already logged in on another device"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.getRange(userRowIndex + 2, 10).setValue(deviceId);
      sheet.getRange(userRowIndex + 2, 11).setValue(new Date().toISOString());
      sheet.getRange(userRowIndex + 2, 12).setValue("Yes");
      sheet.getRange(userRowIndex + 2, 13).setValue(multipleDevices);

      var response = {
        status: "success",
        multipleDevices: multipleDevices
      };
    } else if (action === "logout" && !isFaculty) {
      const email = e.parameter.email || "";
      const deviceId = e.parameter.deviceId || "";

      Logger.log(`Logout attempt: email=${email}, deviceId=${deviceId}`);

      const data = sheet.getDataRange().getValues();
      const userRowIndex = data.slice(1).findIndex(row => row[3].toLowerCase() === email.toLowerCase() && row[9] === deviceId && row[11] === "Yes");

      Logger.log(`Logout user row index: ${userRowIndex}`);

      if (userRowIndex !== -1) {
        sheet.getRange(userRowIndex + 2, 12).setValue("No");

        const activeSessions = data.slice(1).some(row => 
          row[3].toLowerCase() === email.toLowerCase() && row[11] === "Yes" && row[9] !== deviceId
        );

        Logger.log(`Any active sessions remaining: ${activeSessions}`);

        if (!activeSessions) {
          sheet.getRange(userRowIndex + 2, 13).setValue("No");
        }
      }

      var response = {
        status: "success",
        message: "Logged out successfully"
      };
    } else {
      Logger.log(`Unsupported action or role: action=${action}, role=${role}`);
      var response = {
        status: "error",
        message: "Action not supported for this role yet"
      };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error: ${error.message}`);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}