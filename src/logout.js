import React from 'react';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from './reducer';
function Logout() {
  const api = useSelector(selectapi);
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${api}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`, // Replace with the actual access token
        },
      });

     
      // Handle successful logout
    } catch (error) {
      
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
