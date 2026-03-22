// the link: https://makecode.com/_LeWXhCC1942A

// --- Functions ---
function createMap () {
    blocks.clone(
    mapPosition1,
    mapPosition2,
    mapSpawnPosition1,
    CloneMask.Replace,
    CloneMode.Normal
    )
}
function giveKit (position: Position) {
    // 1. Clone the chest from the kits array to the target position
    blocks.clone(
    kits[0],
    kits[0],
    position,
    CloneMask.Replace,
    CloneMode.Normal
    )
    // 2. Destroy the block at that position to drop the items
    // This replaces the chest with 'AIR' and triggers the 'Destroy' animation/drop
    blocks.place(AIR, position)
    player.execute(
    "setblock " + position + " air 0 destroy"
    )
}
player.onChat("End", function () {
    cleanUpMap()
})
function begin () {
    player.execute(
    "gamemode adventure @a"
    )
    createMap()
    teleportAll()
    gearUp()
    for (let k = 10; k > 0; k--) {
        player.execute(`/tellraw @a {"rawtext":[{"text":"§b Releasing players in: §9§l ${k}"}]}`)
        loops.pause(100)
    }
releasePlayers()
    player.execute(
    "gamemode survival @a"
    )
    player.execute(
    "/tellraw @a {\"rawtext\":[{\"text\":\"§b Game Started!\"}]}"
    )
    for (let k = gametime; k > 0; k--) {
        loops.pause(100)
        player.onChat("end", function () {
            k = 0;
        })
    }
    cleanUpMap()
}
function gearUp () {
    // Change i = 1 to i = 0 to include the first spawn position
    // Use spawnPositions.length so it automatically hits all 5 spots
    player.execute(
    "clear @a"
    )
    for (let j = 0; j <= spawnPositions.length - 1; j++) {
        giveKit(spawnPositions[j])
    }
}
// --- Chat Commands ---
player.onChat("Begin", function () {
    begin()
})
function cleanUpMap () {
    blocks.fill(
    AIR,
    mapStart,
    mapEnd,
    FillOperation.Replace
    )
    // Safety: Teleport players out before killing them so they don't respawn in the void
    player.execute(
    "clear @a"
    )
    setup()
    player.execute(
    "gamemode creative @a"
    )
    player.execute(
    "/tellraw @a {\"rawtext\":[{\"text\":\"§b Game Ended\"}]}"
    )
}
function setup () {
    player.execute(
    "gamemode adventure @a"
    )
    player.execute(
    "clear @a"
    )
    player.execute(
    "tp @a " + lobbyPos
    )
}
function teleportAll () {
    mobs.teleportToPosition(
    mobs.target(ALL_PLAYERS),
    spawnPositions[1]
    )
    for (let i = 2; i < spawnPositions.length; i++) {
        mobs.teleportToPosition(
            mobs.target(TargetSelectorKind.NearestPlayer),
            spawnPositions[i]
        )
    }
}
function releasePlayers () {
    blocks.fill(
    AIR,
    glassdomes1,
    glassdomes2,
    FillOperation.Replace
    )
    player.execute(
    "kill @e[type=!player]"
    )
}
let mapSpawnPosition1: Position = null
let mapPosition2: Position = null
let mapPosition1: Position = null
let mapEnd: Position = null
let mapStart: Position = null
let glassdomes2: Position = null
let glassdomes1: Position = null
let kits: Position[] = []
let spawnPositions: Position[] = []
let lobbyPos: Position = null
lobbyPos = world(-194, 25, 625)
spawnPositions = [
world(-207, 3, 635),
world(-195, 3, 623),
world(-185, 2, 634),
world(-186, 3, 614),
world(-205, 1, 614)
]
kits = [world(-197, 0, 583)]
glassdomes1 = world(-180, 0, 608)
glassdomes2 = world(-212, 8, 640)
mapStart = world(-214, 8, 642)
mapEnd = world(-178, -13, 606)
// --- Configuration ---
mapPosition1 = world(-203, -13, 1090)
mapPosition2 = world(-239, 8, 1126)
mapSpawnPosition1 = world(-214, -13, 606)
let playerSpawnPos = world(-195, 0, 623)
// Calculate dimensions
let width = Math.abs(-203 - -239)
let height = Math.abs(8 - -13)
let depth = Math.abs(1090 - 1126)
// CALCULATE THE END POINT: Start Point + Dimensions
let mapSpawnPosition2 = world(mapSpawnPosition1.getValue(Axis.X) - width, mapSpawnPosition1.getValue(Axis.Y) + height, mapSpawnPosition1.getValue(Axis.Z) + depth)
setup()

let gametime = 180;
let preparetime = 20

while (true) {
    for (let l = preparetime; l > 0; l--) {
        player.execute(`/tellraw @a {"rawtext":[{"text":"§b Game Starting in: §9§l ${l}"}]}`)
        loops.pause(100)
    }
begin()
}
