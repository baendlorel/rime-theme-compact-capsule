import { rgba, rgb, BS, setAlpha } from './colors';

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
  hilitedCandidateTextColor: string;
  hilitedCandidateBackColor: string;
};

const ALPHA = 0.8;

export const COMPACT_CAPSULE_SCHEMAS = [
  {
    id: 'blue',
    name: '蓝',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(16, 119, 208), ALPHA),
  },
  {
    id: 'blue-dim',
    name: '深蓝',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(2, 77, 142), ALPHA),
  },
  {
    id: 'cyan',
    name: '青',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(78, 219, 177), ALPHA),
  },
  {
    id: 'sky',
    name: '天',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(77, 209, 236), ALPHA),
  },
  {
    id: 'red',
    name: '红',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(210, 50, 66), ALPHA),
  },
  {
    id: 'orange',
    name: '橙',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(255, 111, 0), ALPHA),
  },
  {
    id: 'yellow',
    name: '黄',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(BS.WARNING, ALPHA),
  },
  {
    id: 'purple',
    name: '紫',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(118, 60, 233), ALPHA),
  },
  {
    id: 'magenta',
    name: '品',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(214, 51, 132), ALPHA),
  },
  {
    id: 'green',
    name: '绿',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(BS.SUCCESS, ALPHA),
  },
  {
    id: 'green-light',
    name: '淡绿',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(82, 230, 84), ALPHA),
  },
];

export const SCHEMA_NAMES = COMPACT_CAPSULE_SCHEMAS.map((s) => NAME_PRFIX + s.name);
