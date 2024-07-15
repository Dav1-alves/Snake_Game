const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/* REMAP */
const scoreDisplay = document.querySelector('score span');
const coordX = document.querySelector('.x span');
const coordY = document.querySelector('.y span');
const remapLimitFood = document.querySelector('.foodLimit span');
const statusgameText = document.querySelector('.status-game span');
const timingText = document.querySelector('.timing span');
const qtdPointsFoodText = document.querySelector('.qtdPointsFood span');

var timing = 0;
var score = 0;
var velocity = 180;
var limitFood = 15;
var qtdPointsFood = 1;
var statusgame = "DISABLED SNAKE";

const size = 20;

document.addEventListener('mousedown', (event) => {
    if (event.button === 1) {
        return false;
    }
})

const snake = [
    [
        { x: 400, y: 200 },
        { x: 420, y: 200 },
        { x: 440, y: 200 },
        { x: 460, y: 200 },
        { x: 480, y: 200 },
    ]
];

const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = (event) => {
    let number;
    if (event == "X") { number = randomNumber(canvas.width - 20, 0) }
    if (event == "Y") { number = randomNumber(0, canvas.height - 20) }
    return Math.round(number / size) * 20
}

const colorRGB = () => {
    return Math.round(Math.random() * (255 - 0))

}

canvas.width = Math.round(window.innerWidth / size + 10) * 20;
canvas.height = Math.round(window.innerHeight / size + 10) * 20;
/* canvas.width = Math.round(6000 / size) * 20;
canvas.height = Math.round(3000 / size) * 20; */

const food = [
    {
        x: randomPosition("X"),
        y: randomPosition("Y"),
        color: `rgb(${colorRGB()}, ${colorRGB()}, ${colorRGB()})`
    }
]

let direction, loopId;


const drawFood = () => {

    for (let index = 0; index < food.length; index++) {
        const { x, y, color } = food[index];

        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
        ctx.fillStyle = food[index].color;
        ctx.fillRect(x, y, size, size);
        ctx.shadowBlur = 0;
    }
}

const genFood = () => {
    food.push({
        x: randomPosition("X"),
        y: randomPosition("Y"),
        color: `rgb(${colorRGB()}, ${colorRGB()}, ${colorRGB()})`
    })
}

setInterval(() => { if (direction) { if (food.length < limitFood) { return genFood() } } }, 7000)

const drawSnake = () => {
    ctx.fillStyle = "white";

    snake[0].forEach((position, index) => {

        if (index == snake[0].length - 1) {
            ctx.fillStyle = "#ED9121"
        }

        ctx.fillRect(position.x, position.y, size, size);
    })

};

const moveSnake = () => {
    const head = snake[0].at(-1)

    if (!direction) {
        return
    }

    if (direction == "Right") {
        snake[0].push({ x: head.x + size, y: head.y })
    }

    if (direction == "Left") {
        snake[0].push({ x: head.x - size, y: head.y })
    }

    if (direction == "Up") {
        snake[0].push({ x: head.x, y: head.y - size })
    }

    if (direction == "Down") {
        snake[0].push({ x: head.x, y: head.y + size })
    }

    snake[0].shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919"

    for (var i = size; i < canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.height)

        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.width, i)

        ctx.stroke()
    }

}

const checkEat = () => {
    const head = snake[0].at(-1);
    for (var i = 0; i < food.length; i++) {
        if (head.x == food[i].x && head.y == food[i].y) {
            snake[0].push(head)

            let x = randomPosition("X");
            let y = randomPosition("Y");
            let color = `rgb(${colorRGB()}, ${colorRGB()}, ${colorRGB()})`;

            while (snake[0].find((position) => position.x == x && position.y == y)) {
                x = randomPosition("X")
                y = randomPosition("Y")
                color = `rgb(${colorRGB()}, ${colorRGB()}, ${colorRGB()})`;
            }

            food[i].x = x
            food[i].y = y
            food[i].color = color


            if (velocity > 20) {
                velocity -= 5;
                console.log(velocity)
            }

            scoreDisplay.innerText = score += qtdPointsFood;

        }
    }
}

const gameOver = () => {
    direction = undefined

}

const checkCollision = () => {
    const head = snake[0].at(-1);

    const wallCollision = head.x < 0 || head.x > canvas.width - size || head.y < 0 || head.y > canvas.height - size;


    if (wallCollision) {
        if (direction == "Left") {
            snake[0].at(-1).x = canvas.width - size;
            setTimeout(() => {
                window.scroll(document.body.scrollWidth, window.scrollY)
            }, 1500)
        }
        if (direction == "Right") {
            snake[0].at(-1).x = 0;
            setTimeout(() => {
                window.scroll(0, window.scrollY)
            }, 1500)
        }
        if (direction == "Up") {
            snake[0].at(-1).y = canvas.height - size;
            setTimeout(() => {
                window.scroll(window.scrollX, document.body.scrollHeight)
            }, 1500)
        }
        if (direction == "Down") {
            snake[0].at(-1).y = 0;
            setTimeout(() => {
                window.scroll(window.scrollX, 0)
            }, 1500)
        }
        console.log(snake)
    }
}

const directionCam = () => {

    if (!direction) {
        return window.scroll(40, 40);
    }

    let x = size;
    let y = size;


    if (direction == "Right") {
        window.scroll(window.scrollX + x, window.scrollY)
        x += size;
    }

    if (direction == "Left") {
        window.scroll(window.scrollX - x, window.scrollY)
        x -= size;
    }

    if (direction == "Up") {
        window.scroll(window.scrollX, window.scrollY - y)
        y -= size;
    }

    if (direction == "Down") {
        window.scroll(window.scrollX, window.scrollY + y)
        y += size;
    }
}


const gameLoop = () => {
    clearInterval(loopId)
    const head = snake[0].at(-1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid()
    drawFood()
    drawSnake();
    moveSnake();
    checkEat();
    checkCollision()
    directionCam()

    coordX.innerHTML = head.x
    coordY.innerHTML = head.y
    remapLimitFood.innerHTML = limitFood

    if (direction) {
        statusgame = "ACTIVE SNAKE";
    }

    statusgameText.innerHTML = statusgame
    qtdPointsFoodText.innerHTML = qtdPointsFood



    loopId = setInterval(() => {
        gameLoop();
    }, velocity);
}


gameLoop()

document.addEventListener('keydown', ({ key }) => {
    if (key == "d" && direction != "Left") {
        direction = "Right";
    };

    if (key == "a" && direction != "Right") {
        direction = "Left";
    };

    if (key == "w" && direction != "Down") {
        direction = "Up";
    };

    if (key == "s" && direction != "Up") {
        direction = "Down";
    };

    if (key == "t") {
        snake[0].push(
            { x: snake[0].at(-1).x, y: snake[0].at(-1).y },
            { x: snake[0].at(-1).x, y: snake[0].at(-1).y },
            { x: snake[0].at(-1).x, y: snake[0].at(-1).y },
            { x: snake[0].at(-1).x, y: snake[0].at(-1).y },
            { x: snake[0].at(-1).x, y: snake[0].at(-1).y },
        )

        score += 5;
    }

    if (key == "o" || key == "y" || key == "i" || key == "u" || key == "4" || key == "5" || key == "6") {
        food.push(
            { x: snake[0].at(-1).x, y: snake[0].at(-1).y, color: `rgb(${colorRGB()}, ${colorRGB()}, ${colorRGB()})` },
        )
    }
})

setInterval(() => {
    if (statusgame == "ACTIVE SNAKE") {
        timingText.innerHTML = timing++
    }
}, 1000)