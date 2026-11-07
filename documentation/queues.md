# Run queued documentation demos

Use this guide when operating the documentation application's Redis queues with Laravel Horizon.
Run all commands from the `docs` application directory.
The application uses the installed Horizon package's supervisors and dashboard instead of implementing another queue monitor.

## Separate jobs from broadcast delivery

Horizon runs on the documentation server and processes its Redis queues. The Reverb application operated by WSS Software delivers WebSocket messages as an external service. That application does not run Horizon for this site. Do not start `reverb:start` on the documentation server.

The job captures the reader's session target and publishes its result to the external Reverb application. The browser connects to that same application's public endpoint. Private-channel authorization remains in the documentation application.

The committed `.env.example` contains empty application ID, key, secret, and host placeholders. Fill the private server environment with the WSS application settings:

| Variable                                                                            | Purpose                                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `BROADCAST_CONNECTION`                                                              | Select `reverb`.                                                                    |
| `REVERB_APP_ID`                                                                     | Identify the WSS Reverb application used by the backend.                            |
| `REVERB_APP_KEY`                                                                    | Supply the application's public connection key.                                     |
| `REVERB_APP_SECRET`                                                                 | Sign backend requests and private-channel authorization. Keep this server-side.     |
| `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME`                                       | Address the external broadcast endpoint. HTTPS on port 443 is the template default. |
| `VITE_REVERB_APP_KEY`, `VITE_REVERB_HOST`, `VITE_REVERB_PORT`, `VITE_REVERB_SCHEME` | Supply only the public browser connection settings during the frontend build.       |

The template derives the `VITE_` values from their corresponding backend settings. Keep the application secret out of `VITE_` variables, browser props, source panels, and committed files. Changing browser settings requires another frontend build; changing cached Laravel settings requires the normal deployment optimization step. Configure the permitted browser origins in the WSS Reverb application for the documentation environments you intend to use.

## Prepare the application

Use the application's declared PHP version with the Redis, PCNTL, and POSIX extensions.
Provide a reachable Redis server and configure its connection in the server environment.
Horizon requires Redis queues and does not support Redis Cluster.
Keep Redis credentials on the server.

Install backend dependencies before frontend dependencies so Composer-delivered package entry points exist.

```sh
composer install
npm ci
npm run build
php artisan migrate --force
```

Set the application's queue connection before starting workers.

```dotenv
QUEUE_CONNECTION=redis
REDIS_QUEUE=default
REDIS_QUEUE_RETRY_AFTER=90
```

Configure the existing `REDIS_HOST`, `REDIS_PORT`, and authentication settings for your Redis service.
Use a separate Redis database or prefix for each application environment.
After changing environment values, rebuild any cached configuration using your normal deployment workflow.

## Start the workers

The repository's `pm2.config.cjs` declares one `Horizon ATB` process running `php artisan horizon` from the documentation server's current release. It declares no local Reverb server, separate `queue:work`, or scheduler process. Applying this configuration is an operator action during deployment.

To run the worker directly for an intentional foreground verification, use the following command instead of running a second master alongside PM2:

```sh
php artisan horizon
```

The `supervisor-app` supervisor processes the `default` Redis queue.
The separate `supervisor-demos` supervisor processes only `demos`.
Production allows two application workers and one demo worker.
Local and other environments allow one worker for each queue.
Keep `REDIS_QUEUE=default` aligned with the application supervisor when changing queue configuration.

Public demo jobs must explicitly select the Redis connection and `demos` queue.
Do not send public demo jobs to `default`, which is reserved for application work.
Only dispatch a demo job after the reader starts the example.
The dedicated demo supervisor bounds concurrency, but Redis and host resources remain shared.
Keep request limits and finite job workloads in the demo endpoints.

Demo workers allow one attempt and a 30-second timeout.
Application workers allow one attempt and a 60-second timeout.
Keep each job timeout below its supervisor timeout, and keep both supervisor timeouts below Redis `retry_after`.
With the documented 90-second retry interval, a timed-out worker stops before Redis makes the job available again.
Avoid job-level `$tries` or `$timeout` overrides that exceed these limits.

Open the demo page and start its queued example.
Confirm that the example completes and the job appears on Horizon's `demos` queue.
Without Redis and a running worker, queued demos cannot complete.

## Inspect jobs as staff

