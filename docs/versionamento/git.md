# Convenção de Commits

Este documento descreve a convenção de commits utilizada no projeto Alice para manter um histórico de commits claro, organizado e facilitar a geração de changelogs e outras automações. Adotar esta convenção melhora a colaboração e a manutenção do projeto.

## Tipos de Commit

Utilizamos as seguintes palavras-chave para indicar o propósito de cada commit:

- **`feat` (feature):** Utilizado para introduzir uma **nova funcionalidade** ao aplicativo.

  ```
  feat: Implementação tela de histórico de consumo
  feat(autenticacao): Adicionado login com Google
  ```

- **`fix`:** Utilizado para corrigir um **bug**.

  ```
  fix: Correção do erro de cálculo no consumo em tempo real
  fix(notificacoes): Impedindo notificações duplicadas
  ```

- **`refactor`:** Utilizado para uma **reestruturação do código** que não adiciona nem corrige funcionalidades visíveis ao usuário final. O objetivo é melhorar a legibilidade, a manutenção ou o desempenho do código.

  ```
  refactor: Extração do componente de gráfico de barras
  refactor(api): Modificação da estrutura de requisição para obter dados
  ```

- **`docs` (documentation):** Utilizado para alterações na **documentação**.

  ```
  docs: Atualização do README com instruções de instalação
  docs(componente de gráfico): Adicionado exemplos de uso
  ```

- **`style`:** Utilizado para alterações que **não afetam o significado do código** (formatação, whitespace, linting, etc.).

  ```
  style: Aplicação da formatação consistente com Prettier
  style: Remoção de espaços em branco desnecessários
  ```

- **`test`:** Utilizado para alterações relacionadas a **testes**.

  ```
  test: Adicionado testes unitários para o serviço de autenticação
  test(componente de tela principal): Refatorado testes de integração
  ```

- **`chore`:** Utilizado para outras alterações que **não modificam o código de produção nem os testes** (tarefas de build, configuração de ferramentas, atualizações de dependências, etc.).

  ```
  chore: Atualização de dependências do projeto
  chore(build): Configuração da integração contínua com GitHub Actions
  ```

- **`perf` (performance):** Utilizado para alterações que visam **melhorar o desempenho** do aplicativo.

  ```
  perf: Otimização da consulta de dados de consumo no banco de dados
  perf(gráfico): Redução de cálculos redundantes na renderização
  ```

- **`build`:** Utilizado para alterações relacionadas ao **sistema de build** e suas dependências.

  ```
  build: Atualização da configuração do Webpack para otimização de assets
  ```

- **`ci` (continuous integration):** Utilizado para alterações nos arquivos de **configuração de integração contínua**.

  ```
  ci: Adicionado step para rodar testes de ponta a ponta
  ```

- **`revert`:** Utilizado para **reverter um commit anterior**.

  ```
  revert: Reverção "feat: Implementa tela de histórico de consumo" (erro na lógica)
  ```

## Formato da Mensagem de Commit

A estrutura básica de uma mensagem de commit deve seguir o seguinte formato:

- **`<tipo>`:** Uma das palavras-chave listadas acima.
- **`<escopo opcional>`:** Um texto curto que especifica a parte do código afetada (ex: `autenticacao`, `tela de perfil`).
- **`<descrição curta>`:** Uma descrição concisa da alteração, utilizando o imperativo (ex: "Adiciona", "Corrige", "Refatora").
- **`[corpo opcional]`:** Uma descrição mais detalhada da alteração, fornecendo contexto e explicando o porquê da mudança. Deve ser separado da descrição curta por uma linha em branco.
- **`[rodapé(s) opcional(is)]`:** Pode conter informações adicionais, como referências a issues (`Closes #123`), breaking changes (`BREAKING CHANGE: ...`), etc.

## Exemplos

- **Adicionando uma nova funcionalidade:**

  ```
  feat(analise): Permição para filtrar consumo por período
  ```

- **Corrigindo um bug na tela principal:**

  ```
  fix(tela principal): Impedindo que o gráfico quebre com dados inválidos
  ```

- **Refatorando um componente de UI:**

  ```
  refactor(botao de ação): Simplificação da lógica de estilos condicionais
  ```

- **Atualizando a documentação:**

  ```
  docs: Adicionada seção sobre integração com API externa
  ```

- **Melhorando o desempenho de uma função:**

  ```
  perf: Otimização da busca de dados no cache
  ```

## Dicas

- Mantenha a consistência no uso das palavras-chave.
- Escreva descrições curtas e informativas.
- Utilize o corpo da mensagem para explicar detalhes importantes.
- Use o rodapé para referenciar issues e breaking changes.

Ao seguir esta convenção de commits, contribuímos para um histórico de commits mais claro e facilitamos a evolução e a manutenção do projeto Alice.
