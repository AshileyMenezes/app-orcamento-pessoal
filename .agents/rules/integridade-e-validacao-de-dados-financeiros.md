---
trigger: always_on
---

Toda lógica que envolva valores monetários devem: 
- Usar 'decimal' (phyton) ou 'big.js' / 'decimal.js' (JS/TS) em vez de float ou number nativa para evitar erros de arredondamento em cálculos financeiros. 
- validar e rejeitar entradas negativas em campo de receita, e entradas positivas em campo de despesa, salvo quando o dominio explicitamente permita. 
- Nunca exibir valores financeiros sem formatação de moeda. Ex: "1.250,00", respeitando o locale 'pt-BR'. 
- Incluir testes unitários para qualquer função de cálculo (saldo, total de categoria, projeção mensal). 