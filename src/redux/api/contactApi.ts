import { apiSlice } from "./apiSlice";

// Contact types
interface ContactInquiryData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface NewsletterData {
  email: string;
}

// Contact API endpoints
export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit contact inquiry
    submitContactInquiry: builder.mutation<
      { message: string },
      ContactInquiryData
    >({
      query: (data) => ({
        url: "/api/v1/contact-inquiry",
        method: "POST",
        body: data,
      }),
    }),

    // Subscribe to newsletter
    subscribeNewsletter: builder.mutation<{ message: string }, NewsletterData>({
      query: (data) => ({
        url: "/api/v1/newsletter",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useSubmitContactInquiryMutation,
  useSubscribeNewsletterMutation,
} = contactApi;
