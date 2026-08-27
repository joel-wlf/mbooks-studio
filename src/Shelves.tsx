import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "./DataTable";
import type { Features } from "./DataTable";
import PageHeader from "./PageHeader";
import RowActions from "./RowActions";
import ShelfDrawer from "./ShelfDrawer";
import TableToolbar from "./TableToolbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Book, Library, Shelf } from "./types";

type ShelvesProps = {
  shelfs: Shelf[];
  books: Book[];
  libraries: Library[];
  onCreate: (shelf: Omit<Shelf, "id">) => void;
  onUpdate: (shelf: Shelf) => void;
  onDelete: (id: string) => void;
};

function Shelves({
  shelfs,
  books,
  libraries,
  onCreate,
  onUpdate,
  onDelete,
}: ShelvesProps) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Shelf | null>(null);

  const handleEdit = (shelf: Shelf) => {
    setEditing(shelf);
    setDrawerOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const handleSubmit = (data: Omit<Shelf, "id">) => {
    if (editing) onUpdate({ ...data, id: editing.id });
    else onCreate(data);
  };

  const visibleShelfs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return shelfs;

    return shelfs.filter((shelf) => shelf.name.toLowerCase().includes(term));
  }, [shelfs, query]);

  //library name and book count are looked up per row
  const columns = useMemo<ColumnDef<Features, Shelf, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        id: "library",
        header: "Bibliothek",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {libraries.find(
              (library) => library.id === row.original.organisationId,
            )?.name ?? "—"}
          </span>
        ),
      },
      {
        id: "books",
        header: "Bücher",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {books.filter((book) => book.shelfId === row.original.id).length}
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
            confirmMessage={`„${row.original.name}“ und alle darin enthaltenen Bücher wirklich löschen?`}
          />
        ),
      },
    ],
    [books, libraries, onDelete],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Regale"
        subtitle={`${shelfs.length} ${shelfs.length === 1 ? "Regal" : "Regale"} in ${libraries.length} ${libraries.length === 1 ? "Bibliothek" : "Bibliotheken"}`}
      />

      <div className="flex flex-col gap-3">
        <TableToolbar
          value={search}
          onChange={setSearch}
          onSubmit={() => setQuery(search)}
          placeholder="Regalname …"
        >
          <Button onClick={handleNew}>
            <Plus />
            Neu
          </Button>
        </TableToolbar>

        <DataTable
          columns={columns}
          data={visibleShelfs}
          emptyMessage={query ? "Keine Treffer." : "Keine Regale vorhanden."}
        />
      </div>

      <ShelfDrawer
        libraries={libraries}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        shelf={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Shelves;
