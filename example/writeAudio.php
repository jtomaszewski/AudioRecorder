<?php // grava_audio.php
session_start();
$session_id = session_id();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	parse_str($_SERVER['QUERY_STRING'], $params);
	$name = "/tmp/{$session_id}.wav";
	$content = file_get_contents('php://input');
	$fh = fopen($name, 'w') or die("can't open file");
	fwrite($fh, $content);
	fclose($fh);
} else {
	readfile("/tmp/{$session_id}.wav");
}
