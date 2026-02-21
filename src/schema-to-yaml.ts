import { BS, rgba, setAlpha } from './colors';
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
  let hilitedLabel = '';
  let hilitedText = '';
  let hilitedBack = '';
  switch (theme) {
    case Theme.LIGHT:
      darkId = '';
      text = BS.DARK;
      back = rgba(255, 255, 255, 0.8);
      candidateText = BS.DARK;
      hilitedLabel = BS.LIGHT_SEMI_TRANS;
      hilitedText = BS.DARK;
      hilitedBack = rgba(255, 255, 255, 0.8);
      break;
    case Theme.DARK:
      darkId = '_dark';
      darkName = '「暗」';
      text = BS.LIGHT;
      back = rgba(76, 85, 93, 0.8);
      candidateText = BS.LIGHT;
      hilitedLabel = BS.GRAY_SEMI_TRANS;
      hilitedText = BS.LIGHT;
      hilitedBack = rgba(76, 85, 93, 0.8);
      break;
  }
  return {
    darkId,
    darkName,
    text,
    back,
    candidateText,
    hilitedLabel,
    hilitedText,
    hilitedBack,
  };
};

export const schemaToYaml = (s: SchemaConfig) => {
  const _toYaml = (theme: Theme) => {
    const shadowColor = setAlpha(s.hilitedCandidateBackColor, theme === Theme.DARK ? 0.46 : 0.34);
    const {
      darkId,
      darkName,
      text,
      back,
      candidateText,
      hilitedLabel,
      hilitedText,
      hilitedBack,
    } = themeColors(theme);
    return `  'preset_color_schemes/${ID_PRFIX}${s.id}${darkId}':
    author: '${AUTHOR}'
    color_format: rgba
    name: '${NAME_PRFIX + s.name + darkName}'
    text_color: ${text}
    back_color: ${back}
    border_color: ${BORDER_COLOR}
    shadow_color: ${shadowColor}
    candidate_text_color: ${candidateText}
    hilited_label_color: ${hilitedLabel}
    hilited_text_color: ${hilitedText}
    hilited_back_color: ${hilitedBack}
    hilited_candidate_text_color: ${s.hilitedCandidateTextColor}
    hilited_candidate_back_color: ${s.hilitedCandidateBackColor}
`;
  };
  return `${_toYaml(Theme.LIGHT)}${_toYaml(Theme.DARK)}`;
};
