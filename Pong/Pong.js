
class Vec // holds x and y position
{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
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
		super(20, 100); // 20 width, 100 height this is the dimensions of the player
		this.score = 0;
	}
}

class Pong {

	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext("2d"); // canvas context
		this.ball = new Ball; // Creates new ball

		this.ball.pos.x = 100;
		this.ball.pos.y = 50;
		this.ball.vel.x = 100;
		this.ball.vel.y = 100;

		// set up 2 new instances of players in an aray
		this.players = [
			new Player,
			new Player
		];

		this.players[0].pos.x = 40;
		this.players[1].pos.x = this._canvas.width - 40;
		this.players.forEach(player => {
			player.pos.y = this._canvas.height / 2;
		})

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

	}

	draw() {
		// canvas
		this._context.fillStyle = "#000"; // black
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		this.drawRect(this.ball); // telling it to draw the ball

		// draw the new player
		this.players.forEach(player => this.drawRect(player));
	}
	drawRect(rect) {
		//ball
		this._context.fillStyle = "#fff"; // black
		this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
	}
	// update ball position
	update(dt) {
		this.ball.pos.x += this.ball.vel.x * dt;
		this.ball.pos.y += this.ball.vel.y * dt;

		if (this.ball.left < 0 || this.ball.right > this._canvas.width) { // this makes the ball bounce
			this.ball.vel.x = -this.ball.vel.x; 
		}
		if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
			this.ball.vel.y = -this.ball.vel.y;
		}

		this.players[1].pos.y = this.ball.pos.y;

		this.draw();
	}

}

const canvas = document.getElementById("pong");

// initialize the virtual game

const pong = new Pong(canvas);

// handler for the player mouse to move the bars position

canvas.addEventListener('mousemove', event => {
	pong.players[0].pos.y = event.offsetY;
});


