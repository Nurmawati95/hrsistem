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

test('google callback rejects unregistered user who is not in users or employees table', function () {
    $googleUserMock = Mockery::mock(GoogleUser::class);
    $googleUserMock->shouldReceive('getId')->andReturn('google-id-99999');
    $googleUserMock->shouldReceive('getName')->andReturn('Orang Asing');
    $googleUserMock->shouldReceive('getNickname')->andReturn('asing');
    $googleUserMock->shouldReceive('getEmail')->andReturn('stranger@example.com');
    $googleUserMock->shouldReceive('getAvatar')->andReturn(null);

    $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $providerMock->shouldReceive('user')->andReturn($googleUserMock);

    Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

    $response = $this->get(route('auth.google.callback'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['email']);

    expect(User::where('email', 'stranger@example.com')->exists())->toBeFalse();
});

test('google callback connects and creates user for registered employee record', function () {
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

    $response = $this->get(route('auth.google.callback'));

    $newUser = User::where('email', 'siti@company.com')->first();
    expect($newUser)->not->toBeNull();
    expect($newUser->role)->toBe(User::ROLE_KARYAWAN);
    expect($newUser->google_id)->toBe('google-id-88888');

    $this->assertAuthenticatedAs($newUser);
    $response->assertRedirect(route('dashboard'));

    $employee->refresh();
    expect($employee->user_id)->toBe($newUser->id);
});

test('google callback rejects user with invalid role', function () {
    $user = User::factory()->create([
        'email' => 'disabled@company.com',
        'role' => 'disabled_role',
    ]);

    $googleUserMock = Mockery::mock(GoogleUser::class);
    $googleUserMock->shouldReceive('getId')->andReturn('google-id-77777');
    $googleUserMock->shouldReceive('getName')->andReturn('Disabled User');
    $googleUserMock->shouldReceive('getNickname')->andReturn('disabled');
    $googleUserMock->shouldReceive('getEmail')->andReturn('disabled@company.com');
    $googleUserMock->shouldReceive('getAvatar')->andReturn(null);

    $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $providerMock->shouldReceive('user')->andReturn($googleUserMock);

    Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

    $response = $this->get(route('auth.google.callback'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['email']);
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
