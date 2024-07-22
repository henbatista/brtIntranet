export interface columnsType<T extends object = {}> {
  header: string;
  field: string;
  render?: (value: string, data?: T) => any;
  renderHeader?: (data?: T[]) => string;
  class?: string;
  filterable?: Boolean;
  sortable?: Boolean;
  type?: "text" | "number" | "date";
}

export type tableSort = columnsType & { order: "asc" | "desc" | null };
export type tableSearch = columnsType & { value: string };
