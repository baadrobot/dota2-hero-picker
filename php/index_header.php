<?php
echo '<!DOCTYPE html>';
echo '<html lang="'.substr($_SESSION["SUserLang"], 0, 2).'">';
    echo '<head>';
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

        echo '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">';
        echo '<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>';
        echo '<script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>';
        echo '<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>';

        // jQuery UI
        echo '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">';
        echo '<script src="//code.jquery.com/ui/1.12.1/jquery-ui.js"></script>';
        echo '<script src="js/jquery.ui.autocomplete.js"></script>';
        echo '<script src="js/jquery.asyncform.1.0.min.js"></script>';


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


        if (isset($_GET['component']))
        {
            if  ($_GET['component'] == 'editor')
            {
                if (isGotAccess(_ROLE_EDITOR))
                {
                    // if problems with horisontal scroll in GB will apear, find "var gbHorizontalScrollsEl = jQuery('.horizontalScrollWrap');" in guidebook js
                    echo '<link rel="stylesheet" href="css/component.editor.css" />';
                    echo '<script src="js/component.editor.js"></script>';

                    echo '<script>';
                        echo '$(document).ready(function(){';
                            echo '$.ajax({url: "https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&callback=lore&l='.$legalLangs[$_SESSION['SUserLang']]['d2lang'].'",dataType:"jsonp",jsonpCallback:"lore",';
                                echo 'success:function(data){window.abilityData = data["abilitydata"];}';
                            echo '});';
                        echo '});';
                    echo '</script>';
                }

                // KainaxMinifyTools::compressAndLinkOut('css', 'SIMPLE', 'guidebook');
                // KainaxMinifyTools::compressAndLinkOut('js', 'DEFAULT', 'guidebook');
            }
            else if ($_GET['component'] == 'economic_globe')
            {

            }
            else if ($_GET['component'] == 'registration')
            {

            }
        }



    echo '</head>';
    echo '<body>';

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
