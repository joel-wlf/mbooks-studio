import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuantityInput from "./QuantityInput";
import fetchBookByIsbn, { coverUrl, normalizeIsbn } from "./openlibrary";
import ShelfSelect from "./ShelfSelect";
import type { Book, Library, Shelf } from "./types";

type ScannerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: Book[];
  shelfs: Shelf[];
  libraries: Library[];
  onCreate: (book: Omit<Book, "id">) => void;
  onUpdate: (book: Book) => void;
  onDelete: (id: string) => void;
};

const emptyForm = { title: "", author: "", year: "", shelfId: "" };

function ScannerDialog({
  open,
  onOpenChange,
  books,
  shelfs,
  libraries,
  onCreate,
  onUpdate,
  onDelete,
}: ScannerDialogProps) {
  //als state statt ref, damit der effect neu laeuft sobald das element da ist
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [isbn, setIsbn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addAmount, setAddAmount] = useState(1);
  const [removeAmount, setRemoveAmount] = useState(1);
  //nur fuer unbekannte isbn, vorbefuellt aus openlibrary
  const [form, setForm] = useState(emptyForm);
  const [cover, setCover] = useState<string | null>(null);

  //der scanner liefert die isbn ohne bindestriche, im inventar stehen sie mit
  const known =
    books.find((book) => normalizeIsbn(book.isbn) === normalizeIsbn(isbn)) ??
    null;

  //kamera starten solange der dialog offen ist und noch nichts gescannt wurde
  useEffect(() => {
    if (!open || isbn || !videoEl) return;

    //nur buch-barcodes, das reduziert fehlversuche pro frame deutlich
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);
    //rechnet laenger pro frame, findet dafuer auch schraege oder unscharfe codes
    hints.set(DecodeHintType.TRY_HARDER, true);

    //oefter als der default von 500ms probieren
    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 100,
    });
    let cancelled = false;

    //die default-aufloesung ist fuer einen schmalen ean-13 oft zu grob
    reader
      .decodeFromConstraints(
        {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoEl,
        (result) => {
          //fehler pro frame sind normal solange nichts im bild ist, die ignorieren wir
          if (result && !cancelled) {
            cancelled = true;
            setIsbn(result.getText());
          }
        },
      )
      .then((controls) => {
        if (cancelled) controls.stop();
        else controlsRef.current = controls;
      })
      .catch(() => setError("Kamera konnte nicht gestartet werden."));

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, isbn, videoEl]);

  //alles zuruecksetzen wenn der dialog zugeht
  useEffect(() => {
    if (open) return;

    setIsbn("");
    setError("");
    setAddAmount(1);
    setRemoveAmount(1);
    setForm(emptyForm);
    setCover(null);
  }, [open]);

  //bei unbekannter isbn die daten von openlibrary holen
  useEffect(() => {
    if (!isbn || known) return;

    setLoading(true);
    fetchBookByIsbn(isbn)
      .then((data) => {
        if (!data) return;
        setForm({
          title: data.title,
          author: data.author,
          year: String(data.year || ""),
          shelfId: "",
        });
        setCover(data.cover);
      })
      .catch(() => setError("OpenLibrary nicht erreichbar."))
      .finally(() => setLoading(false));
  }, [isbn, known]);

  const handleAdd = () => {
    if (known) {
      onUpdate({ ...known, quantity: known.quantity + addAmount });
    } else {
      onCreate({
        title: form.title.trim(),
        author: form.author.trim(),
        isbn,
        year: Number(form.year) || 0,
        shelfId: form.shelfId,
        quantity: addAmount,
      });
    }

    onOpenChange(false);
  };

  //bei 0 verbleibenden exemplaren faellt der eintrag ganz raus
  const handleRemove = () => {
    if (!known) return;

    const rest = known.quantity - removeAmount;
    if (rest <= 0) onDelete(known.id);
    else onUpdate({ ...known, quantity: rest });

    onOpenChange(false);
  };

  const canCreate = form.title.trim() !== "" && form.shelfId !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* auf dem handy passt der inhalt sonst nicht auf den schirm */}
      <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Scanner Mode</DialogTitle>
          <DialogDescription>
            {isbn
              ? `Gescannt: ${isbn}`
              : "Barcode vor die Kamera halten."}
          </DialogDescription>
        </DialogHeader>

        {error && <p className='text-destructive text-sm'>{error}</p>}

        {/* bleibt gemountet, sonst ist die ref beim start der kamera noch leer */}
        <video
          ref={setVideoEl}
          autoPlay
          muted
          playsInline
          className={
            isbn ? "hidden" : "w-full rounded-lg bg-black object-cover"
          }
          style={{ aspectRatio: "4 / 3" }}
        />

        {isbn && (
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
              <img
                src={known ? coverUrl(known.isbn) : (cover ?? coverUrl(isbn))}
                alt=''
                className='h-32 w-24 shrink-0 rounded border object-cover'
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />

              <div className='flex flex-col gap-1'>
                <span className='font-medium'>
                  {known ? known.title : form.title || "Unbekanntes Buch"}
                </span>
                <span className='text-muted-foreground text-sm'>
                  {known ? known.author : form.author}
                </span>
                <span className='text-muted-foreground text-xs'>
                  {known
                    ? `${known.quantity} im Inventar`
                    : loading
                      ? "Wird bei OpenLibrary gesucht …"
                      : "Noch nicht im Inventar"}
                </span>
              </div>
            </div>

            {/* unbekannte isbn: erst die pflichtfelder ausfuellen */}
            {!known && (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='scan-title'>Titel</Label>
                  <Input
                    id='scan-title'
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                  />
                </div>

                <div className='flex gap-4'>
                  <div className='flex flex-1 flex-col gap-2'>
                    <Label htmlFor='scan-author'>Autor</Label>
                    <Input
                      id='scan-author'
                      value={form.author}
                      onChange={(event) =>
                        setForm({ ...form, author: event.target.value })
                      }
                    />
                  </div>

                  <div className='flex w-28 flex-col gap-2'>
                    <Label htmlFor='scan-year'>Jahr</Label>
                    <Input
                      id='scan-year'
                      type='number'
                      value={form.year}
                      onChange={(event) =>
                        setForm({ ...form, year: event.target.value })
                      }
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label>Regal</Label>
                  <ShelfSelect
                    shelfs={shelfs}
                    libraries={libraries}
                    value={form.shelfId}
                    onValueChange={(value) =>
                      setForm({ ...form, shelfId: value })
                    }
                  />
                </div>
              </div>
            )}

            <div className='grid gap-4 sm:grid-cols-2'>
              {/* links: hinzufuegen */}
              <div className='flex flex-col gap-2 rounded-lg border p-4'>
                <Label>Hinzufügen</Label>
                <QuantityInput value={addAmount} onChange={setAddAmount} />
                <Button
                  className='bg-green-800 text-white hover:bg-green-900'
                  disabled={!known && !canCreate}
                  onClick={handleAdd}
                >
                  {addAmount} hinzufügen
                </Button>
              </div>

              {/* rechts: entfernen, nur wenn schon im inventar */}
              <div className='flex flex-col gap-2 rounded-lg border p-4'>
                <Label>Entfernen</Label>
                <QuantityInput
                  value={removeAmount}
                  onChange={setRemoveAmount}
                  max={known?.quantity ?? 1}
                />
                <Button
                  className='bg-red-700 text-white hover:bg-red-800'
                  disabled={!known}
                  onClick={handleRemove}
                >
                  {removeAmount} entfernen
                </Button>
              </div>
            </div>

            <Button variant='outline' onClick={() => setIsbn("")}>
              Nächsten Barcode scannen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ScannerDialog;
