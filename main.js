
var currentColor = "#000";
var currentBg = "#ffffff";

var selectedColorBox = $("#selectedColor");

var playingSong = null;
var musicOn = true;

//Playlist
var song1 = './files/1.mp3';
var song2 = './files/2.mp3';
var song3 = './files/3.mp3';
var song4 = './files/4.mp3';
var playlist = [song1,song2,song3,song4];

//Audio Settings
var audio = document.getElementById("music");
audio.volume = 0.2;

// Browsers block autoplay-with-sound until the user interacts with the page.
// Swallow the rejected promise, then start playback on the first user gesture.
function tryPlayMusic(){
    var p = audio.play();
    if(p && p.catch){ p.catch(function(){}); }
}
tryPlayMusic();
$(document).one('click keydown', function(){
    if(musicOn){ tryPlayMusic(); }
});

var charge = document.getElementById("charge");
charge.volume = 0.7;

var oneUp = document.getElementById("oneUp");
var energy = document.getElementById("energyAudio");

$(document).ready(function(){
    playingSong = playlist[0];
    console.log("Playing Song: "+playingSong);
    $("#selectedColor").css('background','black')
});

//Coloring — click a pixel, or hold and drag to paint. Painting is driven by
//mousemove (which always fires during a drag) and interpolated along the
//stroke so fast movements don't leave gaps between pixels.
var isDrawing = false;
var lastX = null, lastY = null;

function paintAt(x, y){
    var el = document.elementFromPoint(x, y);
    if(el && el.classList.contains('pixel')){
        el.style.background = currentColor;
    }
}
function paintLine(x0, y0, x1, y1){
    var dx = x1 - x0, dy = y1 - y0;
    var steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4)); // sample every ~4px
    for(var i = 0; i <= steps; i++){
        paintAt(x0 + dx * i / steps, y0 + dy * i / steps);
    }
}

// Works for both mouse and touch — paintAt() hit-tests with elementFromPoint,
// so a finger and a cursor are handled by exactly the same code path.
function pointOf(e){
    var src = e.originalEvent || e;
    var touch = src.touches && src.touches[0];
    if(touch){ return {x: touch.clientX, y: touch.clientY}; }
    return {x: e.clientX, y: e.clientY};
}
function startStroke(e){
    var p = pointOf(e);
    e.preventDefault(); // stop native image drag / page scroll while painting
    isDrawing = true;
    lastX = p.x; lastY = p.y;
    paintAt(p.x, p.y);
}
function moveStroke(e){
    if(!isDrawing){ return; }
    var p = pointOf(e);
    e.preventDefault();
    paintLine(lastX, lastY, p.x, p.y);
    lastX = p.x; lastY = p.y;
}
function endStroke(){ isDrawing = false; lastX = lastY = null; }

$("#pixelCanvas").on('mousedown touchstart', startStroke);
$("#pixelCanvas").on('mousemove touchmove', moveStroke);
$(document).on('mouseup touchend touchcancel', endStroke);
//Palette
$("#palette1b").on('click', () =>{
$("#palette1").css('background',currentColor);
});
$("#palette1").on('click', () =>{
currentColor = $("#palette1").css('background-color');
selectedColorBox.css('background',currentColor);
console.log("palette1: "+$("#palette1").css('background'));
});

$("#palette2b").on('click', () =>{
    $("#palette2").css('background',currentColor);
});
$("#palette2").on('click', () =>{
    currentColor = $("#palette2").css('background-color');
    selectedColorBox.css('background',currentColor);
});

$("#palette3b").on('click', () =>{
    $("#palette3").css('background',currentColor);
});
$("#palette3").on('click', () =>{
    currentColor = $("#palette3").css('background-color');
    selectedColorBox.css('background',currentColor);
});

$("#palette4b").on('click', () =>{
    $("#palette4").css('background',currentColor);
});
$("#palette4").on('click', () =>{
    currentColor = $("#palette4").css('background-color');
    selectedColorBox.css('background',currentColor);
});

