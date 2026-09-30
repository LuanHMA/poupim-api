-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "transaction_date" DATE;

-- Backfill: usa o dia de created_at quando ele cai no mesmo período informado,
-- caso contrário assume o primeiro dia do período.
UPDATE "transactions"
SET "transaction_date" = CASE
    WHEN EXTRACT(MONTH FROM "created_at") = "month" AND EXTRACT(YEAR FROM "created_at") = "year"
        THEN "created_at"::date
    ELSE make_date("year", "month", 1)
END
WHERE "transaction_date" IS NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "transaction_date" SET NOT NULL;

-- CreateIndex
CREATE INDEX "transactions_user_id_transaction_date_idx" ON "transactions"("user_id", "transaction_date");
