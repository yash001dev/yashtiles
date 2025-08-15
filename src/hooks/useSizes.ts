import { useQuery } from '@tanstack/react-query';
import { SizeOption } from '../types';

interface SizeData {
  id: string;
  name: string;
  dimensions: string;
  aspectRatio: number;
  price: number;
  available: boolean;
  sortOrder: number;
}

export const useSizes = () => {
  return useQuery<SizeData[]>({
    queryKey: ['sizes'],
    queryFn: async () => {
      const response = await fetch('/api/sizes?where[available][equals]=true&sort=sortOrder');
      if (!response.ok) {
        throw new Error('Failed to fetch sizes');
      }
      const data = await response.json();
      return data.docs.map((size: any) => ({
        id: size.id,
        name: size.name,
        dimensions: size.dimensions,
        aspectRatio: size.aspectRatio,
        price: size.price,
        available: size.available,
        sortOrder: size.sortOrder,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
