import { useQuery } from '@tanstack/react-query';
import { HangOption } from '../types';

interface HangOptionData {
  id: string;
  name: string;
  description: string;
  content: string;
  price: number;
  available: boolean;
  sortOrder: number;
  image?: {
    url: string;
  };
}

export const useHangOptions = () => {
  return useQuery<HangOptionData[]>({
    queryKey: ['hang-options'],
    queryFn: async () => {
      const response = await fetch('/api/hang-options?where[available][equals]=true&sort=sortOrder');
      if (!response.ok) {
        throw new Error('Failed to fetch hang options');
      }
      const data = await response.json();
      return data.docs.map((option: any) => ({
        id: option.id,
        name: option.name,
        description: option.description,
        content: option.content || '',
        price: option.price,
        available: option.available,
        sortOrder: option.sortOrder,
        image: option.image,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
