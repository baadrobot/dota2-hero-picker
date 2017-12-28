$(document).ready(function ()
{
    window.isMobile = false;
    window.curUserLang = $('meta[name=language]').attr("content");


    //''''''''''''''''' Tooltips
    if (!window.isMobile)
    {
        window.tooltipBox = jQuery('<div id="tooltipBox" style="visibility:hidden"></div>').appendTo('body');

        jQuery(document).on('mousemove', function (e)
        {
            if (window.tooltipBox.text() != (''))
            {

                window.tooltipBox.css({
                    visibility: 'visible'
                });

                // count top
                var tooltipH = window.tooltipBox.height();
                var windowHeight = $(window).height();
                var scrollTop = $(window).scrollTop();
                var tooltipTop = e.pageY - 15;
                if ((tooltipTop + tooltipH + 3) > (scrollTop + windowHeight + 3))
                {
                    tooltipTop = scrollTop + windowHeight - tooltipH - 3;
                }
                if (tooltipTop < (scrollTop + 1))
                {
                    tooltipTop = scrollTop + 1;
                }

                // count left
                var tooltipW = window.tooltipBox.width();
                var windowWidth = $(window).width();
                var scrollLeft = $(window).scrollLeft();
                var tooltipLeft = e.pageX + 15;
                if ((tooltipLeft + tooltipW + 3) > (scrollLeft + windowWidth + 3))
                {
                    tooltipLeft = scrollLeft + windowWidth - tooltipW - 3;
                }
                if (tooltipLeft < (scrollLeft + 1))
                {
                    tooltipLeft = scrollLeft + 1;
                }

                window.tooltipBox.css({
                    top: tooltipTop,
                    left: tooltipLeft
                });

            } else {
                window.tooltipBox.css('visibility', 'hidden');
            }
        });
    }




    //................. Tooltips

    eXoActivateInactiveTooltips();

    // end of tooltips


    // focus first text input on any modal window popup
    $('.modal').on('shown.bs.modal', function ()
    {
        $(this).find('input:not([type]):first').trigger('focus');
        $('body').css('padding-right', '');
    });
});
// - END DOC READY//////////////////////////////////////



$(window).on("load",function()
{
    /*
    $('#examplePopup').on('show.bs.modal', function (event)
    {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.attr('data-whatever'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-title').text('New message to ' + recipient);
        modal.find('.modal-body input').val(recipient);
    });
    */
});
// - END WINDOW LOAD////////////////////////////////////

function pleaseWaitOpen()
{
    if (typeof window.pleaseWaitPopupCount == 'undefined')
    {
        window.pleaseWaitPopupCount = 0;
    }
    window.pleaseWaitPopupCount++;
    if (window.pleaseWaitPopupCount == 1)
    {
        $('#pleaseWait').modal({backdrop: 'static', keyboard: false});
        $('.modal-backdrop').css('z-index', 2000);
    }
}

function pleaseWaitClose()
{
    window.pleaseWaitPopupCount--;
    if (window.pleaseWaitPopupCount == 0)
    {
        $('#pleaseWait').modal('hide');
        $('.modal-backdrop').css('z-index', '');
    }
}

