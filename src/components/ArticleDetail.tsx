"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface ArticleDetailProps {
  id: string;
}

export function ArticleDetail({ id }: ArticleDetailProps) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/news/${id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error loading article</div>;
  }

  return (
    <article className="mt-4 prose lg:prose-xl">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <div className="flex space-x-4 text-sm text-gray-500">
        <span className="font-bold">{article.state}</span>
        <span className="font-bold">{article.topic}</span>
        <span>{new Date(article.published_date).toLocaleDateString()}</span>
      </div>
      <div
        className="mt-6"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <button className="bg-blue-600 mt-4 text-white px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        <Link href={"/news/edit/" + id}>Edit</Link>
      </button>
    </article>
  );
}
