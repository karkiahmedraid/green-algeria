export interface Tree {
  id: number;
  x: number;
  y: number;
  name: string;
  image: string | null;
  color?: string;
  timestamp: string;
}

export interface FormData {
  name: string;
  image: File | null;
  imagePreview: string | null;
  color: string;
}

export interface Point {
  x: number;
  y: number;
}
