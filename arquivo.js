/*
 * ============================================================
 * ROBLOX PLACE MANAGER
 * ============================================================
 *
 * Ferramenta para criar Experiences e Places do Roblox
 * utilizando o Termux + Node.js.
 *
 * ------------------------------------------------------------
 * CRÉDITOS
 * ------------------------------------------------------------
 *
 * A ideia e a implementação inicial da requisição utilizada
 * neste projeto foram encontradas no conteúdo de:
 *
 * JardelKkj
 * SnowCHC
 *
 * O código apresentado originalmente foi estudado, reescrito
 * e adaptado para esta versão.
 *
 * Esta versão adiciona/modifica, entre outras coisas:
 *
 * - Criação de uma nova Experience;
 * - Criação de Place dentro de uma Experience existente;
 * - Menu de seleção;
 * - Confirmação antes das operações;
 * - Validação do Universe ID;
 * - Tratamento de erros;
 * - Obtenção automática do X-CSRF-TOKEN;
 * - Uso do ROBLOSECURITY através de variável de ambiente;
 * - O cookie não fica escrito dentro deste arquivo.
 *
 * ------------------------------------------------------------
 * SOBRE O ROBLOSECURITY
 * ------------------------------------------------------------
 *
 * O ROBLOSECURITY é uma credencial de sessão da conta Roblox.
 *
 * NUNCA compartilhe esse valor com outras pessoas.
 *
 * Nesta versão, o cookie não é colocado diretamente no código.
 * Ele deve ser carregado temporariamente através da variável
 * de ambiente ROBLOSECURITY.
 *
 * Exemplo:
 *
 *     read -s ROBLOSECURITY
 *     export ROBLOSECURITY
 *     node arquivo.js
 *
 * Depois de terminar:
 *
 *     unset ROBLOSECURITY
 *
 * Não publique seu cookie no GitHub, Discord, YouTube,
 * prints ou qualquer outro lugar.
 *
 * ------------------------------------------------------------
 * IMPORTANTE
 * ------------------------------------------------------------
 *
 * Este projeto utiliza endpoints da API do Roblox que
 * atualmente dependem de autenticação por cookie.
 *
 * O funcionamento desses endpoints pode mudar caso o Roblox
 * altere suas APIs ou políticas.
 *
 * Este script não armazena o ROBLOSECURITY em banco de dados
 * nem o grava neste arquivo.
 *
 * ============================================================
 */

const readline = require("readline");

const API_BASE = "https://apis.roblox.com";
const TEMPLATE_PLACE_ID = 95206881;
const ROBLOSECURITY = process.env.ROBLOSECURITY;

// VERIFICAÇÃO DO COOKIE
if (!ROBLOSECURITY) {
    console.error("");
    console.error("ERRO: ROBLOSECURITY não foi carregado.");
    console.error("");
    console.error("Execute:");
    console.error("");
    console.error("read -s ROBLOSECURITY");
    console.error("export ROBLOSECURITY");
    console.error("node arquivo.js");
    console.error("");
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(text) {
    return new Promise(resolve => {
        rl.question(text, answer => {
            resolve(answer.trim());
        });
    });
}

async function confirm(text) {
    const answer = await question(`${text} [s/N]: `);
    return answer.toLowerCase() === "s";
}

// OBTÉM O X-CSRF-TOKEN
async function getCsrfToken(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${ROBLOSECURITY}`
        },
        body: JSON.stringify(body)
    });

    const token = response.headers.get("x-csrf-token");

    if (!token) {
        const text = await response.text();
        throw new Error(
            `Roblox não retornou X-CSRF-TOKEN.\n` +
            `Status: ${response.status}\n` +
            `Resposta: ${text}`
        );
    }

    return token;
}

// REQUISIÇÃO AUTENTICADA
async function authenticatedPost(url, body) {
    const csrfToken = await getCsrfToken(url, body);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${ROBLOSECURITY}`,
            "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(body)
    });

    const text = await response.text();
    let data = null;

    try {
        data = JSON.parse(text);
    } catch {
        // A resposta não está em JSON.
    }

    return {
        status: response.status,
        text,
        data
    };
}

