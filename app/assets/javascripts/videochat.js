$(document).on('ready page:load', function(){

  // Compatibility shim
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

     navigator.getUserMedia({audio: true, video: true}, function(stream){
             // Set your video displays
             $('#my-video').prop('src', URL.createObjectURL(stream));

             window.localStream = stream;
},function(){ });


var peer = new Peer({host:"draken-peerjs-server.herokuapp.com",port:'',secure:true,debug:"3",config:{ 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }});


peer.on('open', function(id) {
  $('#yourid').text("Your ID is: " + id);
  $('#conn-status').text("Connected");
  $('#conn-status').css("color","yellowgreen");


  console.log('test : ' + id);
  // pass the peer instance, and it will start sending heartbeats
  var heartbeater = makePeerHeartbeater( peer );
});



// stop them later
// heartbeater.stop();
















peer.on('call',function(call) {
  call.answer(window.localStream);
  call_listen(call);


});

peer.on('disconnected',function(call) {
  $('#yourid').text("Your ID is: " + "error");
  $('#conn-status').text("Disconnected");
  $('#conn-status').css("color","red");
  heartbeater.stop();

});












$( "#connectbutton" ).click(function() {

var destid = $("#inputid").val();
console.log(destid);
var call = peer.call(destid, window.localStream);
call_listen(call);
error_listen(peer,call);

});





});


function call_listen (call) {
call.on('stream',function(stream) {
  $('#their-video').prop('src', URL.createObjectURL(stream));
  var audioContext = new AudioContext();
  var audioStream = audioContext.createMediaStreamSource(stream);
  audioStream.connect(audioContext.destination);
  $('#conn-who').text("A/V Link to: " + call.peer);
});

call.on('close',function(stream) {
  $('#conn-who').text("");
  $('#their-video').prop('src',"");
});

}



function error_listen (peer,call) {
  peer.on('error', function(err) {
    if ( err.type = 'peer-unavailable' ) {  $('#conn-who').text("Failed to Link to: " + call.peer)}

  });

}


function makePeerHeartbeater ( peer ) {
    var timeoutId = 0;
    function heartbeat () {
        timeoutId = setTimeout( heartbeat, 20000 );
        if ( peer.socket._wsOpen() ) {
            peer.socket.send( {type:'HEARTBEAT'} );
        }
    }
    // Start
    heartbeat();
    // return
    return {
        start : function () {
            if ( timeoutId === 0 ) { heartbeat(); }
        },
        stop : function () {
            clearTimeout( timeoutId );
            timeoutId = 0;
        }
    };
}
