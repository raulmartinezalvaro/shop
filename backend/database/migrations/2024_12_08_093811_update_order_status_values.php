<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrderStatusValues extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Crear una nueva columna temporal con los valores actualizados
            $table->enum('status_new', [
                'carrito',
                'pendiente de gestión',
                'pendiente de envío',
                'enviado',
                'entregado',
                'cancelado'
            ])->default('carrito');
        });

        // Transferir los datos de la columna antigua a la nueva con los nuevos valores
        DB::table('orders')->update(['status_new' => DB::raw("
            CASE 
                WHEN status = 'carrito' THEN 'carrito'
                WHEN status = 'pendiente' THEN 'pendiente de gestión'
                WHEN status = 'enviado' THEN 'enviado'
                WHEN status = 'entregado' THEN 'entregado'
                WHEN status = 'cancelado' THEN 'cancelado'
                ELSE 'carrito' 
            END
        ")]);

        Schema::table('orders', function (Blueprint $table) {
            // Eliminar la columna antigua y renombrar la nueva columna
            $table->dropColumn('status');
            $table->renameColumn('status_new', 'status');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Crear una nueva columna temporal para revertir los cambios
            $table->enum('status_old', [
                'carrito',
                'pendiente',
                'enviado',
                'entregado',
                'cancelado'
            ])->default('carrito');
        });

        // Revertir los datos de la columna actual a la antigua
        DB::table('orders')->update(['status_old' => DB::raw("
            CASE 
                WHEN status = 'carrito' THEN 'carrito'
                WHEN status = 'pendiente de gestión' THEN 'pendiente'
                WHEN status = 'pendiente de envío' THEN 'pendiente'
                WHEN status = 'enviado' THEN 'enviado'
                WHEN status = 'entregado' THEN 'entregado'
                WHEN status = 'cancelado' THEN 'cancelado'
                ELSE 'carrito'
            END
        ")]);

        Schema::table('orders', function (Blueprint $table) {
            // Eliminar la columna actual y renombrar la antigua
            $table->dropColumn('status');
            $table->renameColumn('status_old', 'status');
        });
    }
}
