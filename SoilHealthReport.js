import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SoilHealthReport = ({ soilData, weather, recommendations }) => {
  const [generating, setGenerating] = useState(false);

  // Calculate Soil Health Score (0-100)
  const calculateSoilHealth = () => {
    let score = 100;
    
    // Nitrogen scoring (Ideal: 280-300 kg/ha)
    const N = parseFloat(soilData.N) || 0;
    if (N < 200) score -= 15;
    else if (N > 400) score -= 10;
    else if (N >= 280 && N <= 300) score += 0; // Ideal
    else score -= 5;

    // Phosphorus scoring (Ideal: 30-50 kg/ha)
    const P = parseFloat(soilData.P) || 0;
    if (P < 20) score -= 15;
    else if (P > 80) score -= 10;
    else if (P >= 30 && P <= 50) score += 0; // Ideal
    else score -= 5;

    // Potassium scoring (Ideal: 280-320 kg/ha)
    const K = parseFloat(soilData.K) || 0;
    if (K < 200) score -= 15;
    else if (K > 400) score -= 10;
    else if (K >= 280 && K <= 320) score += 0; // Ideal
    else score -= 5;

    // pH scoring (Ideal: 6.5-7.5)
    const ph = parseFloat(soilData.ph) || 0;
    if (ph < 5.5) score -= 20;
    else if (ph > 8.5) score -= 15;
    else if (ph >= 6.5 && ph <= 7.5) score += 0; // Ideal
    else score -= 8;

    // Temperature (Ideal: 20-30°C)
    const temp = parseFloat(soilData.temp) || 0;
    if (temp < 10 || temp > 40) score -= 10;

    // Humidity (Ideal: 50-80%)
    const hum = parseFloat(soilData.hum) || 0;
    if (hum < 30 || hum > 90) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  // Get health status and color
  const getHealthStatus = (score) => {
    if (score >= 80) return { status: 'Excellent', color: '#4caf50', emoji: '🌟' };
    if (score >= 60) return { status: 'Good', color: '#8bc34a', emoji: '✅' };
    if (score >= 40) return { status: 'Fair', color: '#ff9800', emoji: '⚠️' };
    return { status: 'Poor', color: '#f44336', emoji: '❌' };
  };

  // Generate deficiency alerts
  const getDeficiencies = () => {
    const issues = [];
    const N = parseFloat(soilData.N) || 0;
    const P = parseFloat(soilData.P) || 0;
    const K = parseFloat(soilData.K) || 0;
    const ph = parseFloat(soilData.ph) || 0;

    if (N < 200) issues.push({ nutrient: 'Nitrogen (N)', status: 'Low', remedy: 'Apply Urea 50-100 kg/acre', severity: 'High' });
    else if (N > 400) issues.push({ nutrient: 'Nitrogen (N)', status: 'High', remedy: 'Reduce Urea application, risk of lodging', severity: 'Medium' });

    if (P < 20) issues.push({ nutrient: 'Phosphorus (P)', status: 'Low', remedy: 'Apply DAP 80-100 kg/acre', severity: 'High' });
    else if (P > 80) issues.push({ nutrient: 'Phosphorus (P)', status: 'High', remedy: 'Skip Phosphorus fertilizers this season', severity: 'Low' });

    if (K < 200) issues.push({ nutrient: 'Potassium (K)', status: 'Low', remedy: 'Apply MOP 40-60 kg/acre', severity: 'High' });
    else if (K > 400) issues.push({ nutrient: 'Potassium (K)', status: 'High', remedy: 'Reduce MOP application', severity: 'Low' });

    if (ph < 5.5) issues.push({ nutrient: 'pH Level', status: 'Acidic', remedy: 'Apply Lime 200-400 kg/acre', severity: 'High' });
    else if (ph > 8.5) issues.push({ nutrient: 'pH Level', status: 'Alkaline', remedy: 'Apply Gypsum 200-300 kg/acre', severity: 'High' });

    if (issues.length === 0) issues.push({ nutrient: 'Overall', status: 'Balanced', remedy: 'Maintain current practices', severity: 'Good' });

    return issues;
  };

// Generate PDF Report
const generatePDF = () => {
  setGenerating(true);
  
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header with green background
    doc.setFillColor(45, 80, 22);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SOIL HEALTH REPORT', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Smart Crop Recommendation System', pageWidth / 2, 30, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 60, 25);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Soil Health Score Section
    const healthScore = calculateSoilHealth();
    const healthInfo = getHealthStatus(healthScore);
    
    let yPos = 55;
    
    doc.setFillColor(232, 245, 233);
    doc.rect(15, yPos, pageWidth - 30, 35, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 80, 22);
    doc.text('SOIL HEALTH SCORE', 20, yPos + 10);
    
    doc.setFontSize(36);
    doc.text(`${healthScore}`, pageWidth - 60, yPos + 25);
    
    doc.setFontSize(14);
    doc.text(`${healthInfo.status}`, pageWidth - 60, yPos + 32);
    
    // Soil Parameters Table
    yPos += 45;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Soil Parameters', 20, yPos);
    
    yPos += 5;
    autoTable(doc, {
      startY: yPos,
      head: [['Parameter', 'Your Value', 'Ideal Range', 'Status']],
      body: [
        ['Nitrogen (N)', `${soilData.N || 0} kg/ha`, '280-300 kg/ha', parseFloat(soilData.N) >= 280 && parseFloat(soilData.N) <= 300 ? 'Good' : 'Adjust'],
        ['Phosphorus (P)', `${soilData.P || 0} kg/ha`, '30-50 kg/ha', parseFloat(soilData.P) >= 30 && parseFloat(soilData.P) <= 50 ? 'Good' : 'Adjust'],
        ['Potassium (K)', `${soilData.K || 0} kg/ha`, '280-320 kg/ha', parseFloat(soilData.K) >= 280 && parseFloat(soilData.K) <= 320 ? 'Good' : 'Adjust'],
        ['pH Level', `${soilData.ph || 0}`, '6.5-7.5', parseFloat(soilData.ph) >= 6.5 && parseFloat(soilData.ph) <= 7.5 ? 'Good' : 'Adjust'],
        ['Temperature', `${soilData.temp || 0} C`, '20-30 C', '-'],
        ['Humidity', `${soilData.hum || 0}%`, '50-80%', '-'],
        ['Rainfall', `${soilData.rain || 0}mm`, 'Varies by crop', '-']
      ],
      headStyles: { fillColor: [74, 124, 44], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 251, 248] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 10 }
    });
    
    // Deficiencies and Recommendations
    yPos = doc.lastAutoTable.finalY + 15;
    
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Deficiency Alerts & Remedies', 20, yPos);
    
    yPos += 5;
    const deficiencies = getDeficiencies();
    
    autoTable(doc, {
      startY: yPos,
      head: [['Issue', 'Status', 'Recommended Action', 'Priority']],
      body: deficiencies.map(d => [d.nutrient, d.status, d.remedy, d.severity]),
      headStyles: { fillColor: [245, 124, 0], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255, 243, 224] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 }
    });
    
    // Recommended Crops
    yPos = doc.lastAutoTable.finalY + 15;
    
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Recommended Crops', 20, yPos);
    
    yPos += 5;
    if (recommendations && recommendations.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Rank', 'Crop', 'Suitability', 'Expected Profit']],
        body: recommendations.slice(0, 5).map((crop, idx) => {
          // Clean the profit string
          let profitValue = crop.profit || 'N/A';
          profitValue = profitValue.replace(/₹/g, 'Rs. ');
          profitValue = profitValue.replace(/&[^;]+;/g, '');
          profitValue = profitValue.replace(/,/g, ',');
          
          return [
            `#${idx + 1}`,
            crop.name || 'Unknown',
            `${crop.suitability}%`,
            profitValue
          ];
        }),
        headStyles: { fillColor: [56, 142, 60], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [232, 245, 233] },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 10 }
      });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This report is generated by AI analysis and should be verified with local agricultural experts.', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('Smart Crop Recommendation System | 2025', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save PDF
    doc.save(`Soil_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Error generating PDF: ' + error.message);
  } finally {
    setGenerating(false);
  }
};
  const healthScore = calculateSoilHealth();
  const healthInfo = getHealthStatus(healthScore);
  const deficiencies = getDeficiencies();

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '28px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📋</span> Soil Health Report
        </h2>
        <button
          onClick={generatePDF}
          disabled={generating}
          style={{
            background: 'linear-gradient(135deg, #4a7c2c, #6b9b47)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: generating ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(74, 124, 44, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: generating ? 0.7 : 1
          }}
          onMouseOver={(e) => !generating && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => !generating && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ fontSize: '20px' }}>{generating ? '⏳' : '📥'}</span>
          {generating ? 'Generating...' : 'Download PDF Report'}
        </button>
      </div>

      {/* Soil Health Score Display */}
      <div style={{ 
        background: `linear-gradient(135deg, ${healthInfo.color}15, ${healthInfo.color}25)`,
        border: `3px solid ${healthInfo.color}`,
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', color: '#757575', marginBottom: '10px', fontWeight: '600' }}>Overall Soil Health Score</div>
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: healthInfo.color, marginBottom: '10px' }}>{healthScore}</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: healthInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>{healthInfo.emoji}</span>
          {healthInfo.status}
        </div>
        <div style={{ fontSize: '14px', color: '#757575', marginTop: '15px' }}>
          Based on NPK levels, pH balance, and environmental conditions
        </div>
      </div>

      {/* Deficiency Alerts */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2d5016', fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚠️</span> Deficiency Alerts & Remedies
        </h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {deficiencies.map((def, idx) => (
            <div key={idx} style={{
              background: def.severity === 'Good' ? '#e8f5e9' : def.severity === 'High' ? '#ffebee' : '#fff3e0',
              border: `2px solid ${def.severity === 'Good' ? '#4caf50' : def.severity === 'High' ? '#f44336' : '#ff9800'}`,
              borderRadius: '12px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 3fr 1fr',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#757575', marginBottom: '4px' }}>Parameter</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d5016' }}>{def.nutrient}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#757575', marginBottom: '4px' }}>Recommended Action</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#424242' }}>{def.remedy}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: def.severity === 'Good' ? '#4caf50' : def.severity === 'High' ? '#f44336' : '#ff9800',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {def.severity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Tips */}
      <div style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2c)', borderRadius: '15px', padding: '25px', color: 'white' }}>
        <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>💡</span> Soil Improvement Tips
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '2', fontSize: '15px' }}>
          <li>Apply organic manure (FYM) 5-10 tons/acre annually to improve soil structure</li>
          <li>Practice crop rotation with legumes to naturally increase nitrogen</li>
          <li>Use green manuring (Dhaincha, Sunhemp) before main crop sowing</li>
          <li>Conduct soil testing every 2-3 years for accurate nutrient management</li>
          <li>Implement mulching to reduce moisture loss and improve organic matter</li>
          <li>Avoid over-fertilization which can lead to nutrient imbalance and toxicity</li>
        </ul>
      </div>
    </div>
  );
};

export default SoilHealthReport;