$("#palette5b").on('click', () =>{
    $("#palette5").css('background',currentColor);
});
$("#palette5").on('click', () =>{
    currentColor = $("#palette5").css('background-color');
    selectedColorBox.css('background',currentColor);
});

$("#palette6b").on('click', () =>{
    $("#palette6").css('background',currentColor);
});
$("#palette6").on('click', () =>{
    currentColor = $("#palette6").css('background-color');
    selectedColorBox.css('background',currentColor);
});

//Music Buttons
$("#pause").on('click', () => {
    audio.pause();
    musicOn = false;
    $('#megaman').attr('src','./img/mega-default.png');

})
$("#play").on('click', () => {
    audio.play();
    musicOn = true;
    $('#megaman').attr('src','./img/megaman.gif');

})
$("#volUp").on('click', () => {
    audio.volume = audio.volume + 0.1;
})
$("#volDown").on('click', () => {
    audio.volume = audio.volume - 0.1;
})
$("#nextTrack").on('click', () => {

    musicOn = true;
    var mega = $('#megaman').attr('src');
    var megaDefault = "./img/mega-default.png";
    var megaDance1 = "./img/megaman.gif";
    var megaDance2 = "./img/mega-dance.gif";
    
    if(mega==megaDance1){
        $('#megaman').attr('src','./img/mega-dance.gif');
    }else if(mega==megaDance2 || mega==megaDefault){
        $('#megaman').attr('src','./img/megaman.gif');
    }

    if(playingSong==playlist[0]){
        playingSong = playlist[1];
        $('#music').attr('src',playlist[1]);
    } else if(playingSong==playlist[1]){
        playingSong = playlist[2];
        $('#music').attr('src',playlist[2]);
    } else if(playingSong==playlist[2]){
        playingSong = playlist[3];
        $('#music').attr('src',playlist[3]);
    } else if(playingSong==playlist[3]){
        playingSong = playlist[0];
        $('#music').attr('src',playlist[0]);
    }
    console.log("Song Changed!")
    console.log("Playing Song: "+playingSong)
});
$("#previousTrack").on('click', () => {

    musicOn = true;
    var mega = $('#megaman').attr('src');
    var megaDefault = "./img/mega-default.png";
    var megaDance1 = "./img/megaman.gif";
    var megaDance2 = "./img/mega-dance.gif";

    if(mega==megaDance1){
    $('#megaman').attr('src','./img/mega-dance.gif');
    }else if(mega==megaDance2 || mega==megaDefault){
    $('#megaman').attr('src','./img/megaman.gif');
    }


    if(playingSong==playlist[0]){
        playingSong = playlist[3];
        $('#music').attr('src',playlist[3]);
    } else if(playingSong==playlist[1]){
        playingSong = playlist[0];
        $('#music').attr('src',playlist[0]);
    } else if(playingSong==playlist[2]){
        playingSong = playlist[1];
        $('#music').attr('src',playlist[1]);
    } else if(playingSong==playlist[3]){
        playingSong = playlist[2];
        $('#music').attr('src',playlist[2]);
    }
    console.log("Song Changed!")
    console.log("Playing Song: "+playingSong)
});

