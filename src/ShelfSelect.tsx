import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Library, Shelf } from "./types";

type ShelfSelectProps = {
  shelfs: Shelf[];
  libraries: Library[];
  value: string;
  onValueChange: (value: string) => void;
};

//regale gibt es nur innerhalb einer bibliothek, deshalb ueberall nach standort gruppiert
function ShelfSelect({
  shelfs,
  libraries,
  value,
  onValueChange,
}: ShelfSelectProps) {
  const groups = useMemo(() => {
    const byLibrary = libraries.map((library) => ({
      id: library.id,
      name: library.name,
      shelfs: shelfs.filter((shelf) => shelf.organisationId === library.id),
    }));

    //regale ohne passende bibliothek wuerden sonst aus der auswahl fallen
    const orphans = shelfs.filter(
      (shelf) =>
        !libraries.some((library) => library.id === shelf.organisationId),
    );

    if (orphans.length > 0) {
      byLibrary.push({ id: "", name: "Ohne Bibliothek", shelfs: orphans });
    }

    //leere bibliotheken haben in einer regal-auswahl nichts zu suchen
    return byLibrary.filter((group) => group.shelfs.length > 0);
  }, [shelfs, libraries]);

  return (
    <Select
      //flach, das dient nur dem label im trigger
      items={shelfs.map((shelf) => ({ value: shelf.id, label: shelf.name }))}
      value={value}
      onValueChange={(next) => onValueChange(String(next))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Regal wählen" />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectGroup key={group.id || "orphans"}>
            <SelectLabel>{group.name}</SelectLabel>
            {group.shelfs.map((shelf) => (
              <SelectItem key={shelf.id} value={shelf.id}>
                {shelf.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ShelfSelect;
