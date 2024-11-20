import { useQuery } from '@tanstack/react-query';
import React from 'react'
import ArticleEditForm from '../forms/ArticleEditForm';
import { useStates, useTopics, useUpdateArticle } from "@/hooks/useNews";

interface EditArticleProps {
    id: string;
}

export default function EditPageLayout({id}: EditArticleProps) {
  const { data: article, isLoading, error, } = useQuery({ queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/news/${id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json();
    },
  });


  const { 
    data: states = [], 
    isError: isStatesError,
    isLoading: isStatesLoading 
  } = useStates();
  
  const { 
    data: topics = [], 
    isError: isTopicsError,
    isLoading: isTopicsLoading 
  } = useTopics();

  return (
    <ArticleEditForm 
      article={article}  
      states={states}
      topics={topics}
    />
  )
}

