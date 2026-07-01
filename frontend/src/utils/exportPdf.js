import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportFindingsToPdf(findings, scanMeta = {}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  const SEVERITY_COLORS = {
    CRITICAL: { bg: [254, 242, 242], text: [220, 38, 38], bar: [239, 68, 68] },
    HIGH:     { bg: [255, 247, 237], text: [234, 88, 12], bar: [249, 115, 22] },
    MEDIUM:   { bg: [254, 252, 232], text: [202, 138, 4], bar: [234, 179, 8] },
    LOW:      { bg: [240, 253, 244], text: [22, 163, 74], bar: [34, 197, 94] },
  };

  // ── Header band ──
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 42, 'F');
  doc.setFillColor(14, 165, 233);
  doc.rect(pageWidth - 1.5, 0, 1.5, 42, 'F');

  // Logo badge — plain square, no icon
  doc.setFillColor(14, 165, 233);
  doc.roundedRect(14, 10, 8, 8, 1.5, 1.5, 'F');

  doc.setTextColor(241, 245, 249);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CLOUDSENTINEL AI', 26, 15.5);

  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text('Cloud Security Report', 14, 27);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const scanLine = `Scan ID: ${scanMeta.scan_id || 'N/A'}   |   ${
    scanMeta.timestamp ? new Date(scanMeta.timestamp).toLocaleString() : new Date().toLocaleString()
  }`;
  doc.text(scanLine, 14, 34);

  // ── Executive summary ──
  let y = 56;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('EXECUTIVE SUMMARY', 14, y);

  const counts = findings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 });

  const cardW = (pageWidth - 28 - 18) / 4;
  const cardY = y + 6;
  ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach((sev, i) => {
    const x = 14 + i * (cardW + 6);
    const c = SEVERITY_COLORS[sev];
    doc.setFillColor(...c.bg);
    doc.roundedRect(x, cardY, cardW, 22, 1.5, 1.5, 'F');
    doc.setFillColor(...c.bar);
    doc.rect(x, cardY, 1.2, 22, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...c.text);
    doc.text(sev, x + 5, cardY + 7);

    doc.setFontSize(16);
    doc.setTextColor(...c.text);
    doc.text(String(counts[sev]), x + 5, cardY + 16);
  });

  y = cardY + 30;
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  doc.setFont('helvetica', 'bold');
  const boldPart = `${findings.length} total findings`;
  doc.text(boldPart, 14, y);
  const boldWidth = doc.getTextWidth(boldPart);

  doc.setFont('helvetica', 'normal');
  const criticalNote = counts.CRITICAL > 0
    ? ` detected across your AWS environment. ${counts.CRITICAL} requires immediate action.`
    : ' detected across your AWS environment.';
  doc.text(criticalNote, 14 + boldWidth, y);

  // ── Findings table ──
  y += 10;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('DETAILED FINDINGS', 14, y);

  autoTable(doc, {
    startY: y + 5,
    head: [['Severity', 'Finding', 'Resource', 'Risk', 'Recommendation']],
    body: findings.map((f) => [f.severity, f.finding, f.resource, `${f.risk_score}/10`, f.recommendation || '']),
    styles: { fontSize: 8.5, cellPadding: { top: 5, bottom: 5, left: 6, right: 4 }, valign: 'middle' },
    headStyles: { fillColor: [15, 23, 42], textColor: [148, 163, 184], fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 38, font: 'courier', fontSize: 7.5, textColor: [71, 85, 105] },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 'auto', fontSize: 7.5, textColor: [71, 85, 105] },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        const c = SEVERITY_COLORS[data.cell.raw] || SEVERITY_COLORS.LOW;
        data.cell.styles.fillColor = c.bg;
        data.cell.styles.textColor = c.text;
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 7;
      }
      if (data.section === 'body' && data.column.index === 3) {
        const sev = data.row.raw[0];
        const c = SEVERITY_COLORS[sev] || SEVERITY_COLORS.LOW;
        data.cell.styles.textColor = c.text;
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 9;
      }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        const sev = data.row.raw[0];
        const c = SEVERITY_COLORS[sev] || SEVERITY_COLORS.LOW;
        doc.setFillColor(...c.bar);
        doc.rect(data.cell.x, data.cell.y, 1, data.cell.height, 'F');
      }
    },
  });

  // ── AI Recommendations ──
  const findingsWithAI = findings.filter(f => f.ai_suggestions?.length > 0);
  if (findingsWithAI.length > 0) {
    let aiY = doc.lastAutoTable.finalY + 14;

    // Section header
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('AI RECOMMENDATIONS', 14, aiY);

    // Violet accent line under the section header
    doc.setFillColor(139, 92, 246);
    doc.rect(14, aiY + 2, 38, 0.8, 'F');

    aiY += 10;

    findingsWithAI.forEach((finding) => {
      const recs = finding.ai_suggestions;

      // Check if we need a new page
      const estimatedHeight = 10 + recs.length * 12 + 8;
      if (aiY + estimatedHeight > doc.internal.pageSize.height - 24) {
        doc.addPage();
        aiY = 20;
      }

      // Finding title bar
      const sev = finding.severity;
      const c = SEVERITY_COLORS[sev] || SEVERITY_COLORS.LOW;
      doc.setFillColor(...c.bg);
      doc.roundedRect(14, aiY, pageWidth - 28, 10, 1.5, 1.5, 'F');
      doc.setFillColor(...c.bar);
      doc.rect(14, aiY, 1.2, 10, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...c.text);
      doc.text(sev, 20, aiY + 6.5);

      doc.setTextColor(30, 41, 59);
      doc.text(finding.finding, 46, aiY + 6.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const resourceLabel = `${finding.resource}`;
      doc.text(resourceLabel, pageWidth - 14 - doc.getTextWidth(resourceLabel), aiY + 6.5);

      aiY += 13;

      // Recommendation steps
      recs.forEach((rec, idx) => {
        // New page guard per step
        if (aiY + 14 > doc.internal.pageSize.height - 24) {
          doc.addPage();
          aiY = 20;
        }

        // Step number circle (drawn manually)
        doc.setFillColor(237, 233, 254);
        doc.circle(20, aiY + 3.5, 3.5, 'F');
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text(String(idx + 1), 20, aiY + 4.5, { align: 'center' });

        // Step text — wrap long lines
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const maxWidth = pageWidth - 40;
        const lines = doc.splitTextToSize(rec, maxWidth);
        doc.text(lines, 28, aiY + 4.5);
        aiY += lines.length * 5.5 + 5;
      });

      aiY += 5;
    });
  }

  // ── Footer ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Generated by CloudSentinel AI · Confidential', 14, pageHeight - 9);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 9);
  }

  doc.save(`cloudsentinel-report-${Date.now()}.pdf`);
}