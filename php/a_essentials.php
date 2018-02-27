<?php
    date_default_timezone_set('GMT'); //Other zones http://www.php.net/manual/ru/timezones.php
    ini_set('default_charset', 'UTF-8');


    if (isLocalhost())
    {
        // Cfg for localhost
        ini_set('display_errors', 1);
        ini_set('display_start_up_errors', 1);
        error_reporting(E_ALL);
    } else {
        // Cfg for AWS (reworked)
        //session_save_path(sys_get_temp_dir());
        //ini_set('session.save_path', sys_get_temp_dir());
        ini_set('display_errors', 0);
        ini_set('display_start_up_errors', 0);
    }

    $myiAccessSecretVar = 'chuPakaB2erus7s';

    // Security set and check
    ini_set('register_globals', 0);
    ini_set('register_long_arrays', 0);
    if (ini_get('register_globals'))
    {
        // register_globals is set to ON, can't continue for security reasons!
        echo "Error di3fv-uz23g-po45z-vi2xb";
        exit;
    }

    // Защита от взлома через GLOBALS
    if (isset($HTTP_POST_VARS['GLOBALS']) || isset($HTTP_POST_FILES['GLOBALS']) ||
        isset($HTTP_GET_VARS['GLOBALS']) || isset($HTTP_COOKIE_VARS['GLOBALS']))
    {
        die('Hacking attempt detected!');
        //ToDo: Log data to MySQL and send email admin
    }

     // Защита от взлома через HTTP_SESSION_VARS
    if (isset($HTTP_SESSION_VARS) && !is_array($HTTP_SESSION_VARS))
    {
        die('Hacking attempt detected!');
    }


    ////////////// BEGIN CUSTOM ERROR HANDLER //////////////

    set_error_handler("kainaxErrorHandler");
    //register_shutdown_function("kainaxShutdownHandler");

    function kainaxShutdownHandler()
    {
      if (ini_get('display_errors'))
      {
        echo "<div style='font:normal 11px/15px verdana,tahoma,arial;background:#f11;padding:10px;color:#fff;border:0px solid #fff;box-shadow:1px 1px 5px #300;margin:5px;'><xmp>";
        print_r(error_get_last());
        echo "</xmp><div>";
      }
    }

    function addErrorBox($msgDefinition, $errline, $errfile, $errstr, $color)
    {
        if (php_sapi_name() !== 'cli')
        {
            echo '<div style="font:normal 11px/15px verdana,tahoma,arial;padding:5px;color:'.$color.';border:1px solid '.$color.';margin:5px 1px;">';
            echo '<span>[Exception on line <b>#' . $errline . '</b> of ' . $errfile . ']</span><br />';
            echo '<b>'.$msgDefinition.':</b> <em>' . $errstr . '</em><br />';
            echo '</div>';
        } else {
            echoLine("\n\n[".$msgDefinition.'] in '.$errfile);
            echoLine('at line #'.$errline.': '.$errstr."\n");
        }
    }

    function kainaxErrorHandler($errno, $errstr, $errfile, $errline)
    {
        //Comment this line to get full file path
        $errfile = basename($errfile); //get filename without dir

        if (ini_get('display_errors'))
        {
            if (!(error_reporting() & $errno)) {
                // Этот код ошибки не включен в error_reporting
                return;
            }

            switch ($errno) {
            case E_WARNING:
                addErrorBox('Warning',$errline, $errfile, $errstr, '#EABD0E');
                break;
            case E_NOTICE:
                addErrorBox('Notice',$errline, $errfile, $errstr, '#42A2FF');
                break;
            case E_USER_ERROR:
                addErrorBox('Fatal error',$errline, $errfile, $errstr, '#f00');
                break;
            case E_USER_WARNING:
                addErrorBox('Warning',$errline, $errfile, $errstr, '#EABD0E');
                break;
            case E_USER_NOTICE:
                addErrorBox('Notice',$errline, $errfile, $errstr, '#42A2FF');
                break;
            case E_RECOVERABLE_ERROR:
                addErrorBox('Recoverable error',$errline, $errfile, $errstr, '#f00');
                break;
            default:
                addErrorBox('Unknown(#' . $errno . ') error:',$errline, $errfile, $errstr, '#f00');
                break;
            }
        }

        if (($errno == E_USER_ERROR) or ($errno == E_RECOVERABLE_ERROR))
        {
            exit(1);
        }
        //Не запускаем внутренний обработчик ошибок PHP
        return TRUE;
    }





    //**** *Role constants in alphabetical order
    define('_ROLE_FULL_ACCESS', 'full_access');

        //Granted to see admin menu
        //isGotAccess(_ROLE_ADMIN_MENU)
    define('_ROLE_ADMIN_MENU', 'am');

        //Granted to see admin menu
        //isGotAccess(_ROLE_ADMIN_AUTOMATIC_TESTS)
    define('_ROLE_ADMIN_AUTOMATIC_TESTS', 'at');

        //Granted to render pages w/o cache
        //isGotAccess(_ROLE_CAN_IGNORE_CACHE)
    define('_ROLE_CAN_IGNORE_CACHE', 'cic');

        //Granted to see content edit tools
        //isGotAccess(_ROLE_EDITOR)
    define('_ROLE_EDITOR', 'ed');

        //Granted to see PHP error-popups in web-page (including AJAX PHP-Side errors)
        //isGotAccess(_ROLE_CAN_SEE_ERRORS)
    define('_ROLE_CAN_SEE_ERRORS', 'er');

        //Role logged in user
        //isGotAccess(_ROLE_GUEST)
    define('_ROLE_GUEST', 'g');

    //Granted to master editors of the game
    //isGotAccess(_ROLE_MASTER)
    define('_ROLE_MASTER', 'm');

    //Granted to programmers
    //isGotAccess(_ROLE_PROGRAMMER)
    define('_ROLE_PROGRAMMER', 'pr');

        //Granted to see page creation time
        //isGotAccess(_ROLE_PAGE_CREATION_TIME)
    define('_ROLE_PAGE_CREATION_TIME', 'pct');

        //Granted to see new/edited content and publish it
        //isGotAccess(_ROLE_PUBLISHER)
    define('_ROLE_PUBLISHER', 'pu_');

        //Granted to see translator's tools
        //isGotAccess(_ROLE_TRANSLATOR)
    define('_ROLE_TRANSLATOR', 'tr_');

        //Role logged in user
        //isGotAccess(_ROLE_USER)
    define('_ROLE_USER', 'u');



    global $redirectWithNewGetParams;
    $redirectWithNewGetParams = FALSE;

    //https or http (global var)
    global $httpOrHttps;
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
        $httpOrHttps = 'https';
    }
    elseif (((isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) and ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) or ((isset($_SERVER['HTTP_X_FORWARDED_SSL'])) and (($_SERVER['HTTP_X_FORWARDED_SSL']) == 'on'))) {
        //if behind loadBalancer
        $httpOrHttps = 'https';
    } else {
        $httpOrHttps = 'http';
    }


    session_start();
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//****************************************************************************************************************
//********************************** do not use session before this line! ****************************************
//****************************************************************************************************************
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //Ignore cache delete
    if (isset($_GET['icd']))
    {
        $_SESSION['icd'] = 5;
        //Redirect the user to the same page without 'icd' in GET, but with 'icd' in $_SESSION['icd']
        if (!$redirectWithNewGetParams)
        {
            $redirectWithNewGetParams = $_GET;
        }
        unset($redirectWithNewGetParams['icd']);
    }

    //Affiliate/Referral
    if ($refToken = getGetKeyOrFalse('ref'))
    {
        if ((!isset($_SESSION["SAccessRoles"])) or (getSessionKeyOrFalse('SAccessRoles') == _ROLE_GUEST))
        {
            //set cookie for ref token
            $expire  = time() + (60*60*24*7); //for 7 days
            setcookie('REF', $refToken, $expire, '/');
        }

        //Redirect the user to the same page without 'ref' in GET
        if (!$redirectWithNewGetParams)
        {
            $redirectWithNewGetParams = $_GET;
        }
        unset($redirectWithNewGetParams['ref']);
    }



    //ToDo: Add currency and exchange rate fields
    global $legalLangs;
    $legalLangs = array();
    $legalLangs['ru_RU'] = array();
        $legalLangs['ru_RU']['flag'] = 'RU';
        $legalLangs['ru_RU']['local_name'] = 'Русский Язык';
        $legalLangs['ru_RU']['status'] = 1;
        $legalLangs['ru_RU']['dependency'] = 'pre';
        $legalLangs['ru_RU']['d2lang'] = 'russian';
    $legalLangs['en_UK'] = array();
        $legalLangs['en_UK']['flag'] = 'GB';
        $legalLangs['en_UK']['local_name'] = 'English Language';
        $legalLangs['en_UK']['status'] = 2;
        $legalLangs['en_UK']['dependency'] = 'ru_RU';
        $legalLangs['en_UK']['d2lang'] = 'english';
    $legalLangs['fr_FR'] = array();
        $legalLangs['fr_FR']['flag'] = 'FR';
        $legalLangs['fr_FR']['local_name'] = 'Langue Française';
        $legalLangs['fr_FR']['status'] = 2;
        $legalLangs['fr_FR']['dependency'] = 'en_UK';
        $legalLangs['fr_FR']['d2lang'] = 'french';
    $legalLangs['de_DE'] = array();
        $legalLangs['de_DE']['flag'] = 'DE';
        $legalLangs['de_DE']['local_name'] = 'Deutsch Sprache';
        $legalLangs['de_DE']['status'] = 2;
        $legalLangs['de_DE']['dependency'] = 'en_UK';
        $legalLangs['de_DE']['d2lang'] = 'german';
    $legalLangs['tr_TR'] = array();
        $legalLangs['tr_TR']['flag'] = 'TR';
        $legalLangs['tr_TR']['local_name'] = 'Türk Dili';
        $legalLangs['tr_TR']['status'] = 0;
        $legalLangs['tr_TR']['dependency'] = 'en_UK';
        $legalLangs['en_UK']['d2lang'] = 'turkish';


    //Get dependency lang
    function getPrimLangFromDependLang($dependLang)
    {
        global $legalLangs;

        $dependLang = strtolower($dependLang);

        foreach ($legalLangs as $key => $value)
        {
            if (strtolower($key) == $dependLang)
            {
                return $legalLangs[$key]['dependency'];
                break;
            }
        }
    }




    //Set language depending on GET lang=? and write down to session
    if (isset($_GET["lang"]))
    {
        $isFoundLegalLang = FALSE;
        $curGetLangLowered = $_GET["lang"];

        foreach ($legalLangs as $key => $value)
        {
            if (($key == $curGetLangLowered)
            and (($legalLangs[$key]['status'] == 1)
                or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_TRANSLATOR.$legalLangs[$key]['dependency'].'2'.$key))) //ru_RU2en_UK
                or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_PUBLISHER.$key)))))
            {
                $_SESSION["SUserLang"] = $key;
                $isFoundLegalLang = TRUE;
                break;
            }
        }

        if (!$isFoundLegalLang)
        {
            redirectPageWithChangedLangGet();
        }
    } else {
        //Redirect if there is no lang= in URL
        redirectPageWithChangedLangGet();
    }



                                        function redirectPageWithChangedLangGet()
                                        {
                                            global $redirectWithNewGetParams;
                                            global $legalLangs;
                                            $isFoundLegalLang = FALSE;

                                            //trying to check if lang is in wrong caps case
                                            if (isset($_GET["lang"]))
                                            {
                                                $curGetLangLowered = strtolower($_GET["lang"]);
                                                foreach ($legalLangs as $key => $value)
                                                {
                                                    if ((strtolower($key) == $curGetLangLowered)
                                                    and (($legalLangs[$key]['status'] == 1)
                                                        or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_TRANSLATOR.$legalLangs[$key]['dependency'].'2'.$key))) //ru_RU2en_UK
                                                        or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_PUBLISHER.$key)))))
                                                    {
                                                        $_SESSION["SUserLang"] = $key;
                                                        $isFoundLegalLang = TRUE;
                                                        break;
                                                    }
                                                }
                                            }

                                            //if got SESSION cheking if it is still valid
                                            if (!$isFoundLegalLang)
                                            {
                                                if (isset($_SESSION["SUserLang"]))
                                                {
                                                    $curSessionLang = $_SESSION["SUserLang"];
                                                    foreach ($legalLangs as $key => $value)
                                                    {
                                                        if (($key == $curSessionLang)
                                                        and (($legalLangs[$key]['status'] == 1)
                                                            or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_TRANSLATOR.$legalLangs[$key]['dependency'].'2'.$key))) //ru_RU2en_UK
                                                            or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_PUBLISHER.$key)))))
                                                        {
                                                            $_SESSION["SUserLang"] = $key;
                                                            $isFoundLegalLang = TRUE;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            //Try to detect user's last choice from COOKIES
                                            if (!$isFoundLegalLang)
                                            {
                                                if (isset($_COOKIE['LANG']))
                                                {
                                                    $curCookieLangLowered = strtolower($_COOKIE['LANG']);
                                                    foreach ($legalLangs as $key => $value)
                                                    {
                                                        if ((strtolower($key) == $curCookieLangLowered)
                                                        and (($legalLangs[$key]['status'] == 1)
                                                            or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_TRANSLATOR.$legalLangs[$key]['dependency'].'2'.$key))) //ru_RU2en_UK
                                                            or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_PUBLISHER.$key)))))
                                                        {
                                                            $_SESSION["SUserLang"] = $key;
                                                            $isFoundLegalLang = TRUE;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            //Try to detect browser default lang
                                            if (!$isFoundLegalLang)
                                            {
                                                if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
                                                {
                                                    $browserLangsArray = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);

                                                    for ($i=0;$i < count($browserLangsArray); $i++)
                                                    {
                                                        $twoLettersBrowserCode = strtolower( substr($browserLangsArray[$i], 0, 2) );

                                                        foreach ($legalLangs as $key => $value)
                                                        {
                                                            if ((substr($key, 0, 2) == $twoLettersBrowserCode)
                                                            and (($legalLangs[$key]['status'] == 1)
                                                                or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_TRANSLATOR.$legalLangs[$key]['dependency'].'2'.$key))) //ru_RU2en_UK
                                                                or (($legalLangs[$key]['status'] == 2) and (isGotAccess(_ROLE_PUBLISHER.$key)))))
                                                            {
                                                                $_SESSION["SUserLang"] = $key;
                                                                $isFoundLegalLang = TRUE;
                                                                break 2;
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            if (!$isFoundLegalLang)
                                            {
                                                $defaultLang = "ru_RU";
                                                $_SESSION["SUserLang"] = $defaultLang;
                                            }

                                            //prepare for a one shot redirect
                                            if (!$redirectWithNewGetParams)
                                            {
                                                $redirectWithNewGetParams = $_GET;
                                            }
                                            $redirectWithNewGetParams['lang'] = $_SESSION["SUserLang"];
                                        }



    if (isset($_GET['component']))
    {
        //****** checking if translator's langs are valid
        if (($_GET['component']) == ('translator'))
        {
            // if ((getGetKeyOrFalse('from_lang')) and (getGetKeyOrFalse('to_lang')))
            // {
            //     $fromLang = $_GET['from_lang'];
            //     $toLang = $_GET['to_lang'];

            //     if ($fromLang == 'auto')
            //     {
            //             //prepare for a one shot redirect
            //             if (!$redirectWithNewGetParams)
            //             {
            //                 $redirectWithNewGetParams = $_GET;
            //             }
            //             $redirectWithNewGetParams['from_lang'] = getPrimLangFromDependLang($toLang);
            //     } else {
            //         if ((!isGotAccess(_ROLE_TRANSLATOR.$fromLang.'2'.$toLang)) and (!isGotAccess(_ROLE_PUBLISHER.$toLang)))
            //         {
            //             //prepare for a one shot redirect
            //             if (!$redirectWithNewGetParams)
            //             {
            //                 $redirectWithNewGetParams = $_GET;
            //             }
            //             unset($redirectWithNewGetParams['to_lang']);
            //             unset($redirectWithNewGetParams['from_lang']);
            //         }
            //     }
            // }
        } else if (($_GET['component']) == ('editor'))
        {

        }
    }




    //``````````````````````````` BEGIN LEGAL GET REQUEST ```````````````````````````
    // if (getSessionKeyOrFalse('SAccessRoles') == _ROLE_GUEST)
            //if ((!isset($_SESSION["SAccessRoles"])) or (isGotAccess(_ROLE_GUEST)))
    {
        function pushToLegalGet($mainGet, $mustHaveGet, $mustHaveGetValue, $allowedType, $allowedTypeValue)
        {
            //Examples:
            //$legalGET['component']['anyGet']['anyVal']['fixedList'][0] = 'guidebook';
            //$legalGET['component']['anyGet']['anyVal']['fixedList'][1] = 'economic_globe';
            //$legalGET['id']['component']['guidebook']['maxInt'] = '3000'; //get max id from MySQL
            //$legalGET['id']['component']['economic_globe']['maxInt'] = '3000'; //get max id from MySQL
            global $legalGET;
            if (!isset($legalGET[$mainGet]))
            {
                $legalGET[$mainGet] = array();
            }
            if ($mustHaveGet != '')
            {
                if (!isset($legalGET[$mainGet][$mustHaveGet]))
                {
                    $legalGET[$mainGet][$mustHaveGet] = array();
                }

                if (!isset($legalGET[$mainGet][$mustHaveGet][$mustHaveGetValue]))
                {
                    $legalGET[$mainGet][$mustHaveGet][$mustHaveGetValue] = array();
                }

                if ($allowedType == 'fixedList')
                {
                    if (!isset($legalGET[$mainGet][$mustHaveGet][$mustHaveGetValue][$allowedType]))
                    {
                        $legalGET[$mainGet][$mustHaveGet][$mustHaveGetValue][$allowedType] = array();
                    }
                    array_push($legalGET[$mainGet][$mustHaveGet][$mustHaveGetValue][$allowedType], $allowedTypeValue);
                } else //'maxInt', 'fixedLength', 'anyVal'
                {
                    $legalGET[$mainGet][$mustHaveGet][$mustHaveGetValue][$allowedType] = $allowedTypeValue;
                }
            }
        }

        global $legalGET;
        $legalGET = array();
        //Свободные ключи:
        pushToLegalGet('ver', '', '', '', '');
        pushToLegalGet('lang', '', '', '', '');
        pushToLegalGet('ic', '', '', '', '');     //ignore cache
        pushToLegalGet('icd', '', '', '', '');    //ignore cache delete
        pushToLegalGet('im', '', '', '', '');     //ignore minify
        pushToLegalGet('pct', '', '', '', '');    //page creation time
        pushToLegalGet('met', '', '', '', '');    //max execution time
        pushToLegalGet('ref', '', '', '', '');    //referral/affiliate
        pushToLegalGet('input', '', '', '', '');

        //Google Analytics UTM Fields - http://www.stijit.com/web-analytics/utm-url-builder
        pushToLegalGet('utm_source', '', '', '', '');     // standart
        pushToLegalGet('utm_medium', '', '', '', '');     // standart
        pushToLegalGet('utm_campaign', '', '', '', '');   // standart
        pushToLegalGet('utm_term', '', '', '', '');       // additional
        pushToLegalGet('utm_content', '', '', '', '');    // additional

        //Ключи с ограничениями:
        //pushToLegalGet('e_id', 'component', 'password_reset', 'fixedLength', 32);
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'registration');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'user_profile');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'editor');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'master');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'counter_pick');
        /*
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'registration');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'user_profile');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'password_change');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'password_reset');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'email_confirm');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'unsubscribe');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'faq');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'forum');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'automatic_tests');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'affiliate_program');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'store');
        pushToLegalGet('component', 'anyGet', 'anyVal', 'fixedList', 'inventory');

        pushToLegalGet('sub', 'anyGet', 'anyVal', 'fixedList', 'terms');
        pushToLegalGet('sub', 'anyGet', 'anyVal', 'fixedList', 'token');
        pushToLegalGet('sub', 'anyGet', 'anyVal', 'fixedList', 'stats');

        pushToLegalGet('article', 'anyGet', 'anyVal', 'fixedList', 'about');
        pushToLegalGet('article', 'anyGet', 'anyVal', 'fixedList', 'cookies');
        */

