import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Download, Users, BookOpen, FileText, ChevronDown, Plus, MoreVertical, X } from 'lucide-react';

type ReportFormat = 'pdf' | 'csv' | 'excel' | 'json';

type ReportType = 'all' | 'certificates' | 'courses' | 'employees' | 'finance';

interface Report {
  id: string;
  title: string;
  type: ReportType;
  lastGenerated: string;
  rows: number;
  fileSize: string;
}

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ReportType>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    title: '',
    type: 'certificates' as ReportType,
    format: 'pdf' as ReportFormat,
    includeData: true,
    schedule: 'once' as 'once' | 'daily' | 'weekly' | 'monthly'
  });

  const handleGenerateReport = async () => {
    if (!reportConfig.title.trim()) {
      alert('Please enter a report title');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReport: Report = {
      id: Date.now().toString(),
      title: reportConfig.title,
      type: reportConfig.type,
      lastGenerated: new Date().toISOString().split('T')[0],
      rows: Math.floor(Math.random() * 1000) + 100,
      fileSize: `${(Math.random() * 2 + 0.1).toFixed(1)} MB`
    };
    
    // In a real app, you would call an API to generate the report
    console.log('Generating report:', { ...reportConfig, id: newReport.id });
    
    // Reset form and close modal
    setReportConfig({
      title: '',
      type: 'certificates',
      format: 'pdf',
      includeData: true,
      schedule: 'once'
    });
    setShowGenerateModal(false);
    setIsGenerating(false);
    
    // In a real app, you would refresh the reports list
    alert(`Report "${newReport.title}" generated successfully!`);
  };

  const reports: Report[] = [
    {
      id: '1',
      title: 'Monthly Certificate Issuance',
      type: 'certificates',
      lastGenerated: '2023-06-20',
      rows: 245,
      fileSize: '1.2 MB'
    },
    {
      id: '2',
      title: 'Course Completion Report',
      type: 'courses',
      lastGenerated: '2023-06-18',
      rows: 89,
      fileSize: '450 KB'
    },
    {
      id: '3',
      title: 'Employee Training Status',
      type: 'employees',
      lastGenerated: '2023-06-15',
      rows: 156,
      fileSize: '780 KB'
    },
    {
      id: '4',
      title: 'Q2 Financial Summary',
      type: 'finance',
      lastGenerated: '2023-06-10',
      rows: 42,
      fileSize: '320 KB'
    },
    {
      id: '5',
      title: 'Certificate Expiry Report',
      type: 'certificates',
      lastGenerated: '2023-06-05',
      rows: 67,
      fileSize: '210 KB'
    },
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getReportIcon = (type: ReportType) => {
    switch (type) {
      case 'certificates':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'courses':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'employees':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'finance':
        return <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage your organization's reports</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowGenerateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Available Reports</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ReportType)}
                >
                  <option value="all">All Report Types</option>
                  <option value="certificates">Certificates</option>
                  <option value="courses">Courses</option>
                  <option value="employees">Employees</option>
                  <option value="finance">Finance</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true">
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Generated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rows
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                            {getReportIcon(report.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.lastGenerated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.rows.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.fileSize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => console.log(`Downloading ${report.title}`)}
                          >
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
          )}
        </CardContent>
      </Card>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate New Report</h2>
                <button 
                  onClick={() => setShowGenerateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={isGenerating}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="reportTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="reportTitle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={reportConfig.title}
                    onChange={(e) => setReportConfig({...reportConfig, title: e.target.value})}
                    placeholder="e.g., Q3 2023 Sales Report"
                    disabled={isGenerating}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                      Report Type
                    </label>
                    <select
                      id="reportType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={reportConfig.type}
                      onChange={(e) => setReportConfig({...reportConfig, type: e.target.value as ReportType})}
                      disabled={isGenerating}
                    >
                      <option value="certificates">Certificates</option>
                      <option value="courses">Courses</option>
                      <option value="employees">Employees</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <select
                      id="reportFormat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={reportConfig.format}
                      onChange={(e) => setReportConfig({...reportConfig, format: e.target.value as ReportFormat})}
                      disabled={isGenerating}
                    >
                      <option value="pdf">PDF</option>
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule
                    </label>
                    <select
                      id="schedule"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={reportConfig.schedule}
                      onChange={(e) => setReportConfig({...reportConfig, schedule: e.target.value as any})}
                      disabled={isGenerating}
                    >
                      <option value="once">Run once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="includeData"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={reportConfig.includeData}
                    onChange={(e) => setReportConfig({...reportConfig, includeData: e.target.checked})}
                    disabled={isGenerating}
                  />
                  <label htmlFor="includeData" className="ml-2 block text-sm text-gray-700">
                    Include all available data
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={() => setShowGenerateModal(false)}
                  variant="secondary"
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  variant="primary"
                  disabled={!reportConfig.title.trim()}
                  isLoading={isGenerating}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
