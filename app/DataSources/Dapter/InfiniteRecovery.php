<?php

namespace App\DataSources\Dapter;

final class InfiniteRecovery extends PagingSimple
{
    public function source(): array
    {
        abort_if(session('docs.dapter.infinite.fail', false), 503, 'The fictional notebook service is paused.');

        return parent::source();
    }
}
