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
             cursor: 'move'
            ,helper: "clone"
            ,revert: 'invalid'
            , drag: function (event, ui)
            {
                var draggedHero = $(this);
                //var dragHeroId = draggedHero.attr('data-hero-id');
                draggedHero.addClass('grayscale');
                ui.helper.addClass('draggable');
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
                var dropedToEl = $(this);
                dropedToEl.removeClass('emptySlot');

                var draggedHeroId = ui.helper.attr('data-hero-id');
                var draggedHeroCodename = ui.helper.attr('data-hero-codename');

                // release prev hero (if any)
                var slotImgWrap = dropedToEl.find('.pickedHeroImgWrap');
                if (slotImgWrap.length)
                {
                    var prevSlotHeroId = slotImgWrap.attr('data-hero-id');
                    $('.heroListImg[data-hero-id="' + prevSlotHeroId + '"]').removeClass('pickedOrBaned');
                    slotImgWrap.remove();
                }

                // lock dragged hero
                $('.heroListImg[data-hero-id="' + draggedHeroId + '"]').addClass('pickedOrBaned');

                // create new img_wrap and img
                dropedToEl.prepend('<div class="pickedHeroImgWrap" data-hero-id="'+draggedHeroId+'"><img data-img-src="//cdn.dota2.com/apps/dota2/images/heroes/' + draggedHeroCodename + '_hphover.png?v=4238480"></div>');

                // preload new img
                kainaxPreloadImages({ wrapElement: dropedToEl.find('.pickedHeroImgWrap')
                                    , gifNameOrFalse: 'spinner.gif'
                                    //, gifNameOrFalse: 'eco-ajax-loader-01.gif'
                                    , opacity: 0.6
                                    , loaderIntH: 10
                                    , loaderIntW: 10
                                    //, missingPicOrFalse: false
                                });
            }
        });

});

