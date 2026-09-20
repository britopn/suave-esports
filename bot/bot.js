import 'dotenv/config';

import {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} from 'discord.js';

import { createClient } from '@supabase/supabase-js';


// ======================================================
// VARIÁVEIS DE AMBIENTE
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;


if (!TOKEN) {
    console.error('❌ DISCORD_TOKEN não encontrado no .env');
    process.exit(1);
}

if (!SUPABASE_URL) {
    console.error('❌ SUPABASE_URL não encontrado no .env');
    process.exit(1);
}

if (!SUPABASE_SECRET_KEY) {
    console.error('❌ SUPABASE_SECRET_KEY não encontrado no .env');
    process.exit(1);
}


// ======================================================
// SUPABASE
// ======================================================

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);


// ======================================================
// DISCORD CLIENT
// ======================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


// ======================================================
// POSIÇÕES
// ======================================================

const positionChoices = [
    { name: 'GR — Guarda-Redes', value: 'GR' },
    { name: 'DD — Defesa Direito', value: 'DD' },
    { name: 'DC — Defesa Central', value: 'DC' },
    { name: 'DE — Defesa Esquerdo', value: 'DE' },
    { name: 'MDC — Médio Defensivo', value: 'MDC' },
    { name: 'MC — Médio Centro', value: 'MC' },
    { name: 'MCO — Médio Ofensivo', value: 'MCO' },
    { name: 'ED — Extremo Direito', value: 'ED' },
    { name: 'EE — Extremo Esquerdo', value: 'EE' },
    { name: 'PL — Ponta de Lança', value: 'PL' }
];


// ======================================================
// COMANDOS
// ======================================================

const commands = [

    new SlashCommandBuilder()

        .setName('jogador')

        .setDescription(
            'Gestão do plantel da SUAVE FC'
        )


        // ==================================================
        // /jogador adicionar
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('adicionar')

                .setDescription(
                    'Adiciona um jogador ao plantel'
                )

                .addStringOption(option =>

                    option

                        .setName('nome')

                        .setDescription(
                            'Nome do jogador'
                        )

                        .setRequired(true)

                )

                .addIntegerOption(option =>

                    option

                        .setName('numero')

                        .setDescription(
                            'Número da camisola'
                        )

                        .setMinValue(1)

                        .setMaxValue(99)

                        .setRequired(true)

                )

                .addStringOption(option =>

                    option

                        .setName('posicao')

                        .setDescription(
                            'Posição principal'
                        )

                        .setRequired(true)

                        .addChoices(
                            ...positionChoices
                        )

                )

                .addAttachmentOption(option =>

                    option

                        .setName('foto')

                        .setDescription(
                            'Fotografia do jogador'
                        )

                        .setRequired(true)

                )

        )


        // ==================================================
        // /jogador foto
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('foto')

                .setDescription(
                    'Altera a fotografia de um jogador'
                )

                .addStringOption(option =>

                    option

                        .setName('jogador')

                        .setDescription(
                            'Nome do jogador'
                        )

                        .setRequired(true)

                        .setAutocomplete(true)

                )

                .addAttachmentOption(option =>

                    option

                        .setName('foto')

                        .setDescription(
                            'Nova fotografia'
                        )

                        .setRequired(true)

                )

        )


        // ==================================================
        // /jogador editar
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('editar')

                .setDescription(
                    'Edita os dados de um jogador'
                )

                .addStringOption(option =>

                    option

                        .setName('jogador')

                        .setDescription(
                            'Jogador a editar'
                        )

                        .setRequired(true)

                        .setAutocomplete(true)

                )

                .addStringOption(option =>

                    option

                        .setName('nome')

                        .setDescription(
                            'Novo nome do jogador'
                        )

                        .setRequired(false)

                )

                .addIntegerOption(option =>

                    option

                        .setName('numero')

                        .setDescription(
                            'Novo número da camisola'
                        )

                        .setMinValue(1)

                        .setMaxValue(99)

                        .setRequired(false)

                )

                .addStringOption(option =>

                    option

                        .setName('posicao')

                        .setDescription(
                            'Nova posição principal'
                        )

                        .setRequired(false)

                        .addChoices(
                            ...positionChoices
                        )

                )

        )


        // ==================================================
        // /jogador remover
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('remover')

                .setDescription(
                    'Remove um jogador do plantel'
                )

                .addStringOption(option =>

                    option

                        .setName('jogador')

                        .setDescription(
                            'Jogador a remover'
                        )

                        .setRequired(true)

                        .setAutocomplete(true)

                )

        )

];


// ======================================================
// BOT ONLINE
// ======================================================

client.once(
    'clientReady',
    async readyClient => {

        console.log('');
        console.log('====================================');
        console.log('🟢 SUAVE BOT ONLINE');
        console.log(`🤖 ${readyClient.user.tag}`);
        console.log('====================================');
        console.log('');


        try {

            const rest =
                new REST({
                    version: '10'
                })
                    .setToken(TOKEN);


            console.log(
                '⏳ A registar comandos...'
            );


            await rest.put(

                Routes.applicationCommands(
                    readyClient.user.id
                ),

                {
                    body:
                        commands.map(
                            command =>
                                command.toJSON()
                        )
                }

            );


            console.log(
                '✅ Comandos registados.'
            );

        }

        catch (error) {

            console.error(
                '❌ Erro ao registar comandos:'
            );

            console.error(error);

        }

    }
);


