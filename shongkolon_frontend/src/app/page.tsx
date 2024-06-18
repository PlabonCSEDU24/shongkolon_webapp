'use client';
import { BACKEND_URL } from '@/constants/config';
import { Post } from '@/types';
import PostList from '@/ui/components/post/PostList';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/posts/?limit=20`);
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="mx-auto max-w-7xl p-8 pb-16">
      <PostList posts={posts} canDelete={false} />
    </section>
  );
}
