import api from ".";
import { Call } from "../models/Callt";
import { PageResult } from "../models/PageResult";
import { Project } from "../models/Project";

const ProjectApi = () => {
	const createNewProject = (name: string) => {
		return api.post<Project>("/project", { name });
	}

	const getProjectById = (id: number) => {
		return api.get<Project>(`/project/${id}`);
	}

	const getCalls = (projectId: number, ) => {
		return api.get<PageResult<Call>>(`/project/${projectId}/calls`);
	}

	const createCall = (projectId: number, call: Call) => {
		return api.post<Call>(`/project/${projectId}/call`, call);
	}

	const updateCall = (projectId: number, call: Call) => {
		return api.put<Call>(`/project/${projectId}/call/${call.id}`, call);
	}

	return {
		createNewProject,
		getProjectById,
		getCalls,
		createCall,
		updateCall,
	}
}

export default ProjectApi();
