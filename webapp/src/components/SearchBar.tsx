import React, { useState, useRef } from "react";
import ChipInput from "material-ui-chip-input";
import { Chip } from "@material-ui/core";
import { Phone, Info, Fingerprint } from "@material-ui/icons";
import { useEffect } from "react";

export interface IFilter {
  type: string;
  value: string;
}

const chipRenderer = (
  { value: filter, handleDelete, className }: any,
  key: any
) => {
  const Icon = ({
    // https://material-ui.com/components/material-icons/
    msisdn: Phone,
    trxId: Fingerprint,
    refId: Info
  } as any)[filter.type];
  return (
    <Chip
      key={key}
      className={className}
      onDelete={handleDelete}
      label={filter.value}
      avatar={<Icon />}
    />
  );
};

export const SearchBar = ({ onUpdate }: any) => {
  const [filters, setFilters] = useState<IFilter[]>([]);

  const handleAddFilter = (value: string) => {
    const filter = { type: "refId", value };

    if (value.match(/^27[0-9]{6,8}/)) {
      filter.type = "msisdn";
    }

    if (
      value.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      )
    ) {
      filter.type = "trxId";
    }

    const deDupe = filters.filter((item: IFilter) => item.type !== filter.type);
    setFilters([...deDupe, filter]);
  };

  const handleDeleteFilter = (_chip: any, index: number) => {
    setFilters(filters.filter((_tag, i) => index !== i));
  };

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    onUpdate(filters);
  }, [onUpdate, filters]);

  return (
    <ChipInput
      variant="outlined"
      label="Filters"
      fullWidth
      fullWidthInput
      value={filters}
      onAdd={handleAddFilter}
      onDelete={handleDeleteFilter}
      chipRenderer={chipRenderer}
    />
  );
};
