import { apiSlice } from "./apiSlice";

export interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  style?: string;
  width?: number;
  height?: number;
  guidanceScale?: number;
  steps?: number;
}

export interface GenerateImageResponse {
  success: boolean;
  imageData: string;
  generationTime: number;
}

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Generate AI image
    generateImage: builder.mutation<
      GenerateImageResponse,
      GenerateImageRequest
    >({
      query: (requestData) => ({
        url: "/api/v1/ai/generate-image",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["AI"],
    }),
  }),
});

export const { useGenerateImageMutation } = aiApi;
