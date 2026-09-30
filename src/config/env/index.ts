import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório'),
	JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
	PORT: z.coerce.number().min(1, 'PORT é obrigatório')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('Erro de validação das variáveis de ambiente:', parsed.error.format());
	process.exit(1);
}

export const env = parsed.data;
