-- AlterTable
-- DATE descarta o horário enviado pelo cliente. Convertendo para TIMESTAMPTZ(3).
-- Backfill: quando created_at cai no mesmo dia da transação, ele é o horário real
-- em que ela foi adicionada. Nos demais casos, assume meio-dia no fuso da aplicação.
ALTER TABLE "transactions"
    ALTER COLUMN "transaction_date" TYPE TIMESTAMPTZ(3)
    USING CASE
        WHEN (("created_at" AT TIME ZONE 'UTC') AT TIME ZONE 'America/Sao_Paulo')::date = "transaction_date"
            THEN "created_at" AT TIME ZONE 'UTC'
        ELSE ("transaction_date" + TIME '12:00') AT TIME ZONE 'America/Sao_Paulo'
    END;

-- Mês e ano passam a ser derivados no fuso da aplicação, não em UTC.
UPDATE "transactions"
SET "month" = EXTRACT(MONTH FROM "transaction_date" AT TIME ZONE 'America/Sao_Paulo')::int,
    "year" = EXTRACT(YEAR FROM "transaction_date" AT TIME ZONE 'America/Sao_Paulo')::int;