// ======================================================
// AUTOCOMPLETE DOS JOGADORES
// ======================================================

client.on(
    'interactionCreate',
    async interaction => {

        if (
            !interaction.isAutocomplete()
        ) {
            return;
        }


        if (
            interaction.commandName !==
            'jogador'
        ) {
            return;
        }


        const focused =
            interaction.options
                .getFocused(true);


        if (
            focused.name !==
            'jogador'
        ) {
            return;
        }


        try {

            const {
                data: jogadores,
                error
            } = await supabase

                .from('players')

                .select(
                    'id, name, number'
                )

                .order(
                    'number',
                    {
                        ascending: true
                    }
                );


            if (error) {

                console.error(
                    '❌ Erro no autocomplete:',
                    error
                );

                await interaction.respond([]);

                return;

            }


            const pesquisa =
                String(
                    focused.value || ''
                )
                    .toLowerCase()
                    .trim();


            const resultados =
                (jogadores || [])

                    .filter(jogador => {

                        const texto =
                            `${jogador.name} ${jogador.number}`
                                .toLowerCase();


                        return texto.includes(
                            pesquisa
                        );

                    })

                    .slice(0, 25)

                    .map(jogador => ({

                        name:
                            `#${jogador.number} · ${jogador.name}`,

                        value:
                            String(jogador.id)

                    }));


            await interaction.respond(
                resultados
            );

        }

        catch (error) {

            console.error(
                '❌ Erro inesperado no autocomplete:',
                error
            );


            try {

                await interaction.respond([]);

            }

            catch {
                // interação já expirou
            }

        }

    }
);


// ======================================================
// COMANDOS
// ======================================================

