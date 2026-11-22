<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CashAdvanceInstallment;
use App\Models\CompanySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use QrisDinamis\Qris;
use Zxing\QrReader;

class QrisController extends Controller
{
    public function edit(): Response
    {
        $setting = CompanySetting::current();

        return Inertia::render('settings/qris', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'qris_image' => ['nullable', 'image', 'max:2048'],
            'qris_string' => ['nullable', 'string'],
        ]);

        $setting = CompanySetting::current();

        if ($request->hasFile('qris_image')) {
            $directory = public_path('uploads/qris');
            if (! is_dir($directory)) {
                @mkdir($directory, 0755, true);
            }
            $file = $request->file('qris_image');
            $filename = 'qris-'.time().'.'.$file->getClientOriginalExtension();
            $file->move($directory, $filename);

            if ($setting->qris_image && file_exists(public_path('uploads/qris/'.$setting->qris_image))) {
                @unlink(public_path('uploads/qris/'.$setting->qris_image));
            }

            $validated['qris_image'] = $filename;

            // Decode QR from uploaded image
            $decoded = $this->decodeQrFromImage(public_path('uploads/qris/'.$filename));
            if ($decoded) {
                $validated['qris_string'] = $decoded;
            }
        }

        // If admin edited the string manually, use that
        if ($request->filled('qris_string')) {
            $validated['qris_string'] = $request->input('qris_string');
        }

        $setting->update($validated);

        return back()->with('status', 'QRIS berhasil diperbarui.');
    }

    /**
     * Decode QR code from an image file.
     */
    protected function decodeQrFromImage(string $path): ?string
    {
        try {
            $reader = new QrReader($path, QrReader::SOURCE_TYPE_FILE);
            $text = $reader->text();

            return is_string($text) && $text !== '' ? $text : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Generate dynamic QRIS for a given installment.
     */
    public function generateDynamicQris(CashAdvanceInstallment $installment): JsonResponse
    {
        $setting = CompanySetting::current();
        $staticQris = $setting->qris_string;

        if (! $staticQris) {
            return response()->json(['error' => 'QRIS statis belum diatur.'], 422);
        }

        $amount = (float) $installment->amount;

        try {
            $dynamicQris = Qris::convert($staticQris, $amount);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Gagal generate QRIS dinamis: '.$e->getMessage()], 422);
        }

        $uniqueCode = 'KASBON-'.$installment->cash_advance_id.'-INS-'.$installment->installment_number;

        return response()->json([
            'qris_string' => $dynamicQris,
            'amount' => $amount,
            'unique_code' => $uniqueCode,
            'qr_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data='.urlencode($dynamicQris),
        ]);
    }
}
