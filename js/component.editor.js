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
        question += '<label for="recipient-name" class="col-form-label">'+getPreStr_js('EDITOR', '_TAG_NAME_')+'</label>';
        question += '<input id="inputCreateNewTagName" type="text" class="form-control">';
        question += '<p id="noticeTagExist" class="noticeRed" style="display: none;">'+getPreStr_js('EDITOR', '_TAG_EXIST_')+'</p>';
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
                $('#noticeTagExist').hide();
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
                    datatype: 'json',
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
    $('#btnCreateNewBalancePopup').click(function ()
    {
        var question = '';
        question += '<div class="form-group ui-widget">';
        question += '<select id="combobox1">';
            question += '<option value="1">One</option>';
            question += '<option value="2">Two</option>';
            question += '<option value="3">Three</option>';
        question += '</select>';

        question += '<span> VS </span>';

        question += '<select id="combobox2">';
            question += '<option value="1">One</option>';
            question += '<option value="2">Two</option>';
            question += '<option value="3">Three</option>';
        question += '</select>';

        question += '<label for="recipient-name" class="col-form-label">'+getPreStr_js('EDITOR', '_TAG_NAME_')+'</label>';
        //question += '<input id="inputCreateNewBalanceName" type="text" class="form-control">';
        //question += '<p id="noticeTagExist" class="noticeRed" style="display: none;">'+window.LangPreStr["editor"]["tag_exist"]+'</p>';
        question += '</div>';

        confirmDialog({
            confirmTitle : getPreStr_js('EDITOR', '_CREATE_BALANCE_')
            ,confirmHtml : question
            ,btnOKCaption : getPreStr_js('EDITOR', '_CREATE_')
            ,btnCancelCaption : 'default'            
            ,btnOKColorClass : 'btn-success'
            ,allowBackClickClose : true
            //,dialogWidth: '800px'
            ,onBeforeShow: function ()
            {
                $('#inputCreateNewTagName').val('');
                $('#btnConfirmDialogOK').attr('disabled', 'disabled');
                bindInputTagAlreadyExists('#inputCreateNewTagName');
                $('#noticeTagExist').hide();

                $("#combobox1").combobox();
                $("#combobox2").combobox();

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
                    datatype: 'json',
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


    // on page load
    ajaxGetTagsArray(rebuildEditorTags);

    

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
                            datatype: 'json',
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
        question += '<input id="inputRenameTagName" type="text" class="form-control" value="'+$('#tagListWrap .selectedTag').text()+'">';
        question += '<p id="noticeTagExist" class="noticeRed" style="display: none;">'+getPreStr_js('EDITOR', '_TAG_EXIST_')+'</p>';
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
                $('#noticeTagExist').hide();
            }
            ,onAfterShow : function ()
            {
                $('#inputRenameTagName').focus();
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
                    datatype: 'json',
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
                datatype: 'json',
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
            datatype: 'json',
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
                            datatype: 'json',
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


function ajaxGetTagsArray(callbackNextFunction)
{
    pleaseWaitOpen();

    $.ajax({
        url: 'php/ajax.editor.php',
        data: {  ajaxType: 'getAllTags'
              },
        datatype: 'json',
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

function rebuildEditorTags(tagsList)
{
    // -- rebuld tags
    var tagListEl = $('#tagListWrap');
    tagListEl.html('');

    colorizeAllHeroes();

    for (var i = 0; i < tagsList.length; i++) 
    {
        tagListEl.append('<span class="tag" data-tag-id="'+tagsList[i]['id']+'" data-tag-name'+tagsList[i]['name']+'">['+tagsList[i]['name']+']</span>');
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
                datatype: 'json',
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
                                for (i = 0; i < result.hero_id_and_value_array.length; i++)
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
        datatype: 'json',
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