export const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '';
export const UPLOADS_URL = `${BACKEND_URL}/uploads`;
