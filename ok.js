var express=require('express');
var app=express();

//for sockets
var http=require('http').Server(app);
var io=require('socket.io')(http);
var path=require('path');
var socket=io();

function submitfunction(){
	//alert("d");
  var uniqueid = $('#uniqueid').val();
  if(uniqueid!= '') {
  socket.emit('useradded', uniqueid);
}
$('#uniqueid').val('').focus();
  return false;
}

socket.on('useradded', function(uniqueid){
  var me = $('#uniqueid').val();
  $('#tt').append('<tr><td>'+me+'<td></tr>');
});