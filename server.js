const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CUSTOM_PLANS_FILE = 'custom_plans.xlsx';
const COMPLAINTS_FILE = 'complaints.xlsx';

function initializeExcelFile(filename, headers) {
if (!fs.existsSync(filename)) {
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([headers]);
XLSX.utils.book_append_sheet(wb, ws, 'Data');
XLSX.writeFile(wb, filename);
console.log(`✅ Created ${filename}`);
}
}

function appendToExcel(filename, data) {
const wb = XLSX.readFile(filename);
const ws = wb.Sheets[wb.SheetNames[0]];
const existingData = XLSX.utils.sheet_to_json(ws, { header: 1 });
existingData.push(data);
const newWs = XLSX.utils.aoa_to_sheet(existingData);
wb.Sheets[wb.SheetNames[0]] = newWs;
XLSX.writeFile(wb, filename);
}

initializeExcelFile(CUSTOM_PLANS_FILE, [
'ID', 'Date', 'Company Name', 'Industry', 'Budget Range', 
'Project Timeline', 'Services Required', 'Project Goals', 
'Contact Email', 'Phone Number'
]);

initializeExcelFile(COMPLAINTS_FILE, [
'ID', 'Date', 'Customer Name', 'Email', 'Order ID', 
'Issue Category', 'Description'
]);

let customPlanCounter = 1;
let complaintCounter = 1;

if (fs.existsSync(CUSTOM_PLANS_FILE)) {
const wb = XLSX.readFile(CUSTOM_PLANS_FILE);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
customPlanCounter = data.length > 1 ? data.length : 1;
}

if (fs.existsSync(COMPLAINTS_FILE)) {
const wb = XLSX.readFile(COMPLAINTS_FILE);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
complaintCounter = data.length > 1 ? data.length : 1;
}

app.post('/api/custom-plan', (req, res) => {
const {
company_name,
industry,
budget_range,
project_timeline,
services_required,
project_goals,
contact_email,
phone_number
} = req.body;

if (!company_name || !industry || !budget_range || !project_timeline || 
!services_required || !project_goals || !contact_email || !phone_number) {
return res.status(400).json({ 
success: false, 
message: 'All fields are required' 
});
}

try {
const currentDate = new Date().toLocaleString();
const requestId = `NX${customPlanCounter}`;

const rowData = [
requestId,
currentDate,
company_name,
industry,
budget_range,
project_timeline,
services_required,
project_goals,
contact_email,
phone_number
];

appendToExcel(CUSTOM_PLANS_FILE, rowData);
customPlanCounter++;

console.log(`✅ Custom plan saved to Excel: ${requestId}`);

res.json({ 
success: true, 
message: 'Custom plan submitted successfully',
request_id: requestId
});
} catch (error) {
console.error('Error saving to Excel:', error);
res.status(500).json({ 
success: false, 
message: 'Error saving data' 
});
}
});

app.post('/api/complaint', (req, res) => {
const {
customer_name,
email,
order_id,
issue_category,
description
} = req.body;

if (!customer_name || !email || !issue_category || !description) {
return res.status(400).json({ 
success: false, 
message: 'Required fields are missing' 
});
}

try {
const currentDate = new Date().toLocaleString();
const ticketId = `NX-${complaintCounter}`;

const rowData = [
ticketId,
currentDate,
customer_name,
email,
order_id || 'N/A',
issue_category,
description
];

appendToExcel(COMPLAINTS_FILE, rowData);
complaintCounter++;

console.log(`✅ Complaint saved to Excel: ${ticketId}`);

res.json({ 
success: true, 
message: 'Complaint submitted successfully',
ticket_id: ticketId
});
} catch (error) {
console.error('Error saving to Excel:', error);
res.status(500).json({ 
success: false, 
message: 'Error saving data' 
});
}
});

app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📊 Data will be saved to Excel files`);
console.log(`📁 Custom Plans: ${CUSTOM_PLANS_FILE}`);
console.log(`📁 Complaints: ${COMPLAINTS_FILE}`);
});