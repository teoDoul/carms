import kaplay from "kaplay";
import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();

k.loadMusic("bgm", "sounds/lofi.wav")

let musicStarted = false
function startMusic() {
    if (musicStarted) return
    musicStarted = true
    audioCtx.resume().then(() => {
        play("bgm", { loop: true, volume: 0.5 })
    })
}


k.loadSprite("cake", "sprites/cake.png")
k.loadSound("hb", "sounds/hb.mp3")

const TILE = 16
const SCALE = 4
const tileSize = TILE * SCALE

const cols = Math.ceil(width() / tileSize)
const rows = Math.ceil(height() / tileSize)

const WORLD_COLS = 40  // however big you want the world
const WORLD_ROWS = 20

const worldWidth = WORLD_COLS * tileSize
const worldHeight = WORLD_ROWS * tileSize

const CAM_SCALE = 1.5
const HOLD_TIME = 0.6 // seconds to hold before a cat is collected

k.loadRoot("./"); // A good idea for Itch.io publishing later
k.loadAseprite("01","sprites/01/01.png","sprites/01/01.json")
k.loadAseprite("02","sprites/02/02.png","sprites/02/02.json")
k.loadAseprite("03","sprites/03/03.png","sprites/03/03.json")
k.loadAseprite("04","sprites/04/04.png","sprites/04/04.json")
k.loadAseprite("05","sprites/05/05.png","sprites/05/05.json")
k.loadAseprite("06","sprites/06/06.png","sprites/06/06.json")
k.loadAseprite("07","sprites/07/07.png","sprites/07/07.json")
k.loadAseprite("08","sprites/08/08.png","sprites/08/08.json")
k.loadAseprite("09","sprites/09/09.png","sprites/09/09.json")
k.loadAseprite("10","sprites/10/10.png","sprites/10/10.json")
k.loadAseprite("11","sprites/11/11.png","sprites/11/11.json")
k.loadAseprite("12","sprites/12/12.png","sprites/12/12.json")
k.loadAseprite("13","sprites/13/13.png","sprites/13/13.json")
k.loadAseprite("14","sprites/14/14.png","sprites/14/14.json")
k.loadAseprite("15","sprites/15/15.png","sprites/15/15.json")
k.loadAseprite("16","sprites/16/16.png","sprites/16/16.json")
k.loadAseprite("17","sprites/17/17.png","sprites/17/17.json")
k.loadAseprite("18","sprites/18/18.png","sprites/18/18.json")
k.loadAseprite("19","sprites/19/19.png","sprites/19/19.json")
k.loadAseprite("20","sprites/20/20.png","sprites/20/20.json")
k.loadAseprite("21","sprites/21/21.png","sprites/21/21.json")
k.loadAseprite("22","sprites/22/22.png","sprites/22/22.json")
k.loadAseprite("23","sprites/23/23.png","sprites/23/23.json")

k.loadSound("plop", "sounds/plop.wav")

k.loadSprite("nat", "sprites/tiles.png",{
    sliceX: 24,
    sliceY: 1,
})

k.loadFont("edu", "fonts/edu.ttf")

k.loadSprite("rock", "sprites/rock.png")
k.loadSprite("tree", "sprites/tree.png")
k.loadSprite("bush", "sprites/bush.png")
k.loadSprite("flowers", "sprites/flowers.png")

function buildWorldMap(cols, rows) {
    const grid = []
    for (let y = 0; y < rows; y++) {
        grid.push(new Array(cols).fill("."))
    }

    let pathRow = Math.floor(rows / 2)
    for (let x = 0; x < cols; x++) {
        pathRow += randi(-1, 2)
        pathRow = clamp(pathRow, 3, rows - 4)
        grid[pathRow - 2][x] = "t"  // top edge
        grid[pathRow - 1][x] = "~"
        grid[pathRow][x] = "~"
        grid[pathRow + 1][x] = "~"
        grid[pathRow + 2][x] = "b"  // bottom edge
    }

    return grid.map(row => row.join(""))
}

