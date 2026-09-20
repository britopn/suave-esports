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
const CALENDARIO_CHANNEL_ID = '1550553630308962334';


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
// AUTOCOMPLETE DOS JOGOS
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
            'jogo'
        ) {
            return;
        }


        const focused =
            interaction.options
                .getFocused(true);


        if (
            focused.name !==
            'jogo'
        ) {
            return;
        }


        try {

            const {
                data: jogos,
                error
            } = await supabase

                .from('scheduled_matches')

                .select(
                    'id, opponent_name, competition, scheduled_at'
                )

                .eq(
                    'status',
                    'scheduled'
                )

                .order(
                    'scheduled_at',
                    {
                        ascending: true
                    }
                );


            if (error) {

                console.error(
                    '❌ Erro no autocomplete dos jogos:',
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
                (jogos || [])

                    .map(jogo => {

                        const data =
                            new Date(
                                jogo.scheduled_at
                            );


                        const dataFormatada =
                            data.toLocaleDateString(
                                'pt-PT',
                                {
                                    day: '2-digit',
                                    month: '2-digit'
                                }
                            );


                        const horaFormatada =
                            data.toLocaleTimeString(
                                'pt-PT',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }
                            );


                        return {

                            jogo,

                            texto:
                                `${dataFormatada} · ${horaFormatada} · ` +
                                `SUAVEMENTE FC vs ${jogo.opponent_name}`

                        };

                    })

                    .filter(item =>

                        item.texto
                            .toLowerCase()
                            .includes(
                                pesquisa
                            )

                    )

                    .slice(0, 25)

                    .map(item => ({

                        name:
                            item.texto,

                        value:
                            String(
                                item.jogo.id
                            )

                    }));


            await interaction.respond(
                resultados
            );

        }

        catch (error) {

            console.error(
                '❌ Erro inesperado no autocomplete dos jogos:',
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


                // ==========================================
                // PROCURAR JOGADOR
                // ==========================================

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


                // ==========================================
                // DESCARREGAR FOTO DO DISCORD
                // ==========================================

                const respostaFoto =
                    await fetch(
                        foto.url
                    );


                if (!respostaFoto.ok) {

                    throw new Error(
                        `Não consegui descarregar a imagem do Discord. HTTP ${respostaFoto.status}`
                    );

                }


                const imagemBuffer =
                    Buffer.from(
                        await respostaFoto.arrayBuffer()
                    );


                // ==========================================
                // EXTENSÃO / NOME DO FICHEIRO
                // ==========================================

                const extensao =
                    foto.name
                        ?.split('.')
                        .pop()
                        ?.toLowerCase() ||
                    'jpg';


                const caminhoFoto =
                    `players/${jogador.id}.${extensao}`;


                // ==========================================
                // GUARDAR NO SUPABASE STORAGE
                // ==========================================

                const {
                    error: erroUpload
                } = await supabase.storage

                    .from('player-photos')

                    .upload(
                        caminhoFoto,
                        imagemBuffer,
                        {
                            contentType:
                                foto.contentType,

                            upsert:
                                true
                        }
                    );


                if (erroUpload) {

                    console.error(
                        '❌ Erro no upload da fotografia:',
                        erroUpload
                    );

                    await interaction.editReply({
                        content:
                            '❌ Não consegui guardar a fotografia no Storage.'
                    });

                    return;

                }


                // ==========================================
                // OBTER URL PÚBLICO PERMANENTE
                // ==========================================

                const {
                    data: publicUrlData
                } = supabase.storage

                    .from('player-photos')

                    .getPublicUrl(
                        caminhoFoto
                    );


                const photoUrl =
                    publicUrlData.publicUrl;


                // ==========================================
                // ATUALIZAR JOGADOR
                // ==========================================

                const {
                    data: jogadorAtualizado,
                    error: erroUpdate
                } = await supabase

                    .from('players')

                    .update({
                        photo_url:
                            photoUrl
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
                            '❌ A fotografia foi guardada, mas não consegui atualizar o jogador.'
                    });

                    return;

                }


                // ==========================================
                // DISCORD EMBED
                // ==========================================

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
                    `📸 Fotografia permanente atualizada: ` +
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
// JOGOS — CALENDÁRIO
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName('jogo')

        .setDescription(
            'Gestão do calendário do SUAVEMENTE FC'
        )


        // ==================================================
        // /jogo marcar
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('marcar')

                .setDescription(
                    'Marca um novo jogo do SUAVEMENTE FC'
                )

                .addStringOption(option =>

                    option

                        .setName('adversario')

                        .setDescription(
                            'Nome da equipa adversária'
                        )

                        .setRequired(true)

                )

                .addStringOption(option =>

                    option

                        .setName('data')

                        .setDescription(
                            'Data do jogo — exemplo: 25/09/2026'
                        )

                        .setRequired(true)

                )

                .addStringOption(option =>

                    option

                        .setName('hora')

                        .setDescription(
                            'Hora do jogo — exemplo: 21:30'
                        )

                        .setRequired(true)

                )

                .addStringOption(option =>

                    option

                        .setName('competicao')

                        .setDescription(
                            'Competição — exemplo: Zoryx League'
                        )

                        .setRequired(true)

                )

        )


        // ==================================================
        // /jogo editar
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('editar')

                .setDescription(
                    'Edita um jogo já marcado'
                )

                .addStringOption(option =>

                    option

                        .setName('jogo')

                        .setDescription(
                            'Jogo que queres editar'
                        )

                        .setRequired(true)

                        .setAutocomplete(true)

                )

                .addStringOption(option =>

                    option

                        .setName('adversario')

                        .setDescription(
                            'Novo nome da equipa adversária'
                        )

                        .setRequired(false)

                )

                .addStringOption(option =>

                    option

                        .setName('data')

                        .setDescription(
                            'Nova data — exemplo: 25/09/2026'
                        )

                        .setRequired(false)

                )

                .addStringOption(option =>

                    option

                        .setName('hora')

                        .setDescription(
                            'Nova hora — exemplo: 21:30'
                        )

                        .setRequired(false)

                )

                .addStringOption(option =>

                    option

                        .setName('competicao')

                        .setDescription(
                            'Nova competição'
                        )

                        .setRequired(false)

                )

        )


        // ==================================================
        // /jogo apagar
        // ==================================================

        .addSubcommand(subcommand =>

            subcommand

                .setName('apagar')

                .setDescription(
                    'Apaga um jogo do calendário'
                )

                .addStringOption(option =>

                    option

                        .setName('jogo')

                        .setDescription(
                            'Jogo que queres apagar'
                        )

                        .setRequired(true)

                        .setAutocomplete(true)

                )

        )

);

