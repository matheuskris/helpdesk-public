import { Procedure } from "./Procedure";

export enum CallStatus {
	OPEN = 'OPEN',
	CLOSED = 'CLOSED'
}

export interface Call {
	id?: number;
	callUserRef?: string;
	client?: string;
	description?: string;
	inCharge?: string;
	startedAt?: string;
	endedAt?: string;
	status?: CallStatus;

	procedures?: Procedure[];
}