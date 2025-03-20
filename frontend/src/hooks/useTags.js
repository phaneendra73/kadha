// src/hooks/useTags.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv';

const useTags = (enabled = true) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (!enabled) return;
    fetchTags();
  }, [enabled]);

  return { tags, loading, error, refetch: fetchTags };
};

export default useTags;
