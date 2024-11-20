'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState(searchParams.get('state') || '')
  const [topic, setTopic] = useState(searchParams.get('topic') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (state) params.set('state', state)
    if (topic) params.set('topic', topic)
    if (search) params.set('search', search)
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:space-x-4">
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="w-full md:w-48 p-2 border rounded"
      >
        <option value="">Select State</option>
        <option value="CA">California</option>
        <option value="NY">New York</option>
        {/* Add more states */}
      </select>
      
      <select
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full md:w-48 p-2 border rounded"
      >
        <option value="">Select Topic</option>
        <option value="healthcare">Healthcare</option>
        <option value="education">Education</option>
        {/* Add more topics */}
      </select>
      
      <input
        type="search"
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 p-2 border rounded"
      />
      
      <button
        type="submit"
        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </form>
  )
}

