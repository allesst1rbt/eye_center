<?php

namespace App\Http\Controllers;

use App\Models\Producers;
use Illuminate\Http\Request;

class ProducerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Producers::all());
    }

    public function store(Request $request)
    {
        $Producers =Producers::create($request->all());
        return response()->json(['message' => 'Producers created successfully', 'Producers' => $Producers]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Producers $Producers)
    {
        return response()->json($Producers);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producers $Producers)
    {
        $Producers->update($request->all());
        return response()->json(['message' => 'Producers updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producers $Producers)
    {
        Producers::destroy($Producers->id);
        return response()->json(['message' => 'Producers deleted successfully']);
    }
}
