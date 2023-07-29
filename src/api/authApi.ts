import api from '.';
import { Project } from '../models/Project';

const AuthenticationApi = () => {
	const signup = (username: string, email: string, password: string ) => {
		return api.post<string>('/auth/signup', { name: username, email, password });
	}

	const signIn = (email: string, password: string) => {
		return api.post<string>('/auth/signin', { email, password });
	}

	const getMe = () => {
		return api.get<{
			id: number;
			name: string;
			email: string;
			projects: Project[];
		}>('/auth/me');
	}

	return {
		signup,
		signIn,
		getMe
	}
}

export default AuthenticationApi();