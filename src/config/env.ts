import { z } from 'zod';

const envSchema = z.object({
	MYSQL_HOST: z.string().min(1, 'MYSQL_HOST é obrigatório'),
	MYSQL_USER: z.string().min(1, 'MYSQL_USER é obrigatório'),
	MYSQL_PASSWORD: z.string().min(1, 'MYSQL_PASSWORD é obrigatório'),
	MYSQL_DATABASE: z.string().min(1, 'MYSQL_DATABASE é obrigatório'),
	JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('Erro de validação das variáveis de ambiente:', parsed.error.format());
	process.exit(1);
}

export const env = parsed.data;
