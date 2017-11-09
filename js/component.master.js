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

    var tooltipYoffset = -180;
    addOnHoverTooltipsForAbilityImg('#masterList', tooltipYoffset);
});
