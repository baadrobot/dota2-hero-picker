<?php
    require_once('../a_functions.php');

    if (isLocalhost())
    {
        // ****************** download and save hero_abilities_en_US.json

        $fp = fopen(__DIR__."/data/hero_abilities_en_US.json", "w");
        
        //$url = "https://www.dota2.com/jsfeed/abilitydata?language=en";
        $url = "https://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=english";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FILE, $fp);

        curl_setopt($ch,  CURLOPT_RETURNTRANSFER, TRUE);

        curl_exec($ch);

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ( $httpCode == 404 )
        {
            echo 'File "'.$url.'"not found! Code 404. Exiting.';
            curl_close($ch);
            fclose($fp);
            exit;
        } else {
            $contents = curl_exec($ch);
            fwrite($fp, $contents);
            curl_close($ch);
            fclose($fp);        
        }



        // ****************** read hero info

        $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
        $heroes = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);

        $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_abilities.txt';        
        $abilities = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);

        //echo '<pre>',print_r($abilities),'</pre>';

            $allParameterNamesOnce = [];
            foreach ($abilities as $key => $value)
            {
                foreach ($abilities[$key] as $key2 => $val2)
                {
                    $allParameterNamesOnce[$key2] = 1;
                }

            }
            
            echo '<pre>',print_r($allParameterNamesOnce),'</pre>';
            echo '<br>------------------------------------------------------------------------------<br>';


            
            $allParameterNamesOnce = [];
            foreach ($abilities as $key => $value)
            {
                if (isset($abilities[$key]['AbilityBehavior']))
                {
                    $tempArray = explode(' | ', $abilities[$key]['AbilityBehavior']);
                    
                    foreach ($tempArray as $key2 => $val2)
                    {
                        if (substr($val2, 0, 2) == '| ')
                        {
                            $allParameterNamesOnce[substr($val2, 2)] = 1;
                        } else {
                            $allParameterNamesOnce[$val2] = 1;                            
                        }
                    }                    
                }
            }

            ksort($allParameterNamesOnce);
            echo '<pre>',print_r($allParameterNamesOnce),'</pre>';
            echo '<br>------------------------------------------------------------------------------<br>';
            
            //exit;


        $heroKeyPrefix = 'npc_dota_hero_';

        $configIssueResolver = [];
        $configIssueResolver['ignore'] = [];
        $configIssueResolver['add'] = [];
        $configIssueResolver['ignore'][$heroKeyPrefix.'monkey_king|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'monkey_king|Ability7'] = 1;
        $configIssueResolver['add'][$heroKeyPrefix.'monkey_king|Ability8'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'naga_siren|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'nyx_assassin|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'wisp|Ability2'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'wisp|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'wisp|Ability6'] = 1;
        $configIssueResolver['add'][$heroKeyPrefix.'wisp|Ability7'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'bane|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'kunkka|Ability6'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'templar_assassin|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'life_stealer|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'ancient_apparition|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'alchemist|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'shadow_demon|Ability4'] = 1;
        $configIssueResolver['add'][$heroKeyPrefix.'rubick|Ability7'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'troll_warlord|Ability2'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'shredder|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'tusk|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'elder_titan|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'phoenix|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'phoenix|Ability6'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'techies|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'abyssal_underlord|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'spectre|Ability4'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'lone_druid|Ability6'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'rubick|Ability5'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'rubick|Ability6'] = 1;
        $configIssueResolver['ignore'][$heroKeyPrefix.'ember_spirit|Ability4'] = 1;

        
        
        
        

        function getHeroAbilityNameIfLegal($heroes, $key, $abilityIndex, $configIssueResolver)
        {
            if (isset($heroes[$key]['Ability'.$abilityIndex]))
            {
                if (($abilityIndex <= 6) && (!isset($configIssueResolver['ignore'][$key.'|Ability'.$abilityIndex])))
                {
                    return $heroes[$key]['Ability'.$abilityIndex];
                } else if (($abilityIndex > 6) && (isset($configIssueResolver['add'][$key.'|Ability'.$abilityIndex])))
                {
                    return $heroes[$key]['Ability'.$abilityIndex];
                } else {
                    return false;
                }
            } else
            {
                return false;
            }
        }

        

        global $dbClass;

        foreach ($heroes as $key => $value)
        {
            if ((substr($key, 0, strlen($heroKeyPrefix)) == $heroKeyPrefix) && ($key != $heroKeyPrefix.'target_dummy' ))
            {
                $heroName = substr($key, strlen($heroKeyPrefix));
                echo $heroName.'<br>';
                echo '<img src="//cdn.dota2.com/apps/dota2/images/heroes/'.$heroName.'_vert.jpg?v=4195662">';
                echo '<br>';
                $heroId = $heroes[$key]['HeroID'];
                $heroRole = $heroes[$key]['Role'];

                $heroRolelevels = $heroes[$key]['Rolelevels'];
                $heroComplexity = $heroes[$key]['Complexity'];
                $heroCMEnabled = $heroes[$key]['CMEnabled'];

                if (isset($heroes[$key]['NameAliases']))
                {
                    $heroNameAliases = $heroes[$key]['NameAliases'];
                } else {
                    $heroNameAliases = '';
                }

                $abilityOrderPosition = -1;
                for ($i = 1; $i <= 10; $i++)
                {
                    $abilityFullName = getHeroAbilityNameIfLegal($heroes, $key, $abilityIndex = $i, $configIssueResolver);
                    if ($abilityFullName !== false)
                    {
                        if (isset($abilities[$abilityFullName]) && (isset($abilities[$abilityFullName]['ID'])))
                        {
                            $abilityId = $abilities[$abilityFullName]['ID'];
                        } else {
                            continue;
                        }
                        $abilityOrderPosition++;
                        echo '<img title="Ability'.$i.': '.$abilityFullName.'" src="//cdn.dota2.com/apps/dota2/images/abilities/'.$abilityFullName.'_hp1.png?v=4195662">';
                        
                        if (isset($abilities[$abilityFullName]['AbilityManaCost']))
                        {
                            $abilityManaCost = $abilities[$abilityFullName]['AbilityManaCost'];
                        } else {
                            $abilityManaCost = '0';
                        }

                        if (isset($abilities[$abilityFullName]['AbilityCooldown']))
                        {
                            $abilityCooldown = $abilities[$abilityFullName]['AbilityCooldown'];
                        } else {
                            $abilityCooldown = '0';
                        }
                        
                        if (isset($abilities[$abilityFullName]['AbilityCastPoint']))
                        {
                            $abilityCastPoint = $abilities[$abilityFullName]['AbilityCastPoint'];
                        } else {
                            $abilityCastPoint = '0';
                        }
                        
                        if (isset($abilities[$abilityFullName]['AbilityCastRange']))
                        {
                            $abilityCastRange = $abilities[$abilityFullName]['AbilityCastRange'];
                        } else {
                            $abilityCastRange = '0';
                        }
                        
                        if (isset($abilities[$abilityFullName]['AbilityUnitDamageType']))
                        {
                            $abilityUnitDamageType = $abilities[$abilityFullName]['AbilityUnitDamageType'];
                        } else {
                            $abilityUnitDamageType = null;
                        }
                        
                        if (isset($abilities[$abilityFullName]['SpellDispellableType']))
                        {
                            $spellDispellableType = $abilities[$abilityFullName]['SpellDispellableType'];
                        } else {
                            $spellDispellableType = null;
                        }
                        
                        if (isset($abilities[$abilityFullName]['HasScepterUpgrade']))
                        {
                            $hasScepterUpgrade = $abilities[$abilityFullName]['HasScepterUpgrade'];
                        } else {
                            $hasScepterUpgrade = false;
                        }

                        if (isset($abilities[$abilityFullName]['IsGrantedByScepter']))
                        {
                            $isGrantedByScepter = $abilities[$abilityFullName]['IsGrantedByScepter'];
                        } else {
                            $isGrantedByScepter = false;
                        }

                        // NuryVampir 
                        if (isset($abilities[$abilityFullName]['AbilityType']))
                        {
                            $abilityType = $abilities[$abilityFullName]['AbilityType'];
                        } else {
                            $abilityType = 'DOTA_ABILITY_TYPE_BASIC';
                        }

                        if (isset($abilities[$abilityFullName]['AbilityBehavior']))
                        {
                            $abilityBehavior = $abilities[$abilityFullName]['AbilityBehavior'];
                        } else {
                            //  $abilityBehavior = 'DOTA_ABILITY_BEHAVIOR_NONE';
                            $abilityBehavior = null;
                        }

                        if (isset($abilities[$abilityFullName]['AbilityDuration']))
                        {
                            $abilityDuration = $abilities[$abilityFullName]['AbilityDuration'];
                        } else {
                            $abilityDuration = '0';
                        }

                        if (isset($abilities[$abilityFullName]['AbilityDamage']))
                        {
                            $abilityDamage = $abilities[$abilityFullName]['AbilityDamage'];
                            if ($abilityDamage == '0 0 0 0')
                            {
                                $abilityDamage = '0';
                            }
                        } else {
                            $abilityDamage = '0';
                        }

                        if (isset($abilities[$abilityFullName]['AbilityModifierSupportValue']))
                        {
                            $abilityModifierSupportValue = $abilities[$abilityFullName]['AbilityModifierSupportValue'];
                        } else {
                            $abilityModifierSupportValue = '1.0';
                        }

                        if (isset($abilities[$abilityFullName]['AbilityModifierSupportBonus']))
                        {
                            $abilityModifierSupportBonus = $abilities[$abilityFullName]['AbilityModifierSupportBonus'];
                        } else {
                            $abilityModifierSupportBonus = '0';
                        }

                        if (isset($abilities[$abilityFullName]['AbilityUnitTargetTeam']))
                        {
                            $abilityUnitTargetTeam = $abilities[$abilityFullName]['AbilityUnitTargetTeam'];
                        } else {
                            $abilityUnitTargetTeam = null;
                        }

                        if (isset($abilities[$abilityFullName]['SpellImmunityType']))
                        {
                            $spellImmunityType = $abilities[$abilityFullName]['SpellImmunityType'];
                        } else {
                            $spellImmunityType = null;
                        }

                        if (isset($abilities[$abilityFullName]['AbilityUnitTargetType']))
                        {
                            $abilityUnitTargetType = $abilities[$abilityFullName]['AbilityUnitTargetType'];
                        } else {
                            $abilityUnitTargetType = null;
                        }

                        if (isset($abilities[$abilityFullName]['AbilityUnitTargetFlags']))
                        {
                            $abilityUnitTargetFlags = $abilities[$abilityFullName]['AbilityUnitTargetFlags'];
                        } else {
                            $abilityUnitTargetFlags = null;
                        }

                       
                        // AbilityType //ultimate etc
                        // AbilityBehavior // passive, channeling, DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES" etc
                        // AbilityDuration
                        // AbilityDamage
                        // AbilityModifierSupportValue // for stats tracking (возможно поможет считать сколько звезд добавить герою в графе "сапорт"
                        // AbilityModifierSupportBonus // for stats tracking
                        // AbilityUnitTargetTeam // не уверен нужно ли (не нашел значения по умолчанию возможно это оно - DOTA_UNIT_TARGET_TEAM_ENEMY)
                        // SpellImmunityType // походу везде YES или NO, но базового значения не нашел
                        // AbilityUnitTargetType // not sure if needed
                        // AbilityUnitTargetFlags // looks like important thing (no basic value)
                        // AbilityUnitTargetFlag // need to find difference btwn this and previous one
                        

                        $query = 'INSERT INTO tb_dota2_hero_ability_list SET 
                            cf_d2HeroAbilityList_id = ?
                            ,cf_d2HeroAbilityList_heroId = ?
                            -- ,cf_d2HeroAbilityList_abilityId = ?
                            ,cf_d2HeroAbilityList_abilityCodename = ?
                            ,cf_d2HeroAbilityList_abilityManaCost = ?
                            ,cf_d2HeroAbilityList_abilityCooldown = ?
                            ,cf_d2HeroAbilityList_abilityCastPoint = ?
                            ,cf_d2HeroAbilityList_abilityCastRange = ?
                            ,cf_d2HeroAbilityList_damageType = ?
                            ,cf_d2HeroAbilityList_spellDispellableType = ?
                            ,cf_d2HeroAbilityList_hasScepterUpgrade = ?
                            ,cf_d2HeroAbilityList_isGrantedByScepter = ?
                            -- NuryVampir
                            ,cf_d2HeroAbilityList_abilityType = ?
                            ,cf_d2HeroAbilityList_abilityBehavior = ?
                            ,cf_d2HeroAbilityList_abilityDuration = ?
                            ,cf_d2HeroAbilityList_abilityDamage = ?
                            ,cf_d2HeroAbilityList_abilityModifierSupportValue = ?
                            ,cf_d2HeroAbilityList_abilityModifierSupportBonus = ?
                            ,cf_d2HeroAbilityList_abilityUnitTargetTeam = ?
                            ,cf_d2HeroAbilityList_spellImmunityType = ?
                            ,cf_d2HeroAbilityList_abilityUnitTargetType = ?
                            ,cf_d2HeroAbilityList_abilityUnitTargetFlags = ?
                            ,cf_d2HeroAbilityList_orderPosition = ?
                            ;';
                        $isInsertOk = $dbClass->insert($query
                                                    ,$abilityId
                                                    ,$heroId
                                                    ,$abilityFullName
                                                    ,$abilityManaCost
                                                    ,$abilityCooldown
                                                    ,$abilityCastPoint
                                                    ,$abilityCastRange
                                                    ,$abilityUnitDamageType
                                                    ,$spellDispellableType
                                                    ,$hasScepterUpgrade
                                                    ,$isGrantedByScepter
                                                    //NuryVampir
                                                    ,$abilityType
                                                    ,$abilityBehavior
                                                    ,$abilityDuration
                                                    ,$abilityDamage
                                                    ,$abilityModifierSupportValue
                                                    ,$abilityModifierSupportBonus
                                                    ,$abilityUnitTargetTeam
                                                    ,$spellImmunityType
                                                    ,$abilityUnitTargetType
                                                    ,$abilityUnitTargetFlags
                                                    ,$abilityOrderPosition
                        );
                    }
                }

                echo '<br>';
                echo '<br>';
            }
        }
        
        // -- read hero abilities data from Dota 2 game installation path
        // $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
        // echo '<pre>',print_r(getParamsFromDotaFile($heroAbilitiesDota2FilePathName)),'</pre>';
        exit;
    }

    function getParamsFromDotaFile($heroAbilitiesDota2FilePathName)
    {
        $templateAbility_NewKeyFirstLine = "\t\"";
        $templateAbility_ParameterPrefix = "\t\t\"";
        $templateAbility_NewKeyLastLine = "\t}";

        $heroAbilities = [];

        // -- copy to ./php/dota2/data/same_name.txt
        $filePathName = __DIR__ . '/data/' . basename($heroAbilitiesDota2FilePathName);

        if (file_exists($heroAbilitiesDota2FilePathName))
        {
            copy( $heroAbilitiesDota2FilePathName,  $filePathName);
        } else {
            echo '<pre>Warning! File '.$heroAbilitiesDota2FilePathName.' not found! Please check Dota2 installation folder.</pre>';
            return false;
        }

        if (file_exists($filePathName))
        {
            if (!($myfile = fopen($filePathName, "r")))
            {
                echo '<pre>Warning! Error opening '.$filePathName.'! Please check Dota2 installation folder.</pre>';
                return false;
            } else {
                $result = [];
                // parse each line of text file
                while(!feof($myfile))
                {
                    $currentLine = fgets($myfile);

                    // if we found a position of a key
                    if ($templateAbility_NewKeyFirstLine == substr($currentLine, 0, strlen($templateAbility_NewKeyFirstLine)))
                    {
                        $quotePos1 = 1;
                        $quotePos2 = strpos($currentLine, '"', $quotePos1 + 1);
                        $key = substr($currentLine, $quotePos1 + 1, ($quotePos2 - $quotePos1 - 1));                                    
                        $result[$key] = [];

                        //echo '************* - '.$key.'<br>';

                        // start writing each ability data to ability array
                        //while((!feof($myfile)) && ($currentLine != $templateAbility_NewKeyLastLine))
                        while ((!(feof($myfile)))
                        && ($templateAbility_NewKeyLastLine != substr($currentLine, 0, strlen($templateAbility_NewKeyLastLine))))
                        {
                            $currentLine = fgets($myfile);

                            // if this is an ability parameter line
                            if ((substr($currentLine, 0, 3) == $templateAbility_ParameterPrefix)
                            && (substr_count($currentLine, '"') == 4))
                            {

                                // write ability parameter to abilities_array
                                $quotePos1 = 2;
                                $quotePos2 = strpos($currentLine, '"', $quotePos1 + 1);
                                $quotePos3 = strpos($currentLine, '"', $quotePos2 + 1);
                                $quotePos4 = strpos($currentLine, '"', $quotePos3 + 1);

                                $subKey = substr($currentLine, $quotePos1 + 1, ($quotePos2 - $quotePos1 - 1));
                                $subKeyValue = substr($currentLine, $quotePos3 + 1, ($quotePos4 - $quotePos3 - 1));

                                $result[$key][$subKey] = $subKeyValue;

                                //***********/
                                //echo $abilityParamKey . ":" . $abilityParamValue.'<br>';
                            }
                        }
                    }
                }
                
                return $result;
            }


            //echo '<br />';

            // close file read
            fclose($myfile);

        } else {
            echo '<pre>Warning! File '.$filePathName." did'nt copy properly! Please check php admin access.</pre>";
            return false;
        }
    }







//     function getParamsFromDotaFile($heroAbilitiesDota2FilePathName, $HeroListArray)
//     {            
//         $templateAbility_ParameterPrefix = "\t\t\"";
//         $templateAbility_NewAbilityLine = "\t}\r\n";

//         $heroAbilities = [];

//         // -- copy to ./php/dota2/data/same_name.txt
//         $filePathName = __DIR__ . '/data/' . basename($heroAbilitiesDota2FilePathName);

//         if (file_exists($heroAbilitiesDota2FilePathName))
//         {
//             copy( $heroAbilitiesDota2FilePathName,  $filePathName);
//         } else {
//             echo '<pre>Warning! File '.$heroAbilitiesDota2FilePathName.' not found! Please check Dota2 installation folder.</pre>';
//             return;
//         }

//         if (file_exists($filePathName))
//         {
//             if (!($myfile = fopen($filePathName, "r")))
//             {
//                 echo '<pre>Warning! Error opening '.$filePathName.'! Please check Dota2 installation folder.</pre>';
//                 return;
//             } else {
//                 // echo all file
//                 //echo fread($myfile, filesize($filePathName));

//                 for ($i = 0; $i < count($HeroListArray); $i++)
//                 {
//                     //$curSystemHeroName = 'keeper_of_the_light';
//                     $curSystemHeroName = $HeroListArray[$i]['key'];
                    
//                     $heroAbilities[$curSystemHeroName] = [];

//                     //$curSystemHeroName = 'phoenix';
//                     $curHeroAbilitiesArray = [];

//                     $curSystemHeroNamePrefix = '"'.$curSystemHeroName.'_';
//                     $curHeroNamePrefixLength = strlen($curSystemHeroNamePrefix);

//                     // parse each line of text file
//                     rewind($myfile);                                                
//                     while(!feof($myfile))
//                     {
//                         $currentLine = fgets($myfile);
//                         if ($curSystemHeroNamePrefix == substr($currentLine, 1, $curHeroNamePrefixLength))
//                         {
//                             $curFoundAbilityCode = substr($currentLine, 2, -3);
//                             if (($curFoundAbilityCode != $curSystemHeroName.'_empty1') && ($curFoundAbilityCode != $curSystemHeroName.'_empty2'))
//                             {
//                                 array_push($curHeroAbilitiesArray, $curFoundAbilityCode);
//                             }
//                         }
//                     }

//                     // creating bad (internal) abilities array
//                     $internalAbilities = [];
//                     for ($i2=count($curHeroAbilitiesArray)-1; $i2 >= 0; $i2--)
//                     {
//                         for ($j=count($curHeroAbilitiesArray)-1; $j >= 0; $j--)
//                         {
//                             if (($curHeroAbilitiesArray[$j] == $curHeroAbilitiesArray[$i2].'_stop')
//                             || ($curHeroAbilitiesArray[$j] == $curHeroAbilitiesArray[$i2].'_end'))
//                             {
//                                 array_push($internalAbilities, $curHeroAbilitiesArray[$j]);
//                             }
//                         }
//                     }

//                     // removing bad (internal) abilities from all current_hero abilities
//                     $curHeroAbilitiesArray = array_values(array_diff( $curHeroAbilitiesArray, $internalAbilities));





//                     // get data for each ability and record to associative array
//                     for ($i3 = 0; $i3 < count($curHeroAbilitiesArray); $i3++)
//                     {                            
//                         $currentAbility = $curHeroAbilitiesArray[$i3];

//                         rewind($myfile);
//                         $curAbilityTemplate = "\t".'"'.$currentAbility.'"'."\r\n";
                        
//                         //$curAbilityNameSymbolLengthIncludQuotes = strlen($curAbilityTemplate);

//                         // parse each line of text file
//                         while(!feof($myfile))
//                         {
//                             $currentLine = fgets($myfile);

//                             // if we found a position of an ability
//                             if ($currentLine == $curAbilityTemplate)
//                             {
//                                 //echo '************* - '.$currentAbility.'<br>';

//                                 // start writing each ability data to ability array
//                                 while((!feof($myfile)) && ($currentLine != $templateAbility_NewAbilityLine))
//                                 {
//                                     $currentLine = fgets($myfile);

//                                     // if this is an ability parameter line
//                                     if ((substr($currentLine, 0, 3) == $templateAbility_ParameterPrefix)
//                                     && (substr_count($currentLine, '"') == 4))
//                                     {

//                                         // write ability parameter to abilities_array
//                                         $quotePos1 = 2;
//                                         $quotePos2 = strpos($currentLine, '"', $quotePos1 + 1);
//                                         $quotePos3 = strpos($currentLine, '"', $quotePos2 + 1);
//                                         $quotePos4 = strpos($currentLine, '"', $quotePos3 + 1);

//                                         $abilityParamKey = substr($currentLine, $quotePos1 + 1, ($quotePos2 - $quotePos1 - 1));
//                                         $abilityParamValue = substr($currentLine, $quotePos3 + 1, ($quotePos4 - $quotePos3 - 1));

//                                         $heroAbilities[$curSystemHeroName][$currentAbility][$abilityParamKey] = $abilityParamValue;

//                                         //***********/
//                                         //echo $abilityParamKey . ":" . $abilityParamValue.'<br>';
//                                     }
//                                 }
//                                 break;
//                             }
//                         }   
//                     }
//                 }


//                 //echo '<br />';

//                 // close file read
//                 fclose($myfile);

//             }
//         } else {
//             echo '<pre>Warning! File '.$filePathName." did'nt copy properly! Please check php admin access.</pre>";
//             return;
//         }
//     }
// }


    exit('<br />done');    








/**********************************************************************/


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
        
        $system_name = substr($hero_data_array[$i]['name'], 14);

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
            $system_name,
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
            echo 'OK '.$system_name.'<br />';
        } else {
            echo 'NO!!!!! '.$system_name.'<br />';
        }
    }
?>