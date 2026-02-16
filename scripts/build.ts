import { execSync } from 'node:child_process';

execSync('tsx ../src/index.ts', { stdio: 'inherit' });
