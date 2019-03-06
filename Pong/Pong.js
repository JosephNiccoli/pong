
class Vec // holds x and y position
{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	// NEEDS A GETTER AND SETTER
	//the getter gets us the length of the vector which is the combination of both x and y which is the hypotenuse
	// speed = length  // length = len
	get len() { // added to normailze the speed of the ball when it starts
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	// value is the length of the vector
	set len(value) {
		const factor = value / this.len;
		this.x *= factor;
		this.y *= factor;

	}
}
// ball position and size
class Rect {
	constructor(w, h) {
		this.pos = new Vec;
		this.size = new Vec(w, h);
	}

	//special getters for Scaffolding

	// lets us get the center of the rectangle and the left and right of the rectangle
	get left() {
		return this.pos.x - this.size.x / 2;
	}
	get right() {
		return this.pos.x + this.size.x / 2;
	}
	get top() {
		return this.pos.y - this.size.y / 2;
	}
	get bottom() {
		return this.pos.y + this.size.y / 2;
	}
}

// child class of Rect
// ball position and size continued
class Ball extends Rect {
	constructor() {
		super(10, 10); // calls the parent class of Ball
		this.vel = new Vec; // velocity
	}
}


class Player extends Rect {
	constructor() {
		// super calls the parent constructor
		super(20, 100); // 10 width, 100 height this is the dimensions of the player
		this.score = 0;
	}
}

class Pong {
	//The constructor method is a special method for creating and initializing an object created within a class
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext("2d"); // canvas context
		this.ball = new Ball; // Creates new ball


		// set up 2 new instances of players in an array
		this.players = [
			new Player,
			new Player
		];

		this.players[0].pos.x = 20;
		this.players[1].pos.x = this._canvas.width - 20;
		this.players.forEach(player => {
			player.pos.y = this._canvas.height / 2;
		});

		let lastTime;

		//function callback(milliseconds) {  cant have a normal function in here needs to be an arrow function
		const callback = (milliseconds) => {
			if (lastTime) {
				this.update((milliseconds - lastTime) / 1000); // add this. because the arrow function does not have a this context
			}
			lastTime = milliseconds;
			requestAnimationFrame(callback);
		};

		callback();

		// build an array for the score picture
		//numbers are arranged by a 3x5 square
		/* 111
		   010
		   010
		   010
		   111*/
		this.CHAR_PIXEL = 10;
		this.CHARS = [
			"111101101101111",
			"010010010010010",
			"111001111100111",
			"111001111001111",
			"101101111001001",
			"111100111001111",
			"111100111101111",
			"111001001001001",
			"111101111101111",
			"111101111001111"
		].map(str => {
			// draws a new canvas for each string
			const canvas = document.createElement("canvas");
			canvas.height = this.CHAR_PIXEL * 5;
			canvas.width = this.CHAR_PIXEL * 3;
			const context = canvas.getContext("2d");
			context.fillStyle = "#fff";
			str.split("").forEach((fill, i) => {
				if (fill === "1") {
					context.fillRect(
						(i % 3) * this.CHAR_PIXEL,
						(i / 3 | 0) * this.CHAR_PIXEL,
						this.CHAR_PIXEL,
						this.CHAR_PIXEL);
				}
			});

			return canvas;
		});

		this.reset();

	}


	collide(player, ball) {

		// player colliding with the ball
		if (player.left < ball.right &&
			player.right > ball.left &&
			player.top < ball.bottom &&
			player.bottom > ball.top) {
			const len = ball.vel.len; // save ball velocity
			ball.vel.x = -ball.vel.x; // negate vertical velocity
			ball.vel.y += 300 * (Math.random() - .5); // fudge horizontal velocity
			ball.vel.len = len * 1.05; // replace the length/spped and increase it by 5 percent 
		}

	}


	draw() {
		// canvas
		this._context.fillStyle = "#000"; // black
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		this.drawRect(this.ball); // telling it to draw the ball

		// draw the new player
		this.players.forEach(player => this.drawRect(player));
		this.drawScore();
	}
	drawRect(rect) {
		//ball
		this._context.fillStyle = "#fff"; // black
		this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
	}

	drawScore() {
		// the alignment of the score on the canvas needs to be centered
		const align = this._canvas.width / 3;
		const CHAR_W = this.CHAR_PIXEL * 4; // this is the character width of 4 pixels leaving one blank
		this.players.forEach((player, index) => { // to convert players score to the characters on screen
			const chars = player.score.toString().split("");
			const offset = align * (index + 1) -
				(CHAR_W * chars.length / 2) +
				this.CHAR_PIXEL / 2;
			chars.forEach((char, pos) => {
				this._context.drawImage(this.CHARS[char | 0], offset + pos * CHAR_W, 20);
			});
		});
	}

	// RESETS THE BALL
	reset() {
		this.ball.pos.x = this._canvas.width / 2;
		this.ball.pos.y = this._canvas.height / 2;
		this.ball.vel.x = 0;
		this.ball.vel.y = 0;
	}

	// checks the balls speed because you can only start the ball if it is not in motion
	start() {
		if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
			// randomize the direction of the ball
			this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1); // if what is returned by math.random is more than .5 then mult by 1 otherwise if less than. mult by -1
			this.ball.vel.y = 300 * (Math.random() * 2 - 1); // tweaks the y value so it changes the speed up or down just a little bit
			this.ball.vel.len = 200;
		}
	}

	// update ball position
	update(dt) {
		this.ball.pos.x += this.ball.vel.x * dt;
		this.ball.pos.y += this.ball.vel.y * dt;

		if (this.ball.left < 0 || this.ball.right > this._canvas.width) { // this makes the ball bounce
			// adding a score//let playerId;//if (this.ball.vel.x < 0) {//	playerId = 1;//} else {//	playerId = 0; // same as bellow
			const playerId = this.ball.vel.x < 0 | 0; // this says 0 or 1 convert to an integer
			this.players[playerId].score++;
			this.reset();
		}


		if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
			this.ball.vel.y = -this.ball.vel.y;
		}

		this.players[1].pos.y = this.ball.pos.y;

		// need to test the collision

		this.players.forEach(player => this.collide(player, this.ball));

		this.draw();
	}

}

const canvas = document.getElementById("pong");

// initialize the virtual game

const pong = new Pong(canvas);

// handler for the player mouse to move the bars position

canvas.addEventListener('mousemove', event => {
	const scale = event.offsetY / event.target.getBoundingClientRect().height; // to midigate the new size of the screen for the paddels
	pong.players[0].pos.y = canvas.height * scale;
});
canvas.addEventListener('click', event => {
	pong.start();
});


