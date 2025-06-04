
import React, { useState } from 'react';
import { Upload, FileText, TrendingUp, Users, DollarSign, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StartupData {
  id: string;
  name: string;
  industry: string;
  stage: string;
  funding: string;
  location: string;
  employees: string;
  description: string;
  valuation: string;
  founder: string;
}

const Index = () => {
  const [csvData, setCsvData] = useState<StartupData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Sample data for demonstration
  const sampleData: StartupData[] = [
    {
      id: '1',
      name: 'TechFlow AI',
      industry: 'Artificial Intelligence',
      stage: 'Series A',
      funding: '$5.2M',
      location: 'San Francisco, CA',
      employees: '25',
      description: 'AI-powered workflow automation for enterprises',
      valuation: '$25M',
      founder: 'Sarah Chen'
    },
    {
      id: '2',
      name: 'GreenEnergy Solutions',
      industry: 'Clean Tech',
      stage: 'Seed',
      funding: '$2.1M',
      location: 'Austin, TX',
      employees: '12',
      description: 'Solar panel optimization using machine learning',
      valuation: '$12M',
      founder: 'Michael Rodriguez'
    },
    {
      id: '3',
      name: 'HealthTracker Pro',
      industry: 'Healthcare',
      stage: 'Series B',
      funding: '$15.8M',
      location: 'Boston, MA',
      employees: '67',
      description: 'Personalized health monitoring and analytics platform',
      valuation: '$80M',
      founder: 'Dr. Emily Watson'
    }
  ];

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    setHeaders(headers);

    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      const rowData: any = { id: (index + 1).toString() };
      
      headers.forEach((header, headerIndex) => {
        rowData[header.toLowerCase().replace(/\s+/g, '')] = values[headerIndex] || '';
      });
      
      return rowData;
    });

    setCsvData(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        parseCSV(csvText);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        parseCSV(csvText);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const loadSampleData = () => {
    setCsvData(sampleData);
    setHeaders(['Name', 'Industry', 'Stage', 'Funding', 'Location', 'Employees', 'Description', 'Valuation', 'Founder']);
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'seed': return 'bg-green-100 text-green-800';
      case 'series a': return 'bg-blue-100 text-blue-800';
      case 'series b': return 'bg-purple-100 text-purple-800';
      case 'series c': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Startup Data Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your CSV file containing startup information and visualize the data in beautiful, interactive cards
          </p>
        </div>

        {/* CSV Upload Section */}
        {csvData.length === 0 && (
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports CSV files with startup information
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Don't have a CSV file? Try our sample data
                </p>
                <Button onClick={loadSampleData} variant="default">
                  Load Sample Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Table Preview */}
        {csvData.length > 0 && headers.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Data Preview</span>
                <Button 
                  onClick={() => {
                    setCsvData([]);
                    setHeaders([]);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Upload New File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      {headers.map((header, index) => (
                        <th 
                          key={index}
                          className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {headers.map((header, colIndex) => (
                          <td 
                            key={colIndex}
                            className="border border-gray-200 px-4 py-3 text-sm text-gray-600"
                          >
                            {row[header.toLowerCase().replace(/\s+/g, '')] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing first 5 rows of {csvData.length} total entries
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Startup Cards/Widgets */}
        {csvData.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Startup Overview ({csvData.length} companies)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {csvData.map((startup, index) => (
                <Card key={startup.id || index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{startup.name || 'Unknown Company'}</CardTitle>
                        <Badge variant="secondary" className={getStageColor(startup.stage || '')}>
                          {startup.stage || 'Unknown Stage'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Valuation</p>
                        <p className="font-bold text-green-600">{startup.valuation || 'N/A'}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {startup.description || 'No description available'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Industry</p>
                          <p className="text-sm font-medium">{startup.industry || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Funding</p>
                          <p className="text-sm font-medium">{startup.funding || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-xs text-gray-500">Employees</p>
                          <p className="text-sm font-medium">{startup.employees || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium">{startup.location || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {startup.founder && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Founder</p>
                        <p className="text-sm font-medium">{startup.founder}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
