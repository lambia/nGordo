currentByte = "-1";
conta = 0;
foreColor = "#ffffff";
backColor = "#333333";
returned = 0;
returned_data = new Array ();
index = -1;

$(function() {
    GUInit();
});

function GUInit() {
    //When interacting with the number, show the focused cell
    $("#inputByte").change(function() {
        selectByte( $("#inputByte").val() );
    }).click(function() {
        selectByte( $("#inputByte").val() );
    });
    
    //When focusing a cell, update the number
    $(".singleByte").click(function() {
        selectByte( $(this).attr('id').replace(/[^0-9]/g, '') );
    });
    
    $("#btnSaveStyle").click(function() {
        save_style(currentByte, $("#inputFore").val(), $("#inputBack").val(), $("#comment").val());
    });
    $("#btnCopyStyle").bind( "click.copy", function(){
        copy_style($("#inputFore").val(), $("#inputBack").val(), $("#comment").val());
    });
    
    //Back/Next Buttons
    $("#btnFileNext").click(function() {
        navigation(index+1);
    });
    $("#btnFileBack").click(function() {
        navigation(index-1);
    });
    
    loadAjaxFiles();
    new_style();
    loadAjax("template.json","json");
    colorSliderInit();
    navigation(-1);
}

function selectByte(number) {
    console.log(number);
    fore = $("#inputFore").val();
    back = $("#inputBack").val();
    note = $("#comment").val();
    
    if(currentByte>-1){
        if((theArray[currentByte]["fore"] != fore) || (theArray[currentByte]["back"] != back) || (theArray[currentByte]["note"] != note))
        {
            if($("#autosave").prop('checked') || confirm('Save the last options?'))
            {
                save_style(currentByte, fore, back, note);
            } else {
                default_byte(currentByte);
            }
        }

    }
    
    //Update the navigator
    currentByte = number;
    $("#inputByte").val(currentByte);
    
    //Highlight a byte
    $(".singleByte").removeClass("selectedByte");
    $("#usr" + currentByte).addClass("selectedByte");
    
    //Load colors and note
    if(theArray[currentByte]['fore'].length<4) { theArray[currentByte]['fore']=foreColor; }
    if(theArray[currentByte]['back'].length<4) { theArray[currentByte]['back']=backColor; }
    $("#inputFore").val(theArray[currentByte]['fore']).colorpicker('enable');
    $("#inputBack").val(theArray[currentByte]['back']).colorpicker('enable');
    $("#comment").val(theArray[currentByte]['note']);
}

function new_style() {
    theArray = new Array ();
    for (var c = 0; c < 2048; c++) {
      theArray[c] = {fore: foreColor, back: backColor, note: ""};
    }
}

function default_byte(number) {
    $("#usr"+number).css({color: foreColor, backgroundColor: backColor});
}

function copy_style(fore, back, note) {
    $("#btnCopyStyle").text("End Copy");
    $("#btnCopyStyle").unbind( "click.copy" );
    $("#btnCopyStyle").bind( "click.uncopy", function(){ uncopy_style(); } );
    
    $(".singleByte").bind( "click.copy", function(){
        $(this).css({color: fore, backgroundColor: back});
        $("#inputFore").val(fore);
        $("#inputBack").val(back);
        $("#comment").val(note);
        //$(".singleByte").unbind( "click.copy" );
    } );
    $("#inputByte").bind( "input.copy", function() { //instead of change cause it need losing focus first
        $("#usr"+$(this).val()).css({color: fore, backgroundColor: back});
        $("#inputFore").val(fore);
        $("#inputBack").val(back);
        $("#comment").val(note);
        //$(".inputByte").unbind( "change.copy" );
    });
}

function uncopy_style() {
    $("#btnCopyStyle").text("Copy to...");
    $("#btnCopyStyle").unbind( "click.uncopy" );
    $("#btnCopyStyle").bind( "click.copy", function(){
        copy_style($("#inputFore").val(), $("#inputBack").val(), $("#comment").val());
    });
    
    $(".singleByte").unbind( "click.copy" );
    $("#inputByte").unbind( "input.copy" );
}

//for speeding up the debug (or change) of colorpicker, using manual save
function save_style(id, fore, back, note) {
    if(id>-1){
        if(theArray[id]["fore"] != fore || theArray[id]["back"] != back || theArray[id]["note"] != note) {
                theArray[id]["fore"] = fore;
                theArray[id]["back"] = back;
                theArray[id]["note"] = note;

                saveAjax("saveStyle", JSON.stringify(theArray));
                //JSON2.js needed for IE8 compatibility, but we don't want it, right?
        }
    }
}

function apply_style() {
    for (var c = 0; c < 2048; c++) {
        if(currentByte>-1) {
            if(theArray[currentByte]['back'].length<4) { theArray[currentByte]['back']=backColor; }
            if(theArray[currentByte]['fore'].length<4) { theArray[currentByte]['fore']=foreColor; }
        }
        
        $("#usr"+c).css({color: theArray[c]['fore'], backgroundColor: theArray[c]['back']});
    }
}

function saveAjax(actionName, actionValue) {
      $.ajax({
           type: "POST",
           url: 'ajax.php',
           data:{ action: actionName,
                 value: actionValue},
           success:function(html) {
                //alert(html);
           }
      });
}

//use getJSON instead, for the JSON array
function loadAjax(what, how) {
    $.ajax({ 
        type: 'GET', 
        url: 'ajax.php', 
        data: { get_param: 'value',
               filename: what,
               how: how
              }, 
        success: function (data) { 
            if(how=="json") {
                theArray = JSON.parse(data);
                apply_style();
            } else if(how=="hex") {
                //console.log(returned);
                returned_data[returned] = data;
                returned++;
                if(files.length == returned) {
                   navigation(0);
               }
            }
        }
    });
}

function loadAjaxFiles() {
    $.ajax({
        type: 'GET', 
        url: 'ajax.php', 
        data: { get_param: 'value',
               list: "mfd"
              }, 
        success: function (data) {
            //files = JSON.parse(data);
            //console.log(data);
            files = JSON.parse(data);
            c = 0;
            if(files) {
                while(c < files.length) {
                    loadAjax(files[c], "hex");
                    c++;
                }
            }
        }
    });
}

function colorSliderInit(e) {
    //Do it twice, start disabled, update the byte cell "after" change
    $('#inputFore').colorpicker({}).on('changeColor', function(e) {
        $("#usr"+currentByte).css("color", $(this).val());
    }).colorpicker('disable');
    
    $('#inputBack').colorpicker({}).on('changeColor', function(e) {
        $("#usr"+currentByte).css("background-color", $(this).val());
    }).colorpicker('disable');   
}

function navigation(value) {
    if(value>=0) {
        $("#fileIndex").text(value);
        loadFile(value);
    } else if(value<0) {
        $("#btnFileBack").prop('disabled', true);
        $("#btnFileNext").prop('disabled', true);
    }
}

function loadFile(value) {
    for (var x = 0; x < returned_data[value].length; x++) {
        $("#usr"+x).val( returned_data[value][x]+returned_data[value][x+1] );
    }
    
    if(value>0){
        $("#btnFileBack").prop('disabled', false);
    } else {
        $("#btnFileBack").prop('disabled', true);
    }
    if(value<returned) {
        $("#btnFileNext").prop('disabled', false);
    } else {
        $("#btnFileNext").prop('disabled', true);
    }
    
    index = value;
}