function addOnHoverTooltipsForAbilityImg(wrapIdEl)
{
    $(wrapIdEl).find('[data-ability-codename] > img')
    .mouseenter(function ()
    {
        //var heroAbilityCodeName = $(this).attr('data-ability-codename');
        var heroAbilityCodeName = $(this).parent().attr('data-ability-codename');

        var abilityTooltipEl = $('#abilityTooltip');
        if (typeof window.abilityData[heroAbilityCodeName] != 'undefined')
        {
            abilityTooltipEl.find('.abilityName').html(window.abilityData[heroAbilityCodeName]['dname']);
            abilityTooltipEl.find('.abilityHR1').html('');
            abilityTooltipEl.find('.abilityTarget').html(window.abilityData[heroAbilityCodeName]['affects']);
            abilityTooltipEl.find('.abilityHR2').html('');

            var abilityId = $(this).parent().attr('data-ability-id');
            var abilityDispellableSpanEl = abilityTooltipEl.find('#abilityDispellable span');

            if ((typeof window.abilityTypeList != 'undefined') && (typeof window.abilityTypeList[abilityId] != 'undefined'))
            {
                if (window.abilityTypeList[abilityId] == 1)
                {
                    var isDispellabletext = getPreStr_js('GLOBAL', '_DISPELLABLE_YES_');
                    abilityDispellableSpanEl.addClass('dispYes').removeClass('dispStrong').removeClass('dispCant');
                } else if (window.abilityTypeList[abilityId] == 2)
                {
                    var isDispellabletext = getPreStr_js('GLOBAL', '_DISPELLABLE_YES_STRONG_');
                    abilityDispellableSpanEl.addClass('dispStrong').removeClass('dispYes').removeClass('dispCant');
                } else if (window.abilityTypeList[abilityId] == 0)
                {
                    var isDispellabletext = getPreStr_js('GLOBAL', '_DISPELLABLE_NO_');
                    abilityDispellableSpanEl.addClass('dispCant').removeClass('dispYes').removeClass('dispStrong');
                } else {
                    var isDispellabletext = window.abilityTypeList[abilityId];
                    abilityDispellableSpanEl.addClass('dispStrong').removeClass('dispYes').removeClass('dispCant');
                }

                // todo: rename normally window.abilityTypeList[abilityId]
                abilityDispellableSpanEl.html(isDispellabletext).parent().show();
            } else {
                abilityDispellableSpanEl.html('').parent().hide();
            }


            abilityTooltipEl.find('.abilityDesc').html(window.abilityData[heroAbilityCodeName]['desc']);
            abilityTooltipEl.find('.abilityNotes').html(window.abilityData[heroAbilityCodeName]['notes']);
            abilityTooltipEl.find('.abilityDmg').html(window.abilityData[heroAbilityCodeName]['dmg']);
            abilityTooltipEl.find('.abilityAttrib').html(window.abilityData[heroAbilityCodeName]['attrib']);
            abilityTooltipEl.find('.abilityCMB').html(window.abilityData[heroAbilityCodeName]['cmb']);
            abilityTooltipEl.find('.abilityLore').html(window.abilityData[heroAbilityCodeName]['lore']);
            window.tooltipBox.html(abilityTooltipEl.html());
        } else {
            var heroCodenameLength = $(this).closest('[data-hero-codename]').attr('data-hero-codename').length;

            // cut from lone_druid_true_form_battle_cry hero namecode to leave: true_form_battle_cry
            var abilityNameFromAbilityCodeName = heroAbilityCodeName.substring(heroCodenameLength+1);
            abilityNameFromAbilityCodeName = abilityNameFromAbilityCodeName.replace(/_/g, ' ').toUpperCase();
            window.tooltipBox.html('<div class="iconTooltip iconTooltip_ability"><div class="abilityName">'+abilityNameFromAbilityCodeName+'</div></div>');
        }
    }).mouseleave(function ()
    {
        window.tooltipBox.html('');
    });
}

function eXoActivateInactiveTooltips()
{
    jQuery('[data-inactive-tooltip]').each(function ()
    {
        //translating to active tooltip status (to avoid future function repeat)
        //to [data-active-tooltip]
        jQuery(this).attr('data-active-tooltip', jQuery(this).attr('data-inactive-tooltip')).removeAttr('data-inactive-tooltip');

        if (!window.isMobile) {
            jQuery(this).hover(function ()
            {
                var tooltipOrTooltipDiv = jQuery(this).attr('data-active-tooltip');
                if (typeof jQuery(this).attr('data-extra-tooltip') != 'undefined')
                {
                    tooltipOrTooltipDiv += jQuery(this).attr('data-extra-tooltip');
                }

                if (tooltipOrTooltipDiv[0] == '#')
                {
                    //if first simbol is # (hash) then that is an id of a rich tooltip div
                    window.tooltipBox.html(jQuery(tooltipOrTooltipDiv).html());
                }
                else {
                    //simple one line text
                    window.tooltipBox.html(tooltipOrTooltipDiv);
                }
                //mouseout mouseleave
            }).mouseleave(function ()
            {
                window.tooltipBox.html('');
            });
        }
    });
}


