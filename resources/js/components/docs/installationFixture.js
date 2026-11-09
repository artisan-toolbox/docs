import { execFileSync } from 'node:child_process';

const root = process.cwd();
const commands = JSON.parse(
    execFileSync(
        'php',
        [
            '-r',
            `require 'vendor/autoload.php'; $app = require 'bootstrap/app.php'; $app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); $commands = []; foreach ($app->make(App\\Documentation\\Documentation::class)->packages() as $package) { $id = $package->id; $commands[$id] = $app->make(App\\Documentation\\InstallationCommands::class)->forPackage($id); } echo json_encode($commands, JSON_THROW_ON_ERROR);`,
        ],
        { cwd: root, encoding: 'utf8' },
    ),
);

export const installationCommands = (id) => commands[id];
export const installationExample = (example, id) =>
    example.installationCommand ? commands[id][example.installationCommand].code : example.code;
