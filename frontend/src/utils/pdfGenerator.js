// PDF Generation utility for participant lists

// --- Helper to format date ---
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        return "Invalid Date";
    }
};

// --- Main function to generate the PDF's HTML content ---
export const generatePDFContent = (event, participants, organizationName) => {
    const currentDate = formatDate(new Date());

    // A subtle, tech-themed SVG watermark, base64 encoded to be self-contained
    const watermarkSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwIEwzMCAtMTAgTTAgNDAgTDQwIDAiIHN0cm9rZT0iI2U2ZThlYSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Participant List - ${event.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
        <style>
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
            body {
                font-family: 'Roboto', sans-serif;
                color: #475569; /* slate-600 */
                background-color: #f1f5f9; /* slate-100 */
                margin: 0;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .page-container {
                position: relative;
                min-height: 100vh;
                background-color: #ffffff;
            }
            .watermark {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('${watermarkSvg}');
                opacity: 0.5;
                z-index: 1;
            }
            .content-wrapper {
                position: relative;
                z-index: 2;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .header {
                padding: 40px;
                margin-bottom: 30px;
                background: linear-gradient(135deg, #0284c7, #0369a1); /* primary-600 to primary-700 */
                color: #ffffff;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 10px 20px rgba(2, 132, 199, 0.2);
            }
            .header h1 {
                font-family: 'Poppins', sans-serif;
                font-size: 36px;
                font-weight: 700;
                margin: 0 0 10px 0;
                line-height: 1.2;
            }
            .header .organizer {
                font-size: 18px;
                font-weight: 500;
                opacity: 0.9;
                margin: 0;
            }
            .event-meta {
                display: flex;
                justify-content: space-between;
                padding: 15px 25px;
                background-color: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                color: #334155;
                margin-bottom: 30px;
            }
            .event-meta strong {
                font-weight: 600;
                color: #1e293b;
            }
            .table-container {
                background-color: #ffffff;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                overflow: hidden; /* Ensures the border-radius is respected */
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            th, td {
                padding: 14px 18px;
                text-align: left;
                border-bottom: 1px solid #e2e8f0;
            }
            thead th {
                font-family: 'Poppins', sans-serif;
                background-color: #f8fafc; /* slate-50 */
                font-weight: 600;
                font-size: 12px;
                color: #64748b; /* slate-500 */
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            tbody tr:last-child td {
                border-bottom: none;
            }
            tbody td .name {
                font-weight: 500;
                color: #1e293b;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                font-size: 12px;
                color: #94a3b8;
            }
        </style>
    </head>
    <body>
        <div class="page-container">
            <div class="watermark"></div>
            <div class="content-wrapper">
                <header class="header">
                    <h1>${event.title}</h1>
                    <p class="organizer">Organized by: ${organizationName}</p>
                </header>

                <div class="event-meta">
                    <div>Date: <strong>${formatDate(event.eventDate)}</strong></div>
                    <div>Location: <strong>${event.location}</strong></div>
                    <div>Total Participants: <strong>${participants.length}</strong></div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%;">#</th>
                                <th style="width: 30%;">Name</th>
                                <th style="width: 35%;">Email</th>
                                <th style="width: 30%;">Location/University</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.map((p, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td><div class="name">${p.name || 'N/A'}</div></td>
                                    <td>${p.email || 'N/A'}</td>
                                    <td>${p.location || 'N/A'}</td>
                                </tr>
                            `).join('')}
                            ${participants.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 40px; color: #64748b;">No participants have registered yet.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>

                <footer class="footer">
                    <p>Generated by EventFesta on ${currentDate}</p>
                </footer>
            </div>
        </div>
    </body>
    </html>
  `;
};

// --- Function to trigger the download/print dialog ---
export const downloadParticipantsPDF = (event, participants, organizationName) => {
    if (!event || !participants) {
        console.error('Event or participant data is missing.');
        alert('No data available to generate PDF.');
        return;
    }

    const htmlContent = generatePDFContent(event, participants, organizationName);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      // Use 'onafterprint' for better reliability in closing the window
      printWindow.onafterprint = () => printWindow.close();
      // Trigger print
      printWindow.print();
    } else {
      alert("Please allow pop-ups for this site to print the participant list.");
    }
};