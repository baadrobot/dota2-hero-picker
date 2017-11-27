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

    confirmDialog({
        confirmTitle : getPreStr_js('COUNTER_PICK', '_CM_OR_AP_')
        ,confirmHtml : question
        ,btnOKCaption : getPreStr_js('COUNTER_PICK', '_NEXT_')
        ,btnCancelCaption : getPreStr_js('COUNTER_PICK', '_BACK_')
        ,btnOKColorClass : 'btn-success'
        ,allowBackClickClose : false
        ,onBeforeShow: function ()
        {
            $('#btnConfirmDialogOK').attr('disabled', 'disabled');
        }
        ,onAfterShow : function ()
        {

        }
        ,onUserClickedOK : function ()
        {
            
        }
        ,onUserClickedCancel : function ()
        {
            //
        }
    });

    buildHeroList('#heroListWrap');


});

