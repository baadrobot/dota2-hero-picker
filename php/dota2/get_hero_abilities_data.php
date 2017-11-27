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



            echo '<ul class="nav nav-pills" id="myTab" role="tablist">';
                echo '<li class="nav-item">';
                    echo '<a class="nav-link active" id="masterList-tab" data-toggle="tab" href="#masterList" role="tab" aria-controls="masterList" aria-selected="true">Enabled abilities</a>';
                echo '</li>';
                echo '<li class="nav-item">';
                    echo '<a class="nav-link" id="dispellableAbilities-tab" data-toggle="tab" href="#masterDispellableAbilities" role="tab" aria-controls="dispellableAbilities" aria-selected="false">Dispellable abilities</a>';
                echo '</li>';
            echo '</ul>';
            echo '<div class="tab-content" id="myTabContent">';
                echo '<div id="masterList" class="tab-pane fade show active" role="tabpanel" aria-labelledby="masterList-tab">';
                    echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=master&update=all">Обновить героев и их способности.</a></div>';
                    // first tab
                    //echo '<div id="masterList"></div>';
                echo '</div>';
                echo '<div id="masterDispellableAbilities" class="tab-pane fade" role="tabpanel" aria-labelledby="dispellableAbilities-tab">';
                    // second tab
                    echo '<hr>';
                    echo '<label><input id="filterUnconfirmed" type="checkbox"> Фильтровать неподтвержденные</label>';
                    echo '<hr>';

                echo '</div>';
            echo '</div>';

            echo '<script>';
                echo 'window.masterAllHeroesList = '.json_encode($result).';';
            echo '</script>';

            require 'php/template_d2_hero_ability_tooltip.php';


        } else {
            // UPDATE

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
                    $heroComplexityVal = $heroesFile[$key]['Complexity'];
                    //$heroCMEnabled = $heroesFile[$key]['CMEnabled'];

                    $heroRolesAndLevels = [];
                    if (isset($heroesFile[$key]['Role']) && isset($heroesFile[$key]['Rolelevels']))
                    {
                            $heroRoles = explode(',', $heroesFile[$key]['Role']);
                            $heroRolelevels = explode(',', $heroesFile[$key]['Rolelevels']);
                        $heroRolesAndLevels = array_combine($heroRoles, $heroRolelevels);
                    }

                    if (isset($heroRolesAndLevels['Support']))
                    {
                        $roleSupportVal = $heroRolesAndLevels['Support'];
                    } else {
                        $roleSupportVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Carry']))
                    {
                        $roleCarryVal = $heroRolesAndLevels['Carry'];
                    } else {
                        $roleCarryVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Escape']))
                    {
                        $roleEscapeVal = $heroRolesAndLevels['Escape'];
                    } else {
                        $roleEscapeVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Initiator']))
                    {
                        $roleInitiatorVal = $heroRolesAndLevels['Initiator'];
                    } else {
                        $roleInitiatorVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Nuker']))
                    {
                        $roleNukerVal = $heroRolesAndLevels['Nuker'];
                    } else {
                        $roleNukerVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Disabler']))
                    {
                        $roleDisablerVal = $heroRolesAndLevels['Disabler'];
                    } else {
                        $roleDisablerVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Jungler']))
                    {
                        $roleJunglerVal = $heroRolesAndLevels['Jungler'];
                    } else {
                        $roleJunglerVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Durable']))
                    {
                        $roleDurableVal = $heroRolesAndLevels['Durable'];
                    } else {
                        $roleDurableVal = 0;
                    }
                    if (isset($heroRolesAndLevels['Pusher']))
                    {
                        $rolePusherVal = $heroRolesAndLevels['Pusher'];
                    } else {
                        $rolePusherVal = 0;
                    }

                    // сделать insert для сложности героя
                    $query = 'UPDATE tb_dota2_hero_list
                                SET  cf_d2HeroList_complexity = ?
                                    ,cf_d2HeroList_role_support = ?
                                    ,cf_d2HeroList_role_carry = ?
                                    ,cf_d2HeroList_role_escape = ?
                                    ,cf_d2HeroList_role_initiator = ?
                                    ,cf_d2HeroList_role_nuker = ?
                                    ,cf_d2HeroList_role_disabler = ?
                                    ,cf_d2HeroList_role_jungler = ?
                                    ,cf_d2HeroList_role_durable = ?
                                    ,cf_d2HeroList_role_pusher = ?
                               WHERE cf_d2HeroList_id = ?;';
                    $dbClass->update($query, $heroComplexityVal
                                            ,$roleSupportVal
                                            ,$roleCarryVal
                                            ,$roleEscapeVal
                                            ,$roleInitiatorVal
                                            ,$roleNukerVal
                                            ,$roleDisablerVal
                                            ,$roleJunglerVal
                                            ,$roleDurableVal
                                            ,$rolePusherVal
                                            ,$heroId);



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


            // invoke MySQL function to rebuild hero tags for DISPELLABLE abilities
            $query = 'SELECT updateDispellableAbilitiesTags(NULL);';
            $dbClass->select($query);

            // update "lanes meta" tags
            require_once('php/cl.simpleHTMLDom.php');

                        $html = getHtmlObjFromUrl('https://www.dotabuff.com/heroes/lanes?lane=mid');
                        // mid core
                        setLaneTagValue($tagId = 33, $html, $minPresence = 40, $minWinRate = 50);
                        // mid support
                        setLaneTagValue($tagId = 39, $html, $minPresence = 0, $minWinRate = 50);
            
                        $html = getHtmlObjFromUrl('https://www.dotabuff.com/heroes/lanes?lane=roaming');
                        // roamer
                        setLaneTagValue($tagId = 36, $html, $minPresence = 0, $minWinRate = 50);
            
                        $html = getHtmlObjFromUrl('https://www.dotabuff.com/heroes/lanes?lane=off');
                        // offlane solo
                        setLaneTagValue($tagId = 34, $html, $minPresence = 0, $minWinRate = 50);
                        // offlane core
                        setLaneTagValue($tagId = 40, $html, $minPresence = 0, $minWinRate = 50);
                        // offlane support
                        setLaneTagValue($tagId = 38, $html, $minPresence = 0, $minWinRate = 50);
                        
            
                        $html = getHtmlObjFromUrl('https://www.dotabuff.com/heroes/lanes?lane=jungle');
                        // jungler
                        setLaneTagValue($tagId = 35, $html, $minPresence = 0, $minWinRate = 50);
            
                        $html = getHtmlObjFromUrl('https://www.dotabuff.com/heroes/lanes?lane=safe');
                        // carry
                        setLaneTagValue($tagId = 32, $html, $minPresence = 0, $minWinRate = 50);
                        // support safe lane
                        setLaneTagValue($tagId = 37, $html, $minPresence = 0, $minWinRate = 50);
            
                        //exit;

            echo '<br>------------ HEROES AND ABILITIES SUCCESSFULLY UPDATED ------------<br>';
            echo '<br>Reloading...<br>';
            //file_put_contents($prebuildMasterAbilitiesFilenamePath, $echoCache);

            global $dbClass;
            // delete all primary attr setted on hero tags before setting new
            $query = 'DELETE FROM tb_dota2_heroTag_set
                            WHERE cf_d2HeroTagSet_tag_id IN (51,52,53,54,57,62,63);';
            $dbClass->delete($query);

            $query = 'SELECT cf_d2HeroList_id as `heroId`
                            , cf_d2HeroList_primary_attr as `heroAttr`
                            , cf_d2HeroList_attack_type as `attackType`
                            , cf_d2HeroList_attack_range as `attackRange`
                            , cf_d2HeroList_complexity as `complexity`
                           FROM tb_dota2_hero_list;';
            $heroParamsResult = $dbClass->select($query);
            
            // has aghanim upgrade
            $query = 'SELECT DISTINCT(cf_d2HeroAbilityList_heroId) AS heroId
                        FROM tb_dota2_hero_ability_list
                       WHERE cf_d2HeroAbilityList_hasScepterUpgrade = 1;';
            $hasScepterUpgradeResult = $dbClass->select($query);
           
            // query for range tag
            $query = 'INSERT INTO tb_dota2_heroTag_set
                            SET cf_d2HeroTagSet_hero_id = ?
                                ,cf_d2HeroTagSet_tag_id = ?
                                ,cf_d2HeroTagSet_tag_val = ?;';

            // create tags - hero has aghanim
            for ($i = 0; $i < count($hasScepterUpgradeResult); $i++)
            {
                $dbClass->insert($query, $hasScepterUpgradeResult[$i]["heroId"], 54, 5);
            }

            //  create tags - hero primary attr
            for ($i = 0; $i < count($heroParamsResult); $i++)
            {
                $tagId = '';
                if ($heroParamsResult[$i]['heroAttr'] == 1)
                {
                    $tagId = 51;
                }
                else if ($heroParamsResult[$i]['heroAttr'] == 2)
                {
                    $tagId = 52;

                } else  if ($heroParamsResult[$i]['heroAttr'] == 3) {
                    $tagId = 53;
                }
                if ($tagId != '')
                {
                    $dbClass->insert($query, $heroParamsResult[$i]["heroId"], $tagId, 5);
                }

                // insert for complexity
                $dbClass->insert($query, $heroParamsResult[$i]["heroId"], 57, $heroParamsResult[$i]["complexity"]);

                if ($heroParamsResult[$i]["attackType"] == 0)
                {
                    // is melee
                    $dbClass->insert($query, $heroParamsResult[$i]["heroId"], 62, 5);
                } else if ($heroParamsResult[$i]["attackType"] == 1)
                {
                    // is ranged
                    $dbClass->insert($query, $heroParamsResult[$i]["heroId"], 63, 5);

                    // range (how far?)
                    // for Sniper
                    if ($heroParamsResult[$i]["heroId"] == 35)
                    {
                        $rangeValue = 5;
                    } else
                    // for TA
                    if ($heroParamsResult[$i]["heroId"] == 46)
                    {
                        $rangeValue = 2;
                    } else
                    // for DK
                    if ($heroParamsResult[$i]["heroId"] == 49)
                    {
                        $rangeValue = 3;
                    } else
                    // for TB
                    if ($heroParamsResult[$i]["heroId"] == 109)
                    {
                        $rangeValue = 3;
                    } else {
                        // standart range heroes
                        $rangeValue = 1;
                        if ($heroParamsResult[$i]["attackRange"] >= 140 && $heroParamsResult[$i]["attackRange"] < 330)
                        {
                            $rangeValue = 1;
                        } 
                        else if ($heroParamsResult[$i]["attackRange"] >= 330 && $heroParamsResult[$i]["attackRange"] < 425)
                        {
                            $rangeValue = 2;
                        } 
                        else if ($heroParamsResult[$i]["attackRange"] >= 425 && $heroParamsResult[$i]["attackRange"] < 575)
                        {
                            $rangeValue = 3;
                        }
                        else if ($heroParamsResult[$i]["attackRange"] >= 575)
                        {
                            $rangeValue = 4;
                        }
                    }

                    $dbClass->insert($query, $heroParamsResult[$i]["heroId"], 55, $rangeValue);
                }               
            }

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

function getHtmlObjFromUrl($url)
{
    //******** Getting https elements

    //Указываем URL, куда будем обращаться. Протокол https://
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    //$fp = fopen("example_homepage.txt", "w");
    //curl_setopt($ch, CURLOPT_FILE, $fp);
    $curl_data = curl_exec($ch);
    curl_close($ch);
    //fclose($fp);

    //******** Seperating dom elements

    $html = new simple_html_dom();
    // Load from a string
    $html->load($curl_data);
    unset($curl_data);

    return $html;
}


function setLaneTagValue($tagId, $html, $minPresence, $minWinRate)
{
    $arrayLaneHeroesRate = [];
    foreach($html->find('table tbody tr') as $hero)
    {
        $heroLocalName = $hero->children(0)->getAttribute('data-value');
        if ($heroLocalName != '')
        {
            $presence = $hero->children(2)->getAttribute('data-value');
            $winRate = $hero->children(3)->getAttribute('data-value');
            if (($presence > $minPresence) || ($winRate > $minWinRate))
            {
                if ($presence > 80)
                {
                    $presenceScore = 8;
                } else if ($presence > 70)
                {
                    $presenceScore = 7;
                } else if ($presence > 60)
                {
                    $presenceScore = 6;
                } else if ($presence > 50)
                {
                    $presenceScore = 5;
                } else if ($presence > 40)
                {
                    $presenceScore = 4;
                } else if ($presence > 30)
                {
                    $presenceScore = 3;
                } else if ($presence > 20)
                {
                    $presenceScore = 2;
                } else if ($presence > 10)
                {
                    $presenceScore = 1;
                } else {
                    $presenceScore = 0;
                }

                if ($winRate > 58)
                {
                    $winScore = 12;
                } else if ($winRate > 56)
                {
                    $winScore = 11;
                } else if ($winRate > 54)
                {
                    $winScore = 9;
                } else if ($winRate > 52)
                {
                    $winScore = 7;
                } else if ($winRate > 50)
                {
                    $winScore = 5;
                } else if ($winRate > 49)
                {
                    $winScore = 4;
                } else if ($winRate > 48)
                {
                    $winScore = 3;
                } else if ($winRate > 47)
                {
                    $winScore = 2;
                } else if ($winRate > 46)
                {
                    $winScore = 1;
                } else {
                    $winScore = 0;
                }

                $score = $presenceScore + $winScore;
                $arrayLaneHeroesRate[$heroLocalName] = $score;
            }
        }
    }

    $min = 1000;
    $max = -1;
    foreach($arrayLaneHeroesRate as $keyHeroLocalName => $valScore)
    {
        if ($valScore > $max)
        {
            $max = $valScore;
        }

        if ($valScore < $min)
        {
            $min = $valScore;
        }
    }

    global $dbClass;
    $query = "UPDATE tb_dota2_heroTag_set
              SET cf_d2HeroTagSet_tag_val = 1
              WHERE cf_d2HeroTagSet_tag_id = ?;";
    $dbClass->update($query, $tagId);

    $query = "UPDATE tb_dota2_heroTag_set
                        SET cf_d2HeroTagSet_tag_val = ?
                           ,cf_d2HeroTagSet_selected_abilities = ''
                        WHERE cf_d2HeroTagSet_tag_id = ?
                          AND cf_d2HeroTagSet_hero_id = (SELECT cf_d2HeroList_id FROM tb_dota2_hero_list WHERE cf_d2HeroList_name_en_US = ? LIMIT 1)
                        ;";

    $maxValueOfTag = 5;
    $gradation = ($max - $min) / $maxValueOfTag;
    //echo '<br>------------------------- Begin of tag '.$tagId.'<br>';
    foreach($arrayLaneHeroesRate as $keyHeroLocalName => $valScore)
    {
        $arrayLaneHeroesRate[$keyHeroLocalName] = $maxValueOfTag;
        for ($i = $maxValueOfTag; $i >= 1; $i--)
        {
            if ($valScore <= ($min + ($gradation * $i)))
            {
                $arrayLaneHeroesRate[$keyHeroLocalName] = $i;
            }
        }
        $dbClass->update($query, $arrayLaneHeroesRate[$keyHeroLocalName], $tagId, $keyHeroLocalName);
        //echo $keyHeroLocalName . ' - ' . $arrayLaneHeroesRate[$keyHeroLocalName].'<br>';
    }
    //echo '<br>------------------------- End of tag '.$tagId.'<br>';
    //return $arrayLaneHeroesRate;
}
?>