Sign in through the existing [email-code login](access.md), then open `/horizon`.
The dashboard and its API require a verified `@atb.dev.br` user in every environment, including local development.
Horizon does not create an account or send a login email when its page opens.
Guests return to `/login`, and authenticated users outside the allowed domain receive HTTP 403.

For worker status, run the following command.

```sh
php artisan horizon:status
```

Inspect completed and failed jobs in the Horizon dashboard after starting an example.
Avoid retrying a failed public demo unless its endpoint and job are safe to repeat.

## Maintain workers during deployment

PM2 restarts the Horizon master after exit. The configuration gives the master 90 seconds to shut down, longer than the current 60-second maximum supervisor job timeout. `treekill: false` lets Horizon's master handle SIGINT and terminate its supervisors and workers through its own shutdown sequence. Reassess this allowance when changing job limits. The separate Redis reservation retry interval does not define PM2's shutdown allowance.

The local Deployer sequence applies `pm2:config` after `deploy:publish`, then runs the existing `artisan:reload` stage. This makes `/var/www/atb/current` refer to the newly published release before Horizon starts. Starting PM2 before publication would boot the previous code. A PM2 failure at this stage happens after activation; it does not undo the symlink switch. Inspect the failure and use the operator's normal recovery or rollback procedure.

Do not run another `queue:work` process for the same queues alongside Horizon. Provision Redis, the PM2 daemon and its operating-system startup integration separately from application installation. No service is started by the configuration tests.

The application schedules `horizon:snapshot` every five minutes.
Run Laravel's scheduler through the deployment platform to populate Horizon's metrics graphs.
An installation without the scheduler can process jobs, but does not produce those snapshots.
The PM2 ecosystem deliberately does not add a `schedule:work` process. Keep scheduler ownership separate and avoid duplicate cron or scheduler invocations.

After deploying the new application code, gracefully terminate Horizon so the process monitor starts workers with that code.

```sh
php artisan horizon:terminate
```

This command finishes active jobs before the workers exit.
For deployment and supervisor options, follow the [Laravel 13 Horizon guide](https://laravel.com/framework/docs/13.x/horizon).

## Verify real delivery

### Diagnose a disabled queue button

The **Queue one job** button stays disabled until its access and configuration prerequisites are present. A running Horizon process does not enable the button. Read the message above the button in this order:

1. **Staff access is required.** Sign in with a verified `@atb.dev.br` account in the same browser session, then reopen the guide. Access to Horizon or logs in another session does not authorize this page.
2. **Server configuration is missing.** Check that Laravel resolves `broadcasting.default` to `reverb`, the Redis queue connection uses the `redis` driver, and the backend Reverb application ID, key, secret, and host are present. Rebuild cached configuration through the normal deployment workflow after correcting the server environment.
3. **Browser configuration is missing.** Provide the public `VITE_REVERB_APP_KEY` and `VITE_REVERB_HOST` during the frontend build. Rebuild the assets and reload the page. Laravel's configuration cache does not update values compiled into JavaScript.

The first unmet prerequisite is shown. Reopen the guide after correcting it to check the next prerequisite. Keep private settings server-side while diagnosing configuration. The ready message confirms that configuration is present; it does not check Redis connectivity, a running worker, Reverb delivery, or private-channel authorization.

### Confirm a queued completion

1. After applying the deployment, run `php artisan horizon:status` from the documentation release and confirm the `demos` supervisor in Horizon.
2. Open the Inertia delivery guide with a verified staff session. Check that configuration is present and the private subscription connects.
3. Select **Queue one job** once. Match its run identifier with the completed `CompleteDemo` job on the `demos` queue and the browser entry labeled `broadcast`.
4. Keep a second independent session open and confirm it receives no completion for that run identifier.
5. If no completion arrives, inspect the job failure, Redis connectivity, WSS endpoint, and channel authorization. The timeout does not prove that the job was canceled; do not resubmit automatically.

A fast worker can deliver the event before the HTTP response finishes. Validate real queued delivery and the session target rather than requiring one network arrival order. The demo keeps an observed completion and ignores callbacks from earlier runs when another run has started.

Automated tests cover the actual PM2 file, native Horizon provisioning, staff access, queue selection, configuration readiness, session targeting, and client lifecycle with external boundaries isolated. They do not establish that the deployed Horizon and WSS Reverb services are operating together. Record that separately after the operator verification.

The process settings follow [PM2 shutdown handling](https://pm2.keymetrics.io/docs/usage/signals-clean-restart/) and the installed Laravel Horizon command's SIGINT handler.
