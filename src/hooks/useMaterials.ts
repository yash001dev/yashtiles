import { useQuery } from '@tanstack/react-query';
import { MaterialOption } from '../types';

interface MaterialData {
  id: string;
  name: string;
  description: string;
  content: string;
  link: string;
  available: boolean;
  sortOrder: number;
  image?: {
    url: string;
  };
}

export const useMaterials = () => {
  return useQuery<MaterialData[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await fetch('/api/materials?where[available][equals]=true&sort=sortOrder');
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      const data = await response.json();
      return data.docs.map((material: any) => ({
        id: material.id,
        name: material.name,
        description: material.description,
        content: material.content || '',
        link: material.link || '',
        available: material.available,
        sortOrder: material.sortOrder,
        image: material.image,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
