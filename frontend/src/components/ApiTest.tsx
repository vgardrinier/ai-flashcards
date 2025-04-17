import React, { useEffect, useState } from 'react';
import { userAPI, quizAPI } from '../api';
import { eloAPI } from '../api/eloAPI';
import { ApiError } from '../types/api';

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing API connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        // Test user API
        const userResponse = await userAPI.getCurrentUser();
        console.log('User API response:', userResponse);

        // Test quiz API
        const quizResponse = await quizAPI.getAll();
        console.log('Quiz API response:', quizResponse);

        // Test ELO API
        const eloResponse = await eloAPI.getLevels();
        console.log('ELO API response:', eloResponse);

        setStatus('API connection successful!');
      } catch (err) {
        const apiError = err as ApiError;
        setError(`API Error: ${apiError.message}`);
        console.error('API Error:', apiError);
      }
    };

    testApiConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>API Connection Test</h2>
      <div style={{ 
        padding: '15px', 
        margin: '10px 0', 
        backgroundColor: error ? '#ffebee' : '#e8f5e9',
        borderRadius: '4px'
      }}>
        <p style={{ margin: '0' }}>{status}</p>
        {error && (
          <p style={{ 
            color: '#c62828', 
            margin: '10px 0 0 0',
            fontSize: '14px'
          }}>
            {error}
          </p>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Make sure the Rails backend is running on port 3001</li>
          <li>Check the browser console for detailed API responses</li>
          <li>If you see errors, verify CORS is properly configured</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiTest; 