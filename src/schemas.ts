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
    id: 'green-grass',
    name: '草绿',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(BS.SUCCESS, ALPHA),
  },
  {
    id: 'green',
    name: '绿',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(82, 230, 84), ALPHA),
  },

  // # 特种颜色
  {
    id: 'dark',
    name: '黑暗',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(49, 47, 47), ALPHA),
  },
  {
    id: 'rain',
    name: '雨云',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(188, 204, 224), ALPHA),
  },
  {
    id: 'rosewood',
    name: '玫瑰',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(202, 21, 81), ALPHA),
  },
  {
    id: 'dust-rose',
    name: '尘玫',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(193, 119, 103), ALPHA),
  },
  {
    id: 'tomato',
    name: '西红柿',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(251, 77, 61), ALPHA),
  },
  {
    id: 'sky',
    name: '天',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(77, 209, 236), ALPHA),
  },
  {
    id: 'mint-leaf',
    name: '薄荷',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(3, 206, 164), ALPHA),
  },
  {
    id: 'dusk-blue',
    name: '暮蓝',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(52, 89, 149), ALPHA),
  },
  {
    id: 'steel-blue',
    name: '钢铁蓝',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(109, 152, 186), ALPHA),
  },
  {
    id: 'tan',
    name: '香槟金',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(211, 185, 159), ALPHA),
  },
  {
    id: 'coffee-bean',
    name: '咖啡豆',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(33, 2, 3), ALPHA),
  },
  {
    id: 'raspberry',
    name: '树莓',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(216, 17, 89), ALPHA),
  },
  {
    id: 'vintage',
    name: '葡萄酒',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(143, 45, 86), ALPHA),
  },
  {
    id: 'blue-slate',
    name: '岩蓝',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(79, 98, 114), ALPHA),
  },
  {
    id: 'mauve-bark',
    name: '紫灰棕',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(108, 83, 78), ALPHA),
  },
  {
    id: 'royal-violet',
    name: '皇紫',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(123, 44, 191), ALPHA),
  },
  {
    id: 'mavue-magic',
    name: '魔法紫',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(199, 125, 255), ALPHA),
  },
  {
    id: 'indigo-violet',
    name: '靛紫',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(90, 24, 154), ALPHA),
  },
  {
    id: 'verdigris',
    name: '铜绿',
    hilitedCandidateTextColor: BS.LIGHT,
    hilitedCandidateBackColor: setAlpha(rgb(42, 157, 143), ALPHA),
  },
  {
    id: 'muted-olive',
    name: '橄榄',
    hilitedCandidateTextColor: BS.DARK,
    hilitedCandidateBackColor: setAlpha(rgb(173, 193, 120), ALPHA),
  },
];
export const SCHEMA_NAMES = COMPACT_CAPSULE_SCHEMAS.map((s) => NAME_PRFIX + s.name);
