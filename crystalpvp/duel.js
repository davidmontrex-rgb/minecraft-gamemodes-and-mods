///////////////////////////////////////////////////
////////////////// VARIABLES  ////////////////////
/////////////////////////////////////////////////

let layers = [
    [-1,-1, GRASS],
    [-2, -5, DIRT],
    [-5, -63, STONE],
]

let surface = -1
let depth = 63
let wallHeight = 10

// max is 22
let rad = 20
let radMax = 21

let spawn = [
    world(38, -8, -37),
    world(40, -5, -35),
    world(-1,-1,-1), // offset
]

let kit = [
    world(50, -8, -37),
    world(50, -7, -37),
]

let spawnPoints = [
    world(15, 2, 15),
    world(-15, 2, 15),
    world(-15, 2, -15),
    world(15, 2, -15),
    world(15, 2, 0),
    world(-15, 2, 0), 
    world(0, 2, 15),
    world(0, 2, -15),
]

///////////////////////////////////////////////////
////////////// FILL FUNCTIONS ////////////////////
/////////////////////////////////////////////////

function fillChunk (pos1 : Position, pos2 : Position, block : Block) {

    blocks.fill(
        block,
        pos1,
        pos2,
        FillOperation.Replace
    )
}

function deleteChunks () {
    rad += 1
    let topRightChunk = world(rad, surface, rad)
    let topLeftChunk = world(-rad, surface, rad)
    let bottomRightChunk = world(rad, surface, -rad)
    let bottomleftChunk = world(-rad, surface, -rad)
    let centerChunk = world(0, -depth, 0)
    rad -= 1
    fillChunk(topRightChunk, centerChunk, AIR)
    fillChunk(topLeftChunk, centerChunk, AIR)
    fillChunk(bottomRightChunk, centerChunk, AIR)
    fillChunk(bottomleftChunk, centerChunk, AIR)
}

function createWalls (block: Block) {
    let height = -(wallHeight + depth)

    let rad1 = (rad + 1)
    let topRightChunk = world(rad1, wallHeight, rad1)
    let topLeftChunk = world(-rad1, wallHeight, rad1)
    let bottomRightChunk = world(rad1, wallHeight, -rad1)
    let bottomLeftChunk = world(-rad1, wallHeight, -rad1)

    // Top wall:    left  → right  (same +Z)
    fillChunk(topLeftChunk, positions.add(topRightChunk, world(0, height, 0)), block)
    // Bottom wall: left  → right  (same -Z)
    fillChunk(bottomLeftChunk, positions.add(bottomRightChunk, world(0, height, 0)), block)
    // Left wall:   bottom → top   (same -X)
    fillChunk(bottomLeftChunk, positions.add(topLeftChunk, world(0, height, 0)), block)
    // Right wall:  bottom → top   (same +X)
    fillChunk(bottomRightChunk, positions.add(topRightChunk, world(0, height, 0)), block)
}

function fillChunks () {
    for (let i = 0; i < layers.length; i++) {
        let layer = layers[i]
        let topRightChunk = world(rad, layer[0], rad)
        let topLeftChunk = world(-rad, layer[0], rad)
        let bottomRightChunk = world(rad, layer[0], -rad)
        let bottomleftChunk = world(-rad, layer[0], -rad)
        let centerChunk = world(0, layer[1], 0)
        fillChunk(topRightChunk, centerChunk, layer[2])
        fillChunk(topLeftChunk, centerChunk, layer[2])
        fillChunk(bottomRightChunk, centerChunk, layer[2])
        fillChunk(bottomleftChunk, centerChunk, layer[2])
    }
}

function giveKit (pos: Position) {
    blocks.clone(
        kit[0],
        kit[1],
        pos,
        CloneMask.Replace,
        CloneMode.Normal
    )
    blocks.fill(
        AIR,
        pos,
        positions.add(pos, world(0,1,0)),
        FillOperation.Replace
    )
}

function setupPlayers () {
    breakSpawns()
    for (let i = 0; i < playerList.length; i++) {
        let spawnpoint = spawnPoints[i]
        let finalPosSpawn = positions.add(spawnpoint, spawn[2])
        blocks.clone(
            spawn[0],
            spawn[1],
            finalPosSpawn,
            CloneMask.Replace,
            CloneMode.Normal
        )
        //player.execute(`gamemode adventure ${playerList[i]}`)
        player.execute(`clear ${playerList[i]}`)
        player.execute(`tp ${playerList[i]} ${spawnpoint}`)
        giveKit(spawnpoint)
    }
}

function breakSpawns() {
    let pos1 = world(rad, surface+1, rad)
    let pos2 = world(-rad, wallHeight, -rad)
    blocks.fill(
        AIR,
        pos1,
        pos2,
        FillOperation.Replace
    )
}

function print(message: string): void {
    player.execute('tellraw @a {"rawtext":[{"text":"' + message + '"}]}')
}

function timer(length : number) {
    for (let i = length; i > 0; i--) {
        print("§6 Releasing in: " + i)
        loops.pause(100)
    }
}

///////////////////////////////////////////////////
//////////// SIMPLIFIED FUNCTIONS ////////////////
/////////////////////////////////////////////////

function setupArena () {
    fillChunks()
    createWalls(OBSIDIAN)
}

function resetArena () {
    createWalls(AIR)
    let oldVal = rad
    rad = radMax
    fillChunks()
    rad = oldVal
}

function releasePlayers(){
    breakSpawns()
    //player.execute(`gamemode survival @a`)
}

///////////////////////////////////////////////////
///////////////// COMMANDS ///////////////////////
/////////////////////////////////////////////////

let playerList = [
    "DavidM",
    "Aaron",
  // add players here
]

player.onChat("rad", function(num1) {
    resetArena()
    if (num1 > radMax) {
        rad = radMax
    } else {
        rad = num1
    }
    player.say("changed radius to: §b" + rad)
})

player.onChat("start", function () {
    loops.pause(500)
    setupArena()
    setupPlayers()
    timer(25)
    player.execute("kill @e[type=!player]")
    releasePlayers()
})

player.onChat("reset", function () {
    resetArena()
})

player.onChat("remove", function () {
    createWalls(AIR)
    deleteChunks()
})

player.onChat("cmd", function (num1) {
    player.say("§6 §l >> Current Commands:")
    player.say("§6 - remove")
    player.say("§6 - setup")
    player.say("§6 - reset")
    player.say("§6 - rad [NUMBER 1-21]")
})
