export interface DatabaseFixture {
  engine: string;
  tables: DatabaseTable[];
  initialQueries: DatabaseQuery[];
}

export interface DatabaseQuery {
  id: string;
  label: string;
  query: string;
}

export interface DatabaseTable {
  name: string;

  columns: DatabaseColumn[];

  rows: unknown[][];
}

export interface DatabaseColumn {
  name: string;

  type: string;
}