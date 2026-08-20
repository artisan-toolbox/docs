---
title: SSH Keys
description: Generate, display, and consume Maintainer's encrypted SSH identity.
sidebar:
  order: 3
---

## Generate the identity

Select **Maintainer secrets** in `config:publish`. Maintainer generates an OpenSSH Ed25519 key, uses the requested email as its comment, encrypts the private key with `maintainer_secrets.key`, and stores the ciphertext under `ssh_key`.

The key defaults to `APP_KEY` and may use Laravel's conventional `base64:` representation. See the [Configuration Reference](/packages/maintainer/configuration/reference/#secrets) for the complete secrets format.

## Display the keys

Print the decrypted private key:

```bash
vendor/bin/maintainer ssh:key
```

Derive and print the public key without persisting a second key value:

```bash
vendor/bin/maintainer ssh:public
```

The private command writes sensitive material to standard output. Use it only when the caller and terminal history are prepared to protect the value.

## Use the helpers

Laravel applications can use the Composer-autoloaded helpers without booting the Maintainer PHAR or starting a subprocess:

```php
$privateKey = maintainer_ssh_key();
$publicKey = maintainer_ssh_public_key();
```

Both helpers delegate to `ArtisanToolbox\Maintainer\Ssh\MaintainerSshKeys` and resolve the active Laravel container's `maintainer_secrets.key` and encrypted `ssh_key`. They throw an actionable runtime exception when either value is missing, malformed, or cannot be decrypted.

## Use the identity for deployment

The `deploy` and `deploy:unlock` commands decrypt the key into a restricted temporary file, pass only its path to Deployer, and delete it after the process exits. See [Run a Deployment](/packages/maintainer/deployment/deploy/#ssh-identity) for lifecycle and override details.
