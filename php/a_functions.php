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

    

?>