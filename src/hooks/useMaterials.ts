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

  const formattedMaterials = materials.map((material: MaterialData) => {
    console.log("inage:", material);
    return {
      id: material.name,
      name: material.name,
      description: material.description,
      content: material.content,
      link: material.link,
      image: material.image?.url,
    };
  });

  return {
    data: formattedMaterials,
    isLoading,
    isError,
    error,
    refetch,
  };
};
