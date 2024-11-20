import { ArticleDetail } from '@/components/ArticleDetail'

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto">
      <ArticleDetail id={params.id} />
    </div>
  )
}
