<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTermsRequest;
use App\Http\Requests\UpdateTermsRequest;
use App\Models\Terms;

class TermsController extends Controller
{
    public function index()
    {
        return response()->json(Terms::all());
    }

    public function store(StoreTermsRequest $request)
    {
        return response()->json(Terms::create($request->validated()), 201);
    }

    public function show(Terms $terms)
    {
        return response()->json($terms);
    }

    public function update(UpdateTermsRequest $request, Terms $terms)
    {
        $terms->update($request->validated());

        return response()->json($terms);
    }

    public function destroy(Terms $terms)
    {
        $terms->delete();

        return response()->json(null, 204);
    }
}
