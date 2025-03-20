import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv';

const useBlogs = (
  page,
  selectedTags = [],
  searchQuery = '',
  enabled = true
) => {
  const [blogs, setBlogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('fetcing teh blogs', enabled);

    if (!enabled) return;
    console.log('fetcing teh blogs');
    const fetchBlogs = async () => {
      const apiUrl = getenv('APIURL');
      const blogLimit = getenv('BLOGSLIMIT');

      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/blog/getall`, {
          params: {
            tags: selectedTags.join(','),
            query: searchQuery,
            page,
            limit: blogLimit,
          },
        });
        setBlogs(response.data.blogs);
        setTotalCount(response.data.pagination.totalCount);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        setError('Error fetching blogs');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, selectedTags, searchQuery, enabled]); // Depend on page, selectedTags, and searchQuery

  return { blogs, totalCount, totalPages, loading, error };
};

export default useBlogs;
