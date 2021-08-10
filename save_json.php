<?php
$phpFile = "answers.json";
$fh = fopen($phpFile, 'w') or die("can't open file");
$stringData = $_GET["data"];
fwrite($fh, $stringData);
fclose($fh)
?>