const GRASS_FRAMES = [1, 2, 3]
const PATH_FRAMES = [10, 21, 22]
const BOUNDARY_FRAMES = [6, 7]

const worldMap = [
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "..........t.t..........................t",
    ".........t~t~tt.....................ttt~",
    "........t~~~~~~t...................t~~~~",
    ".......t~~~~~~~~t..t.....tt.....ttt~~~~~",
    ".....tt~~~b~b~~~~tt~t..tt~~ttttt~~~~~~~b",
    "tt.tt~~~~b.b.bb~~~~~~tt~~~~~~~~~~~~~bbb.",
    "~~t~~~~~b......b~~~~~~~~~~~~~~~~~~~b....",
    "~~~~~~~b........b~~b~~~~~bb~~~~~bbb.....",
    "~~~~~bb..........bb.b~~bb..bbbbb........",
    "bb~bb................bb.................",
    "..b.....................................",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
]

const decorations = [
    { type: "tree", x: 9, y: 18 },
    { type: "tree", x: 38, y: 1 },
    { type: "tree", x: 5, y: 1 },
    { type: "tree", x: 1, y: 4 },
    { type: "tree", x: 19, y: 0 },
    { type: "tree", x: 20, y: 15 },
    { type: "tree", x: 26, y: 4 },
    { type: "rock", x: 32, y: 4 },
    { type: "rock", x: 25, y: 14 },
    { type: "rock", x: 36, y: 19 },
    { type: "rock", x: 6, y: 7 },
    { type: "rock", x: 22, y: 19 },
    { type: "rock", x: 33, y: 15 },
    { type: "rock", x: 38, y: 11 },
    { type: "bush", x: 29, y: 17 },
    { type: "bush", x: 20, y: 6 },
    { type: "bush", x: 30, y: 5 },
    { type: "bush", x: 14, y: 11 },
    { type: "bush", x: 26, y: 19 },
    { type: "bush", x: 12, y: 0 },
    { type: "bush", x: 12, y: 10 },
    { type: "flowers", x: 26, y: 16 },
    { type: "flowers", x: 12, y: 15 },
    { type: "flowers", x: 28, y: 14 },
    { type: "flowers", x: 23, y: 7 },
    { type: "flowers", x: 32, y: 17 },
    { type: "flowers", x: 15, y: 14 },
    { type: "flowers", x: 18, y: 16 },
    { type: "flowers", x: 9, y: 10 },
]

const cats = [
    { num: "01", anim: "sleep", x: 4,  y: 3  },
    { num: "02", anim: "anim",  x: 16, y: 10 },
    { num: "03", anim: "anim",  x: 24, y: 10 },
    { num: "04", anim: "idle",  x: 16, y: 15 },
    { num: "05", anim: "idle",  x: 28, y: 13 },
    { num: "06", anim: "idle",  x: 28, y: 4  },
    { num: "07", anim: "idle",  x: 18, y: 18 },
    { num: "08", anim: "idle",  x: 23, y: 17 },
    { num: "09", anim: "idle",  x: 38, y: 5  },
    { num: "10", anim: "idle",  x: 34, y: 10 },
    { num: "11", anim: "idle",  x: 36, y: 7  },
    { num: "12", anim: "idle",  x: 7,  y: 15 },
    { num: "13", anim: "idle",  x: 1,  y: 7  },
    { num: "14", anim: "idle",  x: 10, y: 11 },
    { num: "15", anim: "idle",  x: 35, y: 1  },
    { num: "16", anim: "idle",  x: 30, y: 15 },
    { num: "17", anim: "idle",  x: 6,  y: 9  },
    { num: "18", anim: "idle",  x: 12, y: 7  },
    { num: "19", anim: "idle",  x: 31, y: 18 },
    { num: "20", anim: "idle",  x: 3,  y: 14 },
    { num: "21", anim: "idle",  x: 36, y: 14 },
    { num: "22", anim: "idle",  x: 31, y: 4  },
    { num: "23", anim: "idle",  x: 15, y: 10 },
]
scene("menu", () => {
    add([rect(width(), height()), fixed(), color(40, 80, 40)])

    add([
        text("mao!", { font: "edu", size: 64 }),
        anchor("center"),
        pos(width() / 2, height() / 2 - 100),
        fixed(),
        color(255, 255, 255),
    ])

    const playBtn = add([
        rect(200, 60, { radius: 10 }),
        anchor("center"),
        pos(width() / 2, height() / 2 + 20),
        fixed(),
        color(120, 200, 120),
        outline(4, rgb(255, 255, 255)),
        area(),
    ])

    playBtn.add([
        text("Play", { font: "edu", size: 28 }),
        anchor("center"),
        color(0, 0, 0),
    ])

    add([
        text("Tip: press and hold", { font: "edu", size: 18 }),
        anchor("center"),
        pos(width() / 2, height() / 2 + 90),
        fixed(),
        color(230, 230, 230),
    ])

    playBtn.onClick(() => {
        startMusic()
        go("game")
    })
    playBtn.onHover(() => playBtn.color = rgb(140, 220, 140))
    playBtn.onHoverEnd(() => playBtn.color = rgb(120, 200, 120))
})


