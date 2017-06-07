/* todo 
frontend:
aggiungi framework ui
seleziona righe e colonne
seleziona celle multiple
sistema incollonamento bootstrap

ui:
heatmap fadein
list of exceptions in green frequency
list of exceptions in red frequency
change file click on name

check a volte salva il copyTo e a volte salta il file
rendere il salva complessivo
hide blocks
*/

currentByte = "-1"; //the selected half-byte
foreColor = "#ffffff";
backColor = "#333333";
returned = 0; //number of files returned from ajax
returned_data = new Array (); //file contents actually returned from ajax
index = -1; //current file

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
    $(".halfByte").click(function() {
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
    
    //Check repeat(s)
    //ToDo: bind hover "click to display heatmap"
    //Other bind hover "green is always, red is never"
    $("#halfStat").bind( "click.hot", function() {
        do_heatmap();
    });
    
    loadAjaxFiles();
    new_style();
    loadAjax("template.json","json");
    colorSliderInit();
    navigation(-1);
    
}

function selectByte(number) {
    //console.log(number);
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
    $(".halfByte").removeClass("selectedByte");
    $("#usr" + currentByte).addClass("selectedByte");
    
    //Show stats
    checkRepeat(number);
    if(number%2==0) { $("#offsetPossibilities").val(1); } else { $("#offsetPossibilities").val(-1); }
    show_possibilites(number);
    
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
    
    $(".halfByte").bind( "click.copy", function(){
        $(this).css({color: fore, backgroundColor: back});
        $("#inputFore").val(fore);
        $("#inputBack").val(back);
        $("#comment").val(note);
        if(!$("#autocopy").prop("checked")) {
            uncopy_style();
        }
    } );
    $("#inputByte").bind( "input.copy", function() { //instead of change cause it need losing focus first
        $("#usr"+$(this).val()).css({color: fore, backgroundColor: back});
        $("#inputFore").val(fore);
        $("#inputBack").val(back);
        $("#comment").val(note);
        if(!$("#autocopy").prop("checked")) {
            uncopy_style();
        }
    });
}

function uncopy_style() {
    $("#btnCopyStyle").text("Copy to...");
    $("#btnCopyStyle").unbind( "click.uncopy" );
    $("#btnCopyStyle").bind( "click.copy", function(){
        copy_style($("#inputFore").val(), $("#inputBack").val(), $("#comment").val());
    });
    
    $(".halfByte").unbind( "click.copy" );
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
                
                //if(files.length == returned) {
                if(returned>0) {
                    navigation(0);
                    selectByte(0);
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
        $("#filename").val( files[value] );
        loadFile(value);
    } else if(value<0) {
        $("#btnFileBack").prop('disabled', true);
        $("#btnFileNext").prop('disabled', true);
    }
}

function loadFile(value) {
    for (var x = 0; x < 2048; x++) {
        if ( returned_data[value][x]==undefined || returned_data[value][x]==null ) {
            $("#usr"+x).val( "" );
        } else {
            $("#usr"+x).val( returned_data[value][x] );
        }
    }
    
    if(value>=1){
        $("#btnFileBack").prop('disabled', false);
    } else {
        $("#btnFileBack").prop('disabled', true);
    }
    if(value<returned-1) {
        $("#btnFileNext").prop('disabled', false);
    } else {
        $("#btnFileNext").prop('disabled', true);
    }
    
    index = value;
}

function getColor(value){
    //value from 0 to 1
    var hue=((value)*120).toString(10); //change to 1-value or value-1 for different themes
    return ["hsl(",hue,",100%,50%)"].join("");
}

function checkRepeat(value) {
    if(value<0) {
        result = new Array();
        //Loop all values (of this file)(heatmap)
        for (var cc=0; cc<2048; cc++) {  
            rec = 0;
            //Loop specified value in all files
            for (var c=0; c<returned; c++) {
                if(returned_data[c][cc]==returned_data[index][cc]) {
                    rec++;
                }
            }
            result[cc]=Math.round(rec/returned*100*10)/10;
            //$("#usr"+cc).css("background-color", "rgb(0,"+Math.round(result[cc]*2.55)+",0)");
            $("#usr"+cc).css("background-color", getColor(Math.round(result[cc])/100 ) );
            
        }
    } else {
        rec = 0;
        //Loop specified value in this files
        for (var c=0; c<returned; c++) {
            if(returned_data[c][value]==returned_data[index][value]) {
                rec++;
            }
        }
        result = Math.round(rec/returned*100*10)/10;
        $("#halfStat").val("Frequency is "+result+"% meaning "+rec+" out of "+returned);
    }
    return result;
}

//Bind/unbind the right handler for the heatmap button
function do_heatmap() {
    checkRepeat(-1);
    $("#halfStat").val("Click again to toggle heatmap");
    $("#halfStat").unbind( "click.hot" ).bind( "click.ice", function() {
        undo_heatmap();
    });
} function undo_heatmap() {
    new_style();
    selectByte(currentByte);
    loadAjax("template.json","json");
    $("#halfStat").unbind( "click.ice" ).bind( "click.hot", function() {
        do_heatmap();
    });
}

//possibilities
function list_possibilities(n,offset) {
    $(".possibilities").remove();
    
    possibilities = new Array();
    cc=0;
    
    for (c=0; c<returned; c++) {
        //if( returned_data[c][n] != theArray[n] ){ (check also the offset)
            if(offset==1) {
                possibilities[cc] = returned_data[c][n] + returned_data[c][n+1];
                cc++;
            } else if(offset==-1) {
                possibilities[cc] = returned_data[c][n-1] + returned_data[c][n];
                cc++;
            } else {
                possibilities[cc] = returned_data[c][n];
                cc++;
            }
        //}
    }
    //delete duplicates
    for (c=0; c<possibilities.length; c++) {
        $("#possibilities").append("<option class='possibilities'>"+possibilities[c]+" into -> "+c+"</option>");
    }
    
    //return result;
}

function show_possibilites() {
    list_possibilities(parseInt(currentByte), parseInt( $("#offsetPossibilities").val() ) );

}