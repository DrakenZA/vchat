$(document).on('ready page:load', function(){

  // Compatibility shim
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

     navigator.getUserMedia({audio: true, video: true}, function(stream){
             // Set your video displays
             $('#my-video').prop('src', URL.createObjectURL(stream));

             window.localStream = stream;
},function(){ });


var peer = new Peer({host:"draken-peerjs-server.herokuapp.com",port:"",secure:true,debug:"3"});


peer.on('open', function(id) {
  $('#yourid').text("Your ID is: " + id);

  console.log('test : ' + id);
});




peer.on('call',function(call) {
  call.answer(window.localStream);
  step3(call);


});
peer.on('disconnected',function(call) {

peer.reconnect();
});









$( "#connectbutton" ).click(function() {

var destid = $("#inputid").val();
console.log(destid);
var call = peer.call(destid, window.localStream);
step3(call);

});





});


function step3 (call) {
call.on('stream',function(stream) {
  $('#their-video').prop('src', URL.createObjectURL(stream));
  var audioContext = new AudioContext();
  var audioStream = audioContext.createMediaStreamSource(stream);
  audioStream.connect(audioContext.destination);
});
}
