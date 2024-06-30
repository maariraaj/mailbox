import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getSentData } from '../../store/getSentData-slice';

const SentMailPage = () => {
  const dispatch = useDispatch();
  const sentData = useSelector((state) => state.getSentData.sentItems);
  const status = useSelector((state) => state.getSentData.status);
  const error = useSelector((state) => state.getSentData.error);

  const params = useParams();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getSentData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(getSentData());
  }, []);

  let data = [];
  if (sentData.length > 0) {
    Object.values(sentData[0]).forEach((item) => {
      let temp = Object.values(item);
      data = data.concat(temp);
    })
  }

  let content;

  if (status === 'loading') {
    content = <div>Loading...</div>;
  } else if (status === 'succeeded') {
    if (data.length === 0) {
      content = <div>No data found</div>;
    } else {
      const mailId = localStorage.getItem('mailId').split(/[.@]/).join("");
      content = data.map((item) => {
        if (item.from.split(/[.@]/).join("") === mailId && item.id === params.sentMailId) {
          return (
            <div className="col" key={item.id}>
              <div className="card border-dark p-4 rounded bg-light" style={{ boxShadow: '0px 0px 5px 0px black', position: 'relative' }}>
                <NavLink to={`/sent/${item.id}`} className="text-decoration-none text-dark" >
                  <div className="card-body">
                    <h4 className="card-title">To:{' '}{item.to}</h4>
                    <h5 className="card-text">Subject:{' '}{item.subject}</h5>
                    <p className="card-text">Content:{' '}{item.content.blocks[0].text}</p>
                  </div>
                </NavLink>
              </div>
            </div>
          )
        }
      });
    }
  } else if (status === 'failed') {
    content = <div>{error}</div>;
  }
  return (
    <div className="container mt-5">
      <div className="row row-cols-1 gy-3" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
        <div className="col">
          <div className="card border-dark p-4 rounded bg-light" style={{ boxShadow: '0px 0px 5px 0px black' }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentMailPage;