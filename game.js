(function() {
  window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame || 
      function(callback){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  let context = null;
  let Game = {
    canvas: document.getElementById('canvas'),
    setup: function(){
      if(this.canvas.getContext && this.canvas.getContext('2d')){
        context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.init();
        Ctrl.init();
      }
    },
    animate: function(){
      Game.play = requestAnimFrame(Game.animate);
      Game.draw();
    },
    init: function(){
      Ball.init();
      Paddle.init();
      Bricks.init();
      this.animate();
    },
    draw: function(){
      Background.draw();
      Ball.draw();
      Paddle.draw();
      Bricks.draw();
    }
  };

  let Background = {
    draw: function(){
      context.fillStyle = '#000';
      context.fillRect(0, 0, Game.width, Game.height);
    }
  };
  
  let Bricks = {
    gaps: 2,
    columns: 5,
    width: 80,
    height: 15,
    init: function() {  
      this.rows = 3;
      this.total = 0;
      this.count = new Array(this.rows);
      for (let i = 0; i < this.rows; i++){
        this.count[i] = this.columns;
      };
    },
    draw: function(){
      for (let row = 0; row < this.rows; row++){
        for (let column = 0; column < this.columns; column++){
          context.fillStyle = this.gradient(row);
          context.fillRect(this.x(column), this.y(row), this.width, this.height);
        }
      }
    },
    x: function(column){
      return (column * this.width) + (column * this.gaps);
    },
    y: function(row){
      return (row * this.height) + (row * this.gaps);
    },
    gradient: function(row){
      switch(row) {
        case 0:
          return this.gradientPurple ? this.gradientPurple : this.gradientPurple = this.makeGradient(row, '#bd06f9',  '#9604c7');
        case 1:
          return this.gradientRed ? this.gradientRed : this.gradientRed = this.makeGradient(row, '#F9064A', '#c7043b');
        case 2:
          return this.gradientGreen ? this.gradientGreen : this.gradientGreen = this.makeGradient(row, '#05fa15', '#04c711');
        default:
          return this.gradientOrange ? this.gradientOrange : this.gradientOrange = this.makeGradient(row, '#faa105', '#c77f04');
      }
    },
    makeGradient: function(row, color1, color2){
      let y = this.y(row);
      let grad = context.createLinearGradient(0, y, 0, y + this.height);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      return grad;
    }
  };

  let Paddle = {
    w: 90,
    h: 20,
    r: 9,
    init: function() {  
      this.x = 100;
      this.y = 210;
      this.speed = 4;
    },
    draw: function(){
      this.move();

      context.beginPath();
      context.moveTo(this.x, this.y);
      context.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.r, this.r);
      context.lineTo(this.x + this.w, this.y + this.h - this.r);
      context.arcTo(this.x + this.w, this.y + this.h, this.x + this.w - this.r, this.y + this.h, this.r);
      context.lineTo(this.x + this.r, this.y + this.h);
      context.arcTo(this.x, this.y + this.h, this.x, this.y + this.h - this.r, this.r);
      context.lineTo(this.x, this.y + this.r);
      context.arcTo(this.x, this.y, this.x + this.r, this.y, this.r);
      context.closePath();

      context.fillStyle = this.gradient();
      context.fill();
    },
    move: function() {},
    gradient: function () {
      if (this.gradientCache){
        return this.gradientCache;
      }

      this.gradientCache = context.createLinearGradient(this.x, this.y, this.x, this.y + 20);
      this.gradientCache.addColorStop(0, '#eee');
      this.gradientCache.addColorStop(1, '#999');

      return this.gradientCache;
    }
  };
  
  let Ball = {
    radius: 10,
    init: function() {
      this.x = 120;
      this.y = 120;
      this.speedX = 2;
      this.speedY = -2;
    },
    draw: function(){
      this.edges();
      this.collide();
      this.move();

      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = '#eee';
      context.fill();
    },
    edges: function() {},
    collide: function() {},
    move: function() {}
  };

  let Ctrl = {
    init: function(){}
  };

  window.onload = function(){
    Game.setup();
  };

}());
