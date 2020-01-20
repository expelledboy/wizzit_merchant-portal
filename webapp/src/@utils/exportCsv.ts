import { CsvBuilder } from "filefy";

export const exportItems = (items: any[], filename = "data") => {
  const types: string[] = [];
  const headers: string[] = [];

  items.forEach((item: any) => {
    if (types.includes(item.__typename)) {
      return;
    }

    Object.keys(item).forEach((key: string) => {
      if (headers.includes(key)) {
        return;
      }

      if (key === "__typename") {
        return;
      }

      headers.push(key);
    });
  });

  const builder = new CsvBuilder(`${filename}.csv`);

  const flatmap = items.map(item => {
    return headers.reduce((acc: string[], header: string) => {
      acc.push(!!item[header] ? item[header] : null);
      return acc;
    }, []);
  });

  builder
    .setDelimeter(",")
    .setColumns(headers)
    .addRows(flatmap)
    .exportFile();
};
