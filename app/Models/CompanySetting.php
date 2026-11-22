<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name',
        'tagline',
        'email',
        'phone',
        'address',
        'work_hours',
        'announcement_title',
        'announcement_content',
        'announcement_active',
        'leave_policy',
        'attendance_policy',
        'qris_image',
        'qris_string',
    ];

    protected $casts = [
        'announcement_active' => 'boolean',
    ];

    /**
     * Get or create the singleton company setting.
     */
    public static function current(): self
    {
        return self::firstOrCreate([], [
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
        ]);
    }
}