/*
        global $dbClass;
        $myQuery = "SELECT MAX(cf_item_id)
                    FROM tb_item_list;";
        $max_result_array = $dbClass->select($myQuery);
        $max_item_id = $max_result_array[0]['cf_item_id'];
        echo $max_item_id;
*/
        pushToLegalGet('game', 'component', 'editor', 'anyVal', '');
        pushToLegalGet('game', 'component', 'counter_pick', 'anyVal', '');
        pushToLegalGet('update', 'component', 'master', 'fixedList', 'all');
        //pushToLegalGet('id', 'component', 'guidebook', 'maxInt', 3000);
        pushToLegalGet('email', 'component', 'registration', 'anyVal', ''); //store express checkout - from email link
        pushToLegalGet('token', 'component', 'registration', 'anyVal', ''); //store express checkout - from email link
        pushToLegalGet('e_id', 'component', 'password_reset', 'anyVal', '');
        pushToLegalGet('token', 'component', 'password_reset', 'anyVal', '');
        pushToLegalGet('user', 'component', 'password_reset', 'anyVal', '');
        pushToLegalGet('user', 'component', 'unsubscribe', 'anyVal', '');
        pushToLegalGet('token', 'component', 'unsubscribe', 'anyVal', '');
        pushToLegalGet('e_id', 'component', 'unsubscribe', 'anyVal', '');
        pushToLegalGet('user', 'component', 'email_confirm', 'anyVal', '');
        pushToLegalGet('token', 'component', 'email_confirm', 'anyVal', '');
        pushToLegalGet('s', 'component', 'store', 'anyVal', '');
        pushToLegalGet('tx', 'component', 'store', 'anyVal', '');


        $isChanged = FALSE;
        if ($redirectWithNewGetParams)
        {
            $currentGET = $redirectWithNewGetParams;
        } else {
            $currentGET = $_GET;
        }
        $currentGETCopy = $currentGET;
        $currentGETCopy2 = $currentGET;
        $legalGETCopy = $legalGET;


        //проходим по всем ключам из ГЕТ запроса
        foreach($currentGETCopy as $curKey => $curVal)
        {
            $isLegalKey = FALSE;
            //проходим по всем легальным ГЕТ ключам
            foreach($legalGET as $mainKey => $mainVal)
            {
                //если cur ключ из гета есть в легальных ключах
                if ($curKey == $mainKey)
                {
                    //проверяем не свободный ли ключ
                    if (count($legalGET[$mainKey]) > 0)
                    {
                        $isPassedToStep2 = FALSE;
                        $isPassedToStep3 = FALSE;
                        //получаем must have ГЕТ ключ (обязательный родитель)
                        foreach ($legalGET[$mainKey] as $mustHaveGetKey => $mustHaveGetVal)
                        {
                            //Если must have ГЕТ ключ указан как "любой"
                            if ($mustHaveGetKey == 'anyGet')
                            {
                                //продолжаем проверку
                                $isPassedToStep2 = TRUE;
                            } else {
                                //проверяем есть ли сейчас в ГЕТе must have ключ
                                foreach($currentGETCopy2 as $currentGETCopy2curKey => $currentGETCopy2curVal)
                                {
                                    //если есть...
                                    if ( $currentGETCopy2curKey == $mustHaveGetKey)
                                    {
                                        //...то продолжаем проверку
                                        $isPassedToStep2 = TRUE;
                                        break;
                                    }
                                }
                            }

                            if ($isPassedToStep2)
                            {
                                foreach($legalGET[$mainKey][$mustHaveGetKey] as $mustHaveGetValueKey => $mustHaveGetValueVal)
                                {
                                    //Если must have ГЕТ значение "anyVal"
                                    if ($mustHaveGetValueKey == 'anyVal')
                                    {
                                        //продолжаем проверку
                                        $isPassedToStep3 = TRUE;
                                        break;
                                    } else {
                                        if ($mustHaveGetValueKey == $currentGETCopy2curVal)
                                        {
                                            $isPassedToStep3 = TRUE;
                                            break;
                                        }
                                    }
                                }
                            }

                            if ($isPassedToStep3)
                            {
                                //next step
                                if (isset($legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['maxInt']))
                                {
                                    $maxInteger = $legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['maxInt'];

                                    if ((preg_replace('/\D/', '', $curVal) === $curVal) and (intval($curVal) > 0) and (intval($curVal) <= $maxInteger))
                                    {
                                        $isLegalKey = TRUE;
                                    }
                                } else if (isset($legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['fixedList']))
                                {
                                    for ($i=0;$i < count($legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['fixedList']); $i++)
                                    {
                                        if ($curVal == $legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['fixedList'][$i])
                                        {
                                            $isLegalKey = TRUE;
                                            break;
                                        }
                                    }
                                } else if (isset($legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['fixedLength']))
                                {
                                    $allowedLength = $legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['fixedLength'];
                                    if (strlen($curVal) == $allowedLength)
                                    {
                                        $isLegalKey = TRUE;
                                    }
                                } else if (isset($legalGET[$mainKey][$mustHaveGetKey][$mustHaveGetValueKey]['anyVal']))
                                {
                                    $isLegalKey = TRUE;
                                }
                            }
                        }
                    } else {
                        //ключ легальный и свободный
                        $isLegalKey = TRUE;
                        break;
                    }
                }
            }
            if (!$isLegalKey)
            {
                $isChanged = TRUE;
                unset($currentGET[$curKey]);
            }
        }


        if ($isChanged)
        {
            $redirectWithNewGetParams = $currentGET;
        }
    }
    //........................... END LEGAL GET REQUEST ...........................


    // Ignore Cache Level
    if (isset($_GET['ic']))
    {
        if (($_GET['ic'] < 1) and ($_GET['ic'] !== 0))
        {
            if (!$redirectWithNewGetParams)
            {
                $redirectWithNewGetParams = $_GET;
            }
            $redirectWithNewGetParams['ic'] = 1;
        } else if ($_GET['ic'] > 5)
        {
            if (!$redirectWithNewGetParams)
            {
                $redirectWithNewGetParams = $_GET;
            }
            $redirectWithNewGetParams['ic'] = 5;
        }
    }

    // remove im
    if (isset($_GET['im']) and (!isLocalhost()))
    {
        //prepare for a one shot redirect
        if (!$redirectWithNewGetParams)
        {
            $redirectWithNewGetParams = $_GET;
        }
        unset($redirectWithNewGetParams['im']);
    }

    // remove www.
    if (strtolower($_SERVER["HTTP_HOST"]) == 'www.pickbooster.com')
    {
        if (!$redirectWithNewGetParams)
        {
            $redirectWithNewGetParams = $_GET;
        }
        $httpHost = 'pickbooster.com';
    }

    // http or https
    if (
       (($httpOrHttps == 'http') and (!isLocalhost())) //if http and not local
    or (($httpOrHttps == 'https') and (isLocalhost())) //if https and local
       )
    {
        //changing vice versa (http <> https)
        if ($httpOrHttps == 'http')
        {
            $httpOrHttps = 'https';
        } else {
            $httpOrHttps = 'http';
        }

        if (!$redirectWithNewGetParams)
        {
            $redirectWithNewGetParams = $_GET;
        }
    }


    // `````````````` BEGIN GET ordering
    if (!$redirectWithNewGetParams)
    {
        $redirectWithNewGetParams = $_GET;
    }
    // sort array by key
    ksort($redirectWithNewGetParams);
    // make first - priority from Right to Left
    foreach (['city','country','subgroup', 'group', 'sub', 'component', 'article', 'ver', 'lang'] as $getParamKey)
    {
        if (array_key_exists($getParamKey, $redirectWithNewGetParams))
        {
            eXoArrayMoveKeyToFirst($redirectWithNewGetParams, $getParamKey);
        }
    }
    // make last - priority from Left to Right
    foreach (['ref', 'im', 'ic'] as $getParamKey)
    {
        if (array_key_exists($getParamKey, $redirectWithNewGetParams))
        {
            eXoArrayMoveKeyToLast($redirectWithNewGetParams, $getParamKey);
        }
    }
    if ($_GET === $redirectWithNewGetParams)
    {
        $redirectWithNewGetParams = false;
    }
                    function eXoArrayMoveKeyToFirst(&$array, $key) {
                        $temp = array($key => $array[$key]);
                        unset($array[$key]);
                        $array = $temp + $array;
                    }

                    function eXoArrayMoveKeyToLast(&$array, $key)
                    {
                        $value = $array[$key];
                        unset($array[$key]);
                        $array[$key] = $value;
                    }
    // .............. END GET ordering


    if ($redirectWithNewGetParams) {
        //Redirect only if it is '/index.php' (dont redirect on ajax requests)
        if (strtolower($_SERVER['SCRIPT_NAME']) == '/index.php')
        {
            if (!isset($httpHost))
            {
                $httpHost = $_SERVER['HTTP_HOST'];
            }

            header("Location: ".$httpOrHttps."://".$httpHost.$_SERVER['SCRIPT_NAME'].'?'.http_build_query($redirectWithNewGetParams));
            exit;
        }
    }
    unset($redirectWithNewGetParams);

