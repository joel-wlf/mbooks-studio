import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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
import fetchBookByIsbn, { coverUrl, isValidIsbn } from "./openlibrary";
import ShelfSelect from "./ShelfSelect";
import type { Book, Library, Shelf } from "./types";

type BookDrawerProps = {
  shelfs: Shelf[];
  libraries: Library[];
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

//"idle" heisst: noch nichts nachgeschlagen, dann zeigen wir keine meldung an
type Lookup = "idle" | "loading" | "found" | "missing" | "error";

function BookDrawer({
  shelfs,
  libraries,
  open,
  onOpenChange,
  book,
  onSubmit,
}: BookDrawerProps) {
  const [form, setForm] = useState(emptyForm);
  const [lookup, setLookup] = useState<Lookup>("idle");
  const [cover, setCover] = useState<string | null>(null);

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
    setLookup("idle");
    setCover(book && isValidIsbn(book.isbn) ? coverUrl(book.isbn) : null);
  }, [open, book]);

  //leere isbn bleibt erlaubt, eine ausgefuellte muss aber zur pruefziffer passen
  const isbnEntered = form.isbn.trim() !== "";
  const isbnValid = isValidIsbn(form.isbn);
  const isbnBroken = isbnEntered && !isbnValid;

  const canSubmit = form.title.trim() !== "" && form.shelfId !== "" && !isbnBroken;

  //titel, autor und jahr aus der isbn ziehen, das regal bleibt handarbeit
  const loadFromIsbn = async () => {
    if (!isbnValid || lookup === "loading") return;

    setLookup("loading");
    setCover(null);

    try {
      const data = await fetchBookByIsbn(form.isbn);

      if (!data) {
        setLookup("missing");
        return;
      }

      //nur ueberschreiben was openlibrary auch wirklich liefert
      setForm((current) => ({
        ...current,
        title: data.title || current.title,
        author: data.author || current.author,
        year: data.year ? String(data.year) : current.year,
      }));
      setCover(data.cover ?? coverUrl(form.isbn));
      setLookup("found");
    } catch {
      setLookup("error");
    }
  };

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

  const hint = isbnBroken
    ? { text: "Prüfziffer stimmt nicht – bitte ISBN prüfen.", tone: "error" }
    : lookup === "loading"
      ? { text: "Wird bei OpenLibrary gesucht …", tone: "muted" }
      : lookup === "found"
        ? { text: "Daten von OpenLibrary übernommen.", tone: "muted" }
        : lookup === "missing"
          ? {
              text: "Bei OpenLibrary nicht gefunden – bitte manuell ausfüllen.",
              tone: "muted",
            }
          : lookup === "error"
            ? { text: "OpenLibrary nicht erreichbar.", tone: "error" }
            : null;

  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="[--drawer-content-width:92%] sm:[--drawer-content-width:26rem]">
        <div className="flex h-full w-full flex-col">
          <DrawerHeader>
            <DrawerTitle>{book ? "Buch bearbeiten" : "Neues Buch"}</DrawerTitle>
            <DrawerDescription>
              {book
                ? "Buch ändern und einem Regal zuordnen."
                : "ISBN eingeben, Daten laden und einem Regal zuordnen."}
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
              <Label htmlFor="book-isbn">ISBN</Label>
              <div className="flex gap-2">
                <Input
                  id="book-isbn"
                  className="flex-1"
                  placeholder="978-3-499-60555-0"
                  value={form.isbn}
                  onChange={(event) => {
                    setForm({ ...form, isbn: event.target.value });
                    setLookup("idle");
                  }}
                  //enter soll erst nachschlagen statt das formular abzuschicken
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    void loadFromIsbn();
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isbnValid || lookup === "loading"}
                  onClick={() => void loadFromIsbn()}
                >
                  <Search />
                  Daten laden
                </Button>
              </div>
              {hint && (
                <p
                  className={
                    hint.tone === "error"
                      ? "text-destructive text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {hint.text}
                </p>
              )}
            </div>

            {cover && (
              <img
                src={cover}
                alt=""
                className="h-32 w-24 rounded border object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

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
              <ShelfSelect
                shelfs={shelfs}
                libraries={libraries}
                value={form.shelfId}
                onValueChange={(value) => setForm({ ...form, shelfId: value })}
              />
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
