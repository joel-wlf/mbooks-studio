import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "./DataTable";
import type { Features } from "./DataTable";
import LibraryDrawer from "./LibraryDrawer";
import PageHeader from "./PageHeader";
import RowActions from "./RowActions";
import TableToolbar from "./TableToolbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Book, Library, Shelf } from "./types";

type LibrariesProps = {
  libraries: Library[];
  shelfs: Shelf[];
  books: Book[];
  onCreate: (library: Omit<Library, "id">) => void;
  onUpdate: (library: Library) => void;
  onDelete: (id: string) => void;
};

function Libraries({
  libraries,
  shelfs,
  books,
  onCreate,
  onUpdate,
  onDelete,
}: LibrariesProps) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Library | null>(null);

  const handleEdit = (library: Library) => {
    setEditing(library);
    setDrawerOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const handleSubmit = (data: Omit<Library, "id">) => {
    if (editing) onUpdate({ ...data, id: editing.id });
    else onCreate(data);
  };

  const visibleLibraries = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return libraries;

    return libraries.filter((library) =>
      library.name.toLowerCase().includes(term),
    );
  }, [libraries, query]);

  //shelf and book counts are looked up per row
  const columns = useMemo<ColumnDef<Features, Library, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        id: "shelves",
        header: "Regale",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {shelfs.filter((shelf) => shelf.organisationId === row.original.id)
              .length}
          </span>
        ),
      },
      {
        id: "books",
        header: "Bücher",
        cell: ({ row }) => {
          const shelfIds = shelfs
            .filter((shelf) => shelf.organisationId === row.original.id)
            .map((shelf) => shelf.id);

          return (
            <span className="tabular-nums">
              {books.filter((book) => shelfIds.includes(book.shelfId)).length}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <RowActions
            onEdit={() => handleEdit(row.original)}
            onDelete={() => onDelete(row.original.id)}
            confirmMessage={`„${row.original.name}“ mit allen Regalen und Büchern wirklich löschen?`}
          />
        ),
      },
    ],
    [shelfs, books, onDelete],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bibliotheken"
        subtitle={`${libraries.length} ${libraries.length === 1 ? "Bibliothek" : "Bibliotheken"} mit ${shelfs.length} ${shelfs.length === 1 ? "Regal" : "Regalen"}`}
      />

      <div className="flex flex-col gap-3">
        <TableToolbar
          value={search}
          onChange={setSearch}
          onSubmit={() => setQuery(search)}
          placeholder="Bibliotheksname …"
        >
          <Button onClick={handleNew}>
            <Plus />
            Neu
          </Button>
        </TableToolbar>

        <DataTable
          columns={columns}
          data={visibleLibraries}
          emptyMessage={
            query ? "Keine Treffer." : "Keine Bibliotheken vorhanden."
          }
        />
      </div>

      <LibraryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        library={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Libraries;
