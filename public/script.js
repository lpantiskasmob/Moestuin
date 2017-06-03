console.log('Hey!');

var socket = io();

console.log(socket);

$(".item").draggable({
     snap: "table td",
     snapMode: "inner",
     snapTolerance: 100
});

var garden = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
];

var gieter = {};
var schepje = {};
var dragging = null;

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

        console.log('Drop')
    },
    over: function(event, ui) {
        var x = Number.parseInt(this.dataset.x);
        var y = Number.parseInt(this.dataset.y);
    }
});