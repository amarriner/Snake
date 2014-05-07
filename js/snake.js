var size = 10;                            // Pixel size of individual squares
var numx, numy;                           // Number of squares horiztonally and vertically decided by window size
var interval, timer_interval;             // Variables to keep track of timers via setInterval()
var step = 100;                           // Initial speed
var r = Math.ceil(Math.random() * 255);   // Random red
var g = Math.ceil(Math.random() * 255);   // Random green
var b = Math.ceil(Math.random() * 255);   // Random blue
var x = -1, y = -1;                       // "Current" x,y
var squares = [[]];                       // Grid of objects
var stack = [];                           // Stack for maze algorithm
var seconds = 1;                          // Total seconds elapsed (roughly)
var paused = false;                       // Whether the snake is paused or not

// Simple javascript "object" to store squares in the grid array
function Square(xx, yy, red, green, blue) {
    this.x = xx;
    this.y = yy;
    this.r = typeof red !== 'undefined' ? red : 255;
    this.g = typeof green !== 'undefined' ? green : 255;
    this.b = typeof blue !== 'undefined' ? blue : 255;
}

// Variable to ease in checking cardinal directions from a given square
var dirs = [{x: 0, y: -1},
            {x: 0, y: 1},
            {x: 1, y: 0},
            {x: -1, y: 0}];

// Runs when the DOM is fully loaded
$(document).ready(function() {

    // Bind functions to clicks
    $('#down').click(function()    { set_speed(100); return false; });
    $('#up').click(function()      { set_speed(-100); return false; });
    $('#pause').click(function()   { pause(); return false; });
    $('#restart').click(function() { restart(); return false; });

    // Set up the grid
    build();
});