function confirmDialog(paramObj)
{
    $('#btnConfirmDialogOK').removeAttr('disabled');
    $('#btnConfirmDialogCancel').removeAttr('disabled');
    $('#btnConfirmDialogDelete').hide();

    // OK btn color class
    if (typeof paramObj.btnOKColorClass == 'undefined')
    {
        paramObj.btnOKColorClass = 'btn-danger';
    }
    $('#btnConfirmDialogOK').attr('class','').addClass('btn').addClass(paramObj.btnOKColorClass);

    // DELETE btn color class
    if (typeof paramObj.btnDeleteColorClass == 'undefined')
    {
        paramObj.btnDeleteColorClass = 'btn-danger';
    }
    $('#btnConfirmDialogDelete').attr('class','').addClass('btn').addClass(paramObj.btnDeleteColorClass);

    if (typeof paramObj.allowBackClickClose == 'undefined')
    {
        paramObj.allowBackClickClose = false;
    }

    if ((typeof paramObj.confirmTitle == 'undefined') || (paramObj.confirmTitle == 'default'))
    {
        paramObj.confirmTitle = getPreStr_js('GLOBAL', '_CONFIRM_ACTION_');
    }

    if ((typeof paramObj.confirmHtml == 'undefined') || (paramObj.confirmHtml == 'default'))
    {
        paramObj.confirmHtml = getPreStr_js('GLOBAL', '_CONFIRM_QUESTION_');
    }

    if ((typeof paramObj.btnDeleteCaption == 'undefined') || (paramObj.btnDeleteCaption == 'default'))
    {
        paramObj.btnDeleteCaption = getPreStr_js('GLOBAL', '_DELETE_');
    }

    if ((typeof paramObj.btnOKCaption == 'undefined') || (paramObj.btnOKCaption == 'default'))
    {
        paramObj.btnOKCaption = getPreStr_js('GLOBAL', '_CONFIRM_');
    }

    if ((typeof paramObj.btnCancelCaption == 'undefined') || (paramObj.btnCancelCaption == 'default'))
    {
        paramObj.btnCancelCaption = getPreStr_js('GLOBAL', '_CANCEL_');
    }

    $('#confirmDialog #confirmDialogTitle').html(paramObj.confirmTitle);
    $('#confirmDialog #confirmDialogText').html(paramObj.confirmHtml);

    $('#confirmDialog #btnConfirmDialogDelete')
    .html(paramObj.btnDeleteCaption)
    .unbind('click')
    .bind('click', function()
    {
        paramObj.onUserClickedDelete();
    });

    $('#confirmDialog #btnConfirmDialogOK')
    .html(paramObj.btnOKCaption)
    .unbind('click')
    .bind('click', function()
    {
        paramObj.onUserClickedOK();
    });

    $('#confirmDialog #btnConfirmDialogCancel')
    .html(paramObj.btnCancelCaption)
    .unbind('click')
    .bind('click', function()
    {
        paramObj.onUserClickedCancel();
    });

    if (paramObj.allowBackClickClose == false)
    {
        var modalParams = {backdrop: 'static', keyboard: false};
    } else {
        var modalParams = {};
    }

    if (typeof paramObj.onBeforeShow != 'undefined')
    {
        paramObj.onBeforeShow();
    }

    $('#confirmDialog').modal(modalParams);

    if (typeof paramObj.onAfterShow != 'undefined')
    {
        paramObj.onAfterShow();
    }
}


function getHeroImgPath(heroCodeName, type)
{
    if (type == 'vert')
    {
        return '//cdn.dota2.com/apps/dota2/images/heroes/'+heroCodeName+'_vert.jpg?v=4195662';
    } else if (type == 'full') {
        return '//cdn.dota2.com/apps/dota2/images/heroes/'+heroCodeName+'_full.png?v=4195662';
    }
}