scene("game", () => {
    setCamScale(CAM_SCALE)

    addLevel(worldMap, {
        tileWidth: tileSize,
        tileHeight: tileSize,
        pos: vec2(0, 0),
        tiles: {
            ".": () => [sprite("nat", { frame: choose(GRASS_FRAMES), flipX: chance(0.5), flipY: chance(0.5) }), scale(SCALE), "ground"],
            "~": () => [sprite("nat", { frame: choose(PATH_FRAMES) }), scale(SCALE), "ground", "path"],
            "t": () => [sprite("nat", { frame: choose(BOUNDARY_FRAMES) }), scale(SCALE), "ground", "path-edge"],
            "b": () => [sprite("nat", { frame: choose(BOUNDARY_FRAMES), flipY: true }), scale(SCALE), "ground", "path-edge"],
        },
    })

    onMouseMove(() => {
        if (isMouseDown()) {
            const viewW = width() / CAM_SCALE
            const viewH = height() / CAM_SCALE
            const delta = mouseDeltaPos()
            const newPos = getCamPos().sub(vec2(delta.x / CAM_SCALE, delta.y / CAM_SCALE))
            setCamPos(vec2(
                clamp(newPos.x, viewW / 2, worldWidth - viewW / 2),
                clamp(newPos.y, viewH / 2, worldHeight - viewH / 2),
            ))
        }
    })

    for (const d of decorations) {
        k.add([
            sprite(d.type),
            anchor("bot"),
            pos(d.x * tileSize + tileSize / 2, (d.y + 1) * tileSize),
            scale(SCALE),
        ])
    }

    let counter = 0
    let cat23Ref = null
    let cat23Unlocked = false
    const director = k.add([timer()])
    const catObjs = []

    function collectCat(cat) {
        if (cat.collected) return
        cat.collected = true
        cat.holdCheck.cancel()
        cat.progressBg.hidden = true
        cat.progressFill.hidden = true

        counter++
        counterText.text = "Counter: " + counter
        play("plop")

        cat.tween(cat.scale.x, cat.scale.x * 1.4, 0.1, (s) => cat.scale = vec2(s), easings.easeOutQuad)
            .onEnd(() => {
                cat.tween(cat.scale.x, 0, 0.15, (s) => cat.scale = vec2(s), easings.easeInBack)
                    .onEnd(() => destroy(cat))
            })

        if (counter === 22 && !cat23Unlocked) {
            revealCat23()
        }

        if (cat === cat23Ref) {
            celebrateCake()
        }
    }

    for (const c of cats) {
        const catObj = k.add([
            sprite(c.num, { anim: c.anim, animSpeed: 0.2 }),
            anchor("bot"),
            pos(c.x * tileSize + tileSize / 2, (c.y + 1) * tileSize),
            scale(SCALE),
            area(),
            timer(),
            "cat",
            { holdTime: 0, collected: false },
        ])
        if (c.num === "23") {
            catObj.hidden = true
            cat23Ref = catObj
        }
        catObjs.push(catObj)

        const barWidth = 40
        const barHeight = 6
        const barOffset = vec2(-barWidth / 2, -40)

        catObj.progressBg = catObj.add([
            rect(barWidth, barHeight, { radius: 2 }),
            pos(barOffset),
            color(0, 0, 0),
            opacity(0.5),
        ])
        catObj.progressBg.hidden = true

        catObj.progressFill = catObj.add([
            rect(0, barHeight, { radius: 2 }),
            pos(barOffset),
            color(120, 220, 120),
        ])
        catObj.progressFill.hidden = true

        catObj.holdCheck = catObj.onUpdate(() => {
            if (catObj.collected) return
            if (c.num === "23" && !cat23Unlocked) return
            if (catObj.isHovering() && isMouseDown()) {
                catObj.holdTime += dt()
                catObj.progressBg.hidden = false
                catObj.progressFill.hidden = false
                catObj.progressFill.width = barWidth * Math.min(catObj.holdTime / HOLD_TIME, 1)
                if (catObj.holdTime >= HOLD_TIME) {
                    collectCat(catObj)
                }
            } else {
                catObj.holdTime = 0
                catObj.progressBg.hidden = true
                catObj.progressFill.hidden = true
            }
        })
    }

    // secret debug command: backtick auto-collects all 22 normal cats
    onKeyPress("`", () => {
        for (const catObj of catObjs) {
            if (catObj !== cat23Ref && !catObj.collected) {
                collectCat(catObj)
            }
        }
    })

    function revealCat23() {
        if (!cat23Ref) return

        const msgText = k.add([
            text("Hold up i think we are missing one", { font: "edu", size: 24 }),
            pos(width() / 2, 60),
            anchor("center"),
            fixed(),
            color(255, 255, 255),
            opacity(1),
            z(1),
            lifespan(3, { fade: 0.5 }),
        ])

        k.add([
            rect(msgText.width + 32, msgText.height + 20, { radius: 8 }),
            pos(width() / 2, 60),
            anchor("center"),
            fixed(),
            color(0, 0, 0),
            opacity(0.6),
            outline(3, rgb(255, 255, 255)),
            z(0),
            lifespan(3, { fade: 0.5 }),
        ])

        const viewW = width() / CAM_SCALE
        const viewH = height() / CAM_SCALE
        const camTarget = vec2(
            clamp(cat23Ref.pos.x, viewW / 2, worldWidth - viewW / 2),
            clamp(cat23Ref.pos.y, viewH / 2, worldHeight - viewH / 2),
        )

        director.tween(getCamPos(), camTarget, 1.2, (p) => setCamPos(p), easings.easeInOutQuad)
            .onEnd(() => {
                cat23Ref.hidden = false
                cat23Unlocked = true
            })
    }

    const hud = k.add([
        pos(10, 10),
        fixed(),
    ])

    hud.add([
        rect(200, 44, { radius: 8 }),
        color(0, 0, 0),
        opacity(0.55),
        outline(3, rgb(255, 255, 255)),
    ])

    const counterText = hud.add([
        text("Counter: 0", { font: "edu", size: 30 }),
        pos(16, 11),
        color(255, 255, 255),
    ])

    function celebrateCake() {
        play("hb")
        const cake = k.add([
            sprite("cake"),
            anchor("center"),
            pos(width() / 2, height() / 2),
            fixed(),
            scale(1),
            rotate(0),
        ])
        cake.onUpdate(() => {
            cake.angle = Math.sin(time() * 6) * 8
        })

        const cakeBottom = cake.pos.y + (cake.height * cake.scale.y) / 2
        hud.pos = vec2(width() / 2 - 100, cakeBottom + 16)
    }
})

go("menu")