//=====================================================================================
//=====================================================================================
//=====================================================================================
//================================= END REDIRECT ======================================
//=====================================================================================
//=====================================================================================
//=====================================================================================

// placeholder for redirect logic

$_SESSION["SAccessRoles"] = _ROLE_GUEST;

// temporary before normal login works:
$_SESSION["SAccessRoles"] = _ROLE_USER;
addAccessRole(_ROLE_EDITOR);
addAccessRole(_ROLE_MASTER);



    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // unlocking session for other user tabs, but now we need to call session_reopen() (fast, if sure)
    // or session_reopen_if_not_open() (slow, if not sure) every time we want to WRITE IN to the session,
    // and then call session_write_close() again to unlock
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    session_write_close();



    //Cache func's
    //require_once('cl.simpleCacheAndMemcache.php');














    //Check if session is curently started (muli PHP version)
    function isSessionStarted()
    {
        if ( php_sapi_name() !== 'cli' ) {
            if ( version_compare(phpversion(), '5.4.0', '>=') ) {
                return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
            } else {
                return session_id() === '' ? FALSE : TRUE;
            }
        } else {
            return FALSE;
        }
    }

    //Reopen previously closed session
    function session_reopen() {
        //ini_set('session.use_only_cookies', false);
        //ini_set('session.use_cookies', false);
        //ini_set('session.use_trans_sid', false); //May be necessary in some situations
        //ini_set('session.cache_limiter', null);
        ob_start();
        session_start(); //Reopen the (previously closed) session for writing.
        ob_end_clean();
    }

    function session_reopen_if_not_open()
    {
        $isReopened = false;
        if (!isSessionStarted())
        {
            session_reopen();
            $isReopened = true;
        }

        return $isReopened;
    }

    function isLocalhost() {
        if ((strtolower($_SERVER["HTTP_HOST"]) == 'localhost') or (substr($_SERVER["HTTP_HOST"], 0, 7) == '192.168') or (strtolower($_SERVER["HTTP_HOST"]) == 'pb'))
        {
            return TRUE;
        } else {
            return FALSE;
        }
    }



    //''''''' BEGIN GET $_SESSION KEY IF SET '''''''
    function getSessionKeyOrFalse( $sessionKey )
    {
        //Correct usage: getSessionKeyOrFalse('SUserNickName');
        //Wrong example: getSessionKeyOrFalse($_SESSION['SUserNickName']);
        if (isset($_SESSION[$sessionKey]))
        {
            return $_SESSION[$sessionKey];
        } else {
            return false;
        }
    }
