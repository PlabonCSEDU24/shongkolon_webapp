'use client';
import categories from '@/constants/categories';
import { BACKEND_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  bookName: string;
  author: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  price: number;
  photos: File[];
}

const defaultForm = {
  bookName: '',
  author: '',
  category: categories[0].name,
  description: '',
  address: '',
  phone: '',
  price: 0,
  photos: [],
};

const page = () => {
  const { authToken } = useAuth();
  const [form, setForm] = useState<FormData>(defaultForm);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm(prevData => ({
        ...prevData,
        photos: files,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('bookName', form.bookName);
    formDataToSend.append('author', form.author);
    formDataToSend.append('price', form.price.toString());
    formDataToSend.append('category', form.category);
    formDataToSend.append('description', form.description);
    formDataToSend.append(
      'contactInfo',
      JSON.stringify({ address: form.address, phone: form.phone, geoCode: '' }), // Assuming geoCode is not included in the form
    );
    if (form.photos) {
      for (const photo of form.photos) {
        formDataToSend.append('photos', photo);
      }
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/posts/`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log('Response:', response.data);
      setForm(defaultForm);
      alert('post created');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="mx-auto max-w-7xl p-8 pb-16">
      <h2 className="font-semibold">Create post</h2>
      <form
        className="relative max-w-md mx-auto bg-white shadow-lg p-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            htmlFor="bookName"
            className="block text-sm font-medium text-gray-700"
          >
            Book Name
          </label>
          <input
            type="text"
            id="bookName"
            name="bookName"
            value={form.bookName}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="photos"
            className="block text-sm font-medium text-gray-700"
          >
            Photos
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 absolute right-0 bottom-0 m-6  bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default page;
