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
// LOGIN
// ======================================================

client.login(TOKEN);