function getHeroImg(heroNameLocal, heroId, heroCodeName, isNeedValueSpan, heroNameAliases, heroAliasSingle)
{
    var tooltip = "<div class='tooltipWrap'>"+heroNameLocal+'</div>';
    var div = '<div data-inactive-tooltip="'+tooltip+'" class="heroListImg" data-hero-aliases="'+heroNameAliases+'" data-alias-single="'+heroAliasSingle+'" data-hero-id="'+heroId+'" data-hero-codename="'+heroCodeName+'" data-hero-namelocal="'+heroNameLocal+'">';
    if (isNeedValueSpan)
    {
        div += '<span class="heroTagValue" data-hero-id="'+heroId+'"></span>';
    }
    div += '<img data-img-src="'+getHeroImgPath(heroCodeName, 'vert')+'" class="heroImgV" /></div>';
    return div;
}

function buildHeroList(wrapId)
{
    var wrapEl = $(wrapId);
    var isNeedValueSpan = true;
    if (wrapEl.length)
    {
        if (typeof window.heroList != 'undefined')
        {
            var heroListHtml = '';
            for (var j = 1; j <= 3; j++)
            {
                heroListHtml += '<div class="heroList">';
                    for (var i = 0; i < window.heroList.length; i++)
                    {
                        if (window.heroList[i]['a'] == j)
                        {
                            //heroListHtml += '<div>';
                            if(window.heroList[i]['na'] != '')
                            {
                                var fullNameAliases = window.heroList[i]['na'] + ',' + window.heroList[i]['nac'];
                            } else {
                                var fullNameAliases = window.heroList[i]['nac'];
                            }
                            
                            heroListHtml += getHeroImg(window.heroList[i]['n'], window.heroList[i]['id'], window.heroList[i]['cn'], isNeedValueSpan, fullNameAliases, window.heroList[i]['nas']);
                            //heroListHtml += '</div>';
                        }
                    }
                heroListHtml += '</div>';
                heroListHtml += '<hr>';
            }
        }
        wrapEl.append(heroListHtml);
        kainaxPreloadImages({wrapElement: wrapEl
            , gifNameOrFalse: 'spinner.gif'
            //, gifNameOrFalse: 'eco-ajax-loader-01.gif'
            , opacity: 0.6
            , loaderIntH: 10
            , loaderIntW: 10
            //, missingPicOrFalse: false
        });

        eXoActivateInactiveTooltips();
    }
}

function getPreStr_js(component, preStr)
{
    if ((typeof window.LangPreStr != 'undefined')
    && (typeof window.LangPreStr[component] != 'undefined')
    && (typeof window.LangPreStr[component][preStr] != 'undefined'))
    {
        return window.LangPreStr[component][preStr];
    } else {
        return preStr;
    }
}


function inputLoaderStart(inputElement)
{
    var paramObj = {};
    var inputGroup = inputElement.siblings('.input-group-addon');
    if (inputGroup.length)
    {
        var element = inputGroup;
        element.find('i').hide();
    } else {
        var element = inputElement;
    }

    paramObj.opacity = 0.8;
    paramObj.loaderIntW = 12;
    paramObj.loaderIntH = 12;
    //paramObj.gifNameOrFalse = 'eco-ajax-loader-01.gif';
    paramObj.gifNameOrFalse = 'spinner.gif';
    // add loader exactly in center
    var loaderMarginLeftAndRight = Math.round(element.width() / 2) - (paramObj.loaderIntW / 2);
    var loaderMarginTopAndBottom = Math.round(element.height() / 2) - (paramObj.loaderIntH / 2);
    element.prepend(
        '<i class="kainaxImgPreloader" style="'
            + 'margin:' + loaderMarginTopAndBottom + 'px' + ' ' + loaderMarginLeftAndRight + 'px;'
            + 'opacity:' + paramObj.opacity + ';'
            + 'width:' + paramObj.loaderIntW + 'px;'
            + 'height:' + paramObj.loaderIntH + 'px;'
            + 'position:absolute!important;'
            + 'background:transparent url(/images/loaders/' + paramObj.gifNameOrFalse + ') no-repeat!important;'
            + 'background-size: 100% 100%!important;'
            + 'z-index: 999;'
        + '"></i>'
    );
}

