import { useEffect, useState } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebar from "./AppSidebar";
import Books from "./Books";
import Libraries from "./Libraries";
import Shelves from "./Shelves";
import demoData from "./demo-data";
import type { Book, Library, Page, Shelf } from "./types";

function App() {
  const [page, setPage] = useState<Page>("books");

  const [books, setBooks] = useState<Book[]>([]);
  const [shelfs, setShelfs] = useState<Shelf[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);

  //initial load from localStorage, seeding demo data on first run
  useEffect(() => {
    const savedBooks: Book[] = JSON.parse(
      localStorage.getItem("books") ?? "[]",
    );
    const savedShelfs: Shelf[] = JSON.parse(
      localStorage.getItem("shelves") ?? "[]",
    );
    const savedLibraries: Library[] = JSON.parse(
      localStorage.getItem("libraries") ?? "[]",
    );

    if (savedBooks.length && savedShelfs.length && savedLibraries.length) {
      setBooks(savedBooks);
      setShelfs(savedShelfs);
      setLibraries(savedLibraries);
    } else {
      localStorage.setItem("books", JSON.stringify(demoData.books));
      localStorage.setItem("shelves", JSON.stringify(demoData.shelves));
      localStorage.setItem("libraries", JSON.stringify(demoData.libraries));

      setBooks(demoData.books);
      setShelfs(demoData.shelves);
      setLibraries(demoData.libraries);
    }
  }, []);

  //new entries are persisted explicitly instead of via an effect on [books, shelfs, libraries],
  //because such an effect fires on mount with the still-empty initial state and overwrites the seed
  const addBook = (book: Omit<Book, "id">) => {
    const next = [...books, { ...book, id: crypto.randomUUID() }];
    setBooks(next);
    localStorage.setItem("books", JSON.stringify(next));
  };

  const addShelf = (shelf: Omit<Shelf, "id">) => {
    const next = [...shelfs, { ...shelf, id: crypto.randomUUID() }];
    setShelfs(next);
    localStorage.setItem("shelves", JSON.stringify(next));
  };

  const addLibrary = (library: Omit<Library, "id">) => {
    const next = [...libraries, { ...library, id: crypto.randomUUID() }];
    setLibraries(next);
    localStorage.setItem("libraries", JSON.stringify(next));
  };

  const updateBook = (book: Book) => {
    const next = books.map((entry) => (entry.id === book.id ? book : entry));
    setBooks(next);
    localStorage.setItem("books", JSON.stringify(next));
  };

  const updateShelf = (shelf: Shelf) => {
    const next = shelfs.map((entry) => (entry.id === shelf.id ? shelf : entry));
    setShelfs(next);
    localStorage.setItem("shelves", JSON.stringify(next));
  };

  const updateLibrary = (library: Library) => {
    const next = libraries.map((entry) =>
      entry.id === library.id ? library : entry,
    );
    setLibraries(next);
    localStorage.setItem("libraries", JSON.stringify(next));
  };

  const deleteBook = (id: string) => {
    const next = books.filter((entry) => entry.id !== id);
    setBooks(next);
    localStorage.setItem("books", JSON.stringify(next));
  };

  //books of the deleted shelf would be orphaned, so they go with it
  const deleteShelf = (id: string) => {
    const nextShelfs = shelfs.filter((entry) => entry.id !== id);
    const nextBooks = books.filter((book) => book.shelfId !== id);

    setShelfs(nextShelfs);
    setBooks(nextBooks);
    localStorage.setItem("shelves", JSON.stringify(nextShelfs));
    localStorage.setItem("books", JSON.stringify(nextBooks));
  };

  //same one level up: shelves of the library and their books
  const deleteLibrary = (id: string) => {
    const removedShelfIds = shelfs
      .filter((shelf) => shelf.organisationId === id)
      .map((shelf) => shelf.id);

    const nextLibraries = libraries.filter((entry) => entry.id !== id);
    const nextShelfs = shelfs.filter((shelf) => shelf.organisationId !== id);
    const nextBooks = books.filter(
      (book) => !removedShelfIds.includes(book.shelfId),
    );

    setLibraries(nextLibraries);
    setShelfs(nextShelfs);
    setBooks(nextBooks);
    localStorage.setItem("libraries", JSON.stringify(nextLibraries));
    localStorage.setItem("shelves", JSON.stringify(nextShelfs));
    localStorage.setItem("books", JSON.stringify(nextBooks));
  };

  return (
    <SidebarProvider>
      <AppSidebar page={page} setPage={setPage} />

      <SidebarInset>
        <header className='flex h-14 items-center gap-2 border-b px-4'>
          <SidebarTrigger />
        </header>

        <div className='p-6'>
          {page === "books" && (
            <Books
              books={books}
              shelfs={shelfs}
              onCreate={addBook}
              onUpdate={updateBook}
              onDelete={deleteBook}
            />
          )}
          {page === "shelves" && (
            <Shelves
              shelfs={shelfs}
              books={books}
              libraries={libraries}
              onCreate={addShelf}
              onUpdate={updateShelf}
              onDelete={deleteShelf}
            />
          )}
          {page === "libraries" && (
            <Libraries
              libraries={libraries}
              shelfs={shelfs}
              books={books}
              onCreate={addLibrary}
              onUpdate={updateLibrary}
              onDelete={deleteLibrary}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
