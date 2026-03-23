import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Function to generate PDF for student
export const generateStudentPDF = (student, exams) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("University of Soultan Moulay Slimane", 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text("Higher School of Technology - Fquih Ben Salah", 105, 25, { align: 'center' });
  doc.text("Student Exam Schedule", 105, 35, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Student information
  doc.text(`Student Name: ${student.name} ${student.prenom}`, 14, 50);
  doc.text(`Student ID: ${student.numero_etudiant || 'N/A'}`, 14, 57);
  doc.text(`Department: ${student.departement === 'GI' ? 'Génie Informatique' : 'Informatique Décisionnelle'}`, 14, 64);
  doc.text(`Level: ${student.niveau || 'N/A'}`, 14, 71);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 78);
  
  // Filter exams for this student
  const studentExams = exams.filter(exam => 
    exam.etudiants && exam.etudiants.some(e => e === student._id || e?._id === student._id)
  );
  
  if (studentExams.length === 0) {
    doc.text("No exams scheduled for you.", 14, 90);
    doc.text("Please contact the administration if you believe this is an error.", 14, 97);
  } else {
    // Prepare table data
    const tableColumn = ["Module", "Code", "Date", "Time", "Room", "Supervisor"];
    const tableRows = studentExams.map(exam => [
      exam.module,
      exam.code_module,
      new Date(exam.date).toLocaleDateString(),
      `${exam.heure_debut} - ${exam.heure_fin}`,
      exam.salle?.nom || 'N/A',
      `${exam.surveillant?.name} ${exam.surveillant?.prenom}`
    ]);
    
    // Add table using autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 85,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 }
    });
    
    // Add footer
    const finalY = doc.lastAutoTable?.finalY || 200;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This is an official exam schedule. Please bring your student ID to the exam.", 105, finalY + 10, { align: 'center' });
  }
  
  // Save PDF
  doc.save(`${student.name}_${student.prenom}_Exam_Schedule.pdf`);
};

// Function to generate PDF for professor
export const generateProfessorPDF = (professor, exams) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("University of Soultan Moulay Slimane", 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text("Higher School of Technology - Fquih Ben Salah", 105, 25, { align: 'center' });
  doc.text("Supervisor Exam Schedule", 105, 35, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Professor information
  doc.text(`Professor: ${professor.name} ${professor.prenom}`, 14, 50);
  doc.text(`Specialization: ${professor.specialization || 'N/A'}`, 14, 57);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 64);
  
  // Filter exams for this professor
  const professorExams = exams.filter(exam => 
    exam.surveillant?._id === professor._id || exam.surveillant === professor._id
  );
  
  if (professorExams.length === 0) {
    doc.text("No exams assigned to you.", 14, 75);
  } else {
    const tableColumn = ["Module", "Code", "Date", "Time", "Room", "Students"];
    const tableRows = professorExams.map(exam => [
      exam.module,
      exam.code_module,
      new Date(exam.date).toLocaleDateString(),
      `${exam.heure_debut} - ${exam.heure_fin}`,
      exam.salle?.nom || 'N/A',
      exam.nombre_etudiants || 0
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 }
    });
    
    const totalExams = professorExams.length;
    const totalStudents = professorExams.reduce((sum, exam) => sum + (exam.nombre_etudiants || 0), 0);
    const finalY = doc.lastAutoTable?.finalY || 200;
    
    doc.setFontSize(10);
    doc.text(`Total Exams: ${totalExams}`, 14, finalY + 10);
    doc.text(`Total Students to Supervise: ${totalStudents}`, 14, finalY + 17);
    doc.text(`Please arrive 15 minutes before exam start time.`, 14, finalY + 27);
  }
  
  doc.save(`${professor.name}_${professor.prenom}_Supervisor_Schedule.pdf`);
};

// Function to generate PDF for admin (all exams)
export const generateAdminPDF = (exams) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("University of Soultan Moulay Slimane", 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text("Higher School of Technology - Fquih Ben Salah", 105, 25, { align: 'center' });
  doc.text("Complete Exam Schedule - Administration", 105, 35, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 50);
  doc.text(`Total Exams: ${exams.length}`, 14, 57);
  
  // Group exams
  const giExams = exams.filter(e => e.code_module?.startsWith('GI'));
  const idsExams = exams.filter(e => e.code_module?.startsWith('IDS'));
  const commonExams = exams.filter(e => e.code_module?.startsWith('COM'));
  
  let currentPage = 1;
  let startY = 70;
  
  // Function to add table with page handling
  const addTable = (title, data, startYPosition) => {
    if (data.length === 0) return startYPosition;
    
    if (startYPosition > 250) {
      doc.addPage();
      currentPage++;
      startYPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text(title, 14, startYPosition);
    startYPosition += 5;
    doc.setTextColor(0, 0, 0);
    
    const tableRows = data.map(exam => [
      exam.module,
      exam.code_module,
      new Date(exam.date).toLocaleDateString(),
      `${exam.heure_debut} - ${exam.heure_fin}`,
      exam.salle?.nom || 'N/A',
      `${exam.surveillant?.name} ${exam.surveillant?.prenom}`
    ]);
    
    doc.autoTable({
      head: [["Module", "Code", "Date", "Time", "Room", "Supervisor"]],
      body: tableRows,
      startY: startYPosition,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234], textColor: 255 },
      margin: { top: 10 }
    });
    
    return (doc.lastAutoTable?.finalY || startYPosition) + 15;
  };
  
  startY = addTable("GI Department Exams", giExams, startY);
  startY = addTable("IDS Department Exams", idsExams, startY);
  startY = addTable("Common Modules Exams", commonExams, startY);
  
  doc.save(`Complete_Exam_Schedule.pdf`);
};