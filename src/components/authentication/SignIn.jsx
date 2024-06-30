import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../../store/signin-slice';
import { fetchData } from '../../store/getData-slice';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.signin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(signIn({ email, password }));
    if (signIn.fulfilled.match(result)) {
      dispatch(fetchData());
      navigate('/');
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card p-4 border-primary" style={{ width: '600px', boxShadow: '0 4px 30px rgba(0, 0, 255, 0.5)' }}>
        <h3 className="card-title text-center">Sign In</h3>
        {error && <div className="alert alert-danger">{error.error.message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/signup">Don't have an account? Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
