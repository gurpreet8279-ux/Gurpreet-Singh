const { google } = require('googleapis');
async function run() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    console.log("ProjectId:", projectId);
    console.log("Client created successfully!");
  } catch(e) {
    console.error("ADC error:", e);
  }
}
run();
