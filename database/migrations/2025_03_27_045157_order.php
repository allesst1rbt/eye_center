<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_number');
            $table->foreignId(column: 'lens_id');
            $table->string('customer_signature');
            $table->foreignId(column: 'terms_id');

            $table->timestamps();

            // Foreign key constraint
            $table->foreign('lens_id')
                  ->references('id')
                  ->on('lenses')
                  ->onDelete('restrict');
            $table->foreign('terms_id')
                  ->references('id')
                  ->on('terms')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
