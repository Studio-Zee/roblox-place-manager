# Roblox Place Manager

Crie novas Experiences e Places do Roblox diretamente pelo celular usando o **Termux + Node.js**.

A ferramenta possui duas opções:

- Criar uma nova Experience na conta;
- Criar um novo Place dentro de uma Experience existente.

O objetivo é facilitar o gerenciamento de Places para quem desenvolve pelo celular e utiliza ferramentas como o Roblox Studio Lite.

---

## Aviso importante sobre o ROBLOSECURITY

O `.ROBLOSECURITY` é uma credencial de sessão da sua conta Roblox.

**NUNCA compartilhe seu cookie com outras pessoas.**

Este projeto foi desenvolvido para que o cookie **não fique escrito dentro do código**.
Ele é carregado temporariamente através de uma variável de ambiente:

```bash
read -s ROBLOSECURITY
export ROBLOSECURITY
```

Depois de executar a ferramenta, remova a variável:

```bash
unset ROBLOSECURITY
```

Nunca faça isso:

```javascript
const ROBLOSECURITY = "seu_cookie_aqui";
```

Também não envie seu cookie para:

- GitHub;
- Discord;
- YouTube;
- sites de terceiros;
- outras pessoas.

Se você acreditar que seu cookie foi exposto, encerre as sessões da sua conta Roblox e tome as medidas de segurança recomendadas pelo Roblox.

---

## Requisitos

Você precisa de:

- Um dispositivo Android;
- Termux;
- Node.js;
- Uma conta Roblox;
- Acesso à internet.

Recomenda-se utilizar uma versão atualizada do Termux.

---

## Instalação

Abra o Termux e execute:

```bash
pkg update
```

Depois instale o Node.js:

```bash
pkg install nodejs-lts
```

Verifique se foi instalado:

```bash
node --version
```

---

## Baixando o projeto

Clone o repositório:

```bash
git clone https://github.com/Studio-Zee/roblox-place-manager.git
```

Entre na pasta:

```bash
cd roblox-place-manager
```

---

## Configurando o ROBLOSECURITY

Antes de executar o programa, carregue seu cookie na variável de ambiente.
Execute:

```bash
read -s ROBLOSECURITY
```

O terminal não mostrará os caracteres enquanto você digita ou cola. Isso é normal.
Depois pressione:

```text
Enter
```

Agora execute:

```bash
export ROBLOSECURITY
```

Você pode verificar se a variável foi carregada sem mostrar o cookie:

```bash
if [ -n "$ROBLOSECURITY" ]; then
    echo "Cookie carregado."
else
    echo "Cookie NÃO carregado."
fi
```

Se aparecer `Cookie carregado.`, está pronto.

---

## Executando

Execute:

```bash
node arquivo.js
```

O programa mostrará:

```text
========================================
        ROBLOX PLACE MANAGER
========================================

1. Criar nova Experience
2. Criar Place em Experience existente
3. Sair

Escolha uma opção:
```

### 1. Criar nova Experience

Escolha:

```text
1
```

O programa utilizará o template configurado no código e enviará a solicitação para a API do Roblox.
Antes da criação, será solicitada uma confirmação.

### 2. Criar Place em Experience existente

Escolha:

```text
2
```

O programa solicitará o Universe ID da Experience.
Exemplo:

```text
Universe ID: 8333219351
```

Depois de confirmar, o programa tentará criar um novo Place dentro dessa Experience.
Se funcionar, será mostrado algo semelhante a:

```text
Place criado!

Place ID: 92159367991281
URL: https://www.roblox.com/games/92159367991281
```

---

## Como encontrar o Universe ID

O Universe ID é o ID da Experience, e não o ID de um Place.
Uma Experience pode possuir vários Places.
Exemplo:

```text
Experience
│
├── Place 1
├── Place 2
└── Place 3
```

Para utilizar a opção de adicionar Place, informe o ID da Experience correspondente.

---

## Removendo o cookie após o uso

Quando terminar, execute:

```bash
unset ROBLOSECURITY
```

Você pode verificar:

```bash
if [ -n "$ROBLOSECURITY" ]; then
    echo "Cookie ainda está carregado."
else
    echo "Cookie removido da sessão."
fi
```

O ideal é remover a variável depois de terminar de utilizar a ferramenta.

---

## Como funciona

O programa utiliza a API do Roblox para realizar as operações.
Para as requisições autenticadas, o programa:

- Envia uma primeira requisição;
- Obtém o X-CSRF-TOKEN retornado pelo Roblox;
- Envia novamente a requisição utilizando o token;
- Processa a resposta;
- Mostra o resultado no terminal.

O `.ROBLOSECURITY` é fornecido através da variável de ambiente e não fica armazenado no arquivo `arquivo.js`.

---

## Limitações

Este projeto depende de endpoints da API do Roblox.
O Roblox pode alterar:

- Endpoints;
- Métodos de autenticação;
- Permissões;
- Parâmetros;
- Limitações;
- Funcionamento da API.

Por isso, o funcionamento deste projeto pode mudar no futuro.
O projeto não é afiliado, patrocinado ou oficialmente mantido pelo Roblox.

---

## Créditos

A ideia e a implementação inicial da requisição utilizada neste projeto foram encontradas através do conteúdo de:

- [JardelKkj](https://youtu.be/c6Qbg85C-ow?si=QAWL26UrFpV3kNtW)
- [SnowCHC](https://youtu.be/NHkjCd8eX_M?si=_Iguass8xqo0yRMJ)

O código deste repositório foi posteriormente reescrito, adaptado e expandido, adicionando, entre outras coisas:

- Criação de novas Experiences;
- Criação de Places em Experiences existentes;
- Menu de seleção;
- Confirmação das operações;
- Validação do Universe ID;
- Tratamento de erros;
- Obtenção automática do X-CSRF-TOKEN;
- Uso do ROBLOSECURITY através de variável de ambiente;
- Melhorias na organização do código.

Os créditos são mantidos aqui para reconhecer a origem da ideia utilizada como ponto de partida.