client.on(
    'interactionCreate',
    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }


        if (
            interaction.commandName !==
            'jogador'
        ) {
            return;
        }


        const subcommand =
            interaction.options
                .getSubcommand();


        // ==================================================
        // /jogador adicionar
        // ==================================================

        if (
            subcommand ===
            'adicionar'
        ) {

            await interaction.deferReply();


            try {

                const nome =
                    interaction.options
                        .getString('nome')
                        .trim();


                const numero =
                    interaction.options
                        .getInteger('numero');


                const posicao =
                    interaction.options
                        .getString('posicao');


                const foto =
                    interaction.options
                        .getAttachment('foto');


                if (
                    !foto.contentType
                        ?.startsWith('image/')
                ) {

                    await interaction.editReply({
                        content:
                            '❌ O ficheiro enviado em `foto` tem de ser uma imagem.'
                    });

                    return;

                }


                const {
                    data: jogadorExistente,
                    error: erroPesquisa
                } = await supabase

                    .from('players')

                    .select(
                        'id, name, number'
                    )

                    .eq(
                        'number',
                        numero
                    )

                    .maybeSingle();


                if (erroPesquisa) {

                    console.error(
                        '❌ Erro ao procurar jogador:',
                        erroPesquisa
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui consultar o plantel.'
                    });

                    return;

                }


                if (jogadorExistente) {

                    await interaction.editReply({

                        content:
                            `❌ O número **${numero}** já pertence a ` +
                            `**${jogadorExistente.name}**.`

                    });

                    return;

                }


                const {
                    data: novoJogador,
                    error: erroInsert
                } = await supabase

                    .from('players')

                    .insert({

                        name:
                            nome,

                        number:
                            numero,

                        position:
                            posicao,

                        photo_url:
                            foto.url

                    })

                    .select()

                    .single();


                if (erroInsert) {

                    console.error(
                        '❌ Erro ao adicionar jogador:',
                        erroInsert
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui guardar o jogador na base de dados.'
                    });

                    return;

                }


                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x003C2C
                        )

                        .setAuthor({
                            name:
                                'SUAVE FC · PLANTEL'
                        })

                        .setTitle(
                            `#${novoJogador.number} · ` +
                            `${novoJogador.name.toUpperCase()}`
                        )

                        .setDescription(
                            `**Posição:** ${novoJogador.position}\n` +
                            `**Número:** ${novoJogador.number}`
                        )

                        .setImage(
                            novoJogador.photo_url
                        )

                        .setFooter({
                            text:
                                `Adicionado por ${interaction.user.username}`
                        })

                        .setTimestamp();


                await interaction.editReply({

                    content:
                        '✅ **Jogador adicionado ao plantel e guardado na base de dados.**',

                    embeds: [
                        embed
                    ]

                });


                console.log(
                    `✅ Jogador guardado: ` +
                    `${novoJogador.name} #${novoJogador.number}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro inesperado em /jogador adicionar:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Ocorreu um erro inesperado ao adicionar o jogador.'
                });

            }


            return;

        }


        // ==================================================
        // /jogador foto
        // ==================================================

        if (
            subcommand ===
            'foto'
        ) {

            if (
                !interaction.memberPermissions
                    ?.has(
                        PermissionFlagsBits.ManageGuild
                    )
            ) {

                await interaction.reply({

                    content:
                        '❌ Apenas a staff pode alterar fotografias do plantel.',

                    ephemeral:
                        true

                });

                return;

            }


            await interaction.deferReply();


            try {

                const jogadorId =
                    interaction.options
                        .getString(
                            'jogador'
                        );


                const foto =
                    interaction.options
                        .getAttachment(
                            'foto'
                        );


                if (
                    !foto.contentType
                        ?.startsWith(
                            'image/'
                        )
                ) {

                    await interaction.editReply({
                        content:
                            '❌ O ficheiro enviado em `foto` tem de ser uma imagem.'
                    });

                    return;

                }


                const {
                    data: jogador,
                    error: erroJogador
                } = await supabase

                    .from('players')

                    .select(
                        'id, name, number, position, photo_url'
                    )

                    .eq(
                        'id',
                        jogadorId
                    )

                    .maybeSingle();


                if (erroJogador) {

                    console.error(
                        '❌ Erro ao procurar jogador:',
                        erroJogador
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui consultar o jogador.'
                    });

                    return;

                }


                if (!jogador) {

                    await interaction.editReply({
                        content:
                            '❌ Esse jogador não existe no plantel.'
                    });

                    return;

                }


                const {
                    data: jogadorAtualizado,
                    error: erroUpdate
                } = await supabase

                    .from('players')

                    .update({
                        photo_url:
                            foto.url
                    })

                    .eq(
                        'id',
                        jogador.id
                    )

                    .select()

                    .single();


                if (erroUpdate) {

                    console.error(
                        '❌ Erro ao atualizar fotografia:',
                        erroUpdate
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui atualizar a fotografia.'
                    });

                    return;

                }


                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x003C2C
                        )

                        .setAuthor({
                            name:
                                'SUAVE FC · PLANTEL'
                        })

                        .setTitle(
                            `#${jogadorAtualizado.number} · ` +
                            `${jogadorAtualizado.name.toUpperCase()}`
                        )

                        .setDescription(
                            '📸 **Fotografia atualizada**\n' +
                            `**Posição:** ${jogadorAtualizado.position}`
                        )

                        .setImage(
                            jogadorAtualizado.photo_url
                        )

                        .setFooter({
                            text:
                                `Alterado por ${interaction.user.username}`
                        })

                        .setTimestamp();


                await interaction.editReply({

                    content:
                        `✅ **Fotografia de ${jogadorAtualizado.name} atualizada.**`,

                    embeds: [
                        embed
                    ]

                });


                console.log(
                    `📸 Fotografia atualizada: ` +
                    `${jogadorAtualizado.name} ` +
                    `#${jogadorAtualizado.number}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro inesperado em /jogador foto:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Ocorreu um erro inesperado ao atualizar a fotografia.'
                });

            }


            return;

        }


        // ==================================================
        // /jogador editar
        // ==================================================

        if (
            subcommand ===
            'editar'
        ) {

            if (
                !interaction.memberPermissions
                    ?.has(
                        PermissionFlagsBits.ManageGuild
                    )
            ) {

                await interaction.reply({
                    content:
                        '❌ Apenas a staff pode editar jogadores do plantel.',
                    ephemeral:
                        true
                });

                return;

            }


            await interaction.deferReply();


            try {

                const jogadorId =
                    interaction.options
                        .getString('jogador');


                const novoNome =
                    interaction.options
                        .getString('nome');


                const novoNumero =
                    interaction.options
                        .getInteger('numero');


                const novaPosicao =
                    interaction.options
                        .getString('posicao');


                if (
                    novoNome === null &&
                    novoNumero === null &&
                    novaPosicao === null
                ) {

                    await interaction.editReply({
                        content:
                            '❌ Tens de alterar pelo menos um campo: `nome`, `numero` ou `posicao`.'
                    });

                    return;

                }


                const {
                    data: jogador,
                    error: erroPesquisa
                } = await supabase

                    .from('players')

                    .select(
                        'id, name, number, position, photo_url'
                    )

                    .eq(
                        'id',
                        jogadorId
                    )

                    .maybeSingle();


                if (erroPesquisa) {

                    console.error(
                        '❌ Erro ao procurar jogador:',
                        erroPesquisa
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui consultar o jogador.'
                    });

                    return;

                }


                if (!jogador) {

                    await interaction.editReply({
                        content:
                            '❌ Esse jogador não existe no plantel.'
                    });

                    return;

                }


                if (
                    novoNumero !== null &&
                    novoNumero !== jogador.number
                ) {

                    const {
                        data: numeroExistente,
                        error: erroNumero
                    } = await supabase

                        .from('players')

                        .select(
                            'id, name, number'
                        )

                        .eq(
                            'number',
                            novoNumero
                        )

                        .maybeSingle();


                    if (erroNumero) {

                        console.error(
                            '❌ Erro ao verificar número:',
                            erroNumero
                        );


                        await interaction.editReply({
                            content:
                                '❌ Não consegui verificar o novo número.'
                        });

                        return;

                    }


                    if (numeroExistente) {

                        await interaction.editReply({
                            content:
                                `❌ O número **${novoNumero}** já pertence a **${numeroExistente.name}**.`
                        });

                        return;

                    }

                }


                const alteracoes = {};


                if (novoNome !== null) {

                    const nomeLimpo =
                        novoNome.trim();


                    if (!nomeLimpo) {

                        await interaction.editReply({
                            content:
                                '❌ O nome não pode ficar vazio.'
                        });

                        return;

                    }


                    alteracoes.name =
                        nomeLimpo;

                }


                if (novoNumero !== null) {

                    alteracoes.number =
                        novoNumero;

                }


                if (novaPosicao !== null) {

                    alteracoes.position =
                        novaPosicao;

                }


                const {
                    data: jogadorAtualizado,
                    error: erroUpdate
                } = await supabase

                    .from('players')

                    .update(
                        alteracoes
                    )

                    .eq(
                        'id',
                        jogador.id
                    )

                    .select()

                    .single();


                if (erroUpdate) {

                    console.error(
                        '❌ Erro ao editar jogador:',
                        erroUpdate
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui editar o jogador.'
                    });

                    return;

                }


                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x003C2C
                        )

                        .setAuthor({
                            name:
                                'SUAVE FC · PLANTEL'
                        })

                        .setTitle(
                            `#${jogadorAtualizado.number} · ` +
                            `${jogadorAtualizado.name.toUpperCase()}`
                        )

                        .setDescription(
                            `**Posição:** ${jogadorAtualizado.position}\n` +
                            `**Número:** ${jogadorAtualizado.number}`
                        )

                        .setFooter({
                            text:
                                `Editado por ${interaction.user.username}`
                        })

                        .setTimestamp();


                if (
                    jogadorAtualizado.photo_url
                ) {

                    embed.setImage(
                        jogadorAtualizado.photo_url
                    );

                }


                await interaction.editReply({

                    content:
                        `✅ **${jogadorAtualizado.name} atualizado no plantel.**`,

                    embeds: [
                        embed
                    ]

                });


                console.log(
                    `✏️ Jogador editado: ` +
                    `${jogadorAtualizado.name} ` +
                    `#${jogadorAtualizado.number}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro inesperado em /jogador editar:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Ocorreu um erro inesperado ao editar o jogador.'
                });

            }


            return;

        }


        // ==================================================
        // /jogador remover
        // ==================================================

        if (
            subcommand ===
            'remover'
        ) {

            if (
                !interaction.memberPermissions
                    ?.has(
                        PermissionFlagsBits.ManageGuild
                    )
            ) {

                await interaction.reply({
                    content:
                        '❌ Apenas a staff pode remover jogadores do plantel.',
                    ephemeral:
                        true
                });

                return;

            }


            await interaction.deferReply();


            try {

                const jogadorId =
                    interaction.options
                        .getString('jogador');


                const {
                    data: jogador,
                    error: erroPesquisa
                } = await supabase

                    .from('players')

                    .select(
                        'id, name, number, position'
                    )

                    .eq(
                        'id',
                        jogadorId
                    )

                    .maybeSingle();


                if (erroPesquisa) {

                    console.error(
                        '❌ Erro ao procurar jogador:',
                        erroPesquisa
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui consultar o jogador.'
                    });

                    return;

                }


                if (!jogador) {

                    await interaction.editReply({
                        content:
                            '❌ Esse jogador já não existe no plantel.'
                    });

                    return;

                }


                const {
                    error: erroDelete
                } = await supabase

                    .from('players')

                    .delete()

                    .eq(
                        'id',
                        jogador.id
                    );


                if (erroDelete) {

                    console.error(
                        '❌ Erro ao remover jogador:',
                        erroDelete
                    );


                    await interaction.editReply({
                        content:
                            '❌ Não consegui remover o jogador.'
                    });

                    return;

                }


                await interaction.editReply({

                    content:
                        `🗑️ **#${jogador.number} · ${jogador.name}** foi removido do plantel.`

                });


                console.log(
                    `🗑️ Jogador removido: ` +
                    `${jogador.name} ` +
                    `#${jogador.number}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro inesperado em /jogador remover:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Ocorreu um erro inesperado ao remover o jogador.'
                });

            }


            return;

        }

    }
);


// ======================================================
// EA FC — SINCRONIZAÇÃO
// ======================================================

const EA_CLUB_ID = '203789';
const EA_PLATFORM = 'common-gen5';
const RESULTADOS_CHANNEL_ID =
    process.env.RESULTADOS_CHANNEL_ID;


// ======================================================
// COMANDO /ea sincronizar
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName('ea')

        .setDescription(
            'Sincronização com o EA SPORTS FC'
        )

        .addSubcommand(subcommand =>

            subcommand

                .setName('sincronizar')

                .setDescription(
                    'Importa novos League Matches da EA'
                )

        )

        .addSubcommand(subcommand =>

            subcommand

                .setName('testarresultado')

                .setDescription(
                    'Publica um cartão de resultado de teste'
                )

        )

);


// ======================================================
// HELPERS EA
// ======================================================

function eaNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


function eaNullableNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;

}


function normalizeEaName(value) {

    return String(value || '')
        .trim()
        .toLowerCase();

}


// ======================================================
// IMPORTAR UM JOGO EA
// ======================================================

async function importEaMatch(
    eaMatch,
    matchType,
    jogadoresPlantel
) {

    const eaMatchId =
        String(eaMatch.matchId);


    // --------------------------------------------------
    // VERIFICAR SE JÁ EXISTE
    // --------------------------------------------------

    const {
        data: jogoExistente,
        error: erroExistente
    } = await supabase

        .from('matches')

        .select('id, ea_match_id')

        .eq(
            'ea_match_id',
            eaMatchId
        )

        .maybeSingle();


    if (erroExistente) {
        throw erroExistente;
    }


    if (jogoExistente) {

        return {
            imported: false,
            reason: 'duplicate',
            eaMatchId
        };

    }


    // --------------------------------------------------
    // IDENTIFICAR CLUBES
    // --------------------------------------------------

    const clubes =
        eaMatch.clubs || {};


    const suave =
        clubes[EA_CLUB_ID];


    if (!suave) {

        throw new Error(
            `O clube ${EA_CLUB_ID} não aparece no jogo ${eaMatchId}.`
        );

    }


    const opponentEntry =
        Object.entries(clubes)
            .find(
                ([clubId]) =>
                    String(clubId) !==
                    EA_CLUB_ID
            );


    if (!opponentEntry) {

        throw new Error(
            `Não consegui identificar o adversário no jogo ${eaMatchId}.`
        );

    }


    const [
        opponentClubId,
        opponent
    ] = opponentEntry;


    const opponentName =
        opponent?.details?.name ||
        `CLUBE ${opponentClubId}`;


    const suaveScore =
        eaNumber(
            suave.goals,
            eaNumber(suave.score)
        );


    const opponentScore =
        eaNumber(
            opponent.goals,
            eaNumber(opponent.score)
        );


    const playedAt =
        eaMatch.timestamp
            ? new Date(
                Number(eaMatch.timestamp) * 1000
            ).toISOString()
            : new Date().toISOString();


    // --------------------------------------------------
    // CRIAR SÉRIE
    // Cada League Match da EA é inicialmente
    // uma série de jogo único.
    // --------------------------------------------------

    const {
        data: serie,
        error: erroSerie
    } = await supabase

        .from('match_series')

        .insert({

            opponent_name:
                opponentName,

            opponent_logo_url:
                null,

            competition:
                'PRO CLUBS',

            format:
                'LEAGUE MATCH',

            played_at:
                playedAt,

            suave_series_score:
                suaveScore,

            opponent_series_score:
                opponentScore,

            status:
                'completed',

            notes:
                `EA FC · ${matchType} · EA Match ID ${eaMatchId}`

        })

        .select('id')

        .single();


    if (erroSerie) {
        throw erroSerie;
    }


    try {

        // --------------------------------------------------
        // CRIAR JOGO
        // --------------------------------------------------

        const {
            data: jogo,
            error: erroJogo
        } = await supabase

            .from('matches')

            .insert({

                series_id:
                    serie.id,

                game_number:
                    1,

                suave_score:
                    suaveScore,

                opponent_score:
                    opponentScore,

                ea_match_id:
                    eaMatchId,

                match_type:
                    matchType

            })

            .select('id')

            .single();


        if (erroJogo) {
            throw erroJogo;
        }


        // --------------------------------------------------
        // JOGADORES DO SUAVEMENTE FC
        // --------------------------------------------------

        const jogadoresEa =
            eaMatch.players?.[EA_CLUB_ID] ||
            {};


        const stats = [];


        for (
            const [eaPlayerId, jogadorEa]
            of Object.entries(jogadoresEa)
        ) {

            const eaName =
                String(
                    jogadorEa.playername ||
                    ''
                ).trim();


            const jogadorPlantel =
                jogadoresPlantel.find(
                    jogador =>
                        normalizeEaName(
                            jogador.ea_name
                        ) ===
                        normalizeEaName(
                            eaName
                        )
                );


            // Se encontrámos o jogador do plantel,
            // guardamos também o ID numérico da EA.

            if (
                jogadorPlantel &&
                eaPlayerId &&
                jogadorPlantel.ea_player_id !==
                    String(eaPlayerId)
            ) {

                const {
                    error: erroEaPlayerId
                } = await supabase

                    .from('players')

                    .update({
                        ea_player_id:
                            String(eaPlayerId)
                    })

                    .eq(
                        'id',
                        jogadorPlantel.id
                    );


                if (erroEaPlayerId) {

                    console.warn(
                        `⚠️ Não consegui guardar EA Player ID de ${eaName}:`,
                        erroEaPlayerId
                    );

                }

            }


            stats.push({

                match_id:
                    jogo.id,

                player_id:
                    jogadorPlantel
                        ? jogadorPlantel.id
                        : null,

                ea_player_id:
                    String(eaPlayerId),

                ea_name:
                    eaName,

                position:
                    jogadorEa.pos !== undefined
                        ? String(jogadorEa.pos)
                        : null,

                goals:
                    eaNumber(
                        jogadorEa.goals
                    ),

                assists:
                    eaNumber(
                        jogadorEa.assists
                    ),

                shots:
                    eaNullableNumber(
                        jogadorEa.shots
                    ),

                tackles:
                    eaNullableNumber(
                        jogadorEa.tacklesmade
                    ),

                tackle_attempts:
                    eaNullableNumber(
                        jogadorEa.tackleattempts
                    ),

                passes_made:
                    eaNullableNumber(
                        jogadorEa.passesmade
                    ),

                pass_attempts:
                    eaNullableNumber(
                        jogadorEa.passattempts
                    ),

                red_cards:
                    eaNumber(
                        jogadorEa.redcards
                    ),

                rating:
                    eaNullableNumber(
                        jogadorEa.rating
                    ),

                saves:
                    eaNullableNumber(
                        jogadorEa.saves
                    ),

                goals_conceded:
                    eaNullableNumber(
                        jogadorEa.goalsconceded
                    ),

                man_of_the_match:
                    eaNumber(
                        jogadorEa.mom
                    ) === 1

            });

        }


        // --------------------------------------------------
        // GUARDAR STATS DOS JOGADORES
        // --------------------------------------------------

        if (stats.length > 0) {

            const {
                error: erroStats
            } = await supabase

                .from(
                    'match_player_stats'
                )

                .insert(stats);


            if (erroStats) {
                throw erroStats;
            }

        }


        return {

            imported:
                true,

            eaMatchId,

            matchType,

            opponentName,

            suaveScore,

            opponentScore,

            players:
                stats.length,
            
            stats

        };

    }

    catch (error) {

        // Se alguma coisa falhar depois de criar
        // a série, apagamos a série.
        //
        // Como as FK têm ON DELETE CASCADE,
        // o jogo/stats incompletos também desaparecem.

        const {
            error: erroRollback
        } = await supabase

            .from('match_series')

            .delete()

            .eq(
                'id',
                serie.id
            );


        if (erroRollback) {

            console.error(
                '❌ Falhou também o rollback:',
                erroRollback
            );

        }


        throw error;

    }

}


// ======================================================
// CARTÃO DE RESULTADO — DISCORD
// ======================================================

async function publicarResultadoDiscord(importacao) {

    if (!RESULTADOS_CHANNEL_ID) {

        console.warn(
            '⚠️ RESULTADOS_CHANNEL_ID não configurado.'
        );

        return;
    }


    const canal =
        await client.channels.fetch(
            RESULTADOS_CHANNEL_ID
        );


    if (
        !canal ||
        !canal.isTextBased()
    ) {

        throw new Error(
            'Canal #resultados não encontrado.'
        );

    }


    const stats =
        importacao.stats || [];


    // --------------------------------------------------
    // NOMES DOS JOGADORES
    // --------------------------------------------------

    const playerIds =
        stats
            .map(stat => stat.player_id)
            .filter(Boolean);


    let nomesPlantel = {};


    if (playerIds.length > 0) {

        const {
            data: jogadores,
            error
        } = await supabase

            .from('players')

            .select('id, name')

            .in(
                'id',
                playerIds
            );


        if (error) {
            throw error;
        }


        nomesPlantel =
            Object.fromEntries(
                (jogadores || [])
                    .map(jogador => [
                        String(jogador.id),
                        jogador.name
                    ])
            );

    }


    const nomeJogador = stat =>
        nomesPlantel[
            String(stat.player_id)
        ] ||
        stat.ea_name ||
        'Jogador';


    // --------------------------------------------------
    // MARCADORES
    // --------------------------------------------------

    const marcadores =
        stats
            .filter(
                stat =>
                    Number(stat.goals) > 0
            )
            .sort(
                (a, b) =>
                    Number(b.goals) -
                    Number(a.goals)
            );


    const textoMarcadores =
        marcadores.length > 0

            ? marcadores
                .map(
                    stat =>
                        `**${nomeJogador(stat)}** ×${stat.goals}`
                )
                .join('\n')

            : '—';


    // --------------------------------------------------
    // ASSISTÊNCIAS
    // --------------------------------------------------

    const assistencias =
        stats
            .filter(
                stat =>
                    Number(stat.assists) > 0
            )
            .sort(
                (a, b) =>
                    Number(b.assists) -
                    Number(a.assists)
            );


    const textoAssistencias =
        assistencias.length > 0

            ? assistencias
                .map(
                    stat =>
                        `**${nomeJogador(stat)}** ×${stat.assists}`
                )
                .join('\n')

            : '—';


    // --------------------------------------------------
    // MVP
    // --------------------------------------------------

    const mvpEa =
        stats.find(
            stat =>
                stat.man_of_the_match === true
        );


    const mvp =
        mvpEa ||
        [...stats]
            .filter(
                stat =>
                    Number.isFinite(
                        Number(stat.rating)
                    )
            )
            .sort(
                (a, b) =>
                    Number(b.rating) -
                    Number(a.rating)
            )[0];


    const textoMvp =
        mvp

            ? `**${nomeJogador(mvp)}** · ${Number(mvp.rating).toFixed(1)}`

            : '—';


    // --------------------------------------------------
    // TIPO DE JOGO
    // --------------------------------------------------

    const tipos = {

        leagueMatch:
            'LEAGUE MATCH',

        friendlyMatch:
            'FRIENDLY MATCH',

        playoffMatch:
            'PLAYOFF MATCH'

    };


    const tipo =
        tipos[importacao.matchType] ||
        String(
            importacao.matchType ||
            'MATCH'
        ).toUpperCase();


    // --------------------------------------------------
    // EMBED
    // --------------------------------------------------

    const embed =
        new EmbedBuilder()

            .setColor(
                0x003C2C
            )

            .setAuthor({
                name:
                    'SUAVEMENTE FC · PRO CLUBS'
            })

            .setTitle(
                `⚽ ${tipo}`
            )

            .setDescription(
                `## SUAVEMENTE FC ${importacao.suaveScore}–${importacao.opponentScore} ${importacao.opponentName}`
            )

            .addFields(

                {
                    name:
                        '⚽ MARCADORES',

                    value:
                        textoMarcadores,

                    inline:
                        true
                },

                {
                    name:
                        '🎯 ASSISTÊNCIAS',

                    value:
                        textoAssistencias,

                    inline:
                        true
                },

                {
                    name:
                        '⭐ MVP',

                    value:
                        textoMvp,

                    inline:
                        false
                }

            )

            .setFooter({
                text:
                    'EA SPORTS FC · PRO CLUBS'
            })

            .setTimestamp();


    await canal.send({
        embeds: [
            embed
        ]
    });

}

