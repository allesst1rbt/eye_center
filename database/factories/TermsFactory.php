<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Terms>
 */
class TermsFactory extends Factory
{
    public function definition(): array
    {
        $days = fake()->randomElement([2, 30, 60, 90, 180, 365]);

        return [
            'expire_date'    => "{$days} dias",
            'days_to_expire' => "{$days} dias",
        ];
    }
}
