import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TableToolbarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  children?: ReactNode;
};

function TableToolbar({
  value,
  onChange,
  onSubmit,
  placeholder = "Suchen …",
  children,
}: TableToolbarProps) {
  return (
    //auf dem handy nimmt die suche eine eigene zeile, der neu-button rutscht darunter
    <div className="flex flex-wrap items-center gap-2">
      <form
        className="flex w-full min-w-0 items-center gap-2 sm:w-auto"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 sm:w-64 sm:flex-none"
        />
        <Button type="submit" variant="outline">
          <Search />
          Suchen
        </Button>
      </form>

      <div className="ml-auto">{children}</div>
    </div>
  );
}

export default TableToolbar;
