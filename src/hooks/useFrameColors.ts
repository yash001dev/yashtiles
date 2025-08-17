import { useGetFrameColorsQuery } from "../redux/api/resourcesApi";
import { FrameColorOption } from "../types";

export interface FrameColorData {
  id: string;
  name: string;
  color: string;
  description: string;
  available: boolean;
  sortOrder: number;
}

export const useFrameColors = () => {
  const {
    data: frameColors = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFrameColorsQuery();

  return {
    data: frameColors,
    isLoading,
    isError,
    error,
    refetch,
  };
};
