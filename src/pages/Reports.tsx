import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Download, Users, Filter, Calendar, Building, MapPin, Phone, PoundSterling, Printer, Calendar as CalendarIcon, BookOpen, RefreshCw, Monitor } from 'lucide-react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Modal from '../components/ui/Modal';
import Select from 'react-select';

interface Student {
  _id: string;
  name: string;
  phone: string;
  vendor: string;
  location: string;
  enrollmentDate: string;
  totalPaid: number;
  balanceDue: number;
  batchNo: string;
  courses?: string[];
  refund: number;
  microtech: { status: string };
  resit: { status: string };
}

interface Batch {
  _id: string;
  batchNo: string;
  subjectCourse: string;
  status: string;
  startingDate: string;
  endingDate: string;
}

interface Vendor {
  _id: string;
  name: string;
  company: string;
}

interface Course {
  id: string;
  title: string;
  courseCode: string;
  assignmentDuration: number;
  status: 'active' | 'inactive';
}

export default function Reports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [selectedVendor, setSelectedVendor] = useState<string>('All Vendors');
  const [selectedCourse, setSelectedCourse] = useState<string>('All Courses');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDateFrom, setTempDateFrom] = useState(dateFrom);
  const [tempDateTo, setTempDateTo] = useState(dateTo);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [studentsRes, batchesRes, vendorsRes, coursesRes] = await Promise.all([
        api.get('/students'),
        api.get('/batches'),
        api.get('/vendors'),
        api.get('/courses'),
      ]);

      setStudents(studentsRes.data);
      setBatches(batchesRes.data);
      setVendors(vendorsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students based on selected batch, vendor, course, date range, and search term
  const filteredStudents = students.filter(student => {
    // Batch filter
    const batchMatch = selectedBatch === 'All Batches' || student.batchNo === selectedBatch;
    // Vendor filter
    const vendorMatch = selectedVendor === 'All Vendors' || student.vendor === selectedVendor;
    // Course filter (via batch)
    const courseMatch = selectedCourse === 'All Courses' || (() => {
      const batch = batches.find(b => b.batchNo === student.batchNo);
      return batch && batch.subjectCourse === selectedCourse;
    })();
    // Admission date range filter
    let dateMatch = true;
    if (dateFrom) {
      dateMatch = new Date(student.enrollmentDate) >= new Date(dateFrom);
    }
    if (dateTo && dateMatch) {
      dateMatch = new Date(student.enrollmentDate) <= new Date(dateTo);
    }
    // Search filter
    const searchMatch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return batchMatch && vendorMatch && courseMatch && dateMatch && searchMatch;
  });

  // Calculate summary statistics
  const totalStudents = filteredStudents.length;
  const totalPaid = filteredStudents.reduce((sum, student) => sum + (student.totalPaid || 0), 0);
  const totalBalance = filteredStudents.reduce((sum, student) => sum + (student.balanceDue || 0), 0);
  const totalRefund = filteredStudents.reduce((sum, student) => sum + (student.refund || 0), 0);

  const getBatchLabel = (batchNo: string) => {
    const batch = batches.find(b => b.batchNo === batchNo);
    if (!batch) return batchNo;
    const start = new Date(batch.startingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const end = new Date(batch.endingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
    return `${batch.batchNo} : ${start} - ${end}`;
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Student Name', 'Batch', 'Contact Number', 'Vendor Name', 'Location', 'Admission Date', 'Paid', 'Balance'],
      ...filteredStudents.map(student => [
        student.name,
        getBatchLabel(student.batchNo),
        student.phone || '',
        student.vendor || '',
        student.location || '',
        new Date(student.enrollmentDate).toLocaleDateString(),
        `£${(student.totalPaid || 0).toString()}`,
        `£${(student.balanceDue || 0).toString()}`,
      ])
    ];

    // Convert to CSV string
    const csvString = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // Create new PDF document
    const doc = new jsPDF();

    // Modern Header
    doc.setFillColor(59, 130, 246); // Tailwind blue-600
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('Student Report', doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, doc.internal.pageSize.getWidth() / 2, 26, { align: 'center' });

    // Section: Filters
    let yPosition = 38;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(59, 130, 246); // Tailwind blue-600
    doc.text('Applied Filters', 14, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81); // Tailwind gray-700
    if (selectedBatch !== 'All Batches') {
      doc.text(`• Batch: ${getBatchLabel(selectedBatch)}`, 18, yPosition);
      yPosition += 5;
    }
    if (selectedVendor !== 'All Vendors') {
      doc.text(`• Vendor: ${selectedVendor}`, 18, yPosition);
      yPosition += 5;
    }
    if (selectedCourse !== 'All Courses') {
      doc.text(`• Course: ${selectedCourse}`, 18, yPosition);
      yPosition += 5;
    }
    if (dateFrom || dateTo) {
      doc.text(`• Admission Date Range: ${dateFrom ? `From: ${dateFrom}` : ''} ${dateTo ? `To: ${dateTo}` : ''}`, 18, yPosition);
      yPosition += 5;
    }
    if (searchTerm) {
      doc.text(`• Search: "${searchTerm}"`, 18, yPosition);
      yPosition += 5;
    }
    if (selectedBatch === 'All Batches' && selectedVendor === 'All Vendors' && selectedCourse === 'All Courses' && !dateFrom && !dateTo && !searchTerm) {
      doc.text('• No filters applied (showing all students)', 18, yPosition);
      yPosition += 5;
    }

    // Section Divider
    yPosition += 2;
    doc.setDrawColor(229, 231, 235); // Tailwind gray-200
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, doc.internal.pageSize.getWidth() - 14, yPosition);
    yPosition += 6;

    // Section: Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129); // Tailwind green-500
    doc.text('Summary', 14, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81); // Tailwind gray-700
    doc.text(`• Total Students: ${totalStudents}`, 18, yPosition);
    yPosition += 5;
    doc.text(`• Total Paid: £${totalPaid.toLocaleString()}`, 18, yPosition);
    yPosition += 5;
    doc.text(`• Total Balance: £${totalBalance.toLocaleString()}`, 18, yPosition);
    yPosition += 2;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, doc.internal.pageSize.getWidth() - 14, yPosition);
    yPosition += 8;

    // Table
    const tableData = filteredStudents.map(student => [
      student.name,
      getBatchLabel(student.batchNo),
      student.phone || 'N/A',
      student.vendor || 'N/A',
      student.location || 'N/A',
      new Date(student.enrollmentDate).toLocaleDateString(),
      `£${(student.totalPaid || 0).toLocaleString()}`,
      `£${(student.balanceDue || 0).toLocaleString()}`,
      `${(student.microtech && student.microtech.status === 'yes' ? 'M' : '')}${(student.resit && student.resit.status === 'yes' ? 'R' : '')}`
    ]);

    autoTable(doc, {
      head: [['Student Name', 'Batch', 'Contact Number', 'Vendor Name', 'Location', 'Admission Date', 'Paid', 'Balance', 'M/R']],
      body: tableData,
      startY: yPosition,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'middle',
        textColor: [31, 41, 55], // Tailwind gray-800
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
        lineWidth: 0,
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246], // Tailwind gray-100
      },
      tableLineColor: [229, 231, 235],
      tableLineWidth: 0.5,
      tableWidth: 'auto',
      margin: { left: 6, right: 6, top: 10 },
      didParseCell: function (data) {
        if (data.section === 'body') {
          const studentIdx = data.row.index;
          const student = filteredStudents[studentIdx];
          if (student && student.refund > 0) {
            data.cell.styles.fillColor = [255, 199, 206]; // Light red background
            data.cell.styles.lineColor = [239, 68, 68]; // Red border
            data.cell.styles.lineWidth = 0.5;
          }
        }
      },
    });

    // Footer with branding
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(156, 163, 175); // Tailwind gray-400
      doc.text('Generated by CustomCRM', 14, doc.internal.pageSize.height - 8);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 14, doc.internal.pageSize.height - 8, { align: 'right' });
    }

    // Save the PDF
    doc.save(`student-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Reports</h1>
          <p className="text-gray-600 mt-1">Filter and analyze student data by batch and vendor</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print PDF
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <PoundSterling className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">£{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <PoundSterling className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">£{totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <PoundSterling className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Refund</p>
                <p className="text-2xl font-bold text-gray-900">£{totalRefund.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center overflow-x-auto pb-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-w-0"
              />
            </div>
            {/* Batch Filter */}
            <div className="relative flex-1 min-w-[220px]">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Select
                value={selectedBatch === 'All Batches' ? { value: 'All Batches', label: 'All Batches' } : batches.find(b => b.batchNo === selectedBatch) ? {
                  value: selectedBatch,
                  label: `${batches.find(b => b.batchNo === selectedBatch)?.batchNo} : ${new Date(batches.find(b => b.batchNo === selectedBatch)?.startingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batches.find(b => b.batchNo === selectedBatch)?.endingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
                } : null}
                onChange={option => setSelectedBatch(option ? option.value : 'All Batches')}
                options={[
                  { value: 'All Batches', label: 'All Batches' },
                  ...batches.map(batch => ({
                    value: batch.batchNo,
                    label: `${batch.batchNo} : ${new Date(batch.startingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batch.endingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
                  }))
                ]}
                isClearable={false}
                isSearchable
                placeholder="All Batches"
                classNamePrefix="react-select"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
                menuShouldBlockScroll={true}
              />
            </div>
            {/* Vendor Filter */}
            <div className="relative flex-1 min-w-[180px]">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-w-0 appearance-none bg-white"
              >
                <option>All Vendors</option>
                {vendors.map(vendor => (
                  <option key={vendor._id} value={vendor.name}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Course Filter */}
            <div className="relative flex-1 min-w-[220px]">
              <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Select
                value={selectedCourse === 'All Courses' ? { value: 'All Courses', label: 'All Courses' } : courses.find(c => c.title === selectedCourse) ? {
                  value: selectedCourse,
                  label: courses.find(c => c.title === selectedCourse)?.title
                } : null}
                onChange={option => setSelectedCourse(option ? option.value : 'All Courses')}
                options={[
                  { value: 'All Courses', label: 'All Courses' },
                  ...courses.map(course => ({ value: course.title, label: course.title }))
                ]}
                isClearable={false}
                isSearchable
                placeholder="All Courses"
                classNamePrefix="react-select"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
                menuShouldBlockScroll={true}
              />
            </div>
            {/* Date Range Picker Button */}
            <div className="flex-1 min-w-[180px]">
              <button
                type="button"
                onClick={() => {
                  setTempDateFrom(dateFrom);
                  setTempDateTo(dateTo);
                  setShowDateModal(true);
                }}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
              >
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                {dateFrom || dateTo
                  ? `${dateFrom ? dateFrom : '...'} - ${dateTo ? dateTo : '...'}`
                  : 'Pick date range'}
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          {(selectedBatch !== 'All Batches' || selectedVendor !== 'All Vendors' || searchTerm || selectedCourse !== 'All Courses' || dateFrom || dateTo) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Active Filters:</strong>
                {selectedBatch !== 'All Batches' && ` Batch: ${getBatchLabel(selectedBatch)}`}
                {selectedVendor !== 'All Vendors' && ` Vendor: ${selectedVendor}`}
                {selectedCourse !== 'All Courses' && ` Course: ${selectedCourse}`}
                {dateFrom && ` From: ${dateFrom}`}
                {dateTo && ` To: ${dateTo}`}
                {searchTerm && ` Search: "${searchTerm}"`}
                <span className="ml-2 text-blue-600">
                  ({filteredStudents.length} students found)
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Range Modal */}
      <Modal isOpen={showDateModal} onClose={() => setShowDateModal(false)} title="Select Admission Date Range">
        <div className="flex gap-4 mb-6">
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm text-gray-600">From</label>
            <input
              type="date"
              value={tempDateFrom}
              onChange={e => setTempDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm text-gray-600">To</label>
            <input
              type="date"
              value={tempDateTo}
              onChange={e => setTempDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDateModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowDateModal(false);
              setDateFrom(tempDateFrom);
              setDateTo(tempDateTo);
            }}
            disabled={!!(tempDateFrom && tempDateTo && tempDateFrom > tempDateTo)}
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Data</CardTitle>
          <p className="text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    M/R
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const hasRefund = student.refund > 0;
                    const hasMicro = student.microtech && student.microtech.status === 'yes';
                    const hasResit = student.resit && student.resit.status === 'yes';
                    return (
                      <tr
                        key={student._id}
                        className={`hover:bg-gray-50${hasRefund ? ' border-2 border-red-500' : ''}`}
                        style={hasRefund ? { border: '2px solid #ef4444' } : {}}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getBatchLabel(student.batchNo)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {student.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Building className="h-4 w-4 mr-2 text-gray-400" />
                            {student.vendor || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {student.location || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(student.enrollmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            £{(student.totalPaid || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-600">
                            £{(student.balanceDue || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {hasMicro && (
                            <span className="inline-block bg-blue-100 text-blue-700 font-bold rounded px-2 py-0.5 text-xs mr-1 border border-blue-400" title="Micro Teaching">M</span>
                          )}
                          {hasResit && (
                            <span className="inline-block bg-purple-100 text-purple-700 font-bold rounded px-2 py-0.5 text-xs border border-purple-400" title="Retake/Resit">R</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 