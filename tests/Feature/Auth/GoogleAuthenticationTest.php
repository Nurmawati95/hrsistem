<?php

use App\Models\Employee;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as GoogleUser;

test('google redirect route redirects to google oauth', function () {
    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect();
    $this->assertStringContainsString('accounts.google.com', $response->headers->get('Location'));
});

test('google callback authenticates existing user and updates google attributes', function () {
    $user = User::factory()->create([
        'email' => 'employee@company.com',
        'role' => User::ROLE_ADMIN,
    ]);

    $googleUserMock = Mockery::mock(GoogleUser::class);
    $googleUserMock->shouldReceive('getId')->andReturn('google-id-12345');
    $googleUserMock->shouldReceive('getName')->andReturn('Updated Name');
    $googleUserMock->shouldReceive('getNickname')->andReturn('employee');
    $googleUserMock->shouldReceive('getEmail')->andReturn('employee@company.com');
    $googleUserMock->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/avatar.jpg');

    $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $providerMock->shouldReceive('user')->andReturn($googleUserMock);

    Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

    $response = $this->get(route('auth.google.callback'));

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard'));

    $user->refresh();
    expect($user->google_id)->toBe('google-id-12345')
        ->and($user->avatar)->toBe('https://lh3.googleusercontent.com/avatar.jpg');
});

test('google callback automatically creates new user with karyawan role', function () {
    $googleUserMock = Mockery::mock(GoogleUser::class);
    $googleUserMock->shouldReceive('getId')->andReturn('google-id-99999');
    $googleUserMock->shouldReceive('getName')->andReturn('Budi Santoso');
    $googleUserMock->shouldReceive('getNickname')->andReturn('budi');
    $googleUserMock->shouldReceive('getEmail')->andReturn('budi@company.com');
    $googleUserMock->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/budi.jpg');

    $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $providerMock->shouldReceive('user')->andReturn($googleUserMock);

    Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

    $response = $this->get(route('auth.google.callback'));

    $newUser = User::where('email', 'budi@company.com')->first();
    expect($newUser)->not->toBeNull();
    expect($newUser->role)->toBe(User::ROLE_KARYAWAN);
    expect($newUser->google_id)->toBe('google-id-99999');

    $this->assertAuthenticatedAs($newUser);
    $response->assertRedirect(route('dashboard'));
});

test('google callback connects existing employee record if user_id is null', function () {
    $employee = Employee::create([
        'employee_number' => 'EMP-TEST-001',
        'first_name' => 'Siti',
        'last_name' => 'Aminah',
        'email' => 'siti@company.com',
        'hire_date' => now(),
        'employment_status' => 'permanent',
    ]);

    $googleUserMock = Mockery::mock(GoogleUser::class);
    $googleUserMock->shouldReceive('getId')->andReturn('google-id-88888');
    $googleUserMock->shouldReceive('getName')->andReturn('Siti Aminah');
    $googleUserMock->shouldReceive('getNickname')->andReturn('siti');
    $googleUserMock->shouldReceive('getEmail')->andReturn('siti@company.com');
    $googleUserMock->shouldReceive('getAvatar')->andReturn(null);

    $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $providerMock->shouldReceive('user')->andReturn($googleUserMock);

    Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

    $this->get(route('auth.google.callback'));

    $employee->refresh();
    expect($employee->user_id)->not->toBeNull();
});

test('google callback redirects to login with error on exception', function () {
    $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $providerMock->shouldReceive('user')->andThrow(new Exception('OAuth failed'));

    Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

    $response = $this->get(route('auth.google.callback'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['email']);
});
