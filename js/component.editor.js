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
        tagBalancePopupDo('new', '');
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
                                    //$('#editHeroTagPopup').modal('hide');
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

            mainHeroImgWrapEl = $('#editHeroTagHeroImgWrap');
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
                    if (result.php_result == 'OK')
                    {
                        for (var i = 0; i < result.hero_abilities_array.length; i++)
                        {
                            editHeroAbilitiesImgWrapEl.append('<div class="heroAbilityImg" data-ability-id="'+result.hero_abilities_array[i]['id']+'" data-ability-codename="'+result.hero_abilities_array[i]['abilityCodename']+'"><img data-img-src="//cdn.dota2.com/apps/dota2/images/abilities/'+result.hero_abilities_array[i]['abilityCodename']+'_hp1.png?v=4195662"></div>');
                        }

                        $('.heroAbilityImg').click(function ()
                        {
                            // remove from hero picture
                            mainHeroImgWrapEl.removeClass('selectedAbility');

                            // toggle on ability
                            $(this).toggleClass('selectedAbility');

                            editHeroTagDecideInfoText();
                        });

                        var tooltipYoffset = -180;

                        addOnHoverTooltipsForAbilityImg('#editHeroTagAbilitiesImgWrap', tooltipYoffset);

                        if (result.tag_result == 'NONE')
                        {
                            $('#editHeroTagHeroImgWrap.selectedAbility').removeClass('selectedAbility');
                            $('#btnEditHeroTagUnset').hide();
                            //tagValue
                        } else if (result.tag_result == 'HERO')
                        {
                            //$('#editHeroTagAbilitiesImgWrap .selectedAbility').removeClass('selectedAbility');
                            $('#editHeroTagHeroImgWrap.selectedAbility').addClass('selectedAbility');
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
        }
    });

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
                    //ajaxGetTagsArray(rebuildEditorTags);
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




    function searchAllAbilitiesTextDo()
    {
        var abilitySearchVal = $.trim($('#searchAbilityInput').val().toLowerCase());
        if (abilitySearchVal != '')
        {
            if (typeof window.abilityData != 'undefined')
            {            
                $('[data-hero-codename]').each(function ()
                {
                    var heroEl = $(this);
                    var curHeroCodename = heroEl.attr('data-hero-codename');
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
                            ((window.abilityDataEnglish[keyAbilityCodename]['dname']).toLowerCase().indexOf($.trim(abilitySearchVal)) !== -1)))
                            {
                                tooltipText += ' ';
                            }
            
                            if ((window.abilityData[keyAbilityCodename]['affects'].toLowerCase().indexOf(abilitySearchVal) != -1)
                            ||
                            (((window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish != 'undefined')) &&
                            (window.abilityDataEnglish[keyAbilityCodename]['affects'].toLowerCase().indexOf($.trim(abilitySearchVal)) !== -1)))
                            {
                                tooltipText += '<div class="abilityTarget">'+window.abilityData[keyAbilityCodename]['affects']+'</div>';
                            }
            
                            if (((window.abilityData[keyAbilityCodename]['desc']).toLowerCase().indexOf(abilitySearchVal) !== -1)
                            ||
                            (((window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish != 'undefined')) &&
                            ((window.abilityDataEnglish[keyAbilityCodename]['desc']).toLowerCase().indexOf(abilitySearchVal) !== -1)))
                            {
                                tooltipText += '<div class="abilityDesc">'+window.abilityData[keyAbilityCodename]['desc']+'</div>';
                            }
            
                            if (((window.abilityData[keyAbilityCodename]['notes']).toLowerCase().indexOf(abilitySearchVal) !== -1)
                            ||
                            (((window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish != 'undefined')) &&
                            ((window.abilityDataEnglish[keyAbilityCodename]['notes']).toLowerCase().indexOf(abilitySearchVal) !== -1)))
                            {
                                tooltipText += '<div class="abilityNotes">'+window.abilityData[keyAbilityCodename]['notes']+'</div>';
                            }
            
                            if (tooltipText != '')
                            {
                                heroTooltipAllFoundAbilitiesText += '<div id="abilityTooltip"><div class="iconTooltip iconTooltip_ability">'+window.abilityData[keyAbilityCodename]['dname']+tooltipText+'</div></div>';
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
            $('.heroListImgOpacity').removeClass('heroListImgOpacity');
            $('[data-extra-tooltip]').removeAttr('data-extra-tooltip');
        }
    }    

    // ability search
    $('#searchAbilityInput')
    .on('keyup', function ()
    {
        if ((window.curUserLang != 'en_UK') && (typeof window.abilityDataEnglish == 'undefined'))
        {
            window.searchAbilityTextBeforeBlur = $(this).val();
            $(this).blur();

                pleaseWaitOpen();
                $.ajax({
                    url: 'https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&callback=loretwo&l=english'
                    ,dataType:  'jsonp'
                    ,jsonpCallback: 'loretwo'
                    ,success: function(data)
                    {
                        pleaseWaitClose();
                        window.abilityDataEnglish = data["abilitydata"];
                       $('#searchAbilityInput').val(window.searchAbilityTextBeforeBlur).focus();
                       searchAllAbilitiesTextDo();                       
                    }
                });
        } else {
            searchAllAbilitiesTextDo();
        }
    }).on('blur', function ()
    {
        $(this).val('');
        $('.heroListImgOpacity').removeClass('heroListImgOpacity');
        $('[data-extra-tooltip]').removeAttr('data-extra-tooltip');
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
                        var firstBalanceTagName = $('#tagListWrap .tag[data-tag-id="'+firstBalanceTagId+'"]').attr('data-tag-name');
                        var secondBalanceTagName = $('#tagListWrap .tag[data-tag-id="'+secondBalanceTagId+'"]').attr('data-tag-name');

                            var balanceRowHtml = '';
                            balanceRowHtml += '<div class="tagBalanceItem">';

                                balanceRowHtml += '<div class="'+firstBalanceTagClass+'" data-tag-id="'+firstBalanceTagId+'" data-tag-name="'+firstBalanceTagName+'" data-tag-value="'+firstBalanceTagValue+'" data-tag-settype="'+balanceSetType+'">';
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
                        tagBalancePopupDo('edit', $(this));
                    });

                    // toDo Kainax: click for tag
                    // $('#tagBalanceListWrap .tag:first').parent().click(function ()
                    // {
                    //     tagBalancePopupDo('edit', $(this));
                    // });
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
    var combo1Val = editBalancePopupEl.find('#combobox1 input').val();
    var combo2Val = editBalancePopupEl.find('#combobox2 input').val();
    var sliderValue = $("#editBalanceTagSlider").slider('value');
    var isCounterPick = ($('[name="counterpickOrSynergy"]:checked').val() == 1);

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
        $('#btnConfirmDialogOK').removeAttr('disabled');
    } else {
        $('#btnConfirmDialogOK').attr('disabled', 'disable');
    }
}

