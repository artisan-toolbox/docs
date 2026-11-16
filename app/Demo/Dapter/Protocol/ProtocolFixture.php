<?php

namespace App\Demo\Dapter\Protocol;

use Composer\InstalledVersions;
use Illuminate\Filesystem\Filesystem;
use stdClass;

final class ProtocolFixture
{
    /**
     * @return stdClass&object{fixture: stdClass&object{rows: list<stdClass>, per_page: int, per_page_options: list<int>}, requests: list<stdClass>}
     */
    public static function contract(): stdClass
    {
        return json_decode(
            (new Filesystem)->get(InstalledVersions::getInstallPath('artisan-toolbox/dapter').'/resources/contracts/read-v1.json'),
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
