"use client";

import { useEffect } from "react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ISpeciality } from "@/types/speciality.interface";

interface MultiSelectProps {
  selected: string[];
  setSelected: (ids: string[]) => void;
  options: ISpeciality[];
  isEdit?: boolean; 
  initialSpecialities?: string[]; 
  setPayload?: (payload: { specialityId: string; deleteFlag?: boolean }[]) => void; 
}

export default function MultiSelect({
  selected,
  setSelected,
  options,
  isEdit = false,
  initialSpecialities = [],
  setPayload,
}: MultiSelectProps) {
  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((selectedId) => selectedId !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    } else {
      setSelected([...selected]);
    }
  };

  useEffect(() => {
    if (isEdit && setPayload) {
      const payload: { specialityId: string; deleteFlag?: boolean }[] = [];

      initialSpecialities.forEach((spec) => {
        if (!selected.includes(spec)) {
          payload.push({ specialityId: spec, deleteFlag: true });
        }
      });

      selected.forEach((spec) => {
        if (!initialSpecialities.includes(spec)) {
          payload.push({ specialityId: spec });
        }
      });

      setPayload(payload);
    }
  }, [selected, isEdit, initialSpecialities, setPayload]);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select specialities" />
      </SelectTrigger>
      <SelectContent>
        <div className="w-full border rounded-md">
          <Command>
            <CommandGroup>
              {options.map((option: ISpeciality) => (
                <CommandItem
                  key={option.id}
                  onMouseDown={() => toggleOption(option.id)}
                  disabled={
                    !selected.includes(option.id) && selected.length >= 3
                  }
                  className="flex items-center justify-between hover:bg-foreground"
                >
                  <span>{option.title}</span>
                  <Checkbox
                    checked={selected.includes(option.id)}
                    className="
                      border-gray-400
                      data-[state=checked]:bg-black
                      data-[state=checked]:text-white
                      dark:border-gray-600
                      dark:data-[state=checked]:bg-black
                      dark:data-[state=checked]:text-white"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          {selected.length >= 3 && (
            <div className="text-red-500 mt-1">Max 3 selections allowed</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}