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
    <div className="flex items-center gap-2">
      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-64"
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
