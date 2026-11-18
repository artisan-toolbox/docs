<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Contracts\WithCursorScope;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;

class PagingCursor extends PagingSimple implements WithCursorScope
{
    public function options(): StoreOptions
    {
        return $this->declaration()->pagingMode(PagingMode::Cursor);
    }

    public function cursorScope(): string
    {
        return 'fictional-notebooks:public-policy-v1:query-v1';
    }
}
