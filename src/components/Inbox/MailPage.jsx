import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../store/getData-slice';
import { useParams } from 'react-router-dom';

const MailPage = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.data.items);
    const status = useSelector((state) => state.data.status);
    const error = useSelector((state) => state.data.error);

    const params = useParams();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchData());
        }
    }, [status, dispatch]);

    useEffect(() => {
        dispatch(fetchData());
    }, []);

    let mail;

    if (status === 'loading') {
        mail = <div>Loading...</div>;
    } else if (status === 'succeeded') {
        if (data.length === 0) {
            mail = <div>No data found</div>;
        }
        else {
            const mailItem = Object.values(data).filter((item) => params.mailId === item.id);
            mail = (<div className="col" key={mailItem[0].id}>
                <div className="card border-dark p-4 rounded bg-light" style={{ boxShadow: '0px 0px 5px 0px black' }}>
                    <div className="card-body">
                        <h4 className="card-title">From:{' '}{mailItem[0].from}</h4>
                        <h5 className="card-text">Subject:{' '}{mailItem[0].subject}</h5>
                        <p className="card-text">Content:{' '}{mailItem[0].content.blocks[0].text}</p>
                    </div>
                </div>
            </div>)
        }
    } else if (status === 'failed') {
        mail = <div>{error}</div>;
    }
    return (
        <div className="container mt-5">
            <div className="row row-cols-1 gy-3" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                <div className="col">
                    <div className="card border-dark p-4 rounded bg-light" style={{ boxShadow: '0px 0px 5px 0px black' }}>
                        {mail}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MailPage;