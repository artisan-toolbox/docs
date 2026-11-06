module.exports = {
    apps: [
        {
            name: 'Horizon ATB',
            script: 'artisan',
            args: 'horizon',
            instances: 1,
            interpreter: 'php',
            cwd: '/var/www/atb/current',
            autorestart: true,
            max_memory_restart: '1G',
            kill_timeout: 90000,
            treekill: false,
        },
    ],
};
