AudioRecorder
================

AudioRecorder is a javascript that encapsulates the Wami-recorder lib (http://code.google.com/p/wami-recorder/).

Wami uses a flash implementation that captures audio from user's microphone and send the audio data to the server.

Saving POST data
================

AudioRecorder calls the Wami API functions to start the audio capture. When the capture is stoped, Wami will send a POST request to the server. In this request, the audiodata is sent as the POST body, as in this example below:
<pre>
POST /writeAudio.php HTTP/1.0
Host: localhost
Content-Length:36908
Content-Type:audio/x-wav

{audio data will go here, as binary string}
</pre>

Preview audio
================

When you call the AudioRecorder.play() method, Wami sends a GET request to the same URL where it sends the audio data above. This request must be responded with the last Wav file that Wami sent. So to not conflict users' captured audio, it is recommended to save the audio using the user's Session ID. This way you will be able to differ which file is from which user.


