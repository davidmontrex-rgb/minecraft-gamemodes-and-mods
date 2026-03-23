// --- Models | Templates ---

let mapTemplates: { [key: string]: Position[] } = {
    "default": [world(-14, 0, 90), world(20, 13, 124)],
}

let spawnTemplates: { [key: string]: Position[] } = {
    "glass": [world(-14, 1, 140), world(-10, 4, 144)],
}

let kitTemplates: { [key: string]: Position[] } = {
    "netherite": [world(-14, 1, 157)],
}

// --- Locations ---

let mapSpawn = world(-16, 2, 2)
let lobbySpawnpoint = world(23, 16, 19)

let spawnpoints = [
    world(-13, 17, 33),
    world(1, 17, 33),
    world(15, 17, 33),
    world(15, 17, 18),
    world(15, 17, 5),
    world(1, 17, 5),
    world(-13, 17, 5),
    world(-13, 17, 18)
]
let spawnpointArea = [
    world(19, 16, 37),
    world(-17, 24, 1)
]

let mapArea = [
    world(-17, 0, 37),
    world(19, 15, 1)
]

let deathArea = [
    world(-17, -4, 37),
    world(19, -1, 1)
]

// --- Functions ---

function fillArea(spot1: Position, spot2: Position, block: Block) {
    blocks.fill(
        block,
        spot1,
        spot2,
        FillOperation.Replace
    )
}

// --- core functions ---

//creating
function createSpawns () {
    for (let i = 0; i < spawnpoints.length; i++) {
        let spawnPos = positions.add(spawnpoints[i], world(-2,-1,-2))
        let template1 = spawnTemplates.glass[0]
        let template2 = spawnTemplates.glass[1]
        player.execute(`clone ${template1} ${template2} ${spawnPos} replace normal`)
    }
}

function giveLoot (kit: string, pos6: Position) {
    let kitTemplate = kitTemplates[kit]
    blocks.clone(
        kitTemplate[0],
        kitTemplate[0],
        pos6,
        CloneMask.Replace,
        CloneMode.Normal
    )
    blocks.place(
        AIR,
        pos6
    )
}

function createMap () {
    player.execute(`clone ${mapTemplates[mapChosen][0]} ${mapTemplates[mapChosen][1]} ${mapSpawn} replace normal`)
}

function createDeathArea() {
    fillArea(deathArea[0], deathArea[1], LAVA)
}

//destroying
function destroySpawns () {
    fillArea(spawnpointArea[0], spawnpointArea[1], AIR)
}

function destroyMap () {
    fillArea(mapArea[0], mapArea[1], AIR)
}

function destroyDeathArea () {
    fillArea(deathArea[0], deathArea[1], AIR)
}

// others

function setupPlayers() {
    let players = getPlayerList()
    for (let i = 0; i < players.length; i++) {
        let spawnpoint = spawnpoints[i]
        player.execute(`gamemode adventure ${players[i]}`)
        player.execute(`clear ${players[i]}`)
        player.execute(`tp ${players[i]} ${spawnpoint}`)
        giveLoot(kitChosen, spawnpoint)
        loops.pause(100)
    }
}

function resetPlayers () {
    let players = getPlayerList()
    for (let i = 0; i < players.length; i++) {
        let spawnpoint = spawnpoints[i]
        player.execute(`clear ${players[i]}`)
        player.execute(`tp ${players[i]} ${lobbySpawnpoint}`)
        player.execute(`gamemode adventure ${players[i]}`)
    }
}

function timer(time : number, message : string) {
    for (let i = time; i > 0; i--) {
        if (message) {
            player.say("§1" + message + "§3 §l" + i)
        }
        loops.pause(100)
    }
}

// --- events ---

function setup () {
    player.execute("effect @a regeneration infinite 10 false")
    createSpawns()
    createDeathArea()
    createMap()
    setupPlayers()
    player.execute("effect @a saturation infinite 10 false")
}

function startMatch () {
    player.execute("effect @a clear")
    destroySpawns()
    player.execute("gamemode survival @a")
}

function endMatch () {
    destroyMap()
    destroyDeathArea()
    resetPlayers()
}

// --- architech ---

// settings

let mapChosen = "default"
let kitChosen = "netherite"
let spawnChosen = "glass"

// players

let playerList: string[] = []

function addPlayer(name: string): void {
    if (playerList.indexOf(name) < 0) {
        playerList.push(name)
    }
}

function getPlayerList(): string[] {
    return playerList
}

function removePlayer(name: string): void {
    let index = playerList.indexOf(name)
    if (index >= 0) {
        playerList.splice(index, 1)
    }
}

// --- event listeners ---

player.onChat("join", function () {
    addPlayer(player.name())
    player.say("✅ " + player.name() + " joined! (" + playerList.length + " players)")
})

// Check the list
player.onChat("list", function () {
    player.say("✅ Players: " + getPlayerList().join(", "))
})

// --- game loop ---

let pausevar = false
let deadplayers = 0

function game() {
    timer(5, "Starting in: ")
    destroyMap()
    destroyDeathArea()
    setup()
    timer(15, "Releasing in: ")
    player.say("§6 §l Game Started!")
    startMatch()
    while (pausevar == false /*&& (getPlayerList().length - deadplayers) > 1*/ ) {
        loops.pause(100)
        //player.say(getPlayerList().length - deadplayers)
    }
    player.say("§6 §l Game Ended!")
    loops.pause(5000)
    endMatch()
}

player.onChat("start", function () {
    deadplayers = 0
    pausevar = false
    game()
})

player.onChat("end", function () {
    pausevar = true
})

events.onPlayerDied(function (cause: string, mob: number) {
    let name = player.name()
    player.say("§c" + name + " died! Cause: " + cause)
    deadplayers += 1
})
