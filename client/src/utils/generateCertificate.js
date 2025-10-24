import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export const generateCertificate = (userName, courseName) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
    });

    // Simple Certificate Design
    doc.rect(20, 20, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 40);
    doc.setFontSize(40);
    doc.text('Certificate of Completion', doc.internal.pageSize.getWidth() / 2, 100, { align: 'center' });

    doc.setFontSize(20);
    doc.text('This is to certify that', doc.internal.pageSize.getWidth() / 2, 150, { align: 'center' });

    doc.setFontSize(30).setFont(undefined, 'bold');
    doc.text(userName, doc.internal.pageSize.getWidth() / 2, 200, { align: 'center' });
    
    doc.setFontSize(20).setFont(undefined, 'normal');
    doc.text('has successfully completed the course', doc.internal.pageSize.getWidth() / 2, 250, { align: 'center' });
    
    doc.setFontSize(25).setFont(undefined, 'italic');
    doc.text(courseName, doc.internal.pageSize.getWidth() / 2, 300, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, doc.internal.pageSize.getHeight() - 50);
    doc.text('LearnSphere', doc.internal.pageSize.getWidth() - 50, doc.internal.pageSize.getHeight() - 50, { align: 'right' });

    // Trigger download
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, 'Certificate.pdf');
};