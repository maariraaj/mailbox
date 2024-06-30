// __mocks__/axios.js

const mockAxios = jest.createMockFromModule('axios');

// Mocking the post method
mockAxios.post = jest.fn(() => Promise.resolve({ data: {} }));

export default mockAxios;
