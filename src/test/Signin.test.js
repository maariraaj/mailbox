import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import SignIn from '../components/authentication/Signin';
import { signIn } from '../store/signin-slice';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../store/signin-slice');

const mockStore = configureStore();
const initialStore = {
    signin: { user: null, loading: false, error: null },
};

describe('SignIn Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialStore);
    });

    test('displays error message when sign in fails', async () => {
        store = mockStore({
            signin: { user: null, loading: false, error: { error: { message: 'Invalid credentials' } } },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignIn />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    test('displays loading state during sign in', () => {
        store = mockStore({
            signin: { user: null, loading: true, error: null },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignIn />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Signing In.../i)).toBeInTheDocument();
    });

    test('renders SignIn component', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignIn />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getAllByText(/Sign In/i)).toHaveLength(2);
        expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    });

    test('dispatches signIn action on form submission', async () => {
        signIn.mockReturnValue({ type: 'auth/signIn/pending' });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignIn />
                </MemoryRouter>
            </Provider>
        );

        const emailInput = screen.getByPlaceholderText(/Enter email/i);
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        const signInButton = screen.getByRole('button', { name: /Sign In/i });

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(passwordInput, { target: { value: '1234567' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith({ email: 'test@test.com', password: '1234567' });
        });
    });
    test('email and password fields are initially empty', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignIn />
                </MemoryRouter>
            </Provider>
        );

        const emailInput = screen.getByPlaceholderText(/Enter email/i);
        const passwordInput = screen.getByPlaceholderText(/Password/i);

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
    });
});