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

import type { Book, Shelf } from "./types";

type BookDrawerProps = {
  shelfs: Shelf[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  //set means edit mode, null means create
  book: Book | null;
  onSubmit: (book: Omit<Book, "id">) => void;
};

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  year: "",
  shelfId: "",
  quantity: "1",
};

function BookDrawer({
  shelfs,
  open,
  onOpenChange,
  book,
  onSubmit,
}: BookDrawerProps) {
  const [form, setForm] = useState(emptyForm);

  //refill whenever the drawer opens, so edit starts from the current row
  useEffect(() => {
    if (!open) return;

    setForm(
      book
        ? {
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            year: String(book.year),
            shelfId: book.shelfId,
            quantity: String(book.quantity),
          }
        : emptyForm,
    );
  }, [open, book]);

  const canSubmit = form.title.trim() !== "" && form.shelfId !== "";

  const submit = () => {
    if (!canSubmit) return;

    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      year: Number(form.year) || 0,
      shelfId: form.shelfId,
      quantity: Math.max(1, Number(form.quantity) || 1),
    });

    onOpenChange(false);
  };

  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="[--drawer-content-width:92%] sm:[--drawer-content-width:26rem]">
        <div className="flex h-full w-full flex-col">
          <DrawerHeader>
            <DrawerTitle>{book ? "Buch bearbeiten" : "Neues Buch"}</DrawerTitle>
            <DrawerDescription>
              Buch {book ? "ändern" : "anlegen"} und einem Regal zuordnen.
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
              <Label htmlFor="book-title">Titel</Label>
              <Input
                id="book-title"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="book-author">Autor</Label>
              <Input
                id="book-author"
                value={form.author}
                onChange={(event) =>
                  setForm({ ...form, author: event.target.value })
                }
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex min-w-40 flex-1 flex-col gap-2">
                <Label htmlFor="book-isbn">ISBN</Label>
                <Input
                  id="book-isbn"
                  value={form.isbn}
                  onChange={(event) =>
                    setForm({ ...form, isbn: event.target.value })
                  }
                />
              </div>

              <div className="flex w-24 flex-col gap-2 sm:w-32">
                <Label htmlFor="book-year">Jahr</Label>
                <Input
                  id="book-year"
                  type="number"
                  value={form.year}
                  onChange={(event) =>
                    setForm({ ...form, year: event.target.value })
                  }
                />
              </div>

              <div className="flex w-24 flex-col gap-2 sm:w-32">
                <Label htmlFor="book-quantity">Anzahl</Label>
                <Input
                  id="book-quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Regal</Label>
              <Select
                items={shelfs.map((shelf) => ({
                  value: shelf.id,
                  label: shelf.name,
                }))}
                value={form.shelfId}
                onValueChange={(value) =>
                  setForm({ ...form, shelfId: String(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Regal wählen" />
                </SelectTrigger>
                <SelectContent>
                  {shelfs.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id}>
                      {shelf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>

          <DrawerFooter>
            <Button onClick={submit} disabled={!canSubmit}>
              {book ? "Speichern" : "Anlegen"}
            </Button>
            <DrawerClose render={<Button variant="outline">Abbrechen</Button>} />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default BookDrawer;
