const plainLanguage = {
    id: 'text',
    label: 'Plain text',
    kind: 'plain',
    icon: 'align-left',
};

const languages = [
    {
        id: 'shellscript',
        label: 'Shell',
        aliases: ['bash', 'sh', 'shell', 'zsh'],
        load: () => import('shiki/langs/shellscript.mjs'),
    },
    { id: 'php', label: 'PHP', load: () => import('shiki/langs/php.mjs') },
    {
        id: 'javascript',
        label: 'JavaScript',
        aliases: ['js'],
        load: () => import('shiki/langs/javascript.mjs'),
    },
    {
        id: 'typescript',
        label: 'TypeScript',
        aliases: ['ts'],
        load: () => import('shiki/langs/typescript.mjs'),
    },
    { id: 'vue', label: 'Vue', load: () => import('shiki/langs/vue.mjs') },
    {
        id: 'blade',
        label: 'Blade',
        load: () => import('shiki/langs/blade.mjs'),
    },
    { id: 'html', label: 'HTML', load: () => import('shiki/langs/html.mjs') },
    { id: 'css', label: 'CSS', load: () => import('shiki/langs/css.mjs') },
    { id: 'json', label: 'JSON', load: () => import('shiki/langs/json.mjs') },
    {
        id: 'yaml',
        label: 'YAML',
        aliases: ['yml'],
        load: () => import('shiki/langs/yaml.mjs'),
    },
    {
        id: 'dotenv',
        label: 'Environment',
        load: () => import('shiki/langs/dotenv.mjs'),
    },
    {
        id: 'nginx',
        label: 'Nginx',
        load: () => import('shiki/langs/nginx.mjs'),
    },
];

const languageRegistry = new Map(
    languages.flatMap(({ id, label, aliases = [], load }) => {
        const terminal = id === 'shellscript';
        const language = {
            id,
            label,
            kind: terminal ? 'terminal' : 'source',
            icon: terminal ? 'terminal' : 'file-code',
            load,
        };

        return [id, ...aliases].map((name) => [name, language]);
    }),
);

export function codeLanguage(input) {
    const entry = languageRegistry.get(input.trim().toLowerCase());
    if (!entry) return plainLanguage;
    return {
        id: entry.id,
        label: entry.label,
        kind: entry.kind,
        icon: entry.icon,
    };
}

export function loadCodeLanguage(id) {
    return languageRegistry.get(id).load();
}
