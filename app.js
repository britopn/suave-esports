/* =========================================================
   SUAVE ESPORTS
   DADOS + RENDERIZAÇÃO DO SITE
========================================================= */


/* =========================================================
   1. SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://aqsqbhlryozvcmqufsdq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_rj7_Hlevuj1uxZUlvTaFNg_fmKwdnt0";


const suaveSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   2. DADOS
========================================================= */

const suaveData = {

    team: {
        name: "SUAVE FC",
        logo: "logo-suave.png"
    },


    /* -----------------------------------------------------
       PRÓXIMOS JOGOS
    ----------------------------------------------------- */

    upcomingGames: [

        {
            date: "20 SET",
            time: "21:00",
            opponent: "EQUIPA A",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        },

        {
            date: "20 SET",
            time: "21:30",
            opponent: "EQUIPA B",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        },

        {
            date: "20 SET",
            time: "22:00",
            opponent: "EQUIPA C",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        },

        {
            date: "20 SET",
            time: "22:30",
            opponent: "EQUIPA D",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        }

    ],


    /* -----------------------------------------------------
       RESULTADOS
    ----------------------------------------------------- */

    results: [

        {
            date: "18 SET",
            opponent: "EQUIPA X",
            competition: "TORNEIO PRO CLUBS",
            suaveScore: 4,
            opponentScore: 2,
            opponentLogo: null
        },

        {
            date: "18 SET",
            opponent: "EQUIPA Y",
            competition: "TORNEIO PRO CLUBS",
            suaveScore: 2,
            opponentScore: 2,
            opponentLogo: null
        },

        {
            date: "17 SET",
            opponent: "EQUIPA Z",
            competition: "TORNEIO PRO CLUBS",
            suaveScore: 1,
            opponentScore: 3,
            opponentLogo: null
        }

    ],


    /* -----------------------------------------------------
       PLANTEL

       AGORA É CARREGADO DO SUPABASE.
    ----------------------------------------------------- */

    players: [],


    /* -----------------------------------------------------
       CLASSIFICAÇÃO

       Por agora continua manual.
    ----------------------------------------------------- */

    standings: [

        {
            team: "SUAVE FC",
            played: 5,
            wins: 3,
            draws: 1,
            losses: 1,
            points: 10,
            suave: true
        },

        {
            team: "EQUIPA A",
            played: 5,
            wins: 3,
            draws: 0,
            losses: 2,
            points: 9
        },

        {
            team: "EQUIPA B",
            played: 5,
            wins: 2,
            draws: 2,
            losses: 1,
            points: 8
        },

        {
            team: "EQUIPA C",
            played: 5,
            wins: 2,
            draws: 0,
            losses: 3,
            points: 6
        },

        {
            team: "EQUIPA D",
            played: 5,
            wins: 1,
            draws: 1,
            losses: 3,
            points: 4
        }

    ]

};


/* =========================================================
   3. CARREGAR PLANTEL DO SUPABASE
========================================================= */

async function loadPlayers() {

    const track =
        document.getElementById("players-track");


    if (track) {

        track.innerHTML = `
            <div class="player-card">
                <div class="player-info">
                    <strong>A CARREGAR...</strong>
                    <span>PLANTEL</span>
                </div>
            </div>
        `;

    }


    try {

        const {
            data,
            error
        } = await suaveSupabase
            .from("players")
            .select(
                "id, name, number, position, photo_url, created_at"
            )
            .order(
                "number",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        suaveData.players =
            (data || []).map(player => ({

                id:
                    player.id,

                name:
                    player.name,

                number:
                    player.number,

                position:
                    player.position,

                image:
                    player.photo_url || null,

                games: 0,
                goals: 0,
                assists: 0

            }));


        console.log(
            `✅ Plantel carregado: ${suaveData.players.length} jogador(es)`
        );


        renderPlayers();

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar plantel do Supabase:",
            error
        );


        if (track) {

            track.innerHTML = `
                <div class="player-card">
                    <div class="player-info">
                        <strong>ERRO</strong>
                        <span>PLANTEL INDISPONÍVEL</span>
                    </div>
                </div>
            `;

        }

    }

}