// ======================================================
// EXECUTAR COMANDOS /jogo
// ======================================================

client.on(
    'interactionCreate',
    async interaction => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        if (interaction.commandName !== 'jogo') {
            return;
        }


        // ==================================================
        // PERMISSÕES
        // ==================================================

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {

            await interaction.reply({
                content:
                    '❌ Apenas a staff pode gerir o calendário.',
                ephemeral: true
            });

            return;
        }


        const subcommand =
            interaction.options.getSubcommand();


        // ==================================================
        // HELPER — CRIAR EMBED DO JOGO
        // ==================================================

        function criarEmbedJogo(jogo) {

            const timestampDiscord =
                Math.floor(
                    new Date(
                        jogo.scheduled_at
                    ).getTime() / 1000
                );


            return new EmbedBuilder()

                .setColor(0x003C2C)

                .setAuthor({
                    name:
                        'SUAVEMENTE FC · CALENDÁRIO'
                })

                .setTitle(
                    `⚽ SUAVEMENTE FC vs ${jogo.opponent_name.toUpperCase()}`
                )

                .setDescription(
                    `**${jogo.competition.toUpperCase()}**`
                )

                .addFields(
                    {
                        name:
                            '📅 DATA',

                        value:
                            `<t:${timestampDiscord}:D>`,

                        inline:
                            true
                    },

                    {
                        name:
                            '🕘 HORA',

                        value:
                            `<t:${timestampDiscord}:t>`,

                        inline:
                            true
                    }
                )

                .setFooter({
                    text:
                        'SUAVE ESPORTS · CALENDÁRIO'
                });
        }


        // ==================================================
        // HELPER — VALIDAR / CONSTRUIR DATA
        // ==================================================

        function construirData(
            dataTexto,
            horaTexto
        ) {

            const dataMatch =
                dataTexto.match(
                    /^(\d{2})\/(\d{2})\/(\d{4})$/
                );


            if (!dataMatch) {

                return {
                    erro:
                        '❌ A data tem de estar no formato `DD/MM/AAAA`.'
                };

            }


            const horaMatch =
                horaTexto.match(
                    /^([01]\d|2[0-3]):([0-5]\d)$/
                );


            if (!horaMatch) {

                return {
                    erro:
                        '❌ A hora tem de estar no formato `HH:MM`.'
                };

            }


            const dia =
                Number(dataMatch[1]);

            const mes =
                Number(dataMatch[2]);

            const ano =
                Number(dataMatch[3]);

            const horas =
                Number(horaMatch[1]);

            const minutos =
                Number(horaMatch[2]);


            const dataFinal =
                new Date(
                    ano,
                    mes - 1,
                    dia,
                    horas,
                    minutos,
                    0,
                    0
                );


            if (
                dataFinal.getFullYear() !== ano ||
                dataFinal.getMonth() !== mes - 1 ||
                dataFinal.getDate() !== dia
            ) {

                return {
                    erro:
                        '❌ Essa data não é válida.'
                };

            }


            if (
                dataFinal.getTime() <=
                Date.now()
            ) {

                return {
                    erro:
                        '❌ O jogo tem de estar marcado para uma data futura.'
                };

            }


            return {
                data:
                    dataFinal
            };

        }


        // ==================================================
        // /jogo marcar
        // ==================================================

        if (subcommand === 'marcar') {

            await interaction.deferReply({
                ephemeral: true
            });


            try {

                const adversario =
                    interaction.options
                        .getString('adversario')
                        .trim();


                const dataTexto =
                    interaction.options
                        .getString('data')
                        .trim();


                const horaTexto =
                    interaction.options
                        .getString('hora')
                        .trim();


                const competicao =
                    interaction.options
                        .getString('competicao')
                        .trim();


                if (!adversario) {

                    await interaction.editReply({
                        content:
                            '❌ O adversário não pode ficar vazio.'
                    });

                    return;
                }


                if (!competicao) {

                    await interaction.editReply({
                        content:
                            '❌ A competição não pode ficar vazia.'
                    });

                    return;
                }


                const resultadoData =
                    construirData(
                        dataTexto,
                        horaTexto
                    );


                if (resultadoData.erro) {

                    await interaction.editReply({
                        content:
                            resultadoData.erro
                    });

                    return;
                }


                // ==========================================
                // GUARDAR NO SUPABASE
                // ==========================================

                const {
                    data: jogo,
                    error: erroInsert
                } = await supabase

                    .from('scheduled_matches')

                    .insert({
                        opponent_name:
                            adversario,

                        competition:
                            competicao,

                        scheduled_at:
                            resultadoData.data.toISOString(),

                        status:
                            'scheduled'
                    })

                    .select()

                    .single();


                if (erroInsert) {
                    throw erroInsert;
                }


                // ==========================================
                // PUBLICAR NO #CALENDÁRIO
                // ==========================================

                const canal =
                    await client.channels.fetch(
                        CALENDARIO_CHANNEL_ID
                    );


                if (
                    !canal ||
                    !canal.isTextBased()
                ) {

                    // Se não conseguimos publicar,
                    // removemos o jogo que acabámos de criar.

                    await supabase
                        .from('scheduled_matches')
                        .delete()
                        .eq(
                            'id',
                            jogo.id
                        );


                    throw new Error(
                        'Canal #calendário não encontrado.'
                    );
                }


                let mensagemCalendario;


                try {

                    mensagemCalendario =
                        await canal.send({
                            embeds: [
                                criarEmbedJogo(jogo)
                            ]
                        });

                }

                catch (erroDiscord) {

                    // Não queremos um jogo guardado
                    // se nem sequer conseguimos publicá-lo.

                    await supabase
                        .from('scheduled_matches')
                        .delete()
                        .eq(
                            'id',
                            jogo.id
                        );


                    throw erroDiscord;
                }


                // ==========================================
                // GUARDAR ID DA MENSAGEM DISCORD
                // ==========================================

                const {
                    error: erroMensagemId
                } = await supabase

                    .from('scheduled_matches')

                    .update({
                        discord_message_id:
                            mensagemCalendario.id
                    })

                    .eq(
                        'id',
                        jogo.id
                    );


                if (erroMensagemId) {

                    // Rollback:
                    // se não conseguimos ligar a mensagem
                    // ao jogo, apagamos ambos.

                    try {
                        await mensagemCalendario.delete();
                    }
                    catch {
                        // mensagem já pode não existir
                    }


                    await supabase
                        .from('scheduled_matches')
                        .delete()
                        .eq(
                            'id',
                            jogo.id
                        );


                    throw erroMensagemId;
                }


                // ==========================================
                // CONFIRMAÇÃO
                // ==========================================

                await interaction.editReply({
                    content:
                        `✅ **Jogo marcado.**\n` +
                        `SUAVEMENTE FC vs **${jogo.opponent_name}**\n` +
                        `📅 ${dataTexto} · ${horaTexto}\n` +
                        `🏆 ${jogo.competition}`
                });


                console.log(
                    `📅 Jogo marcado: ` +
                    `SUAVEMENTE FC vs ${jogo.opponent_name} · ` +
                    `${dataTexto} ${horaTexto}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro em /jogo marcar:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Não consegui marcar o jogo.'
                });

            }


            return;
        }


        // ==================================================
        // /jogo editar
        // ==================================================

        if (subcommand === 'editar') {

            await interaction.deferReply({
                ephemeral: true
            });


            try {

                const jogoId =
                    interaction.options
                        .getString('jogo');


                const novoAdversario =
                    interaction.options
                        .getString('adversario');


                const novaData =
                    interaction.options
                        .getString('data');


                const novaHora =
                    interaction.options
                        .getString('hora');


                const novaCompeticao =
                    interaction.options
                        .getString('competicao');


                if (
                    novoAdversario === null &&
                    novaData === null &&
                    novaHora === null &&
                    novaCompeticao === null
                ) {

                    await interaction.editReply({
                        content:
                            '❌ Tens de alterar pelo menos um campo.'
                    });

                    return;
                }


                // ==========================================
                // PROCURAR JOGO ATUAL
                // ==========================================

                const {
                    data: jogoAtual,
                    error: erroPesquisa
                } = await supabase

                    .from('scheduled_matches')

                    .select('*')

                    .eq(
                        'id',
                        jogoId
                    )

                    .maybeSingle();


                if (erroPesquisa) {
                    throw erroPesquisa;
                }


                if (!jogoAtual) {

                    await interaction.editReply({
                        content:
                            '❌ Esse jogo já não existe.'
                    });

                    return;
                }


                // ==========================================
                // DATA/HORA ATUAIS
                // ==========================================

                const dataAtual =
                    new Date(
                        jogoAtual.scheduled_at
                    );


                const dataAtualTexto =
                    [
                        String(
                            dataAtual.getDate()
                        ).padStart(2, '0'),

                        String(
                            dataAtual.getMonth() + 1
                        ).padStart(2, '0'),

                        dataAtual.getFullYear()
                    ].join('/');


                const horaAtualTexto =
                    [
                        String(
                            dataAtual.getHours()
                        ).padStart(2, '0'),

                        String(
                            dataAtual.getMinutes()
                        ).padStart(2, '0')
                    ].join(':');


                const dataTextoFinal =
                    novaData !== null
                        ? novaData.trim()
                        : dataAtualTexto;


                const horaTextoFinal =
                    novaHora !== null
                        ? novaHora.trim()
                        : horaAtualTexto;


                const resultadoData =
                    construirData(
                        dataTextoFinal,
                        horaTextoFinal
                    );


                if (resultadoData.erro) {

                    await interaction.editReply({
                        content:
                            resultadoData.erro
                    });

                    return;
                }


                const adversarioFinal =
                    novoAdversario !== null
                        ? novoAdversario.trim()
                        : jogoAtual.opponent_name;


                const competicaoFinal =
                    novaCompeticao !== null
                        ? novaCompeticao.trim()
                        : jogoAtual.competition;


                if (!adversarioFinal) {

                    await interaction.editReply({
                        content:
                            '❌ O adversário não pode ficar vazio.'
                    });

                    return;
                }


                if (!competicaoFinal) {

                    await interaction.editReply({
                        content:
                            '❌ A competição não pode ficar vazia.'
                    });

                    return;
                }


                const dadosAtualizados = {

                    ...jogoAtual,

                    opponent_name:
                        adversarioFinal,

                    competition:
                        competicaoFinal,

                    scheduled_at:
                        resultadoData.data.toISOString()

                };


                // ==========================================
                // ATUALIZAR SUPABASE
                // ==========================================

                const {
                    data: jogoAtualizado,
                    error: erroUpdate
                } = await supabase

                    .from('scheduled_matches')

                    .update({
                        opponent_name:
                            adversarioFinal,

                        competition:
                            competicaoFinal,

                        scheduled_at:
                            resultadoData.data.toISOString()
                    })

                    .eq(
                        'id',
                        jogoId
                    )

                    .select()

                    .single();


                if (erroUpdate) {
                    throw erroUpdate;
                }


                // ==========================================
                // EDITAR A MESMA MENSAGEM NO DISCORD
                // ==========================================

                const canal =
                    await client.channels.fetch(
                        CALENDARIO_CHANNEL_ID
                    );


                if (
                    !canal ||
                    !canal.isTextBased()
                ) {

                    throw new Error(
                        'Canal #calendário não encontrado.'
                    );
                }


                let mensagemCalendario = null;


                if (
                    jogoAtual.discord_message_id
                ) {

                    try {

                        mensagemCalendario =
                            await canal.messages.fetch(
                                jogoAtual.discord_message_id
                            );

                    }

                    catch {
                        mensagemCalendario = null;
                    }

                }


                if (mensagemCalendario) {

                    await mensagemCalendario.edit({
                        embeds: [
                            criarEmbedJogo(
                                jogoAtualizado
                            )
                        ]
                    });

                }

                else {

                    // Se a mensagem original desapareceu,
                    // criamos outra e voltamos a guardar o ID.

                    const novaMensagem =
                        await canal.send({
                            embeds: [
                                criarEmbedJogo(
                                    jogoAtualizado
                                )
                            ]
                        });


                    const {
                        error: erroNovoId
                    } = await supabase

                        .from('scheduled_matches')

                        .update({
                            discord_message_id:
                                novaMensagem.id
                        })

                        .eq(
                            'id',
                            jogoId
                        );


                    if (erroNovoId) {
                        throw erroNovoId;
                    }

                }


                // ==========================================
                // CONFIRMAÇÃO
                // ==========================================

                await interaction.editReply({
                    content:
                        `✅ **Jogo atualizado.**\n` +
                        `SUAVEMENTE FC vs **${jogoAtualizado.opponent_name}**\n` +
                        `📅 ${dataTextoFinal} · ${horaTextoFinal}\n` +
                        `🏆 ${jogoAtualizado.competition}`
                });


                console.log(
                    `✏️ Jogo atualizado: ` +
                    `SUAVEMENTE FC vs ${jogoAtualizado.opponent_name}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro em /jogo editar:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Não consegui editar o jogo.'
                });

            }


            return;
        }


        // ==================================================
        // /jogo apagar
        // ==================================================

        if (subcommand === 'apagar') {

            await interaction.deferReply({
                ephemeral: true
            });


            try {

                const jogoId =
                    interaction.options
                        .getString('jogo');


                // ==========================================
                // PROCURAR JOGO
                // ==========================================

                const {
                    data: jogo,
                    error: erroPesquisa
                } = await supabase

                    .from('scheduled_matches')

                    .select('*')

                    .eq(
                        'id',
                        jogoId
                    )

                    .maybeSingle();


                if (erroPesquisa) {
                    throw erroPesquisa;
                }


                if (!jogo) {

                    await interaction.editReply({
                        content:
                            '❌ Esse jogo já não existe.'
                    });

                    return;
                }


                // ==========================================
                // APAGAR MENSAGEM DO #CALENDÁRIO
                // ==========================================

                if (
                    jogo.discord_message_id
                ) {

                    try {

                        const canal =
                            await client.channels.fetch(
                                CALENDARIO_CHANNEL_ID
                            );


                        if (
                            canal &&
                            canal.isTextBased()
                        ) {

                            const mensagem =
                                await canal.messages.fetch(
                                    jogo.discord_message_id
                                );


                            if (mensagem) {
                                await mensagem.delete();
                            }

                        }

                    }

                    catch (error) {

                        // Se a mensagem já tiver sido apagada
                        // manualmente, continuamos normalmente.

                        console.log(
                            '⚠️ A mensagem do calendário já não existe ou não pôde ser apagada.'
                        );

                    }

                }


                // ==========================================
                // APAGAR DO SUPABASE
                // ==========================================

                const {
                    error: erroDelete
                } = await supabase

                    .from('scheduled_matches')

                    .delete()

                    .eq(
                        'id',
                        jogoId
                    );


                if (erroDelete) {
                    throw erroDelete;
                }


                // ==========================================
                // CONFIRMAÇÃO
                // ==========================================

                await interaction.editReply({
                    content:
                        `🗑️ **Jogo apagado do calendário.**\n` +
                        `SUAVEMENTE FC vs **${jogo.opponent_name}**`
                });


                console.log(
                    `🗑️ Jogo apagado: ` +
                    `SUAVEMENTE FC vs ${jogo.opponent_name}`
                );

            }

            catch (error) {

                console.error(
                    '❌ Erro em /jogo apagar:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Não consegui apagar o jogo.'
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

        .addSubcommand(subcommand =>

            subcommand

                .setName('procurarfotos')

                .setDescription(
                    'Procura fotografias antigas do plantel no Discord'
                )

        )
                .addSubcommand(subcommand =>

            subcommand

                .setName('migrarfotos')

                .setDescription(
                    'Migra as fotografias antigas do plantel para o Supabase Storage'
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
// ATUALIZAR ESTATÍSTICAS DO CLUBE EA
// ======================================================

async function syncEaClubStats() {

    console.log(
        '📊 A atualizar estatísticas EA do SUAVEMENTE FC...'
    );


    const seasonUrl =
        'https://proclubs.ea.com/api/fc/currentSeasonLeaderboard/search' +
        `?platform=${EA_PLATFORM}` +
        '&clubName=SUAVEMENTE%20FC' +
        '&maxResultCount=20';


    const overallUrl =
        'https://proclubs.ea.com/api/fc/clubs/overallStats' +
        `?platform=${EA_PLATFORM}` +
        `&clubIds=${EA_CLUB_ID}`;


    const [
        seasonResponse,
        overallResponse
    ] = await Promise.all([
        fetch(seasonUrl),
        fetch(overallUrl)
    ]);


    if (!seasonResponse.ok) {

        throw new Error(
            `EA Season Stats respondeu HTTP ${seasonResponse.status}`
        );

    }


    if (!overallResponse.ok) {

        throw new Error(
            `EA Overall Stats respondeu HTTP ${overallResponse.status}`
        );

    }


    const seasonData =
        await seasonResponse.json();

    const overallData =
        await overallResponse.json();


    const season =
        Array.isArray(seasonData)
            ? seasonData.find(
                club =>
                    String(club.clubId) ===
                    EA_CLUB_ID
            )
            : null;


    const overall =
        Array.isArray(overallData)
            ? overallData.find(
                club =>
                    String(club.clubId) ===
                    EA_CLUB_ID
            )
            : null;


    if (!season) {

        throw new Error(
            'SUAVEMENTE FC não encontrado nas estatísticas da época.'
        );

    }


    const stats = {

        id:
            1,

        club_id:
            EA_CLUB_ID,

        club_name:
            season.clubName ||
            season.clubInfo?.name ||
            'SUAVEMENTE FC',

        current_division:
            eaNullableNumber(
                season.currentDivision
            ),

        best_division:
            eaNullableNumber(
                season.bestDivision
            ),

        games_played:
            eaNumber(
                season.gamesPlayed
            ),

        wins:
            eaNumber(
                season.wins
            ),

        draws:
            eaNumber(
                season.ties
            ),

        losses:
            eaNumber(
                season.losses
            ),

        goals:
            eaNumber(
                season.goals
            ),

        goals_against:
            eaNumber(
                season.goalsAgainst
            ),

        clean_sheets:
            eaNumber(
                season.cleanSheets
            ),

        points:
            eaNumber(
                season.points
            ),

        promotions:
            eaNumber(
                season.promotions
            ),

        relegations:
            eaNumber(
                season.relegations
            ),

        skill_rating:
            overall
                ? eaNullableNumber(
                    overall.skillRating
                )
                : null,

        updated_at:
            new Date().toISOString()

    };


    const {
        error
    } = await supabase

        .from('ea_club_stats')

        .upsert(
            stats,
            {
                onConflict:
                    'id'
            }
        );


    if (error) {
        throw error;
    }


    console.log(
        `📊 EA STATS: Divisão ${stats.current_division} · ` +
        `${stats.games_played}J · ` +
        `${stats.wins}V ${stats.draws}E ${stats.losses}D · ` +
        `${stats.points} PTS · ` +
        `Skill ${stats.skill_rating ?? '—'}`
    );


    return stats;

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
    // ATUALIZAR ESTATÍSTICAS GERAIS DO CLUBE
    // --------------------------------------------------

    try {

        await syncEaClubStats();

    }

    catch (error) {

        console.error(
            '❌ Erro ao atualizar estatísticas gerais da EA:',
            error
        );

    }


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
        // /ea migrarfotos
        // ==================================================

        if (
            subcommand ===
            'migrarfotos'
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                const CANAL_FOTOS_ID =
                    '1550266416924721255';


                // ==========================================
                // PLANTEL ATUAL
                // ==========================================

                const {
                    data: jogadores,
                    error: erroJogadores
                } = await supabase

                    .from('players')

                    .select(
                        'id, name, number, photo_url'
                    );


                if (erroJogadores) {
                    throw erroJogadores;
                }


                const normalizar =
                    valor =>
                        String(valor || '')
                            .trim()
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(
                                /[\u0300-\u036f]/g,
                                ''
                            );


                // ==========================================
                // CANAL DISCORD
                // ==========================================

                const canal =
                    await client.channels.fetch(
                        CANAL_FOTOS_ID
                    );


                if (
                    !canal ||
                    !canal.isTextBased()
                ) {

                    throw new Error(
                        'Canal das fotografias não encontrado.'
                    );

                }


                let before = undefined;

                const candidatos = [];


                // ==========================================
                // PROCURAR CARTÕES ANTIGOS
                // ==========================================

                while (true) {

                    const mensagens =
                        await canal.messages.fetch({
                            limit: 100,
                            ...(before
                                ? { before }
                                : {})
                        });


                    if (
                        mensagens.size === 0
                    ) {
                        break;
                    }


                    for (
                        const mensagem
                        of mensagens.values()
                    ) {

                        if (
                            mensagem.author.id !==
                            client.user.id
                        ) {
                            continue;
                        }


                        for (
                            const embed
                            of mensagem.embeds
                        ) {

                            const autor =
                                embed.author?.name ||
                                '';


                            if (
                                !autor.includes(
                                    'SUAVE FC · PLANTEL'
                                )
                            ) {
                                continue;
                            }


                            const titulo =
                                embed.title || '';


                            const imageUrl =
                                embed.image?.url;


                            if (
                                !titulo ||
                                !imageUrl
                            ) {
                                continue;
                            }


                            // Exemplo:
                            // #23 · BRITO

                            const match =
                                titulo.match(
                                    /^#(\d+)\s*·\s*(.+)$/i
                                );


                            if (!match) {
                                continue;
                            }


                            candidatos.push({

                                numero:
                                    Number(match[1]),

                                nome:
                                    match[2].trim(),

                                imageUrl,

                                createdTimestamp:
                                    mensagem.createdTimestamp

                            });

                        }

                    }


                    before =
                        mensagens.last()?.id;


                    if (
                        mensagens.size < 100
                    ) {
                        break;
                    }

                }


                // Mais recentes primeiro
                candidatos.sort(
                    (a, b) =>
                        b.createdTimestamp -
                        a.createdTimestamp
                );


                // ==========================================
                // MIGRAR
                // ==========================================

                const resultados = [];


                for (
                    const jogador
                    of jogadores || []
                ) {

                    const candidato =
                        candidatos.find(
                            item =>
                                item.numero ===
                                    Number(jogador.number) &&
                                normalizar(item.nome) ===
                                    normalizar(jogador.name)
                        );


                    if (!candidato) {

                        resultados.push(
                            `⚪ #${jogador.number} ${jogador.name} — não encontrei cartão`
                        );

                        continue;

                    }


                    try {

                        // ==================================
                        // DESCARREGAR DO DISCORD
                        // ==================================

                        const respostaFoto =
                            await fetch(
                                candidato.imageUrl
                            );


                        if (!respostaFoto.ok) {

                            resultados.push(
                                `🔴 #${jogador.number} ${jogador.name} — imagem indisponível`
                            );

                            continue;

                        }


                        const contentType =
                            respostaFoto.headers.get(
                                'content-type'
                            ) ||
                            'image/jpeg';


                        const buffer =
                            Buffer.from(
                                await respostaFoto.arrayBuffer()
                            );


                        let extensao = 'jpg';


                        if (
                            contentType.includes('png')
                        ) {
                            extensao = 'png';
                        }

                        else if (
                            contentType.includes('webp')
                        ) {
                            extensao = 'webp';
                        }

                        else if (
                            contentType.includes('gif')
                        ) {
                            extensao = 'gif';
                        }


                        const caminho =
                            `players/${jogador.id}.${extensao}`;


                        // ==================================
                        // UPLOAD SUPABASE STORAGE
                        // ==================================

                        const {
                            error: erroUpload
                        } = await supabase.storage

                            .from(
                                'player-photos'
                            )

                            .upload(
                                caminho,
                                buffer,
                                {
                                    contentType,
                                    upsert: true
                                }
                            );


                        if (erroUpload) {
                            throw erroUpload;
                        }


                        // ==================================
                        // URL PÚBLICO
                        // ==================================

                        const {
                            data: publicData
                        } = supabase.storage

                            .from(
                                'player-photos'
                            )

                            .getPublicUrl(
                                caminho
                            );


                        const novaUrl =
                            publicData.publicUrl;


                        // ==================================
                        // ATUALIZAR PLAYER
                        // ==================================

                        const {
                            error: erroUpdate
                        } = await supabase

                            .from('players')

                            .update({
                                photo_url:
                                    novaUrl
                            })

                            .eq(
                                'id',
                                jogador.id
                            );


                        if (erroUpdate) {
                            throw erroUpdate;
                        }


                        resultados.push(
                            `🟢 #${jogador.number} ${jogador.name} — MIGRADA`
                        );

                    }

                    catch (error) {

                        console.error(
                            `❌ Migração ${jogador.name}:`,
                            error
                        );


                        resultados.push(
                            `🔴 #${jogador.number} ${jogador.name} — ERRO`
                        );

                    }

                }


                // ==========================================
                // RESULTADO
                // ==========================================

                const migradas =
                    resultados.filter(
                        linha =>
                            linha.includes(
                                'MIGRADA'
                            )
                    ).length;


                console.log('');
                console.log(
                    '===== MIGRAÇÃO FOTOS ====='
                );

                console.log(
                    resultados.join('\n')
                );

                console.log(
                    '=========================='
                );


                await interaction.editReply({

                    content:
                        `📸 **MIGRAÇÃO DAS FOTOS**\n\n` +
                        `✅ Migradas: **${migradas}/${jogadores.length}**\n\n` +
                        resultados.join('\n')

                });

            }

            catch (error) {

                console.error(
                    '❌ Erro na migração das fotos:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ A migração das fotografias falhou. Vê o CMD.'
                });

            }


            return;

        }

        // ==================================================
        // /ea procurarfotos
        // ==================================================

        if (
            subcommand ===
            'procurarfotos'
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                const CANAL_FOTOS_ID =
                    '1550266416924721255';


                const canal =
                    await client.channels.fetch(
                        CANAL_FOTOS_ID
                    );


                if (
                    !canal ||
                    !canal.isTextBased()
                ) {

                    throw new Error(
                        'Canal das fotografias não encontrado.'
                    );

                }


                let before = undefined;

                let totalMensagens = 0;
                let embedsPlantel = 0;
                let fotosEncontradas = 0;
                let fotosAcessiveis = 0;

                const resultados = [];


                while (true) {

                    const mensagens =
                        await canal.messages.fetch({
                            limit: 100,
                            ...(before
                                ? { before }
                                : {})
                        });


                    if (
                        mensagens.size === 0
                    ) {
                        break;
                    }


                    totalMensagens +=
                        mensagens.size;


                    for (
                        const mensagem
                        of mensagens.values()
                    ) {

                        if (
                            mensagem.author.id !==
                            client.user.id
                        ) {
                            continue;
                        }


                        for (
                            const embed
                            of mensagem.embeds
                        ) {

                            const autor =
                                embed.author?.name ||
                                '';


                            if (
                                !autor.includes(
                                    'SUAVE FC · PLANTEL'
                                )
                            ) {
                                continue;
                            }


                            embedsPlantel++;


                            const titulo =
                                embed.title ||
                                'Jogador desconhecido';


                            const imageUrl =
                                embed.image?.url;


                            if (!imageUrl) {

                                resultados.push(
                                    `⚪ ${titulo} — sem imagem`
                                );

                                continue;

                            }


                            fotosEncontradas++;


                            try {

                                const resposta =
                                    await fetch(
                                        imageUrl
                                    );


                                if (resposta.ok) {

                                    fotosAcessiveis++;

                                    resultados.push(
                                        `🟢 ${titulo} — RECUPERÁVEL`
                                    );

                                }

                                else {

                                    resultados.push(
                                        `🔴 ${titulo} — expirou (${resposta.status})`
                                    );

                                }

                            }

                            catch {

                                resultados.push(
                                    `🔴 ${titulo} — erro ao testar`
                                );

                            }

                        }

                    }


                    before =
                        mensagens.last()?.id;


                    if (
                        mensagens.size < 100
                    ) {
                        break;
                    }

                }


                console.log('');
                console.log(
                    '===== DIAGNÓSTICO FOTOS ====='
                );

                console.log(
                    resultados.join('\n')
                );

                console.log(
                    '============================='
                );


                const lista =
                    resultados.length > 0
                        ? resultados
                            .slice(0, 30)
                            .join('\n')
                        : 'Nenhuma fotografia encontrada.';


                await interaction.editReply({

                    content:
                        `📸 **DIAGNÓSTICO DAS FOTOS**\n\n` +
                        `Mensagens analisadas: **${totalMensagens}**\n` +
                        `Cartões de plantel: **${embedsPlantel}**\n` +
                        `Fotos encontradas: **${fotosEncontradas}**\n` +
                        `Fotos recuperáveis: **${fotosAcessiveis}**\n\n` +
                        `${lista}\n\n` +
                        `⚠️ Nenhuma fotografia foi alterada.`

                });

            }

            catch (error) {

                console.error(
                    '❌ Erro ao procurar fotos:',
                    error
                );


                await interaction.editReply({
                    content:
                        '❌ Falhou o diagnóstico das fotografias. Vê o CMD.'
                });

            }


            return;

        }

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
