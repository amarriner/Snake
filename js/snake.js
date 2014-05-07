var size = 10;
var numx, numy;
var interval, timer_interval;
var step = 100;
var r = Math.ceil(Math.random() * 255);
var g = Math.ceil(Math.random() * 255);
var b = Math.ceil(Math.random() * 255);
var x = -1, y = -1;
var squares = [[]];
var stack = [];
var seconds = 1;
var paused = false;

function Square(xx, yy, red, green, blue) {
    this.x = xx;
    this.y = yy;
    this.r = typeof red !== 'undefined' ? red : 255;
    this.g = typeof green !== 'undefined' ? green : 255;
    this.b = typeof blue !== 'undefined' ? blue : 255;
}

var dirs = [{x: 0, y: -1},
            {x: 0, y: 1},
            {x: 1, y: 0},
            {x: -1, y: 0}];

$(document).ready(function() {
    $('#down').click(function() { set_speed(100); return false; });
    $('#up').click(function() { set_speed(-100); return false; });
    $('#pause').click(function() { pause(); return false; });
    $('#restart').click(function() { restart(); return false; });

    build();
});

function build() {
    clearInterval(interval);
    
    numx = Math.ceil($(window).width() / size);
    numy = Math.ceil($(window).height() / size);
        
    for (var i = 0; i < numx; i++) {
        squares[i] = [];
        
        for (var j = 0; j < numy; j++) {
            squares[i][j] = new Square(i, j);

            $('body').append('<div id="' + i + '_' + j + '" class="square" style="top: ' + j * size + 'px; left: ' + i * size + 'px; position:absolute; background-color: white; z-index: 200px;"></div>');
        }
    }
    $('.square').css('height', size + 'px').css('width', size + 'px');

    interval = setInterval('slither();', step);
    timer_interval = setInterval('timer();', 1000);
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
   for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
};

function set_speed(new_speed) {
    if (paused) {
        step += new_speed;
        if (step <= 0)
            step = 1;
    
        if (step >= 900)
            step = 900;
    
        $('#speed').html(10 - parseInt(Math.floor(step / 100)));
    }
}

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
    }
}

function restart() {
    clearInterval(interval);
    clearInterval(timer_interval);
    
    step = 100;
    seconds = 1;
    $('#speed').html('9');
    $('#timer').html('00:00:00');
    
    $('#up').addClass('up').removeClass('up_active');
    $('#down').addClass('down').removeClass('down_active');
    $('#pause').addClass('pause').removeClass('play');
    paused = false;

    $('.square').remove();
    build();
}

function slither() {
    var newx, newy;
    
    if (x == -1)
        x = Math.ceil(Math.random() * numx); 

    if (y == -1)
        y = Math.ceil(Math.random() * numy);

    $('#' + x + '_' + y).animate({backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')'});
    squares[x][y].r = r;
    squares[x][y].g = g;
    squares[x][y].b = b;
    stack.push(squares[x][y]);

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