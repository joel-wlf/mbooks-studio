export type Library = { id: string; name: string };

export type Shelf = { id: string; organisationId: string; name: string };

export type Book = {
  id: string;
  shelfId: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  quantity: number;
};

export type Page = "books" | "shelves" | "libraries";
