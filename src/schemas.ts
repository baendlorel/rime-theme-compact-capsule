import { rgba, rgb } from './colors';

export const NAME_PRFIX = 'compact_capsule';
export const BACK_COLOR = rgba(255, 255, 255, 0.89);
export const BACK_COLOR_DARK = '#000000';
export const BORDER_COLOR = rgba(0, 0, 0, 0);

export enum Theme {
  LIGHT,
  DARK,
}

export type SchemaConfig = {
  id: string;
  name: string;
  type: Theme;
  hilitedCandidateBackColor: string;
  hilitedCandidateTextColor: string;
};

export const COMPACT_CAPSULE_SCHEMAS = [
  {
    id: '',
    name: 'blue',
    type: Theme.LIGHT,
    hilitedCandidateBackColor: rgb(16, 119, 208),
  },
];
