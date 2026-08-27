import {
  createCoreRowModel,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//core features only, read-only table for now
export const tableFeaturesConfig = tableFeatures({
  coreRowModel: createCoreRowModel(),
});

export type Features = typeof tableFeaturesConfig;

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<Features, TData, unknown>[];
  data: TData[];
  emptyMessage?: string;
};

function DataTable<TData extends RowData>({
  columns,
  data,
  emptyMessage = "Keine Einträge vorhanden.",
}: DataTableProps<TData>) {
  const table = useTable({
    features: tableFeaturesConfig,
    columns,
    data,
  });

  return (
    <div className="overflow-hidden border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
