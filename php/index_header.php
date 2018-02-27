<?php
echo '<!DOCTYPE html>';
echo '<html lang="'.substr($_SESSION["SUserLang"], 0, 2).'">';
    echo '<head>';
        // force IE browser to use latest version 9+
        //echo '<meta http-equiv="X-UA-Compatible" content="IE=edge">';

        echo '<meta http-equiv="content-type" content="text/html; charset=utf-8">';
        echo '<meta name="language" content="'.$_SESSION["SUserLang"].'">';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1">';

        //ToDo: Check if current page should be indexed by search robots
        if ((TRUE) || (isset($_GET['ic'])) || (isset($_GET['icd'])) || (isset($_GET['im'])))
        {
            echo '<meta name="robots" content="noindex">';
        } else {
            echo '<meta name="robots" content="index, follow">';
        }

        echo '<title>PickBooster.com - Ultimate Dota 2 capitan mode picker</title>';
        //echo '<meta name="description" content="'.$description.'">';
        //echo '<meta name="keywords" content="'.$keywords.$dynKeywords.'">';


        // if (isMobileVer())
        // {
        //             //Set the viewport to show the page at a scale of 1.0, and make it non-scalable
        //     echo '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"/>';

        //             //Make it fullscreen / hide the browser URL bar
        //     echo '<meta name="apple-mobile-web-app-capable" content="yes" />';

        //             //Give the status bar another colour. Valid values for "content" are: "default" (white), "black" and "black-translucent"
        //             //If set to "default" or "black", the content is displayed below the status bar. If set to "black-translucent", the content is displayed under the bar.
        //     echo '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />';

        //             //Add a Home icon. By default, Mobile Safari searches for a file named "apple-touch-icon.png" in the root directory of your website.
        //             //If it can't find any image there, you can specify it using the code below. Make sure the image has a dimension of 114x114 and is a PNG file. The glossy finish and
        //             //resizing for the different devices will be done automatically. In case you don't want the gloss applied, use "apple-touch-icon-precomposed" instead of "apple-touch-icon".
        //     echo '<link rel="apple-touch-icon" href="images/mobile/economix_logo_114x114.png" />';

        //             //Add a splash screen / startup image. Take note this file exactly needs to be 320x460 for iPhone or 1004x768 for iPad, and is a PNG file.
        //             //Also, this only works if "apple-mobile-web-app-capable" is set to "yes".
        //     echo '<link rel="apple-touch-startup-image" href="images/mobile/economix_logo_320x480.png" />';
        //     echo '<link rel="apple-touch-startup-image" href="images/mobile/economix_logo_320x480.png" sizes="320x480" />';

        //     unset($changeGetParams['ver']);
        //     echo '<link rel="canonical" media="screen" hreflang="'.substr($_SESSION["SUserLang"], 0, 2).$hrefBegin.http_build_query($changeGetParams).'" />';
        // }

        echo '<link href="favicon.ico" rel="shortcut icon" type="image/x-icon">';

        echo '<script src="https://use.fontawesome.com/3f039be9d2.js"></script>';
        // echo '<script src="js/fontawesome.js"></script>';



        if (($_SESSION["SAccessRoles"] != 'g') and ($_SESSION["SAccessRoles"] != _ROLE_USER))
        {
            /*
            echo '<script type="text/javascript" src="js/adminkaz.js"></script>';

            if (isGotAccess(_ROLE_DESIGNER_360))
            {
                echo '<script>';
                    echo 'window.isRoleDe360 = "";';
                echo '</script>';
            }
            */
        }

        // echo '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" crossorigin="anonymous">';
        echo '<link rel="stylesheet" href="css/bootstrap.min.css">';

        // echo '<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>';
        echo '<script src="js/jquery.min.js"></script>';

        // echo '<script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" crossorigin="anonymous"></script>';
        echo '<script src="js/popper.min.js"></script>';

        echo '<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" crossorigin="anonymous"></script>';
        // echo '<script src="js/bootstrap.min.js"></script>';


        // jQuery UI
        // echo '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">';
        echo '<link rel="stylesheet" href="css/jquery-ui.css">';

        // echo '<script src="//code.jquery.com/ui/1.12.1/jquery-ui.js"></script>';
        echo '<script src="js/jquery-ui.js"></script>';


        echo '<script src="js/jquery.ui.autocomplete.js"></script>';


        echo '<script>';
            echo 'window.LangPreStr = [];';
            echo 'window.LangPreStr["GLOBAL"] = [];';
            echo 'window.LangPreStr["GLOBAL"]["_CONFIRM_"] = "Подтвердить";';
            echo 'window.LangPreStr["GLOBAL"]["_CANCEL_"] = "Отмена";';
            echo 'window.LangPreStr["GLOBAL"]["_DELETE_"] = "Удалить";';
            echo 'window.LangPreStr["GLOBAL"]["_CONFIRM_ACTION_"] = "Подтвердите действие";';
            echo 'window.LangPreStr["GLOBAL"]["_CONFIRM_QUESTION_"] = "Вы уверены что хотите выполнить данное действие?";';
        echo '</script>';

        echo '<link rel="stylesheet" href="css/kainax.css">';
        echo '<script src="js/kainax.js"></script>';
        // echo '<script src="js/carhartl-jquery-cookie-92b7715/jquery.cookie.js"></script>';


        $bodyClass = '';
        if (isset($_GET['component']))
        {

            $externalData = '<script>';
                // this translations only needed for ability tooltips
                $externalData .= 'window.LangPreStr["GLOBAL"]["_DISPELLABLE_YES_"] = "Стандартное";';
                $externalData .= 'window.LangPreStr["GLOBAL"]["_DISPELLABLE_YES_STRONG_"] = "Только сильное";';
                $externalData .= 'window.LangPreStr["GLOBAL"]["_DISPELLABLE_NO_"] = "Невозможно развеять";';

                $externalData .= '$(document).ready(function(){';
                    $externalData .= '$.ajax({url: "https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&callback=lore&l='.$legalLangs[$_SESSION['SUserLang']]['d2lang'].'",dataType:"jsonp",jsonpCallback:"lore",';
                        $externalData .= 'success:function(data){window.abilityData = data["abilitydata"];}';
                    $externalData .= '});';
                $externalData .= '});';
            $externalData .= '</script>';

            echo '<script src="js/prebuild.scepter_descr.js"></script>';

            function loadAdditionalTooltipData()
            {
                global $dbClass;

                $query2 = 'SELECT cf_d2HeroAbilityList_id as `abilityId`, cf_d2HeroAbilityList_spellDispellableType as `type`
                FROM tb_dota2_hero_ability_list
                WHERE cf_d2HeroAbilityList_spellDispellableType IS NOT NULL;';

                $spell_dispellable_type_array = $dbClass->select($query2);

                $abilityTypeList = [];
                for ($i = 0; $i < count($spell_dispellable_type_array); $i++)
                {
                    if ($spell_dispellable_type_array[$i]['type'] == 'SPELL_DISPELLABLE_NO')
                    {
                        $dispellableTypeIntegerOrUnknownName = 0;
                    } else if ($spell_dispellable_type_array[$i]['type'] == 'SPELL_DISPELLABLE_YES')
                    {
                        $dispellableTypeIntegerOrUnknownName = 1;
                    } else if ($spell_dispellable_type_array[$i]['type'] == 'SPELL_DISPELLABLE_YES_STRONG')
                    {
                        $dispellableTypeIntegerOrUnknownName = 2;
                    } else {
                        $dispellableTypeIntegerOrUnknownName = $spell_dispellable_type_array[$i]['abilityId'];
                    }

                    $abilityTypeList[$spell_dispellable_type_array[$i]['abilityId']] = $dispellableTypeIntegerOrUnknownName;
                }

                echo '<script>';
                    echo 'window.abilityTypeList = '.json_encode($abilityTypeList).';';
                echo '</script>';
            }


            if  (($_GET['component'] == 'editor') && isGotAccess(_ROLE_EDITOR))
            {
                loadAdditionalTooltipData();
                // if problems with horisontal scroll in GB will apear, find "var gbHorizontalScrollsEl = jQuery('.horizontalScrollWrap');" in guidebook js
                echo '<link rel="stylesheet" href="css/component.editor.css" />';
                echo '<script src="js/component.editor.js"></script>';
                echo $externalData;

                $bodyClass = $_GET['component'];
                // KainaxMinifyTools::compressAndLinkOut('css', 'SIMPLE', 'guidebook');
                // KainaxMinifyTools::compressAndLinkOut('js', 'DEFAULT', 'guidebook');
            }
            else if (($_GET['component'] == 'master') && isGotAccess(_ROLE_MASTER))
            {
                loadAdditionalTooltipData();
                echo '<script src="js/component.master.js"></script>';
                echo '<link rel="stylesheet" href="css/component.master.css">';
                echo $externalData;
                $bodyClass = $_GET['component'];
            }
            else if ($_GET['component'] == 'registration')
            {
                echo '<script src="js/component.registration.js"></script>';
                echo '<link rel="stylesheet" href="css/component.registration.css">';
                $bodyClass = $_GET['component'];
            }
            else if ($_GET['component'] == 'user_profile')
            {
                echo '<script src="js/component.user_profile.js"></script>';
                echo '<link rel="stylesheet" href="css/component.user_profile.css">';

                $bodyClass = $_GET['component'];
            }
            else if ($_GET['component'] == 'counter_pick')
            {
                //echo '<script src="js/jquery.pasteimage.js"></script>';

                // echo '<script src="js/component.counter_pick.js"></script>';
                // echo '<link rel="stylesheet" href="css/component.counter_pick.css">';
                //
                // loadAdditionalTooltipData();
                // if problems with horisontal scroll in GB will apear, find "var gbHorizontalScrollsEl = jQuery('.horizontalScrollWrap');" in guidebook js
                echo '<link rel="stylesheet" href="css/component.counter_pick.css" />';
                echo '<script src="js/component.counter_pick.js"></script>';
                echo $externalData;
                if(isGotAccess(_ROLE_EDITOR))
                {
                    echo '<script src="js/admin.counter_pick.js"></script>';
                }
                $bodyClass = $_GET['component'];
            }
        }

    echo '</head>';
    if ($bodyClass == '')
    {
        echo '<body>';
    } else {
        echo '<body class="'.$bodyClass.'">';
    }

    echo '<div class="background-image"></div>';
    // Menu
?>
    <nav class="navbar navbar-expand-md bg-primary navbar-dark">
    <div class="container">
      <a class="navbar-brand" href="/">PickBooster.com</a>
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar2SupportedContent" aria-controls="navbar2SupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button>
      <div class="collapse navbar-collapse text-center justify-content-end" id="navbar2SupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa d-inline fa-lg fa-bookmark-o"></i> Bookmarks</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa d-inline fa-lg fa-envelope-o"></i> Contacts</a>
          </li>
        </ul>
        <a class="btn navbar-btn btn-primary ml-2 text-white"><i class="fa d-inline fa-lg fa-user-circle-o"></i> Sign in</a>
      </div>
    </div>
  </nav>
  <div id="mainbodyContainer" class="container">
