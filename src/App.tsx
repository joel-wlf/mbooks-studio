import { useEffect, useState } from "react";
import demoData from "./demo-data";

type Library = { id: string; name: string };
type Shelf = { id: string; organisationId: string; name: string };
type Book = {
  id: string;
  shelfId: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
};

function App() {
  const [page, setPage] = useState<"books" | "shelfs" | "organisations">(
    "books",
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [shelfs, setShelfs] = useState<Shelf[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);

  //initial load from localStorage, seeding demo data on first run
  useEffect(() => {
    const savedBooks = localStorage.getItem("books");
    const savedShelfs = localStorage.getItem("shelfs");
    const savedLibraries = localStorage.getItem("libraries");

    if (savedBooks && savedShelfs && savedLibraries) {
      setBooks(JSON.parse(savedBooks));
      setShelfs(JSON.parse(savedShelfs));
      setLibraries(JSON.parse(savedLibraries));
    } else {
      localStorage.setItem("books", JSON.stringify(demoData.books));
      localStorage.setItem("shelfs", JSON.stringify(demoData.shelves));
      localStorage.setItem("libraries", JSON.stringify(demoData.libraries));

      setBooks(demoData.books);
      setShelfs(demoData.shelves);
      setLibraries(demoData.libraries);
    }
  }, []);

  return (
    <>
      <h1>Mittwald Buch Management</h1>
      <nav>
        <button onClick={() => setPage("books")}>Bücher</button>
        <button onClick={() => setPage("shelfs")}>Regale</button>
        <button onClick={() => setPage("organisations")}>Bibliotheken</button>
      </nav>
      {page === "books" && (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} — {book.author} ({book.year})
            </li>
          ))}
        </ul>
      )}
      {page === "shelfs" && (
        <ul>
          {shelfs.map((shelf) => (
            <li key={shelf.id}>{shelf.name}</li>
          ))}
        </ul>
      )}
      {page === "organisations" && (
        <ul>
          {libraries.map((library) => (
            <li key={library.id}>{library.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
