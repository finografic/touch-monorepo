const as = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export type HeadingSize = (typeof as)[number];
export type SizeValuePositive = (typeof sizes)[number];
export type SizeValueNegative = `-${SizeValuePositive}`;
export type SizeValue = SizeValuePositive | SizeValueNegative;

export interface TitleHeadingProps {
  m: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  mx: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  my: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  mt: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  mr: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  mb: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  ml: SizeValue | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', SizeValue>> | undefined;
  color:
    | 'ruby'
    | 'blue'
    | 'cyan'
    | 'lime'
    | 'orange'
    | 'red'
    | 'violet'
    | 'yellow'
    | 'green'
    | 'indigo'
    | 'purple'
    | 'brown'
    | 'crimson'
    | 'gold'
    | 'gray';
  wrap:
    | 'wrap'
    | 'nowrap'
    | 'pretty'
    | 'balance'
    | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', 'wrap' | 'nowrap' | 'pretty' | 'balance'>>;
  truncate: boolean;
  trim:
    | 'both'
    | 'normal'
    | 'start'
    | 'end'
    | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', 'both' | 'normal' | 'start' | 'end'>>;
  align:
    | 'center'
    | 'left'
    | 'right'
    | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', 'center' | 'left' | 'right'>>;
  weight:
    | 'bold'
    | 'light'
    | 'medium'
    | 'regular'
    | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', 'bold' | 'light' | 'medium' | 'regular'>>;
  size: SizeValuePositive;
  asChild: boolean;
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'header' | 'div';
}
