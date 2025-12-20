<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\CategoryProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

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
        ], [
            'name.en.required' => 'Le nom en anglais est obligatoire.',
            'name.fr.required' => 'Le nom en français est obligatoire.',
            'name.en.string' => 'Le nom en anglais doit être une chaîne de caractères.',
            'name.fr.string' => 'Le nom en français doit être une chaîne de caractères.',
            'name.en.max' => 'Le nom en anglais ne doit pas dépasser 255 caractères.',
            'name.fr.max' => 'Le nom en français ne doit pas dépasser 255 caractères.',
        ]);

        // Générer le slug à partir du nom anglais
        $baseSlug = Str::of($validated['name']['en'])
            ->lower()
            ->ascii()
            ->replaceMatches('/[^a-z0-9]+/', '-')
            ->trim('-')
            ->toString();

        // Gérer l'unicité
        $slug = $baseSlug;
        $counter = 1;
        while (CategoryProduct::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        // Créer avec slug, puis ajouter les traductions
        $category = new CategoryProduct();
        $category->slug = $slug;
        $category->setTranslation('name', 'en', $validated['name']['en']);
        $category->setTranslation('name', 'fr', $validated['name']['fr']);
        $category->save();

        return response()->json($category->fresh(), 201);
    }

    public function show(CategoryProduct $categoryProduct)
    {
        return $categoryProduct;
    }

    public function update(Request $request, $id)
    {
        // Charger explicitement la catégorie
        $categoryProduct = CategoryProduct::findOrFail($id);

        $validated = $request->validate([
            'name.en' => 'required|string|max:255',
            'name.fr' => 'required|string|max:255',
        ], [
            'name.en.required' => 'Le nom en anglais est obligatoire.',
            'name.fr.required' => 'Le nom en français est obligatoire.',
            'name.en.string'   => 'Le nom en anglais doit être une chaîne de caractères.',
            'name.fr.string'   => 'Le nom en français doit être une chaîne de caractères.',
            'name.en.max'      => 'Le nom en anglais ne doit pas dépasser 255 caractères.',
            'name.fr.max'      => 'Le nom en français ne doit pas dépasser 255 caractères.',
        ]);

        try {
            // ✅ Utiliser setTranslation() pour chaque langue
            $categoryProduct->setTranslation('name', 'en', $validated['name']['en']);
            $categoryProduct->setTranslation('name', 'fr', $validated['name']['fr']);

            // Sauvegarder les modifications
            $saved = $categoryProduct->save();

            if (!$saved) {
                throw new \Exception('La sauvegarde a échoué');
            }

            // Recharger depuis la base de données
            $categoryProduct->refresh();

            Log::info('Category updated successfully:', [
                'id' => $categoryProduct->id,
                'name' => $categoryProduct->name,
            ]);

            return response()->json($categoryProduct);
        } catch (\Exception $e) {
            Log::error('Update category error:', [
                'id' => $categoryProduct->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
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
}
