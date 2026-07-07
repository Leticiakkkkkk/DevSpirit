# 👾 DevSpirit

> **Invoque, evolua e batalhe com o espírito digital do seu código.**

O **DevSpirit** é uma aplicação gamificada que transforma o histórico e a constância dos seus *commits* no GitHub em um "Spirit Pet" virtual. Batalhe na arena, suba no ranking e prove o valor do seu código.

🔗 **Repositório:** [https://github.com/Leticiakkkkkk/DevSpirit](https://github.com/Leticiakkkkkk/DevSpirit)

---

## ⚡ O Novo Fluxo: Public First, Claim Later

Nós pivotamos a arquitetura! Para eliminar o atrito e o medo de conceder permissões via OAuth, o DevSpirit agora opera com um modelo de **Consulta Pública + Prova de Propriedade (Bio-Protocol)**. 

Qualquer pessoa pode invocar o Pet de qualquer desenvolvedor do mundo apenas digitando o *username*. O login só é necessário se você quiser assumir a posse do seu Pet.

### Como Funciona:

1. **Scan (A Invocação):** Você digita um *username* do GitHub (ex: `Leticiakkkkkk`). Nosso sistema varre a Neural Network pública do GitHub, analisa os commits e materializa o Spirit Pet correspondente na hora. Sem necessidade de conta.
2. **Claim (A Reivindicação):** É o dono do Pet? Clique em "Reivindicar Bio-Assinatura". O sistema gera um código único (ex: `VERIFY-XYZ`).
3. **Verify (A Prova de Posse):** Você cola esse código temporariamente na sua *Bio do GitHub*. Nosso *scraper* vai até lá, valida a assinatura e transfere a posse oficial do Pet para você, salvando seu progresso e liberando a Arena PvP.

---

## 🚀 Features Atuais

* **Materialização Instantânea:** Geração procedural de atributos (Level, XP, Raridade) baseada no histórico real do GitHub.
* **Sistema de Verificação *Passwordless*:** Autenticação totalmente segura e sem atrito usando apenas a leitura da Bio do GitHub.
* **Interface Cyberpunk:** UI fluida com animações usando `framer-motion`, *glassmorphism* e feedback visual em tempo real.
* **Dashboard do Pet:** Visualize os *stats* totais e o nível de poder do seu companheiro digital.
* **Leaderboard (WIP):** Ranking global dos desenvolvedores com maior XP.
* **Battle Arena (WIP):** Sistema de combate PvP assíncrono.

---

## 🛠️ Stack Tecnológica

* **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
* **Backend:** Node.js / Express / Python (Scraping/Integração com GitHub API).
* **Armazenamento:** Estrutura ágil baseada em Cache e bancos SQLite/NoSQL para as filas de verificação.

---

## 💻 Como Rodar Localmente

Siga os passos abaixo para inicializar a Matrix na sua máquina local:

**1. Clone o repositório:**
```bash
git clone [https://github.com/Leticiakkkkkk/DevSpirit.git](https://github.com/Leticiakkkkkk/DevSpirit.git)
cd DevSpirit
```

**2. Configure o Frontend:**
```bash
cd client
npm install
# Crie um arquivo .env com a URL da sua API local: VITE_API_URL=http://localhost:3000
npm run dev
```

**3. Configure o Backend:**
```bash
cd server
# Instale as dependências correspondentes do backend (Node ou Python)
npm install # ou pip install -r requirements.txt
npm run start # ou python main.py
```
