export interface ContainerType {
  id: string;
  name: string;
  translations: Record<string, string>;
  thermalConductivity: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
