//fill tool using axe (i tried my best)

let Fill = 0
let idk: Position = null
player.onItemInteracted(WOODEN_AXE, function () {
    let distance = 1
    let maxRange = 10
    let yOffset = 1

    while (distance <= maxRange) {
        if (!blocks.testForBlock(AIR, positions.add(posLocal(0, 0, distance), pos(0, 0, 0)))) {
            break
        }
        distance += 1
    }

    let targetPos = positions.add(posLocal(0, 0, distance), pos(0, 0, 0))

    if (Fill == 0) {
        blocks.place(BEDROCK, targetPos)
        builder.teleportTo(targetPos)
        builder.mark()
        Fill = 1
    } else {
        blocks.place(BEDROCK, targetPos)
        builder.teleportTo(targetPos)
        Fill = 0
    }
})
player.onItemInteracted(STONE_AXE, function () {
    builder.fill(GLOWSTONE)
})
player.onItemInteracted(BLAZE_ROD, function () {
    builder.fill(BEDROCK)
})
player.onItemInteracted(STICK, function () {
    builder.fill(COBBLESTONE)
})
player.onItemInteracted(DIAMOND, function () {
    builder.fill(TNT)
})
