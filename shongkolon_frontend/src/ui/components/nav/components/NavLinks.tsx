'use client';
import { useState } from 'react';
import { NavLink } from './NavLink';
import categories from '@/constants/categories';

export const NavLinks = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <NavLink href="/listings">All</NavLink>
      <li className="inline-flex">
        <button
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          id="menu-button"
          className="text-neutral-500 inline-flex items-center pt-px text-sm font-medium hover:text-neutral-700"
        >
          Categories
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div
          id="menu"
          className={`absolute mt-12 ${
            showMenu ? 'grid' : 'hidden'
          } z-10 w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md md:grid-cols-3`}
        >
          <div className="p-4 pb-0 text-gray-900 md:pb-4">
            <ul
              className="space-y-4"
              aria-labelledby="mega-menu-icons-dropdown-button"
            >
              <li>
                <a
                  href={`category/${categories[0].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[0].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[1].link}`}
                  className="flex items-center text-gray-500  hover:text-blue-600 "
                >
                  {categories[1].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[2].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[2].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[3].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[3].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[11].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[11].name}
                </a>
              </li>
            </ul>
          </div>
          <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
            <ul className="space-y-4">
              <li>
                <a
                  href={`category/${categories[4].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[4].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[5].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[5].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[6].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[6].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[7].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[7].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[12].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[12].name}
                </a>
              </li>
            </ul>
          </div>
          <div className="p-4 text-gray-900 dark:text-white">
            <ul className="space-y-4">
              <li>
                <a
                  href={`category/${categories[9].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[9].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[10].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[10].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[13].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[13].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[14].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[14].name}
                </a>
              </li>
              <li>
                <a
                  href={`category/${categories[8].link}`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  {categories[8].name}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </li>
      <NavLink href="/saved">Saved</NavLink>
    </>
  );
};
