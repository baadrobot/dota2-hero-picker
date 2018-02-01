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
        echo '<div class="row">';

            echo '<div id="heroListWrap" class="col-8">';

                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchHeroAliasInput" type="text" class="form-control" placeholder="Поиск героев"/>';
                    echo '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
                echo '</div>';


                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchAbilityInput" type="text" class="form-control" disabled="disabled" placeholder="Поиск по способностям"/>';
                    echo '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
                echo '</div>';

                echo '<div id="forSelectedTag">';
                    echo '<span></span>';
                    echo '<span class="fa fa-times" style="display:none"></span>';
                echo '</div>';
            echo '</div>';


// ----------------------------- Editor panel

            echo '<div class="col-4">';

                echo '<div class="input-group smlGrp">';
                    echo '<input id="searchTagInput" type="text" class="form-control" disabled="disabled" placeholder="Поиск тэгов"/>';
                    echo '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
                echo '</div>';

                echo '<div id="editAccordion" data-children=".item">';
                    echo '<div class="item">';
                        echo '<a class="accordionHeader" data-toggle="collapse" data-parent="#editAccordion" href="#editAccordion1" aria-expanded="true" aria-controls="editAccordion1">';
                            echo '<span class="h4 text-secondary">Список тэгов</span>';
                        echo '</a>';
                        echo '<i id="btnCreateNewTagPopup" class="fa fa-plus-square text-secondary acrdHdrBtn hvrDrkGr" aria-hidden="true"></i>';
                        echo '<i id="btnDeleteSelectedTagPopup" class="fa fa-minus-square text-secondary acrdHdrBtn hvrMaroon" aria-hidden="true"></i>';
                        echo '<i id="btnRenameSelectedTagPopup" class="fa fa-pencil-square text-secondary acrdHdrBtn hvrOrange" aria-hidden="true"></i>';

                        echo '<div id="editAccordion1" class="collapse show" role="tabpanel">';
                            echo '<p id="tagListWrap" class="mb-3">';

                                echo '<span>Загрузка...</span>';

                            echo '</p>';
                        echo '</div>';
                    echo '</div>';
                    echo '<div class="item">';
                        echo '<a class="accordionHeader collapsed" data-toggle="collapse" data-parent="#editAccordion" href="#editAccordion2" aria-expanded="false" aria-controls="editAccordion2">';
                            echo '<span class="h4 text-secondary">Баланс тэгов</span>';
                        echo '</a>';
                        echo '<i id="btnCreateNewBalancePopup" class="fa fa-plus-square text-secondary acrdHdrBtn hvrDrkGr" aria-hidden="true"></i>';
                        //echo '<i id="btnDeleteSelectedBalancePopup" class="fa fa-minus-square text-secondary acrdHdrBtn hvrMaroon" aria-hidden="true"></i>';

                        echo '<div id="editAccordion2" class="collapse" role="tabpanel">';
                            echo '<div id="tagBalanceListWrap" class="mb-3">';

                                echo '<span>Загрузка...</span>';

                            echo '</div>';
                        echo '</div>';
                    echo '</div>';
                echo '</div>';

            echo '</div>';
        echo '</div>';
    //echo '</div>';







//**************************************************/
// echo
// '<div id="createNewTagPopup" class="modal" tabindex="-1" role="dialog" aria-hidden="true">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title">Создание нового тэга</h5>
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//       <div class="modal-body">

//           <div class="form-group">
//             <label for="recipient-name" class="col-form-label">Имя тэга:</label>
//             <input id="inputCreateNewTagName" type="text" class="form-control">
//             <p id="noticeTagExist" class="noticeRed">Данный тэг уже существует</p>
//           </div>';
//         //   <div class="form-group">
//         //     <label for="message-text" class="col-form-label">Message:</label>
//         //     <textarea class="form-control" id="message-text"></textarea>
//         //   </div>
// echo
//       '</div>
//       <div class="modal-footer">
//         <button id="btnCreateNewTagDo" type="button" class="btn btn-primary">Создать</button>
//         <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
//       </div>
//     </div>
//   </div>
// </div>';

//**************************************************/
// popup for hero tag edit
echo '<div id="editHeroTagPopup" class="modal" tabindex="-1" role="dialog" aria-hidden="true">';
  echo '<div class="modal-dialog" role="document">';
    echo '<div class="modal-content">';
      echo '<div class="modal-header">';
        echo '<h5 class="modal-title">Назначение тэга</h5>';
        echo '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
          echo '<span aria-hidden="true">&times;</span>';
        echo '</button>';
      echo '</div>';
      echo '<div class="modal-body">';
            echo '<span id="editHeroTagHeroName" class="blueBold"></span>';
            echo '<div id="editHeroTagHeroImgWrap">';
                echo '<img>';
            echo '</div>';

            echo '<div id="editHeroTagAbilitiesImgWrap">';

            echo '</div>';

            echo '<div class="form-group">';
                echo '<span id="editHeroTagInfoNone" class="editHeroTagInfoText col-form-label" data-template-text="Выберите героя или способности для тега {TAG}"></span>';
                echo '<span id="editHeroTagInfoHero" class="editHeroTagInfoText col-form-label" data-template-text="Назначить тэг {TAG} на героя"></span>';
                echo '<span id="editHeroTagInfoAbilities" class="editHeroTagInfoText col-form-label" data-template-text="Назначить тэг {TAG} на выбранные способности"></span>';

            echo '</div>';

            echo '<div class="form-group">';
                echo '<div id="editHeroTagSlider">';
                    echo '<div id="custom-handle" class="ui-slider-handle"></div>';
                echo '</div>';
            echo '</div>';

      echo '</div>';
      echo '<div class="modal-footer">';
        echo '<button id="btnEditHeroTagUnset" type="button" class="btn btn-danger" >Снять тэг</button>';
        echo '<button id="btnEditHeroTagDo" type="button" class="btn btn-primary">Назначить</button>';
        echo '<button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>';
      echo '</div>';
    echo '</div>';
  echo '</div>';
