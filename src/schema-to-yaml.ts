import { BS, rgba } from './colors';
import {
  Theme,
  SchemaConfig,
  BORDER_COLOR,
  NAME_PRFIX,
  ID_PRFIX,
  AUTHOR,
} from './schemas';

const themeColors = (theme: Theme) => {
  let darkId = '';
  let darkName = '';
  let text = '';
  let back = '';
  let candidateText = '';
  let hilitedText = '';
  let hilitedBack = '';
  switch (theme) {
    case Theme.LIGHT:
      darkId = '';
      text = BS.DARK;
      back = rgba(255, 255, 255, 0.9);
      candidateText = BS.DARK;
      hilitedText = BS.DARK;
      hilitedBack = rgba(255, 255, 255, 0.9);
      break;
    case Theme.DARK:
      darkId = '_dark';
      darkName = '「暗」';
      text = BS.LIGHT;
      back = rgba(76, 85, 93, 0.86);
      candidateText = BS.LIGHT;
      hilitedText = BS.LIGHT;
      hilitedBack = rgba(76, 85, 93, 0.86);
      break;
  }
  return {
    darkId,
    darkName,
    text,
    back,
    candidateText,
    hilitedText,
    hilitedBack,
  };
};

export const schemaToYaml = (s: SchemaConfig) => {
  const _toYaml = (theme: Theme) => {
    const { darkId, darkName, text, back, candidateText, hilitedText, hilitedBack } =
      themeColors(theme);
    return `  'preset_color_schemes/${ID_PRFIX}${s.id}${darkId}':
    author: '${AUTHOR}'
    name: '${NAME_PRFIX + s.name + darkName}'
    text_color: ${text}
    back_color: ${back}
    border_color: ${BORDER_COLOR}
    candidate_text_color: ${candidateText}
    hilited_text_color: ${hilitedText}
    hilited_back_color: ${hilitedBack}
    hilited_candidate_text_color: ${s.hilitedCandidateTextColor}
    hilited_candidate_back_color: ${s.hilitedCandidateBackColor}
`;
  };
  return `${_toYaml(Theme.LIGHT)}${_toYaml(Theme.DARK)}`;
};
