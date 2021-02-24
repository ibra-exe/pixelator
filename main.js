
var currentColor = "#000";

var selectedColorBox = $("#selectedColor");
var capture = $("#save").getContext;

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
audio.play();

var charge = document.getElementById("charge");
charge.volume = 0.7;

var oneUp = document.getElementById("oneUp");
var energy = document.getElementById("energyAudio");

$(document).ready(function(){
    playingSong = playlist[0];
    console.log("Playing Song: "+playingSong);
    $("#selectedColor").css('background','black')
});

//Coloring
$("#pixelCanvas").on('click', (e)=> {
    
    console.log("confirmation");
    $(e.target).css(`background`,`${currentColor}`);
    console.log(e);
})
//Palette
$("#palette1b").on('click', () =>{
$("#palette1").css('background',currentColor);
});
$("#palette1").on('click', () =>{
currentColor = $("#palette1").css('background');
selectedColorBox.css('background',currentColor);
console.log("palette1: "+$("#palette1").css('background'));
});

$("#palette2b").on('click', () =>{
    $("#palette2").css('background',currentColor);
});
$("#palette2").on('click', () =>{
    currentColor = $("#palette2").css('background');
    selectedColorBox.css('background',currentColor);
});

$("#palette3b").on('click', () =>{
    $("#palette3").css('background',currentColor);
});
$("#palette3").on('click', () =>{
    currentColor = $("#palette3").css('background');
    selectedColorBox.css('background',currentColor);
});

$("#palette4b").on('click', () =>{
    $("#palette4").css('background',currentColor);
});
$("#palette4").on('click', () =>{
    currentColor = $("#palette4").css('background');
    selectedColorBox.css('background',currentColor);
});

$("#palette5b").on('click', () =>{
    $("#palette5").css('background',currentColor);
});
$("#palette5").on('click', () =>{
    currentColor = $("#palette5").css('background');
    selectedColorBox.css('background',currentColor);
});

$("#palette6b").on('click', () =>{
    $("#palette6").css('background',currentColor);
});
$("#palette6").on('click', () =>{
    currentColor = $("#palette6").css('background');
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

    console.log("selected color: "+selectedColorBox.css("background-color"));
    $("#colorPicker").value = '#ffff';
    selectedColorBox.css("background-color","white");
    currentColor = "#ffffff"
    console.log("Current Color: "+currentColor);
    console.log("color cleared!");

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
                $(".pixel").css("background","white");
            },2700);

            setTimeout(()=>{
                $("#megaman").attr('src','./img/megaman.gif').css({"height":"92px","width": "77px"});
            },4000);

        }else if($("#megaman").attr('src')=="./img/mega-dance.gif"){

            $("#megaman").attr('src','./img/charge.gif').css({"height":"92px","width": "80px"});

            setTimeout(()=>{
                $("#megaman").attr('src','./img/mega-shoot.png').css({"height":"92px","width": "105px"});
                $(".pixel").css("background","white");
            },2700);

            setTimeout(()=>{
                $("#megaman").attr('src','./img/mega-dance.gif').css({"height":"92px","width": "77px"});
            },4000);

        }
        
    }else if(musicOn==false){
        
        $("#megaman").attr('src','./img/charge.gif').css({"height":"92px","width": "80px"});
        setTimeout(()=>{
            $("#megaman").attr('src','./img/mega-shoot.png').css({"height":"92px","width": "105px"});
            $(".pixel").css("background","white");
        },2700);
        
        setTimeout(()=>{

            $("#megaman").attr('src','./img/mega-default.png').css({"height":"92px","width": "77px"});
        },4000);
    }
    


});
$("#disk").on('click', () => {
    html2canvas(document.querySelector("#capture")).then(canvas => {
        document.body.appendChild(canvas);
        $("canvas").attr('id','render');
        console.log(canvas);
    });

    $("#cleanUp").css('display','block');
    $("#cleanUpText").css('display','block');

    Swal.fire(
        'Image Rendered!',
        'Your image was rendered below. Scroll down then press \'Right Click > Save Image As\' to save your art.',
        'success'
      );
});
$("#cleanUp").on('click', () => {
    $("#render").remove();
    $("#cleanUp").css('display','none');
    $("#cleanUpText").css('display','none');
});
$("#bgColor").on('change', (e)=> {

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
$("#pixelCanvas").addClass("flexWrap");

for(var i=0; i<=2203; i++){
$("#pixelCanvas").append(`<div class="pixel"></div>`);
}

});
$("#instructions").on('click', (e) =>{

    Swal.fire({
        title: 'Instructions',
        text: 'Create your pixel art masterpiece using tools on the left and right panels of the screen! There is a hidden MegaMan in the screen, try to find him! (No, not the one on the left side :p)',
        confirmButtonText: 'Okay'
      });

    console.log("Instructions Button Clicked!")
})