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

    $('#editHeroTagHeroImgWrap img').click(function ()
    {
        if ($(this).toggleClass('selectedAbility').hasClass('selectedAbility'))
        {
            $('#editHeroTagAbilitiesImgWrap img').removeClass('selectedAbility');
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

            $('#editHeroTagHeroName').text( curSelectedHeroEl.attr('data-hero-name') );
            //     .attr( 'data-hero-id', clickedheroId )
            //     .attr( 'data-hero-codename', curSelectedHeroEl.attr('data-hero-codename'));

            $('#editHeroTagHeroImgWrap img')
                .attr('src', '//cdn.dota2.com/apps/dota2/images/heroes/'+curSelectedHeroEl.attr('data-hero-codename')+'_full.png?v=4212550');

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
                            editHeroAbilitiesImgWrapEl.append('<img class="heroAbilityImg" data-ability-id="'+result.hero_abilities_array[i]['id']+'" data-ability-codename="'+result.hero_abilities_array[i]['abilityCodename']+'" src="//cdn.dota2.com/apps/dota2/images/abilities/'+result.hero_abilities_array[i]['abilityCodename']+'_hp1.png?v=4195662">');
                        }

                        $('.heroAbilityImg').click(function ()
                        {
                            $(this).toggleClass('selectedAbility');

                            $('#editHeroTagHeroImgWrap img').removeClass('selectedAbility');

                            editHeroTagDecideInfoText();
                        });

                        var tooltipYoffset = -180;

                        addOnHoverTooltipsForAbilityImg('#editHeroTagAbilitiesImgWrap', tooltipYoffset);

                        if (result.tag_result == 'NONE')
                        {
                            $('#editHeroTagHeroImgWrap .selectedAbility').removeClass('selectedAbility');
                            $('#btnEditHeroTagUnset').hide();
                            //tagValue
                        } else if (result.tag_result == 'HERO')
                        {
                            //$('#editHeroTagAbilitiesImgWrap .selectedAbility').removeClass('selectedAbility');
                            $('#editHeroTagHeroImgWrap .selectedAbility').addClass('selectedAbility');
                            //tag_value added
                            $('#editHeroTagSlider').slider('value', result.tag_value);
                            $('#btnEditHeroTagUnset').show();
                        } else {
                            $('#editHeroTagHeroImgWrap .selectedAbility').removeClass('selectedAbility');

                            var selectedTagsIdArray = result.tag_result.split(' ');
                            for (var i = 0; i < selectedTagsIdArray.length; i++)
                            {
                                $('#editHeroTagAbilitiesImgWrap [data-ability-id="'+selectedTagsIdArray[i]+'"]').addClass('selectedAbility');
                            }
                            //tag_value added
                            $('#editHeroTagSlider').slider('value', result.tag_value);
                            $('#btnEditHeroTagUnset').show();
                        }

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
        $('#editHeroTagAbilitiesImgWrap img.selectedAbility').each(function ()
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



    $('#btnEditHeroTagUnsetCancel').click(function ()
    {
        $('#editHeroTagPopup').modal();
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

//nurax
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
                        var firstBalanceTagId = balanceTagsList[i]['firstTagId'];
                        var secondBalanceTagId = balanceTagsList[i]['secondTagId'];
                        var balanceTagValue = balanceTagsList[i]['value'];

                        var firstBalanceTagName = $('#tagListWrap .tag[data-tag-id="'+firstBalanceTagId+'"]').attr('data-tag-name');
                        var secondBalanceTagName = $('#tagListWrap .tag[data-tag-id="'+secondBalanceTagId+'"]').attr('data-tag-name');

                        if (result.balance_tag_array[i]['setType'] == 1)
                        {
                            if (balanceTagValue > 0)
                            {
                                tagBalanceListEl.append('<div><div class="balanceTag noticeGreen" data-tag-id="'+firstBalanceTagId+'" data-tag-value="'+balanceTagValue+'" data-tag-name="'+ firstBalanceTagName +'">('+ balanceTagValue +')</div><div class="balanceTag noticeGreen"> [' + firstBalanceTagName + ']</div> <div class="balanceTag"><></div> <div class="balanceTag noticeGreen" data-tag-id="' + secondBalanceTagId + '" data-tag-name="'+ secondBalanceTagName +'">[' + secondBalanceTagName + ']</div><div class="balanceTag noticeGreen"> ('+balanceTagValue+')</div></div>');
                            } else {
                                tagBalanceListEl.append('<div><div class="balanceTag noticeRed" data-tag-id="'+firstBalanceTagId+'" data-tag-value="'+balanceTagValue+'" data-tag-name="'+ firstBalanceTagName +'">('+ balanceTagValue +')</div><div class="balanceTag noticeRed"> [' + firstBalanceTagName + ']</div> <div class="balanceTag"><></div> <div class="balanceTag noticeRed" data-tag-id="' + secondBalanceTagId + '" data-tag-name="'+ secondBalanceTagName +'">[' + secondBalanceTagName + ']</div><div class="balanceTag noticeRed"> ('+balanceTagValue+')</div></div>');
                            }
                        } else {
                            tagBalanceListEl.append('<div><div class="balanceTag noticeGreen" data-tag-id="'+firstBalanceTagId+'" data-tag-value="'+balanceTagValue+'" data-tag-name="'+ firstBalanceTagName +'">('+ balanceTagValue +')</div><div class="balanceTag noticeGreen"> [' + firstBalanceTagName + ']</div> <div class="balanceTag">VS</div> <div class="balanceTag noticeRed" data-tag-id="' + secondBalanceTagId + '" data-tag-name="'+ secondBalanceTagName +'">[' + secondBalanceTagName + ']</div><div class="balanceTag noticeRed"> ('+(balanceTagValue * -1)+')</div></div>');
                        }
                    }
                }

                // $('#tagBalanceListWrap .tag:first').parent().click(function ()
                // {
                //     tagBalancePopupDo('edit', $(this));
                // });


                $('#tagBalanceListWrap div').click(function ()
                {
                    tagBalancePopupDo('edit', $(this));
                });


                // $('#tagBalanceListWrap [data-tag-name="'+ balanceTagsList[i] +'"]').attr('data-tag-name');

                // add click listener
                // tagListEl.find('.tag').click(function ()
                // {
                //     if ($(this).hasClass('selectedTag'))
                //     {
                //         // tag off
                //         $(this).removeClass('selectedTag');

                //         colorizeAllHeroes();

                //     } else
                //     {
                //         // tag on
                //         $('.selectedTag').removeClass('selectedTag');
                //         $(this).addClass('selectedTag');

                //         var selectedTagName = $(this).text();
                //         $('.editHeroTagInfoText').each(function ()
                //         {
                //             $(this).html(
                //                 $(this).attr('data-template-text').replace(/{TAG}/, '<span id="editHeroTagTagName" class="greenBold">'+selectedTagName+'</span>')
                //             );
                //         });

                //         // show minus and rename btns
                //         $('#btnDeleteSelectedTagPopup').show();
                //         $('#btnRenameSelectedTagPopup').show();

                //         pleaseWaitOpen();

                //         $.ajax({
                //             url: 'php/ajax.editor.php',
                //             data: {  ajaxType: 'getHeroesWithSelectedTag'
                //                       ,tagId : $(this).attr('data-tag-id')
                //                     },
                //             datatype: 'jsonp',
                //             type: 'POST',
                //             cache: false,
                //             success: function (result)
                //             {
                //                 if (result.php_result == 'OK')
                //                 {
                //                     if (result.hero_id_and_value_array == "NONE")
                //                     {
                //                         $('.heroListImg').each(function ()
                //                         {
                //                             $(this).addClass('grayscale');
                //                             $(this).find('.heroTagValue').html('');
                //                         });
                //                     } else
                //                     {
                //                         $('.heroListImg').each(function ()
                //                         {
                //                             var isFound = false;
                //                             for (var i = 0; i < result.hero_id_and_value_array.length; i++)
                //                             {
                //                                 if ($(this).attr('data-hero-id') == (result.hero_id_and_value_array[i]['id']))
                //                                 {
                //                                     isFound = true;
                //                                     break;
                //                                 }
                //                             }

                //                             var heroTagValueSpan = $(this).find('.heroTagValue');
                //                             if (isFound)
                //                             {
                //                                 heroTagValueSpan.html(result.hero_id_and_value_array[i]['value']);
                //                                 heroTagValueSpan.css('margin-left', ($(this).width() / 2) - (heroTagValueSpan.width() / 2) + 'px');
                //                                 $(this).removeClass('grayscale');
                //                             } else {
                //                                 heroTagValueSpan.html('');
                //                                 $(this).addClass('grayscale');
                //                             }
                //                         });
                //                     }
                //                     // callbackNextFunction(result.tag_array);
                //                 }
                //                 else if (result.php_result == 'ERROR')
                //                 {
                //                     console.log(result.php_error_msg);
                //                 };
                //             },
                //             complete: function (result)
                //             {
                //                 pleaseWaitClose();
                //             },
                //             error: function (request, status, error)
                //             {
                //                 // we recieved NOT json
                //                 console.log(error);
                //             }
                //         });

                //     }

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
    if ($('#editHeroTagAbilitiesImgWrap img.selectedAbility').length)
    {
        $('#editHeroTagInfoNone, #editHeroTagInfoHero').hide();
        $('#editHeroTagInfoAbilities').show();
        //$('#btnEditHeroTagDo').removeAttr('disabled', 'disabled');
    }
    else if ($('#editHeroTagHeroImgWrap img.selectedAbility').length)
    {
        $('#editHeroTagInfoNone , #editHeroTagInfoAbilities').hide();
        $('#editHeroTagInfoHero').show();
        //$('#btnEditHeroTagDo').removeAttr('disabled', 'disabled');
    } else
    {
        $('#editHeroTagInfoHero, #editHeroTagInfoAbilities').hide();
        $('#editHeroTagInfoNone').show();
        //$('#btnEditHeroTagDo').attr('disabled', 'disabled');
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
    if (($('#combobox1 input').val() != '') && ($('#combobox2 input').val() != '')
    && ($('#combobox1 input').val() != $('#combobox2 input').val())
    )
    {
        var var1 = true;
    } else {
        var var1 = false;
    }

    // for synergy
    if (($('#combobox1 input').val() != '') && ($('#combobox2 input').val() != '')
    && ($('#combobox1 input').val() == $('#combobox2 input').val())
    )
    {
        var var3 = true;
    } else {
        var var3 = false;
    }

    if (($( "#editBalanceTagSlider" ).slider('value') != 0))
    {
        var var2 = true;
    } else {
        var var2 = false;
    }

    if ($('[name="counterpickOrSynergy"]:checked').val() == 1)
    {
        if (var2 && var3)
        {
            $('#btnConfirmDialogOK').removeAttr('disabled');
        } else {
            $('#btnConfirmDialogOK').attr('disabled', 'disable');
        }
    } else {
        if (var1 && var2)
        {
            $('#btnConfirmDialogOK').removeAttr('disabled');
        } else {
            $('#btnConfirmDialogOK').attr('disabled', 'disable');
        } 
    }

    // if (var1 && var2)
    // {
    //     $('#btnConfirmDialogOK').removeAttr('disabled');
    // } else {
    //     $('#btnConfirmDialogOK').attr('disabled', 'disable');
    // }
}

function rebuildAll(tagsArray)
{
    rebuildEditorTags(tagsArray);
    rebuildEditorBalanceTags();
}

function tagBalancePopupDo(addOrEdit, clickedEl)
{
    var question = '';

    question += '<div class="form-check form-check-inline">';
        question += '<label class="form-check-label">';
        question += '<input class="form-check-input" type="radio" name="counterpickOrSynergy" checked="checked" value="0"> Контрпик';
        question += '</label>';
    question += '</div>';
    question += '<div class="form-check form-check-inline">';
       question += ' <label class="form-check-label">';
       question += ' <input class="form-check-input" type="radio" name="counterpickOrSynergy" value="1"> Синергия';
       question += '</label>';
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
                // console.log( $(this).val() );
                
                // Написать чтоб при клике на радио кнопки срабатывал слайд или чендж, 
                // чтобы менялся дизейблд у кнопки назначения, а пока просто при клике отключаем кнопку
                $('#btnConfirmDialogOK').attr('disabled', 'disable');
            });

            // console.log($('[name="counterpickOrSynergy"]:checked').val());

            $("#combobox1 select, #combobox2 select").combobox();

            $('#combobox1 input, #combobox2 input').autocomplete({
                select: function()
                {
                    //console.log($('#combobox1 option:selected').val());
                    editBalancePopupDecideBtnCreate();
                },
                search: function()
                {
                    editBalancePopupDecideBtnCreate();
                }
            });
            //$("#combobox2 select").combobox();
            $('#combobox1 a, #combobox2 a').tooltip({
                disabled: true
              });

            var handle2 = $( "#custom-handle2" );
            $( "#editBalanceTagSlider" ).slider({
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

                if (ui.value > 0)
                {
                    $('#editBalancePopupHtml').removeClass('sliderLess').addClass('sliderMore');
                    if ($('[name="counterpickOrSynergy"]:checked').val() == 1) 
                    {
                        $('#editBalancePopupHtml').removeClass('rrred').addClass('gggreen');
                    } else 
                    {
                        $('#editBalancePopupHtml').removeClass('rrred').removeClass('gggreen');
                    }
                } else if (ui.value < 0)
                {
                    if ($('[name="counterpickOrSynergy"]:checked').val() == 1) 
                    {
                        $('#editBalancePopupHtml').removeClass('gggreen').addClass('rrred');
                    } else 
                    {
                        $('#editBalancePopupHtml').removeClass('rrred').removeClass('gggreen');
                    }
                    $('#editBalancePopupHtml').removeClass('sliderMore').addClass('sliderLess');
                    // $('#editBalancePopupHtml').removeClass('gggreen').addClass('rrred');
                } else {
                    $('#editBalancePopupHtml').removeClass('sliderLess').removeClass('sliderMore');
                    // $('#editBalancePopupHtml').removeClass('rrred').removeClass('gggreen');
                }

                editBalancePopupDecideBtnCreate();
              }
            });

            // if (addOrEdit == 'new')
            // {
            //     $('#btnConfirmDialogDelete').hide();
            // }

            if (addOrEdit == 'edit')
            {
                $("#combobox1 select, #combobox2 select").combobox('disable');

                $('#combobox1 select').combobox('value', clickedEl.find('span:first').attr('data-tag-id'));
                $('#combobox2 select').combobox('value', clickedEl.find('span:last').attr('data-tag-id'));

                $( "#editBalanceTagSlider" ).slider('value', clickedEl.find('span:first').attr('data-tag-value'));

                // console.log($('#combobox1 option:selected').val());
                $('#btnConfirmDialogDelete').show();
                //todo: add delete button
            }

            // $('#inputCreateNewTagName').val('');
            $('#btnConfirmDialogOK').attr('disabled', 'disabled');
            // bindInputTagAlreadyExists('#inputCreateNewTagName');
            // $('#noticeTagExist').hide();
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