function inputLoaderStop(inputElement)
{
    var inputGroup = inputElement.siblings('.input-group-addon');
    if (inputGroup.length)
    {
        inputGroup.find('i').show();
    }

    inputElement.parent().find('.kainaxImgPreloader').remove();
}


function kainaxPreloadImages(paramObj)
{
    wrapEl = paramObj.wrapElement;

    if ((typeof paramObj.missingPicOrFalse == 'undefined') || (paramObj.missingPicOrFalse == 'default'))
    {
        // empty ability
        paramObj.missingPicOrFalse = "//cdn.dota2.com/apps/dota2/images/abilities/rubick_empty1_hp1.png?v=4195662";
    }

    if (wrapEl.length)
    {
        wrapEl.find('img[data-img-src]').each(function ()
        {
            $(this)
                .css('visibility', 'hidden')
                .on('load', function ()
                {
                    $(this).hide().css('visibility', '').fadeIn(700);
                    if (paramObj.gifNameOrFalse !== false)
                    {
                        $(this).siblings('.kainaxImgPreloader').fadeOut(400, function () {
                            $(this).remove();
                        });
                    }
                })
                .on('error', function ()
                {
                    if (paramObj.missingPicOrFalse !== false)
                    {
                        // loasd default missing pic
                        $(this).attr("src", paramObj.missingPicOrFalse);
                    } else {
                        // just remove loader
                        $(this).siblings('.kainaxImgPreloader').fadeOut(400, function () {
                            $(this).remove();
                        });
                    }
                })
                .attr('src', $(this).attr('data-img-src'))
                .removeAttr('data-img-src');

            if (paramObj.gifNameOrFalse !== false)
            {
                // add loader exactly in center
                var loaderMarginLeftAndRight = Math.round($(this).parent().width() / 2) - (paramObj.loaderIntW / 2);
                var loaderMarginTopAndBottom = Math.round($(this).parent().height() / 2) - (paramObj.loaderIntH / 2);
                $(this).parent().prepend(
                    '<i class="kainaxImgPreloader" style="'
                        + 'margin:' + loaderMarginTopAndBottom + 'px' + ' ' + loaderMarginLeftAndRight + 'px;'
                        + 'opacity:' + paramObj.opacity + ';'
                        + 'width:' + paramObj.loaderIntW + 'px;'
                        + 'height:' + paramObj.loaderIntH + 'px;'
                        + 'position:absolute!important;'
                        + 'background:transparent url(/images/loaders/' + paramObj.gifNameOrFalse + ') no-repeat!important;'
                        + 'background-size: 100% 100%!important;'
                    + '"></i>'
                );
            }
        });
    }
}

function getHeroIcon(heroName, heroNameLocal)
{
    var tooltip = "<div class='tooltipWrap'>"+heroNameLocal+'</div>';
    var heroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+heroName+'_hphover.png?v=4238480';
    var heroImg = '<img src="'+heroIconUrl+'" height="18px" data-inactive-tooltip="'+tooltip+'">';
    return heroImg;
}

function getAbilityIcon(abilityCodeName, abilityId)
{
    var abilityIconUrl = 'http://cdn.dota2.com/apps/dota2/images/abilities/'+abilityCodeName+'_hp1.png?v=4238480';
    var abilityImg = '<img class="heroAbilityImg" data-ability-id="'+abilityId+'" data-ability-codename="'+abilityCodeName+'" src="'+abilityIconUrl+'" height="18px">';
    return abilityImg;
}

function getItemIcon(itemCodename, itemName)
{
    var tooltip = "<div class='tooltipWrap'>"+itemName+'</div>';
    var itemIconUrl = 'http://cdn.dota2.com/apps/dota2/images/items/'+itemCodename+'_lg.png';
    var itemImg = '<img src="'+itemIconUrl+'" height="18px" data-inactive-tooltip="'+tooltip+'">';
    return itemImg;
}

