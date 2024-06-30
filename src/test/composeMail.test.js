import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import composeReducer from '../store/compose-slice';
import ComposeMail from '../components/ComposeMail/ComposeMail';
import { BrowserRouter as Router } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const renderComponent = () => {
  const store = configureStore({
    reducer: {
      compose: composeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['compose.editorState'],
          ignoredActions: ['compose/setEditorState'],
          ignoredActionPaths: ['meta.arg.editorState', 'payload.editorState'],
        },
      }),
  });

  render(
    <Provider store={store}>
      <Router>
        <ComposeMail />
      </Router>
    </Provider>
  );
};

describe('ComposeMail', () => {
  test('renders compose mail form', () => {
    renderComponent();
    expect(screen.getByText(/compose mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject:/i)).toBeInTheDocument();
  });

  test('handles input change for "To" field', () => {
    renderComponent();
    const toInput = screen.getByLabelText(/to:/i);
    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    expect(toInput.value).toBe('test@example.com');
  });

  test('handles input change for "Subject" field', () => {
    renderComponent();
    const subjectInput = screen.getByLabelText(/subject:/i);
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    expect(subjectInput.value).toBe('Test Subject');
  });

  test('sends mail', async () => {
    renderComponent();
    const toInput = screen.getByLabelText(/to:/i);
    const subjectInput = screen.getByLabelText(/subject:/i);
    const sendButton = screen.getByText(/send/i);

    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });

    fireEvent.click(sendButton);

    await waitFor(() => expect(sendButton).toHaveTextContent(/sending/i));

    await waitFor(() => {
      expect(sendButton).toHaveTextContent(/send/i);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('cancels mail', () => {
    renderComponent();
    const toInput = screen.getByLabelText(/to:/i);
    const subjectInput = screen.getByLabelText(/subject:/i);
    const cancelButton = screen.getByText(/cancel/i);

    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });

    fireEvent.click(cancelButton);

    expect(toInput.value).toBe('');
    expect(subjectInput.value).toBe('');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });
});