function rebuildAll(tagsArray)
{
    rebuildEditorTags(tagsArray);
    rebuildEditorBalanceTags();
}

function tagBalancePopupDo(addOrEdit, clickedEl)
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
    question += '</div>';

    // question += '<label for="recipient-name" class="col-form-label">'+getPreStr_js('EDITOR', '_TAG_NAME_')+'</label>';
    //question += '<input id="inputCreateNewBalanceName" type="text" class="form-control">';
    //question += '<p id="noticeTagExist" class="noticeRed" style="display: none;">'+window.LangPreStr["editor"]["tag_exist"]+'</p>';

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
                //$('#btnConfirmDialogOK').attr('disabled', 'disable');
            });

            // console.log($('[name="counterpickOrSynergy"]:checked').val());

            $("#combobox1 select, #combobox2 select").combobox();

            $('#combobox1 input, #combobox2 input').autocomplete({
                select: function(event, ui)
                {
                    //$(this).parent().siblings('select').val($(ui.item.option).val());
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

            if (addOrEdit == 'new')
            {
                $("#balanceRadioWrap input:first").prop('checked', true);
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

                editBalancePopupDecideBtnCreate();
            }

            $('#btnConfirmDialogOK').attr('disabled', 'disabled');
        }
        ,onAfterShow : function ()
        {
            // $('#inputCreateNewTagName').focus();
        }
        ,onUserClickedDelete : function ()
        {
            console.log($('#combobox1 option:selected').val());
            console.log($('#combobox2 option:selected').val());

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