function generateBalanceNote(balanceNoteTemplate, firstHeroId, secondHeroId, selAb1, selAb2, allInvolvedAbilitiesResult, isReversedSynergy)
{
    if (isReversedSynergy == 1)
    {
        // reverse {h1}{a1} and {h2}{a2} for this hero
        balanceNoteTemplate = balanceNoteTemplate.replace(/{h1}/gi, '{temp_h1}')
                                                 .replace(/{a1}/gi, '{temp_a1}')
                                                 .replace(/{h2}/gi, '{h1}')
                                                 .replace(/{a2}/gi, '{a1}')
                                                 .replace(/{temp_h1}/gi, '{h2}')
                                                 .replace(/{temp_a1}/gi, '{a2}');
    }

    var firstHeroOnPageEl = $('#heroListWrap [data-hero-id="' + firstHeroId + '"]');
    var secondHeroOnPageEl = $('#heroListWrap [data-hero-id="' + secondHeroId + '"]');

    var firstHeroCodename = firstHeroOnPageEl.attr('data-hero-codename');
    var secondHeroCodename = secondHeroOnPageEl.attr('data-hero-codename');

    var firstHeroNamelocal = firstHeroOnPageEl.attr('data-hero-namelocal');
    var secondHeroNamelocal = secondHeroOnPageEl.attr('data-hero-namelocal');
    var imgPath = secondHeroOnPageEl.find('img').attr('src');

    var selAb1 = selAb1.split(' ');
    var selAb2 = selAb2.split(' ');

    firstHeroAbilitiesIcons = '';
    for (var i = 0; i < selAb1.length; i++)
    {
        if (i != 0)
        {
            firstHeroAbilitiesIcons += ' ';
        }
        var abilityId = selAb1[i];
        var abilityCodename = allInvolvedAbilitiesResult[abilityId];
        firstHeroAbilitiesIcons += getAbilityIcon(abilityCodename, abilityId);
    }

    secondHeroAbilitiesIcons = '';
    for (var i = 0; i < selAb2.length; i++)
    {
        if (i != 0)
        {
            secondHeroAbilitiesIcons += ' ';
        }
        var abilityId = selAb2[i];
        var abilityCodename = allInvolvedAbilitiesResult[abilityId];
        secondHeroAbilitiesIcons += getAbilityIcon(abilityCodename, abilityId);
    }

    // fix 126723
    var indexOfItemColon = balanceNoteTemplate.indexOf('{i:');
    var indexOfBackItemCurlBrace = balanceNoteTemplate.indexOf('}', indexOfItemColon);
    var itemAliasSingle = balanceNoteTemplate.slice(indexOfItemColon+3, indexOfBackItemCurlBrace).toLowerCase();
    var itemAliasSingleWithBraces = ('{i:'+itemAliasSingle+'}').toLowerCase();
    var itemAliasSingleRegExpObj = new RegExp(itemAliasSingleWithBraces,"gi");

    if (typeof window.itemList[itemAliasSingle] != 'undefined')
    {
        balanceNoteTemplate = balanceNoteTemplate.replace(itemAliasSingleRegExpObj, getItemIcon(window.itemList[itemAliasSingle]['itemCodename'], window.itemList[itemAliasSingle]['itemName']));
    }

    return balanceNoteTemplate.replace(/{h1}/gi, getHeroIcon(firstHeroCodename, firstHeroNamelocal))
                            .replace(/{a1}/gi, firstHeroAbilitiesIcons)
                            .replace(/{h2}/gi, getHeroIcon(secondHeroCodename, secondHeroNamelocal))
                            .replace(/{a2}/gi, secondHeroAbilitiesIcons);
                            // .replace(itemAliasSingleRegExpObj, getItemIcon(allItemsListArray[itemAliasSingle]['itemCodename'], allItemsListArray[itemAliasSingle]['itemName']));
}


