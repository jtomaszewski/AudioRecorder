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
		}

		return args;
	};

	/**
	 * Lib to help the recording of user's microphone.
	 * Remember! You have to call `AudioRecorder.init(path, options)` first.
	 *
	 * @param {string}       url        We'll send audio data to this URL
	 * @param {string}       [url]      URL to the current audio file
	 * @uses WAMI http://code.google.com/p/wami-recorder/
	 */
	function AudioRecorder(captureUrl, soundUrl) {
		this.captureUrl = captureUrl;
		if (soundUrl) {
			this.soundUrl = soundUrl;
		}
	}

	var WamiScriptLoadPromise;
	var loadWami = function(wamiPath, options) {
		if (typeof Wami !== 'undefined') {
			Wami.setup(options);
		} else if (WamiScriptLoadPromise) {
			WamiScriptLoadPromise.done(function(){
				Wami.setup(options);
			});
		} else {
			// Wami Recorder Lib has bug in implementation of onReady,
			// so we have to use our custom promise.
			var onReadyCb = options.onReady || function(){};
			WamiScriptLoadPromise = $.Deferred().done(function(){
				onReadyCb();
			});
			options.onReady = function(){
				WamiScriptLoadPromise.resolve();
			};

			$.ajax({
				url: wamiPath + '/recorder.js',
				dataType: 'script',
				cache: true
			}).done(function() {
				Wami.setup(options);
			});
		}
	};

	AudioRecorder.init = function(wamiPath, options) {
		options = $.extend({
			id: 'audiorecorder-container', 
			swfUrl: wamiPath + "/Wami.swf"
		}, options);

		var $object = $('#' + options.id);
		if (!$object.length) {
			AudioRecorder.destroy();
			$object = $('<div id="audiorecorder-container"></div>').prependTo('body');
		}

		loadWami(wamiPath, options);
	};

	AudioRecorder.destroy = function() {
		// Force Wami to recreate it's embed SWF
		if (typeof Wami !== 'undefined') {
			Wami.startRecording = null;
		}
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