echo '</div>';
// end of popup for hero tag edit


// popup for hero popup
echo '<div id="editHeroPopup" class="modal" tabindex="-1" role="dialog" aria-hidden="true">';
echo '<div class="modal-dialog" role="document">';
  echo '<div class="modal-content">';
    echo '<div class="modal-header">';
      echo '<h5 id="editHeroAllTagsHeroName" class="modal-title blueBold"></h5>';
      echo '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        echo '<span aria-hidden="true">&times;</span>';
      echo '</button>';
    echo '</div>';
    echo '<div class="modal-body">';
        // tab links
        echo '<nav class="nav nav-tabs justify-content-center" id="myTab" role="tablist">';
            echo '<a class="nav-item nav-link active" id="nav-hero-tab" data-toggle="tab" href="#nav-hero" role="tab" aria-controls="nav-hero" aria-selected="true">Герой</a>';
            echo '<a class="nav-item nav-link" id="nav-tags-tab" data-toggle="tab" href="#nav-tags" role="tab" aria-controls="nav-tags" aria-selected="false">Тэги</a>';
            echo '<a class="nav-item nav-link" id="nav-counter-to-tab" data-toggle="tab" href="#nav-counter-to" role="tab" aria-controls="nav-counter-to" aria-selected="false">Кого контрит</a>';
            echo '<a class="nav-item nav-link" id="nav-counter-by-tab" data-toggle="tab" href="#nav-counter-by" role="tab" aria-controls="nav-counter-by" aria-selected="false">Кем контрится</a>';
            echo '<a class="nav-item nav-link" id="nav-synergy-tab" data-toggle="tab" href="#nav-synergy" role="tab" aria-controls="nav-synergy" aria-selected="false">Синергия</a>';
            echo '<a class="nav-item nav-link" id="nav-anti-synergy-tab" data-toggle="tab" href="#nav-anti-synergy" role="tab" aria-controls="nav-anti-synergy" aria-selected="false">Анти-синергия</a>';
        echo '</nav>';
        // end of tab links

        // tab content
        echo '<div class="tab-content" id="nav-tabContent">';
            echo '<div class="tab-pane fade show active" id="nav-hero" role="tabpanel" aria-labelledby="nav-hero-tab">';
                // echo '<span id="editHeroAllTagsHeroName" class="blueBold"></span>';
                echo '<div id="editHeroAllTagsHeroImgWrap">';
                    echo '<img>';
                echo '</div>';

                echo '<div id="editHeroAllTagsAbilitiesImgWrap">';

                echo '</div>';

            echo '</div>';

            echo '<div class="tab-pane fade" id="nav-tags" role="tabpanel" aria-labelledby="nav-tags-tab">';
                echo '<div id="editHeroPopupTagsWrap">';

                echo '</div>';
            echo '</div>';

            echo '<div class="tab-pane fade" id="nav-counter-to" role="tabpanel" aria-labelledby="nav-counter-to-tab">';
                echo '<div id="heroPopupCounterToWrap" class="scrollablePanel">';

                echo '</div>';
            echo '</div>';

            echo '<div class="tab-pane fade" id="nav-counter-by" role="tabpanel" aria-labelledby="nav-counter-by-tab">';
                echo '<div id="heroPopupCounterByWrap" class="scrollablePanel">';

                echo '</div>';
            echo '</div>';

            echo '<div class="tab-pane fade" id="nav-synergy" role="tabpanel" aria-labelledby="nav-synergy-tab">';
                echo '<div id="heroPopupSynergyWrap" class="scrollablePanel">';

                echo '</div>';
            echo '</div>';

            echo '<div class="tab-pane fade" id="nav-anti-synergy" role="tabpanel" aria-labelledby="nav-anti-synergy-tab">';
                echo '<div id="heroPopupAntiSynergyWrap" class="scrollablePanel">';

                echo '</div>';
            echo '</div>';
        echo '</div>';
        // end of tab content



        //   echo '<div class="form-group">';
        //       echo '<span id="editHeroTagInfoNone" class="editHeroTagInfoText col-form-label" data-template-text="Выберите героя или способности для тега {TAG}"></span>';
        //       echo '<span id="editHeroTagInfoHero" class="editHeroTagInfoText col-form-label" data-template-text="Назначить тэг {TAG} на героя"></span>';
        //       echo '<span id="editHeroTagInfoAbilities" class="editHeroTagInfoText col-form-label" data-template-text="Назначить тэг {TAG} на выбранные способности"></span>';

        //   echo '</div>';

        //   echo '<div class="form-group">';
        //       echo '<div id="editHeroTagSlider">';
        //           echo '<div id="custom-handle" class="ui-slider-handle"></div>';
        //       echo '</div>';
        //   echo '</div>';

    echo '</div>';
    // echo '<div class="modal-footer">';
    //   echo '<button id="btnEditHeroTagUnset" type="button" class="btn btn-danger" >Снять тэг</button>';
    //   echo '<button id="btnEditHeroTagDo" type="button" class="btn btn-primary">Назначить</button>';
    //   echo '<button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>';
    // echo '</div>';
  echo '</div>';
echo '</div>';
echo '</div>';
// end of popup for hero tag edit


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


echo '</script>';

?>