function generateMultiHeroBalanceNote(balanceNoteTemplate, counterHeroesArray, secondHeroId, selAb1, selAb2, isReversedSynergy)
{
    if (isReversedSynergy == 1)
    {
        // reverse {h1}{a1} and {h2}{a2} for this hero
        balanceNoteTemplate = balanceNoteTemplate.replace(/{h1}/gi, '{temp_h1}')
                                                 .replace(/{a1}/gi, '{temp_a1}')
                                                 .replace(/{h2}/gi, '{h1}')
                                                 .replace(/{a2}/gi, '{a1}')
                                                 .replace(/{temp_h1}/gi, '{h2}')
                                                 .replace(/{temp_a1}/gi, '{a2}');
    }

    var counterHeroesHTML = '';
    var isFirst = true;
    for (var i = 0; i < counterHeroesArray.length; i++)
    {
        if (isFirst)
        {
            isFirst = false;
        } else {
            counterHeroesHTML += ', ';
        }
        var heroId = counterHeroesArray[i];
        var firstHeroOnPageEl = $('#heroListWrap [data-hero-id="' + heroId + '"]');
        var firstHeroCodename = firstHeroOnPageEl.attr('data-hero-codename');
        var firstHeroNamelocal = firstHeroOnPageEl.attr('data-hero-namelocal');

        counterHeroesHTML += getHeroIcon(firstHeroCodename, firstHeroNamelocal);
    }

    var secondHeroOnPageEl = $('#heroListWrap [data-hero-id="' + secondHeroId + '"]');    
    var secondHeroCodename = secondHeroOnPageEl.attr('data-hero-codename');
    var secondHeroNamelocal = secondHeroOnPageEl.attr('data-hero-namelocal');


    var imgPath = secondHeroOnPageEl.find('img.heroImgV').attr('src');

    var selAb1 = selAb1.split(' ');
    var selAb2 = selAb2.split(' ');

    firstHeroAbilitiesIcons = '';
    for (var i = 0; i < selAb1.length; i++)
    {
        if (i != 0)
        {
            firstHeroAbilitiesIcons += ' ';
        }
        var abilityId = selAb1[i];
        var abilityCodename = window.involvedAbils[abilityId];
        firstHeroAbilitiesIcons += getAbilityIcon(abilityCodename, abilityId);
    }

    secondHeroAbilitiesIcons = '';
    for (var i = 0; i < selAb2.length; i++)
    {
        if (i != 0)
        {
            secondHeroAbilitiesIcons += ' ';
        }
        var abilityId = selAb2[i];
        var abilityCodename = window.involvedAbils[abilityId];
        secondHeroAbilitiesIcons += getAbilityIcon(abilityCodename, abilityId);
    }

    var indexOfItemColon = balanceNoteTemplate.indexOf('{i:');
    var indexOfBackItemCurlBrace = balanceNoteTemplate.indexOf('}', indexOfItemColon);
    var itemAliasSingle = balanceNoteTemplate.slice(indexOfItemColon+3, indexOfBackItemCurlBrace).toLowerCase();
    var itemAliasSingleWithBraces = ('{i:'+itemAliasSingle+'}').toLowerCase();
    var itemAliasSingleRegExpObj = new RegExp(itemAliasSingleWithBraces,"gi");

    if (typeof window.itemList[itemAliasSingle] != 'undefined')
    {
        balanceNoteTemplate = balanceNoteTemplate.replace(itemAliasSingleRegExpObj, getItemIcon(window.itemList[itemAliasSingle]['itemCodename'], window.itemList[itemAliasSingle]['itemName']));
    }

    return balanceNoteTemplate.replace(/{h1}/gi, counterHeroesHTML)
                            .replace(/{a1}/gi, firstHeroAbilitiesIcons)
                            .replace(/{h2}/gi, getHeroIcon(secondHeroCodename, secondHeroNamelocal))
                            .replace(/{a2}/gi, secondHeroAbilitiesIcons);
                            // .replace(itemAliasSingleRegExpObj, getItemIcon(allItemsListArray[itemAliasSingle]['itemCodename'], allItemsListArray[itemAliasSingle]['itemName']));
}
