import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { COMPACT_CAPSULE_SCHEMAS, SCHEMA_NAMES } from './schemas';
import { schemaToYaml } from './schema-to-yaml';

const main = () => {
  const WEASEL_CUSTOM = 'patch_weasel.custom.yaml';
  const DEFAULT_CUSTOM = 'patch_default.custom.yaml';

  const dist = join(process.cwd(), 'dist');
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
  const list = COMPACT_CAPSULE_SCHEMAS.map((schema) => schemaToYaml(schema));
  console.log(`total schemas: ${list.length}`);
  console.log(`generating following schemas :\n  ${SCHEMA_NAMES.join('\n  ')}`);
  const schemas = 'patch:\n' + list.join('');
  const styles = `  'style/layout':
    candidate_radius: 8
    corner_radius: 8
    hilite_padding_x: 10
    hilite_padding_y: 6
    margin_x: 0
    margin_y: 0
  'stype/horizontal': true
  'style/inline_preedit': true
    `;
  const weaselYaml = schemas + styles;
  console.log(`saving ${WEASEL_CUSTOM}`);
  writeFileSync(join(dist, WEASEL_CUSTOM), weaselYaml);

  const defaultYaml = `patch:
  'ascii_composer/good_old_caps_lock': false
  'ascii_composer/switch_key':
    Caps_Lock: commit_code
    Control_L: noop
    Control_R: noop
    Shift_L: noop
    Shift_R: noop
  'menu/page_size': 6`;
  console.log(`saving ${DEFAULT_CUSTOM}`);
  writeFileSync(join(dist, DEFAULT_CUSTOM), defaultYaml);
  console.log(`finished`);
};

main();
