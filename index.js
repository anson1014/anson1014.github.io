////////// CONSTELLATION ANIMATION

var API = (function(window, document, undefined) {

    // Canvas vars
    var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext("2d"),
      cH, cW; // Canvas height / Canvas width
  
    function initCanvas() {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
  
      cH = canvas.height;
      cW = canvas.width;
    }
  
    var colors = {
      circle: "white"
    };
  
    window.onresize = function() {
      initCanvas();
      initScene();
    };
    initCanvas();
  
    var velocity = 0.3;
    var util = {
      getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      getRandomVelocity: function() {
        return (velocity - (Math.random() * 0.5));
      }
    };
    // Math.root
    Math.root = function(val) {
      return val * val;
    };
  
    // Points class
    var basePointSize = 0.5;
    var Point = function(x, y) {
      var _x = x || util.getRandomInt(0, cW),
        _y = y || util.getRandomInt(0, cH),
        _radius = basePointSize + util.getRandomInt(0, 4);
  
      var _vx = util.getRandomVelocity(),
        _vy = util.getRandomVelocity();
  
      // Draw point
      this.drawPoint = function() {
        ctx.beginPath();
        ctx.arc(
          _x,
          _y,
          _radius,
          0,
          2 * Math.PI
        );
        ctx.fill();
      };
  
      // Getters
      this.x = function() {
        return _x
      };
      this.y = function() {
        return _y;
      };
      this.size = function() {
        return _radius;
      };
  
      // Animate
      this.animate = function() {
        if (_y < _radius || _y > (cH - _radius)) {
          _vy = -1 * _vy;
        } else if (_x < _radius || _x > (cW - _radius)) {
          _vx = -1 * _vx;
        }
        _x += _vx;
        _y += _vy;
      };
  
      return this;
    };
  
    // Line between 2 points
    var Line = function(point1, point2, distance) {
  
      var t1 = minDist * (point1.size() / 2),
        t2 = minDist * (point2.size() / 2);
  
      var threShould = t1 > t2 ? t1 : t2;
  
      if (distance < threShould) {
  
        var opacity = (1 - distance / threShould * 1.2);
        ctx.strokeStyle = "rgba(255, 255,255," + opacity + ")";
  
        ctx.beginPath();
        ctx.moveTo(point1.x(), point1.y());
        ctx.lineTo(point2.x(), point2.y());
        ctx.stroke();
      }
    };
  
    // Number of generated pointsm points array, min dits between points
    var pointsNumber,
      points,
      minDist;
  
    var refValue = {
      surface: 736000,
      dotsNumber: 150,
      minDistBetweenDots: 110
    };
  
    var passedVal;
    // Create Points
    function initScene(dotCount) {
      passedVal = passedVal || dotCount;
  
      pointsNumber = passedVal || Math.floor(refValue.dotsNumber * (cH * cW) / refValue.surface);
      minDist = refValue.minDistBetweenDots;
  
      points = [];
      for (var i = 0; i < pointsNumber; i++) {
        points.push(new Point());
        points[i].drawPoint();
      }
  
      ctx.fillStyle = colors.circle;
      ctx.lineWidth = 0.5;
    }
  
    // Update values and redraw
    function updateScene() {
      ctx.clearRect(0, 0, cW, cH);
  
      // For all points
      for (var i = 0; i < pointsNumber; i++) {
  
        // Move points
        points[i].animate();
  
        for (var j = i; j < pointsNumber; j++) {
          // Make line between 2 points
          new Line(
            points[i],
            points[j],
            Math.sqrt((Math.root(points[j].x() - points[i].x()) + Math.root(points[j].y() - points[i].y())))
          )
  
        }
  
        // Draw point last to overlad lines
        points[i].drawPoint();
      }
    }
  
    // Add point at given coordinate

  
    return {
      init: initScene,
      update: updateScene
    }
  
  })(window, document);
  
  (function() {
    API.init();
  
    (function animate() {
      API.update();
      requestAnimationFrame(animate);
    })();
  })();

  
///////////////// TEXT ANIMATION

var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;

words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}

function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }
  
  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }
  
  currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
}

function animateLetterOut(cw, i) {
  setTimeout(function() {
		cw[i].className = 'letter out';
  }, i*80);
}

function animateLetterIn(nw, i) {
  setTimeout(function() {
		nw[i].className = 'letter in';
  }, 340+(i*80));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerHTML = content.charAt(i);
    word.appendChild(letter);
    letters.push(letter);
  }
  
  wordArray.push(letters);
}

changeWord();
setInterval(changeWord, 5000);

