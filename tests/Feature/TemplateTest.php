<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

test('template route returns a response', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->first();
    $response = $this->actingAs($admin)->get(route('employees.template'));
    echo 'Status: '.$response->getStatusCode().PHP_EOL;
    echo 'Content-Type: '.$response->headers->get('Content-Type').PHP_EOL;
    $response->assertSuccessful();
});
