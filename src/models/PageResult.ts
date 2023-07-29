export interface PageResult<T> {
	data: T[];
	meta: {
		total: number;
		currentPage: number;
		perPage: number;
	}
};