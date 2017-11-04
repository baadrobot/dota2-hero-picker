<?php

    if (isset($_GET['ping']))
    {
        echo 'pong';
        exit;
    }


    //$startTime = microtime(true);
        
    //Must be required first! cos of start_session()
    require_once('php/a_essentials.php');



    //phpinfo();

    // require_once('php/a_functions.php');




    require_once('php/a_functions.php');

	//Adding Main header with logo, menu, social-buttons preloading
	require_once('php/index_header.php');
    
 
        // if ((!isset($_GET["component"])) and (!isset($_GET["article"])))
        // {
        //     require_once "php/module_showcase.php";
        //     //require_once "php/index_showcase.php";
        // }
    
    //Adding Main Body (LeftMenus & GET article=, component=)
    require_once('php/index_mainbody.php');

    //Adding Main Footer
    require_once('php/index_footer.php');
?>