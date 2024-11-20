import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
} from "@tanstack/react-query";
import { NewsFilters, NewsResponse } from "../types/News";
import { Article } from "@/types/Article";

type StateOrTopic = "state" | "topic";

interface FormState {
  name: string;
  abbreviation?: string;
  description?: string;
}

const fetchNews = async (
  page: number,
  filters: NewsFilters,
): Promise<NewsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...(filters.state && { state: filters.state }),
      ...(filters.topic && { topic: filters.topic }),
      ...(filters.search && { search: filters.search }),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/news?${params}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

const updateArticle = async (id: number, data: Partial<Article>) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update article");
  }

  return response.json();
};

const createStateOrTopic = async (type: StateOrTopic, formState: FormState) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/${type}s`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Failed to create ${type}`);
    }

  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

const fetchMetadata = async (type: "states" | "topics"): Promise<string[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/news/metadata/${type}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

export function useNews(filters: NewsFilters, page: number = 1) {
  return useQuery({
    queryKey: ["news", filters, page],
    queryFn: () => fetchNews(page, filters),
    retry: 3,
    staleTime: 30000, // Consider data fresh for 30 seconds
    keepPreviousData: true, // Keep previous data while fetching new data
  });
}

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => fetchMetadata("states"),
    retry: 3,
    staleTime: 300000, // States change rarely, keep for 5 minutes
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: () => fetchMetadata("topics"),
    retry: 3,
    staleTime: 300000, // Topics change rarely, keep for 5 minutes
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Article> }) =>
      updateArticle(id, data),
    onSuccess: (updatedArticle) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["news"] });

      // Optionally update the article in the cache directly
      queryClient.setQueryData(["article", updatedArticle.id], updatedArticle);
    },
  });
}

export function useCreateStateOrTopic(type: StateOrTopic) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formState: FormState) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${type}s`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to create ${type}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful mutation
      queryClient.invalidateQueries({ queryKey: [type === 'state' ? 'states' : 'topics'] });
    },
    onError: (error) => {
      console.error(`Error creating ${type}:`, error);
    }
  });
}
