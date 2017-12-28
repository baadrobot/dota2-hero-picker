$(document).ready(function ()
{
    var question = '';
    question += '<div id="wizardRadioWrap">';
        question += '<div class="form-check form-check-inline">';
            question += '<label class="form-check-label">';
                question += '<input class="form-check-input" type="radio" name="cmOrAp" value="1"> CM';
            question += '</label>';
        question += '</div>';
        question += '<div class="form-check form-check-inline">';
            question += ' <label class="form-check-label">';
                question += '<input class="form-check-input" type="radio" name="cmOrAp" value="0"> AP';
            question += '</label>';
        question += '</div>';
    question += '</div>';

    window.balance = [];
    window.involvedAbils = [];
    window.globalHeroAjaxRequests = 0;


    // confirmDialog({
    //     confirmTitle : getPreStr_js('COUNTER_PICK', '_CM_OR_AP_')
    //     ,confirmHtml : question
    //     ,btnOKCaption : getPreStr_js('COUNTER_PICK', '_NEXT_')
    //     ,btnCancelCaption : getPreStr_js('COUNTER_PICK', '_BACK_')
    //     ,btnOKColorClass : 'btn-success'
    //     ,allowBackClickClose : false
    //     ,onBeforeShow: function ()
    //     {
    //         $('#btnConfirmDialogOK').attr('disabled', 'disabled');
    //     }
    //     ,onAfterShow : function ()
    //     {

    //     }
    //     ,onUserClickedOK : function ()
    //     {

    //     }
    //     ,onUserClickedCancel : function ()
    //     {
    //         //
    //     }
    // });

    buildHeroList('#heroListWrap');

    // drag'n'drop
        $('.heroListImg').draggable({
             cursor: 'default'
            ,helper: "clone"
            ,revert: 'invalid'
            , drag: function (event, ui)
            {


                var draggedHero = $(this);


                //var dragHeroId = draggedHero.attr('data-hero-id');
                draggedHero.addClass('grayscale');
                ui.helper.addClass('draggable');
            },
            start: function (e, ui)
            {
                var draggedHero = $(this);
                if (draggedHero.hasClass('pickedOrBaned'))
                {
                    //This will prevent moving the element from it's position
                    e.preventDefault();
                }

                ui.helper.attr('data-dragged-from', 'fromHeroList');
            },
            stop: function (event, ui) {
                var draggedHero = $(this);
                draggedHero.removeClass('grayscale');
                ui.helper.removeClass('draggable');
            }
        });

        $(".emptySlot").droppable({
            drop: function (event, ui)
            {
                // recived in placeholder (not droped out for delete)
                ui.helper.attr('data-is-recieved-or-droped-out', 1);

                var recieverEl = $(this);

                var draggedHeroId = ui.helper.attr('data-hero-id');

                // check if slot is NOT empty
                var slotImgWrap = recieverEl.find('.pickedHeroImgWrap');
                if (slotImgWrap.length)
                {
                    // slot is NOT empty
                    var prevSlotHeroId = slotImgWrap.attr('data-hero-id');
                    if (ui.helper.attr('data-dragged-from') == 'fromPlaceHolder')
                    {
                        // ------- hero dragged from another slot - previous hero must be swapped with new one
                        lockNewHeroInSlot($('.pickedHeroImgWrap[data-hero-id="' + draggedHeroId + '"]').parent(), prevSlotHeroId, 0);
                        lockNewHeroInSlot(recieverEl, draggedHeroId, 0);
                        $('.pickedHeroImgWrap[data-hero-id="' + prevSlotHeroId + '"]').parent().addClass('slot').removeClass('emptySlot');                
                    } else {
                        // ------- hero dragged in from hero list
                        releaseHeroInList(prevSlotHeroId);
                        slotImgWrap.remove();
                        lockNewHeroInSlot(recieverEl, draggedHeroId, 0);
                    }
                } else {
                    lockNewHeroInSlot(recieverEl, draggedHeroId, 0);
                }

                getAjaxBalanceForHeroId(draggedHeroId, 1);


                // refresh fillPickBanInput
                var friendPickElements = $('.friendPick.slot');
                var enemyPickElements = $('.enemyPick.slot');
                var banPickElements = $('.banPick.slot');
                fillPickBanInput(friendPickElements, enemyPickElements, banPickElements);                                     
            },
            over: function(event, ui) {
                ui.helper.addClass('draggableOverDroppable');
            },
            out: function(event, ui) {
                ui.helper.removeClass('draggableOverDroppable');
            }
        });

        $('.emptySlot')
        .mouseenter(function()
        {
            $(this).find('.pickedHeroImgDelete').show();
        })
        .mouseleave(function() {
            $(this).find('.pickedHeroImgDelete').hide();
        });
    // end of drag'n'drop


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


    
    $('#fillHeroPickAndBanSlotsViaAliasSingleInput + span').on('click', function () 
    {
        var fillInputValue = $('#fillHeroPickAndBanSlotsViaAliasSingleInput').val();
        
        // commaSepArray = '(E) Alchim, Axe, BS (B) Lina (F) Lion';
        //commaSepArray[0] = '';
        //commaSepArray[1] = 'E) Alchim, Axe, BS';
        //commaSepArray[2] = 'B) Lina';
        //commaSepArray[3] = 'F) Lion';

        var typeSepArray = fillInputValue.trim().toLowerCase().split('(');
        for (var i = 0; i < typeSepArray.length; i++)
        {
            typeSepArray[i] = typeSepArray[i].trim();
            while (typeSepArray[i].indexOf('  ') !== -1)
            {
                typeSepArray[i] = typeSepArray[i].replace(/  /g, ' ');
            }
        }
        window.tempArrayE = [];
        window.tempArrayF = [];
        window.tempArrayB = [];
        if (typeSepArray.length == 0)
        {
            return;
        } else
        if (typeSepArray.length == 1)
        {
            // не было закрывающей скобоки, рассматриваем всех героев как Врагов
            window.tempArrayE = recognizeHeroesAndWriteToArray(typeSepArray[0], window.tempArrayE);
        } else {
            for (var i = 0; i < typeSepArray.length; i++)
            {
                if (typeSepArray[i].substring(0, 2) == 'e)')
                {
                    window.tempArrayE = recognizeHeroesAndWriteToArray(typeSepArray[i].substring(2), window.tempArrayE);
                } else if (typeSepArray[i].substring(0, 2) == 'f)')
                {
                    window.tempArrayF = recognizeHeroesAndWriteToArray(typeSepArray[i].substring(2), window.tempArrayF);
                } else if (typeSepArray[i].substring(0, 2) == 'b)')
                {
                    window.tempArrayB = recognizeHeroesAndWriteToArray(typeSepArray[i].substring(2), window.tempArrayB);
                } else {
                    // do nothing
                }
            }
        }
        //(b) axe, dazzle (f) AA (e) medusa, lion

        // опустошаем слоты со старыми героями, чтобы потом наполнить их новыми
        $('.pickedHeroImgWrap').each(function() 
        {
            var curHeroIdInSlot = $(this).attr('data-hero-id');
            removeHeroFromSlot( $(this), 0 );
            releaseHeroInList(curHeroIdInSlot);
        });

        // создаем массив со словами, которые не совпали с alias-single
        window.conflictWordsArray = [];
        // var allMatchesHeroIdsByConflictWordKeyArray = [];
        // массив для тех слов которые вообще ни с чем не совпали (абракадабра)
        window.noMatchedWordsArray = [];

        // Находим конфликтные слова и их совпадения
        // for enemy
        if(window.tempArrayE.length)
        {
            for(var i = 0; i < window.tempArrayE.length; i++)
            {
                var countForSearchMatches = 0;

                // если слово не совпадает с alias-single и имеет более одного совпадения - то записать его в массив
                if(!(window.tempArrayE[i].toLowerCase() == $('.heroListImg[data-alias-single="' + window.tempArrayE[i] + '"]').attr('data-alias-single')))
                {
                    $('[data-hero-aliases]').each(function ()
                    {
                        //склеиваем все алиасы
                        var allAliases = ($(this).attr('data-hero-aliases')
                            + ',' + $(this).attr('data-hero-namelocal')
                            + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');
    
                        //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
                        var curEnemyHeroAlias = window.tempArrayE[i].toLowerCase().replace(/\s|_|\-/g, '');
                        if(allAliases.indexOf(curEnemyHeroAlias) !== -1)
                        {
                            // если уже найдено более 1го совпадения, значит есть конфликт и надо заполнять 
                            // массив с совпадениями тутже, чтобы не делать одну и ту же работу дважды
                                // if(countForSearchMatches > 1)
                                // {
                                //     allMatchesHeroIdsByConflictWordKeyArray[window.tempArrayE[i]].push($(this).attr('data-hero-id'));
                                // }

                            // увеличиваем на 1 если найдено совпадение
                            // потом по ней мы проверяем было найдено 0, 1 или более совпадений
                            countForSearchMatches++;
                        }
                    });

                    // если найдено более одно совпадения значит это слово конфликтное и его нужно занести в массив
                    if(countForSearchMatches > 1)
                    {
                        window.conflictWordsArray.push(window.tempArrayE[i]);
                    }
                    else if (countForSearchMatches == 0)
                    {
                        window.noMatchedWordsArray.push(window.tempArrayE[i]);
                    }
                }
            }
        }

        // for ban
        if(window.tempArrayB.length)
        {
            for(var i = 0; i < window.tempArrayB.length; i++)
            {
                var countForSearchMatches = 0;

                // если слово не совпадает с alias-single и имеет более одного совпадения - то записать его в массив
                if(!(window.tempArrayB[i].toLowerCase() == $('.heroListImg[data-alias-single="' + window.tempArrayB[i] + '"]').attr('data-alias-single')))
                {
                    $('[data-hero-aliases]').each(function ()
                    {
                        //склеиваем все алиасы
                        var allAliases = ($(this).attr('data-hero-aliases')
                            + ',' + $(this).attr('data-hero-namelocal')
                            + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');
    
                        //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
                        var curEnemyHeroAlias = window.tempArrayB[i].toLowerCase().replace(/\s|_|\-/g, '');
                        if(allAliases.indexOf(curEnemyHeroAlias) !== -1)
                        {
                            // если уже найдено более 1го совпадения, значит есть конфликт и надо заполнять 
                            // массив с совпадениями тутже, чтобы не делать одну и ту же работу дважды
                                // if(countForSearchMatches > 1)
                                // {
                                //     allMatchesHeroIdsByConflictWordKeyArray[window.tempArrayE[i]].push($(this).attr('data-hero-id'));
                                // }

                            // увеличиваем на 1 если найдено совпадение
                            // потом по ней мы проверяем было найдено 0, 1 или более совпадений
                            countForSearchMatches++;
                        }
                    });

                    // если найдено более одно совпадения значит это слово конфликтное и его нужно занести в массив
                    if(countForSearchMatches > 1)
                    {
                        window.conflictWordsArray.push(window.tempArrayB[i]);
                    }
                    else if (countForSearchMatches == 0)
                    {
                        window.noMatchedWordsArray.push(window.tempArrayB[i]);
                    }
                }
            }
        }

        // for friend
        if(window.tempArrayF.length)
        {
            for(var i = 0; i < window.tempArrayF.length; i++)
            {
                var countForSearchMatches = 0;

                // если слово не совпадает с alias-single и имеет более одного совпадения - то записать его в массив
                if(!(window.tempArrayF[i].toLowerCase() == $('.heroListImg[data-alias-single="' + window.tempArrayF[i] + '"]').attr('data-alias-single')))
                {
                    $('[data-hero-aliases]').each(function ()
                    {
                        //склеиваем все алиасы
                        var allAliases = ($(this).attr('data-hero-aliases')
                            + ',' + $(this).attr('data-hero-namelocal')
                            + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');
    
                        //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
                        var curEnemyHeroAlias = window.tempArrayF[i].toLowerCase().replace(/\s|_|\-/g, '');
                        if(allAliases.indexOf(curEnemyHeroAlias) !== -1)
                        {
                            // если уже найдено более 1го совпадения, значит есть конфликт и надо заполнять 
                            // массив с совпадениями тутже, чтобы не делать одну и ту же работу дважды
                                // if(countForSearchMatches > 1)
                                // {
                                //     allMatchesHeroIdsByConflictWordKeyArray[window.tempArrayE[i]].push($(this).attr('data-hero-id'));
                                // }

                            // увеличиваем на 1 если найдено совпадение
                            // потом по ней мы проверяем было найдено 0, 1 или более совпадений
                            countForSearchMatches++;
                        }
                    });

                    // если найдено более одно совпадения значит это слово конфликтное и его нужно занести в массив
                    if(countForSearchMatches > 1)
                    {
                        window.conflictWordsArray.push(window.tempArrayF[i]);
                    } 
                    else if (countForSearchMatches == 0)
                    {
                        window.noMatchedWordsArray.push(window.tempArrayF[i]);
                    }
                }
            }
        }

        // убираем из массивов enemy, ban, friend те слова которые вообще ни с чем не совапали (абракадабра)
        if (window.noMatchedWordsArray)
        {
        //for enemy
            for(var i = 0; i < window.noMatchedWordsArray.length; i++)
            {
                for(var j = 0; j < window.tempArrayE.length; j++)
                {
                    if(window.noMatchedWordsArray[i] == window.tempArrayE[j])
                    {
                        window.tempArrayE.splice(j, 1);
                    }
                }
            }

            //for ban
            for(var i = 0; i < window.noMatchedWordsArray.length; i++)
            {
                for(var j = 0; j < window.tempArrayB.length; j++)
                {
                    if(window.noMatchedWordsArray[i] == window.tempArrayB[j])
                    {
                        window.tempArrayB.splice(j, 1);
                    }
                }
            }

            //for friends
            for(var i = 0; i < window.noMatchedWordsArray.length; i++)
            {
                for(var j = 0; j < window.tempArrayF.length; j++)
                {
                    if(window.noMatchedWordsArray[i] == window.tempArrayF[j])
                    {
                        window.tempArrayF.splice(j, 1);
                    }
                }
            }
        }
        popupAndPicksFill();
    });
});

// - end jQuery ready





function popupAndPicksFill()
{
    // если нашлось хоть одно конфликтное слово
    if(window.conflictWordsArray.length)
    {
        var tempMatchedHeroIdsArray = [];
        // проходимся по всем героям
        $('[data-hero-aliases]').each(function ()
        {
            //склеиваем алиасы текущего героя
            var allAliases = ($(this).attr('data-hero-aliases')
                + ',' + $(this).attr('data-hero-namelocal')
                + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');

            //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
            var conflictHeroName = window.conflictWordsArray[0].toLowerCase().replace(/\s|_|\-/g, '');

            // если да то заносим айди совпавшего героя в массив
            if(allAliases.indexOf(conflictHeroName) !== -1)
            {
                tempMatchedHeroIdsArray.push($(this).attr('data-hero-id'));
            }
        });

        // вывод попапа с выбором героя
        var question = '';
        question += '<div id="matchedHeroesListPopup">';
        question += '<p>' + getPreStr_js('COUNTER_PICK', '_CLARIFY_HERO_') + window.conflictWordsArray[0] + '</p>';
        for(var i = 0; i < tempMatchedHeroIdsArray.length; i++)
        {
            var curHeroEl = $('.heroListImg[data-hero-id="'+tempMatchedHeroIdsArray[i]+'"]');
            question += '<div class="matchedHeroesPopupListItem" data-hero-id="'+curHeroEl.attr('data-hero-id')+'" data-alias-single="'+curHeroEl.attr('data-alias-single')+'" data-inactive-tooltip="'+curHeroEl.attr('data-active-tooltip')+'">';
                question += '<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+curHeroEl.attr('data-hero-codename')+'_full.png?v=4212550">';
            question += '</div>';
        }
        question += '</div>';

        confirmDialog({
            confirmTitle : getPreStr_js('COUNTER_PICK', '_CHOOSE_HERO_')
            ,confirmHtml : question
            ,btnOKCaption : getPreStr_js('COUNTER_PICK', '_NEXT_')
            ,btnCancelCaption : 'default'
            ,btnOKColorClass : 'btn-success'
            ,allowBackClickClose : true
            ,onBeforeShow: function ()
            {
                $('#btnConfirmDialogOK').hide();

                // клики на героев
                $('.matchedHeroesPopupListItem').on('click', function() 
                {
                    var chosenHeroId = $(this).attr('data-hero-id');
                    var chosenHeroAliasSingle = $(this).attr('data-alias-single');
                    
                    // ищем в массивах конфликтное слово и заменяем его на alias-single выбранного героя
                    // ищем в enemy
                    if(window.tempArrayE.length)
                    {
                        for(var i = 0; i < window.tempArrayE.length; i++)
                        {
                            if(window.tempArrayE[i] == window.conflictWordsArray[0])
                            {
                                window.tempArrayE[i] = chosenHeroAliasSingle;
                            }
                        }
                    }

                    // ищем в friend
                    if(window.tempArrayF.length)
                    {
                        for(var i = 0; i < window.tempArrayF.length; i++)
                        {
                            if(window.tempArrayF[i] == window.conflictWordsArray[0])
                            {
                                window.tempArrayF[i] = chosenHeroAliasSingle;
                            }
                        }
                    }
                    
                    // ищем в ban
                    if(window.tempArrayB.length)
                    {
                        for(var i = 0; i < window.tempArrayB.length; i++)
                        {
                            if(window.tempArrayB[i] == window.conflictWordsArray[0])
                            {
                                window.tempArrayB[i] = chosenHeroAliasSingle;
                            }
                        }
                    }

                    // удаляем конфликтное слово, которое мы уже заменили
                    window.conflictWordsArray.shift();

                    $('#confirmDialog').modal('hide');

                    // снова вызвать текущую функцию, это будет до тех пор пока не останется конфликтных слов
                    popupAndPicksFill();
                });

                eXoActivateInactiveTooltips();                
            }
            ,onAfterShow : function ()
            {

            }
            ,onUserClickedOK : function ()
            {
                
            }
            ,onUserClickedCancel : function ()
            {
                //$('#confirmDialog').modal('hide');
            }
        });
    } else {
        // заполнять пики и баны т.к. к этому моменту все массивы со словами чистые
        // заполняем enemy pick
        if(window.tempArrayE.length)
        {
            for(var i = 0; i < window.tempArrayE.length; i++)
            {
                if(window.tempArrayE[i].toLowerCase() == $('.heroListImg[data-alias-single="' + window.tempArrayE[i] + '"]').attr('data-alias-single'))
                {
                    var curHeroId = $('.heroListImg[data-alias-single="' + window.tempArrayE[i] + '"]').attr('data-hero-id');
                    var curSlotForLock = $('#enemyPickList .enemyPick:nth-child('+ (i+1) +')');

                    lockNewHeroInSlot(curSlotForLock, curHeroId, 0);
                    getAjaxBalanceForHeroId(curHeroId, 1);
                } else {
                    $('[data-hero-aliases]').each(function ()
                    {
                        //склеиваем алиасы
                        var allAliases = ($(this).attr('data-hero-aliases')
                                + ',' + $(this).attr('data-hero-namelocal')
                                + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');

                        //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
                        if(allAliases.indexOf(window.tempArrayE[i].toLowerCase().replace(/\s|_|\-/g, '')) !== -1)
                        {
                            var curHeroId = ($(this).attr('data-hero-id'));
                            var curSlotForLock = $('#enemyPickList .enemyPick:nth-child('+ (i+1) +')');

                            lockNewHeroInSlot(curSlotForLock, curHeroId, 0);
                            getAjaxBalanceForHeroId(curHeroId, 1);
                        }
                    });
                }
            }
        }

        // заполняем ban pick
        if(window.tempArrayB.length)
        {
            for(var i = 0; i < window.tempArrayB.length; i++)
            {
                if(window.tempArrayB[i].toLowerCase() == $('.heroListImg[data-alias-single="' + window.tempArrayB[i] + '"]').attr('data-alias-single'))
                {
                    var curHeroId = $('.heroListImg[data-alias-single="' + window.tempArrayB[i] + '"]').attr('data-hero-id');
                    var curSlotForLock = $('#banPickList .banPick:nth-child('+ (i+1) +')');

                    lockNewHeroInSlot(curSlotForLock, curHeroId, 0);
                    getAjaxBalanceForHeroId(curHeroId, 1);
                } else {
                    $('[data-hero-aliases]').each(function ()
                    {
                        //склеиваем алиасы
                        var allAliases = ($(this).attr('data-hero-aliases')
                                + ',' + $(this).attr('data-hero-namelocal')
                                + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');

                        //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
                        if(allAliases.indexOf(window.tempArrayB[i].toLowerCase().replace(/\s|_|\-/g, '')) !== -1)
                        {
                            var curHeroId = ($(this).attr('data-hero-id'));
                            var curSlotForLock = $('#banPickList .banPick:nth-child('+ (i+1) +')');

                            lockNewHeroInSlot(curSlotForLock, curHeroId, 0);
                            getAjaxBalanceForHeroId(curHeroId, 1);
                        }
                    });
                }
            }
        }

        // заполняем friend pick
        if(window.tempArrayF.length)
        {
            for(var i = 0; i < window.tempArrayF.length; i++)
            {
                if(window.tempArrayF[i].toLowerCase() == $('.heroListImg[data-alias-single="' + window.tempArrayF[i] + '"]').attr('data-alias-single'))
                {
                    var curHeroId = $('.heroListImg[data-alias-single="' + window.tempArrayF[i] + '"]').attr('data-hero-id');
                    var curSlotForLock = $('#friendPickList .friendPick:nth-child('+ (i+1) +')');

                    lockNewHeroInSlot(curSlotForLock, curHeroId, 0);
                    getAjaxBalanceForHeroId(curHeroId, 1);
                } else {
                    $('[data-hero-aliases]').each(function ()
                    {
                        //склеиваем алиасы
                        var allAliases = ($(this).attr('data-hero-aliases')
                                + ',' + $(this).attr('data-hero-namelocal')
                                + ',' + $(this).attr('data-hero-codename')).toLowerCase().replace(/\s|_|\-/g, '');

                        //подготавливаем имя героя которое нужно искать и проверяем нашлось ли оно
                        if(allAliases.indexOf(window.tempArrayF[i].toLowerCase().replace(/\s|_|\-/g, '')) !== -1)
                        {
                            var curHeroId = ($(this).attr('data-hero-id'));
                            var curSlotForLock = $('#friendPickList .friendPick:nth-child('+ (i+1) +')');

                            lockNewHeroInSlot(curSlotForLock, curHeroId, 0);
                            getAjaxBalanceForHeroId(curHeroId, 1);
                        }
                    });
                }
            }
        }
        // конец заполнения слотов

        // заполняем инпут
        //текст для врагов
        var enemyPickText = '';
        var isCommaNeeded = false;
        if(window.tempArrayE.length)
        {
            for(var i = 0; i < window.tempArrayE.length; i ++)
            {
                if (isCommaNeeded)
                {
                    enemyPickText += ', ';
                }
                enemyPickText += window.tempArrayE[i];
                isCommaNeeded = true;
            }
        }

        //текст для банов
        var banPickText = '';
        var isCommaNeeded = false;
        if(window.tempArrayB.length)
        {
            for(var i = 0; i < window.tempArrayB.length; i ++)
            {
                if (isCommaNeeded)
                {
                    banPickText += ', ';
                }
                banPickText += window.tempArrayB[i];
                isCommaNeeded = true;
            }
        }
        
        // текст для союзников
        var friendPickText = '';
        var isCommaNeeded = false;
        if(window.tempArrayF.length)
        {
            for(var i = 0; i < window.tempArrayF.length; i ++)
            {
                if (isCommaNeeded)
                {
                    friendPickText += ', ';
                }
                friendPickText += window.tempArrayF[i];
                isCommaNeeded = true;
            }
        }

        // окончательное составление текста
        var textForInput = '';

        if(enemyPickText != '')
        {
            textForInput += '(E) ' + enemyPickText;
        }

        if(banPickText != '')
        {
            if (textForInput != '')
            {
                textForInput += ' ';
            }
            textForInput += '(B) ' + banPickText;
        }

        if(friendPickText != '')
        {
            if (textForInput != '')
            {
                textForInput += ' ';
            }            
            textForInput += '(F) ' + friendPickText;
        }
        
        $('#fillHeroPickAndBanSlotsViaAliasSingleInput').val(textForInput);        

        // refresh fillPickBanInput
        // var friendPickElements = $('.friendPick.slot');
        // var enemyPickElements = $('.enemyPick.slot');
        // var banPickElements = $('.banPick.slot');
        // fillPickBanInput(friendPickElements, enemyPickElements, banPickElements);

        $('.pickedHeroImgDelete').hide();
        //doRecountCounterPickBalance();
    }
}


function removeHeroFromSlot(slotItemEl, recountNeedOrNot)
{
    slotItemEl.parent().removeClass('slot').addClass('emptySlot');
    slotItemEl.remove();
    if(recountNeedOrNot == 1)
    {
        doRecountCounterPickBalance();
    }


    // refresh fillPickBanInput
    var friendPickElements = $('.friendPick.slot');
    var enemyPickElements = $('.enemyPick.slot');
    var banPickElements = $('.banPick.slot');
    fillPickBanInput(friendPickElements, enemyPickElements, banPickElements);            
}

function releaseHeroInList(heroId)
{
    $('.heroListImg[data-hero-id="' + heroId + '"]')
    .removeClass('pickedOrBaned')
    .find('.redLine').remove();           
}

function lockNewHeroInSlot(slotEl, heroId, recountNeedOrNot)
{
    // clear all old elements
    removeHeroFromSlot( $('.pickedHeroImgWrap[data-hero-id="' + heroId + '"]'), recountNeedOrNot);
    releaseHeroInList(heroId);

    slotEl.removeClass('emptySlot').addClass('slot');
    var heroListEl = $('.heroListImg[data-hero-id="' + heroId + '"]');
    var draggedHeroCodename = heroListEl.attr('data-hero-codename');
    var draggedHeroAliasSingle = heroListEl.attr('data-alias-single');

    heroListEl.addClass('pickedOrBaned');

    // cross out hero (if ban)
    if (slotEl.hasClass('banPick'))
    {
        // do not add another if already has one
        if (heroListEl.find('.redLine').length == 0) {
            // cross out
            heroListEl.prepend('<img src="images/redline.png" class="redLine">');
        }
    } else {
        heroListEl.find('.redLine').remove();
    }

    // create new img_wrap and img
    slotEl.prepend('<div class="pickedHeroImgWrap" data-hero-id="' + heroId + '" data-hero-codename="' + draggedHeroCodename + '" data-alias-single="'+draggedHeroAliasSingle+'"><span class="pickedHeroImgDelete fa fa-times"></span><img data-img-src="//cdn.dota2.com/apps/dota2/images/heroes/' + draggedHeroCodename + '_hphover.png?v=4238480"></div>');

    // preload new img
    kainaxPreloadImages({
        wrapElement: slotEl.find('.pickedHeroImgWrap')
        , gifNameOrFalse: 'spinner.gif'
        //, gifNameOrFalse: 'eco-ajax-loader-01.gif'
        , opacity: 0.6
        , loaderIntH: 10
        , loaderIntW: 10
        //, missingPicOrFalse: false
    });

    slotEl.find('.pickedHeroImgWrap').draggable({
        cursor: 'default'
        , helper: "clone"
        , zIndex: 200
        //,revert: 'invalid'
        ,
        start: function (e, ui) {
            var draggedHero = $(this);
            ui.helper.attr('data-is-recieved-or-droped-out', 0);
            ui.helper.attr('data-dragged-from', 'fromPlaceHolder');
        },
        stop: function (event, ui) {
            if (ui.helper.attr('data-is-recieved-or-droped-out') == 0) {
                var dragedFromSlotEl = $(this);
                // fix 2389
                removeHeroFromSlot(dragedFromSlotEl, recountNeedOrNot = 1);
                releaseHeroInList(dragedFromSlotEl.attr('data-hero-id'));
            }
        }
    });

    // cross button (remove pick/ban)
    slotEl.find('.pickedHeroImgDelete').on('click', function ()
    {
        // console.log($(this).parent().attr('data-hero-id'));
        var deletedHeroId = $(this).parent().attr('data-hero-id');
        var imgWrapToRemoveEl = $(this).parent();
        removeHeroFromSlot(imgWrapToRemoveEl, 1);
        releaseHeroInList(deletedHeroId);
    });       
}

function getAjaxBalanceForHeroId(draggedHeroId, recountNeedOrNot)
{
    //
    if (typeof window.balance[draggedHeroId] == 'undefined')
    {
        window.globalHeroAjaxRequests++;
        jQuery('#heroCounterBalanceListWrap').html('Loading...');

        //Ajax
        $.ajax({
            url: 'php/ajax.editor.php',
            data: {  ajaxType: 'editorGetHeroAbilitiesAndHeroTags'
                     , heroId: draggedHeroId
                    },
            datatype: 'jsonp',
            type: 'POST',
            cache: false,
            success: function (result)
            {
                if (result.php_result == 'OK')
                {
                    window.balance[draggedHeroId] = result;

                    var curInvolvedAbils = result.all_involved_abilities_result;
                    Object.keys(curInvolvedAbils).forEach(function (key)
                    {
                        console.log('k:'+key);
                        console.log('v:'+ curInvolvedAbils[key]);
                        window.involvedAbils[key] = curInvolvedAbils[key];
                    });

                    window.globalHeroAjaxRequests--;
                    if(recountNeedOrNot == 1)
                    {
                        doRecountCounterPickBalance();
                    }
                    //console.log(result);
                }
                else if (result.php_result == 'ERROR')
                {
                    console.log(result.php_error_msg);
                };
            },
            complete: function (result)
            {

            },
            error: function (request, status, error)
            {
                // we recieved NOT json, probably error in ajax.php
            }
        });
    } else {
        // вызов пересчета баланса
        if(recountNeedOrNot == 1)
        {
            doRecountCounterPickBalance();
        }
    }
    // alert(draggedHeroId);
}


function doRecountCounterPickBalance()
{
    if (window.globalHeroAjaxRequests == 0)
    {
        $('#heroCounterBalanceListWrap').html('');
        var tempCounterBalance = [];
        
        //проходимся по циклу выбранных героев врагов
        var banPickElements = $('.banPick.slot');
        var enemyPickElements = $('.enemyPick.slot');

        // check if there are no any heroes in slots


        enemyPickElements.each(function()
        {
            var curEnemyHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            var resultForCurHero = window.balance[curEnemyHeroId];

            Object.keys(resultForCurHero['hero_total_balance_result']).forEach(function (i)
            {
                var setType = resultForCurHero['hero_total_balance_result'][i]['setType'];
                
                if (setType == 1)
                {
                    var secondHeroId = resultForCurHero['hero_total_balance_result'][i]['hId'];
                    var balanceCoef = resultForCurHero['hero_total_balance_result'][i]['balCoef'];                    
                    if (typeof tempCounterBalance[secondHeroId] == 'undefined')
                    {
                        tempCounterBalance[secondHeroId] = 0;
                    }
                    tempCounterBalance[secondHeroId] = tempCounterBalance[secondHeroId] + (Number(balanceCoef) * -1);
                }
            });
        });
        
        // еще раз проход, но по союзникам
        var friendPickElements = $('.friendPick.slot');
        friendPickElements.each(function()
        {
            var curFriendHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            var resultForCurHero = window.balance[curFriendHeroId];
        
            Object.keys(resultForCurHero['hero_total_balance_result']).forEach(function (i)
            {
                var setType = resultForCurHero['hero_total_balance_result'][i]['setType'];
                
                if (setType == 0)
                {
                    var secondHeroId = resultForCurHero['hero_total_balance_result'][i]['hId'];
                    var balanceCoef = resultForCurHero['hero_total_balance_result'][i]['balCoef'];                    
                    if (typeof tempCounterBalance[secondHeroId] == 'undefined')
                    {
                        tempCounterBalance[secondHeroId] = 0;
                    }
                    tempCounterBalance[secondHeroId] = tempCounterBalance[secondHeroId] + Number(balanceCoef);
                }
            });
        });

        var defaultEmptyVal = -9999;        
        // remove already baned and picked heroes from recommendation
        $('.enemyPick.slot, .friendPick.slot, .banPick.slot').each(function()
        {
            var curHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            tempCounterBalance[curHeroId] = defaultEmptyVal;
        });

        // order recommendation
        window.maxRecomendations = 10;
        if ((enemyPickElements.length + friendPickElements.length) > 0)
        {
            var tempBalanceHeroIdArray = [];
            var tempBalanceHeroValueArray = [];
            for (var i = 0; i < window.maxRecomendations;i++)
            {
                tempBalanceHeroValueArray[i] = defaultEmptyVal;
            }

            // get top 5 suggested heroes and write it
            // to tempBalanceHeroValueArray and tempBalanceHeroIdArray
            Object.keys(tempCounterBalance).forEach(function (keyHeroId)
            {
                var val = tempCounterBalance[keyHeroId];
                for (var iPos = 0; iPos < window.maxRecomendations; iPos++)
                {
                    if (val > tempBalanceHeroValueArray[iPos])
                    {
                        // invoke function and 2 arrays to it
                        var tempResultArray = pushToBottom(tempBalanceHeroValueArray, iPos, val, tempBalanceHeroIdArray, keyHeroId);
                        // we recieved 2 arrays from function (inside 1 array as single result, rewrite it back)
                        tempBalanceHeroValueArray = tempResultArray['heroValArray'];
                        tempBalanceHeroIdArray = tempResultArray['heroIdArray'];
                        break;
                    }
                }
            });        

            for (var j = 0; j < window.maxRecomendations;j++)        
            {
                var curRecomHeroId = tempBalanceHeroIdArray[j];
                var curRecomHeroVal = tempBalanceHeroValueArray[j];
                // fix78132
                if(curRecomHeroVal == defaultEmptyVal) // if -9999
                {
                    continue;
                }
                var recommendHtml = '';
                var curHeroEl = $('#heroListWrap').find('[data-hero-id="'+curRecomHeroId+'"]');
                var heroLocalName = curHeroEl.attr('data-hero-namelocal');
                var heroImgPath = curHeroEl.find('img.heroImgV').attr('src');

                var colorCoefColor = curRecomHeroVal >= 0 ? 'noticeGreen' : 'noticeRed';
                var tempBalanceHeroValueTotalText = curRecomHeroVal > 0 ? '+'+ curRecomHeroVal : curRecomHeroVal;
                
                recommendHtml += '<div class="finalBalaceItem">';
                    recommendHtml += '<div class="heroInfoWrapForBalance clearFix">';
                        recommendHtml += '<div class="heroImgWrapForBalance float-left align-middle" data-hero-id="'+curRecomHeroId+'">';
                            recommendHtml += '<img src="' + heroImgPath + '" width="30px" height="auto">';
                        recommendHtml += '</div>';
                        recommendHtml += '<div class="heroNamelocalForBalance float-left align-middle">' + heroLocalName + '</div>';
                        recommendHtml += '<div class="heroTotalCoefForBalance ' + colorCoefColor + ' float-right align-middle">' + tempBalanceHeroValueTotalText + '</div>';
                    recommendHtml += '</div>';
                
                    var alreadyAddedNotes = [];
                    var recomHeroRedNotes = [];
                    var recomHeroGreenNotes = [];
                    var greenNotesCount = -1;
                    var redNotesCount = -1;


                    for (var iSetType = 0; iSetType <= 1; iSetType++)
                    {
                        if (iSetType == 0)
                        {
                            var pickElements = friendPickElements;
                        } else {
                            var pickElements = enemyPickElements;
                        }
                        var internalCyclePickElements = pickElements;
                        pickElements.each(function()
                        {
                            var curEnemyHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
                            var resultForCurHero = window.balance[curEnemyHeroId];

                                Object.keys(resultForCurHero['hero_total_balance_result']).forEach(function (i)
                                {
                                    var setType = resultForCurHero['hero_total_balance_result'][i]['setType'];
                                    if (setType == iSetType)
                                    {
                                        var secondHeroId = resultForCurHero['hero_total_balance_result'][i]['hId'];
                                        if (curRecomHeroId == secondHeroId)
                                        {
                                            var balanceCoef = resultForCurHero['hero_total_balance_result'][i]['balCoef'];

                                            // console.log(balanceCoef);
                                            var isReversedSynergy = resultForCurHero['hero_total_balance_result'][i]['isRvrs'];

                                            if ((setType == 1) && (balanceCoef <= 0))
                                            {
                                                if (isReversedSynergy == 0)
                                                {
                                                    isReversedSynergy = 1;
                                                } else {
                                                    isReversedSynergy = 0;
                                                }
                                            }

                                            if (iSetType == 0)
                                            {
                                                var redOrGreen = balanceCoef >= 0 ? 'green' : 'red';
                                            } else {
                                                var redOrGreen = balanceCoef > 0 ? 'red' : 'green';
                                            }

                                            var note = resultForCurHero['hero_total_balance_result'][i]['note'];

                                            if (note == '')
                                            {
                                                if (setType == 1)
                                                {
                                                    note = getPreStr_js('EDITOR', '_DFLT_NOTE_COUNTER_');
                                                } else
                                                {
                                                    if (balanceCoef >= 0) {
                                                        note = getPreStr_js('EDITOR', '_DFLT_NOTE_SNRG_');
                                                    } else {
                                                        note = getPreStr_js('EDITOR', '_DFLT_NOTE_ANTISNRG_');
                                                    }
                                                }
                                            }

                                            // using enemy ID in key, as bellow we will add for each enemy hero id (with same)
                                            var key = iSetType + '_' + redOrGreen + '_' + curEnemyHeroId + '_' + i;
                                            if (typeof alreadyAddedNotes[key] == 'undefined')
                                            {
                                                alreadyAddedNotes[key] = 1;                                    


                                                // if (isReversedSynergy == 0)
                                                // {
                                                //     var selAb1 = resultForCurHero['hero_total_balance_result'][i]['selAb1'];
                                                //     var selAb2 = resultForCurHero['hero_total_balance_result'][i]['selAb2'];
                                                // } else {
                                                //     var selAb1 = resultForCurHero['hero_total_balance_result'][i]['selAb1'];
                                                //     var selAb2 = resultForCurHero['hero_total_balance_result'][i]['selAb2'];                                                    
                                                // }

                                                var selAb1 = resultForCurHero['hero_total_balance_result'][i]['selAb1'];
                                                var selAb2 = resultForCurHero['hero_total_balance_result'][i]['selAb2'];

                                                if (redOrGreen == 'green')
                                                {
                                                    // green
                                                    greenNotesCount++;
                                                    recomHeroGreenNotes[greenNotesCount] = [];
                                                    recomHeroGreenNotes[greenNotesCount]['note'] = note;
                                                    recomHeroGreenNotes[greenNotesCount]['heroes'] = [];
                                                    recomHeroGreenNotes[greenNotesCount]['heroes'].push(curEnemyHeroId);
                                                    recomHeroGreenNotes[greenNotesCount]['selAb1'] = selAb1;
                                                    recomHeroGreenNotes[greenNotesCount]['selAb2'] = selAb2;
                                                    
                                                    //recomHeroGreenNotes[greenNotesCount]['abils'].push(curEnemyHeroId);
                                                    if(setType == 1)
                                                    {
                                                        recomHeroGreenNotes[greenNotesCount]['balCoef'] = Number(balanceCoef) * -1;    
                                                    } else {
                                                        recomHeroGreenNotes[greenNotesCount]['balCoef'] = Number(balanceCoef);
                                                    }
                                                } else {
                                                    // red
                                                    redNotesCount++;
                                                    recomHeroRedNotes[redNotesCount] = [];
                                                    recomHeroRedNotes[redNotesCount]['note'] = note;
                                                    recomHeroRedNotes[redNotesCount]['heroes'] = [];
                                                    recomHeroRedNotes[redNotesCount]['heroes'].push(curEnemyHeroId);
                                                    recomHeroRedNotes[redNotesCount]['selAb1'] = selAb1;
                                                    recomHeroRedNotes[redNotesCount]['selAb2'] = selAb2;
                                                    if(setType == 1)
                                                    {
                                                        recomHeroRedNotes[redNotesCount]['balCoef'] = Number(balanceCoef) * -1;    
                                                    } else {
                                                        recomHeroRedNotes[redNotesCount]['balCoef'] = Number(balanceCoef);
                                                    }
                                                }

                                                // проходим по оставшимся героям и определяем нет ли у них тоже такого Note
                                                internalCyclePickElements.each(function()
                                                {
                                                    var internalCycleEnemyHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
                                                    if (internalCycleEnemyHeroId != curEnemyHeroId)
                                                    {
                                                        var internalCycleResultForCurHero = window.balance[internalCycleEnemyHeroId];
                                                        Object.keys(internalCycleResultForCurHero['hero_total_balance_result']).forEach(function (i2)
                                                        {
                                                            var internalSetType = internalCycleResultForCurHero['hero_total_balance_result'][i2]['setType'];
                                                            
                                                            if (internalSetType == iSetType)
                                                            {
                                                                var internalSecondHeroId = internalCycleResultForCurHero['hero_total_balance_result'][i2]['hId'];
                                                                if (curRecomHeroId == internalSecondHeroId)
                                                                {
                                                                    var internalNote = internalCycleResultForCurHero['hero_total_balance_result'][i2]['note'];
                                                                    var internalBalanceCoef = internalCycleResultForCurHero['hero_total_balance_result'][i2]['balCoef'];

                                                                    if (internalNote == '')
                                                                    {
                                                                        if (internalSetType == 1)
                                                                        {
                                                                            internalNote = getPreStr_js('EDITOR', '_DFLT_NOTE_COUNTER_');
                                                                        } else
                                                                        {
                                                                            if (internalBalanceCoef >= 0) {
                                                                                internalNote = getPreStr_js('EDITOR', '_DFLT_NOTE_SNRG_');
                                                                            } else {
                                                                                internalNote = getPreStr_js('EDITOR', '_DFLT_NOTE_ANTISNRG_');
                                                                            }
                                                                        }
                                                                    }

                                                                    if (internalNote == note)
                                                                    {
                                                                        var internalRedOrGreen = internalBalanceCoef > 0 ? 'red' : 'green';                                                            
                                                                        if (internalRedOrGreen == redOrGreen)
                                                                        {
                                                                            var internalKey = iSetType + '_' + internalRedOrGreen + '_' + internalCycleEnemyHeroId + '_' + i2;
                                                                            if (typeof alreadyAddedNotes[internalKey] == 'undefined')
                                                                            {
                                                                                alreadyAddedNotes[internalKey] = 1;

                                                                                var selAb1 = internalCycleResultForCurHero['hero_total_balance_result'][i2]['selAb1'];
                                                                                var selAb2 = internalCycleResultForCurHero['hero_total_balance_result'][i2]['selAb2'];

                                                                                if (redOrGreen == 'green')
                                                                                {
                                                                                    // green
                                                                                    recomHeroGreenNotes[greenNotesCount]['heroes'].push(internalCycleEnemyHeroId);
                                                                                    if(setType == 1)
                                                                                    {
                                                                                        recomHeroGreenNotes[greenNotesCount]['balCoef'] += Number(internalBalanceCoef) * -1;    
                                                                                    } else {
                                                                                        recomHeroGreenNotes[greenNotesCount]['balCoef'] += Number(internalBalanceCoef);
                                                                                    }  

                                                                                    var selAbiOld = recomHeroGreenNotes[greenNotesCount]['selAb1'];
                                                                                    recomHeroGreenNotes[greenNotesCount]['selAb1'] = uniteSpaceSeparatedTextByUniqueVal(selAbiOld, selAb1);

                                                                                    var selAbiOld = recomHeroGreenNotes[greenNotesCount]['selAb2'];
                                                                                    recomHeroGreenNotes[greenNotesCount]['selAb2'] = uniteSpaceSeparatedTextByUniqueVal(selAbiOld, selAb2);
                                                                                } else {
                                                                                    // red
                                                                                    recomHeroRedNotes[redNotesCount]['heroes'].push(internalCycleEnemyHeroId);
                                                                                    if(setType == 1)
                                                                                    {
                                                                                        recomHeroRedNotes[redNotesCount]['balCoef'] += Number(internalBalanceCoef) * -1;    
                                                                                    } else {
                                                                                        recomHeroRedNotes[redNotesCount]['balCoef'] += Number(internalBalanceCoef);
                                                                                    }

                                                                                    var selAbiOld = recomHeroRedNotes[redNotesCount]['selAb1'];
                                                                                    recomHeroRedNotes[redNotesCount]['selAb1'] = uniteSpaceSeparatedTextByUniqueVal(selAbiOld, selAb1);

                                                                                    var selAbiOld = recomHeroRedNotes[redNotesCount]['selAb2'];
                                                                                    recomHeroRedNotes[redNotesCount]['selAb2'] = uniteSpaceSeparatedTextByUniqueVal(selAbiOld, selAb2);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        });                                                                    
                                                    }
                                                });

                                                //recomHeroGreenNotes[greenNotesCount]['heroes'].push(curEnemyHeroId);
                                                //recomHeroGreenNotes[greenNotesCount]['abils'] = [];
                                                // console.log(balanceCoef);
                                                if (redOrGreen == 'green')
                                                {
                                                    // green
                                                    balanceNoteTemplate = recomHeroGreenNotes[greenNotesCount]['note'];
                                                    counterHeroesArray = recomHeroGreenNotes[greenNotesCount]['heroes'];
                                                    secondHeroId = curRecomHeroId;
                                                    selAb1 = recomHeroGreenNotes[greenNotesCount]['selAb1'];
                                                    selAb2 = recomHeroGreenNotes[greenNotesCount]['selAb2'];
                                                    //isReversedSynergy = 0;

                                                    recomHeroGreenNotes[greenNotesCount]['note'] = generateMultiHeroBalanceNote(balanceNoteTemplate, counterHeroesArray, secondHeroId, selAb1, selAb2, isReversedSynergy);
                                                } else {
                                                    // red
                                                    balanceNoteTemplate = recomHeroRedNotes[redNotesCount]['note'];
                                                    counterHeroesArray = recomHeroRedNotes[redNotesCount]['heroes'];
                                                    secondHeroId = curRecomHeroId;
                                                    selAb1 = recomHeroRedNotes[redNotesCount]['selAb1'];
                                                    selAb2 = recomHeroRedNotes[redNotesCount]['selAb2'];
                                                    //isReversedSynergy = 0;

                                                    recomHeroRedNotes[redNotesCount]['note'] = generateMultiHeroBalanceNote(balanceNoteTemplate, counterHeroesArray, secondHeroId, selAb1, selAb2, isReversedSynergy);
                                                }
                                            }
                                        }
                                    }
                                });
                        });
                    }
                    recommendHtml += '<div class="heroNotesWrapForBalance" style="display:none">';
                        var colorClass = 'noticeGreen';
                        // console.log(balanceCoef);
                        for (var i3 = 0; i3 < recomHeroGreenNotes.length; i3++)
                        {
                            var note = recomHeroGreenNotes[i3]['note'];

                            //recomHeroGreenNotes[greenNotesCount]['heroes'] = [];
                            //recomHeroGreenNotes[greenNotesCount]['heroes'].push(curEnemyHeroId);

                            recommendHtml += '<div class="noteForBalance '+colorClass+'">';
                                recommendHtml += '<div class="noteTextForBalance">';
                                        recommendHtml += note;
                                        // for Counter-By we need to change H1 and H2 places
                                        //recommendHtml += generateBalanceNote(note, secondHeroId, clickedheroId, selAb2, selAb1, allInvolvedAbilitiesResult, isReversedSynergy);
                                        //recommendHtml += generateBalanceNote(note, clickedheroId, secondHeroId, selAb1, selAb2, allInvolvedAbilitiesResult, isReversedSynergy);
                                recommendHtml += '</div>';
                                
                                recommendHtml += '<div class="coefForBalance">';
                                    recommendHtml += recomHeroGreenNotes[i3]['balCoef'];
                                recommendHtml += '</div>';
                            recommendHtml += '</div>';                        
                        }

                        var colorClass = 'noticeRed';
                        for (var i3 = 0; i3 < recomHeroRedNotes.length; i3++)
                        {
                            var note = recomHeroRedNotes[i3]['note'];

                            //recomHeroRedNotes[recomHeroRedNotes]['heroes'] = [];
                            //recomHeroRedNotes[recomHeroRedNotes]['heroes'].push(curEnemyHeroId);

                            recommendHtml += '<div class="noteForBalance '+colorClass+'">';
                                recommendHtml += '<div class="noteTextForBalance">';
                                        recommendHtml += note;
                                        // for Counter-By we need to change H1 and H2 places
                                        //recommendHtml += generateBalanceNote(note, secondHeroId, clickedheroId, selAb2, selAb1, allInvolvedAbilitiesResult, isReversedSynergy);
                                        //recommendHtml += generateBalanceNote(note, clickedheroId, secondHeroId, selAb1, selAb2, allInvolvedAbilitiesResult, isReversedSynergy);
                                recommendHtml += '</div>';
                                recommendHtml += '<div class="coefForBalance">';
                                    recommendHtml += recomHeroRedNotes[i3]['balCoef'];
                                recommendHtml += '</div>';
                            recommendHtml += '</div>';                        
                        }                        
                    recommendHtml += '</div>';
                recommendHtml += '</div>';

                // jQuery('#heroCounterBalanceListWrap').append('<div>'+heroLocalName+' ('+ tempBalanceHeroValueArray[i] +')</div><br />');
                jQuery('#heroCounterBalanceListWrap').append(recommendHtml);
            }

            // click on recommended hero
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


            function sortTotalHeroCoefDESC(a, b) {
                var contentA = Number($(a).find('.coefForBalance').text());
                var contentB = Number($(b).find('.coefForBalance').text());
                return contentA < contentB ? 1 : -1;
            };
            $('.heroNotesWrapForBalance').each(function(){
                $(this).find('.noteForBalance').sort(sortTotalHeroCoefDESC).appendTo( $(this) );
            });
            
            // delete old highlighted from heroes
            $('img.highlight').remove();
            // подсветка рекомендованных героев
            $('.heroImgWrapForBalance').each(function() 
            {
                var curRecomHeroId = $(this).attr('data-hero-id');
                $('.heroListImg[data-hero-id="'+curRecomHeroId+'"]').prepend('<img src="images/suggested_hero.png" class="highlight">');
            });
        }
    }        
}

//функция для заполнения инпута текстом пиков и банов
function fillPickBanInput(friendPickElements, enemyPickElements, banPickElements) 
{
    // delete highlight from heroes if noone if pick/ban slots (fix 12900)
    if(friendPickElements.length < 1 && enemyPickElements.length < 1 && banPickElements.length < 1)
    {
        $('img.highlight').remove();
    }

    //текст для врагов
    var enemyPickText = '';
    var isCommaNeeded = false;
    enemyPickElements.each(function() 
    {
        if (isCommaNeeded)
        {
            enemyPickText += ', ';
        }
        enemyPickText += $(this).find('[data-alias-single]').attr('data-alias-single');
        isCommaNeeded = true;
    });

    //текст для банов
    var banPickText = '';
    var isCommaNeeded = false;
    banPickElements.each(function() 
    {
        if (isCommaNeeded)
        {
            banPickText += ', ';
        }            
        banPickText += $(this).find('[data-alias-single]').attr('data-alias-single');
        isCommaNeeded = true;
    });

    //текст для союзников
    var friendPickText = '';
    var isCommaNeeded = false;
    friendPickElements.each(function() 
    {
        if (isCommaNeeded)
        {
            friendPickText += ', ';
        }
        friendPickText += $(this).find('[data-alias-single]').attr('data-alias-single');
        isCommaNeeded = true;            
    });

    // окончательное составление текста
    var textForInput = '';

    if(enemyPickText != '')
    {
        textForInput += '(E) ' + enemyPickText;
    }

    if(banPickText != '')
    {
        if (textForInput != '')
        {
            textForInput += ' ';
        }
        textForInput += '(B) ' + banPickText;
    }

    if(friendPickText != '')
    {
        if (textForInput != '')
        {
            textForInput += ' ';
        }            
        textForInput += '(F) ' + friendPickText;
    }

    $('#fillHeroPickAndBanSlotsViaAliasSingleInput').val(textForInput);
}

function pushToBottom(array, pos, newVal, heroIdArray, newHeroId)
{
    if (pos < window.maxRecomendations)
    {
        temp = pushToBottom(array, pos+1, array[pos], heroIdArray, heroIdArray[pos]);
        array = temp['heroValArray'];
        heroIdArray = temp['heroIdArray'];
        array[pos] = newVal;
        heroIdArray[pos] = newHeroId;
    }
    var temp = [];
    temp['heroValArray'] = array;
    temp['heroIdArray'] = heroIdArray;
    return temp;
}


function recognizeHeroesAndWriteToArray(commaSepStringofHeroes, tempArrayOfHeroes)
{
    var tempHeroArray = commaSepStringofHeroes.trim().split(',');
    for (var i = 0; i < tempHeroArray.length; i++)
    {
        var tempHeroName = tempHeroArray[i].trim();
        if ((tempHeroName != '') && (tempHeroName != ' '))
        {
            tempArrayOfHeroes.push(tempHeroName);
        }
    }
    return tempArrayOfHeroes;
}

function uniteSpaceSeparatedTextByUniqueVal(oldString, newString)
{
    var resultText = oldString;
    var selAbiNew = newString.split(' ');
    var selAbiOld = oldString.split(' ');

    for(var z = 0; z < selAbiNew.length; z++)
    {
        isFound = false;
        for(var z2 = 0; z2 < selAbiOld.length; z2++)
        {
            if(selAbiNew[z] == selAbiOld[z2])
            {
                isFound = true;
                break;
            }
        }
        if (!isFound)
        {
            if (resultText != '')
            {
                resultText += ' ';
            }                                                                                                
            resultText += selAbiNew[z];
        }
    }
    return resultText;
}