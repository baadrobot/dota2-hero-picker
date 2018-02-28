$(document).ready(function ()
{
    // console.log(window.heroList[0]['n'] + ' ' + window.heroList[0]['pr'] + ' ' + window.heroList[0]['wr']);

    // console.log(window.heroList[1]['initiator']);
    // console.log(window.heroList[1]['durable']);
    // console.log(window.heroList[1]['pusher']);
    // var result = $.grep(window.heroList, function(e){ return e.id == 1; });
    // console.log(result);
    // console.log(result[0].initiator);

    // var heroObj = window.heroList.find(function(element) {
    //     return element.id == 1;
    //   });
    //   console.log(heroObj);
    //   console.log(heroObj.initiator);
      
    // ChartJS Radar
        var canvasEl = $('#chartRadar');
        var enemyRadarColor = '#8b08158f';

        var data = {
            labels: ['Initiator', 'Durable', 'Pusher', 'Nuker', 'Antipusher', 'Control']
            ,datasets: [{
                data: [0, 0, 0, 0, 0, 0]
                ,backgroundColor: 'rgba(246,144,8, 0.3)'
                ,borderColor: 'rgba(246,144,8, 0.8)'
                ,borderWidth: 2
                ,pointBackgroundColor: 'rgba(246,144,8, 1)'
            }
            ,{
                data: [0, 0, 0, 0, 0, 0]
                ,backgroundColor: enemyRadarColor
                ,borderColor: enemyRadarColor
                ,borderWidth: 2
                ,pointBackgroundColor: enemyRadarColor
            }]
        }

        var options = {
            scale: {
                ticks: {
                    display: false
                    ,beginAtZero: true
                    // ,max: 7
                }
                // ,display: false
            }
            ,legend: {
                display: false
            }
            ,animation: {
                duration: 500
            }
            ,responsive: false
        }

        window.radarChart = new Chart(canvasEl, {
            type: 'radar',
            data: data,
            options: options
        });
        // Chart.defaults.responsive = false;
    // end of ChartJS Radar

    $(window).resize(function () {
        resizeVerticalMenu();
    });

    $('#miniMapWrap').mouseup(function(){
        $("#miniMapWrap div[data-slot-role]").removeClass('highlightHoveredSlot');
    });

    // click on sort radio buttons
    //$('#balanceSortWrap label').on('mouseup', function()

    $(document).on('change', 'input:radio[id^="sortBy"]', function (event)
    {
        $('#finalBalanceItemListWrap').hide();
        $('#counterPleaseWait').show();
        doRecountCounterPickBalance();
        // console.log($('#sortByRole:checked'));
    });

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

    // drop on remove icon slot

    $('#removeIcon').droppable({
        drop: function (event, ui)
        {
            // recived in placeholder (not droped out for delete)
            ui.helper.attr('data-is-recieved-or-droped-out', 1);

            // recieverEl = $(this);
            if(ui.helper.attr('data-dragged-from') == 'fromMiniMap')
            {
                // hero
                var draggedHeroId = ui.helper.attr('data-hero-id');
                // console.log
                // remove locked hero from map and pick slots
                removeHeroFromSlot($('#pickedHeroWrap div[data-hero-id="'+draggedHeroId+'"'), 1);
                releaseHeroInList(draggedHeroId);
                deleteHeroFromMinimap(draggedHeroId);
                pickedOrBanedHeroPointerEvents(draggedHeroId);

                $(this).css({
                    'border-color': '#cd1616'
                   ,'background-color': '#cd1616'
                   ,'opacity': 1
                });
            } else if (ui.helper.attr('data-dragged-from') == 'userRoleFromMiniMap') {
                // question mark
                window.draggableElParent.find('i.questionMark').remove();

                $(this).css({
                    'border-color': '#cd1616'
                   ,'background-color': '#cd1616'
                   ,'opacity': 0.7
                });

                doRecountCounterPickBalance();
            }
        },
        over: function(event, ui) {
            if(ui.helper.attr('data-dragged-from') == 'fromMiniMap' || ui.helper.attr('data-dragged-from') == 'userRoleFromMiniMap')
            {
                $(this).css({
                    'border-color': 'red'
                   ,'background-color': 'red'
                });
            }
        },
        out: function(event, ui) {
            $(this).css({
                'border-color': '#cd1616'
               ,'background-color': '#cd1616'
            });
        }
    });

    // drag'n'drop
        // drag for hero list img
        draggableForHeroListImg();
        // end of drag for hero list img

        // drop for empty slot
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
                        lockNewHeroInSlot($('.pickedHeroImgWrap[data-hero-id="' + draggedHeroId + '"]').parent(), prevSlotHeroId, 0, 1);
                        lockNewHeroInSlot(recieverEl, draggedHeroId, 0, 1);
                        $('.pickedHeroImgWrap[data-hero-id="' + prevSlotHeroId + '"]').parent().addClass('slot').removeClass('emptySlot');
                    } else {
                        // ------- hero dragged in from hero list
                        releaseHeroInList(prevSlotHeroId);
                        deleteHeroFromMinimap(prevSlotHeroId);
                        slotImgWrap.remove();
                        lockNewHeroInSlot(recieverEl, draggedHeroId, 0, 1);
                        pickedOrBanedHeroPointerEvents(prevSlotHeroId);
                        pickedOrBanedHeroPointerEvents(draggedHeroId);
                    }
                } else {
                    lockNewHeroInSlot(recieverEl, draggedHeroId, 0, 1);
                    pickedOrBanedHeroPointerEvents(draggedHeroId);
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


    // drag for hero user role
    $('#userRole').draggable({
        helper: "clone"
        , revert: 'invalid'
        , zIndex: 200
        , cursor: 'url("/images/closedhand.png"), auto'
        , drag: function (event, ui)
        {
            // $(this).addClass('grayscale');
            // ui.helper.css('cursor', 'url("/images/closedhand.png"), auto');
        },
        start: function (e, ui)
        {
            ui.helper.attr('data-dragged-from', 'userRole');

            // highlight free slots on map
            if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
            {
                // our team in dire
                $('#miniMapWrap > div[id^="dire"]').each(function(){
                    if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                    {
                        $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                        $('#direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
                        .addClass('opacityForHighlight');
                    }
                });
            } else {
                // our team in radiant
                $('#miniMapWrap > div[id^="radiant"]').each(function(){
                    if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                    {
                        $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                        $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3')
                        .addClass('opacityForHighlight');
                    }
                });
            }
        },
        stop: function (event, ui)
        {
            // $(this).addClass('grayscale');
            // remove highlight from free slots on map
            $('#miniMapWrap > div.highlightSlot').removeClass('highlightSlot').find('span').remove();
            $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
            .removeClass('opacityForHighlight');
        }
    });
    // end of drag for hero user role

    // droppable for mini map slots
    var recieverEl;
    $("#miniMapWrap div[data-slot-role]").droppable({
        drop: function (event, ui)
        {
            // recived in placeholder (not droped out for delete)
            ui.helper.attr('data-is-recieved-or-droped-out', 1);

            recieverEl = $(this);

            var draggedHeroId = ui.helper.attr('data-hero-id');
            var draggedHeroCodename = ui.helper.attr('data-hero-codename');

            // check receiver element team
            var recieverElId = $(recieverEl).attr('id');
            if(recieverElId.indexOf('radiant') >= 0)
            {
                // radiant
                var recieverElForHeroLock = $('#pickedHeroWrap .radiant > .emptySlot:first');
                var receiverTeam = 'radiant';
            } else if(recieverElId.indexOf('dire') >= 0)
            {
                // dire
                var recieverElForHeroLock = $('#pickedHeroWrap .dire > .emptySlot:first');
                var receiverTeam = 'dire';
            }

            // check if slot is NOT empty
            var lockedHero = recieverEl.find('img[data-hero-id]');
            var lockedQuestionMark = recieverEl.find('i.questionMark');
            if (lockedHero.length || lockedQuestionMark.length)
            {
                // slot is NOT empty
                // check what is in slot hero or question?
                var recieverElId = $(recieverEl).attr('id');
                if(lockedHero.length)
                {
                    // hero in slot
                    if(ui.helper.attr('data-dragged-from') == 'fromHeroList')
                    {
                        //dragged from hero list
                        // remove locked hero from map and pick slots
                        var lockedHeroEl = recieverEl.find('img');
                        var lockedHeroId = lockedHeroEl.attr('data-hero-id');
                        removeHeroFromSlot($('#pickedHeroWrap div[data-hero-id="'+lockedHeroId+'"'), 1);
                        releaseHeroInList(lockedHeroId);
                        pickedOrBanedHeroPointerEvents(lockedHeroId);
                        lockedHeroEl.remove();

                        // add dragged hero
                        var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287';

                        $(recieverEl)
                        .append('<img src="'+curHeroIconUrl+'" data-hero-id="'+draggedHeroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(draggedHeroId)+'" width="28px">');

                        // make it like it picked
                        if(recieverElId.indexOf('radiant') >= 0)
                        {
                            // radiant
                            var recieverElForHeroLock = $('#pickedHeroWrap .radiant > .emptySlot:first');
                        } else if(recieverElId.indexOf('dire') >= 0)
                        {
                            // dire
                            var recieverElForHeroLock = $('#pickedHeroWrap .dire > .emptySlot:first');
                        }
                        lockNewHeroInSlotForDroppableEmptySlot(recieverElForHeroLock, draggedHeroId, 1, 0);
                        pickedOrBanedHeroPointerEvents(draggedHeroId);
                    }
                    else if(ui.helper.attr('data-dragged-from') == 'fromMiniMap')
                    {
                        // dragged from mini-map
                        var draggedElSlotId = ui.helper.attr('data-dragged-from-id');
                        if(draggedElSlotId == recieverEl.attr('id'))
                        {
                            console.log('meow');
                        }
                        else if( (recieverElId.indexOf('dire') >= 0 && draggedElSlotId.indexOf('radiant') >= 0)
                            || (recieverElId.indexOf('radiant') >= 0 && draggedElSlotId.indexOf('dire') >= 0) )
                        {
                            // heroes from different sides
                            // get id of recieving el hero, only then swap
                            var recievedElHeroId = recieverEl.find('img').attr('data-hero-id');

                            var draggedHeroParent = $('#pickedHeroWrap div[data-hero-id="'+draggedHeroId+'"]').parent();
                            var receivedHeroParent = $('#pickedHeroWrap div[data-hero-id="'+recievedElHeroId+'"]').parent();

                            // swap heroes on map
                            window.draggableElParent.prepend(lockedHero);
                            recieverEl.append(window.draggableEl);

                            // swap heroes in picks
                            lockNewHeroInSlotForDroppableEmptySlot(draggedHeroParent, recievedElHeroId, 1, 0);
                            lockNewHeroInSlotForDroppableEmptySlot(receivedHeroParent, draggedHeroId, 1, 0);
                            $(draggedHeroParent).addClass('slot').removeClass('emptySlot');
                       } else {
                            window.draggableElParent.prepend(lockedHero);
                            recieverEl.append(window.draggableEl);
                        }
                    } else if(ui.helper.attr('data-dragged-from') == 'fromRecommendList')
                    {
                        // dragged from recommend list

                        // remove locked hero from map and pick slots
                        var lockedHeroEl = recieverEl.find('img');
                        var lockedHeroId = lockedHeroEl.attr('data-hero-id');
                        removeHeroFromSlot($('#pickedHeroWrap div[data-hero-id="'+lockedHeroId+'"'), 1);
                        releaseHeroInList(lockedHeroId);
                        pickedOrBanedHeroPointerEvents(lockedHeroId);
                        lockedHeroEl.remove();

                        // add dragged hero
                        draggedHeroCodename = $('#heroListWrap [data-hero-id="'+draggedHeroId+'"]').attr('data-hero-codename');
                        var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287';

                        $(recieverEl)
                        .append('<img src="'+curHeroIconUrl+'" data-hero-id="'+draggedHeroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(draggedHeroId)+'" width="28px">');

                        // make it like it picked
                        if(recieverElId.indexOf('radiant') >= 0)
                        {
                            // radiant
                            var recieverElForHeroLock = $('#pickedHeroWrap .radiant > .emptySlot:first');
                        } else if(recieverElId.indexOf('dire') >= 0)
                        {
                            // dire
                            var recieverElForHeroLock = $('#pickedHeroWrap .dire > .emptySlot:first');
                        }
                        lockNewHeroInSlotForDroppableEmptySlot(recieverElForHeroLock, draggedHeroId, 1, 0);
                        pickedOrBanedHeroPointerEvents(draggedHeroId);
                    }
                    else if(ui.helper.attr('data-dragged-from') == 'userRole')
                    {
                        recieverEl.removeClass('highlightHoveredSlot');
                    }
                    else if(ui.helper.attr('data-dragged-from') == 'userRoleFromMiniMap')
                    {
                        // dragged userRole from mini map
                        recieverEl.removeClass('highlightHoveredSlot');

                        // check if dragger came from another team
                        if( (recieverEl.attr('id').indexOf('dire') >= 0 && window.draggableElParent.attr('id').indexOf('radiant') >= 0)
                        || recieverEl.attr('id').indexOf('radiant') >= 0 && window.draggableElParent.attr('id').indexOf('dire') >= 0)
                        {
                            // another team
                            console.log('u cant put question in enemy team!');
                        } else {
                            // same team
                            window.draggableElParent.prepend(lockedHero);
                            $('#miniMapWrap i.questionMark').remove();
                            recieverEl.append('<i class="questionMark fa fa-question-circle"></i>');

                            // make the question inside map draggable
                            draggableQuestionInsideMap();
                        }
                    }
                } else if(lockedQuestionMark.length) {
                    // question in slot
                    if(ui.helper.attr('data-dragged-from') == 'fromMiniMap')
                    {
                        // dragged from mini map
                        recieverEl.removeClass('highlightHoveredSlot');

                        // check if dragger came from another team
                        if( (recieverEl.attr('id').indexOf('dire') >= 0 && window.draggableElParent.attr('id').indexOf('radiant') >= 0)
                        || recieverEl.attr('id').indexOf('radiant') >= 0 && window.draggableElParent.attr('id').indexOf('dire') >= 0)
                        {
                            // another team
                            recieverEl.html(window.draggableEl);
                        } else {
                            // same team
                            $('#miniMapWrap i.questionMark').remove();
                            recieverEl.append(window.draggableEl);
                            window.draggableElParent.append('<i class="questionMark fa fa-question-circle"></i>');

                            // make the question inside map draggable
                            draggableQuestionInsideMap();
                        }
                    }
                    else if(ui.helper.attr('data-dragged-from') == 'fromHeroList')
                    {
                        // dragged from hero list
                        // add dragged hero
                        var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287';

                        $(recieverEl).find('i.questionMark').remove();

                        $(recieverEl)
                        .append('<img src="'+curHeroIconUrl+'" data-hero-id="'+draggedHeroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(draggedHeroId)+'" width="28px">');

                        // make it like it picked
                        if(recieverElId.indexOf('radiant') >= 0)
                        {
                            // radiant
                            var recieverElForHeroLock = $('#pickedHeroWrap .radiant > .emptySlot:first');
                        } else if(recieverElId.indexOf('dire') >= 0)
                        {
                            // dire
                            var recieverElForHeroLock = $('#pickedHeroWrap .dire > .emptySlot:first');
                        }
                        lockNewHeroInSlotForDroppableEmptySlot(recieverElForHeroLock, draggedHeroId, 1, 0);
                        pickedOrBanedHeroPointerEvents(draggedHeroId);
                    }
                    else if(ui.helper.attr('data-dragged-from') == 'fromRecommendList')
                    {
                        // dragged from recommend list

                        $(recieverEl).find('i.questionMark').remove();

                        // add dragged hero
                        draggedHeroCodename = $('#heroListWrap [data-hero-id="'+draggedHeroId+'"]').attr('data-hero-codename');
                        var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287';

                        $(recieverEl)
                        .append('<img src="'+curHeroIconUrl+'" data-hero-id="'+draggedHeroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(draggedHeroId)+'" width="28px">');

                        // make it like it picked
                        if(recieverElId.indexOf('radiant') >= 0)
                        {
                            // radiant
                            var recieverElForHeroLock = $('#pickedHeroWrap .radiant > .emptySlot:first');
                        } else if(recieverElId.indexOf('dire') >= 0)
                        {
                            // dire
                            var recieverElForHeroLock = $('#pickedHeroWrap .dire > .emptySlot:first');
                        }
                        lockNewHeroInSlotForDroppableEmptySlot(recieverElForHeroLock, draggedHeroId, 1, 0);
                        pickedOrBanedHeroPointerEvents(draggedHeroId);
                    }
                }
            } else {
                // slot is empty

                if(ui.helper.attr('data-dragged-from') == 'fromHeroList')
                {
                    // dragged from hero list
                    // check if there are already 5 heroes picked in team
                    if($('#miniMapWrap div[id^="'+receiverTeam+'"] > img[data-hero-id]').length != 5)
                    {
                        var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287';

                        $(recieverEl)
                        .append('<img src="'+curHeroIconUrl+'" data-hero-id="'+draggedHeroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(draggedHeroId)+'" width="28px">');

                        // make it like it picked
                        lockNewHeroInSlotForDroppableEmptySlot(recieverElForHeroLock, draggedHeroId, 1, 0);
                        pickedOrBanedHeroPointerEvents(draggedHeroId);
                    } else {
                        alert(receiverTeam + ' team already picked 5 heroes');
                    }
                }
                else if(ui.helper.attr('data-dragged-from') == 'fromRecommendList')
                {
                    // dragged from recommend list
                    draggedHeroCodename = $('#heroListWrap [data-hero-id="'+draggedHeroId+'"]').attr('data-hero-codename');
                    var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287';

                    $(recieverEl)
                    .append('<img src="'+curHeroIconUrl+'" data-hero-id="'+draggedHeroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(draggedHeroId)+'" width="28px">');

                    var recieverElId = $(recieverEl).attr('id');
                    if(recieverElId.indexOf('radiant') >= 0)
                    {
                        // radiant
                        var recieverElForHeroLock = $('#pickedHeroWrap .radiant > .emptySlot:first');
                    } else if(recieverElId.indexOf('dire') >= 0)
                    {
                        // dire
                        var recieverElForHeroLock = $('#pickedHeroWrap .dire > .emptySlot:first');
                    }
                    lockNewHeroInSlotForDroppableEmptySlot(recieverElForHeroLock, draggedHeroId, 1, 0);
                    pickedOrBanedHeroPointerEvents(draggedHeroId);
                }
                else if(ui.helper.attr('data-dragged-from') == 'userRoleFromMiniMap')
                {
                    // dragged from userRole from mini map
                    recieverEl.append('<i class="questionMark fa fa-question-circle"></i>').removeClass('highlightHoveredSlot');
                    window.draggableElParent.html('');

                    // make the question inside map - draggable
                    draggableQuestionInsideMap();
                }
                else if(ui.helper.attr('data-dragged-from') == 'userRole')
                {
                    // dragged from userRole
                    recieverEl.removeClass('highlightHoveredSlot');

                    // check if there are already 5 heroes picked in team
                    if($('#miniMapWrap div[id^="'+receiverTeam+'"] > img[data-hero-id]').length != 5)
                    {
                        // $('#miniMapWrap i.questionMark').remove();
                        recieverEl.append('<i class="questionMark fa fa-question-circle"></i>').removeClass('highlightHoveredSlot');

                        // make the question inside map - draggable
                        draggableQuestionInsideMap();
                    }
                } else {
                    // dragged from mini map

                    if( (recieverEl.attr('id').indexOf('dire') >= 0 && draggableElParent.attr('id').indexOf('radiant') >= 0)
                    || recieverEl.attr('id').indexOf('radiant') >= 0 && draggableElParent.attr('id').indexOf('dire') >= 0)
                    {
                        // moved to another team
                        recieverEl.append(window.draggableEl);
                        if(recieverEl.attr('id').indexOf('dire') >= 0)
                        {
                            // hero was in radiant, moved to dire
                            removeHeroFromSlot($('#pickedHeroWrap div[data-hero-id="'+draggedHeroId+'"]'), 0);
                            lockNewHeroInSlotForDroppableEmptySlot($('#pickedHeroWrap .dire > div.emptySlot:first'), draggedHeroId, 1, 0);
                        } else {
                            // hero was in dire, moved to radiant
                            removeHeroFromSlot($('#pickedHeroWrap div[data-hero-id="'+draggedHeroId+'"]'), 0);
                            lockNewHeroInSlotForDroppableEmptySlot($('#pickedHeroWrap .radiant > div.emptySlot:first'), draggedHeroId, 1, 0);
                        }
                    } else {
                        // stayed in same team
                        recieverEl.append(window.draggableEl);
                        window.draggableElParent.html(''); //do not remove
                    }
                }
            }

            if (typeof draggedHeroId == 'undefined')
            {
                doRecountCounterPickBalance();
            } else {
                getAjaxBalanceForHeroId(draggedHeroId, 1);
            }

            iconGlowFunction();

            // refresh fillPickBanInput
            var friendPickElements = $('.friendPick.slot');
            var enemyPickElements = $('.enemyPick.slot');
            var banPickElements = $('.banPick.slot');
            fillPickBanInput(friendPickElements, enemyPickElements, banPickElements);
        },
        over: function(event, ui) {
            $(this).addClass('highlightHoveredSlot');
        },
        out: function(event, ui) {
            $(this).removeClass('highlightHoveredSlot');
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


    $('#fillHeroPickAndBanSlotsViaAliasSingleInput').on('keypress', function(ev)
    {
        if(ev.keyCode == 13)
        {
            $('#fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn').trigger('click');
        }
    });


    $('#fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn').on('click', function ()
    {
        var fillInputValue = $('#fillHeroPickAndBanSlotsViaAliasSingleInput').val();

        // $('#miniMapWrap > div').html('');
        // console.log('okclick');

        // commaSepArray = '(E) Alchim, Axe, BS (B) Lina (F) Lion';
        //commaSepArray[0] = '';
        //commaSepArray[1] = 'E) Alchim, Axe, BS';
        //commaSepArray[2] = 'B) Lina';
        //commaSepArray[3] = 'F) Lion';
        var maxCapHeroes = false;

        if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
        {
            var friendTeam = 'dire';
            var enemyTeam = 'radiant';
        } else {
            var friendTeam = 'radiant';
            var enemyTeam = 'dire';
        }

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

                    if(window.tempArrayE.length > 5)
                    {
                        alert('В команду врага записано более 5ти героев');
                        maxCapHeroes = true;
                    }
                    if(window.tempArrayE.length == 5)
                    {
                        $('#miniMapWrap div[id^="'+enemyTeam+'"] > i.questionMark').remove();
                    }
                } else if (typeSepArray[i].substring(0, 2) == 'f)')
                {
                    window.tempArrayF = recognizeHeroesAndWriteToArray(typeSepArray[i].substring(2), window.tempArrayF);

                    if(window.tempArrayF.length > 5)
                    {
                        alert('В команду союзников записано более 5ти героев');
                        maxCapHeroes = true;
                    }
                    if(window.tempArrayF.length == 5)
                    {
                        $('#miniMapWrap div[id^="'+friendTeam+'"] > i.questionMark').remove();
                    }
                } else if (typeSepArray[i].substring(0, 2) == 'b)')
                {
                    window.tempArrayB = recognizeHeroesAndWriteToArray(typeSepArray[i].substring(2), window.tempArrayB);

                    if(window.tempArrayB.length > 5)
                    {
                        alert('В баны записано более 5ти героев');
                        maxCapHeroes = true;
                    }
                } else {
                    // do nothing
                }
            }
        }
        //(b) axe, dazzle (f) AA (e) medusa, lion

        if(maxCapHeroes)
        {
            return;
        }

        // опустошаем слоты со старыми героями, чтобы потом наполнить их новыми
        $('.pickedHeroImgWrap').each(function()
        {
            var curHeroIdInSlot = $(this).attr('data-hero-id');
            removeHeroFromSlot( $(this), 0 );
            releaseHeroInList(curHeroIdInSlot);
            deleteHeroFromMinimap(curHeroIdInSlot);
            pickedOrBanedHeroPointerEvents(curHeroIdInSlot);
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

    // putHeroOnMinimap('radiant', 'easy', 1, 'slark');
    // putHeroOnMinimap('radiant', 'easy', 'axe');
    // putHeroOnMinimap('radiant', 'easy', 'axe');

    // putHeroOnMinimap('radiant', 'mid', 'axe');
    // putHeroOnMinimap('radiant', 'mid', 'axe');
    // putHeroOnMinimap('radiant', 'mid', 'axe');

    // putHeroOnMinimap('radiant', 'hard', 'axe');
    // putHeroOnMinimap('radiant', 'hard', 'axe');
    // putHeroOnMinimap('radiant', 'hard', 'axe');

    // putHeroOnMinimap('radiant', 'jungle', 'slark');
    // putHeroOnMinimap('radiant', 'roam', 'axe');

    // putHeroOnMinimap('dire', 'easy', 'slark');
    // putHeroOnMinimap('dire', 'easy', 'slark');
    // putHeroOnMinimap('dire', 'easy', 'slark');

    // putHeroOnMinimap('dire', 'mid', 'slark');
    // putHeroOnMinimap('dire', 'mid', 'slark');
    // putHeroOnMinimap('dire', 'mid', 'slark');

    // putHeroOnMinimap('dire', 'hard', 'slark');
    // putHeroOnMinimap('dire', 'hard', 'slark');
    // putHeroOnMinimap('dire', 'hard', 'slark');

    // putHeroOnMinimap('dire', 'jungle', 'slark');
    // putHeroOnMinimap('dire', 'roam', 'axe');

    // deleteHeroFromMinimap('axe');

    // $('#miniMapWrap [id^="dire"]').addClass('iconGlowGreen');
    // $('#miniMapWrap [id^="radiant"]').addClass('iconGlowRed');

    iconGlowFunction();

    // console.log(window.strategieList);
    // console.log(window.roleList);
    // console.log(window.roleList2.length);

    // console.log(getHeroRolesByHeroId(9));

    $('#swapSidesBtn').on('click', function()
    {
        swapSides();
    });

    // console.log(window.inputGetParam);

    if(typeof window.inputGetParam != 'undefined')
    {
        $('#fillHeroPickAndBanSlotsViaAliasSingleInput').val(window.inputGetParam);
        $('#fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn').trigger('click');
    }
});
// - end of jQuery ready





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
        question += '<div id="matchedHeroesListPopup" style="text-align:center">';
        question += '<b>"' + window.conflictWordsArray[0] + '"?</b>';
        question += '<p>' + getPreStr_js('COUNTER_PICK', '_CLARIFY_HERO_') + '</p>';
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

                    lockNewHeroInSlot(curSlotForLock, curHeroId, 0, 1);
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

                            lockNewHeroInSlot(curSlotForLock, curHeroId, 0, 1);
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

                    lockNewHeroInSlot(curSlotForLock, curHeroId, 0, 1);
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

                            lockNewHeroInSlot(curSlotForLock, curHeroId, 0, 1);
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

                    lockNewHeroInSlot(curSlotForLock, curHeroId, 0, 1);
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

                            lockNewHeroInSlot(curSlotForLock, curHeroId, 0, 1);
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

        if (typeof addFillInputToCookie == 'function')
        {
            addFillInputToCookie(textForInput);
        }
        // refresh fillPickBanInput
        // var friendPickElements = $('.friendPick.slot');
        // var enemyPickElements = $('.enemyPick.slot');
        // var banPickElements = $('.banPick.slot');
        // fillPickBanInput(friendPickElements, enemyPickElements, banPickElements);

        $('.pickedHeroImgDelete').hide();
        //doRecountCounterPickBalance();

        pickedOrBanedHeroPointerEventsForAll();
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

    //remove hero from mini-map and uncertain heroes list
    // var heroId = slotItemEl.attr('data-hero-id');
    // deleteHeroFromMinimap(heroId);
    // deleteHeroFromUncertainList(heroId);
}

function releaseHeroInList(heroId)
{
    $('.heroListImg[data-hero-id="' + heroId + '"]')
    .removeClass('pickedOrBaned')
    .find('.redLine').remove();
    // deleteHeroFromMinimap(heroId);
    // console.log(heroId);
}

function lockNewHeroInSlot(slotEl, heroId, recountNeedOrNot, needAddHeroToTheMap)
{
    // clear all old elements
    removeHeroFromSlot( $('.pickedHeroImgWrap[data-hero-id="' + heroId + '"]'), recountNeedOrNot);
    releaseHeroInList(heroId);
    deleteHeroFromMinimap(heroId);

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

    // drag for picked hero img wrap
    draggableForPickedHeroImgWrap(slotEl);
    // end of drag for picked hero img wrap

    // cross button (remove pick/ban)
    slotEl.find('.pickedHeroImgDelete').on('mousedown', function ()
    {
        var deletedHeroId = $(this).parent().attr('data-hero-id');
        var imgWrapToRemoveEl = $(this).parent();
        removeHeroFromSlot(imgWrapToRemoveEl, 1);
        releaseHeroInList(deletedHeroId);
        deleteHeroFromMinimap(heroId);
        doRecountCounterPickBalance();
        pickedOrBanedHeroPointerEvents(heroId);
    });

    // appending uncertain heroes into #uncertainDireHeroesWrap
    if(needAddHeroToTheMap == 1)
    {
        if(slotEl.parent().hasClass('dire'))
        {
            // friends
            addHeroToTheMap('dire', heroId, draggedHeroCodename);
        } else if(slotEl.parent().hasClass('radiant')) {
            // enemy
            addHeroToTheMap('radiant', heroId, draggedHeroCodename);
        }
    }

    // make icons draggable after lockNewHeroInSlot
    //drag n drop for mini-map icons
    draggableForHeroIconsOnMap();
    // end of drag'n'drop for mini map
}

// for Nurax and droppable for empty slot
function lockNewHeroInSlotForDroppableEmptySlot(slotEl, heroId, recountNeedOrNot, needAddHeroToTheMap)
{
    // clear all old elements
    removeHeroFromSlot( $('.pickedHeroImgWrap[data-hero-id="' + heroId + '"]'), recountNeedOrNot);
    releaseHeroInList(heroId);
    // deleteHeroFromMinimap(heroId);

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

    // drag for picked hero img wrap
    draggableForPickedHeroImgWrap(slotEl);
    // end of drag for picked hero img wrap

    // cross/delete button (remove pick/ban)
    slotEl.find('.pickedHeroImgDelete').on('mousedown', function ()
    {
        // console.log($(this).parent().attr('data-hero-id'));
        var deletedHeroId = $(this).parent().attr('data-hero-id');
        var imgWrapToRemoveEl = $(this).parent();
        removeHeroFromSlot(imgWrapToRemoveEl, 1);
        releaseHeroInList(deletedHeroId);
        deleteHeroFromMinimap(heroId);
        // console.log('second');
        doRecountCounterPickBalance();
        // lineThroughLockedRoles();
        pickedOrBanedHeroPointerEvents(heroId);
    });

    // console.log(draggedHeroCodename);
    if(needAddHeroToTheMap == 1)
    {
        if(slotEl.parent().hasClass('dire'))
        {
            // friends
            // $('#uncertainDireHeroesWrap').append('<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287" data-hero-id="'+heroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(heroId)+'" width="28px">');
            // heroMapAutoShuffle('dire');
            addHeroToTheMap('dire', heroId, draggedHeroCodename);
        } else if(slotEl.parent().hasClass('radiant')) {
            // enemy
            // $('#uncertainRadiantHeroesWrap').append('<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287" data-hero-id="'+heroId+'" data-hero-codename="'+draggedHeroCodename+'" data-roles-values="'+getHeroRolesByHeroId(heroId)+'" width="28px">');
            // heroMapAutoShuffle('radiant');
            addHeroToTheMap('radiant', heroId, draggedHeroCodename);
        }
    }

    // make icons draggable after lockNewHeroInSlotForDroppableEmptySlot
    //drag n drop for mini-map icons
    draggableForHeroIconsOnMap();
    // end of drag'n'drop for mini map
}
// for Nurax



function getAjaxBalanceForHeroId(draggedHeroId, recountNeedOrNot)
{
    //
    $('#finalBalanceItemListWrap').hide();
    $('#counterPleaseWait').show();

    // hide recommend block if already 5 heroes picked
    if($('#friendPickList > div.slot').length == 5)
    {
        // console.log('5 heroes picked in friendly team');
        $('#heroCounterBalanceListWrap').hide();
    }

    if (typeof window.balance[draggedHeroId] == 'undefined')
    {
        window.globalHeroAjaxRequests++;

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
                        // console.log('k:'+key);
                        // console.log('v:'+ curInvolvedAbils[key]);
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
}

function doRecountCounterPickBalanceForEnemy()
{
    if (window.globalHeroAjaxRequests == 0)
    {
        var recomendHeroes= [];
        var tempCounterBalance = [];

        //проходимся по циклу выбранных героев врагов
        var banPickElements = $('.banPick.slot');
        var enemyPickElements = $('.enemyPick.slot');

        // проход, по врагам
        enemyPickElements.each(function()
        {
            var curEnemyHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            var resultForCurHero = window.balance[curEnemyHeroId];

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

                if (setType == 1)
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

        window.totallyCounteredHeroArray = [];
        var banedAllStrongCountersBonusPoints = 50;

        // downgrading heroes for suggestion if in window.dontPickHeroesBeforeBanArray[]
        $('.heroListImg').each(function()
        {
            var keyHeroId = $(this).attr('data-hero-id');

            if (typeof window.dontPickHeroesBeforeBanArray[keyHeroId] != 'undefined')
            {
                var isCanBeEasyCountered = false;
                Object.keys(window.dontPickHeroesBeforeBanArray[keyHeroId]).forEach(function (keyCounterHeroId)
                {
                    // toDo: check if counter_hero has free role position

                    if (!(($('#banPickList [data-hero-id="'+keyCounterHeroId+'"]').length) || ($('#friendPickList [data-hero-id="'+keyCounterHeroId+'"]').length)))
                    {
                        isCanBeEasyCountered = true;
                    }
                });

                if (isCanBeEasyCountered)
                {
                    tempCounterBalance[keyHeroId] = -9999;
                } else {
                    if (typeof tempCounterBalance[keyHeroId] == 'undefined')
                    {
                        tempCounterBalance[keyHeroId] = 0;
                    }
                    window.totallyCounteredHeroArray[keyHeroId] = 1;
                    tempCounterBalance[keyHeroId] = tempCounterBalance[keyHeroId] + banedAllStrongCountersBonusPoints;
                }
            }
        });


        var defaultEmptyVal = -9999;
        // remove already baned and picked heroes from recommendation
        $('.enemyPick.slot, .friendPick.slot, .banPick.slot').each(function()
        {
            var curHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            tempCounterBalance[curHeroId] = defaultEmptyVal;
        });

        // order recommendation
        window.maxRecomendations = 100;
        if ((enemyPickElements.length + friendPickElements.length + banPickElements.length) > 0)
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

            var winRateMin = 50;
            var winRateMax = 50;
            // get max and min win rate
            for(var x = 0; x < window.heroList.length; x++)
            {
                //window.heroList[x]['wr'] = Number(window.heroList[x]['wr']);
                if(window.heroList[x]['wr'] > winRateMax)
                {
                    winRateMax = window.heroList[x]['wr'];
                }
                else
                if(window.heroList[x]['wr'] < winRateMin)
                {
                    winRateMin = window.heroList[x]['wr'];
                }
            }

            var rangeBonusForWinRate = 26;

            for (var j = 0; j < window.maxRecomendations;j++)
            {
                var curRecomHeroId = tempBalanceHeroIdArray[j];
                var curRecomHeroVal = tempBalanceHeroValueArray[j];

                var bonusScoreForWinRate = 0;
                // add extra point for being in current meta
                for(var x = 0; x < window.heroList.length; x++)
                {
                    if(window.heroList[x]['id'] == curRecomHeroId)
                    {
                        if(window.heroList[x]['wr'] >= 50)
                        {
                            var curRecomHeroWinRate = window.heroList[x]['wr'] - 50;
                            var bonusScoreForWinRate = Math.round((rangeBonusForWinRate / 100) * (curRecomHeroWinRate / ((winRateMax - 50) / 100)));
                        } else
                        if(window.heroList[x]['wr'] < 50)
                        {
                            var curRecomHeroWinRate = 50 - window.heroList[x]['wr'];
                            bonusScoreForWinRate = (rangeBonusForWinRate / 100) * (curRecomHeroWinRate / ((50 - winRateMin) / 100));
                            var bonusScoreForWinRate = Math.round(bonusScoreForWinRate) * -1;
                        }
                    }
                }

                curRecomHeroVal = curRecomHeroVal + bonusScoreForWinRate;

                // add points for actual role
                    //get hero roles
                    var curHeroRoles = getHeroRolesByHeroId(curRecomHeroId);

                    // get side of enemy team
                    if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
                    {
                        var enemyTeam = 'radiant';
                    } else if($('#miniMapImg').attr('src') == 'images/mini-map-radiant.png')
                    {
                        var enemyTeam = 'dire';
                    }

                    // get all locked roles on map and push them to array
                    var lockedRolesArray = [];
                    $('#miniMapWrap div[id^="'+enemyTeam+'"] img').each(function()
                    {
                        var curHeroOnMapRole = $(this).parent().attr('data-role-order');
                        if(curHeroOnMapRole.length == 1)
                        {
                            lockedRolesArray.push(curHeroOnMapRole);
                        } else if(curHeroOnMapRole.length == 2 && $(this).parent().attr('id') == (enemyTeam + 'Easy3')) {
                            lockedRolesArray.push(curHeroOnMapRole.charAt(1));
                        }
                    });

                    // change current hero locked role to 0
                    for(var i = 0; i < lockedRolesArray.length; i++)
                    {
                        curHeroRoles = replaceAt(curHeroRoles, lockedRolesArray[i], '0');
                    }

                    // if current hero have actual role add +10 points
                    for(var i = 0; i < curHeroRoles.length; i++)
                    {
                        if(curHeroRoles.charAt(i) != '0')
                        {
                            curRecomHeroVal += 10;
                            break;
                        }
                    }
                // end of add points for actual role

                // if сейчас выбрано меньше 3 союзников (1-2 пик) && curRecomHeroId == герою с 4 или 5 позицией
                // то добавить в curRecomHeroVal + 10

                // if overall score less than 0 then DO NOT RECOMMEND AT ALL (go to next record)
                if(curRecomHeroVal < 0)
                {
                    continue;
                } else {
                    recomendHeroes[curRecomHeroId] = curRecomHeroVal;
                }
            }

            var maxEnemyBalanceValue = -9999;
            Object.keys(recomendHeroes).forEach(function (keyHeroId)
            {
                var value = recomendHeroes[keyHeroId];
                if (value > maxEnemyBalanceValue)
                {
                    maxEnemyBalanceValue = value;
                }
            });

            var rangeBonusForEnemyGoodPick = 20;
            var enemyPotentialGoodPicksArray = [];
            Object.keys(recomendHeroes).forEach(function (keyHeroId)
            {
                var bonusScoreForTakingBestEnemyHero = Math.round((rangeBonusForEnemyGoodPick / 100) * (recomendHeroes[keyHeroId] / ((maxEnemyBalanceValue) / 100)));
                if (bonusScoreForTakingBestEnemyHero >= (rangeBonusForEnemyGoodPick / 4 * 3))
                {
                    enemyPotentialGoodPicksArray[keyHeroId] = bonusScoreForTakingBestEnemyHero;
                }
            });
            // console.log(enemyPotentialGoodPicksArray);
        }
        return enemyPotentialGoodPicksArray;
    }
}

function doRecountCounterPickBalance()
{
    // console.log('do recount function on');
    if (window.globalHeroAjaxRequests == 0)
    {
        // console.log('do recount function INSIDE');
        $('#finalBalanceItemListWrap').html('');
        var tempCounterBalance = [];

        //проходимся по циклу выбранных героев врагов
        var banPickElements = $('.banPick.slot');
        var enemyPickElements = $('.enemyPick.slot');

        // check if there are no any heroes in slots

        var enemyTeamComposition = [];
        enemyTeamComposition['initiator'] = 0;
        enemyTeamComposition['durable'] = 0;
        enemyTeamComposition['pusher'] = 0;
        enemyTeamComposition['nuker'] = 0;
        enemyTeamComposition['antipusher'] = 0;
        enemyTeamComposition['control'] = 0;
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

            var curEnemyHeroObj = window.heroList.find(function(element) {
                return element.id == curEnemyHeroId;
              });
              
            enemyTeamComposition['initiator'] += curEnemyHeroObj.initiator;
            enemyTeamComposition['durable'] += curEnemyHeroObj.durable;
            enemyTeamComposition['pusher'] += curEnemyHeroObj.pusher;
            enemyTeamComposition['nuker'] += curEnemyHeroObj.nuker;
            if(curEnemyHeroObj.antipusher != null)
            {
                enemyTeamComposition['antipusher'] += curEnemyHeroObj.antipusher;
            }
            if(curEnemyHeroObj.control != null)
            {
                enemyTeamComposition['control'] += curEnemyHeroObj.control;
                // console.log(curEnemyHeroObj.control);
            }
        });

        var teamComposition = [];
        teamComposition['initiator'] = 0;
        teamComposition['durable'] = 0;
        teamComposition['pusher'] = 0;
        teamComposition['nuker'] = 0;
        teamComposition['antipusher'] = 0;
        teamComposition['control'] = 0;
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

            var curFriendHeroObj = window.heroList.find(function(element) {
                return element.id == curFriendHeroId;
              });

            teamComposition['initiator'] += curFriendHeroObj.initiator;
            teamComposition['durable'] += curFriendHeroObj.durable;
            teamComposition['pusher'] += curFriendHeroObj.pusher;
            teamComposition['nuker'] += curFriendHeroObj.nuker;
            if(curFriendHeroObj.antipusher != null)
            {
                teamComposition['antipusher'] += curFriendHeroObj.antipusher;
            }
            if(curFriendHeroObj.control != null)
            {
                teamComposition['control'] += curFriendHeroObj.control;
                // console.log(curFriendHeroObj.control);
            }
        });

        changeRadar(teamComposition, enemyTeamComposition);

        // get low composition properties
        var teamCompositionLowProperties = [];
        Object.keys(teamComposition).forEach(function (key)
        {
            var value = teamComposition[key];
            if(value < 2)
            {
                teamCompositionLowProperties[key] = value;
            }
        });

        // console.log(teamComposition['initiator']);
        // console.log(teamComposition['durable']);
        // console.log(teamComposition['pusher']);
        // console.log(teamComposition['nuker']);
        // console.log(teamComposition['antipusher']);
        // console.log(teamComposition['control']);

        window.totallyCounteredHeroArray = [];
        var banedAllStrongCountersBonusPoints = 50;
        // downgrading heroes for suggestion if in window.dontPickHeroesBeforeBanArray[]
        $('.heroListImg').each(function()
        {
            var keyHeroId = $(this).attr('data-hero-id');

            if (typeof window.dontPickHeroesBeforeBanArray[keyHeroId] != 'undefined')
            {
                var isCanBeEasyCountered = false;
                Object.keys(window.dontPickHeroesBeforeBanArray[keyHeroId]).forEach(function (keyCounterHeroId)
                {
                    // toDo: check if counter_hero has free role position

                    if (!(($('#banPickList [data-hero-id="'+keyCounterHeroId+'"]').length) || ($('#friendPickList [data-hero-id="'+keyCounterHeroId+'"]').length)))
                    {
                        isCanBeEasyCountered = true;
                    }
                });

                if (isCanBeEasyCountered)
                {
                    tempCounterBalance[keyHeroId] = -9999;
                } else {
                    if (typeof tempCounterBalance[keyHeroId] == 'undefined')
                    {
                        tempCounterBalance[keyHeroId] = 0;
                    }
                    window.totallyCounteredHeroArray[keyHeroId] = 1;
                    tempCounterBalance[keyHeroId] = tempCounterBalance[keyHeroId] + banedAllStrongCountersBonusPoints;
                }
            }
        });

        var defaultEmptyVal = -9999;
        // remove already baned and picked heroes from recommendation
        $('.enemyPick.slot, .friendPick.slot, .banPick.slot').each(function()
        {
            var curHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            tempCounterBalance[curHeroId] = defaultEmptyVal;
        });


        // order recommendation
        window.maxRecomendations = 100;
        if ((enemyPickElements.length + friendPickElements.length + banPickElements.length) > 0)
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

            var winRateMin = 50;
            var winRateMax = 50;
            // get max and min win rates
            for(var x = 0; x < window.heroList.length; x++)
            {
                //window.heroList[x]['wr'] = Number(window.heroList[x]['wr']);
                if(window.heroList[x]['wr'] > winRateMax)
                {
                    winRateMax = window.heroList[x]['wr'];
                }
                else
                if(window.heroList[x]['wr'] < winRateMin)
                {
                    winRateMin = window.heroList[x]['wr'];
                }
            }

            var rangeBonusForWinRate = 20;

            for (var j = 0; j < window.maxRecomendations;j++)
            {
                var curRecomHeroId = tempBalanceHeroIdArray[j];
                var curRecomHeroVal = tempBalanceHeroValueArray[j];

                var bonusScoreForWinRate = 0;
                // add extra point for being in current meta
                for(var x = 0; x < window.heroList.length; x++)
                {
                    if(window.heroList[x]['id'] == curRecomHeroId)
                    {
                        if(window.heroList[x]['wr'] >= 50)
                        {
                            var curRecomHeroWinRate = window.heroList[x]['wr'] - 50;
                            var bonusScoreForWinRate = Math.round((rangeBonusForWinRate / 100) * (curRecomHeroWinRate / ((winRateMax - 50) / 100)));
                        } else
                        if(window.heroList[x]['wr'] < 50)
                        {
                            var curRecomHeroWinRate = 50 - window.heroList[x]['wr'];
                            bonusScoreForWinRate = (rangeBonusForWinRate / 100) * (curRecomHeroWinRate / ((50 - winRateMin) / 100));
                            var bonusScoreForWinRate = Math.round(bonusScoreForWinRate) * -1;
                        }
                    }
                }
                curRecomHeroVal = curRecomHeroVal + bonusScoreForWinRate;
                // if (curRecomHeroVal == -9999)
                // {
                //     curRecomHeroVal = 5;
                // }

                // add points to those who are good for enemy picks
                    var dataEnemyBestPickBonus = '';
                    var enemysGoodPicksArray = doRecountCounterPickBalanceForEnemy();
                    Object.keys(enemysGoodPicksArray).forEach(function (keyHeroId)
                    {
                        var value = enemysGoodPicksArray[keyHeroId];
                        if(keyHeroId == curRecomHeroId)
                        {
                            curRecomHeroVal += value;
                            dataEnemyBestPickBonus = ' data-enemy-best="'+value+'"';
                        }
                    });
                // end of add point to those who is good for enemy pick

                
                // add bonus to early pick supports
                    if($('#friendPickList .friendPick.emptySlot').length > 3)
                    {
                        // get side of friendly team
                        if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
                        {
                            var friendTeam = 'dire';
                        } else if($('#miniMapImg').attr('src') == 'images/mini-map-radiant.png')
                        {
                            var friendTeam = 'radiant';
                        }

                        // check if 4 or 5 pos is already locked
                        var pos4isLocked = false;
                        var pos5isLocked = false;

                        $('#miniMapWrap div[id^="'+friendTeam+'"] > img').each(function()
                        {
                            var curHeroPosition = $(this).parent().attr('data-slot-role');
                            if(curHeroPosition == 4)
                            {
                                pos4isLocked = true;
                            } else if(curHeroPosition == 5) {
                                pos5isLocked = true;
                            }
                        });

                        var curHeroRoles = getHeroRolesByHeroId(curRecomHeroId);
                        var bonusForEarlyPick = 0;
                        if(pos4isLocked == false)
                        {
                            if(curHeroRoles.charAt(4) != '0' || curHeroRoles.charAt(5) != '0' || curHeroRoles.charAt(6) != '0')
                            {
                                bonusForEarlyPick += 10;
                            }
                        }
                        if(pos5isLocked == false) {
                            if(curHeroRoles.charAt(8) != '0')
                            {
                                bonusForEarlyPick += 10;
                            }
                        }
                        curRecomHeroVal += bonusForEarlyPick;
                    }
                // end of add bonus to early pick supports

                var curRecommHeroObj = window.heroList.find(function(element) {
                    return element.id == curRecomHeroId;
                });

                // complexity bonus
                    var complexityBonus = 0;
                    if(typeof curRecommHeroObj != 'undefined')
                    {
                        if(curRecommHeroObj.complexity == 1)
                        {
                            complexityBonus = 5;
                        } else if(curRecommHeroObj.complexity == 3) {
                            complexityBonus = -5;
                        }
                    }
                    curRecomHeroVal += complexityBonus;
                // end of complexity bonus

                // low team composition properties bonus
                    var propertiesBonus = 0;

                                    // if(teamComposition['initiator'] < 2)
                                    // {
                                    //     if(typeof curRecommHeroObj != 'undefined')
                                    //     {
                                    //         if(curRecommHeroObj.initiator > 0)
                                    //         {
                                    //             if(teamComposition['initiator'] == 1)
                                    //             {
                                    //                 propertiesBonus += 5;
                                    //             } else if(teamComposition['initiator'] == 0)
                                    //             {
                                    //                 propertiesBonus += 10;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // if(teamComposition['durable'] < 2)
                                    // {
                                    //     if(typeof curRecommHeroObj != 'undefined')
                                    //     {
                                    //         if(curRecommHeroObj.durable > 0)
                                    //         {
                                    //             if(teamComposition['durable'] == 1)
                                    //             {
                                    //                 propertiesBonus += 5;
                                    //             } else if(teamComposition['durable'] == 0)
                                    //             {
                                    //                 propertiesBonus += 10;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // if(teamComposition['pusher'] < 2)
                                    // {
                                    //     if(typeof curRecommHeroObj != 'undefined')
                                    //     {
                                    //         if(curRecommHeroObj.pusher > 0)
                                    //         {
                                    //             if(teamComposition['pusher'] == 1)
                                    //             {
                                    //                 propertiesBonus += 5;
                                    //             } else if(teamComposition['pusher'] == 0)
                                    //             {
                                    //                 propertiesBonus += 10;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // if(teamComposition['nuker'] < 2)
                                    // {
                                    //     if(typeof curRecommHeroObj != 'undefined')
                                    //     {
                                    //         if(curRecommHeroObj.nuker > 0)
                                    //         {
                                    //             if(teamComposition['nuker'] == 1)
                                    //             {
                                    //                 propertiesBonus += 5;
                                    //             } else if(teamComposition['nuker'] == 0)
                                    //             {
                                    //                 propertiesBonus += 10;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // if(teamComposition['antipusher'] < 2)
                                    // {
                                    //     if(typeof curRecommHeroObj != 'undefined')
                                    //     {
                                    //         if(curRecommHeroObj.antipusher > 0)
                                    //         {
                                    //             if(teamComposition['antipusher'] == 1)
                                    //             {
                                    //                 propertiesBonus += 5;
                                    //             } else if(teamComposition['antipusher'] == 0)
                                    //             {
                                    //                 propertiesBonus += 10;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // if(teamComposition['control'] < 2)
                                    // {
                                    //     if(typeof curRecommHeroObj != 'undefined')
                                    //     {
                                    //         if(curRecommHeroObj.control > 0)
                                    //         {
                                    //             if(teamComposition['control'] == 1)
                                    //             {
                                    //                 propertiesBonus += 5;
                                    //             } else if(teamComposition['control'] == 0)
                                    //             {
                                    //                 propertiesBonus += 10;
                                    //             }
                                    //         }
                                    //     }
                                    // }

                    var dataAllComposition = ''; 

                    Object.keys(teamCompositionLowProperties).forEach(function (key)
                    {
                        var value = teamCompositionLowProperties[key];
                        var curPropertyBonus = value == 1 ? 5 : 10;
                        if(typeof curRecommHeroObj != 'undefined')
                        {
                            if ((typeof curRecommHeroObj[key] != 'undefined') && (Number(curRecommHeroObj[key]) > 0))
                            {
                                dataAllComposition += ' data-composition-'+key+'="'+curPropertyBonus+'"';
                                propertiesBonus += curPropertyBonus;
                            }
                        }
                    });
                    curRecomHeroVal += propertiesBonus;
                // end of low team composition properties bonus

                // if overall score less than 0 then DO NOT RECOMMEND AT ALL (go to next record)
                if(curRecomHeroVal < 0)
                {
                    continue;
                }

                var recommendHtml = '';
                var curHeroEl = $('#heroListWrap').find('[data-hero-id="'+curRecomHeroId+'"]');
                var heroLocalName = curHeroEl.attr('data-hero-namelocal');
                var heroImgPath = curHeroEl.find('img.heroImgV').attr('src');

                var colorCoefColor = curRecomHeroVal >= 0 ? 'noticeGreen' : 'noticeRed';
                var tempBalanceHeroValueTotalText = curRecomHeroVal > 0 ? '+'+ curRecomHeroVal : curRecomHeroVal;

                                                                                                                                                                                                                     
                recommendHtml += '<div class="finalBalaceItem" data-wr-score="'+bonusScoreForWinRate+'" data-early-pick="'+bonusForEarlyPick+'" data-complexity="'+complexityBonus+'"'+dataAllComposition+dataEnemyBestPickBonus+'>';
                    recommendHtml += '<div class="heroInfoWrapForBalance clearFix">';
                        recommendHtml += '<div class="heroImgWrapForBalance float-left align-middle" data-hero-id="'+curRecomHeroId+'">';
                            recommendHtml += '<img src="' + heroImgPath + '" width="30px" height="auto">';
                        recommendHtml += '</div>';
                        recommendHtml += '<div class="heroNamelocalForBalance float-left align-middle">' + heroLocalName + '</div>';
                        recommendHtml += '<div class="rating">';
                            recommendHtml += '<ul class="unit-rating">';
                            recommendHtml += '<li class="current-rating"></li>';
                            recommendHtml += '</ul>';
                        recommendHtml += '</div>';
                        recommendHtml += '<div class="heroTotalCoefForBalance ' + colorCoefColor + ' float-right align-middle">' + tempBalanceHeroValueTotalText + '</div>';
                        recommendHtml += '<br>';
                        recommendHtml += '<div class="heroRolesForBalance">As:'+getHeroRolesNamesByHeroIdAsHtml(curRecomHeroId)+'</div>';
                    recommendHtml += '</div>';
                    // console.log(getHeroRolesByHeroId(curRecomHeroId));
                    // console.log(getHeroRolesNamesByHeroIdAsHtml(curRecomHeroId));
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

/*
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
*/

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
                jQuery('#finalBalanceItemListWrap').append(recommendHtml);
            }

            // create radios for sorting
            $('#balanceSortWrap').show();
            $('#copyRecommendHeroesBtn').show().on('click', function()
            {
                var heroNamesArray = [];
                var heroValuesArray = [];
                var numberOfHeroesToCopy = 3;
                var copiedHeroesEl = $('#finalBalanceItemListWrap .finalBalaceItem .heroInfoWrapForBalance').slice(0, numberOfHeroesToCopy);
                copiedHeroesEl.each(function() {
                    var curRecomHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
                    var curRecomHeroValue = $(this).find('li.current-rating').attr('style');
                    curRecomHeroValue = parseInt(curRecomHeroValue.slice(6, -2)) + '%';
                    var curRecomHeroAliasSingle = $('#heroListWrap [data-hero-id="'+curRecomHeroId+'"]').attr('data-alias-single');

                    heroNamesArray.push(curRecomHeroAliasSingle);
                    heroValuesArray.push(curRecomHeroValue);
                });

                var fullRecomHeroesString = ''
                for(var i = 0; i < numberOfHeroesToCopy; i++)
                {
                    if(fullRecomHeroesString != '')
                    {
                        fullRecomHeroesString += ' ';
                    }
                    fullRecomHeroesString += heroNamesArray[i] + ' ' + heroValuesArray[i];
                    if(i == numberOfHeroesToCopy-1)
                    {
                        fullRecomHeroesString += '.';
                    } else {
                        fullRecomHeroesString += ',';
                    }
                }

                var inputForClipboardEl = $('#inputForClipboard');
                inputForClipboardEl.val(fullRecomHeroesString).show().select();
                document.execCommand("Copy");
                inputForClipboardEl.hide();
            });
            // var balanceSortHtml = '';
            // balanceSortHtml += '<div id="balanceSortWrap">';
            //         // echo '<input id="sortByRating" type="radio" name="balanceSort" checked>';
            //         // echo '<input id="sortByRole" type="radio" name="balanceSort">';

            //     balanceSortHtml += '<div class="btn-group btn-group-toggle" data-toggle="buttons">';

            //         balanceSortHtml += '<label class="btn btn-info btn-sm active">';
            //             balanceSortHtml += '<input type="radio" name="sortBalance" id="sortByRating" autocomplete="off" checked> sortByRating';
            //         balanceSortHtml += '</label>';

            //         balanceSortHtml += '<label class="btn btn-info btn-sm">';
            //             balanceSortHtml += '<input type="radio" name="sortBalance" id="sortByRole" autocomplete="off"> sortByRole';
            //         balanceSortHtml += '</label>';

            //     balanceSortHtml += '</div>';

            // balanceSortHtml += '</div>';
            // jQuery('#heroCounterBalanceListWrap').prepend(balanceSortHtml);

            // making radios work
            // if( $('#sortByRating:checked') )
            // {
            //     $('.heroNotesWrapForBalance').each(function(){
            //         $(this).find('.noteForBalance').sort(sortTotalHeroCoefDESC).appendTo( $(this) );
            //     });
            // } else if( $('#sortByRole:checked') ) {
            //     function sortTotalHeroCoefDESC(a, b) {
            //         var contentA = Number($(a).find('.coefForBalance').text());
            //         var contentB = Number($(b).find('.coefForBalance').text());
            //         return contentA < contentB ? 1 : -1;
            //     };
            //     $('.heroRolesForBalance > span[data-hero-role]:not(.lineThrough)').each(function(){
            //         $(this).find('.finalBalaceItem').sort(sortTotalHeroCoefDESC).appendTo( $(this) );
            //     });
            // }


            function sortNoteForBalanceCoefDESC(a, b) {
                var contentA = Number($(a).find('.coefForBalance').text());
                var contentB = Number($(b).find('.coefForBalance').text());
                return contentA < contentB ? 1 : -1;
            };
            $('.heroNotesWrapForBalance').each(function(){
                $(this).find('.noteForBalance').sort(sortNoteForBalanceCoefDESC).appendTo( $(this) );
            });
        }

        // click on recommended hero
        $('.heroInfoWrapForBalance').on('click', function()
        {
            var hoveredHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            if (!$(this).hasClass('selectedHeroPopupBalance'))
            {
                $('.selectedHeroPopupBalance').removeClass('selectedHeroPopupBalance').siblings('.heroNotesWrapForBalance').slideUp(100);
                $(this).addClass('selectedHeroPopupBalance').siblings('.heroNotesWrapForBalance').slideDown(100);

                // blink hero in hero list
                $('#heroListWrap [data-hero-id="'+hoveredHeroId+'"] > img.highlight').addClass('highlightFilterForClick');
                // console.log('открыл айтем');
            } else {
                $('.selectedHeroPopupBalance').removeClass('selectedHeroPopupBalance').siblings('.heroNotesWrapForBalance').slideUp(100);

                // remove blink from hero in hero list
                $('#heroListWrap [data-hero-id="'+hoveredHeroId+'"] > img.highlight').removeClass('highlightFilterForClick');
            }
        });

        // hover and click on recommendations will highlight its hero in hero list
        $('.heroInfoWrapForBalance').hover(
        function()
        {
            var hoveredHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            $('#heroListWrap [data-hero-id="'+hoveredHeroId+'"] > img.highlight').addClass('highlightFilter');
            // console.log(hoveredHeroId);

            // remove click highlight
            var clickedHeroId = $('.heroInfoWrapForBalance.selectedHeroPopupBalance').find('[data-hero-id]').attr('data-hero-id');
            $('#heroListWrap [data-hero-id="'+clickedHeroId+'"] > img.highlight').removeClass('highlightFilterForClick');
        },
        function()
        {
            var hoveredHeroId = $(this).find('[data-hero-id]').attr('data-hero-id');
            $('#heroListWrap [data-hero-id="'+hoveredHeroId+'"] > img.highlight').removeClass('highlightFilter');
            // console.log(hoveredHeroId);

            // restore click highlight
            var clickedHeroId = $('.heroInfoWrapForBalance.selectedHeroPopupBalance').find('[data-hero-id]').attr('data-hero-id');
            $('#heroListWrap [data-hero-id="'+clickedHeroId+'"] > img.highlight').addClass('highlightFilterForClick');
        });


        // BEGIN line through all friend locked roles
            // get friend team side
            if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
            {
                var friendTeam = 'dire';
            } else if($('#miniMapImg').attr('src') == 'images/mini-map-radiant.png')
            {
                var friendTeam = 'radiant';
            }


            // remove all old lineThrough classes
            $('.heroRolesForBalance > .lineThrough').removeClass('lineThrough');

            // there are no any questionMarks on mini-map, line through all roles
            var allFriendTeamSlots = $('#miniMapWrap > div[id^="'+friendTeam+'"]');
            allFriendTeamSlots.each(function() {
                if( $(this).find('img').length) // do not remove
                {
                    var curLockedRole = $(this).attr('data-slot-role');
                    $('.heroRolesForBalance > span[data-hero-role="'+curLockedRole+'"]').addClass('lineThrough');
                }
            });

            $('.heroRolesForBalance > span.roleFilterGreen').removeClass('roleFilterGreen');
            // add question marks filters green classes
            if($('#miniMapWrap i.questionMark').length)
            {
                // questionMark on mini-map, line through all roles exept questionMark roles
                // lineThrough all roles, then clear those which questionMarked
                //$('.heroRolesForBalance > span[data-hero-role]').addClass('lineThrough');

                // get all questionMarked roles
                var questionMarkRolesArray = [];
                $('#miniMapWrap i.questionMark').each(function()
                {
                    // var curQuestionMarkRole = $(this).parent().attr('data-slot-role');
                    var curQuestionMarkRoleOrders = $(this).parent().attr('data-role-order');
                    for(var i = 0; i < curQuestionMarkRoleOrders.length; i++)
                    {
                        var curQuestionSingleRoleOrder = curQuestionMarkRoleOrders.charAt(i);
                        $('.heroRolesForBalance > span[data-role-order="'+curQuestionSingleRoleOrder+'"').each(function()
                        {
                            //$(this).removeClass('lineThrough');
                            $(this).addClass('roleFilterGreen').removeClass('lineThrough');
                            var curTotalCoefForBalanceEl = $(this).parent().siblings('.heroTotalCoefForBalance');
                            var newTotalVal = Number(curTotalCoefForBalanceEl.text()) + (1 * Number($(this).attr('data-role-val')));
                            if (newTotalVal > 0)
                            {
                                newTotalVal = '+'+newTotalVal;
                            }
                            curTotalCoefForBalanceEl.html(newTotalVal);
                        });
                    }
                });
            }


            // add 10 bonus points to actual role
            $('.heroRolesForBalance').each(function()
            {
                var curHeroId = $(this).siblings('[data-hero-id]').attr('data-hero-id');
                if (typeof window.totallyCounteredHeroArray[curHeroId] != 'undefined')
                {
                    $(this).parent().siblings('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Все серьезные контерпики в бане или в дружественном пике</div><div class="coefForBalance">'+banedAllStrongCountersBonusPoints+'</div></div>');
                }

                // var actualRoleLength = $(this).find('span:not(.lineThrough)').length;
                if($(this).find('span:not(.lineThrough)').length)
                {
                    var curHeroCoefEl = $(this).siblings('.heroTotalCoefForBalance');
                    var curHeroCoef = Number(curHeroCoefEl.text());
                    curHeroCoefEl.text('+'+ (curHeroCoef + 10));

                    $(this).parent().siblings('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Бонус за актуальную роль</div><div class="coefForBalance">10</div></div>');
                }
            });

            // add notes to meta heroes, early pick, complexity, team composition
            $('.finalBalaceItem').each(function()
            {
                // meta
                if($(this).attr('data-wr-score') > 0)
                {
                    $(this).find('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Герой в мете</div><div class="coefForBalance"></div></div>');
                } else {
                    $(this).find('.heroNotesWrapForBalance')
                    .append('<div class="noteForBalance noticeRed"><div class="noteTextForBalance">Герой не в мете</div><div class="coefForBalance"></div></div>');
                }

                // early pick
                if($(this).attr('data-early-pick') > 10)
                {
                    $(this).find('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Двойной бонус за ранний пик</div><div class="coefForBalance"></div></div>');
                } else if($(this).attr('data-early-pick') > 0)
                {
                    $(this).find('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Бонус за ранний пик</div><div class="coefForBalance"></div></div>');
                }

                // complexity
                if($(this).attr('data-complexity') > 0)
                {
                    $(this).find('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Герой простой в испольнении</div><div class="coefForBalance"></div></div>');
                } else if($(this).attr('data-complexity') < 0) {
                    $(this).find('.heroNotesWrapForBalance')
                    .append('<div class="noteForBalance noticeRed"><div class="noteTextForBalance">Герой сложный в исполнении</div><div class="coefForBalance"></div></div>');
                }

                // team composition
                if($(this).attr('data-team-composition') > 0)
                {
                    $(this).find('.heroNotesWrapForBalance')
                    .prepend('<div class="noteForBalance noticeGreen"><div class="noteTextForBalance">Бонус для баланса team composition</div><div class="coefForBalance"></div></div>');
                }
            });

            // sort by role
            if ($('#sortByRole:checked').length)
            {
                $('.heroRolesForBalance').each(function() {
                    $(this).attr('data-has-good-role', '0');

                    $(this).find('span:not(.lineThrough)').each(function()
                    {
                        $(this).parent().attr('data-has-good-role', '1');
                    });
                });

                function sortByAvailableRole(a, b) {
                    var contentA = Number($(a).find('.heroTotalCoefForBalance').text());
                    var contentB = Number($(b).find('.heroTotalCoefForBalance').text());
                    // A:
                    if (Number($(a).find('.heroRolesForBalance').attr('data-has-good-role')) > 0)
                    {
                        contentA = contentA+1000;
                    }
                    if ($(a).find('.heroRolesForBalance').find('.roleFilterGreen').length > 0)
                    {
                        contentA = contentA+1000;
                    }
                    // var curFilterRolesCount = 0;
                    // var curFilterRolesValSumm = 0;
                    // $(a).find('.roleFilterGreen').each(function()
                    // {
                    //     curFilterRolesCount++;
                    //     curFilterRolesValSumm = curFilterRolesValSumm - Number($(this).attr('data-role-val'));
                    // });
                    // if (curFilterRolesCount > 0)
                    // {
                    //     contentA = contentA+((curFilterRolesValSumm / curFilterRolesCount) * 15);
                    // }

                    // B:
                    if (Number($(b).find('.heroRolesForBalance').attr('data-has-good-role')) > 0)
                    {
                        contentB = contentB+1000;
                    }
                    if ($(b).find('.heroRolesForBalance').find('.roleFilterGreen').length > 0)
                    {
                        contentB = contentB+1000;
                    }
                    // var curFilterRolesCount = 0;
                    // var curFilterRolesValSumm = 0;
                    // $(b).find('.roleFilterGreen').each(function()
                    // {
                    //     curFilterRolesCount++;
                    //     curFilterRolesValSumm = curFilterRolesValSumm - Number($(this).attr('data-role-val'));
                    // });
                    // if (curFilterRolesCount > 0)
                    // {
                    //     contentB = contentB+((curFilterRolesValSumm / curFilterRolesCount) * 1000);
                    // }

                    return contentA < contentB ? 1 : -1;
                };
                $('#finalBalanceItemListWrap').each(function(){
                    $(this).find('.finalBalaceItem').sort(sortByAvailableRole).appendTo( $(this) );
                });
            } else if ($('#sortByRating:checked').length) {
                // sort by rating
                function sortTotalHeroCoefDESC(a, b) {
                    var contentA = Number($(a).find('.heroTotalCoefForBalance').text());
                    var contentB = Number($(b).find('.heroTotalCoefForBalance').text());
                    return contentA < contentB ? 1 : -1;
                };
                $('#finalBalanceItemListWrap').each(function(){
                    $(this).find('.finalBalaceItem').sort(sortTotalHeroCoefDESC).appendTo( $(this) );
                });
            }
        // END line through

        // ***** BEGIN rate stars
        var maxScoreVal = -9999;
        $('.heroTotalCoefForBalance').each(function()
        {        
            var curScoreVal = Number($(this).text());
            if (curScoreVal > maxScoreVal)
            {
                maxScoreVal = curScoreVal;               
            }
        });

        var starOnePercentVal = maxScoreVal / 100;
        $('.heroTotalCoefForBalance').each(function() {
            var curVal = Number($(this).text());
            var curStarPercent = curVal / starOnePercentVal;
            $(this).siblings('.rating').find('.current-rating').css('width', curStarPercent+'%');
        });

        // show recommendations value for admin
        if (typeof showRecommendationsValue == 'function')
        {
            showRecommendationsValue();
        }
        // ***** END rate stars

        // draggable for recommend heroes
        draggableForRecommendHeroes();
        // end of draggable for recommend heroes

        // remove iconglow from questionMark
        iconGlowFunction();

        // click event on roles, except those which line through
        $('.finalBalaceItem .heroRolesForBalance>span[data-hero-role]:not(.lineThrough)').on('click', function()
        {
            var clickedHeroId = $(this).parent().siblings('[data-hero-id]').attr('data-hero-id');
            var clickedHeroRoleOrder = $(this).attr('data-role-order');
            // console.log(clickedHeroId + ' / ' + clickedHeroRoleOrder);

            // make clicked hero picked
            lockNewHeroInSlotForDroppableEmptySlot($('#friendPickList .friendPick.emptySlot:first'), clickedHeroId, 0, 0);
            // doRecountCounterPickBalance();
            getAjaxBalanceForHeroId(clickedHeroId, 1);
            pickedOrBanedHeroPointerEvents(clickedHeroId);

            // put hero on clicked slot role on map
            if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
            {
                // friend team is dire
                var friendSide = 'dire';
            } else {
                // friend team is radiant
                var friendSide = 'radiant';
            }
            var clickedHeroRoleOrderForMap = 'r'+(Number(clickedHeroRoleOrder)+1);
            var clickedHeroCoedname = $('#heroListWrap div[data-hero-id="'+clickedHeroId+'"]').attr('data-hero-codename');
            tryToAddHeroToTheMap(friendSide, clickedHeroRoleOrderForMap, clickedHeroId, clickedHeroCoedname);

            console.log('end of click');

            // make icons draggable after click on recommend hero
            draggableForHeroIconsOnMap();
            // end of drag'n'drop for mini map
        });
    }


    jQuery( ".finalBalaceItem:gt(9)" ).remove();

    addOnHoverTooltipsForAbilityImg($('.noteTextForBalance'), 'forSuggestions')
    eXoActivateInactiveTooltips();

    // delete old highlighted from heroes
    $('img.highlight').remove();
    // подсветка рекомендованных героев
    $('.heroImgWrapForBalance').each(function()
    {
        var curRecomHeroId = $(this).attr('data-hero-id');
        $('.heroListImg[data-hero-id="'+curRecomHeroId+'"]').prepend('<img src="images/suggested_hero.png" class="highlight">');
    });

    $('#counterPleaseWait').hide();
    $('#finalBalanceItemListWrap').show();
    resizeVerticalMenu();

    // hide recommend block if already 5 heroes picked
    if($('#friendPickList > div.slot').length == 5)
    {
        // console.log('5 heroes picked in friendly team');
        $('#heroCounterBalanceListWrap').hide();
    } else {
    $('#heroCounterBalanceListWrap').show();
    }
} // end of dorecounterpickbalance

