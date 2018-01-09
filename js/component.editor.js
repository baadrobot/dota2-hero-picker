$(document).ready(function ()
{
    buildHeroList('#heroListWrap');

    $('#editAccordion i').click(function ()
    {
        $(this).siblings('a.accordionHeader.collapsed').click();
    });

    // click on PLUS btn (add tag)
    $('#btnCreateNewTagPopup').click(function ()
    {
        var question = '';
        question += '<div class="form-group">';
        question += '<label for="inputCreateNewTagName" class="col-form-label">'+getPreStr_js('EDITOR', '_TAG_NAME_')+'</label>';
        question += '<input id="inputCreateNewTagName" type="text" class="form-control">';
        question += '<p id="noticeTagExist" class="noticeRed" style="display:none">'+getPreStr_js('EDITOR', '_TAG_EXIST_')+'</p>';
        question += '</div>';

        confirmDialog({
            confirmTitle : getPreStr_js('EDITOR', '_CREATE_TAG_')
            ,confirmHtml : question
            ,btnOKCaption : getPreStr_js('EDITOR', '_CREATE_')
            ,btnCancelCaption : 'default'
            ,btnOKColorClass : 'btn-success'
            ,allowBackClickClose : true
            ,onBeforeShow: function ()
            {
                $('#inputCreateNewTagName').val('');
                $('#btnConfirmDialogOK').attr('disabled', 'disabled');
                bindInputTagAlreadyExists('#inputCreateNewTagName');
            }
            ,onAfterShow : function ()
            {
                $('#inputCreateNewTagName').focus();
            }
            ,onUserClickedOK : function ()
            {
                pleaseWaitOpen();
                $('.tag.selectedTag').click();

                //Ajax
                $.ajax({
                    url: 'php/ajax.editor.php',
                    data: {  ajaxType: 'editorAddNewTag'
                           , tagName: $.trim($('#inputCreateNewTagName').val())
                          },
                    datatype: 'jsonp',
                    type: 'POST',
                    cache: false,
                    success: function (result)
                    {
                        if (result.php_result == 'OK')
                        {
                            $('#createNewTagPopup').modal('hide');
                            ajaxGetTagsArray(rebuildEditorTags);
                        }
                        else if (result.php_result == 'ERROR')
                        {
                            console.log(result.php_error_msg);
                        };
                    },
                    complete: function (result)
                    {
                        pleaseWaitClose();
                    },
                    error: function (request, status, error)
                    {
                        // we recieved NOT json
                    }
                });
            }
            ,onUserClickedCancel : function ()
            {
                //
            }
        });
    });

    // click on PLUS btn (add balance)
    $('#btnCreateNewBalancePopup').click(function()
    {
        var itemsHtml = '<div id="itemsWrap">';

        pleaseWaitOpen();

        //Ajax
        $.ajax({
            url: 'php/ajax.editor.php',
            data: {  ajaxType: 'editorGetItemList'
                    },
            datatype: 'jsonp',
            type: 'POST',
            cache: false,
            success: function (result)
            {
                if (result.php_result == 'OK')
                {
                    for(var i = 0; i < result.item_list.length; i++)
                    {
                        var tooltip = "<div class='tooltipWrap'>"+result.item_list[i]['itemName']+'</div>';
                        var itemIconUrl = 'http://cdn.dota2.com/apps/dota2/images/items/'+result.item_list[i]['itemCodename']+'_lg.png';                        

                        itemsHtml += '<div class="itemImgWrap">';
                            itemsHtml += '<img src="'+itemIconUrl+'" height="27px" data-inactive-tooltip="'+tooltip+'" data-item-single="'+result.item_list[i]['itemAliasSingle']+'">';
                        itemsHtml += '</div>';
                    }
                    
                    itemsHtml += '</div>';
                    
                    tagBalancePopupDo('new', '', itemsHtml);
                }
                else if (result.php_result == 'ERROR')
                {
                    console.log(result.php_error_msg);
                };
            },
            complete: function (result)
            {
                pleaseWaitClose();
            },
            error: function (request, status, error)
            {
                // we recieved NOT json
            }
        });
    });


    // on page load
    ajaxGetTagsArray(rebuildAll);




    // click on MINUS btn (delete tag)
    $('#btnDeleteSelectedTagPopup').click(function ()
    {
        var question = getPreStr_js('EDITOR', '_CONFIRM_DELETE_TAG_');
        question = question.replace(/{TAG}/, '<span class="greenBold">'+$('#tagListWrap .selectedTag').text()+'</span>');

        confirmDialog({
            confirmTitle : 'default'
            ,confirmHtml : question
            ,btnOKCaption : getPreStr_js('EDITOR', '_DELETE_TAG_')
            ,btnCancelCaption : 'default'
            ,allowBackClickClose : true
            ,onUserClickedOK : function ()
            {
                        pleaseWaitOpen();

                        //Ajax
                        $.ajax({
                            url: 'php/ajax.editor.php',
                            data: {  ajaxType: 'editorDeleteTag'
                                      , tagId: $('#tagListWrap .selectedTag').attr('data-tag-id')
                                    },
                            datatype: 'jsonp',
                            type: 'POST',
                            cache: false,
                            success: function (result)
                            {
                                if (result.php_result == 'OK')
                                {
                                    ajaxGetTagsArray(rebuildEditorTags);
                                }
                                else if (result.php_result == 'ERROR')
                                {
                                    console.log(result.php_error_msg);
                                };
                            },
                            complete: function (result)
                            {
                                pleaseWaitClose();
                            },
                            error: function (request, status, error)
                            {
                                // we recieved NOT json, probably error in ajax.php
                            }
                        });
            }
            ,onUserClickedCancel : function ()
            {
                $('#confirmDialog').modal('hide');
            }
        });
    });
    // end of minus btn

    // rename btn
    $('#btnRenameSelectedTagPopup').click(function ()
    {
        var question = '';
        question += '<div class="form-group">';
        question += '<label for="inputRenameTagName" class="col-form-label">'+getPreStr_js('EDITOR', '_TAG_NAME_')+'</label>';
        question += '<input id="inputRenameTagName" type="text" class="form-control">';
        question += '<p id="noticeTagExist" class="noticeRed" style="display:none">'+getPreStr_js('EDITOR', '_TAG_EXIST_')+'</p>';
        question += '</div>';

        confirmDialog({
            confirmTitle : getPreStr_js('EDITOR', '_RENAME_TAG_')
            ,confirmHtml : question
            ,btnOKCaption : getPreStr_js('EDITOR', '_RENAME_')
            ,btnCancelCaption : 'default'
            ,btnOKColorClass : 'btn-warning'
            ,allowBackClickClose : true
            ,onBeforeShow: function ()
            {
                $('#btnConfirmDialogOK').attr('disabled', 'disabled');
                bindInputTagAlreadyExists('#inputRenameTagName');
            }
            ,onAfterShow : function ()
            {
                $('#inputRenameTagName')
                .focus()
                .val('')
                .val($('#tagListWrap .selectedTag').attr('data-tag-name')); // set cursor to the end
            }
            ,onUserClickedOK : function ()
            {
                pleaseWaitOpen();
                // $('.tag.selectedTag').click();

                //Ajax
                $.ajax({
                    url: 'php/ajax.editor.php',
                    data: {  ajaxType: 'editorRenameTag'
                            , renamedTagId: $('#tagListWrap .selectedTag').attr('data-tag-id')
                           , renamedTagName: $.trim($('#inputRenameTagName').val())
                          },
                    datatype: 'jsonp',
                    type: 'POST',
                    cache: false,
                    success: function (result)
                    {
                        if (result.php_result == 'OK')
                        {
                            $('#createNewTagPopup').modal('hide');
                            ajaxGetTagsArray(rebuildEditorTags);
                        }
                        else if (result.php_result == 'ERROR')
                        {
                            console.log(result.php_error_msg);
                        };
                    },
                    complete: function (result)
                    {
                        pleaseWaitClose();
                    },
                    error: function (request, status, error)
                    {
                        // we recieved NOT json
                    }
                });
            }
            ,onUserClickedCancel : function ()
            {
                //
            }
        });
    });
    // end of rename btn

    $('#editHeroTagHeroImgWrap').click(function ()
    {
        if ($(this).toggleClass('selectedAbility').hasClass('selectedAbility'))
        {
            $('#editHeroTagAbilitiesImgWrap .selectedAbility').removeClass('selectedAbility');
        }
        editHeroTagDecideInfoText();
    });

    $('.heroListImg').click(function ()
    {
        var curSelectedTagEl = $('.selectedTag');
        if (curSelectedTagEl.length > 0)
        {
            pleaseWaitOpen();

            var editHeroAbilitiesImgWrapEl = $('#editHeroTagAbilitiesImgWrap');
            var selectedTagId = curSelectedTagEl.attr('data-tag-id');

            editHeroAbilitiesImgWrapEl.html('');

            var curSelectedHeroEl = $(this);
            var clickedheroId = curSelectedHeroEl.attr('data-hero-id');
            // $('#editHeroTagTagName')
            //     .text( curSelectedTagEl.text() )
            //     .attr('data-tag-id', curSelectedTagEl.attr('data-tag-id') );
            $('#editHeroTagPopup')
                .attr('data-tag-id', selectedTagId )
                .attr('data-hero-id', clickedheroId )
                .attr('data-hero-codename', curSelectedHeroEl.attr('data-hero-codename') );

            $('#editHeroTagHeroName').text( curSelectedHeroEl.attr('data-hero-namelocal') );
            //     .attr( 'data-hero-id', clickedheroId )
            //     .attr( 'data-hero-codename', curSelectedHeroEl.attr('data-hero-codename'));

            var mainHeroImgWrapEl = $('#editHeroTagHeroImgWrap');
            mainHeroImgWrapEl.find('img')
                .removeAttr('src')
                .attr('data-img-src', '//cdn.dota2.com/apps/dota2/images/heroes/' + curSelectedHeroEl.attr('data-hero-codename') + '_full.png?v=4212550');

            kainaxPreloadImages({wrapElement: mainHeroImgWrapEl
                //, gifNameOrFalse: 'spinner.gif'
                , gifNameOrFalse: 'eco-ajax-loader-01.gif'
                , opacity: 0.8
                , loaderIntH: 16
                , loaderIntW: 16
            });

            $('#editHeroTagSlider').slider('value', 3);



            // Ajax
            $.ajax({
                url: 'php/ajax.editor.php',
                data: {  ajaxType: 'editorGetHeroAbilitiesAndTagSet'
                        , heroId: clickedheroId
                         , tagId: selectedTagId
                        },
                datatype: 'jsonp',
                type: 'POST',
                cache: false,
                success: function (result)
                {
                    // nurax: добавил проверить будет ли работать: убрать если нет
                    $('#editHeroTagHeroImgWrap.selectedAbility').removeClass('selectedAbility');                    
                    $('.heroAbilityImg.selectedAbility').removeClass('selectedAbility'); 
                    // end of nurax

                    if (result.php_result == 'OK')
                    {
                        var searchAbilityInputVal = $('#searchAbilityInput').val();
                        for (var i = 0; i < result.hero_abilities_array.length; i++)
                        {
                            var abilityCodename = result.hero_abilities_array[i]['abilityCodename'];
                            if ((searchAbilityInputVal == '')
                            || (typeof window.searchAbilityFoundList[abilityCodename] != 'undefined'))
                            {
                                // color
                                opacityStyle = '';
                            } else {
                                // white
                                opacityStyle = ' ' + 'style="opacity:0.5"';
                            }

                            // nurax (удалить коммент если заработает)
                            var $aghaIcon = '';
                            var scepterDescr = '';
                            if (typeof window.abilityData[abilityCodename] != 'undefined')
                            {
                                if (typeof window.scepterDescr[window.abilityData[abilityCodename]['dname']] != 'undefined')
                                {
                                    var scepterAbilityDName = window.abilityData[abilityCodename]['dname'];
                                    scepterDescr = ' '+'data-inactive-tooltip="<div class='+"'scepterDescrTooltip'"+'><h6>'+scepterAbilityDName+'</h6>'+window.scepterDescr[window.abilityData[abilityCodename]['dname']]+'</div>"';
                                    $aghaIcon = '<div class="aghaScepterIconBig"><img src="//cdn.dota2.com/apps/dota2/images/items/ultimate_scepter_lg.png"'+scepterDescr+' width="20px" height="20px"></div>';
                                }
                            }

                            editHeroAbilitiesImgWrapEl.append('<div class="heroAbilityImg"'+opacityStyle+' data-ability-id="'+result.hero_abilities_array[i]['id']+'" data-ability-codename="'+abilityCodename+'">'+$aghaIcon+'<img data-img-src="//cdn.dota2.com/apps/dota2/images/abilities/'+abilityCodename+'_hp1.png?v=4195662"></div>');
                            // end of nurax

                            // editHeroAbilitiesImgWrapEl.append('<div class="heroAbilityImg"'+opacityStyle+' data-ability-id="'+result.hero_abilities_array[i]['id']+'" data-ability-codename="'+abilityCodename+'"><img data-img-src="//cdn.dota2.com/apps/dota2/images/abilities/'+abilityCodename+'_hp1.png?v=4195662"></div>');
                        }

                        $('.heroAbilityImg').click(function ()
                        {
                            // remove from hero picture
                            mainHeroImgWrapEl.removeClass('selectedAbility');

                            // toggle on ability
                            $(this).toggleClass('selectedAbility');

                            editHeroTagDecideInfoText();
                        });

                        eXoActivateInactiveTooltips();
                        addOnHoverTooltipsForAbilityImg('#editHeroTagAbilitiesImgWrap');

                        if (result.tag_result == 'NONE')
                        {
                            $('#editHeroTagHeroImgWrap.selectedAbility').removeClass('selectedAbility');
                            $('#btnEditHeroTagUnset').hide();
                            //tagValue
                        } else if (result.tag_result == 'HERO')
                        {
                            $('#editHeroTagHeroImgWrap').addClass('selectedAbility');
                            //tag_value added
                            $('#editHeroTagSlider').slider('value', result.tag_value);
                            $('#btnEditHeroTagUnset').show();
                        } else {
                            $('#editHeroTagHeroImgWra.selectedAbility').removeClass('selectedAbility');

                            var selectedTagsIdArray = result.tag_result.split(' ');
                            for (var i = 0; i < selectedTagsIdArray.length; i++)
                            {
                                $('#editHeroTagAbilitiesImgWrap [data-ability-id="'+selectedTagsIdArray[i]+'"]').addClass('selectedAbility');
                            }
                            //tag_value added
                            $('#editHeroTagSlider').slider('value', result.tag_value);
                            $('#btnEditHeroTagUnset').show();
                        }

                        kainaxPreloadImages({wrapElement: editHeroAbilitiesImgWrapEl
                            , gifNameOrFalse: 'spinner.gif'
                            //, gifNameOrFalse: 'eco-ajax-loader-01.gif'
                            , opacity: 0.6
                            , loaderIntH: 10
                            , loaderIntW: 10
                        });

                        editHeroTagDecideInfoText();
               
                        $('#editHeroTagPopup').modal();
                    }
                    else if (result.php_result == 'ERROR')
                    {
                        console.log(result.php_error_msg);
                    };
                },
                complete: function (result)
                {
                    pleaseWaitClose();
                },
                error: function (request, status, error)
                {
                    // we recieved NOT json
                }
            });
        } else {
            // click on hero w/o selected tag
            pleaseWaitOpen();

            var editHeroAbilitiesImgWrapEl = $('#editHeroAllTagsAbilitiesImgWrap');

            editHeroAbilitiesImgWrapEl.html('');

            var curSelectedHeroEl = $(this);
            var clickedheroId = curSelectedHeroEl.attr('data-hero-id');

            $('#editHeroPopup')
                .attr('data-hero-id', clickedheroId )
                .attr('data-hero-codename', curSelectedHeroEl.attr('data-hero-codename') );

            $('#editHeroAllTagsHeroName').text( curSelectedHeroEl.attr('data-hero-namelocal') );

            var mainHeroImgWrapEl = $('#editHeroAllTagsHeroImgWrap');
            mainHeroImgWrapEl.find('img')
                .removeAttr('src')
                .attr('data-img-src', '//cdn.dota2.com/apps/dota2/images/heroes/' + curSelectedHeroEl.attr('data-hero-codename') + '_full.png?v=4212550');

            kainaxPreloadImages({wrapElement: mainHeroImgWrapEl
                //, gifNameOrFalse: 'spinner.gif'
                , gifNameOrFalse: 'eco-ajax-loader-01.gif'
                , opacity: 0.8
                , loaderIntH: 16
                , loaderIntW: 16
            });

            // Ajax
            $.ajax({
                url: 'php/ajax.editor.php',
                data: {  ajaxType: 'editorGetHeroAbilitiesAndHeroTags'
                        , heroId: clickedheroId
                        //  , tagId: selectedTagId
                        },
                datatype: 'jsonp',
                type: 'POST',
                cache: false,
                success: function (result)
                {
                    if (result.php_result == 'OK')
                    {
                        // прозрачность для абилок героя в попапе
                        var searchAbilityInputVal = $('#searchAbilityInput').val();
                        for (var i = 0; i < result.hero_abilities_array.length; i++)
                        {
                            var abilityCodename = result.hero_abilities_array[i]['abilityCodename'];
                            if ((searchAbilityInputVal == '')
                            || (typeof window.searchAbilityFoundList[abilityCodename] != 'undefined'))
                            {
                                // color
                                opacityStyle = '';
                            } else {
                                // white
                                opacityStyle = ' ' + 'style="opacity:0.5"';
                            }

                            var $aghaIcon = '';
                            var scepterDescr = '';
                            if (typeof window.abilityData[abilityCodename] != 'undefined')
                            {
                                if (typeof window.scepterDescr[window.abilityData[abilityCodename]['dname']] != 'undefined')
                                {
                                    var scepterAbilityDName = window.abilityData[abilityCodename]['dname'];
                                    scepterDescr = ' '+'data-inactive-tooltip="<div class='+"'scepterDescrTooltip'"+'><h6>'+scepterAbilityDName+'</h6>'+window.scepterDescr[window.abilityData[abilityCodename]['dname']]+'</div>"';
                                    $aghaIcon = '<div class="aghaScepterIconBig"><img src="//cdn.dota2.com/apps/dota2/images/items/ultimate_scepter_lg.png"'+scepterDescr+' width="20px" height="20px"></div>';
                                }
                            }

                            editHeroAbilitiesImgWrapEl.append('<div class="heroAbilityImg"'+opacityStyle+' data-ability-id="'+result.hero_abilities_array[i]['id']+'" data-ability-codename="'+abilityCodename+'">'+$aghaIcon+'<img data-img-src="//cdn.dota2.com/apps/dota2/images/abilities/'+abilityCodename+'_hp1.png?v=4195662"></div>');
                        }

                        addOnHoverTooltipsForAbilityImg('#editHeroAllTagsAbilitiesImgWrap');

                        kainaxPreloadImages({wrapElement: editHeroAbilitiesImgWrapEl
                            , gifNameOrFalse: 'spinner.gif'
                            //, gifNameOrFalse: 'eco-ajax-loader-01.gif'
                            , opacity: 0.6
                            , loaderIntH: 10
                            , loaderIntW: 10
                        });

                        var heroTagsHtml = '';

                        for(i = 0; i < result.hero_tag_result.length; i++)
                        {
                            var curTagId = result.hero_tag_result[i]['tagId'];
                            var curTagValue = result.hero_tag_result[i]['value'];

                            var curTagName = $('#tagListWrap [data-tag-id="'+curTagId+'"]').attr('data-tag-name');

                            heroTagsHtml += '<span class="editHeroPopupTag" data-tag-id="'+curTagId+'" data-tag-name="'+curTagName+'">['+curTagName+']</span>:<span class="editHeroPopupTagVal" data-tag-id="'+curTagId+'">'+curTagValue+'</span>';
                        }
                        $('#editHeroPopupTagsWrap').html(heroTagsHtml);

                        // #editHeroPopupTagsWrap tags click
                        $('#editHeroPopupTagsWrap .editHeroPopupTag').on('click', function()
                        {
                            $('#editHeroPopup').modal('hide');
                            var clickedTagId = $(this).attr('data-tag-id');
                            $('#tagListWrap [data-tag-id="'+clickedTagId+'"]').trigger('click');
                        });
                        // end of #editHeroPopupTagsWrap tags click

                        // #editHeroPopupTagsWrap tags values click
                        $('#editHeroPopupTagsWrap .editHeroPopupTagVal').on('click', function()
                        {
                            $('#editHeroPopup').modal('hide');
                            var clickedTagId = $(this).attr('data-tag-id');
                            $('#tagListWrap [data-tag-id="'+clickedTagId+'"]').trigger('click');
                            window.globalClickedHeroId = clickedheroId;
                        });
                        // end of #editHeroPopupTagsWrap tags values click

                        var heroTotalBalanceArray = [];
                        heroTotalBalanceArray[0] = [];
                        heroTotalBalanceArray[1] = [];
                        for(i = 0; i < result.hero_total_balance_result.length; i++)
                        {
                            var setType = result.hero_total_balance_result[i]['setType'];
                            var secondHeroId = result.hero_total_balance_result[i]['hId'];
                            var balanceCoef = result.hero_total_balance_result[i]['balCoef'];

                            if (typeof heroTotalBalanceArray[setType][secondHeroId] == 'undefined')
                            {
                                heroTotalBalanceArray[setType][secondHeroId] = 0;
                            }

                            heroTotalBalanceArray[setType][secondHeroId] = heroTotalBalanceArray[setType][secondHeroId] + Number(balanceCoef);
                        }

                                function createHeroBalanceDiv(setTypeFinalDecision, firstHeroId, secondHeroId, heroTotalBalanceArray, heroTotalBalanceResult, allInvolvedAbilitiesResult)
                                {
                                        // prepare second hero data from "Hero List" on the page
                                        var resultDiv = '';
                                        var secondHeroOnPageEl = $('#heroListWrap [data-hero-id="' + secondHeroId + '"]');
                                        var secondHeroNamelocal = secondHeroOnPageEl.attr('data-hero-namelocal');
                                        var imgPath = secondHeroOnPageEl.find('img').attr('src');
                                        balanceCoefTotal = heroTotalBalanceArray[setTypeFinalDecision][secondHeroId];
                                        var colorCoefColor = balanceCoefTotal >= 0 ? 'noticeGreen' : 'noticeRed';
                                        var balanceCoefTotalText = balanceCoefTotal > 0 ? '+'+balanceCoefTotal : balanceCoefTotal;

                                    resultDiv += '<div class="finalBalaceItem">';
                                        resultDiv += '<div class="heroInfoWrapForBalance clearFix">';
                                            resultDiv += '<div class="heroImgWrapForBalance float-left align-middle"><img src="' + imgPath + '" width="30px" height="auto"></div>';
                                            resultDiv += '<div class="heroNamelocalForBalance float-left align-middle">' + secondHeroNamelocal + '</div>';
                                            resultDiv += '<div class="heroTotalCoefForBalance '+colorCoefColor+' float-right align-middle">' + balanceCoefTotalText + '</div>';
                                        resultDiv += '</div>';
                                        resultDiv += '<div class="heroNotesWrapForBalance" style="display:none">';
                                            for (i = 0; i < heroTotalBalanceResult.length; i++)
                                            {
                                                var curSetType = heroTotalBalanceResult[i]['setType'];
                                                var curSecondHeroId = heroTotalBalanceResult[i]['hId'];
                                                var isReversedSynergy = heroTotalBalanceResult[i]['isRvrs'];

                                                if ((curSetType == setTypeFinalDecision) && (curSecondHeroId == secondHeroId))
                                                {
                                                    var balanceCoef = heroTotalBalanceResult[i]['balCoef'];
                                                    var selAb2 = heroTotalBalanceResult[i]['selAb2'];
                                                    var selAb1 = heroTotalBalanceResult[i]['selAb1'];
                                                    var note = heroTotalBalanceResult[i]['note'];

                                                    if (note == '')
                                                    {
                                                        if (setTypeFinalDecision == 1)
                                                        {
                                                            note = getPreStr_js('EDITOR', '_DFLT_NOTE_COUNTER_');
                                                        } else
                                                        {
                                                            if (balanceCoefTotal >= 0) {
                                                                note = getPreStr_js('EDITOR', '_DFLT_NOTE_SNRG_');
                                                            } else {
                                                                note = getPreStr_js('EDITOR', '_DFLT_NOTE_ANTISNRG_');
                                                            }
                                                        }
                                                    }

                                                            if (balanceCoef < 0)
                                                            {
                                                                var colorClass = 'noticeRed';
                                                            } else {
                                                                var colorClass = 'noticeGreen';
                                                            }
                                                    resultDiv += '<div class="noteForBalance '+colorClass+'">';
                                                        resultDiv += '<div class="noteTextForBalance">';
                                                            if ((setTypeFinalDecision == 1) && (balanceCoef < 0))
                                                            {
                                                                // for Counter-By we need to change H1 and H2 places
                                                                resultDiv += generateBalanceNote(note, secondHeroId, clickedheroId, selAb2, selAb1, allInvolvedAbilitiesResult, isReversedSynergy);
                                                            } else {
                                                                resultDiv += generateBalanceNote(note, clickedheroId, secondHeroId, selAb1, selAb2, allInvolvedAbilitiesResult, isReversedSynergy);
                                                            }
                                                        resultDiv += '</div>';
                                                        resultDiv += '<div class="coefForBalance">';
                                                            resultDiv += balanceCoef;
                                                        resultDiv += '</div>';
                                                    resultDiv += '</div>';
                                                }
                                            }
                                        resultDiv += '</div>';
                                    resultDiv += '</div>';

                                            if (setTypeFinalDecision == 1)
                                            {
                                                if (balanceCoefTotal >= 0)
                                                {
                                                    // Hero CounterTo
                                                    $('#heroPopupCounterToWrap').append(resultDiv);
                                                } else {
                                                    // Hero CounterBy
                                                    $('#heroPopupCounterByWrap').append(resultDiv);
                                                }
                                            } else {
                                                if (balanceCoefTotal >= 0)
                                                {
                                                    // Hero Synergy wrap
                                                    $('#heroPopupSynergyWrap').append(resultDiv);
                                                } else {
                                                    // Hero AntiSynergy wrap
                                                    $('#heroPopupAntiSynergyWrap').append(resultDiv);
                                                }
                                            }
                                }

                        // popuplate
                        $('#heroPopupCounterToWrap').html('');
                        $('#heroPopupCounterByWrap').html('');
                        $('#heroPopupSynergyWrap').html('');
                        $('#heroPopupAntiSynergyWrap').html('');
                        Object.keys(heroTotalBalanceArray[1]).forEach(function (keySecondHeroId)
                        {
                            createHeroBalanceDiv(1, clickedheroId, keySecondHeroId, heroTotalBalanceArray, result.hero_total_balance_result, result.all_involved_abilities_result);
                        });
                        Object.keys(heroTotalBalanceArray[0]).forEach(function (keySecondHeroId)
                        {
                            createHeroBalanceDiv(0, clickedheroId, keySecondHeroId, heroTotalBalanceArray, result.hero_total_balance_result, result.all_involved_abilities_result);
                        });

                        // sort
                        function sortTotalHeroCoefDESC(a, b) {
                            var contentA = Number($(a).find(".heroTotalCoefForBalance").text());
                            var contentB = Number($(b).find(".heroTotalCoefForBalance").text());
                            return contentA < contentB ? 1 : -1;
                        };
                        function sortTotalHeroCoefASC(a, b) {
                            var contentA = Number($(a).find(".heroTotalCoefForBalance").text());
                            var contentB = Number($(b).find(".heroTotalCoefForBalance").text());
                            return contentA < contentB ? -1 : 1;
                        };
                        $('#heroPopupCounterToWrap .finalBalaceItem').sort(sortTotalHeroCoefDESC).appendTo('#heroPopupCounterToWrap');
                        $('#heroPopupCounterByWrap .finalBalaceItem').sort(sortTotalHeroCoefASC).appendTo('#heroPopupCounterByWrap');
                        $('#heroPopupSynergyWrap .finalBalaceItem').sort(sortTotalHeroCoefDESC).appendTo('#heroPopupSynergyWrap');
                        $('#heroPopupAntiSynergyWrap .finalBalaceItem').sort(sortTotalHeroCoefASC).appendTo('#heroPopupAntiSynergyWrap');

                        // tooltips
                        eXoActivateInactiveTooltips();
                        addOnHoverTooltipsForAbilityImg('#editHeroPopup');

                        // on click
                        $('.heroInfoWrapForBalance').on('click', function()
                        {
                            if (!$(this).hasClass('selectedHeroPopupBalance'))
                            {
                                $('.selectedHeroPopupBalance').removeClass('selectedHeroPopupBalance').siblings('.heroNotesWrapForBalance').slideUp(100);
                                $(this).addClass('selectedHeroPopupBalance').siblings('.heroNotesWrapForBalance').slideDown(100);
                            } else {
                                $('.selectedHeroPopupBalance').removeClass('selectedHeroPopupBalance').siblings('.heroNotesWrapForBalance').slideUp(100);
                            }
                        });

                        $('#editHeroPopup').modal();
                    }
                    else if (result.php_result == 'ERROR')
                    {
                        console.log(result.php_error_msg);
                    };
                },
                complete: function (result)
                {
                    pleaseWaitClose();
                },
                error: function (request, status, error)
                {
                    // we recieved NOT json
                    console.log(request);
                    //console.log(status);
                    console.log(error);
                }
            });
            // end of ajax
            // end of else
        }
    });
    // end of .heroListImg click function



    $('#btnEditHeroTagDo').click(function ()
    {
        if ($('#editHeroTagInfoNone:visible').length)
        {
            $('#editHeroTagInfoNone').effect("shake");
            return; //exit
        }
        pleaseWaitOpen();

        var editHeroTagSelectedAbilitiesIdString = '';
        $('#editHeroTagAbilitiesImgWrap .selectedAbility').each(function ()
        {
            if (editHeroTagSelectedAbilitiesIdString != '')
            {
                editHeroTagSelectedAbilitiesIdString = editHeroTagSelectedAbilitiesIdString + ' ';
            }
            editHeroTagSelectedAbilitiesIdString = editHeroTagSelectedAbilitiesIdString + $(this).attr('data-ability-id');
        });

        //Ajax
        $.ajax({
            url: 'php/ajax.editor.php',
            data: {  ajaxType: 'editorEditHeroTag'
                      , tagId: $('#editHeroTagPopup').attr('data-tag-id')
                     , heroId: $('#editHeroTagPopup').attr('data-hero-id')
                      , value: $('#editHeroTagSlider').slider('value')
          , selectedAbilities: editHeroTagSelectedAbilitiesIdString
                    },
            datatype: 'jsonp',
            type: 'POST',
            cache: false,
            success: function (result)
            {
                if (result.php_result == 'OK')
                {
                    $('#editHeroTagPopup').modal('hide');
                }
                else if (result.php_result == 'ERROR')
                {
                    console.log(result.php_error_msg);
                };
            },
            complete: function (result)
            {
                pleaseWaitClose();
                $('.tag.selectedTag').removeClass('selectedTag').click();
            },
            error: function (request, status, error)
            {
                // we recieved NOT json, probably error in ajax.php
            }
        });
    });

    // tag_unset click
    $('#btnEditHeroTagUnset').click(function ()
    {
        $('#editHeroTagPopup').modal('hide');

        var question = getPreStr_js('EDITOR', '_CONFIRM_UNSET_TAG_');
        question = question.replace(/{TAG}/, '<span class="greenBold">'+$('#editHeroTagTagName').text()+'</span>');
        question = question.replace(/{HERO}/, '<span class="blueBold">'+$('#editHeroTagHeroName').text()+'</span>');

        confirmDialog({
            confirmTitle : 'default'
            ,confirmHtml : question
            ,btnOKCaption : getPreStr_js('EDITOR', '_UNSET_TAG_')
            ,btnCancelCaption : 'default'
            ,allowBackClickClose : true
            ,onUserClickedOK : function ()
            {
                        pleaseWaitOpen();

                        //Ajax
                        $.ajax({
                            url: 'php/ajax.editor.php',
                            data: {  ajaxType: 'editorEditHeroTagDeleteHeroTag'
                                      , tagId: $('#editHeroTagPopup').attr('data-tag-id')
                                     , heroId: $('#editHeroTagPopup').attr('data-hero-id')
                                    },
                            datatype: 'jsonp',
                            type: 'POST',
                            cache: false,
                            success: function (result)
                            {
                                if (result.php_result == 'OK')
                                {
                                    $('.tag.selectedTag').removeClass('selectedTag').click();
                                }
                                else if (result.php_result == 'ERROR')
                                {
                                    console.log(result.php_error_msg);
                                };
                            },
                            complete: function (result)
                            {
                                pleaseWaitClose();
                            },
                            error: function (request, status, error)
                            {
                                // we recieved NOT json, probably error in ajax.php
                            }
                        });
            }
            ,onUserClickedCancel : function ()
            {
                $('#editHeroTagPopup').modal();
            }
        });
    });

    var handle = $( "#custom-handle" );
    $( "#editHeroTagSlider" ).slider({
      max: 5,
      min: 1,
      create: function() {
        handle.text( $( this ).slider( "value" ) );
      },
      change: function( event, ui )
      {
        handle.text( ui.value );
      },
      slide: function( event, ui )
      {
        handle.text( ui.value );
      }
    });

    // hero search
    $('#searchHeroAliasInput')
    .on('keyup', function ()
    {
        // checking if another (ability) search is active
        var abilitySearchInputEl = $('#searchAbilityInput');
        if (abilitySearchInputEl.val() != '')
        {
            abilitySearchInputEl.siblings('.input-group-addon').find('i').trigger('click');
        }

        var heroSearchVal = $(this).val().toLowerCase();
        if (heroSearchVal != '')
        {
            $('[data-hero-aliases]').each(function ()
            {
                var allAliases = ($(this).attr('data-hero-aliases')
                    + '|' + $(this).attr('data-hero-namelocal')
                    + '|' + $(this).attr('data-hero-codename')).toLowerCase();

                if (allAliases.indexOf($.trim(heroSearchVal)) !== -1)
                {
                    $(this).removeClass('heroListImgOpacity');
                } else {
                    $(this).addClass('heroListImgOpacity');
                }
            });
        } else {
            $('.heroListImgOpacity').removeClass('heroListImgOpacity');
        }
    }).on('blur', function ()
    {
        $(this).val('');
        $('.heroListImgOpacity').removeClass('heroListImgOpacity');
    });

    // tag search
    $('#searchTagInput')
    .on('keyup', function ()
    {
        // checking if another (ability) search is active
        // var abilitySearchInputEl = $('#searchAbilityInput');
        // if (abilitySearchInputEl.val() != '')
        // {
        //     abilitySearchInputEl.siblings('.input-group-addon').find('i').trigger('click');
        // }

        var tagSearchVal = $(this).val().toLowerCase();
        if (tagSearchVal != '')
        {
            $('#tagListWrap .tag').each(function ()
            {
                var tagName = ($(this).attr('data-tag-name')).toLowerCase();

                if (tagName.indexOf($.trim(tagSearchVal)) !== -1)
                {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('#tagListWrap .tag').show();
        }
    }).removeAttr('disabled');
    // .on('blur', function ()
    // {
    //     $(this).val('');
    //     $('#tagListWrap .tag').show();
    // });


    function findAndUnderlineOrFalse(needle, stack)
    {
        var found = 0;

        var found = false;
        var needleObj = new RegExp(needle, "ig"); // ignore_case, global
        replacedResult = stack.replace(needleObj, function ()
        {
            found = true;
            return '<span style="text-decoration:underline red">'+needle+'</span>';
        });

        if (found)
        {
            return replacedResult;
        } else {
            return false;
        }
    }

    function prepareHeroAbilityTooltipBySearch(tooltipFieldAffectsEtc, tooltipFieldClass, isNeedEnglish, abilitySearchVal, keyAbilityCodename)
    {
        resultCurLang = findAndUnderlineOrFalse(abilitySearchVal, window.abilityData[keyAbilityCodename][tooltipFieldAffectsEtc]);
        if (isNeedEnglish) {
            resultEnglishLang = findAndUnderlineOrFalse(abilitySearchVal, window.abilityDataEnglish[keyAbilityCodename][tooltipFieldAffectsEtc]);
        }

        var result = '';
        if ((resultCurLang !== false) || (resultEnglishLang !== false)) {
            if (isNeedEnglish && (resultEnglishLang !== false)) {
                result += '<div class="doubleCol">'
            }

            // current
            if (resultCurLang !== false)
            {
                result += '<div class="' + tooltipFieldClass + '">' + resultCurLang + '</div>';
            } else {
                result += '<div class="' + tooltipFieldClass + '">' +  window.abilityData[keyAbilityCodename][tooltipFieldAffectsEtc] + '</div>';
            }

            if (isNeedEnglish && (resultEnglishLang !== false)) {
                result += '<div class="' + tooltipFieldClass + '" style="font-style:italic;opacity:0.6">' + resultEnglishLang + '</div>';
                result += '</div>'
            }
        }

        return result;
    }

    function searchAllAbilitiesTextDo()
    {
        var searchInputEl = $('#searchAbilityInput');
        var abilitySearchVal = $.trim(searchInputEl.val().toLowerCase());

        // globally saving all found abilities names
        window.searchAbilityFoundList = [];

        if (abilitySearchVal != '')
        {
            searchInputEl.siblings('.input-group-addon').find('i').addClass('fa-times').removeClass('fa-search');
            if (typeof window.abilityData != 'undefined')
            {
                    var resultCurLang;
                    var resultEnglishLang = false;
                    $('#heroListWrap [data-hero-codename]').each(function ()
                    {
                        var heroEl = $(this);
                        var curHeroCodename = heroEl.attr('data-hero-codename');
                        var isNeedEnglish = (window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish != 'undefined');

                        if (curHeroCodename == 'sand_king')
                        {
                            curHeroCodename = 'sandking';
                        }
                        var heroTooltipAllFoundAbilitiesText = '';
                        Object.keys(window.abilityData).forEach(function(keyAbilityCodename)
                        {
                            if (keyAbilityCodename.startsWith(curHeroCodename))
                            {
                                var tooltipText = '';

                                if (((window.abilityData[keyAbilityCodename]['dname']).toLowerCase().indexOf(abilitySearchVal) !== -1)
                                ||
                                (((window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish != 'undefined')) &&
                                ((window.abilityDataEnglish[keyAbilityCodename]['dname']).toLowerCase().indexOf(abilitySearchVal) !== -1)))
                                {
                                    tooltipText += ' ';
                                }

                                tooltipText += prepareHeroAbilityTooltipBySearch('affects', 'abilityTarget', isNeedEnglish, abilitySearchVal, keyAbilityCodename);
                                tooltipText += prepareHeroAbilityTooltipBySearch('desc', 'abilityDesc', isNeedEnglish, abilitySearchVal, keyAbilityCodename);
                                tooltipText += prepareHeroAbilityTooltipBySearch('notes', 'abilityNotes', isNeedEnglish, abilitySearchVal, keyAbilityCodename);

                                if (tooltipText != '')
                                {
                                    heroTooltipAllFoundAbilitiesText += '<div id="abilityTooltip" class="multiline"><div class="iconTooltip iconTooltip_ability">' + window.abilityData[keyAbilityCodename]['dname'] + tooltipText;
                                    if (typeof window.abilityData[keyAbilityCodename]['cmb'] != 'undefined') {
                                        heroTooltipAllFoundAbilitiesText += '<div class="abilityCMB">'+window.abilityData[keyAbilityCodename]['cmb'] +'</div>'
                                    }
                                    heroTooltipAllFoundAbilitiesText += '</div></div>';

                                    // saving in global array to underline ability icon in hero_tag_set window
                                    window.searchAbilityFoundList[keyAbilityCodename] = 1;
                                }

                                // abilityTooltipEl.find('.abilityDmg').html(window.abilityData[heroAbilityCodeName]['dmg']);
                                // abilityTooltipEl.find('.abilityAttrib').html(window.abilityData[heroAbilityCodeName]['attrib']);
                                // abilityTooltipEl.find('.abilityCMB').html(window.abilityData[heroAbilityCodeName]['cmb']);
                                // abilityTooltipEl.find('.abilityLore').html(window.abilityData[heroAbilityCodeName]['lore']);
                            }
                        });

                        if (heroTooltipAllFoundAbilitiesText != '')
                        {
                            heroEl.removeClass('heroListImgOpacity').attr('data-extra-tooltip', heroTooltipAllFoundAbilitiesText);
                        } else {
                            heroEl.addClass('heroListImgOpacity').removeAttr('data-extra-tooltip');
                        }
                    });
                }
            } else {
                $('#heroListWrap .heroListImgOpacity').removeClass('heroListImgOpacity');
                searchInputEl.siblings('.input-group-addon').find('i').addClass('fa-search').removeClass('fa-times');
            }

            if ($('#heroListWrap .heroListImgOpacity').length == 0)
            {
                $('#heroListWrap [data-extra-tooltip]').removeAttr('data-extra-tooltip');
            }
    }

    // ability search
    $('#searchAbilityInput')
    .on('keyup', function ()
    {
        if ((typeof window.loadEnglishTooltipsOnce == 'undefined') || (window.loadEnglishTooltipsOnce == 1))
        {
            if ((window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish == 'undefined'))
            {
                window.loadEnglishTooltipsOnce = 0;
                var searchInputEl = $(this);
                inputLoaderStart(searchInputEl);
                $.ajax({
                    url: 'https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&callback=loretwo&l=english'
                    , dataType: 'jsonp'
                    , jsonpCallback: 'loretwo'
                    , success: function (data) {
                        window.abilityDataEnglish = data["abilitydata"];
                        inputLoaderStop(searchInputEl);
                        searchAllAbilitiesTextDo();
                        window.loadEnglishTooltipsOnce = 1;
                    }
                });
            } else {
                searchAllAbilitiesTextDo();
            }
        }
    }).removeAttr('disabled'
    ).siblings('.input-group-addon').on('click', function () {
        // click on search btn
        var searchInputEl = $('#searchAbilityInput');
        var searchVal = searchInputEl.val();
        if (searchVal != '')
        {
            searchInputEl.attr('data-last-search', searchVal).val('');
        } else {
            searchInputEl.val( searchInputEl.attr('data-last-search') );
        }
        searchInputEl.trigger('keyup');
    });

    $('#editAccordion').on('hidden.bs.collapse', function ()
    {
        $(window).trigger('resize');
    });
});
// - END DOC READY//////////////////////////////////////



$(window).on("load",function()
{

});
// - END WINDOW LOAD////////////////////////////////////


function colorizeAllHeroes()
{
    // colorize all heroes
    $('.heroListImg').each(function ()
    {
        $(this).removeClass('grayscale');
        $(this).find('.heroTagValue').html('');
    });
    // hide minus btn
    $('#btnDeleteSelectedTagPopup').hide();
    $('#btnRenameSelectedTagPopup').hide();
}

function sortEditorBalanceTags()
{
        //Shuffle
        jQuery('#tagBalanceListWrap')
        .shuffle('sort',
        {    itemSelector: '.tagBalanceItem'
            ,reverse: true
            ,by: function (el)
            {
                var order = Number(el.find('[data-tag-value]').attr('data-tag-value'));

                var selectedTagEl = $('#tagListWrap .selectedTag');
                if (selectedTagEl.length)
                {
                    var selectedTagId = selectedTagEl.attr('data-tag-id');
                    if ((el.find('[data-tag-id]:first').attr('data-tag-id') == selectedTagId)
                    || (el.find('[data-tag-id]:last').attr('data-tag-id') == selectedTagId))
                    {
                        order = 10000 + order;
                    }

                    if (order >= 6000)
                    {
                        el.removeClass('balanceSetItemOpacity');
                    } else {
                        el.addClass('balanceSetItemOpacity');
                    }
                } else {
                    el.removeClass('balanceSetItemOpacity');
                }

                return Number(order);
            }
            //,delimeter: ','
            //,columnWidth: '100%'
        });
}

function rebuildEditorBalanceTags()
{
    pleaseWaitOpen();

    $.ajax({
        url: 'php/ajax.editor.php',
        data: {  ajaxType: 'getAllBalanceTags'
              },
        datatype: 'jsonp',
        type: 'POST',
        cache: false,
        success: function (result)
        {
            if (result.php_result == 'OK')
            {
                // -- rebuld tag balace list
                var balanceTagsList = result.balance_tag_array;
                var tagBalanceListEl = $('#tagBalanceListWrap');
                tagBalanceListEl.html('');

                if (balanceTagsList != 'NONE')
                {
                    for (var i = 0; i < balanceTagsList.length; i++)
                    {
                        var balanceSetType = balanceTagsList[i]['setType'];
                        var firstBalanceTagValue = balanceTagsList[i]['value'];

                        if (balanceSetType == 1)
                        {
                            // if counter pick
                            var balanceSeparator = 'VS';
                            // we bring with mysql only positive rows in first tags,
                            // so first always green, second always red for counter
                            var firstBalanceTagClass = 'noticeGreen';
                            var secondBalanceTagClass = 'noticeRed';

                            var secondBalanceTagValue = (firstBalanceTagValue * -1);
                        } else {
                            // if synergy
                            var balanceSeparator = '+';
                            if (firstBalanceTagValue > 0)
                            {
                                // if positive synergy, both green
                                var firstBalanceTagClass = 'noticeGreen';
                                var secondBalanceTagClass = 'noticeGreen';
                            } else {
                                // if negative synergy, both red
                                var firstBalanceTagClass = 'noticeRed';
                                var secondBalanceTagClass = 'noticeRed';
                            }
                            var secondBalanceTagValue = firstBalanceTagValue;
                        }

                        var firstBalanceTagId = balanceTagsList[i]['firstTagId'];
                        var secondBalanceTagId = balanceTagsList[i]['secondTagId'];
                        if ((typeof balanceTagsList[i]['d'] != 'undefined') && (balanceTagsList[i]['d'] != ''))
                        {
                            var tagSetDescription = balanceTagsList[i]['d'];
                        } else {
                            var tagSetDescription = '';
                            // if (balanceSetType == 1)
                            // {
                            //     // counter pick
                            //     var tagSetDescription = '{h+} {a+} контрит {h-} {a-}';
                            // } else {
                            //     if (secondBalanceTagValue >= 0)
                            //     {
                            //         // synergy
                            //         var tagSetDescription = '{h} {a} синергия {h} {a}';

                            //     } else {
                            //         // anti-synergy
                            //         var tagSetDescription = '{h} {a} анти-синергия {h} {a}';
                            //     }
                            // }
                        }

                        var firstBalanceTagName = $('#tagListWrap .tag[data-tag-id="'+firstBalanceTagId+'"]').attr('data-tag-name');
                        var secondBalanceTagName = $('#tagListWrap .tag[data-tag-id="'+secondBalanceTagId+'"]').attr('data-tag-name');

                            var balanceRowHtml = '';
                            balanceRowHtml += '<div class="tagBalanceItem">';

                                balanceRowHtml += '<div class="'+firstBalanceTagClass+'" data-balance-descr="'+tagSetDescription+'" data-tag-id="'+firstBalanceTagId+'" data-tag-name="'+firstBalanceTagName+'" data-tag-value="'+firstBalanceTagValue+'" data-tag-settype="'+balanceSetType+'">';
                                    balanceRowHtml += '(' + firstBalanceTagValue + ')';
                                balanceRowHtml += '</div>';
                                balanceRowHtml += '<div class="'+firstBalanceTagClass+'">';
                                    balanceRowHtml += '[' + firstBalanceTagName + ']';
                                balanceRowHtml += '</div>';

                                balanceRowHtml += '<div>'+balanceSeparator+'</div>';

                                balanceRowHtml += '<div class="'+secondBalanceTagClass+'" data-tag-id="'+secondBalanceTagId+'" data-tag-name="'+secondBalanceTagName+'">';
                                    balanceRowHtml += '[' + secondBalanceTagName + ']';
                                balanceRowHtml += '</div>';
                                balanceRowHtml += '<div class="'+secondBalanceTagClass+'">';
                                    balanceRowHtml += '(' + secondBalanceTagValue + ')';
                                balanceRowHtml += '</div>';

                            tagBalanceListEl.append(balanceRowHtml);
                        }
                    }

                    $('#tagBalanceListWrap .tagBalanceItem').click(function ()
                    {
                        var clickedBalanceEl = $(this);
                        var itemsHtml = '<div id="itemsWrap">';

                        pleaseWaitOpen();

                        //Ajax
                        $.ajax({
                            url: 'php/ajax.editor.php',
                            data: {  ajaxType: 'editorGetItemList'
                                    },
                            datatype: 'jsonp',
                            type: 'POST',
                            cache: false,
                            success: function (result)
                            {
                                if (result.php_result == 'OK')
                                {
                                    for(var i = 0; i < result.item_list.length; i++)
                                    {
                                        var tooltip = "<div class='tooltipWrap'>"+result.item_list[i]['itemName']+'</div>';
                                        var itemIconUrl = 'http://cdn.dota2.com/apps/dota2/images/items/'+result.item_list[i]['itemCodename']+'_lg.png';                        

                                        itemsHtml += '<div class="itemImgWrap">';
                                            itemsHtml += '<img src="'+itemIconUrl+'" height="30px" data-inactive-tooltip="'+tooltip+'" data-item-single="'+result.item_list[i]['itemAliasSingle']+'">';
                                        itemsHtml += '</div>';
                                    }
                                    
                                    itemsHtml += '</div>';
                                    
                                    tagBalancePopupDo('edit', clickedBalanceEl, itemsHtml);
                                }
                                else if (result.php_result == 'ERROR')
                                {
                                    console.log(result.php_error_msg);
                                };
                            },
                            complete: function (result)
                            {
                                pleaseWaitClose();
                            },
                            error: function (request, status, error)
                            {
                                // we recieved NOT json
                            }
                        });

                    });

                    // toDo Kainax: add on_click for tag
                    // $('#tagBalanceListWrap .tag:first').parent().click(function ()
                    // {
                    //     tagBalancePopupDo('edit', $(this));
                    // });

                    sortEditorBalanceTags();
                }
                else if (result.php_result == 'ERROR')
                {
                    console.log(result.php_error_msg);
                };
        },
        complete: function (result)
        {
            pleaseWaitClose();
        },
        error: function (request, status, error)
        {
            // we recieved NOT json
            console.log(error);
            pleaseWaitClose();
        }
    });
}


function ajaxGetTagsArray(callbackNextFunction)
{
    pleaseWaitOpen();

    $.ajax({
        url: 'php/ajax.editor.php',
        data: {  ajaxType: 'getAllTags'
              },
        datatype: 'jsonp',
        type: 'POST',
        cache: false,
        success: function (result)
        {
            if (result.php_result == 'OK')
            {
                callbackNextFunction(result.tag_array);
            }
            else if (result.php_result == 'ERROR')
            {
                console.log(result.php_error_msg);
            };

            pleaseWaitClose();
        },
        complete: function (result)
        {

        },
        error: function (request, status, error)
        {
            // we recieved NOT json
            console.log(error);
            pleaseWaitClose();
        }
    });
}

function rebuildEditorTags(tagsList)
{
    // -- rebuld tags
    var tagListEl = $('#tagListWrap');
    tagListEl.html('');

    colorizeAllHeroes();

    for (var i = 0; i < tagsList.length; i++)
    {
        tagListEl.append('<span class="tag" data-tag-id="'+tagsList[i]['id']+'" data-tag-name="'+tagsList[i]['name']+'">['+tagsList[i]['name']+']</span>');
    }

    // add click listener
    tagListEl.find('.tag').click(function ()
    {
        if ($(this).hasClass('selectedTag'))
        {
            // tag off
            $(this).removeClass('selectedTag');

            colorizeAllHeroes();

        } else
        {
            // tag on
            $('.selectedTag').removeClass('selectedTag');
            $(this).addClass('selectedTag');

            var selectedTagName = $(this).text();
            $('.editHeroTagInfoText').each(function ()
            {
                $(this).html(
                    $(this).attr('data-template-text').replace(/{TAG}/, '<span id="editHeroTagTagName" class="greenBold">'+selectedTagName+'</span>')
                );
            });

            // show minus and rename btns
            $('#btnDeleteSelectedTagPopup').show();
            $('#btnRenameSelectedTagPopup').show();

            pleaseWaitOpen();

            $.ajax({
                url: 'php/ajax.editor.php',
                data: {  ajaxType: 'getHeroesWithSelectedTag'
                          ,tagId : $(this).attr('data-tag-id')
                        },
                datatype: 'jsonp',
                type: 'POST',
                cache: false,
                success: function (result)
                {
                    if (result.php_result == 'OK')
                    {
                        if (result.hero_id_and_value_array == "NONE")
                        {
                            $('.heroListImg').each(function ()
                            {
                                $(this).addClass('grayscale');
                                $(this).find('.heroTagValue').html('');
                            });
                        } else
                        {
                            $('.heroListImg').each(function ()
                            {
                                var isFound = false;
                                for (var i = 0; i < result.hero_id_and_value_array.length; i++)
                                {
                                    if ($(this).attr('data-hero-id') == (result.hero_id_and_value_array[i]['id']))
                                    {
                                        isFound = true;
                                        break;
                                    }
                                }

                                var heroTagValueSpan = $(this).find('.heroTagValue');
                                if (isFound)
                                {
                                    heroTagValueSpan.html(result.hero_id_and_value_array[i]['value']);
                                    heroTagValueSpan.css('margin-left', ($(this).width() / 2) - (heroTagValueSpan.width() / 2) + 'px');
                                    $(this).removeClass('grayscale');
                                } else {
                                    heroTagValueSpan.html('');
                                    $(this).addClass('grayscale');
                                }
                            });
                        }
                        // callbackNextFunction(result.tag_array);
                    }
                    else if (result.php_result == 'ERROR')
                    {
                        console.log(result.php_error_msg);
                    };

                    if ((typeof window.globalClickedHeroId != 'undefined') && (window.globalClickedHeroId != ''))
                    {
                        var selectedHeroId = window.globalClickedHeroId;
                        window.globalClickedHeroId = '';
                        $('.heroListImg[data-hero-id="'+selectedHeroId+'"]').trigger('click');
                        // выполнить клик на героя с id asdLocal
                    }
                },
                complete: function (result)
                {
                    pleaseWaitClose();
                },
                error: function (request, status, error)
                {
                    // we recieved NOT json
                    console.log(error);
                }
            });

        }

        sortEditorBalanceTags();
    });
}


function getTagHeroes(curTagId)
{
    pleaseWaitOpen();

    $.ajax({
        url: 'php/ajax.editor.php',
        data: {  ajaxType: 'getTagHeroes'
                  , tagId: curTagId
                },
        datatype: 'jsonp',
        type: 'POST',
        cache: false,
        success: function (result)
        {
            if (result.php_result == 'OK')
            {
                callbackNextFunction(result.tag_array);
            }
            else if (result.php_result == 'ERROR')
            {
                console.log(result.php_error_msg);
            };

            pleaseWaitClose();
        },
        complete: function (result)
        {

        },
        error: function (request, status, error)
        {
            // we recieved NOT json
            console.log(error);
            pleaseWaitClose();
        }
    });
}

function editHeroTagDecideInfoText()
{
    if ($('.heroAbilityImg.selectedAbility').length)
    {
                    $('#editHeroTagInfoNone, #editHeroTagInfoHero').hide();
                    $('#editHeroTagInfoAbilities').show();
    }
    else if ($('#editHeroTagHeroImgWrap.selectedAbility').length)
    {
                    $('#editHeroTagInfoNone , #editHeroTagInfoAbilities').hide();
                    $('#editHeroTagInfoHero').show();
    } else
    {
                    $('#editHeroTagInfoHero, #editHeroTagInfoAbilities').hide();
                    $('#editHeroTagInfoNone').show();
    }
}

function bindInputTagAlreadyExists(inputSelector)
{
    $(inputSelector).bind('keyup', function ()
    {
        var curInputVal = $.trim($(this).val());
        //console.log(curInputVal);
        if (curInputVal == '')
        {
            $('#noticeTagExist').slideUp();
            $('#btnConfirmDialogOK').attr('disabled', 'disabled');
        } else
        {
            isTagExist = false;
            $('#tagListWrap').find('.tag').each(function ()
            {
                if ($(this).text().toLowerCase() == '['+curInputVal.toLowerCase()+']')
                {
                    // tag already exist
                    isTagExist = true;
                    return false; //break
                }
            });

            if (isTagExist)
            {
                $('#noticeTagExist').slideDown();
                $('#btnConfirmDialogOK').attr('disabled', 'disabled');
            } else {
                $('#noticeTagExist').slideUp();
                $('#btnConfirmDialogOK').removeAttr('disabled');
            }
        }
    });
}

function editBalancePopupDecideBtnCreate()
{
    var editBalancePopupEl = $('#editBalancePopupHtml');
    var textareaEl = $('#balanceTagTextarea');
    var combo1Val = editBalancePopupEl.find('#combobox1 input').val();
    var combo2Val = editBalancePopupEl.find('#combobox2 input').val();
    var sliderValue = $("#editBalanceTagSlider").slider('value');
    var isCounterPick = ($('[name="counterpickOrSynergy"]:checked').val() == 1);


    if (isCounterPick)
    {
        if (sliderValue != 0)
        {
            textareaEl.attr('placeholder', getPreStr_js('EDITOR', '_DFLT_NOTE_COUNTER_'));
        } else {
            textareaEl.attr('placeholder', ''); // if 0
        }
    } else {
        if (sliderValue > 0)
        {
            textareaEl.attr('placeholder', getPreStr_js('EDITOR', '_DFLT_NOTE_SNRG_'));
        }
        else if (sliderValue < 0)
        {
            textareaEl.attr('placeholder', getPreStr_js('EDITOR', '_DFLT_NOTE_ANTISNRG_'));
        } else {
            textareaEl.attr('placeholder', ''); // if 0
        }
    }

    if (sliderValue > 0)
    {
        editBalancePopupEl.removeClass('sliderLess').addClass('sliderMore');
        if (isCounterPick)
        {
            editBalancePopupEl.removeClass('rrred').removeClass('gggreen');
        } else
        {
            editBalancePopupEl.removeClass('rrred').addClass('gggreen');
        }
    } else if (sliderValue < 0)
    {
        if (isCounterPick)
        {
            editBalancePopupEl.removeClass('rrred').removeClass('gggreen');
        } else
        {
            editBalancePopupEl.removeClass('gggreen').addClass('rrred');
        }
        editBalancePopupEl.removeClass('sliderMore').addClass('sliderLess');
    } else {
        editBalancePopupEl.removeClass('sliderLess').removeClass('sliderMore').removeClass('rrred').removeClass('gggreen').removeClass('cccolorForSynergy');
    }

    var isBothComboboxNotEmpty = ((combo1Val != '') && (combo2Val != ''));
    var isBothComboboxDifferent = (combo1Val != combo2Val);
    var isSliderValueZero = (sliderValue == 0);

    var isBtnEnabled;

    if ((isSliderValueZero) || (!isBothComboboxNotEmpty))
    {
        isBtnEnabled = false;
    } else {
        if (isCounterPick)
        {
            if (isBothComboboxDifferent)
            {
                isBtnEnabled = true;
            } else {
                isBtnEnabled = false;
            }
        } else {
            // if synergy
            isBtnEnabled = true;
        }
    }

    if (isBtnEnabled)
    {
        var textareaValue = $('#balanceTagTextarea').val();

        var isFoundH1 = (textareaValue.match(/{h1}/gi) || []).length;
        var isFoundA1 = (textareaValue.match(/{a1}/gi) || []).length;
        var isFoundH2 = (textareaValue.match(/{h2}/gi) || []).length;
        var isFoundA2 = (textareaValue.match(/{a2}/gi) || []).length;

        // {h1} часто собирает {item:SB}, а у {h2} есть {a2}
        if ((textareaValue == '')
        || (isFoundH1 == 1 && isFoundH2 ==1 && isFoundA1 <= 1 && isFoundA2 <= 1))
        {
            isBtnEnabled = true;
        } else {
            isBtnEnabled = false;
        }
    }

    if (isBtnEnabled)
    {
        $('#btnConfirmDialogOK').removeAttr('disabled');
    } else {
        $('#btnConfirmDialogOK').attr('disabled', 'disable');
    }

    changeNotesWrapHtml();
}

function rebuildAll(tagsArray)
{
    rebuildEditorTags(tagsArray);
    rebuildEditorBalanceTags();
}

function tagBalancePopupDo(addOrEdit, clickedEl, htmlForItems)
{
    var question = '';
    question += '<div id="balanceRadioWrap">';
        question += '<div class="form-check form-check-inline">';
            question += '<label class="form-check-label">';
                question += '<input class="form-check-input" type="radio" name="counterpickOrSynergy" value="1"> Контрпик';
            question += '</label>';
        question += '</div>';
        question += '<div class="form-check form-check-inline">';
            question += ' <label class="form-check-label">';
                question += ' <input class="form-check-input" type="radio" name="counterpickOrSynergy" value="0"> Синергия';
            question += '</label>';
        question += '</div>';
    question += '</div>';

    question += '<div id="editBalancePopupHtml" class="form-group ui-widget">';
        question += '<div id="combobox1" class="form-group">';
            question += '<select>';
                var selectOptionValues = '';
                $('#tagListWrap .tag').each(function ()
                {
                    selectOptionValues += '<option value="'+$(this).attr('data-tag-id')+'">'+$(this).attr('data-tag-name')+'</option>';
                });
                question += selectOptionValues;
            question += '</select>';
        question += '</div>';


        question += '<div class="form-group">';
            question += '<div id="editBalanceTagSlider">';
                question += '<div id="custom-handle2" class="ui-slider-handle"></div>';
            question += '</div>';
        question += '</div>';

        question += '<div  id="combobox2" class="form-group">';
            question += '<select>';
                question += selectOptionValues;
            question += '</select>';
        question += '</div>';

        question += '<textarea id="balanceTagTextarea" class="form-control" type="text" rows="2">';
        question += '</textarea>';

        question += '<div id="notesWrap"></div>';
        // question += '<div id="itemsWrap"></div>';

    question += '</div>';

    confirmDialog({
        confirmTitle : getPreStr_js('EDITOR', '_SET_BALANCE_')
        ,confirmHtml : question
        ,btnDeleteCaption : 'default'
        ,btnOKCaption : getPreStr_js('EDITOR', '_SET_')
        ,btnCancelCaption : 'default'
        ,btnOKColorClass : 'btn-success'
        ,allowBackClickClose : true
        ,onBeforeShow: function ()
        {
            $('[name="counterpickOrSynergy"]').click(function()
            {
                if ($(this).val() == 1)
                {
                    $('#editBalancePopupHtml').addClass('cccolorForSynergy');
                } else {
                    $('#editBalancePopupHtml').removeClass('cccolorForSynergy');
                }
                editBalancePopupDecideBtnCreate();
            });


            $("#combobox1 select, #combobox2 select").combobox();

            $('#combobox1 input, #combobox2 input').autocomplete({
                select: function(event, ui)
                {
                    $(this).val($(ui.item.option).text());
                    editBalancePopupDecideBtnCreate();
                }
            });

            $('#combobox1 a, #combobox2 a').tooltip({disabled: true});

            var handle2 = $( "#custom-handle2" );
            $("#editBalanceTagSlider").slider({
                max: 50,
                min: -50,
                value: 0,
                range: "min",
                create: function() {
                    handle2.text( $( this ).slider( "value" ) );
                },
                change: function( event, ui )
                {
                    handle2.text( ui.value );
                    $(this).slider('option', 'slide').call($(this), event, ui);
                },
                slide: function( event, ui )
                {
                    handle2.text( ui.value );

                    editBalancePopupDecideBtnCreate();
                }
            });

            $('#balanceTagTextarea').on('keyup', function ()
            {
                editBalancePopupDecideBtnCreate();
            });

            if (addOrEdit == 'new')
            {
                $("#balanceRadioWrap input:first").prop('checked', true);

                // textarea
                $('#balanceTagTextarea').val('');
            }
            else if (addOrEdit == 'edit')
            {
                $("#balanceRadioWrap input").attr('disabled', 'disabled');
                $("#combobox1 select, #combobox2 select").combobox('disable');

                $('#combobox1 select').combobox('value', clickedEl.find('[data-tag-id]:first').attr('data-tag-id'));
                $('#combobox2 select').combobox('value', clickedEl.find('[data-tag-id]:last').attr('data-tag-id'));

                $("#editBalanceTagSlider").slider('value', clickedEl.find('[data-tag-value]').attr('data-tag-value'));

                if (clickedEl.find('[data-tag-settype]').attr('data-tag-settype') == 1)
                {
                    // editing counterPick
                    $("#balanceRadioWrap input:first").prop('checked', true);
                } else {
                    // editing synergy
                    $("#balanceRadioWrap input:last").prop('checked', true);
                }

                // console.log($('#combobox1 option:selected').val());
                $('#btnConfirmDialogDelete').show();

                $('#balanceTagTextarea').val(clickedEl.find('[data-balance-descr]').attr('data-balance-descr'));

                // if ($('#balanceTagTextarea').attr('placeholder') == '')
                // {
                //     var textareaPlaceholderValue = $('#balanceTagTextarea').attr('placeholder');
                //     textareaPlaceholderValue.replace('{h1}', getHeroIcon('ancient_apparition'))
                //                             .replace('{a1}', getAbilityIcon('ancient_apparition_ice_blast'))
                //                             .replace('{h2}', getHeroIcon('alchemist'))
                //                             .replace('{a2}', getAbilityIcon('alchemist_chemical_rage'));

                //     $('#notesWrap').append(textareaPlaceholderValue);

                //     // $("#balanceTagTextarea").html(
                //     //     $("#balanceTagTextarea").html().replace('{h1}', getHeroIcon('ancient_apparition'))
                //     //                                     .replace('{a1}', getAbilityIcon('ancient_apparition_ice_blast'))
                //     //                                     .replace('{h2}', getHeroIcon('alchemist'))
                //     //                                     .replace('{a2}', getAbilityIcon('alchemist_chemical_rage'))
                //     // );
                // } else {
                //     var textareaValue = $('#balanceTagTextarea').val();
                //     textareaValue.replace('{h1}', getHeroIcon('ancient_apparition'))
                //                  .replace('{a1}', getAbilityIcon('ancient_apparition_ice_blast'))
                //                  .replace('{h2}', getHeroIcon('alchemist'))
                //                  .replace('{a2}', getAbilityIcon('alchemist_chemical_rage'));

                //     $('#notesWrap').append(textareaValue);
                // }

                editBalancePopupDecideBtnCreate();
            }

            // add item list to click them for fill input with item shortcut
            $('#notesWrap').after(htmlForItems);

            $('#balanceTagTextarea').on('focus', function()
            {
                if ($(this).val() == '')
                {
                    $(this).val($(this).attr('placeholder'))
                }
            }).on('blur', function()
            {
                if ($(this).val() == $(this).attr('placeholder'))
                {
                    $(this).val('');
                }
            }).on('keyup mouseup focus click', function() {
                window.balanceTagTextareaCaretPos = $(this).prop("selectionStart");
                window.balanceTagTextareaText = $(this).val();                
            });

            // $('#inputCreateNewTagName').focus();
            $('.itemImgWrap').on('click', function() 
            {
                var symbolBeforeCaret = window.balanceTagTextareaText.substring(window.balanceTagTextareaCaretPos-1, window.balanceTagTextareaCaretPos);
                console.log(symbolBeforeCaret);
                if (symbolBeforeCaret == ' ')
                {
                    var clickedItemAliasSingle = '';
                } else {
                    var clickedItemAliasSingle = ' ';
                }
                clickedItemAliasSingle += '{i:' + $(this).find('img').attr('data-item-single') + '}';
                
                var balanceTagTextareaEl = jQuery("#balanceTagTextarea");

                var newTextAreaTxt = window.balanceTagTextareaText.substring(0, window.balanceTagTextareaCaretPos) + clickedItemAliasSingle + window.balanceTagTextareaText.substring(window.balanceTagTextareaCaretPos);
                if (window.balanceTagTextareaText == '')
                {
                    balanceTagTextareaEl.val(balanceTagTextareaEl.attr('placeholder') + newTextAreaTxt);
                } else {
                    balanceTagTextareaEl.val(newTextAreaTxt);
                }
                balanceTagTextareaEl.trigger('keyup');
            });

            $('#btnConfirmDialogOK').attr('disabled', 'disabled');

            eXoActivateInactiveTooltips();            
        }
        ,onAfterShow : function ()
        {

        }
        ,onUserClickedDelete : function ()
        {
            // console.log($('#combobox1 option:selected').val());
            // console.log($('#combobox2 option:selected').val());

            pleaseWaitOpen();
            // $('.tag.selectedTag').click();

            //Ajax
            $.ajax({
                url: 'php/ajax.editor.php',
                data: {  ajaxType: 'editorDeleteTagBalance'
                       , firstTagId: $('#combobox1 option:selected').val()
                       , secondTagId: $('#combobox2 option:selected').val()
                    //    , balanceValue: $('#editBalanceTagSlider').slider('value')
                      },
                datatype: 'jsonp',
                type: 'POST',
                cache: false,
                success: function (result)
                {
                    if (result.php_result == 'OK')
                    {
                        $('#createNewTagPopup').modal('hide');
                        rebuildEditorBalanceTags();
                        // ajaxGetTagsArray(rebuildEditorTags);
                    }
                    else if (result.php_result == 'ERROR')
                    {
                        console.log(result.php_error_msg);
                    };
                },
                complete: function (result)
                {
                    pleaseWaitClose();
                },
                error: function (request, status, error)
                {
                    // we recieved NOT json
                }
            });
        }
        ,onUserClickedOK : function ()
        {
            pleaseWaitOpen();
            // $('.tag.selectedTag').click();

            //Ajax
            $.ajax({
                url: 'php/ajax.editor.php',
                data: {  ajaxType: 'editorAddNewTagBalance'
                       , firstTagId: $('#combobox1 option:selected').val()
                       , secondTagId: $('#combobox2 option:selected').val()
                       , balanceValue: $('#editBalanceTagSlider').slider('value')
                       , setType: $('[name="counterpickOrSynergy"]:checked').val()
                       , textareaValue: $('#balanceTagTextarea').val()
                      },
                datatype: 'jsonp',
                type: 'POST',
                cache: false,
                success: function (result)
                {
                    if (result.php_result == 'OK')
                    {
                        $('#createNewTagPopup').modal('hide');
                        rebuildEditorBalanceTags();
                        // ajaxGetTagsArray(rebuildEditorTags);
                    }
                    else if (result.php_result == 'ERROR')
                    {
                        console.log(result.php_error_msg);
                    };
                },
                complete: function (result)
                {
                    pleaseWaitClose();
                },
                error: function (request, status, error)
                {
                    // we recieved NOT json
                }
            });
        }
        ,onUserClickedCancel : function ()
        {
            //
        }
    });
}


function changeNotesWrapHtml()
{
    if ($('#balanceTagTextarea').val() != '')
    {
        var textareaValue = $('#balanceTagTextarea').val();
    } else {
        var textareaValue = $('#balanceTagTextarea').attr('placeholder');
    }

    var indexOfItem = textareaValue.indexOf('{i:');
    var indexOfEndOfItem = textareaValue.indexOf('}', indexOfItem);
    var itemSliceResult = textareaValue.slice(indexOfItem+3, indexOfEndOfItem);
    var itemSliceResultForReplace = '{i:'+itemSliceResult+'}';

    if(typeof window.itemList[itemSliceResult] != 'undefined')
    {
        textareaValue = textareaValue.replace(itemSliceResultForReplace, getItemIcon(window.itemList[itemSliceResult]['itemCodename'], window.itemList[itemSliceResult]['itemName']));
    }

    textareaValue = textareaValue.replace(/{h1}/gi, getHeroIcon('ancient_apparition', 'Ancient Apparition'))
                                 .replace(/{a1}/gi, getAbilityIcon('ancient_apparition_ice_blast', 5348))
                                 .replace(/{h2}/gi, getHeroIcon('alchemist', 'Alchemist'))
                                 .replace(/{a2}/gi, getAbilityIcon('alchemist_chemical_rage', 5369));

    $('#notesWrap').html(textareaValue);

    eXoActivateInactiveTooltips();
    addOnHoverTooltipsForAbilityImg('#notesWrap');
}
