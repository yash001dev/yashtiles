import {
  useGetProductBySlugQuery,
  useGetProductBySlugWithSlashQuery,
} from "../redux/api/resourcesApi";

export const useProductBySlug = (slug: string) => {
  // First try without leading slash
  const {
    data: product1,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
  } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  // If first query returns no product, try with leading slash
  const shouldTryWithSlash = !isLoading1 && !product1 && slug;

  const {
    data: product2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useGetProductBySlugWithSlashQuery(slug, {
    skip: !shouldTryWithSlash,
  });

  // Return the first successful result
  const product = product1 || product2;
  const isLoading = isLoading1 || (shouldTryWithSlash && isLoading2);
  const isError = !isLoading && !product && (isError1 || isError2);
  const error = error1 || error2;

  return {
    data: product,
    isLoading,
    isError,
    error,
  };
};
