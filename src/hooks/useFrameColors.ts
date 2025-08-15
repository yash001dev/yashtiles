import { useQuery } from '@tanstack/react-query';
import { FrameColorOption } from '../types';

interface FrameColorData {
  id: string;
  name: string;
  color: string;
  description: string;
  available: boolean;
  sortOrder: number;
}

export const useFrameColors = () => {
  return useQuery<FrameColorData[]>({
    queryKey: ['frame-colors'],
    queryFn: async () => {
      const response = await fetch('/api/frame-colors?where[available][equals]=true&sort=sortOrder');
      if (!response.ok) {
        throw new Error('Failed to fetch frame colors');
      }
      const data = await response.json();
      return data.docs.map((color: any) => ({
        id: color.id,
        name: color.name,
        color: color.color,
        description: color.description,
        available: color.available,
        sortOrder: color.sortOrder,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
