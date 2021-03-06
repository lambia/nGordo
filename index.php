<?php
require('core.php');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
    <title><?=$name?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> -->
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> -->
    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
    <link rel="stylesheet" href="system/bootstrap-337/css/bootstrap.min.css">
    <link rel="stylesheet" href="core/stile.css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat|Open+Sans|Roboto" rel="stylesheet">
    <script src="system/jquery-3.2.1.min.js"></script>
    <script src="system/bootstrap-337/js/bootstrap.min.js"></script>
    <script src="core/main.js"></script>
    <script src="core/bootstrap-colorpicker-master/js/bootstrap-colorpicker.min.js"></script>
    <link rel="stylesheet" href="core/bootstrap-colorpicker-master/css/bootstrap-colorpicker.min.css">
</head>

<body>
    <div id="divSx" class="col-xs-8">
        <form name="showfile_form" id='showfile_form' class="form-inline">
            <?php
                for ($c = 0; $c < 64; $c++) {
                    echo '<div class="row" id="row_'.$c.'">';
                    for ($cc = 0; $cc < 32; $cc++) {
                        echo '<input type="text" class="form-control halfByte" id="usr'.(($c*32)+$cc).'" maxlength="2" size="2" />'; //value="'.$buffer[(($c*32)+$cc)].'">';
                    }
                    echo '</div>';
                }
            ?>
        </form>
    </div>
    <div id="divDx" class="col-xs-4">
       <div class="affix">
        <row class="col-xs-12">
        <row class="col-xs-6">
            <br/>
            <input type="text" id="filename" name="filename" value="filename.ext" class="form-control" disabled />
            <!-- <select id="filename" name="filename" value="filename.ext" class="form-control"></select> -->
        </row>
        <row class="col-xs-6">
            <br/>
            <button id="btnFileBack" type="button" class="btn btn-primary">&lt;&lt;</button>
            &nbsp;<span id="fileIndex">X</span>/<?php echo count(glob('files/*.mfd'))-1; ?>&nbsp;
            <button id="btnFileNext" type="button" class="btn btn-primary">&gt;&gt;</button>
        </row>
       </row>
        <row class="col-xs-12">
        <row class="col-xs-4">
            <br/>
            <label for="inputByte">Half-byte:</label>
            <input id="inputByte" type="number" value="0" class="form-control" min="0" max="2047" />
            <!-- convert to hex -->
        </row>
        <row class="col-xs-4">
            <br/>
        <div id="colorPickerFore" class="input-group colorpicker-component">
            <label for="inputFore">Foreground:</label>
            <input id="inputFore" type="text" value="#FFFFFF" class="form-control" />
        </div>
        </row>
        <row class="col-xs-4">
            <br/>
        <div id="colorPickerBack" class="input-group colorpicker-component">
            <label for="inputBack">Background:</label>
            <input id="inputBack" type="text" value="#333333" class="form-control" />
        </div>
        </row>
       </row>
        <row class="col-xs-12">
            <br/>
        <div class="form-group">
          <label for="comment">Note:</label>
          <textarea class="form-control" rows="3" id="comment"></textarea>
        </div>
        </row>
        <row class="col-xs-6">
            <button id="btnSaveStyle" type="button" class="btn btn-primary">Save</button> <!-- btn-success -->
            <br/>
            <input type="checkbox" name="autosave" id="autosave" checked />&nbsp;Auto-save on cell-change
            <br/>
            <br/>
        </row>
        <row class="col-xs-6">
            <button id="btnCopyStyle" type="button" class="btn btn-primary">Copy to...</button> <!-- btn-success -->
            <br/>
            <input type="checkbox" name="autocopy" id="autocopy" checked />&nbsp;Continuously copy
            <br/>
            <br/>
        </row>
        <row class="col-xs-12">
            <input id="halfStat" name="halfStat" type="text" class="form-control" />
           <br/>
        </row>
        <row class="col-xs-12">
            <row class="col-xs-4">
                <input type="number" name="offsetPossibilities" id="offsetPossibilities" class="form-control" value="0" />
            </row>
            <row class="col-xs-8">
                <select id="possibilities" name="possibilities" class="form-control"><option value="-1">Other possible values</option></select>
            </row>
        </row>
    </div>
    </div>
</body>
</html>
