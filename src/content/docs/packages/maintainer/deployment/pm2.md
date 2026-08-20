---
title: PM2 Configuration
description: Replace and persist the remote user's PM2 processes from an ecosystem file.
sidebar:
  order: 4
---

The contribution recipe exposes the opt-in `pm2:config` task. Configure an ecosystem file relative to `release_path`, then attach the task after the new release becomes current:

```php
set('pm2_config_file', 'ecosystem.config.cjs');

after('deploy:symlink', 'pm2:config');
```

The default executable is `pm2`. Override it when necessary:

```php
set('bin/pm2', '/usr/local/bin/pm2');
```

## Task behavior

`pm2:config` validates the configuration, executable, release path, and ecosystem file. It then reads `pm2 jlist` as JSON:

1. when processes exist, it runs `pm2 delete all`;
2. when the list is empty, it skips deletion to avoid PM2's non-zero “nothing to delete” result;
3. it starts the selected ecosystem with `--update-env`;
4. it runs `pm2 save`.

The ecosystem file is authoritative. Deleting the previous set ensures removed or renamed applications, a changed filename, and updated process parameters are reflected in PM2.

## Invoke it from another task

```php
task('deploy:services', function (): void {
    invoke('pm2:config');
});
```

`invoke()` must run inside a Deployer task. Calling it while recipes are loading occurs before Deployer initializes its host, logger, and output services.

## Operational warning

The task deletes every PM2 process owned by the remote user and introduces downtime during replacement. Use a dedicated deployment user or otherwise ensure that its PM2 process set belongs only to this project.