// CRIAR NOVA EXPERIENCE
async function createUniverse() {
    const url = `${API_BASE}/universes/v1/universes/create`;
    const body = {
        templatePlaceId: TEMPLATE_PLACE_ID
    };

    console.log("");
    console.log("========================================");
    console.log("       CRIAR NOVA EXPERIENCE");
    console.log("========================================");
    console.log(`\nTemplate Place: ${TEMPLATE_PLACE_ID}`);
    console.log("\nIsso tentará criar uma NOVA Experience.");

    const confirmed = await confirm("Continuar?");

    if (!confirmed) {
        console.log("\nOperação cancelada.");
        return;
    }

    console.log("\nEnviando requisição...");

    try {
        const result = await authenticatedPost(url, body);

        console.log("");
        console.log("========================================");
        console.log("             RESULTADO");
        console.log("========================================");
        console.log(`Status: ${result.status}`);

        if (result.status >= 200 && result.status < 300) {
            console.log("\nSUCCESSO!");
            if (result.data) {
                console.log(JSON.stringify(result.data, null, 2));
            }
        } else {
            console.log("\nRoblox recusou a operação.");
            console.log("\nResposta:");
            console.log(result.text);
        }
    } catch (error) {
        console.error("\nErro:");
        console.error(error.message);
    }
}

// CRIAR PLACE EM EXPERIENCE EXISTENTE
async function createPlace() {
    console.log("");
    console.log("========================================");
    console.log("     CRIAR PLACE EM EXPERIENCE");
    console.log("========================================");

    const universeId = await question("\nUniverse ID: ");

    if (!/^\d+$/.test(universeId)) {
        console.log("\nUniverse ID inválido.");
        return;
    }

    const url = `${API_BASE}/universes/v1/user/universes/${universeId}/places`;
    const body = {
        templatePlaceId: TEMPLATE_PLACE_ID
    };

    console.log(`\nUniverse: ${universeId}`);
    console.log(`Template Place: ${TEMPLATE_PLACE_ID}`);

    const confirmed = await confirm("Criar um novo Place nessa Experience?");

    if (!confirmed) {
        console.log("\nOperação cancelada.");
        return;
    }

    console.log("\nEnviando requisição...");

    try {
        const result = await authenticatedPost(url, body);

        console.log("");
        console.log("========================================");
        console.log("             RESULTADO");
        console.log("========================================");
        console.log(`Status: ${result.status}`);

        if (result.status >= 200 && result.status < 300) {
            console.log("\nPlace criado!");
            if (result.data?.placeId) {
                console.log(`Place ID: ${result.data.placeId}`);
                console.log(`URL: https://www.roblox.com/games/${result.data.placeId}`);
            }
        } else {
            console.log("\nRoblox recusou a operação.");
            console.log("\nResposta:");
            console.log(result.text);
        }
    } catch (error) {
        console.error("\nErro:");
        console.error(error.message);
    }
}

// MENU PRINCIPAL
async function main() {
    console.clear();

    console.log("========================================");
    console.log("        ROBLOX PLACE MANAGER");
    console.log("========================================");
    console.log("");
    console.log("1. Criar nova Experience");
    console.log("2. Criar Place em Experience existente");
    console.log("3. Sair");

    const option = await question("\nEscolha uma opção: ");

    switch (option) {
        case "1":
            await createUniverse();
            break;
        case "2":
            await createPlace();
            break;
        case "3":
            console.log("\nSaindo...");
            break;
        default:
            console.log("\nOpção inválida.");
    }
}

// EXECUÇÃO
async function run() {
    try {
        await main();
    } finally {
        rl.close();
    }
}

run();