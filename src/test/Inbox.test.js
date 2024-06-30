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

    test('renders inbox items correctly when status is succeeded', () => {
        const mockData = [
            {
                id: 1,
                from: 'sender@example.com',
                subject: 'Test Subject 1',
                content: {
                    blocks: [{ text: 'Test content 1' }],
                },
            },
            {
                id: 2,
                from: 'sender@example.com',
                subject: 'Test Subject 2',
                content: {
                    blocks: [{ text: 'Test content 2' }],
                },
            },
        ];

        const store = {
            ...mockStore,
            getState: () => ({
                data: {
                    status: 'succeeded',
                    items: mockData,
                },
            }),
        };

        const { getAllByText, getByText } = render(
            <Provider store={store}>
                <Inbox />
            </Provider>
        );

        const fromElements = getAllByText(/From: sender@example.com/i);
        expect(fromElements).toHaveLength(2);

        mockData.forEach((item, index) => {
            expect(fromElements[index]).toBeInTheDocument();
            expect(getByText(`Subject: ${item.subject}`)).toBeInTheDocument();
            expect(getByText(`Content: ${item.content.blocks[0].text}`)).toBeInTheDocument();
        });
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


