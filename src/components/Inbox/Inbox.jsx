import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../store/getData-slice';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const truncateContent = (content, maxLength) => {
  return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
};

const Inbox = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.items);
  const status = useSelector((state) => state.data.status);
  const error = useSelector((state) => state.data.error);

  const handleRead = async (messageId) => {
    const updatedMessages = Object.values(data).map(message => {
      if (message.id === messageId) {
        return { ...message, read: true };
      }
      return message;
    });
    try {
      const mailId = localStorage.getItem('mailId').split(/[.@]/).join("");
      const response = await axios.put(`https://mail-box-client-7-default-rtdb.firebaseio.com/${mailId}.json`, updatedMessages);

      console.log('Data updated successfully', response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  const deleteMailHandler = async (messageId) => {
    const updatedMessages = Object.values(data).filter((message) => message.id !== messageId);
    try {
      const mailId = localStorage.getItem('mailId').split(/[.@]/).join("");
      const response = await axios.put(`https://mail-box-client-7-default-rtdb.firebaseio.com/${mailId}.json`, updatedMessages);

      console.log('Data updated successfully', response.data);
      dispatch(fetchData());
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchData());
    }, 2000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  let content;

  if (status === 'loading') {
    content = <div>Loading...</div>;
  } else if (status === 'succeeded') {
    if (data.length === 0) {
      content = <div>No data found</div>;
    } else {
      content = Object.values(data).map((item) => (
        <div className="col" key={item.id}>
          <div className="card border-dark p-4 rounded bg-light" style={{ boxShadow: '0px 0px 5px 0px black', position: 'relative' }}>
            <NavLink to={`/inbox/${item.id}`} className="text-decoration-none text-dark" style={{ width: '80%' }} onClick={() => handleRead(item.id)}>
              <div className="card-body">
                <h5 className="card-title">
                  {!item.read && <FontAwesomeIcon icon={faCircle} style={{ color: 'green', fontSize: '10px', marginRight: '8px' }} />}
                  From:{' '}{item.from}
                </h5>
                <p className="card-text">Subject:{' '}{item.subject}</p>
                <p className="card-text">Content:{' '}{truncateContent(item.content.blocks[0].text, 100)}</p>
              </div>
            </NavLink>
            <button className="btn btn-danger position-absolute" style={{ top: '50%', right: '20px', transform: 'translateY(-50%)', width: 'auto' }} onClick={() => deleteMailHandler(item.id)}>Delete</button>
          </div>
        </div>
      ));
    }
  } else if (status === 'failed') {
    content = <div>{error}</div>;
  }
  return (
    <div className="container mt-5">
      <div className="row row-cols-1 gy-3" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
        {content}
      </div>
    </div>
  );
}

export default Inbox;
