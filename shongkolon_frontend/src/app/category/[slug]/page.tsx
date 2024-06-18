'use client';
import { BACKEND_URL } from '@/constants/config';
import { Post } from '@/types';
import PostList from '@/ui/components/post/PostList';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {};

const page = (props: Props) => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          BACKEND_URL + `/api/posts/?limit=20&category=${slug}`,
        );
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <section className="mx-auto max-w-7xl p-8 pb-16">
      <PostList posts={posts} />
    </section>
  );
};

export default page;
