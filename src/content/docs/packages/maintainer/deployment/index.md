---
title: Deployment
description: Run Deployer with Maintainer's project recipe, SSH identity, and reusable tasks.
sidebar:
  order: 3
---

The Deployment group delegates to the consuming project's `vendor/bin/dep` while Maintainer manages the shared task recipe and temporary SSH identity lifecycle.

- [Run a deployment](./deploy/): configure `deploy.php`, select hosts, and forward Deployer options.
- [Unlock a deployment](./unlock/): remove a lock left by a failed deployment.
- [Repository tag selection](./repository-tags/): choose recent semantic tags interactively.
- [PM2 configuration](./pm2/): replace the remote user's PM2 process set from an ecosystem file.

Publish `deploy.php` before the first deployment:

```bash
vendor/bin/maintainer config:publish
```
