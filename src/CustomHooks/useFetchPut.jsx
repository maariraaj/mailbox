import { useState, useEffect } from 'react';

const useFetchPut = (url, data) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        setResponse(responseData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [url, data]);

  return { response, error };
};

export default useFetchPut;
