import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import SignUp from '../components/authentication/SignUp';

jest.mock('../store/signup-slice', () => ({
    signUp: jest.fn(),
}));

const mockStore = configureStore([]);

describe('SignUp Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            signup: { user: null, loading: false, error: null },
        });
    });
    test('displays error message from the backend', async () => {
        store = mockStore({
            signup: { user: null, loading: false, error: { error: { message: 'Email already in use' } } },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Email already in use/i)).toBeInTheDocument();
        });
    });

    test('displays loading indicator during form submission', async () => {
        store = mockStore({
            signup: { user: null, loading: true, error: null },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Signing Up.../i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });
    test('renders without crashing', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getAllByText(/Sign Up/i)).toHaveLength(2);
    });

    test('renders the SignUp component', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });
    test('displays error when passwords do not match', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        const passwordInput = screen.getByTestId('password-input');
        const confirmPasswordInput = screen.getByTestId('confirm-password-input');
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        userEvent.type(emailInput, 'test@example.com');
        userEvent.type(passwordInput, 'password123');
        userEvent.type(confirmPasswordInput, 'differentPassword');
        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });
    });
});