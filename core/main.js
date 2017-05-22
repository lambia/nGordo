currentByte = "-1";
conta = 0;
foreColor = "#ffffff";
backColor = "#333333";

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
    $("#btnCopyStyle").click(function() {
        copy_style($("#inputFore").val(), $("#inputBack").val(), $("#comment").val());
    });
    
    new_style();
    loadAjax();
    colorSliderInit();
}

function selectByte(number) {
    fore = $("#inputFore").val();
    back = $("#inputBack").val();
    note = $("#comment").val();
    
    if(currentByte>-1){
        if((theArray[currentByte]["fore"] != fore) || (theArray[currentByte]["back"] != back) || (theArray[currentByte]["note"] != note))
        {
            if(confirm('Save the last options?'))
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
    theArray = new Array (1024);
    for (var c = 0; c < 1024; c++) {
      theArray[c] = {fore: foreColor, back: backColor, note: ""};
    }
}

function default_byte(number) {
    $("#usr"+number).css({color: foreColor, backgroundColor: backColor});
}

function copy_style(fore, back, note) {
    $(".singleByte").bind( "click.copy", function(){
        $(this).css({color: fore, backgroundColor: back});
        $("#inputFore").val(fore);
        $("#inputBack").val(back);
        $("#comment").val(note);
        //$(".singleByte").unbind( "click.copy" );
    } );
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
    for (var c = 0; c < 1024; c++) {
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
           data:{action:actionName,value: actionValue},
           success:function(html) {
                //alert(html);
           }
      });
}

function loadAjax() {
    $.ajax({ 
        type: 'GET', 
        url: 'ajax.php', 
        data: { get_param: 'value' }, 
        success: function (data) { 
            theArray = JSON.parse(data);
            apply_style();
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