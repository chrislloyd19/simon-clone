$(document).ready(function() {
	
	var sounds = new Sounds();
	var simon = new Game(sounds);

	$("#red").on("click", function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			animate('R', sounds);
			simon.checkMove('R');
		}

	});

	$("#blue").on("click", function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			animate('B', sounds);
			simon.checkMove('B');
		}

	});

	$("#yellow").on("click", function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			animate('Y', sounds);
			simon.checkMove('Y');
		}

	});

	$("#green").on("click", function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			animate('G', sounds);
			simon.checkMove('G');
		}

	});

	$('#start').on("click", function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			// start game
			simon.reset();
			simon.nextColor();
		}
	})
	.on('mousedown', function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			$(this).attr('fill', '#7f0000');
		}
	})
	.on('mouseup', function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			$(this).attr('fill', '#ED1C24');
		}
	});

	$('#strict').on('click', function(e) {
		e.preventDefault();

		if (simon.getState() === 'U') {
			if(simon.toggleStrict()) {
				$(this).attr('fill', '#FBB03B');
			} else {
				$(this).attr('fill', '#966923');
			}
		}

	})

});

function Sounds() {
	var redAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
	var blueAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
	var yellowAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
	var greenAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
	
	var colorSounds = {
		'R' : redAudio,
		'B' : blueAudio,
		'Y' : yellowAudio,
		'G' : greenAudio
	};

	this.playSound = function(color) {
		colorSounds[color].play();
	}

}


function Game(gameSounds) {
	
	// 2 states: U, for user input allowed and S, for system only
	var state = 'U';
	var sequence = [];
	var move = 0;
	var sounds = gameSounds;
	var strict = true;

	this.getState = function() {
		return state;
	}

	this.setState = function(s) {
		state = s;
	}

	this.reset = function() {
		state = 'S';
		sequence = [];
		move = 0;
		updateCount(0);
	}

	this.nextColor = function() {
		state = 'S';
		move = 0;
		sequence.push(randomColor());
		updateCount(sequence.length);
		this.playSequence();
	}

	this.repeat = function() {
		state = 'S';
		// send the mess up number to the counter
		updateCount(42);
		move = 0;
		this.playSequence();

		setTimeout(function() {
			updateCount(sequence.length);
		}, 1000);

	}

	this.lose = function() {
		updateCount(42);

		setTimeout(function() {
			this.reset();
		}, 1000);

	}

	this.toggleStrict = function() {
		strict = !strict;
		return strict;
	}

	this.checkMove = function(color) {
		//console.log("length: " + sequence.length + ", move: " + move + ", color: " + color);

		if (sequence[move] === color) {
			move++;

			// if round complete
			if(sequence.length === move) {
				this.nextColor();
			}
		}
		else {
			// strict mode mess up
			if(strict) {
				this.lose();		
			} 
			// non strict mode mess up
			else {
				this.repeat();
			}

		}

	}

	this.playSequence = function() {
		var i = -1;
		var play = setInterval(function() {
			if(sequence.length === i) {
				//console.log(sequence);
				state = 'U';
				clearInterval(play);
				return;
			}

			// gives us an extra second before next round
			if(i > -1) {
				animate(sequence[i], sounds);
			}
			
			i++;
		}, 1000)
	}

}

function randomColor() {
	var colors = ['R', 'B', 'Y', 'G'];

	return colors[Math.floor(Math.random() * 4)];
}

function animate(color, sounds){
	var map = {
		'R' : 'red',
		'Y' : 'yellow',
		'G' : 'green',
		'B' : 'blue'
	}

	var c = "#" + map[color];

	sounds.playSound(color);
	$(c).css('opacity', '.5');
	
	setTimeout(function() {
		$(c).css('opacity', '1');
	}, 500);

}

function updateCount(count) {
	if(count === 42) {
		$('#count_digit_1').text('!');
		$('#count_digit_2').text('!');
	}
	else if(count < 10) {
		$('#count_digit_1').text('');
		$('#count_digit_2').text(count);
	} else {
		var digits = count.toString().split('');

		$('#count_digit_1').text(digits[0]);
		$('#count_digit_2').text(digits[1]);		
	}
	
}