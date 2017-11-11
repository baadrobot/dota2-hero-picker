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
        echo '<div class="row">';

            echo '<div id="heroListWrap" class="col-8">';
                echo
                '<div class="input-group smlGrp">
                    <input id="SearchHeroAliasInput" type="text" class="form-control" placeholder="Поиск героев"/>
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                </div>';

                echo
                '<div class="input-group smlGrp">
                    <input id="SearchAbilityInput" type="text" class="form-control" placeholder="Поиск по способностям"/>
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                </div>';
            echo '</div>';


// ----------------------------- Editor panel

            echo '<div class="col-4">';

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
                            echo '<p id="tagBalanceListWrap" class="mb-3">';

                                echo '<span>Загрузка...</span>';

                            echo '</p>';
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
echo
'<div id="editHeroTagPopup" class="modal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Назначение тэга</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <span id="editHeroTagHeroName" class="blueBold"></span>
            <div id="editHeroTagHeroImgWrap">
                <img>
            </div>

            <div id="editHeroTagAbilitiesImgWrap">

            </div>

            <div class="form-group">
                <span id="editHeroTagInfoNone" class="editHeroTagInfoText col-form-label" data-template-text="Выберите героя или способности для тега {TAG}"></span>
                <span id="editHeroTagInfoHero" class="editHeroTagInfoText col-form-label" data-template-text="Назначить тэг {TAG} на героя"></span>
                <span id="editHeroTagInfoAbilities" class="editHeroTagInfoText col-form-label" data-template-text="Назначить тэг {TAG} на выбранные способности"></span>';

echo '
            </div>

            <div class="form-group">
                <div id="editHeroTagSlider">
                    <div id="custom-handle" class="ui-slider-handle"></div>
                </div>
            </div>';


echo
      '</div>
      <div class="modal-footer">
        <button id="btnEditHeroTagUnset" type="button" class="btn btn-danger" >Снять тэг</button>
        <button id="btnEditHeroTagDo" type="button" class="btn btn-primary">Назначить</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
      </div>
    </div>
  </div>
</div>';



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
    echo 'window.LangPreStr["EDITOR"]["_SET_"] = "Назначить";';

    echo 'window.LangPreStr["EDITOR"]["_SET_BALANCE_"] = "Назначение баланса между тэгами";';


echo '</script>';

?>