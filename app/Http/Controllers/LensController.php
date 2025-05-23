<?php

namespace App\Http\Controllers;

use App\Models\Lens;
use App\Models\Terms;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;
class LensController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lens = Lens::all();
        return response()->json($lens);
    }


    public function bulkCreate(Request $request)
    {
        Lens::query()->delete();
        Terms::query()->delete();

        $spreadsheet = IOFactory::load($request->excel->getPathName());
        $worksheet = $spreadsheet->getActiveSheet();
        $lens = $worksheet->rangeToArray('A1:A300');
        array_shift( array: $lens );
        $lens = array_filter($lens, fn($value) => $value[0]!== null);
        $terms = $worksheet->rangeToArray('B1:B30');
        array_shift( array: $terms );
        $terms = array_filter($terms, fn($value) => $value[0]!== null);
        $daysToExpire = $worksheet->rangeToArray('C1:C30');
        array_shift( array: $daysToExpire );
        $daysToExpire = array_filter($daysToExpire, fn($value) => $value[0]!== null);

        foreach($lens as $len) {
            Lens::firstOrCreate(['name' => $len[0]]);
        };

        foreach ($terms as $key => $term) {
            Terms::firstOrCreate(['expire_date' => $term[0], 'days_to_expire'=> $daysToExpire[$key][0]]);
        }
         return response()->json('', 201);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $lens = Lens::create($request->all());
        return response()->json($lens);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lens $lens)
    {
        return response()->json($lens);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, lens $lens)
    {
        $lens->update($request->all());
        return response()->json($lens);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lens $lens)
    {
        $lens->delete();
        return response()->json(null, 204);
    }
}
