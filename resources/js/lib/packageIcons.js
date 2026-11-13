const names = {
    core: 'atb-core',
    dapter: 'atb-dapter',
    'dump-to-console': 'atb-dump-to-console',
    'front-awesome': 'atb-front-awesome',
    filoquent: 'atb-filoquent',
    maintainer: 'atb-maintainer',
    mosaicast: 'atb-mosaicast',
    qztray: 'atb-qztray',
};

export function packageIcon(id) {
    return Object.hasOwn(names, id) ? { name: names[id], family: 'kit-duotone' } : null;
}
