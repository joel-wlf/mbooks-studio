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

import type { Library } from "./types";

type LibraryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  library: Library | null;
  onSubmit: (library: Omit<Library, "id">) => void;
};

function LibraryDrawer({
  open,
  onOpenChange,
  library,
  onSubmit,
}: LibraryDrawerProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(library ? library.name : "");
  }, [open, library]);

  const canSubmit = name.trim() !== "";

  const submit = () => {
    if (!canSubmit) return;

    onSubmit({ name: name.trim() });
    onOpenChange(false);
  };

  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="[--drawer-content-width:92%] sm:[--drawer-content-width:26rem]">
        <div className="flex h-full w-full flex-col">
          <DrawerHeader>
            <DrawerTitle>
              {library ? "Bibliothek bearbeiten" : "Neue Bibliothek"}
            </DrawerTitle>
            <DrawerDescription>
              Bibliothek {library ? "ändern" : "anlegen"}.
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
              <Label htmlFor="library-name">Name</Label>
              <Input
                id="library-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </form>

          <DrawerFooter>
            <Button onClick={submit} disabled={!canSubmit}>
              {library ? "Speichern" : "Anlegen"}
            </Button>
            <DrawerClose render={<Button variant="outline">Abbrechen</Button>} />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default LibraryDrawer;
