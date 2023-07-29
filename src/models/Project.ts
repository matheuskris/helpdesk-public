import { Call } from "./Callt";

export interface Project {
    id: number;
    name: string;
    calls?: Call[];
    users?: number;
}