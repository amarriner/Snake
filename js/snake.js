var NUM_SNAKES = 4;
var squares = [[]];                       // Grid of objects
var numx, numy;

// Simple javascript "object" to store squares in the grid array
function Square(xx, yy, red, green, blue) {
    this.x = xx;
    this.y = yy;
    this.r = typeof red   !== 'undefined' ? red   : 255;
    this.g = typeof green !== 'undefined' ? green : 255;
    this.b = typeof blue  !== 'undefined' ? blue  : 255;
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

// Runs when the DOM is fully loaded
$(document).ready(function() {
    timer = new Timer();
});

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
    
    // Determine number of squares in the grid based on window size (or viewport size, rather)
    // Potentially useful to handle resizing events, as well, though that's not implemented
    numx = Math.ceil($(window).width()  / self.size);
    numy = Math.ceil($(window).height() / self.size);
        
    // Initialize grid array and DIVs on the page
    for (var i = 0; i < numx; i++) {
        squares[i] = [];
        
        for (var j = 0; j < numy; j++) {
            squares[i][j] = new Square(i, j);

            $('body').append('<div id="' + i + '_' + j + '" class="square" style="top: ' + j * self.size + 'px; left: ' + i * self.size + 'px; position:absolute; background-color: white; z-index: 200px;"></div>');
        }
    }

    // Set DIV height and width within the grid
    $('.square').css('height', self.size + 'px').css('width', self.size + 'px');

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
    
        $('#timer').html(hours + ':' + minutes + ':' + secs);
        self.seconds++;
    
        var num_finished = 0;
        for (var z = 0; z < NUM_SNAKES; z++) {
            if (self.snakes[z].finished) {
                num_finished++;
            }
        }
        
        if (num_finished >= NUM_SNAKES) {
            clearInterval(self.interval);
        }
    }

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
    
    // Main timer to create the colors
    self.slither = function() {
        var newx, newy;
        self.count++;
        
        // At the start x is -1 and y is -1 so get a random spot on the grid
        if (self.x == -1) {
            console.log('---');
            self.x = Math.ceil(Math.random() * numx); 
        }
        
        if (self.y == -1)
            self.y = Math.ceil(Math.random() * numy);
        
        // Change the current square's background color to the current random color
        $('#' + self.x + '_' + self.y).animate({backgroundColor: 'rgb(' + self.r + ',' + self.g + ',' + self.b + ')'});
        
        // Also update the square and push it onto the stack so we can backtrack to it later
        squares[self.x][self.y].r = self.r;
        squares[self.x][self.y].g = self.g;
        squares[self.x][self.y].b = self.b;
        self.stack.push(squares[self.x][self.y]);
        
        // Attempt to find a neighbor in the cardinal directions whose color is white
        // this should be rewritten to use the square object's values rather than the css property
        // If we found an "empty" neighbor, that will be the next "current" x,y
        var found = false;
        var shuffled = shuffle(self.dirs);
        for(var k = 0; k < shuffled.length; k++) {
            newx = parseInt(self.x) + parseInt(shuffled[k].x);
            newy = parseInt(self.y) + parseInt(shuffled[k].y);
            if ($('#' + newx + '_' + newy).css('background-color') == 'rgb(255, 255, 255)' && ! found) {
                found = true;
                self.x = newx;
                self.y = newy;
            }
            
        }
        
        // If no neighbor was found then we're at a dead end
        // Begin popping squares off the stack until we find one who has an "empty" neighbor 
        // If we pop all the squares off the stack then we're done
        while (! found) {
            if (self.stack.length > 0) {
                var last = self.stack.pop();
                for(var k = 0; k < shuffled.length; k++) {
                    
                    newx = parseInt(last.x) + parseInt(shuffled[k].x);
                    newy = parseInt(last.y) + parseInt(shuffled[k].y);
                    if (newx < numx && newy < numy && newx >= 0 && newy >= 0) {
                        if (squares[newx][newy].r == 255 && squares[newx][newy].g == 255 && squares[newx][newy].b == 255) {
                            found = true;
                            //self.r = Math.ceil(Math.random() * 255);
                            //self.g = Math.ceil(Math.random() * 255);
                            //self.b = Math.ceil(Math.random() * 255);
                            self.x = last.x;
                            self.y = last.y;
                        }
                    }
                }
            }
            
            // This is the done condition, there are no squares left in the stack
            else {
                found = true;      
                self.finished = true;
            }
        }
    }
}