<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\CategoryProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryProductController extends Controller
{
    public function index()
    {
        return CategoryProduct::select('id', 'name', 'slug')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name.en' => 'required|string|max:255',
            'name.fr' => 'required|string|max:255',
            'slug'    => 'required|alpha_dash|unique:category_products,slug',
        ], $this->validationMessages());

        $category = CategoryProduct::create([
            'name' => $validated['name'],
            'slug' => Str::of($validated['slug'])->lower()->ascii()->toString(),
        ]);

        return response()->json($category, 201);
    }

    public function show(CategoryProduct $categoryProduct)
    {
        return $categoryProduct;
    }

    public function update(Request $request, CategoryProduct $categoryProduct)
    {
        $validated = $request->validate([
            'name.en' => 'required|string|max:255',
            'name.fr' => 'required|string|max:255',
            'slug'    => 'required|alpha_dash|unique:category_products,slug,' . $categoryProduct->id,
        ], $this->validationMessages());

        $categoryProduct->update([
            'name' => $validated['name'],
            'slug' => Str::of($validated['slug'])->lower()->ascii()->toString(),
        ]);

        return response()->json($categoryProduct);
    }

    public function destroy(CategoryProduct $categoryProduct)
    {
        if ($categoryProduct->products()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une catégorie associée à des produits.',
            ], 400);
        }

        $categoryProduct->delete();

        return response()->json(null, 204);
    }

    protected function validationMessages(): array
    {
        return [
            'name.en.required' => 'Le nom en anglais est obligatoire.',
            'name.en.string'   => 'Le nom en anglais doit être une chaîne de caractères.',
            'name.en.max'      => 'Le nom en anglais ne doit pas dépasser 255 caractères.',

            'name.fr.required' => 'Le nom en français est obligatoire.',
            'name.fr.string'   => 'Le nom en français doit être une chaîne de caractères.',
            'name.fr.max'      => 'Le nom en français ne doit pas dépasser 255 caractères.',

            'slug.required'    => 'Le slug est obligatoire.',
            'slug.alpha_dash'  => 'Le slug ne peut contenir que des lettres, chiffres, tirets (-) ou underscores (_).',
            'slug.unique'      => 'Ce slug est déjà utilisé. Veuillez en choisir un autre.',
        ];
    }
}
