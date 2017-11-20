$(document).ready(function ()
{
    if (typeof window.masterAllHeroesList != 'undefined')
    {
        var missingImagesArray = ['morphling_morph', 'monkey_king_primal_spring_early'];

        // if there ara master data - build full heroes list including muted abilities
        var lastHeroId = -1;
        var heroDivHtml;
        var abilityDivHtml;
        var abilityIgnoreClass;
        var abilityCodenameOrMissingPic;

        for (var i = 0; i < window.masterAllHeroesList.length; i++)
        {
            if (window.masterAllHeroesList[i]['heroId'] != lastHeroId)
            {
                // create new hero div
                heroDivHtml = '<div class="masterHeroWrap" data-hero-id="'+window.masterAllHeroesList[i]['heroId']+'" data-hero-codename="'+window.masterAllHeroesList[i]['heroCodename']+'">';
                    heroDivHtml += '<h4 class="masterHeroLocalname">'+window.masterAllHeroesList[i]['heroLocalname']+'</h4>';
                    heroDivHtml += '<div class="masterHeroImgWrap">';
                        heroDivHtml += '<img src="//cdn.dota2.com/apps/dota2/images/heroes/'+window.masterAllHeroesList[i]['heroCodename']+'_vert.jpg?v=4195662">';
                    heroDivHtml += '</div>';
                    heroDivHtml += '<div class="masterHeroAbilitiesWrap">';
                    heroDivHtml += '</div>';
                heroDivHtml += '</div>';
                $('#masterList').append(heroDivHtml);
            }

            if (window.masterAllHeroesList[i]['ignoreStatus'] == 1)
            {
                abilityIgnoreClass = ' class="ignore"';
            } else
            if (window.masterAllHeroesList[i]['ignoreStatus'] == 2)
            {
                abilityIgnoreClass = ' class="autoIgnore"';
            } else {
                abilityIgnoreClass = '';
            }

            abilityCodenameOrMissingPic = window.masterAllHeroesList[i]['abilityCodename'];
            if (missingImagesArray.indexOf(abilityCodenameOrMissingPic) > -1)
            {
                abilityCodenameOrMissingPic = 'rubick_empty1';
            }

            abilityDivHtml = '<span class="masterAbilityImgWrap">';
                abilityDivHtml += '<img data-ability-codename="'+window.masterAllHeroesList[i]['abilityCodename']+'" data-ability-id="'+window.masterAllHeroesList[i]['abilityId']+'"'+abilityIgnoreClass+' src="//cdn.dota2.com/apps/dota2/images/abilities/'+abilityCodenameOrMissingPic+'_hp1.png?v=4195662">';
            abilityDivHtml += '</span>';


            $('#masterList div[data-hero-id="' + window.masterAllHeroesList[i]['heroId'] + '"]').append(abilityDivHtml);

            if (window.masterAllHeroesList[i]['isForbidden'])
            {
                $('.masterAbilityImgWrap img[data-ability-id="' + window.masterAllHeroesList[i]['abilityId'] + '"]').parent().addClass('forbidden');
            }

            lastHeroId = window.masterAllHeroesList[i]['heroId'];
        }

        lastHeroId = 1;
        dispellableAbilititiesItemsHtml = '';
        //second for
        for (var i = 0; i < window.masterAllHeroesList.length; i++)
        {
            // ,cf_d2HeroAbilityList_manualBuffDispellableB as `buffDispellableB`
            // ,cf_d2HeroAbilityList_manualBuffDispellableS as `buffDispellableS`
            // ,cf_d2HeroAbilityList_manualDebuffDispellableB as `debuffDispellableB`
            // ,cf_d2HeroAbilityList_manualDebuffDispellableS as `debuffDispellableS`
            // ,cf_d2HeroAbilityList_isConfirmed as `isConfirmed`
            // ,cf_d2HeroAbilityList_spellDispellableType as `dispType`


            var dispType = window.masterAllHeroesList[i]['dispType'];
            if ((dispType == 'SPELL_DISPELLABLE_YES') || (dispType == 'SPELL_DISPELLABLE_YES_STRONG'))
            {
                // we need ITEM for current ability in second tab
                dispellableAbilititiesItemsHtml += '<div class="dispAbilityItem">';
                    // ...
                    dispellableAbilititiesItemsHtml += '<div>'+window.masterAllHeroesList[i]['abilityCodename']+'</div>';

                        abilityCodenameOrMissingPic = window.masterAllHeroesList[i]['abilityCodename'];
                        if (missingImagesArray.indexOf(abilityCodenameOrMissingPic) > -1)
                        {
                            abilityCodenameOrMissingPic = 'rubick_empty1';
                        }

                        // checkbox checked or not
                        if (window.masterAllHeroesList[i]['buffDispellableB'] == 1)
                        {
                            var checkedOrNot1 = ' checked="checked"';
                        } else {
                            var checkedOrNot1 = '';
                        }
                        if (window.masterAllHeroesList[i]['buffDispellableS'] == 1)
                        {
                            var checkedOrNot2 = ' checked="checked"';
                        } else {
                            var checkedOrNot2 = '';
                        }
                        if (window.masterAllHeroesList[i]['debuffDispellableB'] == 1)
                        {
                            var checkedOrNot3 = ' checked="checked"';
                        } else {
                            var checkedOrNot3 = '';
                        }
                        if (window.masterAllHeroesList[i]['debuffDispellableS'] == 1)
                        {
                            var checkedOrNot4 = ' checked="checked"';
                        } else {
                            var checkedOrNot4 = '';
                        }
                        // end of checkbox checked or not

                        // checkbox should be brightRed or not
                        if (window.masterAllHeroesList[i]['buffDispellableB'] == -1)
                        {
                            var bkgDataColor1 = ' class="brightRed"';
                        } else {
                            var bkgDataColor1 = '';
                        }
                        if (window.masterAllHeroesList[i]['buffDispellableS'] == -1)
                        {
                            var bkgDataColor2 = ' class="brightRed"';
                        } else {
                            var bkgDataColor2 = '';
                        }
                        if (window.masterAllHeroesList[i]['debuffDispellableB'] == -1)
                        {
                            var bkgDataColor3 = ' class="brightRed"';
                        } else {
                            var bkgDataColor3 = '';
                        }
                        if (window.masterAllHeroesList[i]['debuffDispellableS'] == -1)
                        {
                            var bkgDataColor4 = ' class="brightRed"';
                        } else {
                            var bkgDataColor4 = '';
                        }
                        // end of checkbox should be brightRed or not


                        if (window.masterAllHeroesList[i]['isConfirmed'] != 1)
                        {
                            var bkgClassRed = ' bkgRed';
                            var btnDisplayStyle = '';
                        } else {
                            var bkgClassRed = '';
                            var btnDisplayStyle = 'style="display:none" ';
                        }                 
                    dispellableAbilititiesItemsHtml += '<div style="display: inline-flex;" class="bkgConfirmed'+bkgClassRed+'">';
                        dispellableAbilititiesItemsHtml += '<img data-ability-codename="'+window.masterAllHeroesList[i]['abilityCodename']+'" data-ability-id="'+window.masterAllHeroesList[i]['abilityId']+'" src="//cdn.dota2.com/apps/dota2/images/abilities/'+abilityCodenameOrMissingPic+'_hp1.png?v=4195662">';
                        dispellableAbilititiesItemsHtml += '<div style="margin-left: 10px;">';
                            dispellableAbilititiesItemsHtml += '<div'+bkgDataColor1+'><label><input data-checkbox-number="checkBox1" type="checkbox"'+checkedOrNot1+'> Dispellable buff (basic)</label></div>';
                            dispellableAbilititiesItemsHtml += '<div'+bkgDataColor2+'><label><input data-checkbox-number="checkBox2" type="checkbox"'+checkedOrNot2+'> Dispellable buff (strong)</label></div>';
                            dispellableAbilititiesItemsHtml += '<div'+bkgDataColor3+'><label><input data-checkbox-number="checkBox3" type="checkbox"'+checkedOrNot3+'> Dispellable debuff (basic)</label></div>';
                            dispellableAbilititiesItemsHtml += '<div'+bkgDataColor4+'><label><input data-checkbox-number="checkBox4" type="checkbox"'+checkedOrNot4+'> Dispellable debuff (strong)</label></div>';
                        dispellableAbilititiesItemsHtml += '</div>';  
                    dispellableAbilititiesItemsHtml += '</div>';

                    dispellableAbilititiesItemsHtml += '<button '+btnDisplayStyle+'class="btn">Сохранить</button>';
                dispellableAbilititiesItemsHtml += '</div>';
            }


            if ((i == window.masterAllHeroesList.length-1)
            || (window.masterAllHeroesList[i]['heroId'] != window.masterAllHeroesList[i+1]['heroId'])
            )
            {
                if (dispellableAbilititiesItemsHtml != '')
                {
                    // create new hero div
                    heroDivHtml = '<div class="masterDispellableWrap" data-hero-id="'+window.masterAllHeroesList[i]['heroId']+'" data-hero-codename="'+window.masterAllHeroesList[i]['heroCodename']+'">';
                        heroDivHtml += '<a target="_blank" href="https://dota2.gamepedia.com/'+window.masterAllHeroesList[i]['heroCodename']+'#Abilities"><i class="fa fa-link" aria-hidden="true"></i></a>';
                        heroDivHtml += '<h4 class="masterHeroLocalname">'+window.masterAllHeroesList[i]['heroLocalname']+'</h4>';
                        heroDivHtml += '<div class="masterHeroImgWrap">';
                            heroDivHtml += '<img src="//cdn.dota2.com/apps/dota2/images/heroes/'+window.masterAllHeroesList[i]['heroCodename']+'_vert.jpg?v=4195662">';
                        heroDivHtml += '</div>';
                        heroDivHtml += '<div class="masterDispellableAbilitiesWrap">';
                            heroDivHtml += dispellableAbilititiesItemsHtml;
                        heroDivHtml += '</div>';
                        heroDivHtml += '<hr>';
                    heroDivHtml += '</div>';

                    $('#masterDispellableAbilities').append(heroDivHtml);
                }
                dispellableAbilititiesItemsHtml = '';
            }
        }
        // end of second for

        $('.dispAbilityItem').each(function () 
        {
            var wrap = $(this);
            var btnEl = wrap.find('.btn');
            $(this).find('input').on('click', function () 
            {
                var checkBoxesWrap = $(this).parent().parent().parent();
                if ($(this).attr('data-checkbox-number') == 'checkBox1')
                {
                    checkBoxesWrap.find('[data-checkbox-number="checkBox2"]').prop('checked', false);
                }
                if ($(this).attr('data-checkbox-number') == 'checkBox2')
                {
                    checkBoxesWrap.find('[data-checkbox-number="checkBox1"]').prop('checked', false);
                }
                if ($(this).attr('data-checkbox-number') == 'checkBox3')
                {
                    checkBoxesWrap.find('[data-checkbox-number="checkBox4"]').prop('checked', false);
                }
                if ($(this).attr('data-checkbox-number') == 'checkBox4')
                {
                    checkBoxesWrap.find('[data-checkbox-number="checkBox3"]').prop('checked', false);
                }
                wrap.find('.bkgConfirmed').removeClass('bkgRed').addClass('bkgYellow');
                btnEl.slideDown();
            });

            btnEl.on('click', function() 
            {
                var clickedBtn = $(this);
                // var val1 = wrap.find('[data-checkbox-number="checkBox1"]').val();
                if (wrap.find('[data-checkbox-number="checkBox1"]').is(":checked")) 
                {
                    var val1 = 1;
                } else {
                    var val1 = 0;
                }
                if (wrap.find('[data-checkbox-number="checkBox2"]').is(":checked")) 
                {
                    var val2 = 1;
                } else {
                    var val2 = 0;
                }
                if (wrap.find('[data-checkbox-number="checkBox3"]').is(":checked")) 
                {
                    var val3 = 1;
                } else {
                    var val3 = 0;
                }
                if (wrap.find('[data-checkbox-number="checkBox4"]').is(":checked")) 
                {
                    var val4 = 1;
                } else {
                    var val4 = 0;
                }

                pleaseWaitOpen();
                
                $.ajax({
                    url: 'php/ajax.editor.php',
                    data: {
                        ajaxType: 'masterSetManuals'
                        , abilityId: wrap.find('img').attr('data-ability-id')
                        , checkbox1 : val1
                        , checkbox2 : val2
                        , checkbox3 : val3
                        , checkbox4 : val4
                    },
                    datatype: 'jsonp',
                    type: 'POST',
                    cache: false,
                    success: function (result) {
                        if (result.php_result == 'OK') {
                            wrap.find('.bkgConfirmed').removeClass('bkgYellow').removeClass('bkgRed');
                            wrap.find('.brightRed').removeClass('brightRed');
                            clickedBtn.slideUp();
                            // убрать красный цвет с надписей
                        }
                        else if (result.php_result == 'ERROR') {
                            console.log(result.php_error_msg);
                        };
                    },
                    complete: function (result) {
                        pleaseWaitClose();
                    },
                    error: function (request, status, error) {
                        // we recieved NOT json
                    }
                });
            });
        });
    }

    $('.masterAbilityImgWrap img').each(function ()
    {
        if (!$(this).parent().hasClass('forbidden'))
        {
            $(this).click(function () {
                var clickedAbilityId = $(this).attr('data-ability-id');

                pleaseWaitOpen();

                $.ajax({
                    url: 'php/ajax.editor.php',
                    data: {
                        ajaxType: 'masterSetAbilityIgnore'
                        , tagId: clickedAbilityId
                        , isIgnore: $(this).hasClass('ignore') ? 0 : 1
                    },
                    datatype: 'jsonp',
                    type: 'POST',
                    cache: false,
                    success: function (result) {
                        if (result.php_result == 'OK') {
                            if (result.php_is_ignore == 0) {
                                $('.masterAbilityImgWrap [data-ability-id="' + result.php_tag_id + '"]').removeClass('ignore');
                                console.log('Ignore updated to 0');
                            } else {
                                $('.masterAbilityImgWrap [data-ability-id="' + result.php_tag_id + '"]').addClass('ignore');
                                console.log('Ignore updated to 1');
                            }
                        }
                        else if (result.php_result == 'ERROR') {
                            console.log(result.php_error_msg);
                        };
                    },
                    complete: function (result) {
                        pleaseWaitClose();
                    },
                    error: function (request, status, error) {
                        // we recieved NOT json
                    }
                });
            });
        };
    });

    var filterUnconfirmedCheckboxEl = $('#filterUnconfirmed');
    filterUnconfirmedCheckboxEl.on('click', function()
    {
        if ($(this).is(":checked"))
        {
            $('.dispAbilityItem .bkgConfirmed:not(.bkgRed, .bkgYellow)').parent().hide();
            $('.masterDispellableWrap').each(function()
            {
                if (!($(this).find('.bkgRed, .bkgYellow').length))
                {
                    $(this).hide();
                }
            });
        } else {
            $('.masterDispellableWrap').show();
            $('.dispAbilityItem').show();
        }
    })


    addOnHoverTooltipsForAbilityImg('#masterList');
    addOnHoverTooltipsForAbilityImg('#masterDispellableAbilities');
});
