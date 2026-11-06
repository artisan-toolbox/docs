import { codeLanguage, loadCodeLanguage } from './codeLanguages';

const palette = [
    { color: '#94A3B8', className: 'text-slate-400', scopes: ['comment'] },
    {
        color: '#C4B5FD',
        className: 'text-violet-300',
        scopes: [
            'keyword',
            'storage',
            'punctuation.definition.template-expression',
        ],
    },
    {
        color: '#6EE7B7',
        className: 'text-emerald-300',
        scopes: ['string', 'markup.inline.raw'],
    },
    {
        color: '#FCD34D',
        className: 'text-amber-300',
        scopes: ['constant', 'variable.other.constant'],
    },
    {
        color: '#7DD3FC',
        className: 'text-sky-300',
        scopes: ['entity.name.function', 'support.function'],
    },
    {
        color: '#67E8F9',
        className: 'text-cyan-300',
        scopes: ['entity.name.type', 'support.type', 'support.class'],
    },
    {
        color: '#FDA4AF',
        className: 'text-rose-300',
        scopes: ['entity.name.tag', 'invalid'],
    },
    {
        color: '#FDBA74',
        className: 'text-orange-300',
        scopes: ['entity.other.attribute-name', 'variable.parameter'],
    },
];

const tokenClasses = new Map(
    palette.map(({ color, className }) => [color, className]),
);

const theme = {
    name: 'atb-dark',
    type: 'dark',
    colors: { 'editor.background': '#020617', 'editor.foreground': '#E2E8F0' },
    tokenColors: palette.map(({ color, scopes }) => ({
        scope: scopes,
        settings: { foreground: color },
    })),
};

let highlighterPromise;
const languagePromises = new Map();

async function highlighter() {
    highlighterPromise ??= Promise.all([
        import('shiki/core'),
        import('shiki/engine/javascript'),
    ])
        .then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
            createHighlighterCore({
                engine: createJavaScriptRegexEngine(),
                themes: [theme],
                langs: [],
            }),
        )
        .catch((error) => {
            highlighterPromise = undefined;
            throw error;
        });

    return highlighterPromise;
}

async function loadLanguage(instance, language) {
    const { id } = language;
    if (!languagePromises.has(id)) {
        languagePromises.set(
            id,
            instance.loadLanguage(loadCodeLanguage(id)).catch((error) => {
                languagePromises.delete(id);
                throw error;
            }),
        );
    }

    await languagePromises.get(id);
}

export async function highlightCode(code, languageId) {
    const language = codeLanguage(languageId);

    if (language.kind === 'plain') return [{ content: code, className: '' }];

    const instance = await highlighter();
    await loadLanguage(instance, language);

    const lines = instance.codeToTokensBase(code, {
        lang: language.id,
        theme: theme.name,
    });
    const tokens = [];
    let offset = 0;

    for (const line of lines) {
        for (const token of line) {
            if (token.offset > offset) {
                tokens.push({
                    content: code.slice(offset, token.offset),
                    className: '',
                });
            }

            const end = token.offset + token.content.length;
            tokens.push({
                content: code.slice(token.offset, end),
                className: tokenClasses.get(token.color?.toUpperCase()) ?? '',
            });
            offset = end;
        }
    }

    if (offset < code.length) {
        tokens.push({ content: code.slice(offset), className: '' });
    }

    return tokens;
}
