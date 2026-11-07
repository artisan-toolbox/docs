import light192 from './artisan-toolbox-logo-light-192.webp?no-inline';
import light384 from './artisan-toolbox-logo-light-384.webp?no-inline';
import light576 from './artisan-toolbox-logo-light-576.webp?no-inline';
import dark192 from './artisan-toolbox-logo-dark-192.webp?no-inline';
import dark384 from './artisan-toolbox-logo-dark-384.webp?no-inline';
import dark576 from './artisan-toolbox-logo-dark-576.webp?no-inline';

export const brandLogos = {
    light: {
        src: light192,
        srcset: `${light192} 192w, ${light384} 384w, ${light576} 576w`,
        width: 1456,
        height: 500,
    },
    dark: {
        src: dark192,
        srcset: `${dark192} 192w, ${dark384} 384w, ${dark576} 576w`,
        width: 1456,
        height: 500,
    },
};
