'use client';
import PostDetail from '@/components/Posts/post-detail';
import Breadcrumbs from '@/components/ui/invoices/breadcrumbs';
import { Posteo } from '@/interfaces/types';
import { usePostStore } from '@/store/post-store';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default async function Page() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const post = usePostStore((state) => state.posteo);
  
  const [postDetail, setPostDetail] = useState<Posteo>();

  useEffect(() => {
    if (id && post && post.id === Number(id)) {
      setPostDetail(post);
    }
  }, [id, post]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Publicaciones', href: '/dashboard' },
          {
            label: 'Detalle de publicacion',
            href: `/dashboard/post/${id}`,
            active: true,
          },
        ]}
      />
      {postDetail ? <PostDetail posteo={postDetail}  /> : <div>Posteo no encontrado</div>}
    </main>
  )
}
