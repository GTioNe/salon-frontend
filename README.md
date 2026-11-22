# 🌿 Nateliê Hair — Plataforma de Agendamento e Gestão

Protótipo inicial desenvolvido para o **Nateliê Hair**, criado como base de teste para validar agendamento online, automação de atendimento e controle financeiro simples. A proposta do projeto é funcionar em modelo híbrido e **100% gratuito**, pensado para atender pequenos negócios sem custos fixos de ferramentas ou assinaturas.

🔗 **Acesse o projeto:** [salon-frontend-opal.vercel.app](https://salon-frontend-opal.vercel.app)

---

## 💡 Proposta e Arquitetura Híbrida

Este repositório representa uma versão inicial/experimental com foco em baixo custo operacional:
* **Modelo gratuito e híbrido:** Combina hospedagem gratuita no frontend (Vercel), banco local leve (SQLite) e serviços gratuitos/acessíveis para agenda e mensagens.
* **Foco em pequenos negócios:** Ideal para profissionais autônomos e estúdios que precisam organizar horários e cobranças/regras sem depender de sistemas pagos pesados.

---

## 🚀 Principais Funcionalidades

* **Agendamento Inteligente:** Consulta de disponibilidade com cálculo de horários (slots) e integração com o **Google Calendar**.
* **Automação via WhatsApp:** Bot para confirmação de agendamentos, cancelamento via código (`cancelar CODIGO`) e regras de sinal para períodos de alta demanda.
* **Painel Financeiro:** Controle básico de entradas e agendamentos persistido em **SQLite**.
* **Interface Temática e Responsiva:** Layout adaptado para celular, com suporte a temas sazonais.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React, Vite, CSS3 (hospedado na Vercel)
* **Backend:** Node.js, Express
* **Banco de Dados:** SQLite
* **Integrações:** Google Calendar API, WhatsApp Web (`whatsapp-web.js`)

---

## ⚙️ Configuração e Execução Local

### Pré-requisitos
* Node.js (v18+)
* Conta Google com acesso à API do Google Calendar configurada

### 1. Clonando o repositório
```bash
git clone [https://github.com/GTioNe/salon-frontend.git](https://github.com/GTioNe/salon-frontend.git)
cd salon-frontend
