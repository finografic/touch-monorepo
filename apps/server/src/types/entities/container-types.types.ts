export interface ContainerTypeEntity {
  id: string;
  name: string;
  displayName: string;
  thermalConductivity: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
