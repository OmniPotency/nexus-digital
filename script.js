const API_URL = 'http://localhost:3000/api';
function navigateToPage(p) {
document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
const s = document.getElementById(p);
s && s.classList.add('active');
document.querySelectorAll('.nav-link').forEach(l => {
l.classList.remove('active');
l.getAttribute('data-page') === p && l.classList.add('active');
});
window.scrollTo({top: 0, behavior: 'smooth'});
}
function selectPackage(n) {
alert(`🎉 Excellent Choice!\n\nYou've selected the ${n} Package.\n\nOur team will contact you shortly to discuss:\n• Implementation timeline\n• Custom requirements\n• Payment options\n• Next steps\n\nThank you for choosing Nexus Digital!`);
}
document.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', function(e) {
e.preventDefault();
navigateToPage(this.getAttribute('data-page'));
}));
const t = document.getElementById('topLayer');
const h = document.getElementById('home');
if (h && t) {
h.addEventListener('mousemove', function(e) {
const r = h.getBoundingClientRect();
const x = ((e.clientX - r.left) / r.width) * 100;
const y = ((e.clientY - r.top) / r.height) * 100;
t.style.clipPath = `circle(10% at ${x}% ${y}%)`;
});
h.addEventListener('mouseleave', () => t.style.clipPath = 'circle(0% at 50% 50%)');
h.addEventListener('touchmove', function(e) {
e.preventDefault();
const c = e.touches[0];
const r = h.getBoundingClientRect();
const x = ((c.clientX - r.left) / r.width) * 100;
const y = ((c.clientY - r.top) / r.height) * 100;
t.style.clipPath = `circle(30% at ${x}% ${y}%)`;
});
h.addEventListener('touchend', () => t.style.clipPath = 'circle(0% at 50% 50%)');
}
const f = document.getElementById('customPlanForm');
if (f) {
f.addEventListener('submit', async function(e) {
e.preventDefault();
const formData = {
company_name: this.querySelector('input[placeholder="Enter your company name"]').value,
industry: this.querySelector('input[placeholder="e.g., E-commerce, SaaS"]').value,
budget_range: this.querySelector('select').value,
project_timeline: this.querySelectorAll('select')[1].value,
services_required: this.querySelector('textarea[placeholder*="services"]').value,
project_goals: this.querySelector('textarea[placeholder*="goals"]').value,
contact_email: this.querySelector('input[type="email"]').value,
phone_number: this.querySelector('input[type="tel"]').value
};
try {
const response = await fetch(`${API_URL}/custom-plan`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(formData)
});
const result = await response.json();
if (result.success) {
alert(`✅ Thank you for your submission!\n\nYour custom plan request has been saved.\n\nRequest ID: #${result.request_id}\n\nOur team will review your requirements and contact you within 24 hours.`);
this.reset();
} else {
alert(`❌ Error: ${result.message}`);
}
} catch (error) {
console.error('Error:', error);
alert('❌ Could not connect to server. Please try again later.');
}
});
}
const c = document.getElementById('complaintForm');
if (c) {
c.addEventListener('submit', async function(e) {
e.preventDefault();
const formData = {
customer_name: this.querySelector('input[type="text"]').value,
email: this.querySelector('input[type="email"]').value,
order_id: this.querySelector('input[placeholder*="NX-"]').value,
issue_category: this.querySelector('select').value,
description: this.querySelector('textarea').value
};
try {
const response = await fetch(`${API_URL}/complaint`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(formData)
});
const result = await response.json();
if (result.success) {
alert(`✅ Your complaint has been saved successfully!\n\nTicket ID: #${result.ticket_id}\n\nWe take all feedback seriously and will respond within 24 hours.\n\nYou will receive an email confirmation shortly.`);
this.reset();
} else {
alert(`❌ Error: ${result.message}`);
}
} catch (error) {
console.error('Error:', error);
alert('❌ Could not connect to server. Please try again later.');
}
});
}
document.body.style.opacity = '0';
setTimeout(() => {
document.body.style.transition = 'opacity 0.5s ease';
document.body.style.opacity = '1';
}, 100);
});