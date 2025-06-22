import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Download, Users, Filter, Calendar, Building, MapPin, Phone, DollarSign, Printer } from 'lucide-react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
}

interface Batch {
  _id: string;
  batchNo: string;
  subjectCourse: string;
  status: string;
}

interface Vendor {
  _id: string;
  name: string;
  company: string;
}

export default function Reports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [selectedVendor, setSelectedVendor] = useState<string>('All Vendors');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [studentsRes, batchesRes, vendorsRes] = await Promise.all([
        api.get('/students'),
        api.get('/batches'),
        api.get('/vendors'),
      ]);

      setStudents(studentsRes.data);
      setBatches(batchesRes.data);
      setVendors(vendorsRes.data);
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

  // Filter students based on selected batch, vendor, and search term
  const filteredStudents = students.filter(student => {
    // Batch filter
    const batchMatch = selectedBatch === 'All Batches' || student.batchNo === selectedBatch;
    
    // Vendor filter
    const vendorMatch = selectedVendor === 'All Vendors' || student.vendor === selectedVendor;
    
    // Search filter
    const searchMatch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return batchMatch && vendorMatch && searchMatch;
  });

  // Calculate summary statistics
  const totalStudents = filteredStudents.length;
  const totalPaid = filteredStudents.reduce((sum, student) => sum + (student.totalPaid || 0), 0);
  const totalBalance = filteredStudents.reduce((sum, student) => sum + (student.balanceDue || 0), 0);

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Student Name', 'Contact Number', 'Vendor Name', 'Location', 'Admission Date', 'Paid', 'Balance'],
      ...filteredStudents.map(student => [
        student.name,
        student.phone || '',
        student.vendor || '',
        student.location || '',
        new Date(student.enrollmentDate).toLocaleDateString(),
        (student.totalPaid || 0).toString(),
        (student.balanceDue || 0).toString(),
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
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Report', 105, 20, { align: 'center' });
    
    // Add subtitle with date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 30, { align: 'center' });
    
    // Add filter information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Applied Filters:', 20, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPosition = 55;
    
    if (selectedBatch !== 'All Batches') {
      doc.text(`• Batch: ${selectedBatch}`, 25, yPosition);
      yPosition += 7;
    }
    
    if (selectedVendor !== 'All Vendors') {
      doc.text(`• Vendor: ${selectedVendor}`, 25, yPosition);
      yPosition += 7;
    }
    
    if (searchTerm) {
      doc.text(`• Search: "${searchTerm}"`, 25, yPosition);
      yPosition += 7;
    }
    
    if (selectedBatch === 'All Batches' && selectedVendor === 'All Vendors' && !searchTerm) {
      doc.text('• No filters applied (showing all students)', 25, yPosition);
      yPosition += 7;
    }
    
    // Add summary statistics
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary:', 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition += 7;
    doc.text(`• Total Students: ${totalStudents}`, 25, yPosition);
    yPosition += 7;
    doc.text(`• Total Paid: ${totalPaid.toLocaleString()}`, 25, yPosition);
    yPosition += 7;
    doc.text(`• Total Balance: ${totalBalance.toLocaleString()}`, 25, yPosition);
    
    // Prepare table data
    const tableData = filteredStudents.map(student => [
      student.name,
      student.phone || 'N/A',
      student.vendor || 'N/A',
      student.location || 'N/A',
      new Date(student.enrollmentDate).toLocaleDateString(),
      (student.totalPaid || 0).toLocaleString(),
      (student.balanceDue || 0).toLocaleString(),
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Student Name', 'Contact Number', 'Vendor Name', 'Location', 'Admission Date', 'Paid', 'Balance']],
      body: tableData,
      startY: yPosition + 10,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Student Name
        1: { cellWidth: 25 }, // Contact Number
        2: { cellWidth: 30 }, // Vendor Name
        3: { cellWidth: 25 }, // Location
        4: { cellWidth: 25 }, // Admission Date
        5: { cellWidth: 20 }, // Paid
        6: { cellWidth: 20 }, // Balance
      },
      margin: { top: 10 },
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">{totalBalance.toLocaleString()}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Batch Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full appearance-none bg-white"
              >
                <option>All Batches</option>
                {batches.map(batch => (
                  <option key={batch._id} value={batch.batchNo}>
                    {batch.batchNo} - {batch.subjectCourse}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Filter */}
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full appearance-none bg-white"
              >
                <option>All Vendors</option>
                {vendors.map(vendor => (
                  <option key={vendor._id} value={vendor.name}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          {(selectedBatch !== 'All Batches' || selectedVendor !== 'All Vendors' || searchTerm) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Active Filters:</strong>
                {selectedBatch !== 'All Batches' && ` Batch: ${selectedBatch}`}
                {selectedVendor !== 'All Vendors' && ` Vendor: ${selectedVendor}`}
                {searchTerm && ` Search: "${searchTerm}"`}
                <span className="ml-2 text-blue-600">
                  ({filteredStudents.length} students found)
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
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
                          {(student.totalPaid || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">
                          {(student.balanceDue || 0).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 