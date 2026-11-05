module.exports = {
    apps: [
        {
            name: 'Reverb',
            script: 'artisan',
            args: 'reverb:start',
            instances: 1,
            interpreter: 'php',
            cwd: '/var/www/atb/current',
            autorestart: true,
            max_memory_restart: '1G',
        },
    ],
};
