<?php

namespace App\Http\Controllers;

use App\Models\lens;
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
        $lens = lens::all();
        return response()->json($lens);
    }


    // public function bulkCreate(Request $request)
    // {
       
    //     $spreadsheet = IOFactory::load($request->excel->getPathName());
    //     $worksheet = $spreadsheet->getActiveSheet();
    //     $rows = $worksheet->toArray();
    //     $header = array_shift( $rows );
       

    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $lens = lens::create($request->all());
        return response()->json($lens);
    }

    /**
     * Display the specified resource.
     */
    public function show(lens $lens)
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
    public function destroy(lens $lens)
    {
        $lens->delete();
        return response()->json(null, 204);
    }
}
