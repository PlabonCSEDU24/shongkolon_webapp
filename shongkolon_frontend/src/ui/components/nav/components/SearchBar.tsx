'use client';
import { redirect, useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants/config';
import axios from 'axios';
import { Post } from '@/types';

export const SearchBar = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Post[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchText.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/posts/?limit=20&bookName=${searchText}&queryType=loose`,
        );

        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [searchText]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: Post) => {
    setShowSuggestions(false);
    setSearchText('');
    router.push(`post/${suggestion._id}`);
  };

  return (
    <div className="relative my-2 flex w-full lg:w-80">
      <form className="group relative my-2 flex w-full items-center justify-items-center text-sm lg:w-80">
        <label className="w-full">
          <span className="sr-only">search for products</span>
          <input
            value={searchText}
            onChange={handleInputChange}
            type="text"
            name="search"
            placeholder="Search for products..."
            autoComplete="off"
            required
            className="h-10 w-full rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
          />
        </label>
        <div className="absolute inset-y-0 right-0">
          <button
            type="submit"
            className="inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 group-invalid:pointer-events-none group-invalid:opacity-80"
          >
            <span className="sr-only">search</span>
            <SearchIcon aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-16 shadow-xl max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white text-black">
          {suggestions.map(suggestion => (
            <li
              key={suggestion._id}
              className="flex flex-row gap-2 items-center cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.photos.length > 0 && (
                <img
                  className="object-cover w-8 h-8 rounded-sm"
                  src={`${BACKEND_URL}/api/contents/images/${suggestion.photos[0].fileName}`}
                  alt=""
                />
              )}
              <div>
                <h3 className="font-semibold text-sm">{suggestion.bookName}</h3>
                <h3 className="text-sm">{suggestion.author}</h3>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
