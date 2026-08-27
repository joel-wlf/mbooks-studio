const demoData = {
    libraries: [
        { id: "lib-1", name: "Stadtbibliothek Espelkamp" },
        { id: "lib-2", name: "Mittwald Mitarbeiterbibliothek" },
    ],
    shelves: [
        { id: "shelf-1", organisationId: "lib-1", name: "Belletristik" },
        { id: "shelf-2", organisationId: "lib-1", name: "Sachbücher" },
        { id: "shelf-3", organisationId: "lib-2", name: "Technik & IT" },
    ],
    books: [
        { id: "book-1", shelfId: "shelf-1", title: "Der Steppenwolf", author: "Hermann Hesse", isbn: "978-3-518-36835-6", year: 1927 },
        { id: "book-2", shelfId: "shelf-1", title: "Die Verwandlung", author: "Franz Kafka", isbn: "978-3-15-009900-2", year: 1915 },
        { id: "book-3", shelfId: "shelf-2", title: "Eine kurze Geschichte der Zeit", author: "Stephen Hawking", isbn: "978-3-499-60555-9", year: 1988 },
        { id: "book-4", shelfId: "shelf-3", title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", year: 2008 },
        { id: "book-5", shelfId: "shelf-3", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "978-1-4493-7332-0", year: 2017 },
    ],
};

export default demoData;
