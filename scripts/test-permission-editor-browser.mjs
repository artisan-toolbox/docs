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

async function verifyCatalog(dialog) {
    const sidebar = dialog.getByRole('navigation', { name: 'Permission sections' });
    const notebooks = dialog.locator('wa-accordion-item').filter({ hasText: 'Notebooks' });
    const roles = dialog.locator('wa-accordion-item').filter({ hasText: 'Roles' });
    const workflow = dialog.locator('wa-accordion-item').filter({ hasText: 'Publishing workflow' });
    const search = dialog.getByRole('searchbox', { name: 'Find a permission or role' });
    const exportRow = notebooks.locator('li').filter({ hasText: 'Export CSV' });

    await sidebar.getByText('Permission groups', { exact: true }).waitFor();
    await sidebar.getByText('Role assignments', { exact: true }).waitFor();
    await dialog.getByRole('heading', { name: 'Role assignments', exact: true }).waitFor();
    await notebooks.getByText('2 of 2 allowed', { exact: true }).waitFor();
    await exportRow.getByText('Allowed', { exact: true }).waitFor();
    await notebooks.locator('wa-icon[name="book-open"][family="classic"]').waitFor();
    await exportRow.locator('wa-icon[name="file-export"][family="classic"]').waitFor();

    await workflow.getByRole('button', { name: /Publishing workflow/ }).click();
    await workflow.locator('[data-ability="workflow::draft"]').waitFor();
    await dialog.locator(exportPermission).waitFor();

    await sidebar.getByRole('button', { name: 'Roles', exact: true }).click();
    await notebooks.locator(exportPermission).waitFor({ state: 'detached' });
    await workflow.locator('[data-ability="workflow::draft"]').waitFor({ state: 'detached' });
    const rolesHeader = roles.getByRole('button', { name: /Roles/ });
    await dialog
        .page()
        .waitForFunction(
            (id) => document.getElementById(id)?.matches(':focus-within'),
            await roles.getAttribute('id'),
        );
    assert.equal(await rolesHeader.isVisible(), true);
    await roles.getByText('1 of 2 assigned', { exact: true }).waitFor();
    await roles.getByText('Assigned', { exact: true }).waitFor();
    await roles.getByText('Unassigned', { exact: true }).waitFor();
    await roles
        .getByRole('listitem')
        .filter({ hasText: 'Reviewer' })
        .getByText('Unassigned', { exact: true })
        .click();
    await roles.getByText('2 of 2 assigned', { exact: true }).waitFor();

    await search.fill('reviewer');
    await roles.getByText('1 of 1 assigned', { exact: true }).waitFor();
    await notebooks.waitFor({ state: 'detached' });
    await search.fill('export');
    await notebooks.getByText('1 of 1 allowed', { exact: true }).waitFor();
    await roles.waitFor({ state: 'detached' });
    await search.fill('');
    await dialog.getByText('2 unsaved changes', { exact: true }).waitFor();
}

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

    const edit = desktop.getByRole('button', { name: "Edit Jordan's permissions" });
    const tryJordan = desktop.getByRole('button', { name: "Try Jordan's CSV export" });
    await edit.waitFor();
    assert.deepEqual(methods, []);

    const [denied] = await Promise.all([desktop.waitForResponse(isExport), tryJordan.click()]);
    assert.equal(denied.status(), 403);
    await desktop.getByText('403 Forbidden. CSV export denied.', { exact: true }).waitFor();

    const dialog = desktop.locator(editor);
    await edit.click();
    await dialog.getByText('Jordan Lee', { exact: true }).waitFor();
    const checkbox = dialog.getByRole('checkbox', { name: 'Export CSV' });
    await dialog
        .getByRole('listitem')
        .filter({ hasText: 'Export CSV' })
        .getByText('Denied', { exact: true })
        .click();
    assert.equal(await checkbox.isChecked(), true);
    await dialog.getByText('1 unsaved change', { exact: true }).waitFor();
    await verifyCatalog(dialog);
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
    const values = (await loaded.json()).values;
    assert.equal(values['notebooks::export'], true);
    assert.equal(values['role::reviewer'], true);
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
        'Permission editor demo verifies catalog icons, focus, summaries, role and permission drafts, saving, and mobile read-only access.',
    );
}

try {
    await verifyEditor();
} finally {
    await browser.close();
}
