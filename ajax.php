<?php
require('core.php');

if(isset($_POST['action']) && $_POST['action'] == 'saveStyle') {
    save_style($_POST['value'],"template.json");
} else {
    echo load_style("template.json");
}

?>