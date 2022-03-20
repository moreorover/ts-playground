export type Book = {
  id: string;
  url: string;
  img: string;
  title: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  tasksCount: number;
  taskIds: number[];
  tasks?: Task[];
};

export type Task = {
  sequence: number;
  img: string;
  url: string;
};

export type Year = {
  title: number;
  books: Book[];
};

export type Topic = {
  topic: string;
  years: Year[];
};
