// ==UserScript==
// @name         OGame Redesign: Remaining Time Store
// @namespace    remaining_time_store
// @version      1.0.0
// @description  Displays remaining time to fill each store (metal, crystal, deuterium).
// @author       JBWKZ2099
// @homepageURL  https://github.com/JBWKZ2099/ogame-warehouse-remaining-time
// @updateURL    https://raw.githubusercontent.com/JBWKZ2099/ogame-warehouse-remaining-time/master/dist/user.remaining_fields.js
// @downloadURL  https://raw.githubusercontent.com/JBWKZ2099/ogame-warehouse-remaining-time/master/dist/user.remaining_fields.js
// @supportURL   https://github.com/JBWKZ2099/ogame-warehouse-remaining-time/issues
// @match        *://*.ogame.gameforge.com/game/*
// ==/UserScript==

(function() {
    'use strict';

    var theHref = location.href,
        lang = theHref.split(".ogame.gameforge")[0].split("://")[1].split("-")[1],
        uni = theHref.split(".ogame.gameforge")[0].split("://")[1].split("-")[0],
        _localstorage_varname = `__LS_${uni}_${lang}_remainingtTime`,
        player_id = $(`meta[name="ogame-player-id"]`).attr("content"),
        _LS_val = {};
    // localStorage.removeItem(_localstorage_varname);

    var settings = null;

    if( localStorage.getItem(_localstorage_varname) )
        settings = JSON.parse(localStorage.getItem(_localstorage_varname));

    if( settings===undefined || settings==null || settings=="" ) {
        var conf = {};
        settings = {};

        conf["position"] = "0";
        conf["trafficlights"] = true;
        conf["custom_color1"] = "null";
        conf["custom_color2"] = "null";
        conf["custom_color3"] = "null";

        settings["config"] = JSON.stringify(conf);

        localStorage.setItem(_localstorage_varname, JSON.stringify(settings));
    }

    getInfo("metal");
    getInfo("crystal");
    getInfo("deuterium");

    $("html head").append(`
        <style class="wrt_styles">
            .simulate-button { cursor: pointer; }
            #wrt_window {
                float: left;
                position: relative;
                width: 670px;
                overflow: visible;
                z-index: 2;
            }
            #wrt_header {
                height: 28px;
                position: relative;
                background: url("http://gf1.geo.gfsrv.net/cdn63/10e31cd5234445e4084558ea3506ea.gif") no-repeat scroll 0px 0px transparent;
            }
            #wrt_header h4 {
                height: 28px;
                line-height: 28px;
                text-align: center;
                color: #6F9FC8;
                font-size: 12px;
                font-weight: bold;
                position: absolute;
                top: 0;
                left: 100px;
                right: 100px;
            }
            #wrt_config_but {
                display: block;
                height: 16px;
                width: 16px;
                background: url("http://gf3.geo.gfsrv.net/cdne7/1f57d944fff38ee51d49c027f574ef.gif");
                float: right;
                margin: 8px 0 0 0;
                opacity: 0.5;
            }
            #wrt_main {
                padding: 15px 25px 0 25px;
                background: url("http://gf1.geo.gfsrv.net/cdn9e/4f73643e86a952be4aed7fdd61805a.gif") repeat-y scroll 5px 0px transparent;
            }
            #wrt_window.dinamic-jbwkz2099 table {
                border: 1px solid #000;
                margin: 0 0 20px 0;
            }
            #wrt_window.dinamic-jbwkz2099 table.last {
                margin: 0;
            }
            #wrt_window table {
                width: 620px;
                background-color: #0D1014;
                border-collapse: collapse;
                clear: both;
            }
            #wrt_main * {
                font-size: 11px;
            }
            #wrt_main tr, #wrt_main td, #wrt_main th {
                height: 28px;
                line-height: 28px;
            }
            #wrt_main th {
                color: #6F9FC8;
                text-align: center;
                font-weight: bold;
            }
            .wrt_label {
                padding: 0 5px 0 5px;
                font-weight: bold;
            }
            .wrt_label, .wrt_label * {
                color: grey;
                text-align: left;
            }
            .wrt_select {
                width: 100px;
                text-align: left;
            }
            .wrt_input, .wrt_output {
                width: 112px;
                padding: 0 2px 0 0;
            }
            .wrt_select, .wrt_input, .wrt_checkbox { text-align: center; }
            #wrt_main input[type="text"] {
                width: 100px;
                text-align: center;
            }
            #wrt_footer {
                height: 17px;
                background: url("http://gf1.geo.gfsrv.net/cdn30/aa3e8edec0a2681915b3c9c6795e6f.gif") no-repeat scroll 2px 0px transparent;
            }

            a.wrt_menu_button {
                padding: 3px 5px;
                min-width: 204px;
            }
            .no-touch .btn_blue:hover, .btn_blue:active, .no-touch input.btn_blue:hover, input.btn_blue:active, .no-touch .ui-button:hover, .ui-button:active {
                background: #59758f url(//gf2.geo.gfsrv.net/cdn71/f31afc3….png) 0 -27px repeat-x;
                background: -moz-linear-gradient(top, #6e87a0 0%, #5d7ea2 17%, #7897b1 50%, #57799c 54%, #56789e 59%, #6a89ac 82%, #89a4bd 100%);
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#6e87a0), color-stop(17%,#5d7ea2), color-stop(50%,#7897b1), color-stop(54%,#57799c), color-stop(59%,#56789e), color-stop(82%,#6a89ac), color-stop(100%,#89a4bd));
                background: -webkit-linear-gradient(top, #6e87a0 0%,#5d7ea2 17%,#7897b1 50%,#57799c 54%,#56789e 59%,#6a89ac 82%,#89a4bd 100%);
                background: -o-linear-gradient(top, #6e87a0 0%,#5d7ea2 17%,#7897b1 50%,#57799c 54%,#56789e 59%,#6a89ac 82%,#89a4bd 100%);
                background: -ms-linear-gradient(top, #6e87a0 0%,#5d7ea2 17%,#7897b1 50%,#57799c 54%,#56789e 59%,#6a89ac 82%,#89a4bd 100%);
                background: linear-gradient(to bottom, #6e87a0 0%,#5d7ea2 17%,#7897b1 50%,#57799c 54%,#56789e 59%,#6a89ac 82%,#89a4bd 100%);
                border-color: #7E94AC #627F9C #546A7E #7494B4;
                color: #fff;
                text-shadow: 0 1px 2px #354a5e, 0 0 7px #8ca3bb;
            }
            .wrt_cursor_help { cursor: help; }
            .wrt_below_resource_icon {
                font-size: 9px;
                bottom: -10px;
                position: relative;
            }
        </style>
    `);

    settings = JSON.parse( JSON.parse(localStorage.getItem(_localstorage_varname)).config );

    $(document).on("click", "#wrt_btn_save", function(e){
        e.preventDefault();

        var position = $(document).find("#wrt_select_position").val();
        var trafficlights = $(document).find("#wrt_checkbox").prop("checked");
        var custom_color1 = "null",
            custom_color2 = "null",
            custom_color3 = "null";

        if( position==0 || !$("#wrt_input_custom_color").prop("checked") )
            window.location.reload();

        if( $("#wrt_input_custom_color").prop("checked") ) {
            custom_color1 = $(document).find(".wrt_input_colorpicker.cc1").val();
            custom_color2 = $(document).find(".wrt_input_colorpicker.cc2").val();
            custom_color3 = $(document).find(".wrt_input_colorpicker.cc3").val();

            $(document).find(".wrt_styles_tag1").remove();
            $(document).find(".wrt_styles_tag2").remove();
            $(document).find(".wrt_styles_tag3").remove();
            $("html head").append(`
                <style class="wrt_styles_tag1">
                    .force_color1 font {
                        color: ${custom_color1} !important;
                    }
                </style>
                <style class="wrt_styles_tag2">
                    .force_color2 font {
                        color: ${custom_color2} !important;
                    }
                </style>
                <style class="wrt_styles_tag3">
                    .force_color3 font {
                        color: ${custom_color3} !important;
                    }
                </style>
            `);
        }

        var new_settings = {};

        settings.position = position;
        settings.trafficlights = trafficlights;
        settings.custom_color1 = custom_color1;
        settings.custom_color2 = custom_color2;
        settings.custom_color3 = custom_color3;

        new_settings["config"] = JSON.stringify(settings);

        localStorage.setItem(_localstorage_varname, JSON.stringify(new_settings));
        $(document).find("#wrt_close").click();

        $("#warehouse-remaining-time > .textlabel").text("Ajustes Guardados");
        $("#warehouse-remaining-time > .textlabel").css({"color": "#2FE000"});

        setTimeout(function(){
            $("#warehouse-remaining-time > .textlabel").text("T. Almacen");
            $("#warehouse-remaining-time > .textlabel").removeAttr("style");
        }, 5000);
    });

    var position_tooltip = `Posición|<ol><li>Ubicación donde se mostrará el tiempo restante.</li> <li><b>Tooltip:</b></li> Se mostrará el tiempo restante en el tooltip de cada uno de los recursos.</li> <li><b>Debajo del icono:</b></li> Se mostrará el tiempo restante debajo de la cantidad de recursos que se producen.</li></ol>`;
    var trafficlights_tooltip = `Colores semáforo|<ol><li>Se mostrará el indicador del tiempo en colores dependiendo del tiempo restante para llenarse.</li></ol>`;
    var custom_color_tooltip = `Color personalizado|<ol><li>Se mostrará el indicador del tiempo con el color seleccionado.</li> <li><b>Nota</b>: Si se aplica el color personalizado, los ajustes colocados para 'Posición' y 'Colores semáforo' se ignorarán.</li></ol>`;

    $("#menuTableTools").append(`
        <li>
            <a id="warehouse-remaining-time" class="menubutton simulate-button" href="#" accesskey="" target="_self">
                <span class="textlabel">T. Almacen</span>
            </a>
        </li>
    `);

    $(document).on("click", "#warehouse-remaining-time", function(e){
        e.preventDefault();
        var main_content_div = "#middle .maincontent > div";

        if( theHref.indexOf("/game/index.php?page=ingame&component=fleetdispatch")>-1 ) {
            main_content_div = `#middle .maincontent > div#fleet1`;
        }

        if( !$(document).find("#wrt_window").is(":visible") ) {
            $(main_content_div).hide();
            $(".maincontent").css({"z-index": "10"});
            $(this).addClass("selected");
        } else {
            $(".maincontent").removeAttr("style");
            $(main_content_div).show();
            $(this).removeClass("selected");
        }
        appendWRTPanel(settings);
    });

    $(document).on("click", "#wrt_close, #wrt_btn_cancel", function(e){
        e.preventDefault();
        var main_content_div = "#middle .maincontent > div";

        if( theHref.indexOf("/game/index.php?page=ingame&component=fleetdispatch")>-1 ) {
            main_content_div = `#middle .maincontent > div#fleet1`;
        }

        if( $(document).find("#wrt_window").is(":visible") ) {
            $(".maincontent").removeAttr("style");
            $(main_content_div).show();
            appendWRTPanel(settings)
            $("#warehouse-remaining-time").removeClass("selected");
        }
    });

    $(document).on("click", "#wrt_input_custom_color", function(e){
        if( $(this).prop("checked") ){
            $(".wrt_colorpicker_row1, .wrt_colorpicker_row2, .wrt_colorpicker_row3").show();
        } else {
            $(".wrt_colorpicker_row1, .wrt_colorpicker_row2, .wrt_colorpicker_row3").hide();
        }
    });

    function getInfo(type) {
        /*Load settings*/
        var settings = JSON.parse( JSON.parse(localStorage.getItem(_localstorage_varname)).config );

        /*
           box_content[0] -> Produccion actual
           box_content[1] -> Capacidad del almacen
           box_content[2] -> Produccion por hora
        */
        var time = 0;
        var title = "";
        var pattern_match=/\">(.*?)<\/span/gi;
        var box_content = $(`#${type}_box`).attr("title").match(pattern_match);
        box_content[0] = $(`#resources_${type}`).attr("data-raw");

        for(i in box_content)
            box_content[i] = box_content[i].replace(/[^0-9]+/g, '');

        if( $(`#${type}hours`).length>0 ) {
            if(box_content[2]> 0 )
                time = ((box_content[1]-box_content[0])/box_content[2]).toFixed(2);
            else
                time = 0;
            var linklist = document.getElementById(type+'hours');
            linklist.innerHTML = time+'h';
        } else {
            var linklist = document.getElementById(type+'_box').childNodes[3];
            if(box_content[2]> 0 )
                time = ((box_content[1]-box_content[0])/box_content[2]).toFixed(2); /*Obtiene tiempo restante para llenar el almacen*/
            else
                time = 0;

            /*Tiempo total para llenado de almacen*/
            var total_time = box_content[1]/box_content[2];

            /*Porcentaje de tiempo restante para llenar*/
            var percent = time/total_time;

            var minutes, hours, days, weeks, months;
            var tmp, split_time, split_time_0, split_time_1;

            days = (time/24).toFixed(3);
            split_time = days.split('.');
            hours = ((split_time[1]*24)/1000).toFixed(3);
            split_time_0 = hours.split('.');
            minutes = ((split_time_0[1]*60)/1000).toFixed(3);
            split_time_1 = minutes.split('.');
            time = split_time[0] + "d " + split_time_0[0] + "h " + split_time_1[0] + "m</font>";

            var green_color = [ '<font color="#00bb00">', '</font>'];
            var remaining_time;

            if( percent <= 1 && percent >= 0.9 ) {
                remaining_time = '<font color="#F00">'+time;
            } else if( percent < 0.9  && percent >= 0.8 ) {
                remaining_time = '<font color="#FF4900">'+time;
            } else if( percent < 0.8  && percent >= 0.7 ) {
                remaining_time = '<font color="#FF8D00">'+time;
            } else if( percent < 0.7 && percent >= 0.6 ) {
                remaining_time = '<font color="#FFC400">'+time;
            } else if( percent < 0.6 && percent >= 0.5 ) {
                remaining_time = '<font color="#FFFC00">'+time;
            } else if( percent < 0.5 && percent >= 0.4 ) {
                remaining_time = '<font color="#C9FF00">'+time;
            } else if( percent < 0.4 && percent >= 0.3 ) {
                remaining_time = '<font color="#95FF00">'+time;
            } else if( percent < 0.3 && percent >= 0.2 ) {
                remaining_time = '<font color="#6BFF00">'+time;
            } else if( percent < 0.2 && percent >= 0.1 ) {
                remaining_time = '<font color="#40FF00">'+time;
            } else if( percent < 0.1 && percent > 0 ) {
                remaining_time = green_color[0] + time;
            } else {
                var sobrepoblado;
                sobrepoblado = box_content[0]/box_content[1];
                /*
                   Si sobrepoblado es mayor a 1 entonces el almacen sobrepasa su capacidad
                   Si sobrepoblado es igual a 1 entonces el almacen ya se llenó
                */
                if( sobrepoblado > 1 )
                    remaining_time = '<font color=RED>LLeno</font><br>';
                else if( sobrepoblado = 1 )
                   remaining_time = green_color[0] + 'Listo' + green_color[1] + '<br>';
            }
            //linklist.appendChild(newlink);

            if( settings.position=="1" )
                remaining_time = `<span class="wrt_below_resource_icon">${remaining_time}</span>`;

            var css = "color:rgba(0,0,0,0); left:0; top:0; height:14px; position:absolute;";

            switch(type) {
                case "metal":
                    if( !settings.trafficlights ) {
                        $(document).find(".wrt_styles_tag1").remove();
                        $("html head").append(`
                            <style class="wrt_styles_tag1">
                                .force_color1 font {
                                    color: #FFF !important;
                                }
                            </style>
                        `);
                    }

                    if( settings.custom_color1!="null" ) {
                        $(document).find(".wrt_styles_tag1").remove();
                        $("html head").append(`
                            <style class="wrt_styles_tag1">
                                .force_color1 font {
                                    color: ${settings.custom_color1} !important;
                                }
                            </style>
                        `);
                    }

                    if( settings.position=="0" ) {
                        title = $("#metal_box").attr("title");
                        title = title.replace("</table>", "<tr class='tr-dynamic-metal'><th><b>Tiempo restante:</b></th><td><center class='force_color1'>"+remaining_time+"</center></td></tr></table>");
                        removeTooltip( $("#metal_box") );
                        $("#metal_box").attr("title", title);
                    } else {
                        $("#metal_box > span.value").after(`<span class="force_color1">${remaining_time}</span>`);
                    }

                    break;
                case "crystal":
                    if( !settings.trafficlights ) {
                        $(document).find(".wrt_styles_tag2").remove();
                        $("html head").append(`
                            <style class="wrt_styles_tag2">
                                .force_color2 font {
                                    color: #FFF !important;
                                }
                            </style>
                        `);
                    }

                    if( settings.custom_color2!="null" ) {
                        $(document).find(".wrt_styles_tag2").remove();
                        $("html head").append(`
                            <style class="wrt_styles_tag2">
                                .force_color2 font {
                                    color: ${settings.custom_color2} !important;
                                }
                            </style>
                        `);
                    }

                    if( settings.position=="0" ) {
                        title = $("#crystal_box").attr("title");
                        title = title.replace("</table>", "<tr class='tr-dynamic-crystal'><th><b>Tiempo restante:</b></th><td><center class='force_color2'>"+remaining_time+"</center></td></tr></table>");
                        removeTooltip( $("#crystal_box") );
                        $("#crystal_box").attr("title", title);
                    } else {
                        $("#crystal_box > span.value").after(`<span class="force_color2">${remaining_time}</span>`);
                    }

                    break;
                case "deuterium":
                    if( !settings.trafficlights ) {
                        $(document).find(".wrt_styles_tag3").remove();
                        $("html head").append(`
                            <style class="wrt_styles_tag3">
                                .force_color3 font {
                                    color: #FFF !important;
                                }
                            </style>
                        `);
                    }
                    if( settings.custom_color3!="null" ) {
                        $(document).find(".wrt_styles_tag3").remove();
                        $("html head").append(`
                            <style class="wrt_styles_tag3">
                                .force_color3 font {
                                    color: ${settings.custom_color3} !important;
                                }
                            </style>
                        `);
                    }

                    if( settings.position=="0" ) {
                        title = $("#deuterium_box").attr("title");
                        title = title.replace("</table>", "<tr class='tr-dynamic-deuterium'><th><b>Tiempo restante:</b></th><td><center class='force_color3'>"+remaining_time+"</center></td></tr></table>");
                        removeTooltip( $("#deuterium_box") );
                        $("#deuterium_box").attr("title", title);
                    } else {
                        $("#deuterium_box > span.value").after(`<span class="force_color3">${remaining_time}</span>`);
                    }

                    break;
            }

            if( settings.position=="0" )
                initTooltips();
        }
    }

    function ogameDropDown(select) {
        var i, j, oldDD, newDD, isNew, id, _change, _info, prevStyle=null;
        try {
            if (select.hasClass('dropdownInitialized'))
            {
                select.removeClass('dropdownInitialized');
                oldDD = select.next('.dropdown');
                id = oldDD.attr('rel');
                prevStyle = oldDD.attr('style');
                oldDD.remove();
                $('#'+id).remove();
            }
            oldDD = $('.dropdown.dropdownList').get();
            select.ogameDropDown();
        }
        catch (e) {
            return false;
        }
        _info = {
            select : select
        }
        _change = function()
        {
            var val, text;
            val  = _info.select.val();
            text = _info.select.find('[value="'+val+'"]').text();
            _info.dropdown.attr('data-value',val).text(text);
            //win.console.log(val,text);
        }
        newDD = $('.dropdown.dropdownList').get();
        for (i=0;i<oldDD.length;i++) oldDD[i] = $(oldDD[i]);
        for (i=0;i<newDD.length;i++)
        {
            newDD[i] = $(newDD[i]);
            id = newDD[i].attr('id');
            isNew = true;
            for (j=0;j<oldDD.length;j++)
                if (oldDD[j].attr('id')==id)
                {
                    isNew = false;
                    break;
                }
            if (isNew)
            {
                _info.dropdown = $('.dropdown [rel="'+id+'"]');
                if(prevStyle!=null) _info.dropdown.parent().attr('style',prevStyle);
                //_info.dropdownList = newDD[i];
                _change();
                select.change(_change);
                break;
            }
        }
        return true;
    }

    function ogameDropDowns() {
        //alert(win.navigator.userAgent);
        var i, selects = $(document).find(".initialize-dropdown").get();
        if (!ogameDropDown($(selects[0]))) return;
        for (i=1;i<selects.length;i++)
            ogameDropDown($(selects[i]));
    }

    function appendWRTPanel(settings) {
        if( $(document).find("#wrt_window").length==0 ) {
            $("#middle .maincontent").after(`
                <div id="wrt_window" class="dinamic-jbwkz2099" style="display:block;">
                    <div id="wrt_header">
                        <h4>Tiempo restante para llenado de almacenes<span class="o_trade_calc_config_only"> » Configuración</span></h4>
                        <a id="wrt_close" href="#" class="close_details close_ressources"></a>
                    </div>

                    <div id="wrt_main">
                        <div id="wrt_calc">
                            <table cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td class="wrt_label">
                                            <span class="wrt_cursor_help tooltipHTML tpd-hideOnClickOutside" title="${position_tooltip}">
                                                Posición
                                            </span>
                                        </td>
                                        <td class="wrt_select">
                                            <select id="wrt_select_position" class="initialize-dropdown" style="width:135px;">
                                                <option selected hidden>Selecciona...</option>
                                                <option value="0" ${(settings.position==0 ? "selected" : "")}>Tooltip</option>
                                                <option value="1" ${(settings.position==1 ? "selected" : "")}>Debajo del icono</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="alt">
                                        <td class="wrt_label">
                                            <span class="wrt_cursor_help tooltipHTML tpd-hideOnClickOutside" title="${trafficlights_tooltip}">
                                                Colores semáforo
                                            </span>
                                        </td>
                                        <td class="wrt_checkbox">
                                            <input id="wrt_checkbox" type="checkbox" value="" ${(settings.trafficlights==true ? "checked" : "")}>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="wrt_label">
                                            <span class="wrt_cursor_help tooltipHTML tpd-hideOnClickOutside" title="${custom_color_tooltip}">
                                                Color personalizado
                                            </span>
                                        </td>
                                        <td class="wrt_input">
                                            <input id="wrt_input_custom_color" type="checkbox" ${(settings.custom_color1!="null" || settings.custom_color2!="null" || settings.custom_color3!="null" ? "checked" : "")}>
                                        </td>
                                    </tr>
                                    <tr class="wrt_colorpicker_row1 alt" style="${(settings.custom_color1!="null" ? "" : "display:none;")}">
                                        <td class="wrt_label">
                                            <span class="wrt_cursor_help tooltipHTML tpd-hideOnClickOutside" title="${custom_color_tooltip}">
                                                Selecciona el color para Metal
                                            </span>
                                        </td>
                                        <td class="wrt_input">
                                            <input class="wrt_input_colorpicker cc1" type="color" value="${(settings.custom_color1!="null" ? settings.custom_color1 : "")}">
                                        </td>
                                    </tr>
                                    <tr class="wrt_colorpicker_row2" style="${(settings.custom_color2!="null" ? "" : "display:none;")}">
                                        <td class="wrt_label">
                                            <span class="wrt_cursor_help tooltipHTML tpd-hideOnClickOutside" title="${custom_color_tooltip}">
                                                Selecciona el color para Cristal
                                            </span>
                                        </td>
                                        <td class="wrt_input">
                                            <input class="wrt_input_colorpicker cc2" type="color" value="${(settings.custom_color2!="null" ? settings.custom_color2 : "")}">
                                        </td>
                                    </tr>
                                    <tr class="wrt_colorpicker_row3 alt" style="${(settings.custom_color3!="null" ? "" : "display:none;")}">
                                        <td class="wrt_label">
                                            <span class="wrt_cursor_help tooltipHTML tpd-hideOnClickOutside" title="${custom_color_tooltip}">
                                                Selecciona el color para Deuterio
                                            </span>
                                        </td>
                                        <td class="wrt_input">
                                            <input class="wrt_input_colorpicker cc3" type="color" value="${(settings.custom_color3!="null" ? settings.custom_color3 : "")}">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table cellspacing="0" cellpadding="0" class="last">
                                <tbody>
                                    <tr>
                                        <td style="text-align:center;">
                                            <a id="wrt_btn_cancel" class="btn_blue wrt_menu_button" href="#" style="color: inherit;">Cancelar</a>
                                        </td>
                                        <td style="text-align:center;">
                                            <a id="wrt_btn_save" class="btn_blue wrt_menu_button" href="#" style="color: inherit;">Guardar</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="wrt_footer"></div>
                </div>
            `);
            ogameDropDowns();
        } else {
            if( !$(document).find("#wrt_window").is(":visible") )
                $(document).find("#wrt_window").show()
            else
                $(document).find("#wrt_window").hide()
        }
    }
})();