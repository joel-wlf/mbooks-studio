//der scanner liefert 9783518368350, im inventar steht 978-3-518-36835-0
export function normalizeIsbn(isbn: string) {
  return isbn.replace(/[^0-9xX]/g, "").toUpperCase();
}

//prueft die pruefziffer, damit vertipper nicht als "buch nicht gefunden" durchgehen
//isbn-10: ziffer 1..9 mit 1..9 gewichten, summe mod 11 ist die pruefziffer (10 = "X")
//isbn-13: die ersten 12 ziffern abwechselnd mit 1 und 3, pruefziffer ergaenzt aufs naechste vielfache von 10
export function isValidIsbn(isbn: string) {
  const digits = normalizeIsbn(isbn);

  if (digits.length === 10) {
    //das X darf nur ganz am ende stehen
    if (/[^0-9]/.test(digits.slice(0, 9))) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (i + 1);

    const check = sum % 11;
    return (check === 10 ? "X" : String(check)) === digits[9];
  }

  if (digits.length === 13) {
    if (/[^0-9]/.test(digits)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) sum += Number(digits[i]) * (i % 2 === 0 ? 1 : 3);

    return (10 - (sum % 10)) % 10 === Number(digits[12]);
  }

  return false;
}

//cover laesst sich direkt aus der isbn ableiten, muss also nicht am buch gespeichert werden
export function coverUrl(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${normalizeIsbn(isbn)}-M.jpg`;
}

//holt titel, autor, jahr und cover zu einer isbn von openlibrary
//gibt null zurueck wenn die isbn dort nicht gelistet ist
//jscmd=data statt details, weil details bei vielen buechern gar keine autoren mitliefert
async function fetchBookByIsbn(isbn: string) {
  const key = normalizeIsbn(isbn);
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${key}&jscmd=data&format=json`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const entry = data[`ISBN:${key}`];
  if (!entry) return null;

  return {
    title: entry.title ?? "",
    author:
      entry.authors?.map((a: { name: string }) => a.name).join(", ") ?? "",
    //publish_date ist mal "2008", mal "Mar 12, 2015"
    year: Number(String(entry.publish_date ?? "").match(/\d{4}/)?.[0]) || 0,
    cover: entry.cover?.medium ?? null,
  };
}

export default fetchBookByIsbn;
