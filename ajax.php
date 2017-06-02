<?php
require('core.php');

if(isset($_POST['action']) && $_POST['action'] == 'saveStyle') {
    save_style($_POST['value'],"template.json");
} else if(isset($_GET['filename']) && isset($_GET['how'])) {
    if ( $_GET['how']=="hex" ) {
        echo load_hex( $_GET['filename'] );
    } else if ( $_GET['how']=="json" ) {
        echo load_style( $_GET['filename'] );
    }
} else if( isset($_GET['list']) ) {
    global $directory;
    echo json_encode( glob($directory.'/*.'.$_GET['list']));
}

?>