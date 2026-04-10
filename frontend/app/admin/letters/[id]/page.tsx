import { AdminLetterDetailClient } from '@/components/admin/admin-letter-detail-client';

export default function AdminLetterDetailPage({ params }: { params: { id: string } }) {
  return <AdminLetterDetailClient id={params.id} />;
}
