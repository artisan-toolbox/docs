import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCLI } from '../documentation/agent-standards/sync.mjs';

export {
    releaseStandards,
    syncStandards,
} from '../documentation/agent-standards/sync.mjs';

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
    runCLI();
