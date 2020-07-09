//
// Copyright 2015, Evothings AB
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

$(document).ready(function() {

	$('#connectButton').click(function() {
		app.connect()
	})

	$('#disconnectButton').click(function() {
		app.disconnect()
	})

	$('#led').click(function(){
		app.led()
	})	
	$('#fan').click(function(){
		app.fan()
	})	
	$('#tv').click(function(){
		app.tv()
	})	
})

var app = {}

app.PORT = 5555
app.socketId

app.connect = function() {

	var IPAddress = $('#IPAddress').val()

	console.log('Trying to connect to ' + IPAddress)

	$('#startView').hide()
	$('#connectingStatus').text('Connecting to ' + IPAddress)
	$('#connectingView').show()

	chrome.sockets.tcp.create(function(createInfo) {

		app.socketId = createInfo.socketId

		chrome.sockets.tcp.connect(
			app.socketId,
			IPAddress,
			app.PORT,
			connectedCallback)
	})

	function connectedCallback(result) {
	
		if (result === 0) {

			 console.log('Connected to ' + IPAddress)
					 
			 $('#connectingView').hide()
			 $('#controlView').show()
			
		}
		else {

			var errorMessage = 'Failed to connect to ' + app.IPAdress
			console.log(errorMessage)
			navigator.notification.alert(errorMessage, function() {})
			$('#connectingView').hide()
			$('#startView').show()
		}
	}
}

app.sendString = function(sendString) {

	console.log('Trying to send:' + sendString)	

	chrome.sockets.tcp.send (
		app.socketId,
		app.stringToBuffer(sendString),
		function(sendInfo) {

			if (sendInfo.resultCode < 0) {

				var errorMessage = 'Failed to send data'

				console.log(errorMessage)
				navigator.notification.alert(errorMessage, function() {})
			}
		}
	)
}

app.led = function() {

	var sta = $('#led').val();
	if(sta == "ON"){
		$('#led').val("OFF");
		$('#led').text("LED OFF");
		app.sendString('LEDON')
	}//If
	else{
		$('#led').val("ON");
		$('#led').text("LED ON");
		app.sendString('LEDOFF')
		
	}//else	
	$('#led').toggleClass("button2");
}//LED Function

app.fan = function() {

	var sta = $('#fan').val();
	if(sta == "ON"){
		$('#fan').val("OFF");
		$('#fan').text("FAN OFF");
		app.sendString('FANON')
	}//If
	else{
		$('#fan').val("ON");
		$('#fan').text("FAN ON");
		app.sendString('FANOFF')
		
	}//else	
	$('#fan').toggleClass("button2");

}//Fan Function

app.tv = function() {

	var sta = $('#tv').val();
	if(sta == "ON"){
		$('#tv').val("OFF");
		$('#tv').text("TV OFF");
		app.sendString('TVON')
	}//If
	else{
		$('#tv').val("ON");
		$('#tv').text("TV ON");
		app.sendString('TVOFF')
		
	}//else	
	$('#tv').toggleClass("button2");
}//TV Function

app.disconnect = function() {

	chrome.sockets.tcp.close(app.socketId, function() {
		console.log('TCP Socket close finished.')
	})

	$('#controlView').hide()
	$('#startView').show()
}

// Helper functions. 

app.stringToBuffer = function(string) {

	var buffer = new ArrayBuffer(string.length)
	var bufferView = new Uint8Array(buffer)
	
	for (var i = 0; i < string.length; ++i) {

		bufferView[i] = string.charCodeAt(i)
	}

	return buffer
}

app.bufferToString = function(buffer) {

	return String.fromCharCode.apply(null, new Uint8Array(buffer))
}

