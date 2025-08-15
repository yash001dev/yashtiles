import { useGetMaterialsQuery } from "../redux/api/resourcesApi";
import { MaterialOption } from "../types";

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
  const {
    data: materials = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMaterialsQuery();

  return {
    data: materials,
    isLoading,
    isError,
    error,
    refetch,
  };
};
