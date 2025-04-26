
import { Tender } from '@/types/tender';

export const mockTenders: Tender[] = [
  {
    id: '1',
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems.',
    category: 'construction',
    budget: 750000,
    deadline: '2025-05-20T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'IT Infrastructure Upgrade',
    description: 'Supply and installation of network equipment, servers, and workstations for headquarters.',
    category: 'goods',
    budget: 250000,
    deadline: '2025-04-28T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-18T14:15:00Z'
  },
  {
    id: '3',
    title: 'Annual Financial Audit',
    description: 'Professional services for annual financial audit and compliance review.',
    category: 'services',
    budget: 45000,
    deadline: '2025-05-15T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-20T09:45:00Z'
  },
  {
    id: '4',
    title: 'Marketing Strategy Consulting',
    description: 'Development of comprehensive marketing strategy and digital presence enhancement.',
    category: 'consulting',
    budget: 85000,
    deadline: '2025-04-25T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-22T11:20:00Z'
  },
  {
    id: '5',
    title: 'Office Furniture Procurement',
    description: 'Supply of ergonomic office furniture for 100 workstations.',
    category: 'goods',
    budget: 120000,
    deadline: '2025-05-10T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-25T16:10:00Z'
  },
  {
    id: '6',
    title: 'Corporate Event Planning',
    description: 'Full-service planning and coordination for annual corporate conference.',
    category: 'services',
    budget: 180000,
    deadline: '2025-06-01T23:59:59Z',
    status: 'draft',
    createdAt: '2025-03-28T13:40:00Z'
  }
];
