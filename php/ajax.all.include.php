<?php
    // json header
    header('Content-type: application/json');

    if (!isset($_POST['ajaxType']))
    {
        // no ajaxType in request
        echo json_encode(array( 'php_result'=>'ERROR',
                                'php_error_msg'=>'Access error! Error #7293S-C73MD9-XKD73J-87CJ3F!'
                              ));
        exit();
    }

    // ignore user's try to abort ajax script by canceling page load or closing the browser
    ignore_user_abort(TRUE);

    require_once('a_functions.php');

    global $dbClass;

    if (isset($_POST['ajaxLvlIc']))
    {
        global $_ajaxLvlIc;
        $_ajaxLvlIc = $_POST['ajaxLvlIc'];
    }

    if (isset($_POST['ajaxLvlIcd']))
    {
        global $_ajaxLvlIcd;
        $_ajaxLvlIcd = $_POST['ajaxLvlIcd'];
    }
    
    function ajaxReturnAndExit($returnArray)
    {
        echo json_encode($returnArray);
        exit();        
    }
?>