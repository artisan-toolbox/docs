<?php

namespace App\Demo\FrontAwesome\Printing;

use ArtisanToolbox\QzTrayConnector\Escpos;
use Illuminate\Http\JsonResponse;

final class DocumentsController
{
    public function __invoke(): JsonResponse
    {
        $receipt = Escpos::create(['columns' => 42])
            ->initialize()
            ->justify('center')
            ->bold()
            ->text("Artisan Toolbox\n")
            ->bold(false)
            ->text("Printing demonstration\n")
            ->justify('left')
            ->columns('Coffee beans', '18.00')
            ->columns('Total', '18.00')
            ->feed()
            ->text("Thank you!\n")
            ->cut()
            ->render();

        return response()->json([
            'receipt' => $receipt,
            'invoice' => base64_encode($this->invoicePdf()),
            'labels' => '^XA^PW800^LL400^FO40,40^A0N,48,48^FDArtisan Toolbox^FS^FO40,110^A0N,30,30^FDOrder ATB-1001^FS^XZ',
        ])->header('Cache-Control', 'private, no-store');
    }

    private function invoicePdf(): string
    {
        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 420 595] /Resources << /Font << /F1 7 0 R >> >> /Contents 4 0 R >>',
            '',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 420 595] /Resources << /Font << /F1 7 0 R >> >> /Contents 6 0 R >>',
            '',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        ];
        foreach ([3 => 'Invoice ATB-1001', 5 => 'Packing list ATB-1001'] as $index => $title) {
            $stream = 'BT /F1 24 Tf 40 530 Td ('.$title.') Tj 0 -50 Td /F1 14 Tf (Coffee beans - 18.00) Tj 0 -35 Td (Demonstration document) Tj ET';
            $objects[$index] = '<< /Length '.strlen($stream).">>\nstream\n".$stream."\nendstream";
        }

        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $index => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($index + 1)." 0 obj\n".$object."\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= 'xref'."\n0 ".count($offsets)."\n0000000000 65535 f \n";
        foreach (array_slice($offsets, 1) as $offset) {
            $pdf .= sprintf('%010d 00000 n ', $offset)."\n";
        }

        return $pdf.'trailer'."\n<< /Size ".count($offsets).' /Root 1 0 R >>'."\nstartxref\n".$xref."\n%%EOF\n";
    }
}
