$(document).ready(function ()
{
    // if($.cookie('fillInputValue') != '')
    if(getCookie('fillInputValue') != '')
    {
        // fill input OK btn
        $('#fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn').before('<span id="fillHeroPickAndBanSlotsViaAliasSingleInputCookieBtn" class="input-group-addon"><i class="fa fa-undo"></i></span>');

        $('#fillHeroPickAndBanSlotsViaAliasSingleInputCookieBtn').on('click', function() 
        {
            $('#fillHeroPickAndBanSlotsViaAliasSingleInputCookieBtn').remove();
            var fillInputEl = $('#fillHeroPickAndBanSlotsViaAliasSingleInput');
            fillInputEl.val(getCookie('fillInputValue'));

            if(fillInputEl.val() != '')
            {
                // fill input OK btn
                $('#fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn').trigger('click');
            }
        });        
    }
});
// - END DOC READY//////////////////////////////////////



$(window).on("load",function()
{

});
// - END WINDOW LOAD////////////////////////////////////


function addFillInputToCookie(textForInput)
{
    // $.cookie('fillInputValue', textForInput, { expires: 1 });
    setCookie('fillInputValue', textForInput, 1)
}