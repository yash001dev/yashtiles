import { useGetHangOptionsQuery } from "../redux/api/resourcesApi";
import { HangOption } from "../types";

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
  const {
    data: hangOptions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHangOptionsQuery();

  return {
    data: hangOptions,
    isLoading,
    isError,
    error,
    refetch,
  };
};
