# 🛠️ Guia de Contribuição e Workflow

Para manter a **MasterCode** com um código de elite, seguimos um padrão rigoroso de commits e Pull Requests (PRs).

---

## 🏛️ Sistema de Commits Saudáveis (Conventional Commits)

Utilizamos o padrão **Conventional Commits** para garantir um histórico legível e automatizável.

### Estrutura:
`<tipo>(<escopo>): <descrição curta>`

### Tipos permitidos:
- `feat`: Uma nova funcionalidade.
- `fix`: Correção de um erro.
- `docs`: Alterações na documentação.
- `style`: Mudanças de formatação/estilo que não afetam a lógica.
- `refactor`: Mudança no código que não corrige erro nem adiciona funcionalidade.
- `perf`: Melhoria de performance.
- `test`: Adição ou correção de testes.
- `chore`: Atualizações de build, pacotes, etc.

### Exemplos:
- `feat(auth): implementação de login social com Google`
- `fix(ui): correção de padding no componente MatrixRain`
- `docs(readme): atualização do pitch comercial`

---

## 🔄 Pull Request (PR) Lifecycle

O fluxo de trabalho segue o modelo de **Feature Branching**:

1. **Criação da Branch**:
   - `feature/nome-da-feature`
   - `hotfix/nome-da-correção`
2. **Desenvolvimento Local**:
   - Commits pequenos e atômicos.
   - Rode o `npm run lint` antes de subir.
3. **Abertura do PR**:
   - Título claro e objetivo.
   - Descrição detalhada: "O que foi feito?", "Por que foi feito?", "Como testar?".
   - Screenshots ou vídeos para mudanças visuais (UI).
4. **Code Review**:
   - Pelo menos 1 aprovação necessária.
   - Discussão técnica focada em escalabilidade e performance.
5. **Merge**:
   - Utilizamos `Squash and Merge` para manter a branch principal limpa.

---

## 🧪 Boas Práticas de Código

1. **DRY (Don't Repeat Yourself)**: Se você copiou e colou, transforme em um componente ou hook.
2. **Typescript Strict**: Evite o uso de `any`. Defina as interfaces com precisão.
3. **Mobile-First**: Use classes do Tailwind pensando primeiro em telas pequenas.
4. **Performance**: Evite `useEffect` desnecessários e use `memo` em componentes pesados de renderização.

---

> **Atenção**: Commits diretos na `main` são estritamente proibidos em ambientes produtivos. Proteja a integridade do código!
