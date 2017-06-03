var socket = io();

$(".item").draggable({
     snap: "table td",
     snapMode: "inner",
     snapTolerance: 100
});

$('.challenges li').click(function() {
    html = `<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style="width: 15px; height: 15px">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>`;
    $(this).prepend($(html));
})

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
    return this.isWatered && this.isFertilized;
}

function grow() {
    this.growLevel += 1;
    var height = this.element.height();
    var self = this;
    if(this.growLevel === 1) {
        // Sapling
        this.element
            .animate({width: 0, height: 0}, function() {self.element.attr('src', 'public/img/sapling.png')})
            .animate({width: height, height: height});
    } else if(this.growLevel === 2) {
        // Full plant
        var type = self.element.data('type');
        this.element
            .animate({width: 0, height: 0}, function() {self.element.attr('src', 'public/img/' + type + '.png')})
            .animate({width: height, height: height});
    }
}



$('.item').each(function() {
    var seed = {
        'seed': true,
        'isWatered': false,
        'isFertilized': false,
        'element': $(this),
        'isGrown': isGrown,
        'growLevel': 0,
        'grow': grow
    };
    this.seed = seed;
});


var gieter = {'tool': true, 'element': $('.gieter')};
var schepje = {'tool': true, 'element': $('.schepje')};
var mest = {'tool': true, 'element': $('.mest')};

var dragging = null;

// Chatbox
$('form').on('submit', function(e) {
    var text = $('.chat input').val();
    $('.chat input').val('');
    socket.emit('chat message', {
        'sender': window.location.hash.substring(1) || 'Paul',
        'text': text
    });
});

socket.on('chat message', function(msg){
    var li = $('<li><span class="name">Paul</span>: <span class="message"></span></li>');
    li.find('.name').text(msg.sender);
    li.find('.message').text(msg.text);
    $('.messages').append(li);
});

$('.item').draggable({
    start: function( event, ui) {
        dragging = event.target.seed;
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
        } else if(this.classList.contains('mest')) {
            dragging = mest;
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
            var plant = garden[y][x];

            if(tool === gieter) {
                if(!plant.isWatered) {
                    plant.isWatered = true;
                    plant.grow();
                }
            }

            if(tool === mest) {
                if(!plant.isFertilized) {
                    plant.isFertilized = true;
                    plant.grow();
                }
            }

            // Harvest plant
            if(tool === schepje && plant.isGrown()) {
                plant.element
                    .fadeOut(function() {$('.oogst').append(plant.element)})
                    .fadeIn();

            }
        }
    }
});