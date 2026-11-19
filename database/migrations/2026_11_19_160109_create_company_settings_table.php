<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('PT Nusantara Solusi SDM');
            $table->string('tagline')->default('Sistem Informasi Kepegawaian & Operasional Terpadu');
            $table->string('email')->default('hrd@nusantara-sdm.co.id');
            $table->string('phone')->default('+62 21 555-0188');
            $table->text('address')->nullable();
            $table->string('work_hours')->default('Senin - Jumat: 08:30 - 17:30 WIB');
            $table->string('announcement_title')->nullable()->default('Pengumuman Pelayanan & Operasional');
            $table->text('announcement_content')->nullable()->default('Pengajuan cuti dan rekapitulasi presensi periode ini diproses melalui loket digital HR Sistem. Harap pastikan check-in dilakukan setiap hari kerja.');
            $table->boolean('announcement_active')->default(true);
            $table->text('leave_policy')->nullable()->default('Pengajuan cuti diajukan minimal 3 hari sebelum tanggal cuti melalui sistem.');
            $table->text('attendance_policy')->nullable()->default('Presensi masuk dibuka 30 menit sebelum jam kerja dengan batas toleransi 15 menit.');
            $table->timestamps();
        });

        // Insert initial default record
        DB::table('company_settings')->insert([
            'company_name' => 'PT Nusantara Solusi SDM',
            'tagline' => 'Sistem Informasi Kepegawaian & Operasional Terpadu',
            'email' => 'hrd@nusantara-sdm.co.id',
            'phone' => '+62 21 555-0188',
            'address' => 'Gedung Menara Pratama Lt. 14, Jl. Jend. Sudirman Kav. 28, Jakarta Selatan 12920',
            'work_hours' => 'Senin - Jumat: 08:30 - 17:30 WIB',
            'announcement_title' => 'Pengumuman Pelayanan & Operasional',
            'announcement_content' => 'Pengajuan cuti dan rekapitulasi presensi periode ini diproses melalui loket digital HR Sistem. Harap pastikan check-in dilakukan setiap hari kerja.',
            'announcement_active' => true,
            'leave_policy' => 'Pengajuan cuti diajukan minimal 3 hari kerja sebelum tanggal cuti melalui sistem.',
            'attendance_policy' => 'Presensi masuk dibuka 30 menit sebelum shift dimulai dengan toleransi keterlambatan maksimal 15 menit.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