//....... END GET $_SESSION KEY IF SET .........


//''''''' BEGIN GET $_GET KEY IF SET '''''''
    function getGetKeyOrFalse( $getKey )
    {
        $getKey = strtolower($getKey);
        //Correct usage: getGetKeyOrFalse('SUserNickName');
        //Wrong example: getGetKeyOrFalse($_GET['SUserNickName']);
        if (isset($_GET[$getKey]))
        {
            return $_GET[$getKey];
        } else {
            return false;
        }
    }
//....... END GET $_GET KEY IF SET .........


//''''''' BEGIN GET $_POST KEY IF SET '''''''
    function getPostKeyOrFalse( $postKey )
    {
        //Correct usage: getPostKeyOrFalse('SUserNickName');
        //Wrong example: getPostKeyOrFalse($_POST['SUserNickName']);
        if (isset($_POST[$postKey]))
        {
            return $_POST[$postKey];
        } else {
            return false;
        }
    }
//....... END GET #_POST KEY IF SET .........

//''''''' BEGIN GET $_COOKIE KEY IF SET '''''''
    function getCookieKeyOrFalse( $postKey )
    {
        //Correct usage: getCookieKeyOrFalse('SUserNickName');
        //Wrong example: getCookieKeyOrFalse($_COOKIE['SUserNickName']);
        if (isset($_COOKIE[$postKey]))
        {
            return $_COOKIE[$postKey];
        } else {
            return false;
        }
    }