<<<<<<< HEAD
// This function sets up the grid at page load or when restarted
function build() {

    // Stop the timers if they're running
    clearInterval(interval);
    clearInterval(timer_interval);
=======
// This just updates the #timer DIV every second with the current elapsed time
// This is not 100% accurate because of the way I'm using the two timers at 
// different intervals, but it should be close enough
var Timer = function() {
    
    var self = this;
    self.interval;       // Interval for timer
    self.snake_interval; // Interval for snakes slithering, should be moved back into Snake object since I figured this out
    self.seconds = 1;    // Elapsed seconds
    self.snakes = [];    // Array of snakes
    self.size = 10;      // Pixel size of grid squares
    self.step = 100;     // Initial speed
>>>>>>> e200c36bf4bba79ff689021286b697c0e362e33e
    
    // Determine number of squares in the grid based on window size (or viewport size, rather)
    // Potentially useful to handle resizing events, as well, though that's not implemented
    numx = Math.ceil($(window).width() / size);
    numy = Math.ceil($(window).height() / size);
        
    // Initialize grid array and DIVs on the page
    for (var i = 0; i < numx; i++) {
        squares[i] = [];
        
        for (var j = 0; j < numy; j++) {
            squares[i][j] = new Square(i, j);

            $('body').append('<div id="' + i + '_' + j + '" class="square" style="top: ' + j * size + 'px; left: ' + i * size + 'px; position:absolute; background-color: white; z-index: 200px;"></div>');
        }
    }

    // Set DIV height and width within the grid
    $('.square').css('height', size + 'px').css('width', size + 'px');

<<<<<<< HEAD
    // Start the timers
    interval = setInterval('slither();', step);
    timer_interval = setInterval('timer();', 1000);
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
   for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
};

// Alter the speed of the timers when paused
// Max speed is 900ms
// Min speed is 1ms
function set_speed(new_speed) {
    if (paused) {
        step += new_speed;
        if (step <= 0)
            step = 1;
=======
    for (var z = 0; z < NUM_SNAKES; z++) {
        self.snakes.push(new Snake());
    }
    
    // Make all the snakes move, should be moved back into Snake object
    self.slither_snakes = function() {
        for(var z = 0; z < NUM_SNAKES; z++) {
            if(! self.snakes[z].finished) {
                self.snakes[z].slither();
            }
        }
    }
    
    // Update the timer with elapsed time and stop when done
    self.update = function() {
        var hours   = Math.floor(self.seconds / 3600);
        var minutes = Math.floor((self.seconds - (hours * 3600)) / 60);
        var secs    = self.seconds - (hours * 3600) - (minutes * 60);
    
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        secs = (secs < 10) ? '0' + secs : secs;
>>>>>>> e200c36bf4bba79ff689021286b697c0e362e33e
    
        if (step >= 900)
            step = 900;
    
<<<<<<< HEAD
        $('#speed').html(10 - parseInt(Math.floor(step / 100)));
    }
}

// Pause or Unpause the timers
// Probably should have a different name :/
// Starts/stops the timers and updates the CSS class of the controls to align with the current state
function pause() {
    if (paused) {
        interval = setInterval('slither();', step);
        timer_interval = setInterval('timer();', 1000);
        
        $('#up').addClass('up').removeClass('up_active');
        $('#down').addClass('down').removeClass('down_active');
        $('#pause').addClass('pause').removeClass('play');
        paused = false;
    }
    else {
        clearInterval(interval);
        clearInterval(timer_interval);
        
        $('#up').removeClass('up').addClass('up_active');
        $('#down').removeClass('down').addClass('down_active');
        $('#pause').removeClass('pause').addClass('play');
        paused = true;
=======
        var num_finished = 0;
        for (var z = 0; z < NUM_SNAKES; z++) {
            if (self.snakes[z].finished) {
                num_finished++;
            }
        }
        
        if (num_finished >= NUM_SNAKES) {
            clearInterval(self.interval);
        }
>>>>>>> e200c36bf4bba79ff689021286b697c0e362e33e
    }
}

<<<<<<< HEAD
// Start from scratch
// Reset everything and run build() again
function restart() {
    clearInterval(interval);
    clearInterval(timer_interval);
    
    step = 100;
    seconds = 1;
    $('#speed').html('9');
    $('#timer').html('00:00:00');
    $('#complete').html('');

    $('#up').addClass('up').removeClass('up_active');
    $('#down').addClass('down').removeClass('down_active');
    $('#pause').addClass('pause').removeClass('play');
    paused = false;

    $('.square').remove();
    build();
}

// Main timer to create the colors
function slither() {
    var newx, newy;
=======
    self.interval = setInterval(function() { self.update(); }, 1000);
    self.snake_interval = setInterval(function() { self.slither_snakes(); }, self.step);
}

// Snake object
var Snake = function() {

    var self = this;                           // Store this inside itself so setInterval() works correctly
    self.finished = false;                     // Boolean denoting whether the snake is done moving or not
    self.interval;                             // Variable to keep track of the timer via setInterval()
    self.r = Math.ceil(Math.random() * 255);   // Random red
    self.g = Math.ceil(Math.random() * 255);   // Random green
    self.b = Math.ceil(Math.random() * 255);   // Random blue
    self.x = -1, self.y = -1;                  // "Current" x,y
    self.stack = [];                           // Stack for maze algorithm
    self.count = 0;

    // Variable to ease in checking cardinal directions from a given square
    self.dirs = [{x:  0, y: -1},
                 {x:  0, y:  1},
                 {x:  1, y:  0},
                 {x: -1, y:  0}];
>>>>>>> e200c36bf4bba79ff689021286b697c0e362e33e
    
    // At the start x is -1 and y is -1 so get a random spot on the grid
    if (x == -1)
        x = Math.ceil(Math.random() * numx); 

    if (y == -1)
        y = Math.ceil(Math.random() * numy);

    // Change the current square's background color to the current random color
    $('#' + x + '_' + y).animate({backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')'});

    // Also update the square and push it onto the stack so we can backtrack to it later
    squares[x][y].r = r;
    squares[x][y].g = g;
    squares[x][y].b = b;
    stack.push(squares[x][y]);

    // Attempt to find a neighbor in the cardinal directions whose color is white
    // This should be rewritten to use the square object's values rather than the css property
    // If we found an "empty" neighbor, that will be the next "current" x,y
    var found = false;
    var shuffled = shuffle(dirs);
    for(var k = 0; k < shuffled.length; k++) {
        newx = parseInt(x) + parseInt(shuffled[k].x);
        newy = parseInt(y) + parseInt(shuffled[k].y);
        if ($('#' + newx + '_' + newy).css('background-color') == 'rgb(255, 255, 255)' && ! found) {
            found = true;
            x = newx;
            y = newy;
        }
       
    }
    
    // If no neighbor was found then we're at a dead end
    // Begin popping squares off the stack until we find one who has an "empty" neighbor 
    // If we pop all the squares off the stack then we're done
    while (! found) {
        if (stack.length > 0) {
            last = stack.pop();
            for(var k = 0; k < shuffled.length; k++) {

                newx = parseInt(last.x) + parseInt(shuffled[k].x);
                newy = parseInt(last.y) + parseInt(shuffled[k].y);
                if (newx < numx && newy < numy && newx >= 0 && newy >= 0) {
                    if (squares[newx][newy].r == 255 && squares[newx][newy].g == 255 && squares[newx][newy].b == 255) {
                        found = true;
                        r = Math.ceil(Math.random() * 255);
                        g = Math.ceil(Math.random() * 255);
                        b = Math.ceil(Math.random() * 255);
                        x = last.x;
                        y = last.y;
                    }
                }
            }
        }

        // This is the done condition, there are no squares left in the stack
        else {
            found = true;

            clearInterval(interval);
            clearInterval(timer_interval);

            $('#complete').html('Complete!');

            $('#up').removeClass('up').addClass('up_active');
            $('#down').removeClass('down').addClass('down_active');
            $('#pause').removeClass('pause').addClass('play');
            paused = true;
        }
    }
}

// This just updates the #timer DIV every second with the current elapsed time
// This is not 100% accurate because of the way I'm using the two timers at 
// different intervals, but it should be close enough
function timer() {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var secs = seconds - (hours * 3600) - (minutes * 60);
    
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    secs = (secs < 10) ? '0' + secs : secs;
    
    $('#timer').html(hours + ':' + minutes + ':' + secs);
    seconds++;
}
