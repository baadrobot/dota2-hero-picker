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

    echo '<script>';
        echo 'window.heroList = '.json_encode($hero_array).';';
        echo 'window.itemList = '.json_encode($itemListArray).';';
    echo '</script>';


    //echo '<div class="container-fluid">';

        echo '<div id="dragNdropInstructions" class="row">';
            echo '<div class="col-4">ПЕРЕТЯНИТЕ В ЭТИ ЯЧЕЙКИ ПИКИ ПРОТИВНИКОВ</div>';
            echo '<div class="col-3">ПЕРЕТЯНИТЕ В ЭТИ ЯЧЕЙКИ БАНЫ</div>';
            echo '<div class="col-4">ПЕРЕТЯНИТЕ В ЭТИ ЯЧЕЙКИ ПИКИ СОЮЗНИКОВ</div>';
        echo '</div>';

        echo '<div id="pickedHeroWrap" class="row">';
            echo '<div id="enemyPickList" class="col-4">';
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

            echo '<div id="friendPickList" class="col-4">';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick emptySlot"><div class="plyrClr"></div></div>';
            echo '</div>';
        echo '</div>';

        echo '<div class="row">';

            echo '<div id="heroListWrap" class="col-8">';

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
            echo '<div id="heroCounterBalanceListWrap" class="col-4 scrollablePanelYAuto">';
            
            echo '</div>';
        echo '</div>';
    //echo '</div>';


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
    echo 'window.LangPreStr["COUNTER_PICK"]["_CLARIFY_HERO_"] = "Уточните какого героя Вы имелли в виду под словом - ";';


echo '</script>';

?>