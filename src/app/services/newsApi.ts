import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const params = {
  key: import.meta.env.VITE_GOOGLE_KEY,
};

export interface NewsDetailsResponse {
  by: string;
  descendants: number;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
  kids: number[];
  text: string;
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints: (builder) => ({
    getAllItemId: builder.query<number[], void>({
      query: () => ({
        url: `/newstories.json?print=pretty`,
        params,
      }),
    }),
    getNewsById: builder.query<NewsDetailsResponse, number | string | number[]>(
      {
        query: (newsId) => ({
          url: `https://hacker-news.firebaseio.com/v0/item/${newsId}.json?print=pretty`,
          params,
        }),
      }
    ),
  }),
});

export const { useLazyGetAllItemIdQuery, useLazyGetNewsByIdQuery } = newsApi;
