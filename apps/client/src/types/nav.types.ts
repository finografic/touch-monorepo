export interface NavItem {
  key: string;
  id: string;
  path: string;
  label: string;
  icon?: React.ComponentType<any> | undefined;
}
