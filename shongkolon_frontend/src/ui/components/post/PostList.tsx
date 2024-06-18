import { BACKEND_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import { DeleteIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  posts: Post[];
  canDelete?: boolean;
  onDelete?: Function;
};

const PostList = ({ posts, canDelete, onDelete }: Props) => {
  const { authToken } = useAuth();
  const deleteHandler = async (id: string) => {
    console.log(id);

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        onDelete && onDelete();
      } else {
        // Handle login error
        alert('Failed to delete.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    }
  };
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(book => (
          <Link
            key={book._id}
            href={`/post/${book._id}`}
            className="h-56 flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 "
          >
            {book.photos.length > 0 && (
              <img
                className="object-cover w-40 h-56 rounded-l-md"
                src={`${BACKEND_URL}/api/contents/images/${book.photos[0].fileName}`}
                alt=""
              />
            )}
            <div className="relative flex flex-col p-2 h-full overflow-hidden">
              {canDelete && (
                <div
                  className="bg-gray-200 absolute right-0 top-0 px-4 py-1 cursor-pointer hover:bg-gray-300"
                  onClick={e => {
                    e.preventDefault();
                    deleteHandler(book._id);
                  }}
                >
                  <Trash2 color="red" size={32} />
                </div>
              )}
              <h5 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-1">
                {book.bookName}
              </h5>
              <p className="mb-2 text-gray-700">{book.author}</p>
              <p className="text-sm text-gray-500 line-clamp-5">
                {book.description}
              </p>
              <h5 className="absolute bottom-1 mr-1 text-lg font-semibold self-end text-orange-600">
                {book.price} BDT
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostList;
