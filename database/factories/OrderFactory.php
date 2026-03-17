<?php

namespace Database\Factories;

use App\Models\Lens;
use App\Models\Terms;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_name'      => fake()->name(),
            'customer_email'     => fake()->optional(0.7)->safeEmail(),
            'customer_number'    => '5511' . fake()->numerify('#########'),
            'customer_birthdate' => fake()->dateTimeBetween('-80 years', '-18 years')->format('d/m/Y'),
            'order_confirmation' => false,
            'order_remember'     => false,
            'employee_name'      => fake()->optional(0.5)->name(),
            'lens_id'            => Lens::factory(),
            'terms_id'           => Terms::factory(),
        ];
    }
}
