// Function to save company information
function saveCompanyInfo(companyName, companyAddress, companyPhone) {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyPhone', companyPhone);
}

// Function to retrieve company information
function getCompanyInfo() {
    return {
        companyName: localStorage.getItem('companyName'),
        companyAddress: localStorage.getItem('companyAddress'),
        companyPhone: localStorage.getItem('companyPhone')
    };
}

// Add event listener to the save company info button
document.getElementById('saveCompanyInfo').addEventListener('click', function() {
    const companyName = document.getElementById('companyNameInput').value;
    const companyAddress = document.getElementById('companyAddressInput').value;
    const companyPhone = document.getElementById('companyPhoneInput').value;
    saveCompanyInfo(companyName, companyAddress, companyPhone);
    alert('Company information saved!');
});

// Function to update billable hours
function updateBillableHours() {
    const workHours = parseFloat(document.getElementById('workHours').value);
    const breakHours = parseFloat(document.getElementById('breakHours').value);
    let calculatedBillableHours = workHours - breakHours;

    if (isNaN(calculatedBillableHours)) {
        calculatedBillableHours = 0;
    }

    document.getElementById('billableHours').value = calculatedBillableHours.toFixed(2);
}

// Add event listeners to workHours and breakHours
document.getElementById('workHours').addEventListener('input', updateBillableHours);
document.getElementById('breakHours').addEventListener('input', updateBillableHours);

// Invoice Calculation
document.getElementById('invoiceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const clientName = document.getElementById('clientName').value;
    const invoiceDue = document.getElementById('invoiceDue').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const companyLogo = document.getElementById('companyLogo').files[0];
    const workHours = parseFloat(document.getElementById('workHours').value);
    const breakHours = parseFloat(document.getElementById('breakHours').value);
    let billableHours = parseFloat(document.getElementById('billableHours').value);

    // If billableHours is not entered, calculate it.
    if (isNaN(billableHours)) {
        billableHours = workHours - breakHours;
    }

    const totalCost = billableHours * hourlyRate;

    // Display invoice
    let invoiceHTML = `
        <p><strong>Client Name:</strong> ${clientName}</p>
        <p><strong>Invoice Due:</strong> ${invoiceDue}</p>
        <p><strong>Job Description:</strong> ${jobDescription}</p>
        <p><strong>Work Hours:</strong> ${workHours.toFixed(2)}</p>
        <p><strong>Break Hours:</strong> ${breakHours.toFixed(2)}</p>
        <p><strong>Billable Hours:</strong> ${billableHours.toFixed(2)}</p>
        <p><strong>Hourly Rate:</strong> $${hourlyRate.toFixed(2)}</p>
        <p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>
    `;

    // Display logo if uploaded
    if (companyLogo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            invoiceHTML += `<img src="${e.target.result}" alt="Company Logo" style="max-width: 200px;">`;
            document.getElementById('invoiceOutput').innerHTML = invoiceHTML;
            document.getElementById('downloadInvoice').style.display = 'block';
        };
        reader.readAsDataURL(companyLogo);
    } else {
        document.getElementById('invoiceOutput').innerHTML = invoiceHTML;
        document.getElementById('downloadInvoice').style.display = 'block';
    }
});

document.getElementById('downloadInvoice').addEventListener('click', function () {
    const clientName = document.getElementById('clientName').value;
    const invoiceDue = document.getElementById('invoiceDue').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const companyLogo = document.getElementById('companyLogo').files[0];
    let billableHours = parseFloat(document.getElementById('billableHours').value);
    let totalCost = billableHours * hourlyRate; // Define totalCost here.

    console.log("Download button clicked");
    console.log("Client Name:", clientName);
    console.log("Billable Hours:", billableHours);

    generatePDF(clientName, invoiceDue, jobDescription, billableHours, hourlyRate, totalCost, companyLogo);
});

function generatePDF(clientName, invoiceDue, jobDescription, billableHours, hourlyRate, totalCost, companyLogo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    console.log("generatePDF called");

    // Company Information
    const companyInfo = getCompanyInfo();
    const companyName = companyInfo.companyName || "Your Company Name";
    const companyAddress = companyInfo.companyAddress || "123 Main St, Anytown, USA";
    const companyPhone = companyInfo.companyPhone || "123-456-7890";

    // Fonts
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(companyName, 20, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(companyAddress, 20, 45);
    doc.text(`Phone: ${companyPhone}`, 20, 55);

    // Invoice Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Invoice", 20, 80);

    // Invoice Details
    const startY = 90;
    const leftColumnX = 20;
    const rightColumnX = 100;
    const lineHeight = 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let currentY = startY;

    function addDetail(label, value) {
        doc.setFont("helvetica", "bold");
        doc.text(label, leftColumnX, currentY + lineHeight);
        doc.setFont("helvetica", "normal");
        doc.text(value, rightColumnX, currentY + lineHeight);
        currentY += lineHeight;
    }

    addDetail("Client Name:", clientName);
    addDetail("Invoice Due:", invoiceDue);
    addDetail("Job Description:", jobDescription);
    addDetail("Work Hours:", parseFloat(document.getElementById('workHours').value).toFixed(2));
    addDetail("Break Hours:", parseFloat(document.getElementById('breakHours').value).toFixed(2));
    addDetail("Billable Hours:", billableHours.toFixed(2));
    addDetail("Hourly Rate:", `$${hourlyRate.toFixed(2)}`);
    addDetail("Total Cost:", `$${totalCost.toFixed(2)}`);

    // Add Logo
    if (companyLogo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            doc.addImage(imgData, 'JPEG', 150, 20, 50, 50);
            doc.save('invoice.pdf');
        };
        reader.readAsDataURL(companyLogo);
    } else {
        doc.save('invoice.pdf');
    }
}