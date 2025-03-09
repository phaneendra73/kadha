import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv'; // Utility to get environment variables

const useSearch = (page, searchQuery = '') => {
  const [blogs, setBlogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const apiUrl = getenv('APIURL'); // Fetch API URL from environment variable
      const blogLimit = getenv('BLOGSLIMIT'); // Fetch limit for blogs per page from environment variable

      try {
        setLoading(true); // Set loading to true before making the request
        const response = await axios.get(`${apiUrl}/blog/getall`, {
          params: {
            query: searchQuery, // Search query
            page, // Current page
            limit: blogLimit,
          },
        });

        const { blogs: fetchedBlogs, pagination } = response.data;

        // If it's the first page, overwrite the blogs, otherwise append new blogs
        setBlogs((prevBlogs) =>
          page === 1 ? fetchedBlogs : [...prevBlogs, ...fetchedBlogs]
        );
        setTotalCount(pagination.totalCount); // Set total blog count
        setTotalPages(pagination.totalPages); // Set total pages count
      } catch (err) {
        setError('Error fetching blogs'); // Handle error
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false); // Set loading to false once the request is completed
      }
    };

    fetchBlogs(); // Call the fetch function when dependencies change
  }, [page, searchQuery]);

  return { blogs, totalCount, totalPages, loading, error };
};

export default useSearch;
