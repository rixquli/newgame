class Joystick {
  constructor() {
    this.rotationCanvas = 0;
    this.rotationCanvasEnable = false;
  }
  canvasSetUp() {
    this.canvas = document.getElementById("joystick");
    this.ctx = this.canvas.getContext("2d");
    let joystick = document.querySelector("#joystick")
    this.canvasResize();

    joystick.addEventListener("mousedown", (e) => this.startDrawing(e));
    joystick.addEventListener("mouseup", () => this.stopDrawing());
    document.addEventListener("mousemove", (e) => this.Draw(e));

    joystick.addEventListener("touchstart", (e) => this.startDrawing(e));
    joystick.addEventListener("touchend", () => this.stopDrawing());
    joystick.addEventListener("touchcancel", () => this.stopDrawing());
    document.addEventListener("touchmove", (e) => this.Draw(e));
    window.addEventListener("resize", () => this.canvasResize());

    this.coord = { x: 0, y: 0 };
    this.paint = false;
  }
  is_it_in_the_circle() {
    var current_radius = Math.sqrt(
      Math.pow(this.coord.x - this.x_orig, 2) +
        Math.pow(this.coord.y - this.y_orig, 2)
    );
    if (this.radius >= current_radius) return true;
    else return false;
  }
  getPosition(event) {
    var mouse_x = event?.clientX || event?.touches?.[0].clientX;
    var mouse_y = event?.clientY || event?.touches[0].clientY;
    this.coord.x = mouse_x - this.canvas.offsetLeft;
    this.coord.y = mouse_y - this.canvas.offsetTop;
  }
  joystick(width, height) {
    this.ctx.beginPath();
    this.ctx.arc(width, height, this.radius / 2, 0, Math.PI * 2, true);
    this.ctx.fillStyle = "#F08080";
    this.ctx.fill();
    this.ctx.strokeStyle = "#F6ABAB";
    this.ctx.lineWidth = 8;
    this.ctx.stroke();
  }
  Draw(event) {
    if (this.paint) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.background();
      var angle_in_degrees, x, y;
      var angle = Math.atan2(
        this.coord.y - this.y_orig,
        this.coord.x - this.x_orig
      );

      if (Math.sign(angle) == -1) {
        angle_in_degrees = Math.round((-angle * 180) / Math.PI);
      } else {
        angle_in_degrees = Math.round(360 - (angle * 180) / Math.PI);
      }

      if (this.is_it_in_the_circle()) {
        this.joystick(this.coord.x, this.coord.y);
        x = this.coord.x;
        y = this.coord.y;
      } else {
        x = this.radius * Math.cos(angle) + this.x_orig;
        y = this.radius * Math.sin(angle) + this.y_orig;
        this.joystick(x, y);
      }

      this.getPosition(event);

      var x_relative = Math.round(x - this.x_orig);
      var y_relative = Math.round(y - this.y_orig);
      this.moveForwardJoystick = y_relative / 50;
      this.moveRightJoystick = x_relative / 50;
      this.rotationCanvasEnable = true;
      this.rotationCanvas = (angle_in_degrees + 90) * (Math.PI / 180);
      //send(x_relative, y_relative, speed, angle_in_degrees);
    }
  }
  stopDrawing() {
    this.paint = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background();
    this.joystick(this.width / 2, this.height / 2);
    this.moveForwardJoystick = 0;
    this.moveRightJoystick = 0;
    this.rotationCanvasEnable = false;
  }
  startDrawing(event) {
    event.preventDefault();
    this.paint = true;
    this.getPosition(event);
    console.log(this.is_it_in_the_circle());
    if (this.is_it_in_the_circle()) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.background();
      this.joystick(this.coord.x, this.coord.y);
      this.Draw();
    }
  }
  background() {
    this.x_orig = this.width / 2;
    this.y_orig = this.height / 2;

    this.ctx.beginPath();
    this.ctx.arc(
      this.x_orig,
      this.y_orig,
      this.radius * 1.5,
      0,
      Math.PI * 2,
      true
    );
    this.ctx.fillStyle = "#ECE5E5";
    this.ctx.fill();
  }
  canvasResize() {
    this.radius = 50;
    //width = window.innerWidth
    this.width = this.radius * 3.25;
    this.height = this.radius * 3.25;
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;
    this.background();
    this.joystick(this.width / 2, this.height / 2);
  }
}

export { Joystick };
