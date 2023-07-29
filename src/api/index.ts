import axios from 'axios'

const createApiInstance = () => {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		timeout: 10000,
	})

	instance.interceptors.request.use(async config => {
		const token = localStorage.getItem('jhi-authenticationToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});
	
	return instance
}

export default createApiInstance();