// ======================================================
// SINCRONIZAR LEAGUE MATCHES
// ======================================================

async function syncEaLeagueMatches() {

    console.log('');
    console.log('====================================');
    console.log('⚽ EA FC SYNC');
    console.log('====================================');


    // --------------------------------------------------
    // PLANTEL
    // --------------------------------------------------

    const {
        data: jogadoresPlantel,
        error: erroPlantel
    } = await supabase

        .from('players')

        .select(
            'id, name, ea_name, ea_player_id'
        );


    if (erroPlantel) {
        throw erroPlantel;
    }


    // --------------------------------------------------
    // PEDIR JOGOS À EA
    // --------------------------------------------------

    const url =
        'https://proclubs.ea.com/api/fc/clubs/matches' +
        `?platform=${EA_PLATFORM}` +
        `&clubIds=${EA_CLUB_ID}` +
        '&matchType=leagueMatch' +
        '&maxResultCount=10';


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `EA respondeu HTTP ${response.status}`
        );

    }


    const jogos =
        await response.json();


    if (!Array.isArray(jogos)) {

        throw new Error(
            'A EA devolveu uma resposta inesperada.'
        );

    }


    console.log(
        `📥 EA devolveu ${jogos.length} League Match(es).`
    );


    // Mais antigos primeiro.
    // Assim ficam inseridos cronologicamente.

    const jogosOrdenados =
        [...jogos].sort(
            (a, b) =>
                Number(a.timestamp || 0) -
                Number(b.timestamp || 0)
        );


    const resultado = {

        encontrados:
            jogos.length,

        importados:
            0,

        duplicados:
            0,

        jogadores:
            0

    };


    for (const jogoEa of jogosOrdenados) {

        const importacao =
            await importEaMatch(
                jogoEa,
                'leagueMatch',
                jogadoresPlantel || []
            );


        // ----------------------------------------------
        // JOGO JÁ EXISTE
        // ----------------------------------------------

        if (!importacao.imported) {

            resultado.duplicados++;

            console.log(
                `⏭️ ${importacao.eaMatchId} já existe.`
            );

            continue;

        }


        // ----------------------------------------------
        // NOVO JOGO IMPORTADO
        // ----------------------------------------------

        resultado.importados++;

        resultado.jogadores +=
            importacao.players;


        console.log(
            `✅ SUAVEMENTE FC ` +
            `${importacao.suaveScore}-${importacao.opponentScore} ` +
            `${importacao.opponentName} ` +
            `(${importacao.players} jogadores)`
        );


        // ----------------------------------------------
        // PUBLICAR NOVO RESULTADO NO DISCORD
        // ----------------------------------------------

        try {

            await publicarResultadoDiscord(
                importacao
            );

            console.log(
                `📢 Resultado publicado no Discord: ` +
                `SUAVEMENTE FC ` +
                `${importacao.suaveScore}-${importacao.opponentScore} ` +
                `${importacao.opponentName}`
            );

        }

        catch (error) {

            console.error(
                `❌ Jogo ${importacao.eaMatchId} foi importado, ` +
                `mas falhou a publicação no Discord:`,
                error
            );

        }

    }


    console.log('====================================');

    console.log(
        `✅ Novos: ${resultado.importados}`
    );

    console.log(
        `⏭️ Já existentes: ${resultado.duplicados}`
    );

    console.log('====================================');

    console.log('');


    return resultado;

}


