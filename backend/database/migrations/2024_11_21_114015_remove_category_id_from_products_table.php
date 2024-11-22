<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveCategoryIdFromProductsTable extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']); // Elimina la clave foránea
            $table->dropColumn('category_id');   // Elimina la columna
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
        });
    }
}
