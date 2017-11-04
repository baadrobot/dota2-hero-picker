<?php
    if (isset($_GET['component']))
    {
        if  ($_GET['component'] == 'editor')
        {
            require('php/component_editor.php');
        }
        else if ($_GET['component'] == 'economic_globe')
        {
    
        }
        else if ($_GET['component'] == 'registration')
        {
    
        }            
    } else {
        include('php/home.php');
    }
?>