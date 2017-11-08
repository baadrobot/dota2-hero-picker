$(document).ready(function ()
{
    //Nurax
    $('.abilitiesDataAbilityImage').each(function () 
    {
        $(this).click(function () 
        {
            var hasClassIgnore = $(this).hasClass('ignore');
            var selectedAbilityId = $(this).attr('data-ability-id');
            if (!hasClassIgnore)
            {
                $(this).addClass('ignore');
                
                // pleaseWaitOpen()
                //Ajax
                $.ajax({
                    url: '../ajax.editor.php',
                    data: {  ajaxType: 'masterIgnoreUpdateTo1'
                           , tagId: selectedAbilityId
                          },
                    datatype: 'json',
                    type: 'POST',
                    cache: false,
                    success: function (result)
                    {
                        if (result.php_result == 'OK')
                        {
                            console.log('Ignore updated to 1');
                        }
                        else if (result.php_result == 'ERROR')
                        {
                            console.log(result.php_error_msg);
                        };
                    },
                    complete: function (result)
                    {
                        // pleaseWaitClose();
                    },
                    error: function (request, status, error)
                    {
                        // we recieved NOT json
                    }
                });
                //end of ajax
            } else 
            {
                $(this).removeClass('ignore');

                // pleaseWaitOpen()
                //Ajax
                $.ajax({
                    url: '../ajax.editor.php',
                    data: {  ajaxType: 'masterIgnoreUpdateTo0'
                           , tagId: selectedAbilityId
                          },
                    datatype: 'json',
                    type: 'POST',
                    cache: false,
                    success: function (result)
                    {
                        if (result.php_result == 'OK')
                        {
                            console.log('Ignore updated to 0');
                        }
                        else if (result.php_result == 'ERROR')
                        {
                            console.log(result.php_error_msg);
                        };
                    },
                    complete: function (result)
                    {
                        // pleaseWaitClose();
                    },
                    error: function (request, status, error)
                    {
                        // we recieved NOT json
                    }
                });
                //end of ajax
            }
        });
    });

    //Ajax for get_hero_abilities_data.php
    $.ajax({
        url: '../ajax.editor.php',
        data: {  ajaxType: 'masterGetAllIgnoredAbilities'
            //    , tagId: selectedAbilityId
              },
        datatype: 'json',
        type: 'POST',
        cache: false,
        success: function (result)
        {
            if (result.php_result == 'OK')
            {
                result.ignored_abilities_id_array
                $('.abilitiesDataAbilityImage').each(function () 
                {
                    var curAbilityId = $(this).attr('data-ability-id');
                    for (i = 0; i < result.ignored_abilities_id_array.length; i++)
                    {
                        if (result.ignored_abilities_id_array[i]['id'] == curAbilityId)
                        {
                            $(this).addClass('ignore');
                        }
                    }
                });
            }
            else if (result.php_result == 'ERROR')
            {
                console.log(result.php_error_msg);
            };
        },
        complete: function (result)
        {
            // pleaseWaitClose();
        },
        error: function (request, status, error)
        {
            // we recieved NOT json
        }
    });
    //end of ajax
});
