import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Match, Prediction } from '@/lib/types';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

export interface PredictionWithMatch {
  match: Match;
  prediction: Prediction;
}

export function exportPredictionsToPDF(predictions: PredictionWithMatch[], title: string = 'Fodbold Predictions') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  // Add background color for header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Add title with text wrapping
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, margin, 15);
  
  // Add generation date
  doc.setFontSize(9);
  doc.setTextColor(230, 230, 230);
  doc.setFont('helvetica', 'normal');
  doc.text(`Genereret: ${format(new Date(), 'dd. MMM yyyy, HH:mm', { locale: da })}`, margin, 28);
  
  let yPosition = 45;
  
  predictions.forEach((item, index) => {
    const { match, prediction } = item;
    
    // Check if we need a new page for the entire match (needs ~100mm)
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add card background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPosition - 5, contentWidth, 0, 3, 3, 'F');
    
    // Match header with text wrapping
    doc.setFontSize(15);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    const matchTitle = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
    const matchTitleLines = doc.splitTextToSize(matchTitle, contentWidth - 10);
    doc.text(matchTitleLines, margin + 5, yPosition + 2);
    yPosition += 7 * matchTitleLines.length;
    
    // Match details
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    const matchDetails = `${match.league} • ${format(match.date, 'EEE d. MMM, HH:mm', { locale: da })}`;
    const detailLines = doc.splitTextToSize(matchDetails, contentWidth - 10);
    doc.text(detailLines, margin + 5, yPosition);
    yPosition += 6;
    
    // Predicted score with background
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(margin + 5, yPosition - 4, 50, 10, 2, 2, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${prediction.predictedScore.home} - ${prediction.predictedScore.away}`, margin + 15, yPosition + 3);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Forudsagt', margin + 60, yPosition + 3);
    yPosition += 12;
    
    // Probabilities table
    autoTable(doc, {
      startY: yPosition,
      head: [['Resultat', 'Sandsynlighed']],
      body: [
        [`${match.homeTeam.name} sejr`, `${prediction.homeWinProbability}%`],
        ['Uafgjort', `${prediction.drawProbability}%`],
        [`${match.awayTeam.name} sejr`, `${prediction.awayWinProbability}%`],
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      },
      margin: { left: margin + 5 },
      tableWidth: contentWidth - 10,
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 8;
    
    // Key factors
    if (prediction.factors.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text('Nøglefaktorer:', margin + 5, yPosition);
      yPosition += 6;
      
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      prediction.factors.slice(0, 3).forEach((factor) => {
        const icon = factor.impact === 'positive' ? '✓' : factor.impact === 'negative' ? '✗' : '•';
        const iconColor = factor.impact === 'positive' ? [34, 197, 94] : factor.impact === 'negative' ? [239, 68, 68] : [148, 163, 184];
        
        doc.setTextColor(iconColor[0], iconColor[1], iconColor[2]);
        doc.text(icon, margin + 8, yPosition);
        
        doc.setTextColor(71, 85, 105);
        const factorText = factor.description;
        const factorLines = doc.splitTextToSize(factorText, contentWidth - 20);
        doc.text(factorLines, margin + 13, yPosition);
        yPosition += 5 * factorLines.length;
      });
      yPosition += 3;
    }
    
    // Add separator line
    if (index < predictions.length - 1) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);
      yPosition += 12;
    } else {
      yPosition += 5;
    }
  });
  
  // Save the PDF
  const fileName = `predictions_${format(new Date(), 'yyyy-MM-dd_HHmm')}.pdf`;
  doc.save(fileName);
}

export function exportSinglePredictionToPDF(match: Match, prediction: Prediction) {
  exportPredictionsToPDF([{ match, prediction }], `Prediction: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
}
