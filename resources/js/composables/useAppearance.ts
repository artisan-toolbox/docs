import { usePreferences } from '@artisan-toolbox/front-awesome';
import type { Appearance, ResolvedAppearance } from '@/types';

export type { Appearance, ResolvedAppearance };

export function useAppearance() {
    const preferences = usePreferences();

    return {
        appearance: preferences.appearance,
        resolvedAppearance: preferences.resolvedAppearance,
        updateAppearance: preferences.setAppearance,
        pending: preferences.pending,
        error: preferences.error,
    };
}
