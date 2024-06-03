export interface Link {
  name: string;
  url: string;
}

export interface Languages {
  name: string;
  code: string;
  isPrimary?: boolean;
}

export interface Picture {
  id: string;
  url: string;
  isPrimary?: boolean;
}
