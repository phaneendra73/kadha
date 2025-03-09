// src/hooks/useTags.js
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { getenv } from '../utils/getenv';

const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true); // Start loading before the API request
      try {
        const response = await axios.get(`${getenv('APIURL')}/blog/tags`);
        setTags(response.data.tags);
      } catch (error) {
        setError('Error fetching tags');
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
};

export default useTags;
