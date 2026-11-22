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
        $request->validate([
            'qris_image' => ['nullable', 'image', 'max:2048'],
            'qris_string' => ['nullable', 'string'],
        ]);

        $setting = CompanySetting::current();

        $validated = [];

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

            // Decode QR from uploaded image -> static qris string (hasil scan)
            $decoded = $this->decodeQrFromImage(public_path('uploads/qris/'.$filename));
            if ($decoded) {
                $validated['qris_string'] = $decoded;
            }
        } elseif ($request->filled('qris_string')) {
            // Manual edit/modification of the static qris string
            $validated['qris_string'] = $request->input('qris_string');
        }

        if (! empty($validated)) {
            $setting->update($validated);
        }

        return back()->with('status', 'QRIS berhasil diperbarui.');
    }

    /**
     * Delete the uploaded QRIS image and its extracted string.
     */
    public function destroy(): RedirectResponse
    {
        $setting = CompanySetting::current();

        if ($setting->qris_image && file_exists(public_path('uploads/qris/'.$setting->qris_image))) {
            @unlink(public_path('uploads/qris/'.$setting->qris_image));
        }

        $setting->update([
            'qris_image' => null,
            'qris_string' => null,
        ]);

        return back()->with('status', 'QRIS berhasil dihapus.');
    }

    /**
     * Decode QR code from an image file.
     */
    protected function decodeQrFromImage(string $path): ?string
    {
        $text = $this->tryDecodeFile($path);
        if ($text !== null) {
            return $text;
        }

        try {
            $info = @getimagesize($path);
            $mime = is_array($info) ? ($info['mime'] ?? '') : '';
            $source = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($path),
                'image/png' => @imagecreatefrompng($path),
                'image/gif' => @imagecreatefromgif($path),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
                default => false,
            };

            if (! $source) {
                return null;
            }

            $width = imagesx($source);
            $height = imagesy($source);
            $max = 1024;
            $scale = min(1.0, $max / max($width, $height));
            $newWidth = max(1, (int) round($width * $scale));
            $newHeight = max(1, (int) round($height * $scale));

            $canvas = imagecreatetruecolor($newWidth, $newHeight);
            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagefilter($canvas, IMG_FILTER_GRAYSCALE);
            imagefilter($canvas, IMG_FILTER_CONTRAST, -50);

            imagedestroy($source);

            foreach ([0, 90, 180, 270] as $degrees) {
                $rotated = $degrees === 0 ? $canvas : imagerotate($canvas, $degrees, 0);
                $tempFile = tempnam(sys_get_temp_dir(), 'qris').'.png';
                imagepng($rotated, $tempFile);

                $decoded = $this->tryDecodeFile($tempFile);
                @unlink($tempFile);

                if ($degrees !== 0) {
                    imagedestroy($rotated);
                }

                if ($decoded !== null) {
                    imagedestroy($canvas);

                    return $decoded;
                }
            }

            imagedestroy($canvas);

            return null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    protected function tryDecodeFile(string $path): ?string
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

        // Store the pending reference so a payment webhook can match it.
        $installment->update(['transaction_ref' => $uniqueCode]);

        return response()->json([
            'qris_string' => $dynamicQris,
            'amount' => $amount,
            'unique_code' => $uniqueCode,
            'qr_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data='.urlencode($dynamicQris),
        ]);
    }
}
