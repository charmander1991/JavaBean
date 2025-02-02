let workStartTime, workEndTime, workTimerInterval;
let breakStartTime, breakEndTime, breakTimerInterval;
let totalWorkTime = 0; // Total work time in milliseconds
let totalBreakTime = 0; // Total break time in milliseconds

// Work Timer Functions
document.getElementById('startTimer').addEventListener('click', function () {
    workStartTime = new Date();
    workTimerInterval = setInterval(updateWorkTimer, 1000);
    document.getElementById('startTimer').disabled = true;
    document.getElementById('pauseTimer').disabled = false;
    document.getElementById('stopTimer').disabled = false;
});

document.getElementById('pauseTimer').addEventListener('click', function () {
    clearInterval(workTimerInterval);
    totalWorkTime += new Date() - workStartTime;
    document.getElementById('pauseTimer').style.display = 'none';
    document.getElementById('resumeTimer').style.display = 'inline';
});

document.getElementById('resumeTimer').addEventListener('click', function () {
    workStartTime = new Date();
    workTimerInterval = setInterval(updateWorkTimer, 1000);
    document.getElementById('pauseTimer').style.display = 'inline';
    document.getElementById('resumeTimer').style.display = 'none';
});

document.getElementById('stopTimer').addEventListener('click', function () {
    clearInterval(workTimerInterval);
    workEndTime = new Date();
    totalWorkTime += new Date() - workStartTime;
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = true;
    document.getElementById('stopTimer').disabled = true;
    document.getElementById('pauseTimer').style.display = 'inline';
    document.getElementById('resumeTimer').style.display = 'none';
});

function updateWorkTimer() {
    const elapsedTime = totalWorkTime + (new Date() - workStartTime);
    document.getElementById('workTimer').textContent = formatTime(elapsedTime);
}

// Break Timer Functions
document.getElementById('startBreak').addEventListener('click', function () {
    breakStartTime = new Date();
    breakTimerInterval = setInterval(updateBreakTimer, 1000);
    document.getElementById('startBreak').disabled = true;
    document.getElementById('endBreak').disabled = false;
});

document.getElementById('endBreak').addEventListener('click', function () {
    clearInterval(breakTimerInterval);
    breakEndTime = new Date();
    totalBreakTime += new Date() - breakStartTime;
    document.getElementById('startBreak').disabled = false;
    document.getElementById('endBreak').disabled = true;
});

function updateBreakTimer() {
    const elapsedTime = totalBreakTime + (new Date() - breakStartTime);
    document.getElementById('breakTimer').textContent = formatTime(elapsedTime);
}

// Helper Function to Format Time
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Invoice Calculation
document.getElementById('invoiceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const clientName = document.getElementById('clientName').value;
    const invoiceDue = document.getElementById('invoiceDue').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const companyLogo = document.getElementById('companyLogo').files[0];

    // Calculate total work time (excluding breaks)
    const totalWorkTimeInHours = (totalWorkTime - totalBreakTime) / (1000 * 60 * 60);
    const totalCost = totalWorkTimeInHours * hourlyRate;

    // Display invoice
    let invoiceHTML = `
        <p><strong>Client Name:</strong> ${clientName}</p>
        <p><strong>Invoice Due:</strong> ${invoiceDue}</p>
        <p><strong>Job Description:</strong> ${jobDescription}</p>
        <p><strong>Total Work Time:</strong> ${formatTime(totalWorkTime)}</p>
        <p><strong>Total Break Time:</strong> ${formatTime(totalBreakTime)}</p>
        <p><strong>Billable Hours:</strong> ${totalWorkTimeInHours.toFixed(2)}</p>
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

    // Add event listener for the download button
    document.getElementById('downloadInvoice').addEventListener('click', function () {
        generatePDF(clientName, invoiceDue, jobDescription, totalWorkTimeInHours, hourlyRate, totalCost, companyLogo);
    });
});

function generatePDF(clientName, invoiceDue, jobDescription, totalWorkTimeInHours, hourlyRate, totalCost, companyLogo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add invoice details to the PDF
    doc.setFontSize(18);
    doc.text("Invoice", 10, 20);
    doc.setFontSize(12);
    doc.text(`Client Name: ${clientName}`, 10, 30);
    doc.text(`Invoice Due: ${invoiceDue}`, 10, 40);
    doc.text(`Job Description: ${jobDescription}`, 10, 50);
    doc.text(`Total Work Time: ${formatTime(totalWorkTime)}`, 10, 60);
    doc.text(`Total Break Time: ${formatTime(totalBreakTime)}`, 10, 70);
    doc.text(`Billable Hours: ${totalWorkTimeInHours.toFixed(2)}`, 10, 80);
    doc.text(`Hourly Rate: $${hourlyRate.toFixed(2)}`, 10, 90);
    doc.text(`Total Cost: $${totalCost.toFixed(2)}`, 10, 100);

    // Add logo if available
    if (companyLogo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            doc.addImage(imgData, 'JPEG', 10, 110, 50, 50);
            doc.save('invoice.pdf');
        };
        reader.readAsDataURL(companyLogo);
    } else {
        doc.save('invoice.pdf');
    }
}