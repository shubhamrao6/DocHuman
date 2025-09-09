export interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  created: string;
  lastAccessed: Date;
}

export const allFiles: FileData[] = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    type: 'PDF',
    size: '2.4 MB',
    status: 'Processed',
    created: '2 hours ago',
    lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Marketing Strategy.docx',
    type: 'DOCX',
    size: '1.8 MB',
    status: 'Processed',
    created: '1 day ago',
    lastAccessed: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'User Research Data.csv',
    type: 'CSV',
    size: '856 KB',
    status: 'Processing',
    created: '3 days ago',
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    name: 'Technical Specifications.txt',
    type: 'TXT',
    size: '124 KB',
    status: 'Processed',
    created: '1 week ago',
    lastAccessed: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '5',
    name: 'Financial Report Q3.xlsx',
    type: 'XLSX',
    size: '3.2 MB',
    status: 'Processed',
    created: '2 weeks ago',
    lastAccessed: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];