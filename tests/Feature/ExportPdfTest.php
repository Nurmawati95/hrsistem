<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

test('export pdf route returns a response', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->first();
    $response = $this->actingAs($admin)->get(route('employees.exportPdf'));
    echo 'Status: '.$response->getStatusCode().PHP_EOL;
    echo 'Content-Type: '.$response->headers->get('Content-Type').PHP_EOL;
    $response->assertSuccessful();
});

test('import route accepts file upload', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->first();
    // Create a simple CSV file for testing
    $csv = "employee_number,first_name,last_name,email,hire_date,employment_status\n";
    $csv .= "TEST-0001,Test,User,test.user@hrsistem.local,2025-01-01,contract\n";
    $tmpFile = tempnam(sys_get_temp_dir(), 'import_').'.csv';
    file_put_contents($tmpFile, $csv);

    $response = $this->actingAs($admin)->post(route('employees.import'), [
        'file' => new UploadedFile($tmpFile, 'test.csv', 'text/csv', null, true),
    ]);

    echo 'Status: '.$response->getStatusCode().PHP_EOL;
    $response->assertRedirect();
});