//функция для заполнения инпута текстом пиков и банов
function fillPickBanInput(friendPickElements, enemyPickElements, banPickElements)
{
    // delete highlight from heroes if none in pick/ban slots (fix 12900)
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

    if (typeof addFillInputToCookie == 'function')
    {
        addFillInputToCookie(textForInput);
    }
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

function putHeroOnMinimap(side, lane, roleSlot, heroCodename)
{
    if(typeof side == 'undefined' || typeof lane == 'undefined' || roleSlot == 'undefined' || heroCodename == 'undefined')
    {
        return false;
    }

    var heroId = $('#heroListWrap [data-hero-codename="'+heroCodename+'"]').attr('data-hero-id');

    var whereToAppendImg = '';
    var dataRoleAttr = 0;

    var curHeroIconUrl = 'http://cdn.dota2.com/apps/dota2/images/heroes/'+heroCodename+'_icon.png?v=4299287';
    if(side == 'radiant')
    {
        if(lane == 'easy')
        {
            if(roleSlot == 1)
            {
                whereToAppendImg = '#radiantEasy1';
                dataRoleAttr = 1;
            }
            else if (roleSlot == 5)
            {
                whereToAppendImg = '#radiantEasy2';
                dataRoleAttr = 5;
            }
            else if (roleSlot == 4)
            {
                whereToAppendImg = '#radiantEasy3';
                dataRoleAttr = 4;
            }
            else if (roleSlot == 3) {
                whereToAppendImg = '#radiantEasy1';
                dataRoleAttr = 3;
            } else {
                return false;
            }

            // if($('#radiantEasy1 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantEasy1';
            //     dataRoleAttr = 1;
            // }
            // else if($('#radiantEasy2 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantEasy2';
            //     dataRoleAttr = 5;
            // }
            // else if($('#radiantEasy3 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantEasy3';
            //     dataRoleAttr = 4;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'mid')
        {
            if(roleSlot == 2)
            {
                whereToAppendImg = '#radiantMid1';
                dataRoleAttr = 2;
            }
            else if (roleSlot == 4)
            {
                whereToAppendImg = '#radiantMid2';
                dataRoleAttr = 4;
            }
            else if (roleSlot == 5)
            {
                whereToAppendImg = '#radiantMid3';
                dataRoleAttr = 5;
            } else {
                return false;
            }

            // if($('#radiantMid1 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantMid1';
            //     dataRoleAttr = 2;
            // }
            // else if($('#radiantMid2 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantMid2';
            //     dataRoleAttr = 4;
            // }
            // else if($('#radiantMid3 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantMid3';
            //     dataRoleAttr = 5;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'hard')
        {
            if(roleSlot == 3)
            {
                whereToAppendImg = '#radiantHard1';
                dataRoleAttr = 3;
            }
            else if (roleSlot == 4)
            {
                whereToAppendImg = '#radiantHard2';
                dataRoleAttr = 4;
            }
            else if (roleSlot == 5)
            {
                whereToAppendImg = '#radiantHard3';
                dataRoleAttr = 5;
            }
            else if (roleSlot == 1) {
                whereToAppendImg = '#radiantHard1';
                dataRoleAttr = 1;
            } else {
                return false;
            }

            // if($('#radiantHard1 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantHard1';
            //     dataRoleAttr = 3;
            // }
            // else if($('#radiantHard2 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantHard2';
            //     dataRoleAttr = 4;
            // }
            // else if($('#radiantHard3 > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantHard3';
            //     dataRoleAttr = 5;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'jungle')
        {
            if(roleSlot == 4)
            {
                whereToAppendImg = '#radiantJungle';
                dataRoleAttr = 4;
            } else {
                return false;
            }

            // if($('#radiantJungle > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantJungle';
            //     dataRoleAttr = 4;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'roam')
        {
            if(roleSlot == 4)
            {
                whereToAppendImg = '#radiantRoam';
                dataRoleAttr = 4;
            } else {
                return false;
            }

            // if($('#radiantRoam > img').length === 0)
            // {
            //     whereToAppendImg = '#radiantRoam';
            //     dataRoleAttr = 4;
            // } else {
            //     return false;
            // }
        }
    }
    else if(side == 'dire')
    {
        if(lane == 'easy')
        {
            if(roleSlot == 1)
            {
                whereToAppendImg = '#direEasy1';
                dataRoleAttr = 1;
            }
            else if (roleSlot == 5)
            {
                whereToAppendImg = '#direEasy2';
                dataRoleAttr = 5;
            }
            else if (roleSlot == 4)
            {
                whereToAppendImg = '#direEasy3';
                dataRoleAttr = 4;
            }
            else if (roleSlot == 3) {
                whereToAppendImg = '#direEasy1';
                dataRoleAttr = 3;
            } else {
                return false;
            }

            // if($('#direEasy1 > img').length === 0)
            // {
            //     whereToAppendImg = '#direEasy1';
            //     dataRoleAttr = 1;
            // }
            // else if($('#direEasy2 > img').length === 0)
            // {
            //     whereToAppendImg = '#direEasy2';
            //     dataRoleAttr = 5;
            // }
            // else if($('#direEasy3 > img').length === 0)
            // {
            //     whereToAppendImg = '#direEasy3';
            //     dataRoleAttr = 4;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'mid')
        {
            if(roleSlot == 2)
            {
                whereToAppendImg = '#direMid1';
                dataRoleAttr = 2;
            }
            else if (roleSlot == 4)
            {
                whereToAppendImg = '#direMid2';
                dataRoleAttr = 4;
            }
            else if (roleSlot == 5)
            {
                whereToAppendImg = '#direMid3';
                dataRoleAttr = 5;
            } else {
                return false;
            }

            // if($('#direMid1 > img').length === 0)
            // {
            //     whereToAppendImg = '#direMid1';
            //     dataRoleAttr = 2;
            // }
            // else if($('#direMid2 > img').length === 0)
            // {
            //     whereToAppendImg = '#direMid2';
            //     dataRoleAttr = 4;
            // }
            // else if($('#direMid3 > img').length === 0)
            // {
            //     whereToAppendImg = '#direMid3';
            //     dataRoleAttr = 5;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'hard')
        {
            if(roleSlot == 3)
            {
                whereToAppendImg = '#direHard1';
                dataRoleAttr = 3;
            }
            else if (roleSlot == 4)
            {
                whereToAppendImg = '#direHard2';
                dataRoleAttr = 4;
            }
            else if (roleSlot == 5)
            {
                whereToAppendImg = '#direHard3';
                dataRoleAttr = 5;
            }
            else if (roleSlot == 1) {
                whereToAppendImg = '#direHard1';
                dataRoleAttr = 1;
            } else {
                return false;
            }

            // if($('#direHard1 > img').length === 0)
            // {
            //     whereToAppendImg = '#direHard1';
            //     dataRoleAttr = 3;
            // }
            // else if($('#direHard2 > img').length === 0)
            // {
            //     whereToAppendImg = '#direHard2';
            //     dataRoleAttr = 4;
            // }
            // else if($('#direHard3 > img').length === 0)
            // {
            //     whereToAppendImg = '#direHard3';
            //     dataRoleAttr = 5;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'jungle')
        {
            if(roleSlot == 4)
            {
                whereToAppendImg = '#direJungle';
                dataRoleAttr = 4;
            } else {
                return false;
            }

            // if($('#direJungle > img').length === 0)
            // {
            //     whereToAppendImg = '#direJungle';
            //     dataRoleAttr = 4;
            // } else {
            //     return false;
            // }
        }
        else if(lane == 'roam')
        {
            if(roleSlot == 4)
            {
                whereToAppendImg = '#direRoam';
                dataRoleAttr = 4;
            } else {
                return false;
            }

            // if($('#direRoam > img').length === 0)
            // {
            //     whereToAppendImg = '#direRoam';
            //     dataRoleAttr = 4;
            // } else {
            //     return false;
            // }
        }
    } else {
        return false;
    }

    // removing old hero from slot
    $(whereToAppendImg).html('');
    // adding new hero to slot
    $(whereToAppendImg).append('<img src="'+curHeroIconUrl+'" data-hero-id="'+heroId+'" data-hero-codename="'+heroCodename+'" data-hero-role="'+dataRoleAttr+'" width="28px">');
}

function deleteHeroFromMinimap(heroId)
{
    $('#miniMapWrap > div img[data-hero-id="'+heroId+'"').remove();
}

function getHeroRolesByHeroId(heroId)
{
    var heroRolesValues = '';
    if(typeof window.roleList['carry'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['carry'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['mider'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['mider'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['offlane_solo'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['offlane_solo'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['offlane_core'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['offlane_core'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['mid_supp'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['mid_supp'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['offlane_supp'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['offlane_supp'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['roamer'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['roamer'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['jungler'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['jungler'][heroId];
    } else {
        heroRolesValues += 0;
    }

    if(typeof window.roleList['full_supp'][heroId] != 'undefined')
    {
        heroRolesValues += window.roleList['full_supp'][heroId];
    } else {
        heroRolesValues += 0;
    }

    return heroRolesValues;
}

function getHeroRolesNamesByHeroIdAsHtml(heroId)
{
    // carry/mider/hardlaner/semi-supp/supp
    var allHeroRoles = getHeroRolesByHeroId(heroId);
    var heroNamesRolesHtml = '';
    var arrayIsAlreadyAdded = [];
    for (var i = 5; i > 0; i--)
    {
        if((allHeroRoles.charAt(0) > 0)
        && (allHeroRoles.charAt(0) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="1" data-role-order="0" data-role-val="'+i+'">[Pos1:Carry]</span>';
        }
        if((allHeroRoles.charAt(1) > 0)
        && (allHeroRoles.charAt(1) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="2" data-role-order="1" data-role-val="'+i+'">[Pos2:Mider]</span>';
        }
        if((allHeroRoles.charAt(2) > 0)
        && (allHeroRoles.charAt(2) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="3" data-role-order="2" data-role-val="'+i+'">[Pos3:Off solo]</span>';
        }
        if((allHeroRoles.charAt(3) > 0)
        && (allHeroRoles.charAt(3) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="3" data-role-order="3" data-role-val="'+i+'">[Pos3:Off core]</span>';
        }
        if((allHeroRoles.charAt(4) > 0)
        && (allHeroRoles.charAt(4) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="4" data-role-order="4" data-role-val="'+i+'">[Pos4:Mid supp]</span>';
        }
        if((allHeroRoles.charAt(5) > 0)
        && (allHeroRoles.charAt(5) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="4" data-role-order="5" data-role-val="'+i+'">[Pos4:Off supp]</span>';
        }
        if((allHeroRoles.charAt(6) > 0)
        && (allHeroRoles.charAt(6) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="4" data-role-order="6" data-role-val="'+i+'">[Pos4:Roam]</span>';
        }
        if((allHeroRoles.charAt(7) > 0)
        && (allHeroRoles.charAt(7) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="4" data-role-order="7" data-role-val="'+i+'">[Pos4:Jungler]</span>';
        }
        if((allHeroRoles.charAt(8) > 0)
        && (allHeroRoles.charAt(8) == i))
        {
            heroNamesRolesHtml += '<span data-hero-role="5" data-role-order="8" data-role-val="'+i+'">[Pos5:Full supp]</span>';
        }
    }

    return heroNamesRolesHtml;
}

function getAllHeroesByRole(role)
{
    return window.roleList[role];
}

function getRoleValueByHeroIdAndRole(heroId, role)
{
    var curHeroRoleValue = 0;
    if(typeof window.roleList[role][heroId] != 'undefined')
    {
        curHeroRoleValue = window.roleList[role][heroId];
    }

    return curHeroRoleValue;
}

// function heroMapAutoShuffle(side)
// {
//     var isNeedFunctionRepeat = false;

//     if(side == 'dire')
//     {
//         var uncertainHereosEl = $('#uncertainDireHeroesWrap > img');
//     } else if(side == 'radiant') {
//         var uncertainHereosEl = $('#uncertainRadiantHeroesWrap > img');
//     }

//     // making roles values data-attribute copies for each uncertain hero
//     uncertainHereosEl.each(function () {
//         var curHeroRolesValues = $(this).attr('data-roles-values');
//         $(this).attr('data-heroes-values-copy', curHeroRolesValues);
//     });

//     // changing all locked roles from roles values to 0 in data-heroes-values-copy
//     $('#miniMapWrap [id^="'+side+'"] img[data-hero-role]').each(function()
//     {
//         var curSlotRoleOnMap = $(this).attr('data-hero-role');
//         uncertainHereosEl.each(function()
//         {
//             var curUncertainHeroRolesValuesCopy = $(this).attr('data-heroes-values-copy');
//             // console.log(curUncertainHeroRolesValuesCopy);
//             if(curSlotRoleOnMap == 1 || curSlotRoleOnMap == 2)
//             {
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, curSlotRoleOnMap-1, '0');
//             }
//             else if (curSlotRoleOnMap == 5)
//             {
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 8, '0');
//             }
//             else if(curSlotRoleOnMap == 3)
//             {
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 2, '0');
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 3, '0');
//             } else if(curSlotRoleOnMap == 4)
//             {
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 4, '0');
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 5, '0');
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 6, '0');
//                 curUncertainHeroRolesValuesCopy = replaceAt(curUncertainHeroRolesValuesCopy, 7, '0');
//             }

//             // console.log(curUncertainHeroRolesValuesCopy);

//             $(this).attr('data-heroes-values-copy', curUncertainHeroRolesValuesCopy);
//         });
//     });

//     // checking if there is hero left with only 1 role, if yes put him to the map
//     uncertainHereosEl.each(function()
//     {
//         var curUncertainHeroRolesValuesCopyForCheck = $(this).attr('data-heroes-values-copy');
//         var curUncertainHeroCodename = $(this).attr('data-hero-codename');

//         var goToRole = false;
//         var goTolane = '';
//         var lastRoleValue = [];
//         var curHeroRolesLeft = 0;


//         if (curUncertainHeroRolesValuesCopyForCheck.charAt(0) > 0)
//         {
//             curHeroRolesLeft++;
//             goToRole = 1;
//             goTolane = 'easy';
//         }
//         if (curUncertainHeroRolesValuesCopyForCheck.charAt(1) > 0)
//         {
//             curHeroRolesLeft++;
//             goToRole = 2;
//             goTolane = 'mid';
//         }
//         if ((curUncertainHeroRolesValuesCopyForCheck.charAt(2) > 0)     // solo offlane
//          || (curUncertainHeroRolesValuesCopyForCheck.charAt(3) > 0))    // core offlane
//         {
//             curHeroRolesLeft++;
//             goToRole = 3;
//             goTolane = 'hard';
//             // isCanSoloHard = 1

//             var roleVal = curUncertainHeroRolesValuesCopyForCheck.charAt(2);
//             if (curUncertainHeroRolesValuesCopyForCheck.charAt(3) > roleVal)
//             {
//                 // isCanSoloHard = 0;
//             }
//         }
//         if (   (curUncertainHeroRolesValuesCopyForCheck.charAt(4) > 0)  // mid support
//             || (curUncertainHeroRolesValuesCopyForCheck.charAt(5) > 0)  // offlane support
//             || (curUncertainHeroRolesValuesCopyForCheck.charAt(6) > 0)  // roamer
//             || (curUncertainHeroRolesValuesCopyForCheck.charAt(7) > 0)) // jungler
//         {
//             curHeroRolesLeft++;
//             goToRole = 4;
//             goTolane = 'mid';
//             var roleVal = curUncertainHeroRolesValuesCopyForCheck.charAt(4);


//             if (curUncertainHeroRolesValuesCopyForCheck.charAt(5) > roleVal)
//             {
//                 goTolane = 'hard';
//                 roleVal = curUncertainHeroRolesValuesCopyForCheck.charAt(5);
//             }
//             if (curUncertainHeroRolesValuesCopyForCheck.charAt(6) > roleVal)
//             {
//                 goTolane = 'roam';
//                 roleVal = curUncertainHeroRolesValuesCopyForCheck.charAt(6);
//             }
//             if (curUncertainHeroRolesValuesCopyForCheck.charAt(7) > roleVal)
//             {
//                 goTolane = 'jungle';
//                 roleVal = curUncertainHeroRolesValuesCopyForCheck.charAt(7);
//             }
//         }
//         if (curUncertainHeroRolesValuesCopyForCheck.charAt(8) > 0)      // full support
//         {
//             curHeroRolesLeft++;
//             goTolane = 'easy';
//             goToRole = 5;
//         }

//         // if only 1 role value left in copy
//         if(curHeroRolesLeft == 1)
//         {
//             // put hero on minimap
//             putHeroOnMinimap(side, goTolane, goToRole, curUncertainHeroCodename)

//             // remove hero from uncertain list
//             $(this).remove();

//             isNeedFunctionRepeat = true;
//         }
//     });

//     if (isNeedFunctionRepeat == true)
//     {
//         heroMapAutoShuffle(side);
//     }

// }

function replaceAt(string, index, replace)
{
    return string.substring(0, index) + replace + string.substring(index + 1);
}

// function deleteHeroFromUncertainList(heroId)
// {
//     $('#uncertainDireHeroesWrap > img[data-hero-id="'+heroId+'"]').remove();
//     $('#uncertainRadiantHeroesWrap > img[data-hero-id="'+heroId+'"]').remove();
// }

function swapSides()
{
    // change side title
    var friendTitle = $('#dragNdropInstructions div:last');
    var enemyTitle = $('#dragNdropInstructions div:first');

    if(friendTitle.hasClass('sideTitleGlowGreen') && enemyTitle.hasClass('sideTitleGlowRed'))
    {
        friendTitle.removeClass('sideTitleGlowGreen').addClass('sideTitleGlowRed');
        enemyTitle.removeClass('sideTitleGlowRed').addClass('sideTitleGlowGreen');
    } else if(friendTitle.hasClass('sideTitleGlowRed') && enemyTitle.hasClass('sideTitleGlowGreen')) {
        friendTitle.removeClass('sideTitleGlowRed').addClass('sideTitleGlowGreen');
        enemyTitle.removeClass('sideTitleGlowGreen').addClass('sideTitleGlowRed');
    }

    var friendTitleText = friendTitle.text();
    var enemyTitleText = enemyTitle.text();

    friendTitle.text(enemyTitleText);
    enemyTitle.text(friendTitleText);


    // change slots with heroes
    var pickedHeroWrapEl = $('#pickedHeroWrap');

    var radiantEl = pickedHeroWrapEl.find('.radiant');
    pickedHeroWrapEl.append(radiantEl);

    var direEl = pickedHeroWrapEl.find('.dire');
    pickedHeroWrapEl.prepend(direEl);
    radiantEl.removeClass('radiant').addClass('dire');
    direEl.removeClass('dire').addClass('radiant');

    // change mini-map
    var mapImgEl = $('#miniMapWrap > img[src^="images/mini-map"]');
    if( mapImgEl.attr('src') == 'images/mini-map-dire.png' )
    {
        mapImgEl.attr('src', 'images/mini-map-radiant.png');
    } else if( mapImgEl.attr('src') == 'images/mini-map-radiant.png' ) {
        mapImgEl.attr('src', 'images/mini-map-dire.png');
    }

    // change uncertain heroes
    // var direUncertainHeroes = $('#uncertainDireHeroesWrap');
    // var radiantUncertainHeroes = $('#uncertainRadiantHeroesWrap');
    // var direUncertainHeroesHtml = $('#uncertainDireHeroesWrap').html();
    // var radiantUncertainHeroesHtml = $('#uncertainRadiantHeroesWrap').html();
    // direUncertainHeroes.html(radiantUncertainHeroesHtml);
    // radiantUncertainHeroes.html(direUncertainHeroesHtml);

    // change icons on mini-map
    // for #radiantEasy1 and #direEasy1
    var radiantEasy1El = $('#radiantEasy1');
    var direEasy1El = $('#direEasy1');
    var radiantEasy1Html = radiantEasy1El.html();
    var direEasy1Html = direEasy1El.html();
    radiantEasy1El.html(direEasy1Html);
    direEasy1El.html(radiantEasy1Html);

    // for #radiantEasy2 and #direEasy2
    var radiantEasy2El = $('#radiantEasy2');
    var direEasy2El = $('#direEasy2');
    var radiantEasy2Html = radiantEasy2El.html();
    var direEasy2Html = direEasy2El.html();
    radiantEasy2El.html(direEasy2Html);
    direEasy2El.html(radiantEasy2Html);

    // for #radiantEasy3 and #direEasy3
    var radiantEasy3El = $('#radiantEasy3');
    var direEasy3El = $('#direEasy3');
    var radiantEasy3Html = radiantEasy3El.html();
    var direEasy3Html = direEasy3El.html();
    radiantEasy3El.html(direEasy3Html);
    direEasy3El.html(radiantEasy3Html);

    // for #radiantMid1 and #direMid1
    var radiantMid1El = $('#radiantMid1');
    var direMid1El = $('#direMid1');
    var radiantMid1Html = radiantMid1El.html();
    var direMid1Html = direMid1El.html();
    radiantMid1El.html(direMid1Html);
    direMid1El.html(radiantMid1Html);

    // for #radiantMid2 and #direMid2
    var radiantMid2El = $('#radiantMid2');
    var direMid2El = $('#direMid2');
    var radiantMid2Html = radiantMid2El.html();
    var direMid2Html = direMid2El.html();
    radiantMid2El.html(direMid2Html);
    direMid2El.html(radiantMid2Html);

    // for #radiantMid3 and #direMid3
    var radiantMid3El = $('#radiantMid3');
    var direMid3El = $('#direMid3');
    var radiantMid3Html = radiantMid3El.html();
    var direMid3Html = direMid3El.html();
    radiantMid3El.html(direMid3Html);
    direMid3El.html(radiantMid3Html);

    // for #radiantHard1 and #direHard1
    var radiantHard1El = $('#radiantHard1');
    var direHard1El = $('#direHard1');
    var radiantHard1Html = radiantHard1El.html();
    var direHard1Html = direHard1El.html();
    radiantHard1El.html(direHard1Html);
    direHard1El.html(radiantHard1Html);

    // for #radiantHard2 and #direHard2
    var radiantHard2El = $('#radiantHard2');
    var direHard2El = $('#direHard2');
    var radiantHard2Html = radiantHard2El.html();
    var direHard2Html = direHard2El.html();
    radiantHard2El.html(direHard2Html);
    direHard2El.html(radiantHard2Html);

    // for #radiantHard3 and #direHard3
    var radiantHard3El = $('#radiantHard3');
    var direHard3El = $('#direHard3');
    var radiantHard3Html = radiantHard3El.html();
    var direHard3Html = direHard3El.html();
    radiantHard3El.html(direHard3Html);
    direHard3El.html(radiantHard3Html);

    // for #radiantJungle and #direJungle
    var radiantJungleEl = $('#radiantJungle');
    var direJungleEl = $('#direJungle');
    var radiantJungleHtml = radiantJungleEl.html();
    var direJungleHtml = direJungleEl.html();
    radiantJungleEl.html(direJungleHtml);
    direJungleEl.html(radiantJungleHtml);

    // for #radiantRoam and #direRoam
    var radiantRoamEl = $('#radiantRoam');
    var direRoamEl = $('#direRoam');
    var radiantRoamHtml = radiantRoamEl.html();
    var direRoamHtml = direRoamEl.html();
    radiantRoamEl.html(direRoamHtml);
    direRoamEl.html(radiantRoamHtml);

    // make icons draggable after swap sides
    // drag n drop for mini-map icons
    draggableForHeroIconsOnMap();
    // end of drag'n'drop for mini map


    // make the question inside map draggable
    draggableQuestionInsideMap();
    // end of make the question inside map draggable

    iconGlowFunction();
}

function addHeroToTheMap(side, heroId, heroCodename)
{
    if(typeof side == 'undefined' || typeof heroId == 'undefined' || heroCodename == 'undefined')
    {
        return false;
    }

    if(side == 'dire')
    {
        var slotIdAttrBeginWith = 'dire';
    }
    else if(side == 'radiant') {
        var slotIdAttrBeginWith = 'radiant';
    } else {
        return false;
    }


    var roleslist = getHeroRolesByHeroId(heroId);
    var orderedRolesArray = [];
    for (var iVal=5; iVal>0; iVal--)
    {
      for (var i=0; i < roleslist.length; i++)
      {
        if (roleslist.charAt(i) == iVal)
        {
          orderedRolesArray['r'+ (i+1)] = iVal;
        }
      }
    }

    var isAddedOnMap;
    Object.keys(orderedRolesArray).some(function (key)
    {
        isAddedOnMap = tryToAddHeroToTheMap(slotIdAttrBeginWith, key, heroId, heroCodename);
        return isAddedOnMap; //break
    });

    if (!isAddedOnMap)
    {
        // console.log(isAddedOnMap + ' + false');
        // то пытаться добавлять так: хард 4, роам, изи 4, мид 4, хард кор
        tryToAddHeroToTheMapSomwhere(slotIdAttrBeginWith, heroId, heroCodename)
    }
}

function tryToAddHeroToTheMap(sideTry, slotRole, heroIdTry, heroCodenameTry)
{
    var iconHtml = '<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+heroCodenameTry+'_icon.png?v=4299287" data-hero-id="'+heroIdTry+'" data-hero-codename="'+heroCodenameTry+'" data-roles-values="'+getHeroRolesByHeroId(heroIdTry)+'" width="28px">';
    if(slotRole == 'r1')
    {
        var sidePlusLane = sideTry+'Easy1';
    }
    else if (slotRole == 'r2')
    {
        var sidePlusLane = sideTry+'Mid1';
    }
    else if (slotRole == 'r3')
    {
        var sidePlusLane = sideTry+'Hard1';
    }
    else if (slotRole == 'r4')
    {
        var sidePlusLane = sideTry+'Hard1';
    }
    else if (slotRole == 'r5')
    {
        var sidePlusLane = sideTry+'Mid2';
    }
    else if (slotRole == 'r6')
    {
        var sidePlusLane = sideTry+'Hard2';
    }
    else if (slotRole == 'r7')
    {
        var sidePlusLane = sideTry+'Roam';
    }
    else if (slotRole == 'r8')
    {
        var sidePlusLane = sideTry+'Jungle';
    }
    else if (slotRole == 'r9')
    {
        var sidePlusLane = sideTry+'Easy2';
    }

    if($('#miniMapWrap > div[id="'+sidePlusLane+'"] img').length == 0)
    {
        // если слот пустой то добавить героя и вернуть true
        $('#miniMapWrap > div[id="'+sidePlusLane+'"]').find('i.questionMark').remove();
        $('#miniMapWrap > div[id="'+sidePlusLane+'"]').append(iconHtml);
        return true;
    } else {
        return false;
    }
}

function tryToAddHeroToTheMapSomwhere(sideTry, heroIdTry, heroCodenameTry)
{
    var iconHtml = '<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+heroCodenameTry+'_icon.png?v=4299287" data-hero-id="'+heroIdTry+'" data-hero-codename="'+heroCodenameTry+'" data-roles-values="'+getHeroRolesByHeroId(heroIdTry)+'" width="28px">';
    var whereToAppend;

    // if last pick and mid is free put it in
    if($('#friendPickList .slot').length == 5 && $('#miniMapWrap > div[id="'+sideTry+'Mid1"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Mid1"]');
    } 
    else if($('#miniMapWrap > div[id="'+sideTry+'Hard1"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Hard1"]');
    }
    else if($('#miniMapWrap > div[id="'+sideTry+'Hard2"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Hard2"]');
    }
    else if($('#miniMapWrap > div[id="'+sideTry+'Mid2"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Mid2"]');
    }
    else if($('#miniMapWrap > div[id="'+sideTry+'Roam"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Roam"]');
    }
    else if($('#miniMapWrap > div[id="'+sideTry+'Easy3"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Easy3"]');
    }
    else if($('#miniMapWrap > div[id="'+sideTry+'Easy1"] img').length == 0)
    {
        whereToAppend = $('#miniMapWrap > div[id="'+sideTry+'Easy1"]');
    } else {
        return false;
    }

    whereToAppend.find('i.questionMark').remove();
    whereToAppend.append(iconHtml);
}

function resizeVerticalMenu()
{
    // set height for #heroCounterBalanceListWrap
    var elFirstFinalBalaceItem = $(".finalBalaceItem:first");
    if (elFirstFinalBalaceItem.length)
    {
        var innerHeight = window.innerHeight;
        var heroCounterBalanceListWrapOffset = $("#heroCounterBalanceListWrap").offset().top;
        var firstRecommendItemOffset = elFirstFinalBalaceItem.offset().top;
        // console.log(firstRecommendItemOffset);
        $('#heroCounterBalanceListWrap').css('height', innerHeight - heroCounterBalanceListWrapOffset - 11);
        $('#finalBalanceItemListWrap').css('height', innerHeight - firstRecommendItemOffset - 13);
    }
}

function iconGlowFunction()
{
    $('#miniMapWrap .iconGlowGreen').removeClass('iconGlowGreen');
    $('#miniMapWrap .iconGlowRed').removeClass('iconGlowRed');

    if( $('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
    {
        // our team is dire
        $('#miniMapWrap div[id^="dire"]:not(div:has(i.questionMark))').addClass('iconGlowGreen');
        $('#miniMapWrap div[id^="radiant"]:not(div:has(i.questionMark))').addClass('iconGlowRed');
    } else {
        // our team is radiant
        $('#miniMapWrap div[id^="dire"]:not(div:has(i.questionMark))').addClass('iconGlowRed');
        $('#miniMapWrap div[id^="radiant"]:not(div:has(i.questionMark))').addClass('iconGlowGreen');
    }
}

function pickedOrBanedHeroPointerEvents(heroId)
{
    var heroEl = $('#heroListWrap .heroListImg[data-hero-id="'+heroId+'"]');
    if(heroEl.hasClass('pickedOrBaned'))
    {
        heroEl.css('pointer-events', 'none');
    } else {
        heroEl.css('pointer-events', 'all');
    }
}

function pickedOrBanedHeroPointerEventsForAll()
{
    $('#heroListWrap .pickedOrBaned').each(function()
    {
        $(this).css('pointer-events', 'none');
    });
}

function draggableQuestionInsideMap()
{
    // make the question inside map draggable
    $('#miniMapWrap i.questionMark').draggable({
        // cursor: 'default'
        helper: "clone"
        ,revert: 'invalid'
        , cursor: 'url("/images/closedhand.png"), auto'
        , zIndex: 9999
        , drag: function (event, ui)
        {
            var draggedHero = $(this);
            window.draggableEl = $(this);
            window.draggableElParent = $(this).parent();

            draggedHero.addClass('grayscale');
        },
        start: function (e, ui)
        {
            // hide userRole, show removeIcon
            $('#userRole').hide();
            $('#removeIcon').show();

            var draggedHero = $(this);
            ui.helper.attr('data-dragged-from-id', $(this).parent().attr('id'));
            ui.helper.attr('data-dragged-from', 'userRoleFromMiniMap');

            // highlight free slots on map
            if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
            {
                // our team in dire
                $('#miniMapWrap > div[id^="dire"]').each(function(){
                    if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                    {
                        $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                        $('#direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
                        .addClass('opacityForHighlight');
                    }
                });
            } else {
                // our team in radiant
                $('#miniMapWrap > div[id^="radiant"]').each(function(){
                    if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                    {
                        $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                        $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3')
                        .addClass('opacityForHighlight');
                    }
                });
            }
        },
        stop: function (event, ui) {
            var draggedHero = $(this);
            draggedHero.removeClass('grayscale');

            // remove highlight from free slots on map
            $('#miniMapWrap > div.highlightSlot').removeClass('highlightSlot').find('span').remove();

            $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
            .removeClass('opacityForHighlight');

            // hide removeIcon, show userRole
            $('#userRole').show();
            $('#removeIcon').hide();
        }
    });
    // end of make the question inside map draggable
}

function draggableForHeroIconsOnMap()
{
    // make icons draggable after lockNewHeroInSlot
    //drag n drop for mini-map icons
    // $('#miniMapWrap i:not(.questionMark)').draggable({
    $('#miniMapWrap img[data-hero-id]').draggable({
        // cursor: 'default'
        helper: "clone"
        ,revert: 'invalid'
        , cursor: 'url("/images/closedhand.png"), auto'
        , zIndex: 9999
        ,stack: ".row"
        , drag: function (event, ui)
        {
            var draggedHero = $(this);
            window.draggableEl = $(this);
            window.draggableElParent = $(this).parent();

            draggedHero.addClass('grayscale');
        },
        start: function (e, ui)
        {
            // hide userRole, show removeIcon
            $('#userRole').hide();
            $('#removeIcon').show();

            var draggedHero = $(this);
            // var helperLeft = ui.helper.css('left');
            // var helperTop = ui.helper.css('top');
            //$(ui.helper).prependTo($('body'));
            // ui.helper.css('left', helperLeft).css('top', helperTop);


            ui.helper.attr('data-dragged-from', 'fromMiniMap');
            ui.helper.attr('data-dragged-from-id', draggedHero.parent().attr('id'));

            // highlight free slots on map
            $('#miniMapWrap > div[data-slot-role]').each(function(){
                if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                {
                    $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                    $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
                    .addClass('opacityForHighlight');
                }
            });

            // pointer events none
            $('#removeIcon').addClass('pointerEventsNone');
        },
        stop: function (event, ui) {
            var draggedHero = $(this);
            draggedHero.removeClass('grayscale');
            // remove highlight from free slots on map
            $('#miniMapWrap > div.highlightSlot').removeClass('highlightSlot').find('span').remove();
            $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
            .removeClass('opacityForHighlight');

            // pointer events none
            $('#removeIcon').removeClass('pointerEventsNone');

            // hide removeIcon, show userRole
            $('#userRole').show();
            $('#removeIcon').hide();
        }
    });
    // end of drag'n'drop for mini map
}

function draggableForHeroListImg()
{
    // drag for hero list img
    window.draggableEl;
    $('.heroListImg').draggable({
        //  cursor: 'pointer'
        helper: "clone"
        ,revert: 'invalid'
        , zIndex: 200
        , cursor: 'url("/images/closedhand.png"), auto'
        , drag: function (event, ui)
        {
            var draggedHero = $(this);
            window.draggableEl = $(this)
            //var dragHeroId = draggedHero.attr('data-hero-id');
            draggedHero.addClass('grayscale');
            ui.helper.addClass('draggable');
            // $('body').css
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

            // highlight free slots on map
            $('#miniMapWrap > div[data-slot-role]').each(function(){
                if($(this).find('img').length == 0 && $(this).find('i.questionMark').length == 0)
                {
                    $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                    $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
                    .addClass('opacityForHighlight');
                }
            });

            // pointer events none на всё что мешает
            $('#mainContent').addClass('pointerEventsNone');
            $('#userRole').addClass('pointerEventsNone');

            // change picture to icon over mini-map
            if(typeof ui != 'undefined')
            {
                var uiHelperHtml = ui.helper.html();
                $('#miniMapWrap')
                .on('mouseover', function()
                {
                    var draggedHeroCodename = $('#heroListWrap [data-hero-id="'+ui.helper.attr('data-hero-id')+'"]').attr('data-hero-codename');
                    ui.helper.html('<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287" width="16px" height="16px">');
                    ui.helper.addClass('dragOverMap');
                })
                .on('mouseout', function()
                {
                    ui.helper.html(uiHelperHtml);
                    ui.helper.removeClass('dragOverMap');
                });
            }
        },
        stop: function (event, ui) {
            var draggedHero = $(this);
            draggedHero.removeClass('grayscale');
            ui.helper.removeClass('draggable');

            // remove highlight from free slots on map
            $('#miniMapWrap > div.highlightSlot').removeClass('highlightSlot').find('span').remove();
            $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
            .removeClass('opacityForHighlight');

            // убрать pointer events none
            $('#mainContent').removeClass('pointerEventsNone');
            $('#userRole').removeClass('pointerEventsNone');
        }
    });
    // end of drag for hero list img
}

function draggableForPickedHeroImgWrap(slotEl)
{
    // drag for picked hero img wrap
    slotEl.find('.pickedHeroImgWrap').draggable({
        // cursor: 'default'
         helper: "clone"
        , zIndex: 200
        ,revert: 'invalid'
        , cursor: 'url("/images/closedhand.png"), auto'
        ,
        start: function (e, ui) {
            var draggedHero = $(this);
            ui.helper.attr('data-is-recieved-or-droped-out', 0);
            ui.helper.attr('data-dragged-from', 'fromPlaceHolder');
            $('#miniMapWrap img[data-hero-id="'+draggedHero.attr('data-hero-id')+'"').remove();
        },
        stop: function (event, ui) {
            if (ui.helper.attr('data-is-recieved-or-droped-out') == 0) {
                var dragedFromSlotEl = $(this);
                removeHeroFromSlot(dragedFromSlotEl, recountNeedOrNot = 1);
                releaseHeroInList(dragedFromSlotEl.attr('data-hero-id'));
                deleteHeroFromMinimap(heroId);
                pickedOrBanedHeroPointerEvents(heroId);
            }
        }
    });
    // end of drag for picked hero img wrap
}

function draggableForRecommendHeroes()
{
    // draggable for recommend heroes
    $('.heroImgWrapForBalance').draggable({
        // cursor: 'pointer'
        helper: "clone"
        ,revert: 'invalid'
        ,appendTo: 'body'
        , zIndex: 9999
        , cursor: 'url("/images/closedhand.png"), auto'
        , drag: function (event, ui)
        {
            var draggedHero = $(this);
            draggedHero.addClass('grayscale');
            ui.helper.addClass('draggable');
        },
        start: function (e, ui)
        {
            var draggedHero = $(this);

            ui.helper.attr('data-dragged-from', 'fromRecommendList');

            // highlight free slots on map
            if($('#miniMapImg').attr('src') == 'images/mini-map-dire.png')
            {
                // our team in dire
                $('#miniMapWrap > div[id^="dire"]').each(function(){
                    if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                    {
                        $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                        $('#direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
                        .addClass('opacityForHighlight');
                    }
                });
            } else {
                // our team in radiant
                $('#miniMapWrap > div[id^="radiant"]').each(function(){
                    if($(this).find('img').length == 0  && $(this).find('i.questionMark').length == 0)
                    {
                        $(this).addClass('highlightSlot').html('<span>'+$(this).attr('data-slot-role')+'</span>');
                        $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3')
                        .addClass('opacityForHighlight');
                    }
                });
            }

            // pointer events none на всё что мешает
            $('#mainContent').addClass('pointerEventsNone');
            $('#userRole').addClass('pointerEventsNone');

            // change picture to icon over mini-map
            if(typeof ui != 'undefined')
            {
                var uiHelperHtml = ui.helper.html();
                $('#miniMapWrap')
                .on('mouseover', function()
                {
                    var draggedHeroCodename = $('#heroListWrap [data-hero-id="'+ui.helper.attr('data-hero-id')+'"]').attr('data-hero-codename');
                    ui.helper.html('<img src="http://cdn.dota2.com/apps/dota2/images/heroes/'+draggedHeroCodename+'_icon.png?v=4299287" width="16px" height="16px">');
                    ui.helper.addClass('dragOverMap');
                })
                .on('mouseout', function()
                {
                    ui.helper.html(uiHelperHtml);
                    ui.helper.removeClass('dragOverMap');
                });
            }
        },
        stop: function (event, ui) {
            var draggedHero = $(this);
            draggedHero.removeClass('grayscale');
            ui.helper.removeClass('draggable');

            // remove highlight from free slots on map
            $('#miniMapWrap > div.highlightSlot').removeClass('highlightSlot').find('span').remove();
            $('#radiantEasy3, #radiantJungle, #radiantMid2, #radiantMid3, #radiantHard2, #radiantHard3, #direEasy3, #direJungle, #direMid2, #direMid3, #direHard2, #direHard3')
            .removeClass('opacityForHighlight');

            // убрать pointer events none
            $('#mainContent').removeClass('pointerEventsNone');
            $('#userRole').removeClass('pointerEventsNone');
        }
    });
    // end of draggable for recommend heroes
}

function changeRadar(teamCompositionDataArray, enemyTeamCompositionDataArray) {
    window.radarChart.data.datasets[0].data = [teamCompositionDataArray['initiator']
                                        ,teamCompositionDataArray['durable']
                                        ,teamCompositionDataArray['pusher']
                                        ,teamCompositionDataArray['nuker']
                                        ,teamCompositionDataArray['antipusher']
                                        ,teamCompositionDataArray['control']];

    window.radarChart.data.datasets[1].data = [enemyTeamCompositionDataArray['initiator']
                                        ,enemyTeamCompositionDataArray['durable']
                                        ,enemyTeamCompositionDataArray['pusher']
                                        ,enemyTeamCompositionDataArray['nuker']
                                        ,enemyTeamCompositionDataArray['antipusher']
                                        ,enemyTeamCompositionDataArray['control']];

    window.radarChart.update();
    console.log('radar changed');
}