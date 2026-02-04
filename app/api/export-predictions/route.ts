import { NextResponse } from 'next/server';
import { getPredictionsWithMatches } from '@/lib/supabase/queries';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const predictionsData = await getPredictionsWithMatches(100);
    
    if (predictionsData.length === 0) {
      return NextResponse.json({ error: 'No predictions found' }, { status: 404 });
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Alle Mine Predictions', 14, 22);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Genereret: ${format(new Date(), 'dd. MMM yyyy, HH:mm', { locale: da })}`, 14, 30);
    
    let yPosition = 40;
    
    predictionsData.forEach((item, index) => {
      const { prediction, match } = item;
      
      // Check if we need a new page
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Match header
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`${match.homeTeam.name} vs ${match.awayTeam.name}`, 14, yPosition);
      yPosition += 6;
      
      // Match details
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${match.league} • ${format(match.date, 'EEE d. MMM, HH:mm', { locale: da })}`, 14, yPosition);
      yPosition += 5;
      
      // Predicted score
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text(`Forudsagt: ${prediction.predicted_home_score} - ${prediction.predicted_away_score}`, 14, yPosition);
      yPosition += 6;
      
      // Actual score if available
      if (prediction.actual_home_score !== null && prediction.actual_away_score !== null) {
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(`Faktisk: ${prediction.actual_home_score} - ${prediction.actual_away_score}`, 14, yPosition);
        yPosition += 5;
        
        // Result badge
        if (prediction.was_correct) {
          doc.setTextColor(34, 197, 94); // Green
          const resultText = prediction.result_type === 'exact_score' ? '✓ Eksakt Score!' : '✓ Korrekt Udfald';
          doc.text(resultText, 14, yPosition);
        } else {
          doc.setTextColor(239, 68, 68); // Red
          doc.text('✗ Forkert', 14, yPosition);
        }
        yPosition += 6;
      } else {
        yPosition += 3;
      }
      
      // Probabilities
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`${match.homeTeam.name} sejr: ${prediction.home_win_probability}%`, 14, yPosition);
      doc.text(`Uafgjort: ${prediction.draw_probability}%`, 80, yPosition);
      doc.text(`${match.awayTeam.name} sejr: ${prediction.away_win_probability}%`, 130, yPosition);
      yPosition += 5;
      
      // Confidence
      doc.text(`Sikkerhed: ${prediction.confidence}%`, 14, yPosition);
      yPosition += 5;
      
      // Add separator line
      if (index < predictionsData.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPosition, 196, yPosition);
        yPosition += 8;
      }
    });
    
    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="alle_predictions_${format(new Date(), 'yyyy-MM-dd_HHmm')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
