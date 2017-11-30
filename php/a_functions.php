<?php
require_once('a_essentials.php');


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//***********************************************************************//
//All next MUST be AFTER a_essentials.php execution (language set, redirection, isGotAccess(), cache functions)
//***********************************************************************//
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

require_once('cl.simpleDB.php');
require_once('cl.simpleMysqli.php');

$myDBparams = array(
    'server' => 'exo-aurora.cluster-cq1yecztnnih.us-east-1.rds.amazonaws.com', // <- DB endpoint
    'username' => 'root-aurora',
    'password' => 'Rooter0',
    'db' => 'dbpickbooster',
    'port' => 3306,
    'charset' => 'utf8'
);


global $dbClass;
$dbClass = new simpleMysqli($myDBparams);

    
function getHtmlObjFromUrl($url)
{
    require_once('php/cl.simpleHTMLDom.php');
    //******** Getting https elements

    //Указываем URL, куда будем обращаться. Протокол https://
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    //$fp = fopen("example_homepage.txt", "w");
    //curl_setopt($ch, CURLOPT_FILE, $fp);
    $curl_data = curl_exec($ch);
    curl_close($ch);
    //fclose($fp);

    //******** Seperating dom elements

    $html = new simple_html_dom();
    // Load from a string
    $html->load($curl_data);
    unset($curl_data);

    return $html;
}

?>