/* =========================================================
   4. HELPERS
========================================================= */

function opponentLogoHTML(game, className = "") {

    if (game.opponentLogo) {

        return `
            <img
                src="${game.opponentLogo}"
                alt="${game.opponent}"
                class="${className}"
            >
        `;

    }


    const initial =
        game.opponent && game.opponent !== "TBA"
            ? game.opponent.charAt(0)
            : "?";


    return `
        <div class="placeholder-logo ${className}">
            ${initial}
        </div>
    `;

}


function getResultStatus(game) {

    if (game.suaveScore > game.opponentScore) {

        return {
            text: "VITÓRIA",
            className: "win"
        };

    }


    if (game.suaveScore < game.opponentScore) {

        return {
            text: "DERROTA",
            className: "loss"
        };

    }


    return {
        text: "EMPATE",
        className: "draw"
    };

}


/* =========================================================
   5. PRÓXIMO JOGO — BARRA DO HERO
========================================================= */

function renderNextGameStrip() {

    const game =
        suaveData.upcomingGames[0];


    if (!game) {

        document
            .getElementById("next-game-date")
            .textContent =
            "SEM JOGOS AGENDADOS";


        document
            .getElementById("next-game-opponent")
            .textContent =
            "TBA";


        return;

    }


    document
        .getElementById("next-game-date")
        .innerHTML =
        `${game.date} · ${game.time}`;


    document
        .getElementById("next-game-opponent")
        .textContent =
        game.opponent;


    document
        .getElementById("next-game-competition")
        .textContent =
        game.competition;


    const logoContainer =
        document.getElementById(
            "next-game-opponent-logo"
        );


    if (game.opponentLogo) {

        logoContainer.outerHTML = `
            <img
                id="next-game-opponent-logo"
                class="featured-opponent-logo"
                src="${game.opponentLogo}"
                alt="${game.opponent}"
            >
        `;

    }

    else {

        logoContainer.textContent =
            game.opponent.charAt(0);

    }

}


/* =========================================================
   6. PRÓXIMOS JOGOS
========================================================= */

function renderUpcomingGames() {

    const container =
        document.getElementById(
            "upcoming-games"
        );


    container.innerHTML = "";


    suaveData.upcomingGames
        .slice(1)
        .forEach(game => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "game-card";


            card.innerHTML = `

                <div class="game-date">
                    ${game.date} · ${game.time}
                </div>


                <div class="game-teams">

                    <div class="game-team">

                        <img
                            src="${suaveData.team.logo}"
                            alt="${suaveData.team.name}"
                        >

                        <strong>
                            ${suaveData.team.name}
                        </strong>

                    </div>


                    <span class="game-vs">
                        VS
                    </span>


                    <div class="game-team">

                        ${opponentLogoHTML(game)}

                        <strong>
                            ${game.opponent}
                        </strong>

                    </div>

                </div>


                <div class="game-competition">
                    ${game.competition}
                </div>

            `;


            container.appendChild(
                card
            );

        });

}


/* =========================================================
   7. RESULTADOS
========================================================= */

function renderResults() {

    const container =
        document.getElementById(
            "recent-results"
        );


    container.innerHTML = "";


    suaveData.results
        .slice(0, 3)
        .forEach(game => {

            const status =
                getResultStatus(game);


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "match-card";


            card.innerHTML = `

                <div class="match-meta">

                    ENCERRADO ·
                    ${game.date} ·
                    ${game.competition}

                </div>


                <div class="match">

                    <div class="club">

                        <img
                            src="${suaveData.team.logo}"
                            alt="${suaveData.team.name}"
                        >

                        <span>
                            ${suaveData.team.name}
                        </span>

                    </div>


                    <div class="score">

                        <strong>
                            ${game.suaveScore}
                        </strong>

                        <span>
                            ×
                        </span>

                        <strong>
                            ${game.opponentScore}
                        </strong>

                    </div>


                    <div class="club opponent">

                        ${opponentLogoHTML(game)}

                        <span>
                            ${game.opponent}
                        </span>

                    </div>

                </div>


                <div
                    class="
                        match-status
                        ${status.className}
                    "
                >
                    ${status.text}
                </div>

            `;


            container.appendChild(
                card
            );

        });

}


