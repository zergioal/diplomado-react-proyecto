export interface Task {
  id: number;
  name: string;
  done: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  total: number;
  page: number;
  pages: number;
  data: Task[];
}
