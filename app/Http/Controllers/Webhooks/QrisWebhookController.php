<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\CashAdvance;
use App\Models\CashAdvanceInstallment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QrisWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        // Some gateways send JSON; ensure it is parsed even if middleware skipped it.
        if (empty($request->all()) && $request->getContent() !== '') {
            $decoded = json_decode($request->getContent(), true);
            if (is_array($decoded)) {
                $request->merge($decoded);
            }
        }

        $secret = config('services.qris.webhook_secret');
        if ($secret) {
            $provided = $request->header('X-QRIS-WEBHOOK-SECRET')
                ?? $request->header('X-Webhook-Secret')
                ?? $request->input('secret');

            if (! hash_equals((string) $secret, (string) $provided)) {
                return response()->json(['error' => 'Unauthorized.'], 401);
            }
        }

        $reference = $request->input('transaction_ref')
            ?? $request->input('reference')
            ?? $request->input('unique_code')
            ?? $request->input('data.transaction_ref')
            ?? $request->input('data.unique_code');

        $status = strtolower((string) ($request->input('status')
            ?? $request->input('payment_status')
            ?? $request->input('data.status')
            ?? 'paid'));

        if (! in_array($status, ['paid', 'success', 'settlement', 'completed', 'capture'], true)) {
            return response()->json(['message' => 'Ignored status.'], 200);
        }

        $installment = null;
        if ($reference) {
            $installment = CashAdvanceInstallment::where('transaction_ref', $reference)->first();

            if (! $installment && preg_match('/^KASBON-(\d+)-INS-(\d+)$/', (string) $reference, $matches)) {
                $installment = CashAdvanceInstallment::where('cash_advance_id', $matches[1])
                    ->where('installment_number', $matches[2])
                    ->first();
            }
        }

        if (! $installment && $request->filled('installment_id')) {
            $installment = CashAdvanceInstallment::find($request->input('installment_id'));
        }

        if (! $installment) {
            return response()->json(['error' => 'Installment not found.'], 404);
        }

        if ($installment->status === 'paid') {
            return response()->json(['message' => 'Already paid.'], 200);
        }

        $amount = $request->input('amount') ?? $request->input('data.amount');
        if ($amount !== null && (float) $amount !== (float) $installment->amount) {
            // Allow small floating point differences.
            if (abs((float) $amount - (float) $installment->amount) > 0.01) {
                return response()->json(['error' => 'Amount mismatch.'], 422);
            }
        }

        $installment->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => 'qris',
            'transaction_ref' => $installment->transaction_ref ?: ('QRIS-'.uniqid()),
        ]);

        /** @var CashAdvance $cashAdvance */
        $cashAdvance = $installment->cashAdvance;
        $cashAdvance->decrement('remaining_balance', (float) $installment->amount);

        if ($cashAdvance->fresh()->remaining_balance <= 0) {
            $cashAdvance->update(['status' => 'paid']);
        } else {
            $cashAdvance->update(['status' => 'repaying']);
        }

        return response()->json(['message' => 'Payment processed.'], 200);
    }
}
