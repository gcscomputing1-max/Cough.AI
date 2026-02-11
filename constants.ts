
import { BlogPost, HistoryItem } from './types';

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'understanding-cough-sounds',
    title: 'Understanding Different Cough Sounds',
    summary: 'Not all coughs are created equal. Learn how to distinguish between dry, wet, and whooping coughs.',
    content: '...',
    author: 'Dr. Sarah Jenkins',
    date: 'Oct 12, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    category: 'Respiratory Health',
  },
  {
    id: '2',
    slug: 'ai-in-healthcare-future',
    title: 'The Future of AI in Respiratory Healthcare',
    summary: 'How artificial intelligence is revolutionizing lung condition detection.',
    content: '...',
    author: 'Mark Chen',
    date: 'Oct 15, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    category: 'AI',
  },
  {
    id: '3',
    slug: 'asthma-management-2024',
    title: 'Asthma Management in 2024',
    summary: 'New technologies and strategies for managing chronic respiratory conditions.',
    content: '...',
    author: 'Dr. Leo Vance',
    date: 'Nov 02, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    category: 'Asthma',
  }
];

export const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', date: '2023-11-01', type: 'Normal Breath', confidence: 0.98, severity: 'Low' },
  { id: '2', date: '2023-11-05', type: 'Dry Cough', confidence: 0.85, severity: 'Medium', note: 'Occurred after exercise.' },
  { id: '3', date: '2023-11-12', type: 'Normal Breath', confidence: 0.95, severity: 'Low' },
  { id: '4', date: '2023-11-20', type: 'Wet Cough', confidence: 0.72, severity: 'High', note: 'Heavy chest feeling.' },
  { id: '5', date: '2023-11-25', type: 'Normal Breath', confidence: 0.99, severity: 'Low' },
  { id: '6', date: '2023-12-01', type: 'Dry Cough', confidence: 0.88, severity: 'Medium' },
];
