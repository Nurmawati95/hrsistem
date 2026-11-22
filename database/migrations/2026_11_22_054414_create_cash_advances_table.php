<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_advances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->text('reason')->nullable();
            $table->string('status')->default('pending');
            // pending, supervisor_approved, finance_approved, disbursed, repaying, paid, rejected
            $table->foreignId('supervisor_approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('supervisor_approved_at')->nullable();
            $table->foreignId('finance_approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('finance_approved_at')->nullable();
            $table->foreignId('disbursed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('disbursed_at')->nullable();
            $table->integer('total_installments')->default(1);
            $table->decimal('installment_amount', 15, 2)->default(0);
            $table->decimal('remaining_balance', 15, 2)->default(0);
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_advances');
    }
};
