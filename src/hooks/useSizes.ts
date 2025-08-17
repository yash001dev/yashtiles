import { useGetSizesQuery } from "../redux/api/resourcesApi";
import { SizeOption } from "../types";

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

  //Replace id with name
  const formattedSizes = sizes.map((size: SizeData) => {
    const id = size?.name
      ?.replace(/"/g, "") // remove quotes
      .replace("×", "x") // replace × with x
      .replace(/\s+/g, " ") // normalize spaces
      .replace(/\s+/g, "") // remove all spaces
      .replace(/[^\dx]/g, ""); // keep only digits and x
    return {
      id,
      name: size.name,
      dimensions: size.dimensions,
      aspectRatio: size.aspectRatio,
      price: size.price,
    };
  });

  return {
    data: formattedSizes,
    isLoading,
    isError,
    error,
    refetch,
  };
};
