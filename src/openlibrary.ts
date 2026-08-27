//der scanner liefert 9783518368356, im inventar steht 978-3-518-36835-6
export function normalizeIsbn(isbn: string) {
  return isbn.replace(/[^0-9xX]/g, "").toUpperCase();
}

//cover laesst sich direkt aus der isbn ableiten, muss also nicht am buch gespeichert werden
export function coverUrl(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${normalizeIsbn(isbn)}-M.jpg`;
}

//holt titel, autor, jahr und cover zu einer isbn von openlibrary
//gibt null zurueck wenn die isbn dort nicht gelistet ist
async function fetchBookByIsbn(isbn: string) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const entry = data[`ISBN:${isbn}`];
  if (!entry) return null;

  const details = entry.details ?? {};

  //covers[0] gibt ein groesseres bild als das mitgelieferte thumbnail_url (-S)
  const coverId = details.covers?.[0];

  return {
    title: details.title ?? "",
    author: details.authors?.[0]?.name ?? "",
    //publish_date ist mal "2008", mal "Mar 12, 2015"
    year: Number(String(details.publish_date ?? "").match(/\d{4}/)?.[0]) || 0,
    cover: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : (entry.thumbnail_url ?? null),
  };
}

export default fetchBookByIsbn;
