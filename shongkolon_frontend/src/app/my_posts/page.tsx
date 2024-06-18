'use client';
import { BACKEND_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import PostList from '@/ui/components/post/PostList';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/posts/user/${user?._id}`,
        );
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [user, refresh]);

  const onDelete = () => {
    setRefresh(!refresh);
  };

  return (
    <section className="mx-auto max-w-7xl p-8 pb-16">
      <PostList posts={posts} canDelete={true} onDelete={onDelete} />
    </section>
  );
}
