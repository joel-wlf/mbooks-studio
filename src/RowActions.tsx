import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type RowActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  confirmMessage: string;
};

function RowActions({ onEdit, onDelete, confirmMessage }: RowActionsProps) {
  return (
    <div className='flex justify-end gap-1'>
      <Button
        variant='ghost'
        size='icon'
        aria-label='Bearbeiten'
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        aria-label='Löschen'
        className='text-destructive hover:text-destructive'
        onClick={() => {
          if (window.confirm(confirmMessage)) onDelete();
        }}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export default RowActions;
