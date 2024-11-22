<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('products');

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('SKU')->unique(); // Código de referencia del producto
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0); // Cantidad en inventario, por defecto 0
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Relación con categorías
            $table->string('image')->nullable();
            $table->decimal('discount', 5, 2)->default(0);
            $table->timestamps(); // Campos created_at y updated_at
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
