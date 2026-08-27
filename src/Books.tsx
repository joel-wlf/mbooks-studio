import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import BookDrawer from "./BookDrawer";
import DataTable from "./DataTable";
import type { Features } from "./DataTable";
import PageHeader from "./PageHeader";
import RowActions from "./RowActions";
import TableToolbar from "./TableToolbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Book, Library, Shelf } from "./types";

type BooksProps = {
  books: Book[];
  shelfs: Shelf[];
  libraries: Library[];
  onCreate: (book: Omit<Book, "id">) => void;
  onUpdate: (book: Book) => void;
  onDelete: (id: string) => void;
};

function Books({
  books,
  shelfs,
  libraries,
  onCreate,
  onUpdate,
  onDelete,
}: BooksProps) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  const handleEdit = (book: Book) => {
    setEditing(book);
    setDrawerOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const handleSubmit = (data: Omit<Book, "id">) => {
    if (editing) onUpdate({ ...data, id: editing.id });
    else onCreate(data);
  };

  const visibleBooks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return books;

    return books.filter((book) =>
      [book.title, book.author, book.isbn].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  }, [books, query]);

  //shelf name is looked up per row, so the columns depend on the current shelfs
  const columns = useMemo<ColumnDef<Features, Book, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Titel",
        cell: ({ row }) => (
          <span className='font-medium'>{row.original.title}</span>
        ),
      },
      {
        accessorKey: "author",
        header: "Autor",
      },
      {
        accessorKey: "isbn",
        header: "ISBN",
        cell: ({ row }) => (
          <span className='text-muted-foreground tabular-nums'>
            {row.original.isbn}
          </span>
        ),
      },
      {
        accessorKey: "year",
        header: "Jahr",
        cell: ({ row }) => (
          <span className='tabular-nums'>{row.original.year}</span>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Anzahl",
        cell: ({ row }) => (
          <span className='tabular-nums'>{row.original.quantity}</span>
        ),
      },
      {
        id: "shelf",
        header: "Regal",
        cell: ({ row }) => (
          <span className='text-muted-foreground'>
            {shelfs.find((shelf) => shelf.id === row.original.shelfId)?.name ??
              "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <RowActions
            onEdit={() => handleEdit(row.original)}
            onDelete={() => onDelete(row.original.id)}
            confirmMessage={`„${row.original.title}“ wirklich löschen?`}
          />
        ),
      },
    ],
    [shelfs, onDelete],
  );

  return (
    <div className='flex flex-col gap-6'>
      <PageHeader
        title='Bücher'
        subtitle={`${books.length} ${books.length === 1 ? "Buch" : "Bücher"} in ${shelfs.length} Regalen`}
      />

      <div className='flex flex-col gap-3'>
        <TableToolbar
          value={search}
          onChange={setSearch}
          onSubmit={() => setQuery(search)}
          placeholder='Titel, Autor oder ISBN …'
        >
          <Button onClick={handleNew}>
            <Plus />
            Neu
          </Button>
        </TableToolbar>

        <DataTable
          columns={columns}
          data={visibleBooks}
          emptyMessage={query ? "Keine Treffer." : "Keine Bücher vorhanden."}
        />
      </div>

      <BookDrawer
        shelfs={shelfs}
        libraries={libraries}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        book={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Books;
