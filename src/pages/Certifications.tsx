import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Filter, Plus, Download, Mail, Printer, MoreVertical, Check, X } from 'lucide-react';
import CertificateForm from '../components/forms/CertificateForm';
import { Certificate } from '../types/certificate';

export default function Certifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      certificateNumber: 'CERT-2023-001',
      studentName: 'John Doe',
      course: 'Web Development Bootcamp',
      issueDate: '2023-06-15',
      expiryDate: '2025-06-15',
      status: 'issued',
      deliveryMethod: 'email',
      recipientEmail: 'john.doe@example.com',
      createdAt: '2023-06-10',
      updatedAt: '2023-06-10'
    },
    {
      id: '2',
      certificateNumber: 'CERT-2023-002',
      studentName: 'Jane Smith',
      course: 'Data Science Fundamentals',
      issueDate: '2023-06-20',
      expiryDate: '2025-06-20',
      status: 'dispatched',
      deliveryMethod: 'post',
      trackingNumber: 'TRK123456789',
      createdAt: '2023-06-18',
      updatedAt: '2023-06-20'
    },
    {
      id: '3',
      certificateNumber: 'CERT-2023-003',
      studentName: 'Alex Johnson',
      course: 'UI/UX Design',
      issueDate: '2023-06-25',
      status: 'delivered',
      deliveryMethod: 'download',
      createdAt: '2023-06-22',
      updatedAt: '2023-06-25'
    },
  ]);

  const filteredCertificates = certificates.filter(cert => 
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCertificate = (data: any) => {
    const newCertificate: Certificate = {
      id: (certificates.length + 1).toString(),
      certificateNumber: `CERT-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`,
      studentName: data.name,
      course: data.courseName,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'issued',
      deliveryMethod: 'email',
      recipientEmail: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setCertificates([...certificates, newCertificate]);
    setShowAddForm(false);
  };

  const getStatusBadge = (status: Certificate['status']) => {
    const styles = {
      issued: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      dispatched: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  const getDeliveryIcon = (method: Certificate['deliveryMethod']) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'post':
        return <Printer className="h-4 w-4 text-green-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-purple-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certification Dispatch</h1>
          <p className="text-gray-600 mt-1">Manage and track certificate issuance and delivery</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>All Status</option>
                <option>Issued</option>
                <option>Pending</option>
                <option>Dispatched</option>
                <option>Delivered</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {cert.certificateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cert.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cert.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(cert.status)}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {getDeliveryIcon(cert.deliveryMethod)}
                        <span className="ml-2 capitalize">{cert.deliveryMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Certificate Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Issue New Certificate</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CertificateForm 
                onSubmit={handleAddCertificate}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
