import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv';
import { toaster } from '../components/ui/index';

const useAdminBlogs = (
  currentPage,
  selectedTags,
  query = '',
  isAuthorized = false
) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const baseUrl = getenv('APIURL');

  useEffect(() => {
    const fetchBlogs = async () => {
      // If not authorized, don't fetch
      if (!isAuthorized) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Construct URL with query parameters
        let url = `${baseUrl}/blog/getallForadmin?page=${currentPage}&limit=10`;

        if (query) {
          url += `&query=${encodeURIComponent(query)}`;
        }

        if (selectedTags && selectedTags.length > 0) {
          url += `&tags=${encodeURIComponent(selectedTags.join(','))}`;
        }

        // Make the API request with auth token
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('p73SessionData')}`,
          },
        });

        // Update state with the fetched data
        setBlogs(response.data.blogs);
        setTotalCount(response.data.pagination.totalCount);
        setTotalPages(response.data.pagination.totalPages);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error);
        toaster.create({
          title: 'Error fetching blogs',
          description: error.response?.data?.error || error.message,
          type: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [baseUrl, currentPage, selectedTags, query, isAuthorized]);

  return { blogs, loading, error, totalCount, totalPages };
};

export default useAdminBlogs;
