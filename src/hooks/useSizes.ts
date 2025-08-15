import { useGetSizesQuery } from '../redux/api/resourcesApi';
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
  const {
    data: sizes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSizesQuery();

  return {
    data: sizes,
    isLoading,
    isError,
    error,
    refetch,
  };
};
