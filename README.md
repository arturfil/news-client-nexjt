# Legislative News Frontend

A Next.js application for displaying legislative news with caching implementation using React Query.

## Features

- Server-Side Rendering (SSR) for improved SEO and performance
- Client-side data fetching with React Query
- Pagination
- Search functionality with debouncing
- Filter by state and topic
- Responsive design

## Caching Strategy

### React Query Implementation

The application uses React Query for data fetching and caching:

```typescript
// Fetch and cache news articles
export function useNews(filters: NewsFilters) {
  return useInfiniteQuery({
    queryKey: ['news', filters],
    queryFn: ({ pageParam = 1 }) => fetchNews(pageParam, filters),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Cache metadata (states, topics)
export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: () => fetchMetadata('states'),
  });
}
```

### Key Features

1. **Automatic Background Updates**: React Query automatically refreshes stale data in the background.

2. **Cache Invalidation**: 
   - Automatic cache invalidation when filters change
   - Manual invalidation available through React Query's `invalidateQueries`

3. **Infinite Scroll Or Pagination**: 
   - Uses `useInfiniteQuery` for pagination
   - Caches pages individually
   - Maintains scroll position when navigating back

4. **Metadata Caching**:
   - States and topics are cached separately
   - Lower refresh rate for relatively static data

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. Run development server:
```bash
npm run dev
```

## Performance Optimizations

1. **Debounced Search**:
```typescript
const [debouncedSearch] = useDebounce(filters.search, 500);
```
- Reducing unnecessary api calls.

2. **Pagination**:
- Implements infinite scroll with React Query
- Only fetches data when needed
- Maintains smooth scrolling experience

3. **Error Boundaries**:
- Graceful error handling
- Automatic retries for failed requests

## API Integration

The frontend connects to the backend API with these main endpoints:

- `GET /api/news`: Fetch paginated news articles
- `GET /api/news/metadata/states`: Get available states
- `GET /api/news/metadata/topics`: Get available topics

## Build

```bash
npm run build
```
