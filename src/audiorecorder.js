var AudioRecorder = (function(){
	/**
	 * transforms arguments, by changing `function` arguments into Wami's named callback
	 */
	var transformWamiArguments = function() {
		var args = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (typeof arg === 'function') {
				args.push(Wami.nameCallback(arg));
			} else {
				args.push(arg);
			}
		};

		return args;
	};

	/**
	 * Lib to help the recording of user's microphone.
	 * Remember! You have to use AudioRecorder.setWamiPath() first.
	 *
	 * @param {string}       url        We'll send audio data to this URL
	 * @param {HTMLElement}  el         HTML element where the SWF of WAMI will be placed
	 * @param {string}       [url]      URL to the current audio file
	 * @param {object}       [options]  additional options passed to Wami.setup()
	 * @uses WAMI http://code.google.com/p/wami-recorder/
	 */
	function AudioRecorder(captureUrl, el, soundUrl, options) {
		this.captureUrl = captureUrl;
		if (soundUrl) {
			this.soundUrl = soundUrl;
		};
		audioRecorderId = 'audiorecorder-' + (AudioRecorder.uid++);

		wamiOptions = $.extend({
			id: audioRecorderId, 
			swfUrl: AudioRecorder.wamiPath + "/Wami.swf"
		}, options);

		// Recreate flash container.
		$(el).find('#'+audioRecorderId).remove();
		$(el).append('<div class="audiorecorder-object" id="'+ audioRecorderId +'"></div>');

		$.ajax({
			url: AudioRecorder.wamiPath + '/recorder.js',
			dataType: 'script',
			cache: true
		}).done(function() {
			Wami.setup(wamiOptions);
		});
	}

	AudioRecorder.uid = 1;

	/**
	 * Set path of WAMI directory containing recorder.js and Wami.swf.
	 * (without trailing slash)
	 */
	AudioRecorder.setWamiPath = function(wamiPath) {
		AudioRecorder.wamiPath = wamiPath;
	};

	/**
	 * Start to capture the audio.
	 */
	AudioRecorder.prototype.start = function(onStart, onFinish, onFailure) {
		var args = [this.captureUrl];
		args = args.concat(transformWamiArguments.apply(this, arguments));

		Wami.startRecording.apply(this, args);
	};

	/**
	 * Stop the capture of the audio.
	 */
	AudioRecorder.prototype.stop = function() {
		Wami.stopRecording();
		Wami.stopPlaying();
	};

	/**
	 * Play the audio sent to the server. Server must serve the Wav file
	 */
	AudioRecorder.prototype.play = function(onStart, onFinish, onFailure) {
		var args = [this.soundUrl];
		args = args.concat(transformWamiArguments.apply(this, arguments));

		Wami.startPlaying.apply(this, args);
	};

	/**
	 * Stop the audio preview
	 */
	AudioRecorder.prototype.pause = function() {
		Wami.stopPlaying();
	};

	return AudioRecorder;
})();
