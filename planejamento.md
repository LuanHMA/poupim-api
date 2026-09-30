### Dashboard — "como estou agora"

- [ ] Saldo (já tem)
- [ ] Total de receitas (já tem)
- [ ] Total de despesas (já tem)
- [ ] Total pendente como linha dentro do card de despesas, não como card separado
      ("Despesas: R$ 2.400 — desse valor, R$ 340 ainda não foi pago")
- [ ] Onde mais gastou no mês (já tem)
- [ ] Últimas transações (já tem, já ordenado por transaction_date)
- [ ] Quanto sobra por dia até o fim do mês ("R$ 1.240 e faltam 20 dias: R$ 62 por dia")
- [ ] DECIDIR: receita com status PENDING entra no saldo? Se entrar, o saldo mostra
      dinheiro que o usuário ainda não tem

### Estatísticas — plano básico (grátis)

Critério: o grátis precisa responder "esse mês foi melhor ou pior que o passado, e por quê".

- [ ] Este mês vs mês anterior: entradas, saídas e o que sobrou, com a diferença em R$
- [ ] Comparação até o mesmo dia do mês ("até o dia 15 você gastou R$ 1.100;
      no mês passado, até o dia 15, R$ 1.380") — só é possível por causa do transaction_date
- [ ] Top 5 categorias com a variação em relação ao mês anterior
- [ ] "De cada R$ 100 que entraram, quanto sobrou", com o número do mês anterior ao lado
- [ ] Gráfico dos últimos 3 meses (entrou, saiu, sobrou)
- [ ] Veredito do mês em 3 estados: tranquilo / apertado / no vermelho, com uma frase explicando

### Plano pago

Critério: cobrar por profundidade e por tempo, nunca por compreensão básica.

- [ ] Histórico longo: 12 meses, anos anteriores, setembro deste ano vs setembro do ano passado
- [ ] Comparação com a própria média ("sua média dos últimos 6 meses é R$ 2.100")
- [ ] Evolução de uma categoria específica ao longo do tempo
- [ ] Contas fixas ao longo dos meses (usa o campo fixed, hoje sem uso nenhum)
- [ ] Relatório narrativo do mês:
    - [ ] O mês em uma frase
    - [ ] De cada R$ 100 que entraram (fixas / variáveis / sobrou)
    - [ ] Gastos pequenos que somaram muito ("23 compras de menos de R$ 30 = R$ 410")
    - [ ] Dinheiro convertido em tempo ("suas contas fixas = 14 dias do que você recebe")
    - [ ] Maior gasto do mês, com nome
    - [ ] Gasto novo ou que desapareceu
    - [ ] Sequência de meses no positivo
    - [ ] Sugestões pro mês que vem, sempre com número concreto
- [ ] Limite por categoria (entidade nova no banco, vira página própria)
- [ ] Projeção de fechamento do mês
- [ ] Exportar o mês em PDF ou planilha
- [ ] Paywall com o bloco visível e preview desfocado, nunca escondido

### Regras de interface (público 18-30, sem educação financeira)

- [ ] Trocar o vocabulário em toda a UI:
    - Saldo → Sobrou / Faltou
    - Receitas / Entradas → Dinheiro que entrou
    - Despesas / Saídas → Dinheiro que saiu
    - Gastos fixos → Contas que vêm todo mês
    - Pendente → Ainda não pagou / Ainda não recebeu
    - Taxa de poupança → De cada R$ 100 que entraram, sobraram R$ X
    - Projeção → Se você continuar nesse ritmo
- [ ] Um número grande por bloco, com uma frase de contexto
- [ ] Barra horizontal com valor escrito ao lado, nunca gráfico de pizza
- [ ] Veredito de 3 estados, nunca nota de 0 a 100
- [ ] Nenhum termo de contabilidade na tela (fluxo de caixa, liquidez, comprometimento de renda)
- [ ] Marcar o mês em andamento de forma impossível de ignorar em qualquer comparação
- [ ] Usar proporção em vez de valor absoluto quando a renda mudou muito entre os meses
- [ ] Estado vazio de verdade para mês sem lançamentos (senão mostra "sobrou R$ 0, mês tranquilo")

### Backend — ajustes necessários

- [ ] Adicionar `ignore: false` nos cálculos de stats (hoje transação ignorada entra no saldo — bug)
- [ ] Quebrar os totais por `status` (separar o que já aconteceu do que falta)
- [ ] Quebrar os totais por `fixed`
- [ ] `highest_expense` devolver descrição e categoria, não só o valor
- [ ] Extrair os limiares 70 / 90 do `expenseRatioType` para constantes nomeadas
- [ ] Corrigir a descrição do campo `ignore` em `docs/common-schemas.ts`
      (hoje diz que as estatísticas incluem transações ignoradas)
- [ ] Índices: trocar `@@index([month, year])` por `@@index([user_id, year, month])`
      e remover `@@index([user_id])`, que é prefixo de `[user_id, transaction_date]`
- [ ] `src/utils/month-range.ts` está sem uso; se for usar, corrigir o fuso —
      `new Date(year, month - 1, 1)` usa o fuso do servidor, não o de `getTransactionPeriod`
- [ ] Remover `/stats/overview` e `/stats/top-expense-categories` só depois
      do frontend migrado. `/stats/cash-flow` fica, alimenta a página de transações