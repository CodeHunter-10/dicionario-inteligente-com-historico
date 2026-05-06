# 🚀 Buscador Inteligente + Histórico

## 📌 Objetivo

Criar um sistema de busca que:

* utiliza debounce
* busca dados simulados (ou API)
* renderiza resultados
* salva histórico
* permite manipular e filtrar esse histórico
* controla concorrência de requisições

---

# 🧠 Regras do Projeto

* ❌ Não copiar código pronto
* ✅ Fazer por etapas
* ✅ Testar cada parte antes de avançar
* ✅ Só seguir para próxima fase quando a anterior estiver funcionando

---

# 🧩 FASE 1 — Base da busca

## 🎯 Objetivo:

Criar um sistema de busca funcional

## ✅ Tarefas:

* [x] Criar input de busca
* [x] Criar função debounce
* [x] Criar função de busca (simulada com Promise)
* [x] Usar async/await
* [x] Mostrar "Carregando..."
* [x] Renderizar resultados na tela
* [x] Ignorar respostas antigas (controle por ID)

## 🧠 Conceitos usados:

* debounce
* async/await
* promises
* event loop
* closures

---

# 🧩 FASE 2 — Histórico de buscas

## 🎯 Objetivo:

Salvar e exibir histórico

## ✅ Tarefas:

* [x] Criar array de histórico
* [x] Salvar cada busca:

```js
{ termo: "banana", data: Date.now() }
```

* [x] Renderizar histórico na tela
* [x] Atualizar a lista a cada nova busca

## 🧠 Conceitos usados:

* arrays
* objetos
* push
* map

---

# 🧩 FASE 3 — Interação com histórico

## 🎯 Objetivo:

Manipular histórico

## ✅ Tarefas:

* [] Remover item do histórico
* [x] Usar event delegation
* [ ] Criar botão "limpar histórico"
* [x] Atualizar renderização

## 🧠 Conceitos usados:

* event delegation
* filter
* manipulação de DOM

---

# 🧩 FASE 4 — Filtro de histórico

## 🎯 Objetivo:

Filtrar buscas anteriores

## ✅ Tarefas:

* [ ] Criar input de filtro
* [ ] Filtrar histórico com:

```js
includes()
```

* [ ] Renderizar resultado filtrado

## 🧠 Conceitos usados:

* filter
* includes
* funções puras

---

# 🧩 FASE 5 — Persistência (localStorage)

## 🎯 Objetivo:

Salvar dados no navegador

## ✅ Tarefas:

* [ ] Salvar histórico no localStorage
* [ ] Carregar ao iniciar a página
* [ ] Atualizar sempre que mudar

## 🧠 Conceitos usados:

* JSON.stringify
* JSON.parse
* localStorage

---

# 🧩 FASE 6 — Tratamento de erro

## 🎯 Objetivo:

Lidar com falhas

## ✅ Tarefas:

* [ ] Usar try/catch
* [ ] Simular erro na busca
* [ ] Mostrar mensagem de erro na tela

## 🧠 Conceitos usados:

* try/catch
* async/await

---

# 🧩 FASE 7 — Melhorias (nível avançado)

## 🎯 Objetivo:

Refinar comportamento

## ✅ Tarefas:

* [ ] Implementar throttle (ex: botão limpar)
* [ ] Melhorar UX (mensagens)
* [ ] Evitar renderizações desnecessárias
* [ ] Organizar código

---

# 🧠 Checklist de conceitos cobertos

* [x] Tipos primitivos vs referência
* [x] Coerção (truthy/falsy)
* [x] Escopo
* [x] Hoisting
* [x] Closures
* [x] Arrays e objetos
* [x] map / filter / reduce
* [x] Desestruturação
* [x] Spread
* [x] Funções puras vs impuras
* [x] Event Loop
* [x] Promises
* [x] async/await
* [x] try/catch
* [x] Debounce
* [x] Throttle

---

# 🚀 Ordem recomendada

1. FASE 1 (obrigatória)
2. FASE 2
3. FASE 3
4. FASE 4
5. FASE 5
6. FASE 6
7. FASE 7 (extra)

---

# 💬 Regra final

> Não avance enquanto a fase atual não estiver funcionando 100%

---

# 🎯 Objetivo final

Ter um projeto que:

* funciona sozinho
* usa conceitos reais
* pode ir pro portfólio

---
