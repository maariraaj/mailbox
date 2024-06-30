import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import Inbox from '../components/Inbox/Inbox';
import { fetchData } from '../store/getData-slice';

const mockStore = {
    getState: () => ({
        data: {
            status: 'loading',
        },
    }),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
};

jest.mock('../store/getData-slice', () => ({
    fetchData: jest.fn(),
}));

describe('Inbox component tests', () => {
    test('renders loading state correctly', () => {
        const { getByText } = render(
            <Provider store={mockStore}>
                <Inbox />
            </Provider>
        );

        expect(getByText('Loading...')).toBeInTheDocument();
    });

    test('renders error state correctly', () => {
        const mockError = 'An error occurred';
        const store = {
            ...mockStore,
            getState: () => ({
                data: {
                    status: 'failed',
                    error: mockError,
                },
            }),
        };

        const { getByText } = render(
            <Provider store={store}>
                <Inbox />
            </Provider>
        );

        expect(getByText(mockError)).toBeInTheDocument();
    });

    test('dispatches fetchData action on component mount', () => {
        render(
            <Provider store={mockStore}>
                <Inbox />
            </Provider>
        );

        expect(fetchData).toHaveBeenCalled();
    });

    test('renders error message when data fetching fails', () => {
        const mockErrorMessage = 'Failed to fetch data';
        const store = {
            ...mockStore,
            getState: () => ({
                data: {
                    status: 'failed',
                    error: mockErrorMessage,
                },
            }),
        };

        const { getByText } = render(
            <Provider store={store}>
                <Inbox />
            </Provider>
        );

        expect(getByText(mockErrorMessage)).toBeInTheDocument();
    });
});


