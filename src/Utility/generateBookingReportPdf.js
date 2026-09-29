import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// "2026-10-01" -> "01/10/2026". Pure string handling (no Date object), so
// there is no timezone shift on a calendar date.
export const isoToDMY = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(iso || "");
};

const dash = (value) =>
  value === null || value === undefined || value === "" ? "-" : String(value);

// Column order and widths (mm). Widths add up to exactly the printable
// width of an A4 landscape page with 8 mm side margins (297 - 16 = 281).
const COLUMNS = [
  { header: "First Name", width: 19, get: (r) => r.firstName },
  { header: "Last Name", width: 19, get: (r) => r.lastName },
  { header: "Institute ID", width: 19, get: (r) => r.instituteId },
  { header: "Email", width: 38, get: (r) => r.email },
  { header: "Phone Number", width: 20, get: (r) => r.mobileNumber },
  { header: "Professor First Name", width: 20, get: (r) => r.professorFirstName },
  { header: "Professor Last Name", width: 20, get: (r) => r.professorLastName },
  { header: "Professor Email", width: 38, get: (r) => r.professorEmail },
  { header: "Equipment Name", width: 28, get: (r) => r.equipmentName },
  { header: "Operator Name", width: 23, get: (r) => r.operatorName },
  { header: "Booking Date", width: 19, get: (r) => isoToDMY(r.bookedDate) },
  { header: "Booking ID", width: 18, get: (r) => r.displayBookingId },
];

const MARGIN = { top: 30, left: 8, right: 8, bottom: 14 };

/**
 * Builds the Booking Report PDF (landscape A4) and returns the jsPDF doc.
 * The caller decides what to do with it (e.g. doc.save(filename)).
 *
 * @param {Object} args
 * @param {Array}  args.records   rows from GET /report/getBookingReport
 * @param {string} args.fromDate  display string DD/MM/YYYY
 * @param {string} args.toDate    display string DD/MM/YYYY
 */
export function buildBookingReportPdf({ records, fromDate, toDate }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title block, drawn on every page so a single printed sheet is self-explanatory.
  const drawHeader = () => {
    doc.setTextColor(20, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Department of Chemical Engineering, IIT Roorkee", MARGIN.left, 14);
    doc.text("Booking Report", pageWidth - MARGIN.right, 14, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`From: ${fromDate} - To: ${toDate}`, MARGIN.left, 21);
    doc.text(`Total records: ${records.length}`, pageWidth - MARGIN.right, 21, {
      align: "right",
    });

    doc.setDrawColor(85, 96, 143);
    doc.setLineWidth(0.5);
    doc.line(MARGIN.left, 24.5, pageWidth - MARGIN.right, 24.5);
  };

  const columnStyles = {};
  COLUMNS.forEach((c, i) => {
    columnStyles[i] = { cellWidth: c.width };
  });

  autoTable(doc, {
    head: [COLUMNS.map((c) => c.header)],
    body: records.map((r) => COLUMNS.map((c) => dash(c.get(r)))),
    startY: MARGIN.top,
    margin: MARGIN,
    theme: "grid",
    tableWidth: 281,
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 1.6,
      lineColor: [120, 120, 120],
      lineWidth: 0.15,
      textColor: [30, 30, 30],
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: { fillColor: [244, 246, 250] },
    columnStyles,
    showHead: "everyPage",
    didDrawPage: drawHeader,
  });

  // Footer with "Page X of Y" once the final page count is known.
  const pageCount = doc.internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 6, {
      align: "center",
    });
  }

  return doc;
}
