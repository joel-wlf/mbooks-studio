import { useEffect, useState } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebar from "./AppSidebar";
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

  return (
    <SidebarProvider>
      <AppSidebar page={page} setPage={setPage} />

      <SidebarInset>
        <header className='flex h-14 items-center gap-2 border-b px-4'>
          <SidebarTrigger />
        </header>

        <div className='p-6'>
          {/* TODO: Books / Shelves / Libraries components */}
          {page === "books" && <p>{books.length} Bücher</p>}
          {page === "shelves" && <p>{shelfs.length} Regale</p>}
          {page === "libraries" && <p>{libraries.length} Bibliotheken</p>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
