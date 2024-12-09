<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNamesToCategoryProductTable extends Migration
{
    public function up()
    {
        Schema::table('category_product', function (Blueprint $table) {
            $table->string('product_name')->nullable(); // Nombre del producto
            $table->string('category_name')->nullable(); // Nombre de la categoría
        });
    }

    public function down()
    {
        Schema::table('category_product', function (Blueprint $table) {
            $table->dropColumn('product_name');
            $table->dropColumn('category_name');
        });
    }
}
