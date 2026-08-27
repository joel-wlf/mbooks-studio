import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Library, Shelf } from "./types";

type ShelfDrawerProps = {
  libraries: Library[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelf: Shelf | null;
  onSubmit: (shelf: Omit<Shelf, "id">) => void;
};

const emptyForm = { name: "", organisationId: "" };

function ShelfDrawer({
  libraries,
  open,
  onOpenChange,
  shelf,
  onSubmit,
}: ShelfDrawerProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    setForm(
      shelf
        ? { name: shelf.name, organisationId: shelf.organisationId }
        : emptyForm,
    );
  }, [open, shelf]);

  const canSubmit = form.name.trim() !== "" && form.organisationId !== "";

  const submit = () => {
    if (!canSubmit) return;

    onSubmit({
      name: form.name.trim(),
      organisationId: form.organisationId,
    });

    onOpenChange(false);
  };

  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="[--drawer-content-width:92%] sm:[--drawer-content-width:26rem]">
        <div className="flex h-full w-full flex-col">
          <DrawerHeader>
            <DrawerTitle>
              {shelf ? "Regal bearbeiten" : "Neues Regal"}
            </DrawerTitle>
            <DrawerDescription>
              Regal {shelf ? "ändern" : "anlegen"} und einer Bibliothek
              zuordnen.
            </DrawerDescription>
          </DrawerHeader>

          <form
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="shelf-name">Name</Label>
              <Input
                id="shelf-name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Bibliothek</Label>
              <Select
                items={libraries.map((library) => ({
                  value: library.id,
                  label: library.name,
                }))}
                value={form.organisationId}
                onValueChange={(value) =>
                  setForm({ ...form, organisationId: String(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bibliothek wählen" />
                </SelectTrigger>
                <SelectContent>
                  {libraries.map((library) => (
                    <SelectItem key={library.id} value={library.id}>
                      {library.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>

          <DrawerFooter>
            <Button onClick={submit} disabled={!canSubmit}>
              {shelf ? "Speichern" : "Anlegen"}
            </Button>
            <DrawerClose render={<Button variant="outline">Abbrechen</Button>} />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ShelfDrawer;
