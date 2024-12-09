<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStatusEnumInOrders extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Crear una nueva columna temporal para el nuevo enum
            $table->enum('status_new', ['pendiente', 'enviado', 'entregado', 'cancelado'])->default('pendiente');
        });

        // Transferir los datos de la columna antigua a la nueva
        DB::table('orders')->update(['status_new' => DB::raw("CASE 
            WHEN status = 'pending' THEN 'pendiente'
            WHEN status = 'shipped' THEN 'enviado'
            WHEN status = 'delivered' THEN 'entregado'
            WHEN status = 'cancelled' THEN 'cancelado'
            ELSE 'pendiente' 
        END")]);

        Schema::table('orders', function (Blueprint $table) {
            // Eliminar la columna antigua y renombrar la nueva
            $table->dropColumn('status');
            $table->renameColumn('status_new', 'status');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Crear una columna temporal para revertir los cambios
            $table->enum('status_old', ['pending', 'shipped', 'delivered', 'cancelled'])->default('pending');
        });

        // Revertir los datos de la columna nueva a la antigua
        DB::table('orders')->update(['status_old' => DB::raw("CASE 
            WHEN status = 'pendiente' THEN 'pending'
            WHEN status = 'enviado' THEN 'shipped'
            WHEN status = 'entregado' THEN 'delivered'
            WHEN status = 'cancelado' THEN 'cancelled'
            ELSE 'pending'
        END")]);

        Schema::table('orders', function (Blueprint $table) {
            // Eliminar la columna nueva y renombrar la antigua
            $table->dropColumn('status');
            $table->renameColumn('status_old', 'status');
        });
    }
}
