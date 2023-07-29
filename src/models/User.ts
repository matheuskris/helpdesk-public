import { Project } from "./Project";

export interface User {
	id: number;
	name: string;
	email: string;
	projects: Project[];
}