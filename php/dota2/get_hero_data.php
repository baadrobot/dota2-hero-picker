<?php
    //require_once('php/a_functions.php');

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
        $heroFullCodename = $hero_data_array[$i]['name'];
        $heroCodename = substr($heroFullCodename, strlen($heroKeyPrefix));

                                // getting some data from npc_heroes.txt
                                if ((isset($heroesFile[$heroFullCodename])) && (isset($heroesFile[$heroFullCodename]['NameAliases'])))
                                {
                                    $heroNameAliases = $heroesFile[$heroFullCodename]['NameAliases'];
                                } else {
                                    $heroNameAliases = '';
                                }

        // getting all other from OpenDota Heroes API
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


        //nuraxxx
        if (!isset($hero_data_array[$i]['1_pick']))
        {
            $pick_1 = 0;
        } else {
            $pick_1 = $hero_data_array[$i]['1_pick'];
        }
        if (!isset($hero_data_array[$i]['1_win']))
        {
            $win_1 = 0;
        } else {
            $win_1 = $hero_data_array[$i]['1_win'];
        }

        if (!isset($hero_data_array[$i]['2_pick']))
        {
            $pick_2 = 0;
        } else {
            $pick_2 = $hero_data_array[$i]['2_pick'];
        }
        if (!isset($hero_data_array[$i]['2_win']))
        {
            $win_2 = 0;
        } else {
            $win_2 = $hero_data_array[$i]['2_win'];
        }

        if (!isset($hero_data_array[$i]['3_pick']))
        {
            $pick_3 = 0;
        } else {
            $pick_3 = $hero_data_array[$i]['3_pick'];
        }
        if (!isset($hero_data_array[$i]['3_win']))
        {
            $win_3 = 0;
        } else {
            $win_3 = $hero_data_array[$i]['3_win'];
        }

        if (!isset($hero_data_array[$i]['4_pick']))
        {
            $pick_4 = 0;
        } else {
            $pick_4 = $hero_data_array[$i]['4_pick'];
        }
        if (!isset($hero_data_array[$i]['4_win']))
        {
            $win_4 = 0;
        } else {
            $win_4 = $hero_data_array[$i]['4_win'];
        }

        if (!isset($hero_data_array[$i]['5_pick']))
        {
            $pick_5 = 0;
        } else {
            $pick_5 = $hero_data_array[$i]['5_pick'];
        }
        if (!isset($hero_data_array[$i]['5_win']))
        {
            $win_5 = 0;
        } else {
            $win_5 = $hero_data_array[$i]['5_win'];
        }

        if (!isset($hero_data_array[$i]['6_pick']))
        {
            $pick_6 = 0;
        } else {
            $pick_6 = $hero_data_array[$i]['6_pick'];
        }
        if (!isset($hero_data_array[$i]['6_win']))
        {
            $win_6 = 0;
        } else {
            $win_6 = $hero_data_array[$i]['6_win'];
        }

        if (!isset($hero_data_array[$i]['7_pick']))
        {
            $pick_7 = 0;
        } else {
            $pick_7 = $hero_data_array[$i]['7_pick'];
        }
        if (!isset($hero_data_array[$i]['7_win']))
        {
            $win_7 = 0;
        } else {
            $win_7 = $hero_data_array[$i]['7_win'];
        }
        //eof nuraxxx

        if (!isset($hero_data_array[$i]['attack_type']))
        {
            $attack_type = NULL;
        } else if ($hero_data_array[$i]['attack_type'] == 'Melee') {
            $attack_type = 0;
        } else if ($hero_data_array[$i]['attack_type'] == 'Ranged') {
            $attack_type = 1;
        }

        $myQuery = 'INSERT INTO tb_dota2_hero_list
        (cf_d2HeroList_id,
        cf_d2HeroList_codename,
        cf_d2HeroList_name_en_US,
        cf_d2HeroList_name_aliases,
        cf_d2HeroList_primary_attr,
        cf_d2HeroList_attack_type,
        cf_d2HeroList_attack_range,
        cf_d2HeroList_img,
        cf_d2HeroList_icon,
        cf_d2HeroList_move_speed,
        cf_d2HeroList_cm_enabled,
        cf_d2HeroList_pro_ban,
        cf_d2HeroList_pro_pick,
        cf_d2HeroList_pro_win,
        cf_d2HeroList_1_pick,
        cf_d2HeroList_1_win,
        cf_d2HeroList_2_pick,
        cf_d2HeroList_2_win,
        cf_d2HeroList_3_pick,
        cf_d2HeroList_3_win,
        cf_d2HeroList_4_pick,
        cf_d2HeroList_4_win,
        cf_d2HeroList_5_pick,
        cf_d2HeroList_5_win,
        cf_d2HeroList_6_pick,
        cf_d2HeroList_6_win,
        cf_d2HeroList_7_pick,
        cf_d2HeroList_7_win)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
        cf_d2HeroList_codename = ?,
        cf_d2HeroList_name_en_US = ?,
        cf_d2HeroList_name_aliases = ?,
        cf_d2HeroList_primary_attr = ?,
        cf_d2HeroList_attack_type = ?,
        cf_d2HeroList_attack_range = ?,
        cf_d2HeroList_img = ?,
        cf_d2HeroList_icon = ?,
        cf_d2HeroList_move_speed = ?,
        cf_d2HeroList_cm_enabled = ?,
        cf_d2HeroList_pro_ban = ?,
        cf_d2HeroList_pro_pick = ?,
        cf_d2HeroList_pro_win = ?,
        cf_d2HeroList_1_pick = ?,
        cf_d2HeroList_1_win = ?,
        cf_d2HeroList_2_pick = ?,
        cf_d2HeroList_2_win = ?,
        cf_d2HeroList_3_pick = ?,
        cf_d2HeroList_3_win = ?,
        cf_d2HeroList_4_pick = ?,
        cf_d2HeroList_4_win = ?,
        cf_d2HeroList_5_pick = ?,
        cf_d2HeroList_5_win = ?,
        cf_d2HeroList_6_pick = ?,
        cf_d2HeroList_6_win = ?,
        cf_d2HeroList_7_pick = ?,
        cf_d2HeroList_7_win = ?
        ;';



        $result = $dbClass->insert($myQuery,
            $hero_data_array[$i]['id'],
            $heroCodename,
            $hero_data_array[$i]['localized_name'],
            $heroNameAliases,
            $primary_attr,
            $attack_type,
            $hero_data_array[$i]['attack_range'],
            $hero_data_array[$i]['img'],
            $hero_data_array[$i]['icon'],
            $hero_data_array[$i]['move_speed'],
            $hero_data_array[$i]['cm_enabled'],
            $pro_ban,
            $pro_pick,
            $pro_win,
            $pick_1,
            $win_1,
            $pick_2,
            $win_2,
            $pick_3,
            $win_3,
            $pick_4,
            $win_4,
            $pick_5,
            $win_5,
            $pick_6,
            $win_6,
            $pick_7,
            $win_7,
            // on update
            $heroCodename,
            $hero_data_array[$i]['localized_name'],
            $heroNameAliases,
            $primary_attr,
            $attack_type,
            $hero_data_array[$i]['attack_range'],
            $hero_data_array[$i]['img'],
            $hero_data_array[$i]['icon'],
            $hero_data_array[$i]['move_speed'],
            $hero_data_array[$i]['cm_enabled'],
            $pro_ban,
            $pro_pick,
            $pro_win,
            $pick_1,
            $win_1,
            $pick_2,
            $win_2,
            $pick_3,
            $win_3,
            $pick_4,
            $win_4,
            $pick_5,
            $win_5,
            $pick_6,
            $win_6,
            $pick_7,
            $win_7
        );

        if ($result)
        {
            //echo $heroCodename.' successfully updated<br/>';
        } else {
            //echo 'NO!!!!! '.$heroCodename.'<br />';
        }
    }

// ****************** download and save hero_abilities_en_US.json

    // alternative url (same data): "https://www.dota2.com/jsfeed/abilitydata?language=en";

    // kainax: no need in this as we are now loading external .js files directly from the web
    /*
    downloadDotaJsFeedFile('hero_abilities_en_US.json', 'english', "https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=");
    downloadDotaJsFeedFile('hero_abilities_ru_RU.json', 'russian', "https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=");

    function downloadDotaJsFeedFile($filename, $languageFull, $url)
    {
        $url = $url.$languageFull;
        $fp = fopen(__DIR__.'/data/'.$filename, "w");

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FILE, $fp);

        curl_setopt($ch,  CURLOPT_RETURNTRANSFER, TRUE);

        curl_exec($ch);

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ( $httpCode == 404 )
        {
            echo '<br>File "'.$url.'" not found! Code 404.<br>';
            curl_close($ch);
            fclose($fp);
            //exit;
        } else {
            $contents = curl_exec($ch);
            fwrite($fp, $contents);
            curl_close($ch);
            fclose($fp);
        }
    }
    */
?>