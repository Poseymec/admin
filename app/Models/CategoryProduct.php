<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class CategoryProduct extends Model
{
    use HasFactory, HasTranslations;

    /**
     * Les colonnes traduisibles.
     */
    public array $translatable = ['name'];

    /**
     * Les attributs attribuables en masse.
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Relation inverse : produits appartenant à cette catégorie.
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
