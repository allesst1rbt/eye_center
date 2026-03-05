<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLensRequest;
use App\Http\Requests\UpdateLensRequest;
use App\Models\Lens;
use App\Models\Terms;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;

class LensController extends Controller
{
    public function index()
    {
        return response()->json(Lens::all());
    }

    public function bulkCreate(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,xls,csv|max:5120',
        ]);

        $spreadsheet = IOFactory::load($request->file('excel')->getPathname());
        $worksheet   = $spreadsheet->getActiveSheet();

        $lens = array_filter(
            array_slice($worksheet->rangeToArray('A1:A300'), 1),
            fn($row) => $row[0] !== null
        );

        $terms = array_filter(
            array_slice($worksheet->rangeToArray('B1:B30'), 1),
            fn($row) => $row[0] !== null
        );

        $daysToExpire = array_filter(
            array_slice($worksheet->rangeToArray('C1:C30'), 1),
            fn($row) => $row[0] !== null
        );

        // Sanitize cell values to prevent formula injection (=, +, -, @, |, %)
        $sanitize = fn($value) => is_string($value)
            ? ltrim(trim($value), '=+-@|%')
            : $value;

        Lens::query()->delete();
        Terms::query()->delete();

        foreach ($lens as $row) {
            Lens::create(['name' => $sanitize($row[0])]);
        }

        $daysToExpire = array_values($daysToExpire);
        foreach (array_values($terms) as $index => $row) {
            Terms::create([
                'expire_date'    => $sanitize($row[0]),
                'days_to_expire' => $sanitize($daysToExpire[$index][0] ?? ''),
            ]);
        }

        return response()->json(null, 201);
    }

    public function store(StoreLensRequest $request)
    {
        return response()->json(Lens::create($request->validated()), 201);
    }

    public function show(Lens $lens)
    {
        return response()->json($lens);
    }

    public function update(UpdateLensRequest $request, Lens $lens)
    {
        $lens->update($request->validated());

        return response()->json($lens);
    }

    public function destroy(Lens $lens)
    {
        $lens->delete();

        return response()->json(null, 204);
    }
}
