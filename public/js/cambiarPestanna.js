



function cambiarPestanna(pestannas,pestanna) {
    

    pestanna = document.getElementById(pestanna.id);
    listaPestannas = document.getElementById(pestannas.id);
    

    cpestanna = document.getElementById('c'+pestanna.id);
    listacPestannas = document.getElementById('contenido'+pestannas.id);
    
    i=0;
 
    while (typeof listacPestannas.getElementsByTagName('div')[i] != 'undefined'){
        $(document).ready(function(){
            $(listacPestannas.getElementsByTagName('div')[i]).css('display','none');
            $(listaPestannas.getElementsByTagName('li')[i]).css('background','');
            $(listaPestannas.getElementsByTagName('li')[i]).css('padding-bottom','');
        });
        i += 1;
    }
 
    $(document).ready(function(){

        $(cpestanna).css('display','');
        $(pestanna).css('background','dimgray');
        $(pestanna).css('padding-bottom','2px'); 
    });
 
}
