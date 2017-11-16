<?php
    require_once('php/a_functions.php');
    ini_set('max_execution_time', 0);

    if (isLocalhost())
    {
        if (!isset($_GET['update']))
        {
            //require $prebuildMasterAbilitiesFilenamePath;



            // // For tests!
            // $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
            // $heroesFile = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);
            // $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_abilities.txt';
            // $abilities = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);
            // echo '<pre>',print_r($heroesFile),'</pre>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<br>----------------------------------<br>';
            // echo '<pre>',print_r($abilities),'</pre>';
            // exit;

            $query = 'SELECT
                        cf_d2HeroAbilityList_heroId as `heroId`
                        ,cf_d2HeroList_codename as `heroCodename`
                        ,cf_d2HeroList_name_en_US as `heroLocalname`
                        ,cf_d2HeroAbilityList_id as `abilityId`
                        ,cf_d2HeroAbilityList_abilityCodename as `abilityCodename`
                        ,cf_d2HeroAbilityList_isAbilityIgnored as `ignoreStatus`
                        ,cf_d2HeroAbilityList_isAbilityForbidden as `isForbidden`
                        --
                        ,cf_d2HeroAbilityList_manualBuffDispellableB as `buffDispellableB`
                        ,cf_d2HeroAbilityList_manualBuffDispellableS as `buffDispellableS`
                        ,cf_d2HeroAbilityList_manualDebuffDispellableB as `debuffDispellableB`
                        ,cf_d2HeroAbilityList_manualDebuffDispellableS as `debuffDispellableS`
                        ,cf_d2HeroAbilityList_isConfirmed as `isConfirmed`
                        ,cf_d2HeroAbilityList_spellDispellableType as `dispType`
                        --
                        FROM tb_dota2_hero_ability_list
                        INNER JOIN tb_dota2_hero_list
                            ON tb_dota2_hero_ability_list.cf_d2HeroAbilityList_heroId = tb_dota2_hero_list.cf_d2HeroList_id
                        ORDER BY
                        cf_d2HeroAbilityList_heroId, cf_d2HeroAbilityList_orderPosition;';

            $result = $dbClass->select($query);



            echo '<ul class="nav nav-pills" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="masterList-tab" data-toggle="tab" href="#masterList" role="tab" aria-controls="masterList" aria-selected="true">Enabled abilities</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="dispellableAbilities-tab" data-toggle="tab" href="#masterDispellableAbilities" role="tab" aria-controls="dispellableAbilities" aria-selected="false">Dispellable abilities</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">';
                echo '<div id="masterList" class="tab-pane fade show active" role="tabpanel" aria-labelledby="masterList-tab">';
                    echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=master&update=all">Обновить героев и их способности.</a></div>';
                    // first tab            
                    //echo '<div id="masterList"></div>';
                echo '</div>';
                echo '<div id="masterDispellableAbilities" class="tab-pane fade" role="tabpanel" aria-labelledby="dispellableAbilities-tab">';
                    // second tab

                echo '</div>';    
            echo '</div>';               

        echo '<script>';
            echo 'window.masterAllHeroesList = '.json_encode($result).';';
        echo '</script>';

        require 'php/template_d2_hero_ability_tooltip.php';


        } else {

                                    // prepare temp array for forbidden abilities
                                    $query = 'SELECT cf_d2HeroAbilityList_id as `abilityId`
                                                    ,cf_d2HeroAbilityList_isAbilityForbidden as `isForbidden`
                                            FROM tb_dota2_hero_ability_list;';
                                    $oldAbilitiesResult = $dbClass->select($query);

                                    $tempForbiddenAbilitiesArray = [];
                                    for ($i = 0; $i < count($oldAbilitiesResult); $i++)
                                    {
                                        $tempForbiddenAbilitiesArray[$oldAbilitiesResult[$i]['abilityId']] = $oldAbilitiesResult[$i]['isForbidden'];
                                    }
                                    unset($oldAbilitiesResult); //free memory

            $echoCache = '';

            // ****************** read hero info

            $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
            $heroesFile = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);

            $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_abilities.txt';
            $abilities = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);

            $heroKeyPrefix = 'npc_dota_hero_';

            require(__DIR__.'/get_hero_data.php');


            function getHeroAbilityNameIfLegal($heroesFile, $heroFullCodename, $heroCodename, $abilityIndex)
            {

                if (isset($heroesFile[$heroFullCodename]['Ability'.$abilityIndex]))
                {

                    if ($heroCodename == 'sand_king')
                    {
                        $heroTrickCodename = 'sandking';
                    } else {
                        $heroTrickCodename = $heroCodename;
                    }

                    // if ability name begins with hero codename,
                    // example yeah: ["npc_dota_hero_invoker"]["Ability12"]["invoker_chaos_meteor"]
                    // example nope: ["npc_dota_hero_invoker"]["Ability17"]["special_bonus_unique_invoker_8"]
                    if ((substr($heroesFile[$heroFullCodename]['Ability'.$abilityIndex], 0, strlen($heroTrickCodename)) == $heroTrickCodename)
                     && ($heroesFile[$heroFullCodename]['Ability'.$abilityIndex] != 'generic_hidden')
                     && ($heroesFile[$heroFullCodename]['Ability'.$abilityIndex] != 'rubick_hidden1')
                     && ($heroesFile[$heroFullCodename]['Ability'.$abilityIndex] != 'rubick_hidden2')
                     && ($heroesFile[$heroFullCodename]['Ability'.$abilityIndex] != 'rubick_hidden3')
                     )
                    {
                        return $heroesFile[$heroFullCodename]['Ability'.$abilityIndex];
                    } else {
                        return false;
                    }
                } else
                {
                    return false;
                }
            }


            //$autoTagSetForDispellableAbilities = [];

            foreach ($heroesFile as $key => $value)
            {
                if ((substr($key, 0, strlen($heroKeyPrefix)) == $heroKeyPrefix) && ($key != $heroKeyPrefix.'target_dummy' ))
                {
                    $heroCodename = substr($key, strlen($heroKeyPrefix));

                    //$autoTagSetForDispellableAbilities[$heroCodename] = [];

                    $heroId = $heroesFile[$key]['HeroID'];
                    $heroRole = $heroesFile[$key]['Role'];

                    $heroRolelevels = $heroesFile[$key]['Rolelevels'];
                    $heroComplexity = $heroesFile[$key]['Complexity'];
                    $heroCMEnabled = $heroesFile[$key]['CMEnabled'];

                    $abilityOrderPosition = -1;
                    for ($i = 1; $i <= 20; $i++) // Kainax: maxed from 9 to 20 for Invoker
                    {
                        $abilityCodename = getHeroAbilityNameIfLegal($heroesFile, $key, $heroCodename, $abilityIndex = $i);
                        if ($abilityCodename !== false)
                        {
                            if (isset($abilities[$abilityCodename]) && (isset($abilities[$abilityCodename]['ID'])))
                            {
                                $abilityId = $abilities[$abilityCodename]['ID'];
                            } else {
                                continue;
                            }
                            $abilityOrderPosition++;

                            // this ability still exists, unset from temp array
                            unset($tempForbiddenAbilitiesArray[$abilityId]);


                            if (isset($abilities[$abilityCodename]['AbilityManaCost']))
                            {
                                $abilityManaCost = $abilities[$abilityCodename]['AbilityManaCost'];
                            } else {
                                $abilityManaCost = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityCooldown']))
                            {
                                $abilityCooldown = $abilities[$abilityCodename]['AbilityCooldown'];
                            } else {
                                $abilityCooldown = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityCastPoint']))
                            {
                                $abilityCastPoint = $abilities[$abilityCodename]['AbilityCastPoint'];
                            } else {
                                $abilityCastPoint = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityCastRange']))
                            {
                                $abilityCastRange = $abilities[$abilityCodename]['AbilityCastRange'];
                            } else {
                                $abilityCastRange = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityUnitDamageType']))
                            {
                                $abilityUnitDamageType = $abilities[$abilityCodename]['AbilityUnitDamageType'];
                            } else {
                                $abilityUnitDamageType = null;
                            }

                            if (isset($abilities[$abilityCodename]['AbilityUnitTargetTeam']))
                            {
                                $abilityUnitTargetTeam = $abilities[$abilityCodename]['AbilityUnitTargetTeam'];
                            } else {
                                $abilityUnitTargetTeam = null;
                            }

                            if (isset($abilities[$abilityCodename]['SpellImmunityType']))
                            {
                                $spellImmunityType = $abilities[$abilityCodename]['SpellImmunityType'];
                            } else {
                                $spellImmunityType = null;
                            }

                            if (isset($abilities[$abilityCodename]['SpellDispellableType']))
                            {
                                $spellDispellableType = $abilities[$abilityCodename]['SpellDispellableType'];
                                
            // if                             
            //  cf_d2HeroAbilityList_abilityUnitTargetTeam содержит (не то же самое что равно)
            //  DOTA_UNIT_TARGET_TEAM_FRIENDLY или DOTA_UNIT_TARGET_TEAM_BOTH
            //  создать запись в таблице tb_dota2_heroTag_set 
            // с айди героя - ?, айди тега - 29, value (default 3), ability id - все что нашли                                

                                // if ($spellDispellableType == 'SPELL_DISPELLABLE_YES')
                                // {

                                //    // $autoTagSetForDispellableAbilities[$heroCodename] 

                                // } else if ($spellDispellableType == 'SPELL_DISPELLABLE_YES_STRONG')
                                // {
                                //     $autoTagSetForDispellableAbilities[$heroCodename]['strong_friend'] = ''
                                //     $autoTagSetForDispellableAbilities[$heroCodename]['strong_enemy'] = ''
                                //     $autoTagSetForDispellableAbilities[$heroCodename]['basic_friend'] += ' ' +$abilityId;                                    
                                //     $autoTagSetForDispellableAbilities[$heroCodename]['basic_enemy'] = ''
                                // } else {

                                // }
                            } else {
                                $spellDispellableType = null;

                            }

                            if (isset($abilities[$abilityCodename]['HasScepterUpgrade']))
                            {
                                $hasScepterUpgrade = $abilities[$abilityCodename]['HasScepterUpgrade'];
                            } else {
                                $hasScepterUpgrade = false;
                            }

                            if (isset($abilities[$abilityCodename]['IsGrantedByScepter']))
                            {
                                $isGrantedByScepter = $abilities[$abilityCodename]['IsGrantedByScepter'];
                            } else {
                                $isGrantedByScepter = false;
                            }

                            if (isset($abilities[$abilityCodename]['AbilityType']))
                            {
                                $abilityType = $abilities[$abilityCodename]['AbilityType'];
                            } else {
                                $abilityType = 'DOTA_ABILITY_TYPE_BASIC';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityBehavior']))
                            {
                                $abilityBehavior = $abilities[$abilityCodename]['AbilityBehavior'];
                            } else {
                                //  $abilityBehavior = 'DOTA_ABILITY_BEHAVIOR_NONE';
                                $abilityBehavior = null;
                            }

                            if (isset($abilities[$abilityCodename]['AbilityDuration']))
                            {
                                $abilityDuration = $abilities[$abilityCodename]['AbilityDuration'];
                            } else {
                                $abilityDuration = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityDamage']))
                            {
                                $abilityDamage = $abilities[$abilityCodename]['AbilityDamage'];
                                if ($abilityDamage == '0 0 0 0')
                                {
                                    $abilityDamage = '0';
                                }
                            } else {
                                $abilityDamage = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityModifierSupportValue']))
                            {
                                $abilityModifierSupportValue = $abilities[$abilityCodename]['AbilityModifierSupportValue'];
                            } else {
                                $abilityModifierSupportValue = '1.0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityModifierSupportBonus']))
                            {
                                $abilityModifierSupportBonus = $abilities[$abilityCodename]['AbilityModifierSupportBonus'];
                            } else {
                                $abilityModifierSupportBonus = '0';
                            }

                            if (isset($abilities[$abilityCodename]['AbilityUnitTargetType']))
                            {
                                $abilityUnitTargetType = $abilities[$abilityCodename]['AbilityUnitTargetType'];
                            } else {
                                $abilityUnitTargetType = null;
                            }

                            if (isset($abilities[$abilityCodename]['AbilityUnitTargetFlags']))
                            {
                                $abilityUnitTargetFlags = $abilities[$abilityCodename]['AbilityUnitTargetFlags'];
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
                                ,cf_d2HeroAbilityList_abilityCodename = ?
                                ,cf_d2HeroAbilityList_abilityManaCost = ?
                                ,cf_d2HeroAbilityList_abilityCooldown = ?
                                ,cf_d2HeroAbilityList_abilityCastPoint = ?
                                ,cf_d2HeroAbilityList_abilityCastRange = ?
                                ,cf_d2HeroAbilityList_damageType = ?
                                ,cf_d2HeroAbilityList_spellDispellableType = ?
                                ,cf_d2HeroAbilityList_hasScepterUpgrade = ?
                                ,cf_d2HeroAbilityList_isGrantedByScepter = ?
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
                                ON DUPLICATE KEY UPDATE
                                cf_d2HeroAbilityList_abilityCodename = ?
                                ,cf_d2HeroAbilityList_abilityManaCost = ?
                                ,cf_d2HeroAbilityList_abilityCooldown = ?
                                ,cf_d2HeroAbilityList_abilityCastPoint = ?
                                ,cf_d2HeroAbilityList_abilityCastRange = ?
                                ,cf_d2HeroAbilityList_damageType = ?
                                ,cf_d2HeroAbilityList_spellDispellableType = ?
                                ,cf_d2HeroAbilityList_hasScepterUpgrade = ?
                                ,cf_d2HeroAbilityList_isGrantedByScepter = ?
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
                                ,cf_d2HeroAbilityList_isAbilityForbidden = 0;';

                            // global $dbClass;
                            $isInsertOk = $dbClass->insert($query
                                                        ,$abilityId
                                                        ,$heroId
                                                        ,$abilityCodename
                                                        ,$abilityManaCost
                                                        ,$abilityCooldown
                                                        ,$abilityCastPoint
                                                        ,$abilityCastRange
                                                        ,$abilityUnitDamageType
                                                        ,$spellDispellableType
                                                        ,$hasScepterUpgrade
                                                        ,$isGrantedByScepter
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
                                                        // on update
                                                        ,$abilityCodename
                                                        ,$abilityManaCost
                                                        ,$abilityCooldown
                                                        ,$abilityCastPoint
                                                        ,$abilityCastRange
                                                        ,$abilityUnitDamageType
                                                        ,$spellDispellableType
                                                        ,$hasScepterUpgrade
                                                        ,$isGrantedByScepter
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


                }
            }

            // forbidden abilities check
            foreach ($tempForbiddenAbilitiesArray as $forbiddenAbilityId => $isAbilityForbiddenInDatabase)
            {
                if ($isAbilityForbiddenInDatabase == 0)
                {
                    $query = 'UPDATE tb_dota2_hero_ability_list
                                SET cf_d2HeroAbilityList_isAbilityForbidden = 1
                            WHERE cf_d2HeroAbilityList_id = ?;';
                    $dbClass->update($query, $forbiddenAbilityId);
                }
            }

            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            global $dbClass;
            $functionSelectQuery = "SELECT autoDecideAbilitiesDispellabe(NULL);";
            $dbClass->select($query);

            // проход по героям:
            // if                             
            //  cf_d2HeroAbilityList_abilityUnitTargetTeam содержит (не то же самое что равно)
            //  DOTA_UNIT_TARGET_TEAM_FRIENDLY или DOTA_UNIT_TARGET_TEAM_BOTH
            //  создать запись в таблице tb_dota2_heroTag_set 
            // с айди героя - ?, айди тега - 29, value (default 3), ability id - все что нашли

                            







            // -- read hero abilities data from Dota 2 game installation path
            // $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
            // $echoCache .= '<pre>',print_r(getParamsFromDotaFile($heroAbilitiesDota2FilePathName)),'</pre>';

            echo '<br>------------ HEROES AND ABILITIES SUCCESSFULLY UPDATED ------------<br>';
            echo '<br>Reloading...<br>';
            //file_put_contents($prebuildMasterAbilitiesFilenamePath, $echoCache);

            // redirect page when all done
            echo '<script>';
                echo 'document.location.replace("/index.php?lang='.$_SESSION['SUserLang'].'&component=master");';
            echo '</script>';
        }
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

                        //$echoCache .= '************* - '.$key.'<br>';

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
                            }
                        }
                    }
                }

                // close file read
                fclose($myfile);
                return $result;
            }

        } else {
            echo '<pre>Warning! File '.$filePathName." did'nt copy properly! Please check php admin access.</pre>";
            return false;
        }
    }
?>