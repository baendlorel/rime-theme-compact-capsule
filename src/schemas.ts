import { rgba, rgb, BS } from './colors';

export const ID_PRFIX = 'compact_capsule_';
export const NAME_PRFIX = '紧凑胶囊';
export const AUTHOR = 'KasukabeTsumugi <futami16237@gmail.com>';
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
  hilitedCandidateBackColor: string;
  hilitedCandidateTextColor: string;
};

export const COMPACT_CAPSULE_SCHEMAS = [
  {
    id: 'blue',
    name: '蓝',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: rgb(16, 119, 208),
  },
  {
    id: 'red',
    name: '红',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: rgb(210, 50, 66),
  },
  {
    id: 'orange',
    name: '橙',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: rgb(229, 98, 0),
  },
  {
    id: 'yellow',
    name: '黄',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: BS.WARNING,
  },
  {
    id: 'purple',
    name: '紫',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: rgb(111, 46, 242),
  },
  {
    id: 'green',
    name: '绿',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: BS.SUCCESS,
  },
];

export const SCHEMA_NAMES = COMPACT_CAPSULE_SCHEMAS.map((s) => NAME_PRFIX + s.name);