//....... END GET #_COOKIE KEY IF SET .........

    function addGrantedRole($roleConstant)
    {
            if (!isGrantedAccess($roleConstant))
            {
                $isSessionReopenedUnique3 = session_reopen_if_not_open();

                    if ($_SESSION["SGrantedRoles"] != '')
                    {
                        $_SESSION["SGrantedRoles"] .= ' ';
                    }
                    $_SESSION["SGrantedRoles"] .= $roleConstant;

                if ($isSessionReopenedUnique3)
                {
                    session_write_close();
                }
                unset($isSessionReopenedUnique3);
            }
    }


    function isGrantedAccess($itemAccessRolesRow) {
        if (isAnyOfItemExistsInItemRow(strtolower((string)$_SESSION["SGrantedRoles"]), strtolower($itemAccessRolesRow)))
        {
            return TRUE;
        } else {
            return isAnyOfItemExistsInItemRow(strtolower((string)$_SESSION["SGrantedRoles"]), strtolower(_ROLE_FULL_ACCESS));
        }
    }

    function addAccessRole($roleConstant)
    {
        if (//(isGrantedAccess($roleConstant)) and
         (!isGotAccess($roleConstant)))
        {
            $isSessionReopenedUnique4 = session_reopen_if_not_open();

                if ($_SESSION["SAccessRoles"] != '')
                {
                    $_SESSION["SAccessRoles"] .= ' ';
                }
                $_SESSION["SAccessRoles"] .= $roleConstant;

            if ($isSessionReopenedUnique4)
            {
                session_write_close();
            }
            unset($isSessionReopenedUnique4);
        }
    }

    function isGotAccess($itemAccessRolesRow)
    {
        if (isset($_SESSION["SAccessRoles"]))
        {
            if (isAnyOfItemExistsInItemRow(strtolower((string)$_SESSION["SAccessRoles"]), strtolower($itemAccessRolesRow)))
            {
                return TRUE;
            } else {
                return isAnyOfItemExistsInItemRow(strtolower((string)$_SESSION["SAccessRoles"]), strtolower(_ROLE_FULL_ACCESS));
            }
        } else {
            return FALSE;
        }
    }


    function isAnyOfItemExistsInItemRow($rolesRow, $itemAccessRolesRow) {
        $rolesArray = explode(' ', (string)$rolesRow);
        $itemAccessRolesArray = explode(' ', (string)$itemAccessRolesRow);

        $isAccessFound = FALSE;
        for ($i=0;$i < count($rolesArray); $i++) {
            for ($j=0;$j < count($itemAccessRolesArray); $j++) {
                if ($rolesArray[$i] == $itemAccessRolesArray[$j]) {
                    $isAccessFound = TRUE;
                    break 2;
                }
            }
        }
        return $isAccessFound;
    }


?>