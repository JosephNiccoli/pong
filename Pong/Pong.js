
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

const canvas = document.getElementById("pong");
const context = canvas.getContext("2d"); // canvas context

const ball = new Ball; // Creates new ball
//console.log(ball);
ball.pos.x = 100;
ball.pos.y = 50;
ball.vel.x = 100;
ball.vel.y = 100;



let lastTime;
function callback(milliseconds) {
	if (lastTime) {
		update((milliseconds - lastTime) / 1000);
	}
	lastTime = milliseconds;
	requestAnimationFrame(callback);
}

// update ball position
function update(dt) {
	ball.pos.x += ball.vel.x * dt;
	ball.pos.y += ball.vel.y * dt;

	//if (ball.pos.x < 0 || ball.pos.x > canvas.width) { // this makes the ball bounce
	//	ball.vel.x = -ball.vel.x;
	//}
	//if (ball.pos.y < 0 || ball.pos.y > canvas.height) {
	//	ball.vel.y = -ball.vel.y;
	//}

	if (ball.left < 0 || ball.right > canvas.width) { // this makes the ball bounce
		ball.vel.x = -ball.vel.x;
	}
	if (ball.top < 0 || ball.bottom > canvas.height) {
		ball.vel.y = -ball.vel.y;
	}


	// canvas
	context.fillStyle = "#000"; // black
	context.fillRect(0, 0, canvas.width, canvas.height);

	//ball
	context.fillStyle = "#fff"; // black
	context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

callback();
