$(document).ready(function ()
{
    if(getCookie('fillInputValue') != '')
    {
        // fill input OK btn
        $('#fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn').before('<span id="fillHeroPickAndBanSlotsViaAliasSingleInputCookieBtn" class="input-group-append" title="Get previous pick"><button class="fa fa-undo btn btn-secondary"></button></span>');

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

function showRecommendationsValue()
{
    $('.heroTotalCoefForBalance').css('display','block');
}