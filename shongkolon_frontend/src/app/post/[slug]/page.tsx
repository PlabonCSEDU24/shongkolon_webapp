'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '@/constants/config';
import { Comment, Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import moment from 'moment';

type Props = {};

const PostDetail = (props: Props) => {
  const { slug } = useParams();
  const [comments, setComments] = useState<Comment[]>();
  const [myComment, setMyComment] = useState('');
  const [post, setPost] = useState<Post>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { authToken } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/posts/${slug}/comments/`,
      );
      setComments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const makeComment = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/posts/${slug}/comments`,
        {
          comment: myComment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      setComments(response.data.comments);
      setMyComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const goToPrevSlide = () => {
    if (post?.photos) {
      setCurrentIndex(prevIndex =>
        prevIndex === 0 ? post.photos.length - 1 : prevIndex - 1,
      );
    }
  };

  const goToNextSlide = () => {
    if (post?.photos) {
      setCurrentIndex(prevIndex =>
        prevIndex === post.photos.length - 1 ? 0 : prevIndex + 1,
      );
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/posts/${slug}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
    fetchComments();
  }, [slug]);
  return (
    <section className="mx-auto max-w-7xl p-8 pb-16 h-screen">
      <div className="flex md:flex-row flex-col gap-6">
        <div className="relative flex flex-1 md:w-1/2">
          <div className="relative bg-slate-600 w-full h-96 overflow-hidden rounded-lg ">
            <div className="duration-700 ease-in-out">
              {post?.photos.map((image, index) => (
                <img
                  key={index}
                  src={`${BACKEND_URL}/api/contents/images/${image.fileName}`}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              ))}

              {post?.photos.map((image, index) => (
                <img
                  key={index}
                  src={`${BACKEND_URL}/api/contents/images/${image.fileName}`}
                  className={`absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  } `}
                  alt="..."
                />
              ))}
            </div>
          </div>

          <button
            onClick={goToPrevSlide}
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>

          <button
            onClick={goToNextSlide}
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
        <div className="flex flex-col flex-1">
          <h5 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-1">
            {post?.bookName}
          </h5>
          <p className="mb-2 text-gray-700">{post?.author}</p>
          <p className=" mb-2 text-sm text-gray-500 ">{post?.description}</p>
          <h5 className="mr-1 text-lg font-semibold text-orange-600">
            {post?.price} BDT
          </h5>
          <div className="mt-4 font-bold">Seller Details</div>
          <div className="mt-2 bg-white p-3 rounded-md border border-gray-300">
            <h6 className="font-semibold">Sakib Hasan</h6>
            <p>{post?.contactInfo.address}</p>
            <p>{post?.contactInfo.phone}</p>
          </div>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="border-b mb-4">comments</div>
        {comments?.map(comment => (
          <div key={comment._id} className="mb-4 flex items-start">
            <div className="mr-2">
              <i className="fas fa-user"></i>
            </div>
            <div className="flex-1">
              <div className="font-bold">{comment.userName}</div>
              <div>{comment.comment}</div>
              <div className="text-gray-500 text-sm">
                {moment(comment.createdAt).fromNow()}
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center mt-4">
          <textarea
            value={myComment}
            onChange={e => setMyComment(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Write Comment..."
          ></textarea>

          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded"
            onClick={makeComment}
          >
            send
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
