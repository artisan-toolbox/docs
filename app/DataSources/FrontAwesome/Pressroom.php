<?php

namespace App\DataSources\FrontAwesome;

use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;

final class Pressroom extends CollectionDataSource implements WithOptions
{
    /** @return list<array{id: int, title: string, client: string, status: string, owner: string, due: string, note: string}> */
    public function source(): array
    {
        return [
            [
                'id' => 417,
                'title' => 'Magenta plate out of register',
                'client' => 'Solstice Editions',
                'status' => 'Needs action',
                'owner' => 'Nora Chen',
                'due' => '09:15',
                'note' => 'Fine outlines on the atlas cover show a magenta edge. The press operator sent a sample from sheet 40.',
            ],
            [
                'id' => 416,
                'title' => 'Approve the second foil proof',
                'client' => 'Field Notes Studio',
                'status' => 'Waiting',
                'owner' => 'Ravi Shah',
                'due' => '09:45',
                'note' => 'The copper foil is lighter on the uncoated stock. The client has both proofs for comparison.',
            ],
            [
                'id' => 412,
                'title' => 'Confirm the revised gatefold',
                'client' => 'Museum of Type',
                'status' => 'In progress',
                'owner' => 'Inez Cruz',
                'due' => '10:30',
                'note' => 'The inner panel needs another two millimeters of clearance before the folding team can start.',
            ],
            [
                'id' => 414,
                'title' => 'Swap stock for the insert',
                'client' => 'Northline Books',
                'status' => 'Needs action',
                'owner' => 'Owen Park',
                'due' => '10:50',
                'note' => 'The specified stock sold out. The buyer requested an alternative with the same opacity.',
            ],
            [
                'id' => 409,
                'title' => 'Trace the split delivery',
                'client' => 'Morrow Coffee',
                'status' => 'In progress',
                'owner' => 'Nora Chen',
                'due' => '11:15',
                'note' => 'The first pallet reached the café. The warehouse needs the dispatch scan for the second pallet.',
            ],
            [
                'id' => 418,
                'title' => 'Verify spine width',
                'client' => 'Atelier Moss',
                'status' => 'Waiting',
                'owner' => 'Ravi Shah',
                'due' => '11:40',
                'note' => 'The bindery measured a thicker text block and is waiting for an updated cover file.',
            ],
            [
                'id' => 408,
                'title' => 'Replace a low-resolution map',
                'client' => 'Solstice Editions',
                'status' => 'Waiting',
                'owner' => 'Inez Cruz',
                'due' => '12:10',
                'note' => 'Preflight flagged the map on page 19. The illustrator will send the original vector artwork.',
            ],
            [
                'id' => 415,
                'title' => 'Confirm spot varnish coverage',
                'client' => 'Field Notes Studio',
                'status' => 'Needs action',
                'owner' => 'Owen Park',
                'due' => '12:30',
                'note' => 'The varnish mask overlaps the fold. The finisher needs approval to reduce the coated area.',
            ],
            [
                'id' => 410,
                'title' => 'Check the carton labels',
                'client' => 'Northline Books',
                'status' => 'In progress',
                'owner' => 'Nora Chen',
                'due' => '13:00',
                'note' => 'Two cartons share the same destination code. The packing team requested a fresh label sheet.',
            ],
            [
                'id' => 407,
                'title' => 'Reprint the cyan test strip',
                'client' => 'Museum of Type',
                'status' => 'In progress',
                'owner' => 'Ravi Shah',
                'due' => '13:20',
                'note' => 'The first strip dried darker than the approved reference. A press check is booked after lunch.',
            ],
            [
                'id' => 406,
                'title' => 'Hold booklets for pickup',
                'client' => 'Atelier Moss',
                'status' => 'Waiting',
                'owner' => 'Owen Park',
                'due' => '14:00',
                'note' => 'The studio will collect the booklets in person once the courier booking has been canceled.',
            ],
            [
                'id' => 411,
                'title' => 'Review cropped sleeve artwork',
                'client' => 'Morrow Coffee',
                'status' => 'Needs action',
                'owner' => 'Inez Cruz',
                'due' => '15:10',
                'note' => 'The cutting path clips a line of text. The roastery needs an updated proof before packing.',
            ],
        ];
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(5)->pageSizeOptions([5, 10])
            ->globalSearchable([
                'title' => new SearchTarget('title'),
                'client' => new SearchTarget('client'),
                'owner' => new SearchTarget('owner'),
                'note' => new SearchTarget('note'),
            ])
            ->searchableField('title')
            ->filterableField('status', 'status', ['Needs action', 'In progress', 'Waiting'])
            ->orderableField('due')
            ->orderableField('client');
    }
}
