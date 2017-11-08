<?php
    require_once('../a_functions.php');
    require_once(__DIR__.'/get_hero_data.php');  
    $prebuildMasterAbilitiesFilenamePath = __DIR__.'/prebuild.master.abilities.php';

    if (isLocalhost())
    {
        if (file_exists($prebuildMasterAbilitiesFilenamePath) && (!isset($_GET['refresh'])))
        {
            require $prebuildMasterAbilitiesFilenamePath;
        } else {
            $echoCache = '';
            $echoCache .= '<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>';
        
            $echoCache .= '<script src="../../js/kainax.js"></script>';
            $echoCache .= '<script src="../../js/component.master.js"></script>';
            $echoCache .= '<link rel="stylesheet" href="../../css/kainax.css">';
            $echoCache .= '<link rel="stylesheet" href="../../css/component.master.css">';


            // ****************** read hero info

            $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
            $heroes = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);

            $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_abilities.txt';        
            $abilities = getParamsFromDotaFile($heroAbilitiesDota2FilePathName);

            $heroKeyPrefix = 'npc_dota_hero_';

            // remade getHeroAbilityNameIfLegal function
            function getHeroAbilityNameIfLegal($heroes, $key, $abilityIndex)
            {
                if (isset($heroes[$key]['Ability'.$abilityIndex]))
                {
                    return $heroes[$key]['Ability'.$abilityIndex];
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
                    $echoCache .= '<div>'$heroName.'</div>';
                    $echoCache .= '<img class="masterHeroImg" src="//cdn.dota2.com/apps/dota2/images/heroes/'.$heroName.'_vert.jpg?v=4195662">';
                    $echoCache .= '<br>';
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
                    for ($i = 1; $i <= 9; $i++)
                    {
                        $abilityFullName = getHeroAbilityNameIfLegal($heroes, $key, $abilityIndex = $i);
                        if ($abilityFullName !== false)
                        {
                            if (isset($abilities[$abilityFullName]) && (isset($abilities[$abilityFullName]['ID'])))
                            {
                                $abilityId = $abilities[$abilityFullName]['ID'];
                            } else {
                                continue;
                            }
                            $abilityOrderPosition++;
                            $echoCache .= '<span class="masterAbilityImgWrap">';
                                $echoCache .= '<img data-ability-id="'.$abilityId.'" title="Ability'.$i.': '.$abilityFullName.'" src="//cdn.dota2.com/apps/dota2/images/abilities/'.$abilityFullName.'_hp1.png?v=4195662">';
                            $echoCache .= '</span>';
                            
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
                                                        ,$abilityFullName
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

                    $echoCache .= '<br>';
                    $echoCache .= '<br>';
                }
            }
            
            // -- read hero abilities data from Dota 2 game installation path
            // $heroAbilitiesDota2FilePathName = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/scripts/npc/npc_heroes.txt';
            // $echoCache .= '<pre>',print_r(getParamsFromDotaFile($heroAbilitiesDota2FilePathName)),'</pre>';

            echo '<br>------------ SUCCESSFULLY REFRESHED ------------<br>';
            file_put_contents($prebuildMasterAbilitiesFilenamePath, $echoCache);
            require $prebuildMasterAbilitiesFilenamePath;
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

    exit('<br />done');
?>