//Tools
$("#erase").on('click', () => {
    // "Erase" paints with the current background colour so squares blend back in
    currentColor = currentBg;
    selectedColorBox.css("background-color", currentBg);
});
$("#colorPicker").on('change', (e)=> {

    selectedColorBox.css("background-color",e.target.value);
    console.log("Color: "+e.target.value);
    currentColor = e.target.value;

    console.log("Current Color: "+currentColor);

});
$("#eraseAll").on('click', () => {
    
    charge.play();

    if(musicOn==true){
        if($("#megaman").attr('src')=="./img/megaman.gif"){

            $("#megaman").attr('src','./img/charge.gif').css({"height":"92px","width": "80px"});

            setTimeout(()=>{
                $("#megaman").attr('src','./img/mega-shoot.png').css({"height":"92px","width": "105px"});
                $(".pixel").css("background",currentBg);
            },2700);

            setTimeout(()=>{
                $("#megaman").attr('src','./img/megaman.gif').css({"height":"92px","width": "77px"});
            },4000);

        }else if($("#megaman").attr('src')=="./img/mega-dance.gif"){

            $("#megaman").attr('src','./img/charge.gif').css({"height":"92px","width": "80px"});

            setTimeout(()=>{
                $("#megaman").attr('src','./img/mega-shoot.png').css({"height":"92px","width": "105px"});
                $(".pixel").css("background",currentBg);
            },2700);

            setTimeout(()=>{
                $("#megaman").attr('src','./img/mega-dance.gif').css({"height":"92px","width": "77px"});
            },4000);

        }
        
    }else if(musicOn==false){
        
        $("#megaman").attr('src','./img/charge.gif').css({"height":"92px","width": "80px"});
        setTimeout(()=>{
            $("#megaman").attr('src','./img/mega-shoot.png').css({"height":"92px","width": "105px"});
            $(".pixel").css("background",currentBg);
        },2700);
        
        setTimeout(()=>{

            $("#megaman").attr('src','./img/mega-default.png').css({"height":"92px","width": "77px"});
        },4000);
    }
    


});
$("#disk").on('click', () => {
    html2canvas(document.querySelector("#capture")).then(canvas => {
        canvas.toBlob((blob) => {
            var link = document.createElement('a');
            link.download = 'pixelator-art.png';
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });

        Swal.fire(
            'Masterpiece Saved!',
            'Your art was downloaded as pixelator-art.png.',
            'success'
          );
    });
});
$("#bgColor").on('change', (e)=> {
    currentBg = e.target.value;
    $(".pixel").css("background-color",e.target.value);
});
$("#gridColor").on('change', (e)=> {

    $(".pixel").css("border-color",e.target.value);

});

$("#hidden-mega").on('click', () => {
oneUp.play();
$('#mega-life').css('display','block');
Swal.fire(
    'Congrats!',
    'You found the hidden MegaMan! you deserve a 1-Up! Check upper left corner. This token is a proof that you found the hidden MegaMan',
    'success'
  );
});

$("#energy").on('click', () => {
    energy.play();
    $('#hidden-mega').css('display','block');
    $('#hidden-text').css('display','block');

});

//Main Screen
$("#startButton").on('click', (e) => {

console.log("Start Button Clicked!");

$(".canvas h3").remove();
$("#startButton").remove();
$("#instructions").remove();

$(".canvas").removeClass("flex");

buildGrid();

});

// Grid dimensions are chosen for the viewport so pixels stay big enough to
// hit with a finger on small screens. Cells are sized with fr units in CSS,
// so the art scales fluidly afterwards (rotating a phone won't wipe it).
function gridSizeForViewport(){
    var w = window.innerWidth;
    if(w >= 900){ return {cols: 58, rows: 38}; }  // the classic desktop grid
    if(w >= 640){ return {cols: 44, rows: 34}; }
    return {cols: 32, rows: 36};
}
function buildGrid(){
    var size = gridSizeForViewport();
    var canvasEl = document.getElementById("pixelCanvas");

    canvasEl.style.setProperty('--cols', size.cols);

    // build in a fragment: one reflow instead of ~2200
    var frag = document.createDocumentFragment();
    for(var i = 0; i < size.cols * size.rows; i++){
        var cell = document.createElement('div');
        cell.className = 'pixel';
        frag.appendChild(cell);
    }
    canvasEl.appendChild(frag);
}
$("#instructions").on('click', (e) =>{

    Swal.fire({
        title: 'Instructions',
        text: 'Create your pixel art masterpiece using tools on the left and right panels of the screen! There is a hidden MegaMan in the screen, try to find him! (No, not the one on the left side :p)',
        confirmButtonText: 'Okay'
      });

    console.log("Instructions Button Clicked!")
})