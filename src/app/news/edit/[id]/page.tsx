"use client"

import EditPageLayout from '../../../../components/state/EditPageLayout';
import { useParams } from 'next/navigation';

export default function EditNewsPage() {
  const params = useParams<{id: string}>();

  return (
    <>
    <EditPageLayout id={params.id} />
    </>
  )
}

