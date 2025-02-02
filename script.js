// Create a new PDF document
const doc = new jspdf.jsPDF();

// Add text to the PDF
doc.setFontSize(18);
doc.text("Invoice", 10, 20);
doc.setFontSize(12);
doc.text("Client Name: John Doe", 10, 30);
doc.text("Total Cost: $100", 10, 40);

// Save the PDF
doc.save('invoice.pdf');