// ======================================================
// EXECUTAR COMANDOS /ea
// ======================================================

client.on(
    'interactionCreate',
    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }


        if (
            interaction.commandName !==
            'ea'
        ) {
            return;
        }


        // ==================================================
        // PERMISSÕES
        // ==================================================

        if (
            !interaction.memberPermissions
                ?.has(
                    PermissionFlagsBits.ManageGuild
                )
        ) {

            await interaction.reply({

                content:
                    '❌ Apenas a staff pode utilizar os comandos da EA.',

                ephemeral:
                    true

            });

            return;

        }


        const subcommand =
            interaction.options
                .getSubcommand();


        // ==================================================
        // /ea testarresultado
        // ==================================================

        if (
            subcommand ===
            'testarresultado'
        ) {

            await interaction.deferReply({
                ephemeral:
                    true
            });


            try {

                // ==========================================
                // ÚLTIMO LEAGUE MATCH IMPORTADO
                // ==========================================

                const {
                    data: ultimoJogo,
                    error: erroJogo
                } = await supabase

                    .from('matches')

                    .select(
                        'id, ea_match_id, match_type, suave_score, opponent_score, series_id'
                    )

                    .eq(
                        'match_type',
                        'leagueMatch'
                    )

                    .not(
                        'ea_match_id',
                        'is',
                        null
                    )

                    .order(
                        'id',
                        {
                            ascending: false
                        }
                    )

                    .limit(1)

                    .maybeSingle();


                if (erroJogo) {
                    throw erroJogo;
                }


                if (!ultimoJogo) {

                    await interaction.editReply({
                        content:
                            '❌ Não encontrei nenhum League Match importado.'
                    });

                    return;

                }


                // ==========================================
                // DADOS DA SÉRIE / ADVERSÁRIO
                // ==========================================

                const {
                    data: serie,
                    error: erroSerie
                } = await supabase

                    .from('match_series')

                    .select(
                        'id, opponent_name'
                    )

                    .eq(
                        'id',
                        ultimoJogo.series_id
                    )

                    .single();


                if (erroSerie) {
                    throw erroSerie;
                }


                // ==========================================
                // STATS REAIS DOS JOGADORES
                // ==========================================

                const {
                    data: stats,
                    error: erroStats
                } = await supabase

                    .from('match_player_stats')

                    .select(
                        'player_id, ea_player_id, ea_name, position, goals, assists, rating, man_of_the_match'
                    )

                    .eq(
                        'match_id',
                        ultimoJogo.id
                    );


                if (erroStats) {
                    throw erroStats;
                }


                // ==========================================
                // USAR A FUNÇÃO REAL DO CARTÃO
                // ==========================================

                await publicarResultadoDiscord({

                    imported:
                        true,

                    eaMatchId:
                        ultimoJogo.ea_match_id,

                    matchType:
                        ultimoJogo.match_type,

                    opponentName:
                        serie.opponent_name,

                    suaveScore:
                        ultimoJogo.suave_score,

                    opponentScore:
                        ultimoJogo.opponent_score,

                    players:
                        (stats || []).length,

                    stats:
                        stats || []

                });


                await interaction.editReply({

                    content:
                        `✅ Cartão **REAL** publicado em #resultados.\n` +
                        `Jogo EA: **${ultimoJogo.ea_match_id}**`

                });

            }

            catch (error) {

                console.error(
                    '❌ Erro no teste de resultado real:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Não consegui publicar o resultado real. Vê o CMD para vermos o erro.'
                });

            }


            return;

        }


        // ==================================================
        // /ea sincronizar
        // ==================================================

        if (
            subcommand ===
            'sincronizar'
        ) {

            await interaction.deferReply({
                ephemeral:
                    true
            });


            try {

                const resultado =
                    await syncEaLeagueMatches();


                await interaction.editReply({

                    content:
                        `✅ **EA sincronizada.**\n\n` +
                        `📥 Encontrados: **${resultado.encontrados}**\n` +
                        `🆕 Importados: **${resultado.importados}**\n` +
                        `⏭️ Já existentes: **${resultado.duplicados}**\n` +
                        `👥 Registos de jogadores: **${resultado.jogadores}**`

                });

            }

            catch (error) {

                console.error(
                    '❌ ERRO EA SYNC:',
                    error
                );


                await interaction.editReply({

                    content:
                        '❌ **A sincronização com a EA falhou.**\n' +
                        'Vê o CMD do SUAVE BOT para vermos o erro exato.'

                });

            }


            return;

        }

    }
);

// ======================================================
// SINCRONIZAÇÃO AUTOMÁTICA EA
// ======================================================

const EA_SYNC_INTERVAL =
    30 * 60 * 1000;


client.once(
    'clientReady',
    () => {

        console.log(
            '🔄 Sincronização automática EA ativa — a cada 30 minutos.'
        );


        setInterval(
            async () => {

                try {

                    console.log(
                        '🔎 Verificação automática EA...'
                    );


                    const resultado =
                        await syncEaLeagueMatches();


                    if (
                        resultado.importados > 0
                    ) {

                        console.log(
                            `📢 ${resultado.importados} novo(s) jogo(s) detetado(s) e processado(s).`
                        );

                    }

                }

                catch (error) {

                    console.error(
                        '❌ Erro na sincronização automática EA:',
                        error
                    );

                }

            },
            EA_SYNC_INTERVAL
        );

    }
);


// ======================================================
// LOGIN
// ======================================================

client.login(TOKEN);
