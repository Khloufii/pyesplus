import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';
const VisitorList = () => {
  const api = useSelector(selectapi);
  const [visitors, setVisitors] = useState([]);
  const [nbvisit, setnbvisit] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get(`${api}/api/getvisiteur`);
        setVisitors(response.data.visitors);
        setnbvisit(response.data.total_visitors)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visitors:', error);
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const handleDeleteAllVisitors = async () => {
    try {
      await axios.delete(`${api}/api/deletevisiteurs`);
      setVisitors([]); // Effacer la liste des visiteurs localement
      setnbvisit(0); // Mettre à jour le nombre de visiteurs
    } catch (error) {
      console.error('Error deleting visitors:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='user-orders-containerrs'>
      <h2>
        Visitor List <span>{nbvisit}</span>
        <button onClick={handleDeleteAllVisitors}>Supprimer tous les visiteurs</button>
      </h2>
      <table border="1" className='orders-list'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date Visite</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map(visitor => (
            <tr key={visitor.id}>
              <td>{visitor.id}</td>
              <td>{visitor.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorList;