/* =========================================================
   8. PLANTEL
========================================================= */

function renderPlayers() {

    const track =
        document.getElementById(
            "players-track"
        );


    track.innerHTML = "";


    if (
        !suaveData.players ||
        suaveData.players.length === 0
    ) {

        track.innerHTML = `
            <div class="player-card">

                <div class="player-placeholder">
                    ?
                </div>

                <div class="player-info">

                    <strong>
                        SEM JOGADORES
                    </strong>

                    <span>
                        PLANTEL
                    </span>

                </div>

            </div>
        `;


        return;

    }


    suaveData.players.forEach(
        player => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "player-card";


            let playerVisual;


            if (player.image) {

                playerVisual = `

                    <img
                        class="player-image"
                        src="${player.image}"
                        alt="${player.name}"
                        loading="lazy"
                        onerror="
                            this.style.display='none';
                            this.nextElementSibling.style.display='flex';
                        "
                    >

                    <div
                        class="player-placeholder"
                        style="display:none;"
                    >
                        ${player.name.charAt(0)}
                    </div>

                `;

            }

            else {

                playerVisual = `

                    <div class="player-placeholder">
                        ${player.name.charAt(0)}
                    </div>

                `;

            }


            card.innerHTML = `

                <div class="player-number">

                    ${String(
                        player.number
                    ).padStart(
                        2,
                        "0"
                    )}

                </div>


                ${playerVisual}


                <div class="player-info">

                    <strong>
                        ${player.name}
                    </strong>

                    <span>
                        ${player.position}
                    </span>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    console.log(
                        `${player.name}
Jogos: ${player.games}
Golos: ${player.goals}
Assistências: ${player.assists}`
                    );

                }
            );


            track.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   9. CLASSIFICAÇÃO
========================================================= */

function renderStandings() {

    const container =
        document.getElementById(
            "standings-body"
        );


    container.innerHTML = "";


    const sorted =
        [...suaveData.standings]
            .sort(
                (a, b) =>
                    b.points -
                    a.points
            );


    sorted.forEach(
        (team, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                `standings-row ${
                    team.suave
                        ? "suave"
                        : ""
                }`;


            row.innerHTML = `

                <span>
                    ${index + 1}
                </span>

                <span>
                    ${team.team}
                </span>

                <span>
                    ${team.played}
                </span>

                <span>
                    ${team.wins}
                </span>

                <span>
                    ${team.draws}
                </span>

                <span>
                    ${team.losses}
                </span>

                <span>
                    ${team.points}
                </span>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   10. ESTATÍSTICAS AUTOMÁTICAS
========================================================= */

function calculateStats() {

    const results =
        suaveData.results;


    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsFor = 0;
    let goalsAgainst = 0;


    results.forEach(
        game => {

            goalsFor +=
                game.suaveScore;


            goalsAgainst +=
                game.opponentScore;


            if (
                game.suaveScore >
                game.opponentScore
            ) {

                wins++;

            }

            else if (
                game.suaveScore <
                game.opponentScore
            ) {

                losses++;

            }

            else {

                draws++;

            }

        }
    );


    const played =
        results.length;


    const points =
        (wins * 3) +
        draws;


    const possiblePoints =
        played * 3;


    const performance =
        possiblePoints > 0

            ? Math.round(
                (
                    points /
                    possiblePoints
                ) * 100
            )

            : 0;


    return {

        played,
        wins,
        draws,
        losses,

        goalsFor,
        goalsAgainst,

        goalDifference:
            goalsFor -
            goalsAgainst,

        performance

    };

}


/* =========================================================
   11. MOSTRAR ESTATÍSTICAS
========================================================= */

function renderStats() {

    const stats =
        calculateStats();


    const container =
        document.getElementById(
            "stats-grid"
        );


    const items = [

        {
            value:
                stats.played,

            label:
                "JOGOS"
        },

        {
            value:
                stats.wins,

            label:
                "VITÓRIAS",

            accent:
                true
        },

        {
            value:
                stats.draws,

            label:
                "EMPATES"
        },

        {
            value:
                stats.losses,

            label:
                "DERROTAS"
        },

        {
            value:
                stats.goalsFor,

            label:
                "GOLOS MARCADOS"
        },

        {
            value:
                stats.goalsAgainst,

            label:
                "GOLOS SOFRIDOS"
        },

        {
            value:
                stats.goalDifference > 0

                    ? `+${stats.goalDifference}`

                    : stats.goalDifference,

            label:
                "DIFERENÇA"
        },

        {
            value:
                `${stats.performance}%`,

            label:
                "APROVEITAMENTO",

            accent:
                true
        }

    ];


    container.innerHTML = "";


    items.forEach(
        item => {

            const stat =
                document.createElement(
                    "article"
                );


            stat.className =
                `stat ${
                    item.accent
                        ? "accent"
                        : ""
                }`;


            stat.innerHTML = `

                <strong>
                    ${item.value}
                </strong>

                <span>
                    ${item.label}
                </span>

            `;


            container.appendChild(
                stat
            );

        }
    );

}


/* =========================================================
   12. CARROSSÉIS
========================================================= */

function setupCarousels() {

    const games =
        document.getElementById(
            "upcoming-games"
        );


    const players =
        document.getElementById(
            "players-track"
        );


    document
        .getElementById(
            "games-next"
        )
        .addEventListener(
            "click",
            () => {

                games.scrollBy({

                    left: 450,

                    behavior:
                        "smooth"

                });

            }
        );


    document
        .getElementById(
            "games-prev"
        )
        .addEventListener(
            "click",
            () => {

                games.scrollBy({

                    left: -450,

                    behavior:
                        "smooth"

                });

            }
        );


    document
        .getElementById(
            "players-next"
        )
        .addEventListener(
            "click",
            () => {

                players.scrollBy({

                    left: 350,

                    behavior:
                        "smooth"

                });

            }
        );


    document
        .getElementById(
            "players-prev"
        )
        .addEventListener(
            "click",
            () => {

                players.scrollBy({

                    left: -350,

                    behavior:
                        "smooth"

                });

            }
        );

}


/* =========================================================
   13. ARRASTAR PLANTEL COM O RATO
========================================================= */

function setupPlayerDrag() {

    const slider =
        document.getElementById(
            "players-track"
        );


    let mouseDown =
        false;

    let startX;

    let scrollLeft;


    slider.addEventListener(
        "mousedown",
        event => {

            mouseDown =
                true;


            startX =
                event.pageX -
                slider.offsetLeft;


            scrollLeft =
                slider.scrollLeft;

        }
    );


    slider.addEventListener(
        "mouseleave",
        () => {

            mouseDown =
                false;

        }
    );


    slider.addEventListener(
        "mouseup",
        () => {

            mouseDown =
                false;

        }
    );


    slider.addEventListener(
        "mousemove",
        event => {

            if (!mouseDown) {
                return;
            }


            event.preventDefault();


            const x =
                event.pageX -
                slider.offsetLeft;


            const walk =
                (
                    x -
                    startX
                ) * 1.5;


            slider.scrollLeft =
                scrollLeft -
                walk;

        }
    );

}


/* =========================================================
   14. NAVEGAÇÃO
========================================================= */

function setupNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const links =
        document.querySelectorAll(
            ".main-nav a"
        );


    function updateNav() {

        let current =
            "inicio";


        sections.forEach(
            section => {

                if (
                    window.scrollY >=
                    section.offsetTop -
                    180
                ) {

                    current =
                        section.id;

                }

            }
        );


        links.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    `#${current}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateNav
    );


    updateNav();

}


/* =========================================================
   15. INICIAR SITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        renderNextGameStrip();

        renderUpcomingGames();

        renderResults();

        renderStandings();

        renderStats();

        setupCarousels();

        setupPlayerDrag();

        setupNavigation();


        /* -----------------------------------------------
           PLANTEL REAL

           É carregado por último porque vem da Internet.
        ------------------------------------------------ */

        await loadPlayers();

    }
);