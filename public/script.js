console.log('Hey!');

var socket = io();

console.log(socket);

$(".item").draggable({
     snap: "table td",
     snapMode: "inner",
     snapTolerance: 100
});

$('.tool').draggable();