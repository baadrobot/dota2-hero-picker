<?php
    require_once('../a_functions.php');

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.opendota.com/api/heroStats");
    curl_setopt($ch, CURLOPT_HEADER, 0);
    // true - return the response, false - echo the response    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $hero_data_array = json_decode(curl_exec($ch), true);
    curl_close($ch);

    //echo "<pre>",print_r($hero_data_array),"</pre>";


    global $dbClass;    

    for ($i=0; $i < count($hero_data_array); $i++)
    {
        if ($hero_data_array[$i]['primary_attr'] == 'str')
        {
            $primary_attr = 1;
        } else 
        if ($hero_data_array[$i]['primary_attr'] == 'agi')
        {
            $primary_attr = 2;
        } else 
        if ($hero_data_array[$i]['primary_attr'] == 'int')
        {
            $primary_attr = 3;
        }

        if (!isset($hero_data_array[$i]['pro_ban']))
        {
            $pro_ban = 0;
        } else {
            $pro_ban = $hero_data_array[$i]['pro_ban'];
        }

        if (!isset($hero_data_array[$i]['pro_pick']))
        {
            $pro_pick = 0;
        } else {
            $pro_pick = $hero_data_array[$i]['pro_pick'];
        }

        if (!isset($hero_data_array[$i]['pro_win']))
        {
            $pro_win = 0;
        } else {
            $pro_win = $hero_data_array[$i]['pro_win'];
        }
        
        $codename = substr($hero_data_array[$i]['name'], 14);

        $myQuery = 'INSERT INTO tb_dota2_hero_list 
        (cf_d2HeroList_id,
        cf_d2HeroList_codename,
        cf_d2HeroList_name_en_US,
        cf_d2HeroList_primary_attr,
        cf_d2HeroList_attack_type,
        cf_d2HeroList_attack_range,'.
        // cf_d2HeroList_role_support,
        // cf_d2HeroList_role_carry,
        // cf_d2HeroList_role_escape,
        // cf_d2HeroList_role_initiator,
        // cf_d2HeroList_role_nuker,
        // cf_d2HeroList_role_disabler,
        // cf_d2HeroList_role_jungler,
        // cf_d2HeroList_role_durable,
        // cf_d2HeroList_role_pusher,
        'cf_d2HeroList_img,
        cf_d2HeroList_icon,
        cf_d2HeroList_move_speed,
        cf_d2HeroList_cm_enabled,
        cf_d2HeroList_pro_ban,
        cf_d2HeroList_pro_pick,
        cf_d2HeroList_pro_win,
        cf_d2HeroList_1000_pick,
        cf_d2HeroList_1000_win,
        cf_d2HeroList_2000_pick,
        cf_d2HeroList_2000_win,
        cf_d2HeroList_3000_pick,
        cf_d2HeroList_3000_win,
        cf_d2HeroList_4000_pick,
        cf_d2HeroList_4000_win,
        cf_d2HeroList_5000_pick,
        cf_d2HeroList_5000_win)
        VALUES (?,?,?,?,?,?,'.
        //?,?,?,?,?,?,?,?,?,
        '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';



        $result = $dbClass->insert($myQuery,
            $hero_data_array[$i]['id'],    
            $codename,
            $hero_data_array[$i]['localized_name'],
            $primary_attr,
            $hero_data_array[$i]['attack_type'],
            $hero_data_array[$i]['attack_range'],    
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            // $hero_data_array[$i]['localized_name'],
            $hero_data_array[$i]['img'],
            $hero_data_array[$i]['icon'],
            $hero_data_array[$i]['move_speed'],
            $hero_data_array[$i]['cm_enabled'],
            $pro_ban,
            $pro_pick,    
            $pro_win,
            $hero_data_array[$i]['1000_pick'],
            $hero_data_array[$i]['1000_win'],
            $hero_data_array[$i]['2000_pick'],
            $hero_data_array[$i]['2000_win'],    
            $hero_data_array[$i]['3000_pick'],
            $hero_data_array[$i]['3000_win'],
            $hero_data_array[$i]['4000_pick'],
            $hero_data_array[$i]['4000_win'],
            $hero_data_array[$i]['5000_pick'],    
            $hero_data_array[$i]['5000_win']                                                
        );
        
        if ($result)
        {
            echo 'OK '.$codename.'<br />';
        } else {
            echo 'NO!!!!! '.$codename.'<br />';
        }
    }
?>