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
                        lockNewHeroInSlot($('.pickedHeroImgWrap[data-hero-id="' + draggedHeroId + '"]').parent(), prevSlotHeroId);
                    } else {
                        // ------- hero dragged in from hero list
                        releaseHeroInList(prevSlotHeroId);
                        slotImgWrap.remove();
                    }
                }
                lockNewHeroInSlot(recieverEl, draggedHeroId);
            },
            over: function(event, ui) {
                ui.helper.addClass('draggableOverDroppable');
            },
            out: function(event, ui) {
                ui.helper.removeClass('draggableOverDroppable');
            }
        });

        function removeHeroFromSlot(slotItemEl)
        {
            slotItemEl.parent().removeClass('slot').addClass('emptySlot');
            slotItemEl.remove();
        }

        function releaseHeroInList(heroId)
        {
            $('.heroListImg[data-hero-id="' + heroId + '"]')
            .removeClass('pickedOrBaned')
            .find('.redLine').remove();
        }

        function lockNewHeroInSlot(slotEl, heroId)
        {
            // clear all old elements
            removeHeroFromSlot( $('.pickedHeroImgWrap[data-hero-id="' + heroId + '"]') );
            releaseHeroInList(heroId);

            slotEl.removeClass('emptySlot').addClass('slot');
            var heroListEl = $('.heroListImg[data-hero-id="' + heroId + '"]');
            var draggedHeroCodename = heroListEl.attr('data-hero-codename');

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
            slotEl.prepend('<div class="pickedHeroImgWrap" data-hero-id="' + heroId + '" data-hero-codename="' + draggedHeroCodename + '"><span class="pickedHeroImgDelete fa fa-times"></span><img data-img-src="//cdn.dota2.com/apps/dota2/images/heroes/' + draggedHeroCodename + '_hphover.png?v=4238480"></div>');

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
                        removeHeroFromSlot(dragedFromSlotEl);
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
                removeHeroFromSlot(imgWrapToRemoveEl);
                releaseHeroInList(deletedHeroId);
            });
        }


        $('.emptySlot')
        .mouseenter(function()
        {
            $(this).find('.pickedHeroImgDelete').show();
        })
        .mouseleave(function() {
            $(this).find('.pickedHeroImgDelete').hide();
        });
    // end of drag'n'drop


});

