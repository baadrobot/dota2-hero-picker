$(document).ready(function ()
{
    window.isMobile = false;
    window.curUserLang = $('meta[name=language]').attr("content");


    //''''''''''''''''' Tooltips
    if (!window.isMobile)
    {
        window.tooltipBox = jQuery('<div id="tooltipBox" style="visibility:hidden"></div>').appendTo('body');
        window.tooltipDefaultYOffset = 15;
        window.tooltipCurYoffset = window.tooltipDefaultYOffset;
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
    $('#pleaseWait').modal({backdrop: 'static', keyboard: false});
    $('.modal-backdrop').css('z-index', 2000);
}

function pleaseWaitClose()
{
    $('#pleaseWait').modal('hide');
    $('.modal-backdrop').css('z-index', '');
}

function addOnHoverTooltipsForAbilityImg(wrapIdEl, tooltipYoffset)
{
    $(wrapIdEl).find('[data-ability-codename]')
    .mouseenter(function ()
    {
        //var heroAbilityCodeName = $(this).attr('data-ability-codename');
        var heroAbilityCodeName = $(this).attr('data-ability-codename');

        var abilityTooltipEl = $('#abilityTooltip');
        if (typeof window.abilityData[heroAbilityCodeName] != 'undefined')
        {
            // make tooltip Y position higher
            window.tooltipCurYoffset = tooltipYoffset;

            abilityTooltipEl.find('.abilityName').html(window.abilityData[heroAbilityCodeName]['dname']);
            abilityTooltipEl.find('.abilityHR1').html('');
            abilityTooltipEl.find('.abilityTarget').html(window.abilityData[heroAbilityCodeName]['affects']);
            abilityTooltipEl.find('.abilityHR2').html('');
            abilityTooltipEl.find('.abilityDesc').html(window.abilityData[heroAbilityCodeName]['desc']);
            abilityTooltipEl.find('.abilityNotes').html(window.abilityData[heroAbilityCodeName]['notes']);
            abilityTooltipEl.find('.abilityDmg').html(window.abilityData[heroAbilityCodeName]['dmg']);
            abilityTooltipEl.find('.abilityAttrib').html(window.abilityData[heroAbilityCodeName]['attrib']);
            abilityTooltipEl.find('.abilityCMB').html(window.abilityData[heroAbilityCodeName]['cmb']);
            abilityTooltipEl.find('.abilityLore').html(window.abilityData[heroAbilityCodeName]['lore']);
            window.tooltipBox.html(abilityTooltipEl.html());
        } else {
            // make tooltip Y position higher
            window.tooltipCurYoffset = -25;

            var heroAbilityCodeName = $(this).attr('data-ability-codename');
            var heroCodenameLength = $(this).closest('[data-hero-codename]').attr('data-hero-codename').length;

            // cut from lone_druid_true_form_battle_cry hero namecode to leave: true_form_battle_cry
            var abilityNameFromAbilityCodeName = heroAbilityCodeName.substring(heroCodenameLength+1);
            abilityNameFromAbilityCodeName = abilityNameFromAbilityCodeName.replace(/_/g, ' ').toUpperCase();
            window.tooltipBox.html('<div class="iconTooltip iconTooltip_ability"><div class="abilityName">'+abilityNameFromAbilityCodeName+'</div></div>');
        }
    }).mouseleave(function ()
    {
        window.tooltipBox.html('');
        window.tooltipCurYoffset = window.tooltipDefaultYOffset;
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

function getHeroImg(heroNameLocal, heroId, heroCodeName, isNeedValueSpan, heroNameAliases)
{
    var tooltip = "<div class='tooltipWrap'>"+heroNameLocal+'</div>';
    var div = '<div data-inactive-tooltip="'+tooltip+'" class="heroListImg" data-hero-aliases="'+heroNameAliases+'" data-hero-id="'+heroId+'" data-hero-codename="'+heroCodeName+'" data-hero-namelocal="'+heroNameLocal+'">';
    if (isNeedValueSpan)
    {
        div += '<span class="heroTagValue" data-hero-id="'+heroId+'"></span>';
    }
    div += '<img data-img-src="'+getHeroImgPath(heroCodeName, 'vert')+'" /></div>';
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
                            heroListHtml += getHeroImg(window.heroList[i]['n'], window.heroList[i]['id'], window.heroList[i]['cn'], isNeedValueSpan, window.heroList[i]['na']);
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