<?php
    global $dbClass;

    $query = 'SELECT cf_d2HeroList_id as `id`
                    ,cf_d2HeroList_name_en_US as `n`
                    ,cf_d2HeroList_codename as `cn`
                    ,cf_d2HeroList_primary_attr as `a`
                    ,cf_d2HeroList_name_aliases as `na`
                    -- ,cf_d2HeroList_icon as `icon`
                FROM tb_dota2_hero_list ORDER BY cf_d2HeroList_name_en_US;';

    $hero_array = $dbClass->select($query);

    echo '<script>';
        echo 'window.heroList = '.json_encode($hero_array).';';
    echo '</script>';


    //echo '<div class="container-fluid">';
        echo '<div id="pickedHeroWrap" class="row">';
            echo '<div id="friendPickList" class="col-5">';
                echo '<div class="friendPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="friendPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
            echo '</div>';

            echo '<div class="col-2">';
                echo '<div id="gameMode" data-mode="ap">ALL PICK</div>';
            echo '</div>';
            
            echo '<div id="enemyPickList" class="col-5">';
                echo '<div class="enemyPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
                echo '<div class="enemyPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"><div class="plyrClr"></div></div>';
            echo '</div>';
        echo '</div>';

        echo '<div class="row">';
                echo '<div id="banPickList" class="col-12">';
                    echo '<div class="banPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"></div>';
                    echo '<div class="banPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"></div>';
                    echo '<div class="banPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"></div>';
                    echo '<div class="banPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"></div>';
                    echo '<div class="banPick"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_hphover.png?v=4238480"></div>';
                echo '</div>';
        echo '</div>';

        echo '<div class="row">';

            echo '<div id="heroListWrap" class="col-8">';

                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchHeroAliasInput" type="text" class="form-control" placeholder="Поиск героев"/>';
                    echo '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
                echo '</div>';

                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchAbilityInput" type="text" class="form-control" disabled="disabled" placeholder="Введите героев "/>';
                    echo '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
                echo '</div>';

            echo '</div>';

// ----------------------------- Editor panel
            echo '<div class="col-4">';

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


echo '</script>';

?>