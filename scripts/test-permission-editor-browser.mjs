import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(origin.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(origin.hostname));
const guide = new URL('/docs/front-awesome/user-permission-editor', origin).href;
const permit = new URL('/docs/permit', origin).href;
const endpoint = '/demo/front-awesome/permission-editor';
const exportEndpoint = endpoint + '/export';
const editor = 'wa-dialog.permission-editor';
const exportPermission = '[data-ability="notebooks::export"]';
const isEndpoint = (traffic, method) =>
    new URL(traffic.url()).pathname === endpoint && traffic.request().method() === method;
const isExport = (response) => new URL(response.url()).pathname === exportEndpoint;

const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});

async function verifyEditor() {
    const desktop = await browser.newPage({
        ignoreHTTPSErrors: true,
        locale: 'en-US',
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
    });
    const errors = [];
    const methods = [];
    desktop.on('pageerror', (error) => errors.push(error.message));
    desktop.on('request', (request) => {
        if (new URL(request.url()).pathname === endpoint) methods.push(request.method());
    });

    assert.equal((await desktop.goto(permit)).status(), 200);
    await desktop.getByRole('link', { name: 'Try the permission editor', exact: true }).click();
    await desktop.waitForURL('**/docs/permit/management#try-the-editor');
    await desktop
        .getByRole('link', { name: 'Open the dialog from your user list', exact: true })
        .waitFor();

    const previewRequired = desktop.getByText('Front Awesome beta.4 required', {
        exact: true,
    });
    const edit = desktop.getByRole('button', { name: "Edit Jordan's permissions" });
    const tryJordan = desktop.getByRole('button', { name: "Try Jordan's CSV export" });
    await edit.or(previewRequired).waitFor();
    assert.deepEqual(methods, []);

    const [denied] = await Promise.all([desktop.waitForResponse(isExport), tryJordan.click()]);
    assert.equal(denied.status(), 403);
    await desktop.getByText('403 Forbidden. CSV export denied.', { exact: true }).waitFor();

    if (await previewRequired.isVisible()) {
        assert.equal(await edit.count(), 0);
        const [allowed] = await Promise.all([
            desktop.waitForResponse(isExport),
            desktop.getByRole('button', { name: "Try Avery's CSV export" }).click(),
        ]);
        assert.equal(allowed.status(), 200);
        await desktop
            .getByRole('status')
            .getByText(/1,Field notes/)
            .waitFor();
        assert.deepEqual(errors, []);
        console.log(
            'Permit demo exercises denied and allowed exports with the installed-release fallback.',
        );
        return;
    }

    const dialog = desktop.locator(editor);
    await edit.click();
    await dialog.getByText('Jordan Lee', { exact: true }).waitFor();
    const checkbox = dialog.locator(exportPermission);
    await checkbox.locator('[part~="control"]').click();
    await dialog.getByText('1 unsaved change', { exact: true }).waitFor();
    assert.deepEqual(methods, ['GET']);

    const [saved] = await Promise.all([
        desktop.waitForResponse((response) => isEndpoint(response, 'PUT')),
        dialog.getByRole('button', { name: 'Save changes' }).click(),
    ]);
    assert.equal(saved.status(), 204);
    await dialog.getByText('Permissions saved.', { exact: true }).waitFor();
    await checkbox.waitFor();
    assert.deepEqual(methods, ['GET', 'PUT', 'GET']);

    await desktop.keyboard.press('Escape');
    await desktop.locator(editor + '[open]').waitFor({ state: 'hidden' });
    const [loaded] = await Promise.all([
        desktop.waitForResponse((response) => isEndpoint(response, 'GET')),
        edit.click(),
    ]);
    assert.equal((await loaded.json()).values['notebooks::export'], true);
    await desktop.keyboard.press('Escape');
    await desktop.locator(editor + '[open]').waitFor({ state: 'hidden' });
    const [allowed] = await Promise.all([desktop.waitForResponse(isExport), tryJordan.click()]);
    assert.equal(allowed.status(), 200);
    await desktop
        .getByRole('status')
        .getByText(/1,Field notes/)
        .waitFor();

    await desktop
        .getByRole('link', { name: 'Open the dialog from your user list', exact: true })
        .click();
    await desktop.waitForURL(guide);
    await desktop
        .getByRole('link', { name: 'Connect the editor to Permit', exact: true })
        .waitFor();
    assert.deepEqual(errors, []);

    const mobile = await browser.newPage({
        ignoreHTTPSErrors: true,
        locale: 'en-US',
        viewport: { width: 390, height: 844 },
        colorScheme: 'dark',
    });
    assert.equal((await mobile.goto(guide)).status(), 200);
    await mobile.getByRole('button', { name: "View Avery's permissions" }).click();
    const mobileDialog = mobile.locator(editor);
    await mobileDialog.getByText('Avery Brooks', { exact: true }).waitFor();
    await mobileDialog.getByText('Read only. You can view these permissions.').waitFor();
    assert.equal(await mobileDialog.getByRole('button', { name: 'Save changes' }).count(), 0);
    assert.equal(
        await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
    );
    console.log(
        'Permission editor demo saves and reloads an editable account and supports mobile read only.',
    );
}

try {
    await verifyEditor();
} finally {
    await browser.close();
}
