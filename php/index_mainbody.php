<?php
    if (isset($_GET['component']))
    {
        if  (($_GET['component'] == 'editor') && isGotAccess(_ROLE_EDITOR))
        {
            require('php/component_editor.php');
        }
        else if (($_GET['component'] == 'master') && isGotAccess(_ROLE_MASTER))
        {
            require('php/dota2/get_hero_abilities_data.php');
        }
        else if ($_GET['component'] == 'user_profile')
        {
            require('php/component_user_profile.php');
        }
        else if ($_GET['component'] == 'registration')
        {
            require('php/component_registration.php');
        }
        else if ($_GET['component'] == 'counter_pick')
        {
            require('php/component_counter_pick.php');
        }
    } else {
        require('php/home.php');
    }
?>