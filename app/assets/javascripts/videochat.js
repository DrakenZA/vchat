$(document).on('ready page:load', function(){

  // Compatibility shim
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

     navigator.getUserMedia({audio: true, video: true}, function(stream){
             // Set your video displays
             $('#my-video').prop('src', URL.createObjectURL(stream));

             window.localStream = stream;
},function(){ });


var peer = new Peer({host:"draken-peerjs-server.herokuapp.com",port:'',secure:true,debug:"3"});


peer.on('open', function(id) {
  $('#yourid').text("Your ID is: " + id);

  console.log('test : ' + id);
  // pass the peer instance, and it will start sending heartbeats
  var heartbeater = makePeerHeartbeater( peer );
});



// stop them later
// heartbeater.stop();
















peer.on('call',function(call) {
  call.answer(window.localStream);
  step3(call);


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
