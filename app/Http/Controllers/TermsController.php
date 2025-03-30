<?php

namespace App\Http\Controllers;

use App\Models\Terms;
use Illuminate\Http\Request;

class TermsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $terms = Terms::all();
        return response()->json($terms);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $terms = Terms::create($request->all());
        return response()->json($terms);
    }

    /**
     * Display the specified resource.
     */
    public function show(Terms $terms)
    {
        return response()->json($terms);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Terms $terms)
    {
        $terms->update($request->all());
        return response()->json($terms);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Terms $terms)
    {
        $terms->delete();
        return response()->json(null, 204);
    }
}