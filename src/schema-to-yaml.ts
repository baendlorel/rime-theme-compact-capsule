import { BS, rgb, rgba } from './colors';
import { Theme, SchemaConfig, BORDER_COLOR } from './schemas';

const themeColors = (s: SchemaConfig) => {
  let darkName = '';
  let text = '';
  let back = '';
  let candidateText = '';
  let hilitedText = '';
  let hilitedBack = '';
  switch (s.type) {
    case Theme.LIGHT:
      darkName = '';
      text = BS.DARK;
      back = rgba(255, 255, 255, 0.9);
      candidateText = BS.DARK;
      hilitedText = BS.DARK;
      hilitedBack = rgba(255, 255, 255, 0.9);
      break;
    case Theme.DARK:
      darkName = '_dark';
      text = '0xFAF9F8';
      back = rgba(76, 85, 93, 0.86);
      candidateText = BS.LIGHT;
      hilitedText = BS.LIGHT;
      hilitedBack = rgba(76, 85, 93, 0.86);
      break;
  }
  return {
    darkName,
    text,
    back,
    candidateText,
    hilitedText,
    hilitedBack,
  };
};

export const schemaToYaml = (s: SchemaConfig) => {
  const { darkName, text, back, candidateText, hilitedText, hilitedBack } =
    themeColors(s);
  const yaml = `
  'preset_color_schemes/compact_capsule_${s.id}${darkName}':
    author: 'KasukabeTsumugi <futami16237@gmail.com>'
    name: '${s.name}'
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
