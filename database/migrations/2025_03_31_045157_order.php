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
            $table->string('customer_email')->nullable(true);
            $table->string('customer_number');
            $table->string('customer_birthdate');
            $table->boolean('order_confirmation')->default('false');
            $table->boolean('order_remember')->default('false');


            $table->foreignId(column: 'lens_id');
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
