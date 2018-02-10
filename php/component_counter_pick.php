<?php
    global $dbClass;

    $query = 'SELECT cf_d2HeroList_id as `id`
                    ,cf_d2HeroList_name_en_US as `n`
                    ,cf_d2HeroList_codename as `cn`
                    ,cf_d2HeroList_primary_attr as `a`
                    ,cf_d2HeroList_name_aliases as `na`
                    ,cf_d2HeroList_aliases_custom as `nac`
                    ,cf_d2HeroList_alias_single as `nas`
                    -- ,cf_d2HeroList_icon as `icon`
                FROM tb_dota2_hero_list ORDER BY cf_d2HeroList_name_en_US;';

    $hero_array = $dbClass->select($query);

    $query = 'SELECT cf_d2ItemList_name as `itemName`, cf_d2ItemList_codename as `itemCodename`, cf_d2ItemList_alias_single as `itemAliasSingle`
                    FROM tb_dota2_item_list;';
    $itemListResult = $dbClass->select($query);

    for($i = 0; $i < count($itemListResult); $i++)
    {
        $itemListArray[$itemListResult[$i]['itemAliasSingle']] = array('itemCodename'=>$itemListResult[$i]['itemCodename'], 'itemName'=>$itemListResult[$i]['itemName']);
    }

    $query = 'SELECT tb_d2laning_tactics_id as `tacticId`
                    ,tb_d2laning_lane as `lane`
                    ,tb_d2laning_role as `role`
                FROM tb_dota2_laning;';

    $strategies_array = $dbClass->select($query);

    $query = 'SELECT cf_d2HeroTagSet_hero_id as `heroId`
                    ,cf_d2HeroTagSet_tag_id as `tagId`
                    ,cf_d2HeroTagSet_tag_val as `val`
                FROM tb_dota2_heroTag_set 
                WHERE cf_d2HeroTagSet_tag_id IN (32, 33, 34, 35, 36, 37, 38, 39, 40);';

    $roles_array = $dbClass->select($query);

    // 1
    $roles['carry'] = [];
    // 2
    $roles['mider'] = [];
    // 3
    $roles['offlane_solo'] = [];
    $roles['offlane_core'] = [];
    // 4
    $roles['mid_supp'] = [];
    $roles['offlane_supp'] = [];
    $roles['roamer'] = [];
    $roles['jungler'] = [];
    // 5
    $roles['full_supp'] = [];

    for($i = 0; $i < count($roles_array); $i++)
    {
        if ($roles_array[$i]['tagId'] == 32)
        {
            $roles['carry'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
            // $roles['carry'][] = array($roles_array[$i]['heroId'] => $roles_array[$i]['val']);
        }
        else if($roles_array[$i]['tagId'] == 33)
        {
            $roles['mider'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 34)
        {
            $roles['offlane_solo'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 35)
        {
            $roles['jungler'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 36)
        {
            $roles['roamer'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 37)
        {
            $roles['full_supp'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 38)
        {
            $roles['offlane_supp'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 39)
        {
            $roles['mid_supp'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
        else if($roles_array[$i]['tagId'] == 40)
        {
            $roles['offlane_core'][$roles_array[$i]['heroId']] = $roles_array[$i]['val'];
        }
    }


    $query = 'SELECT
                    b.cf_d2HeroTagSet_hero_id AS weakHeroId,
                    a.cf_d2HeroTagSet_hero_id AS strongHeroId
                FROM tb_dota2_tag_balance_set
                    INNER JOIN tb_dota2_heroTag_set a
                    ON tb_dota2_tag_balance_set.cf_d2TagBalanceSet_first_tag_id = a.cf_d2HeroTagSet_tag_id
                    AND a.cf_d2HeroTagSet_tag_val = 5
                    INNER JOIN tb_dota2_heroTag_set b
                    ON tb_dota2_tag_balance_set.cf_d2TagBalanceSet_second_tag_id = b.cf_d2HeroTagSet_tag_id
                    AND b.cf_d2HeroTagSet_tag_val = 5
                WHERE tb_dota2_tag_balance_set.cf_d2TagBalanceSet_balance_value > 49
                ORDER BY weakHeroId;';
                
    $result_dontPickHeroesBeforeBanArray = $dbClass->select($query);

    $lastWeakHeroId = '-1';
    $ready_dontPickHeroesBeforeBanArray = [];  
    for($i = 0; $i < count($result_dontPickHeroesBeforeBanArray); $i++)
    {
        $curWeakHeroId = $result_dontPickHeroesBeforeBanArray[$i]['weakHeroId'];
        $curStrongHeroId = $result_dontPickHeroesBeforeBanArray[$i]['strongHeroId'];

        if ($lastWeakHeroId != $curWeakHeroId)
        {
            $ready_dontPickHeroesBeforeBanArray[$curWeakHeroId] = [];
        }
        $ready_dontPickHeroesBeforeBanArray[$curWeakHeroId][$curStrongHeroId] = 1;
        $lastWeakHeroId = $curWeakHeroId;
    }


    echo '<script>';
        echo 'window.heroList = '.json_encode($hero_array).';';
        echo 'window.itemList = '.json_encode($itemListArray).';';
        echo 'window.strategyList = '.json_encode($strategies_array).';';
        echo 'window.roleList = '.json_encode($roles).';';
        echo 'window.dontPickHeroesBeforeBanArray = '.json_encode($ready_dontPickHeroesBeforeBanArray).';';        
    echo '</script>';


    

        echo '<div id="dragNdropInstructions" class="row">';
            echo '<div class="col-4 colorWhite sideTitleGlowRed">ПЕРЕТЯНИТЕ В ЭТИ ЯЧЕЙКИ ПИКИ ПРОТИВНИКОВ</div>';
            echo '<div class="col-3">ПЕРЕТЯНИТЕ В ЭТИ ЯЧЕЙКИ БАНЫ</div>';
            echo '<div class="col-4 colorWhite sideTitleGlowGreen">ПЕРЕТЯНИТЕ В ЭТИ ЯЧЕЙКИ ПИКИ СОЮЗНИКОВ</div>';
        echo '</div>';

        echo '<div id="pickedHeroWrap" class="row">';
            echo '<div id="enemyPickList" class="col-4 radiant">';
                echo '<div class="enemyPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick emptySlot"><div class="plyrClr"></div></div>';
            echo '</div>';

            echo '<div class="col-3">';
                // BANS
                echo '<div id="banPickList" class="col-12">';
                    echo '<div class="banPick emptySlot"></div>';
                    echo '<div class="banPick emptySlot"></div>';
                    echo '<div class="banPick emptySlot"></div>';
                    echo '<div class="banPick emptySlot"></div>';
                    echo '<div class="banPick emptySlot"></div>';
                echo '</div>';
                // GAME MODE TITLE
                echo '<div id="gameMode" data-mode="ap">ALL PICK</div>';
            echo '</div>';

            echo '<div id="friendPickList" class="col-4 dire">';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
            echo '</div>';
        echo '</div>';

        echo '<div id="mainContent" class="row">';

            echo '<div id="heroListWrap" class="col-8">';

                echo '<div id="swapSidesBtn" class="input-group smlGrp" title="Swap sides">';
                    echo '<span class="input-group-addon"><i class="fa fa-exchange"></i></span>';
                echo '</div>';
    
                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchHeroAliasInput" type="text" class="form-control" placeholder="Поиск героев"/>';
                    echo '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
                echo '</div>';

                echo '<div class="input-group smlGrp smlGrpWidth">';
                    echo '<input id="fillHeroPickAndBanSlotsViaAliasSingleInput" type="text" class="form-control" placeholder="(E) sk, wk, bm (B) doom, kotl (F) ss, sd, brew"/>';
                    echo '<span id="fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn" class="input-group-addon"><i class="fa fa-telegram"></i></span>';
                echo '</div>';
                
            echo '</div>';

// ----------------------------- Editor panel
            echo '<div id="heroCounterBalanceListWrap" class="col-4">';

                echo '<div id="balanceSortWrap" style="display:none">';
                    // echo '<input id="sortByRating" type="radio" name="balanceSort" checked>';
                    // echo '<input id="sortByRole" type="radio" name="balanceSort">';     
                    // echo '<div class="btn-group btn-group-toggle" data-toggle="buttons">';
                        echo 'Sort by:';
                        echo '<label>';
                            echo '<input type="radio" name="sortBalance" id="sortByRole" autocomplete="off" checked> Role';
                        echo '</label>';

                        echo '<label>';
                            echo '<input type="radio" name="sortBalance" id="sortByRating" autocomplete="off"> Rating';
                        echo '</label>';
                    // echo '</div>';
                echo '</div>';

                echo '<i id="copyRecommendHeroesBtn" style="display:none" class="fa fa-clipboard" title="Copy to clipboard"></i>';
                echo '<input id="inputForClipboard" style="display: none" width="1px">';

                echo '<div id="counterPleaseWait" style="display:none">';                
                    echo 'Loading...';
                echo '</div>';                
                echo '<div id="finalBalanceItemListWrap" class="scrollablePanelYAuto">';
                echo '</div>';

            echo '</div>';
        echo '</div>';

        echo '<div class="row">';
            echo '<div class="col-2">';
                echo '<div id="miniMapWrap">';
                    // divs for radiant easy lane
                    echo '<div id="radiantEasy1" data-slot-role="1" data-role-order="0"></div>';
                    echo '<div id="radiantEasy2" data-slot-role="5" data-role-order="8"></div>';
                    echo '<div id="radiantEasy3" data-slot-role="4" data-role-order="86"></div>';

                    // divs for radiant mid lane
                    echo '<div id="radiantMid1" data-slot-role="2" data-role-order="1"></div>';
                    echo '<div id="radiantMid2" data-slot-role="4" data-role-order="6"></div>';
                    echo '<div id="radiantMid3" data-slot-role="5" data-role-order="4"></div>';

                    // divs for radiant hard lane
                    echo '<div id="radiantHard1" data-slot-role="3" data-role-order="2"></div>';
                    echo '<div id="radiantHard2" data-slot-role="4" data-role-order="5"></div>';
                    echo '<div id="radiantHard3" data-slot-role="5" data-role-order="8"></div>';

                    // divs for radiant jungle
                    echo '<div id="radiantJungle" data-slot-role="4" data-role-order="7"></div>';

                    // div for radiant roamer
                    echo '<div id="radiantRoam" data-slot-role="4" data-role-order="6"></div>';

                    // divs for dire easy lane
                    echo '<div id="direEasy1" data-slot-role="1" data-role-order="0"></div>';
                    echo '<div id="direEasy2" data-slot-role="5" data-role-order="8"></div>';
                    echo '<div id="direEasy3" data-slot-role="4" data-role-order="86"></div>';

                    // divs for dire mid lane
                    echo '<div id="direMid1" data-slot-role="2" data-role-order="1"></div>';
                    echo '<div id="direMid2" data-slot-role="4" data-role-order="6"></div>';
                    echo '<div id="direMid3" data-slot-role="5" data-role-order="4"></div>';

                    // divs for dire hard lane
                    
                    echo '<div id="direHard1" data-slot-role="3" data-role-order="2"></div>';
                    echo '<div id="direHard2" data-slot-role="4" data-role-order="5"></div>';
                    echo '<div id="direHard3" data-slot-role="5" data-role-order="8"></div>';

                    // div for dire jungle
                    echo '<div id="direJungle" data-slot-role="4" data-role-order="7"></div>';

                    // div for dire roamer
                    echo '<div id="direRoam" data-slot-role="4" data-role-order="6"></div>';

                    echo '<img id="miniMapImg" src="images/mini-map-dire.png">';
                echo '</div>';

            echo '</div>';
            
            echo '<i id="userRole" class="questionMark fa fa-question-circle" title="Drag into position to filter roles"></i>';
            echo '<i id="removeIcon" class="removeIconMark fa fa-ban" title="Drop icons from map to delete them"></i>';

            // echo '<div class="col-3">';
            //     echo '<div id="uncertainDireHeroesWrap" class="align-top">';
            //         echo '<span>Dire: </span>';
            //         // echo '<img src="http://cdn.dota2.com/apps/dota2/images/heroes/lion_icon.png?v=4299287">';
            //     echo '</div>';

            //     echo '<div id="uncertainRadiantHeroesWrap" class="align-top">';
            //         echo '<span>Radiant: </span>';
            //         // echo '<img src="http://cdn.dota2.com/apps/dota2/images/heroes/slark_icon.png?v=4299287">';
            //     echo '</div>';
            // echo '</div>';
            
        echo '</div>';


require 'php/template_d2_hero_ability_tooltip.php';


// --------------
echo '<script>';
    echo 'window.LangPreStr["EDITOR"] = [];';
    echo 'window.LangPreStr["EDITOR"]["_CONFIRM_UNSET_TAG_"] = "Вы действительно хотите снять тэг {TAG} с героя {HERO}?";';
    echo 'window.LangPreStr["EDITOR"]["_UNSET_TAG_"] = "Снять тэг";';
    echo 'window.LangPreStr["EDITOR"]["_CONFIRM_DELETE_TAG_"] = "Вы действительно хотите удалить тэг {TAG}?";';
    echo 'window.LangPreStr["EDITOR"]["_DELETE_TAG_"] = "Удалить тэг";';

    echo 'window.LangPreStr["EDITOR"]["_RENAME_TAG_"] = "Переименование тэга";';
    echo 'window.LangPreStr["EDITOR"]["_TAG_NAME_"] = "Имя тега:";';
    echo 'window.LangPreStr["EDITOR"]["_TAG_EXIST_"] = "Данный тэг уже существует";';
    echo 'window.LangPreStr["EDITOR"]["_RENAME_"] = "Переименовать";';

    echo 'window.LangPreStr["EDITOR"]["_CREATE_TAG_"] = "Создание тэга";';
    echo 'window.LangPreStr["EDITOR"]["_CREATE_"] = "Создать";';
    echo 'window.LangPreStr["EDITOR"]["_SET_"] = "Назначить";';

    echo 'window.LangPreStr["EDITOR"]["_SET_BALANCE_"] = "Назначение баланса между тэгами";';

    echo 'window.LangPreStr["EDITOR"]["_DFLT_NOTE_COUNTER_"] = "{h1} {a1} контрит {h2} {a2}";';
    echo 'window.LangPreStr["EDITOR"]["_DFLT_NOTE_SNRG_"] = "{h1} {a1} синергия с {h2} {a2}";';
    echo 'window.LangPreStr["EDITOR"]["_DFLT_NOTE_ANTISNRG_"] = "{h1} {a1} анти-синергия с {h2} {a2}";';

    echo 'window.LangPreStr["COUNTER_PICK"] = [];';
    echo 'window.LangPreStr["COUNTER_PICK"]["_CM_OR_AP_"] = "Captain\'s Mod or All Pick";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_NEXT_"] = "Далее";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_BACK_"] = "Назад";';

    echo 'window.LangPreStr["COUNTER_PICK"]["_CHOOSE_HERO_"] = "Выбор героя";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_CLARIFY_HERO_"] = "Какого героя Вы подразумевали?";';


echo '</script>';

?>