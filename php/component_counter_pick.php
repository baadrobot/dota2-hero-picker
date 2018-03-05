<?php
    require_once('php/a_functions.php');
    global $dbClass;

    $query = 'SELECT
                cf_d2HeroList_id AS `id`,
                cf_d2HeroList_name_en_US AS `n`,
                cf_d2HeroList_codename AS `cn`,
                cf_d2HeroList_primary_attr AS `a`,
                cf_d2HeroList_name_aliases AS `na`,
                cf_d2HeroList_aliases_custom AS `nac`,
                cf_d2HeroList_alias_single AS `nas`,
                cf_d2HeroList_role_initiator AS `initiator`,
                cf_d2HeroList_role_durable AS `durable`,
                cf_d2HeroList_role_pusher AS `pusher`,
                cf_d2HeroList_role_nuker AS `nuker`,
                cf_d2HeroList_complexity AS `complexity`,
                antipusherTable.cf_d2HeroTagSet_tag_val AS `antipusher`,
                controlTable.cf_d2HeroTagSet_tag_val AS `control`
                FROM tb_dota2_hero_list
                LEFT JOIN
                (SELECT cf_d2HeroTagSet_hero_id, cf_d2HeroTagSet_tag_val
                    FROM tb_dota2_heroTag_set
                    WHERE cf_d2HeroTagSet_tag_id = 141) AS `antipusherTable`
                    ON antipusherTable.cf_d2HeroTagSet_hero_id = cf_d2HeroList_id
                LEFT JOIN
                (SELECT cf_d2HeroTagSet_hero_id, cf_d2HeroTagSet_tag_val
                    FROM tb_dota2_heroTag_set
                    WHERE cf_d2HeroTagSet_tag_id = 216) AS `controlTable`
                    ON controlTable.cf_d2HeroTagSet_hero_id = cf_d2HeroList_id
                ORDER BY n;';

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

    $heroesPickWinRates = [];
    $todaysPrebuildPickAndWinRateFileCachePath = __DIR__.'/prebuild/prebuild.hero_pick&win'.date("Y-m-d").'.json';
    if (file_exists($todaysPrebuildPickAndWinRateFileCachePath))
    {
        $heroesPickWinRates = json_decode(file_get_contents($todaysPrebuildPickAndWinRateFileCachePath), true);
    } else {
        // parse
        // получаем html
        $html = getHtmlObjFromUrl('https://www.dotabuff.com/heroes/meta');

        foreach($html->find('table > tbody tr') as $heroTableRow)
        {
            if ($heroTableRow->children(0)->hasAttribute('data-value'))
            {
                $heroName = $heroTableRow->children(0)->getAttribute('data-value');
                $pickPercent = 0;
                if(is_object($heroTableRow->children(10)))
                {
                    $pickPercent = $heroTableRow->children(10)->plaintext;
                }
                $winPercent = 50;
                if(is_object($heroTableRow->children(11)))
                {
                    $winPercent = $heroTableRow->children(11)->plaintext;
                }

                for($i = 0; $i < count($hero_array); $i++)
                {
                    if($hero_array[$i]['n'] == $heroName)
                    {
                        $hId = $hero_array[$i]['id'];
                        $heroesPickWinRates[$hId] = [];
                        $heroesPickWinRates[$hId]['pr'] = (float)$pickPercent;
                        $heroesPickWinRates[$hId]['wr'] = (float)$winPercent;
                    }
                }
            }
        }
            // echo '<pre>',print_r($hero_array),'</pre>';
            // exit;
        // end of parse

        // save to json for future use duiring this day
        if ($heroesPickWinRates != [])
        {
            file_put_contents($todaysPrebuildPickAndWinRateFileCachePath, json_encode($heroesPickWinRates));
        }
    }

    //for($j = 0; $j < count($$heroesPickWinRates); $j++)
    foreach ($heroesPickWinRates as $keyHeroId => $value)
    {
        for($i = 0; $i < count($hero_array); $i++)
        {
            if($hero_array[$i]['id'] == $keyHeroId)
            {
                $hero_array[$i]['pr'] = $value['pr'];
                $hero_array[$i]['wr'] = $value['wr'];
            }
        }
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
                    echo '<span><button class="fa fa-exchange btn btn-secondary"></button></span>';
                echo '</div>';

                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchHeroAliasInput" type="text" class="form-control" placeholder="Поиск героев"/>';
                    echo '<span class="input-group-append"><button class="fa fa-search btn btn-secondary"></button></span>';
                echo '</div>';

                echo '<div class="input-group smlGrp smlGrpWidth">';
                    echo '<input id="fillHeroPickAndBanSlotsViaAliasSingleInput" type="text" class="form-control" placeholder="(E) sk, wk, bm (B) doom, kotl (F) ss, sd, brew"/>';
                    echo '<span id="fillHeroPickAndBanSlotsViaAliasSingleInputOkBtn" class="input-group-append"><button class="fa fa-paper-plane btn btn-secondary" ></button></span>';
                echo '</div>';

            echo '</div>';

// ----------------------------- Editor panel
            echo '<div id="heroCounterBalanceListWrap" class="col-4">';
                echo '<button id="getBestFirstPicksInCurrentMetaBtn" class="btn btn-info btn-sm">Get Best First Picks In Current Meta</button>';

                echo '<div id="balanceSortWrap" class="input-group-text" style="display:none">';
                        echo 'Sort by:';
                        echo '<label>';
                            echo '<input type="radio" name="sortBalance" id="sortByRole" autocomplete="off" checked> Role';
                        echo '</label>';

                        echo '<label>';
                            echo '<input type="radio" name="sortBalance" id="sortByRating" autocomplete="off"> Rating';
                        echo '</label>';
                    echo '</div>';
                    // echo '</div>';
                // echo '</div>';

                // echo '<i id="copyRecommendHeroesBtn" style="display:none" class="fa fa-clipboard" title="Copy to clipboard"></i>';
                // echo '<input id="inputForClipboard" style="display: none" width="1px">';

                echo '<div id="copyRecommendHeroesBtn" style="display:none" class="input-group smlGrp" title="Copy to clipboard">';
                    echo '<span>';
                        echo '<button class="fa fa-clipboard btn btn-secondary"></button>';
                    echo '</span>';
                echo '</div>';
                echo '<input id="inputForClipboard" style="display: none" width="1px">';

                echo '<div id="counterPleaseWait" style="display:none">';
                    echo '<div class="circle"></div>';
                    echo '<div class="circle1"></div>';
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
            echo '<i id="removeIcon" class="removeIconMark fa fa-ban" title="Drop icons from map to delete them" style="display: none"></i>';

            echo '<div class="col-4 offset-2">';
                echo '<canvas id="chartRadar"></canvas>';
            echo '</div>';

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

    echo 'window.LangPreStr["COUNTER_PICK"]["_STRONG_COUNTERPICK_BONUS"] = "Все серьезные контерпики в бане или в дружественном пике";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_ROLE_BONUS_"] = "Бонус за актуальную роль";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_META_HERO_"] = "Герой в мете";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_NON_META_HERO_"] = "Герой не в мете";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_EARLY_PICK_BONUS_"] = "Бонус за ранний пик";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_DOUBLE_EARLY_PICK_BONUS_"] = "Двойной бонус за ранний пик";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPLEXITY_EASY_"] = "Герой простой в испольнении";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPLEXITY_HARD_"] = "Герой сложный в исполнении";';

    echo 'window.LangPreStr["COUNTER_PICK"]["_TEAM_COMPOSITION_INITIATOR_"] = "Бонус за team composition initiator";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_TEAM_COMPOSITION_DURABLE_"] = "Бонус за team composition durable";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_TEAM_COMPOSITION_PUSHER_"] = "Бонус за team composition pusher";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_TEAM_COMPOSITION_NUKER_"] = "Бонус за team composition nuker";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_TEAM_COMPOSITION_ANTIPUSHER_"] = "Бонус за team composition antipusher";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_TEAM_COMPOSITION_CONTROL_"] = "Бонус за team composition control";';

    echo 'window.LangPreStr["COUNTER_PICK"]["_RADAR_INITIATOR"] = "Инициатор";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_RADAR_DURABLE"] = "Танк";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_RADAR_PUSHER"] = "Пушер";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_RADAR_NUKER"] = "Нюкер";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_RADAR_ANTIPUSHER"] = "Антипушер";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_RADAR_CONTROL"] = "Контроль";';

    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPOSITION_INITIATOR_BONUS_"] = "Инициатор бонус";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPOSITION_DURABLE_BONUS_"] = "Танк бонус";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPOSITION_PUSHER_BONUS_"] = "Пушер бонус";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPOSITION_NUKER_BONUS_"] = "Нюкер бонус";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPOSITION_ANTIPUSHER_BONUS_"] = "Антипушер бонус";';
    echo 'window.LangPreStr["COUNTER_PICK"]["_COMPOSITION_CONTROL_BONUS_"] = "Контроль бонус";';
    
    


echo '</script>';

?>