<?php
ini_set('memory_limit', '4M');

$name = "nGordo";
$version = "0.0.1";
$template = "template.txt";
$directory = "files";
$test_file = "jack.mfd";
$buffer = "";
$thearray = array();

function open_file() {
    global  $directory, $test_file, $buffer;
    //global $thearray;
    $handle = fopen($directory."/".$test_file, "r") or die("Unable to open file!");
    if ($handle) {
        while (!feof($handle)) {
            $buffer = $buffer . bin2hex(fread($handle,4));
        }
        fclose($handle);
    }
        /*
        $hex = unpack("H*", file_get_contents($filename));
        $hex = current($hex);
        and to convert a hexdump back to source:

        $chars = pack("H*", $hex);
        */
}

//Init style array: create array with 1024 elements, each one with 3 values: fore, back and note
/*
function new_style() {
    global $thearray;
    for ($c = 0; $c < 1024; $c++) {
        $thearray[] = array("fore"=>null,"back"=>null,"note"=>null);
    }
}

//Update style array: update the $id row with given variables, if exist
function update_style($id, $fore, $back, $note) {
    global $thearray;
    if (isset($fore)) { $thearray[$id]["fore"] = $fore; }
    if (isset($back)) { $thearray[$id]["back"] = $back; }
    if (isset($note)) { $thearray[$id]["note"] = $note; }
}
*/

function save_style($what,$where) {
    //global $thearray;
    //file_put_contents($where,json_encode($thearray));
    file_put_contents($where,$what);
}

function load_style($from) {
    //global $thearray;
    //$result = json_decode(file_get_contents($from), true); // === ?
    //if(isset($result)) { $thearray = $result; return true; };
    $result = file_get_contents($from);
    if(!isset($result)) { $result = null; }
    return $result;
}

function load_hex($from) {
    global $directory;
    $handle = fopen($from, "r") or die("Unable to open file!");
    $buffer = null;
    if ($handle) {
        while (!feof($handle)) {
            $buffer = $buffer . bin2hex(fread($handle,4));
        }
        fclose($handle);
    }
    return $buffer;
}

?>