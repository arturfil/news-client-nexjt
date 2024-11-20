"use client"

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "use-debounce";
import { NewsFilters } from "@/types/News";
import { useNews, useStates, useTopics } from "@/hooks/useNews";
import { formatDate } from "@/utils/dateUtils";

export default function NewsList() {
  // Local state for filters and loading state
  const [isClientSide, setIsClientSide] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<NewsFilters>({
    state: "",
    topic: "",
    search: "",
  });

  // Set client-side flag on mount
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Debounce search to avoid too many API calls
  const [debouncedSearch] = useDebounce(filters.search, 500);

  // Queries with enabled flag
  const {
    data: newsData,
    isLoading,
    isError,
    error,
    refetch,
    isPreviousData,
  } = useNews({ 
    ...filters, 
    search: debouncedSearch 
  }, currentPage);

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

  // Filter handlers
  const handleFilterChange = (key: keyof NewsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (newsData && currentPage < newsData.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // Don't render anything during SSR
  if (!isClientSide) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Legislative News</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* State Filter */}
          <select
            className="w-full p-2 border rounded-lg text-gray-900 disabled:bg-gray-100"
            value={filters.state}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            disabled={isStatesLoading || isStatesError}
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* Topic Filter */}
          <select
            className="w-full p-2 border rounded-lg text-gray-900 disabled:bg-gray-100"
            value={filters.topic}
            onChange={(e) => handleFilterChange("topic", e.target.value)}
            disabled={isTopicsLoading || isTopicsError}
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State with Retry */}
      {isError && (
        <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="mb-2">{(error as Error)?.message || "Failed to load articles"}</p>
          <button
            onClick={handleRetry}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !isPreviousData && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Articles List */}
      {newsData && (
        <>
          <div className="space-y-6">
            {newsData.articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{article.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {article.state}
                    </span>
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {article.topic}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formatDate(article.published_date)}</span>
                  <a
                    href={`/news/${article.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}

            {/* No Results */}
            {newsData.articles.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                No articles found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {newsData.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-1 px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <span className="text-gray-600">
                Page {currentPage} of {newsData.totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage >= newsData.totalPages || isLoading}
                className="flex items-center gap-1 px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
