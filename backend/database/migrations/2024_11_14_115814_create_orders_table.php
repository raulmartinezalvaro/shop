<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con users
            $table->enum('status', ['pending', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('total_price', 10, 2); // Precio total con 2 decimales
            $table->string('shipping_address');
            $table->timestamps(); // Campos created_at y updated_at
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('orders');
    }
    
}
