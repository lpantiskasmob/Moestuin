console.log('Hey!');

var socket = io();

console.log(socket);

$(".item").draggable({
     snap: "table td",
     snapMode: "inner",
     snapTolerance: 100
});

navigator.geolocation.getCurrentPosition(newPosition);

function newPosition(position) {
    console.log(position);
}

var garden = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
];

function isGrown() {
        return this.grow > 4;
}

var seed = {'seed': true, 'grow': 0, 'element': $('.item'), isGrown: isGrown};


var gieter = {'tool': true, 'element': $('.gieter')};
var schepje = {'tool': true, 'element': $('.schepje')};
var dragging = null;


$('.item').draggable({
    start: function( event, ui) {
        dragging = seed;
    },
    stop: function(event, ui) {
        dragging = null;
    }
})
$('.tool').draggable({
    start: function( event, ui ) {
        if(this.classList.contains('gieter')) {
            dragging = gieter;
        } else if(this.classList.contains('schepje')) {
            dragging = schepje;
        }
    },
    stop: function(event, ui) {
        dragging = null;
    }
});

$('table td').droppable({
    drop: function( event, ui ) {
        var x = Number.parseInt(this.dataset.x);
        var y = Number.parseInt(this.dataset.y);

        // Drop a seed
        if(dragging && dragging.seed) {
            garden[y][x] = dragging;
            dragging.element
                .css('position', 'static')
                .attr("src", 'public/img/zaad.png')
                .draggable( "option", "disabled", true);
            $(this).append(dragging.element);
        }
    },
    over: function(event, ui) {
        var x = Number.parseInt(this.dataset.x);
        var y = Number.parseInt(this.dataset.y);

        //var item = garden[y][x];

        if(dragging && dragging.tool && garden[y][x] !== null) {
            var tool = dragging;
            var planted = garden[y][x];

            if(tool === gieter) {
                // Grow plant
                planted.grow += 1;

                // Develop plant into tomato?
                if(planted.grow === 4) {
                    var height = planted.element.height();
                    planted.element
                        .animate({width: 0, height: 0}, function() {planted.element.attr('src', 'public/img/tomaat.png')})
                        .animate({width: height, height: height});
                }
            }

            // Harvest plant
            if(tool === schepje && planted.isGrown()) {
                planted.element
                    .fadeOut(function() {$('.oogst').append(planted.element)})
                    .fadeIn();

            }
        }
    }
});