<?php
    global $dbClass;    
    
    $query = 'SELECT cf_d2HeroList_id as `id`    
                    ,cf_d2HeroList_name_en_US as `n`
                    ,cf_d2HeroList_codename as `cn`
                    ,cf_d2HeroList_primary_attr as `a`
                    -- ,cf_d2HeroList_icon as `icon`
                FROM tb_dota2_hero_list ORDER BY cf_d2HeroList_name_en_US;';
    
    $hero_array = $dbClass->select($query);

    echo '<script>';
        echo 'window.heroList = '.json_encode($hero_array).';';
    echo '</script>';

    // $query = 'SELECT cf_d2TagList_id, cf_d2TagList_name_en_US
    //             FROM tb_dota2_tag_list ORDER BY cf_d2TagList_name_en_US;';

    // $tag_array = $dbClass->select($query);

    function getHeroImgPath($heroCodeName, $type = 'vert')
    {
        if ($type == 'vert')
        {
            return '//cdn.dota2.com/apps/dota2/images/heroes/'.$heroCodeName.'_vert.jpg?v=4195662';
        } else if ($type == 'full') {
            return '//cdn.dota2.com/apps/dota2/images/heroes/'.$heroCodeName.'_full.png?v=4195662';
        }
    }

    function getHeroImg($heroNameLocal, $heroId, $heroCodeName)
    {
        return '<div class="heroListImg" data-hero-id="'.$heroId.'" data-hero-codename="'.$heroCodeName.'" data-hero-name="'.$heroNameLocal.'"><img src="'.getHeroImgPath($heroCodeName).'" /></div>';        
    }

    echo '<div class="container-fluid">';
        echo '<div class="row">';
            echo '<div id="heroListWrap" class="col-8">';
                // hero list >>>>>>>>>>>>>>>>>
            echo '</div>';


// ----------------------------- Editor panel

            echo '<div class="col-4">';

                // echo '<div class="row">';
                //     echo '<div class="card col-12">';
                //         echo '<div class="card-body">';
                //             echo '<span class="h4 text-secondary">Список тэгов</span>';
                //             echo '<i id="btnCreateNewTagPopup" class="fa fa-plus-square text-secondary" aria-hidden="true"></i>';
                //             echo '<i id="btnDeleteSelectedTagPopup" class="fa fa-minus-square text-secondary" aria-hidden="true"></i>';

                //             echo '<p id="tagListWrap">';
                //                 // for ($i=0; $i < count($tag_array); $i++)
                //                 // {
                //                 //     echo '<span class="tag">['.$tag_array[$i]['cf_d2TagList_name_en_US'].']</span>';
                //                 // }
                //             echo '</p>';
                //         echo '</div>';
                //     echo '</div>';
                // echo '</div>';

                // echo '<div class="row">';
                //     echo '<div class="card col-12">';
                //         echo '<div class="card-body">';
                //             echo '<span class="h4 text-secondary">Список тэгов</span>';
                //             echo '<i id="btnCreateNewTagPopup" class="fa fa-plus-square text-secondary" aria-hidden="true"></i>';
                //             echo '<i id="btnDeleteSelectedTagPopup" class="fa fa-minus-square text-secondary" aria-hidden="true"></i>';

                //             echo '<p id="tagListWrap">';
                //                 // for ($i=0; $i < count($tag_array); $i++)
                //                 // {
                //                 //     echo '<span class="tag">['.$tag_array[$i]['cf_d2TagList_name_en_US'].']</span>';
                //                 // }
                //             echo '</p>';
                //         echo '</div>';
                //     echo '</div>';
                // echo '</div>';



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
                                // Tag List >>>>>>>>>>>>>>>>>>>>
                            echo '</p>';
                        echo '</div>';
                    echo '</div>';
                    echo '<div class="item">';
                        echo '<a class="accordionHeader" data-toggle="collapse" data-parent="#editAccordion" href="#editAccordion2" aria-expanded="false" aria-controls="editAccordion2">';
                            echo '<span class="h4 text-secondary">Баланс тэгов</span>';
                        echo '</a>';
                        echo '<i id="btnCreateNewBalancePopup" class="fa fa-plus-square text-secondary acrdHdrBtn hvrDrkGr" aria-hidden="true"></i>';
                        //echo '<i id="btnDeleteSelectedBalancePopup" class="fa fa-minus-square text-secondary acrdHdrBtn hvrMaroon" aria-hidden="true"></i>';

                        echo '<div id="editAccordion2" class="collapse" role="tabpanel">';
                            echo '<p class="mb-3">';
                                echo 'Donec at ipsum dignissim, rutrum turpis scelerisque, tristique lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus nec dui turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';
                            echo '</p>';
                        echo '</div>';
                    echo '</div>';
                echo '</div>';

/*
                echo '<div class="row">';
                    echo '<div class="card col-12">';
                        echo '<div class="card-body">';
                            echo '<h6 class="text-secondary">Баланс с вражескими героями:</h6>';
                            echo '<p class="heroBalancePanel">';
                                echo '<span><span class="heroBalance plus">+70</span><img src="'.getHeroImgPath('beastmaster', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+70</span><img src="'.getHeroImgPath('mirana', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+70</span><img src="'.getHeroImgPath('batrider', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+70</span><img src="'.getHeroImgPath('bane', 'full').'"></span>';
                                echo '<span><span class="heroBalance minus">-40</span><img src="'.getHeroImgPath('axe', 'full').'"></span>';
                                echo '<span><span class="heroBalance minus">-80</span><img src="'.getHeroImgPath('ancient_apparition', 'full').'"></span>';
                            echo '</p>';
                        echo '</div>';
                    echo '</div>';
                echo '</div>';

                echo '<div class="row">';
                    echo '<div class="card col-12">';
                        echo '<div class="card-body">';
                            echo '<h6 class="text-secondary">Синергия с союзными героями:</h6>';
                            echo '<p class="heroBalancePanel">';
                                echo '<span><span class="heroBalance plus">+30</span><img src="'.getHeroImgPath('ember_spirit', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+30</span><img src="'.getHeroImgPath('weaver', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+30</span><img src="'.getHeroImgPath('night_stalker', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+20</span><img src="'.getHeroImgPath('bristleback', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+20</span><img src="'.getHeroImgPath('slardar', 'full').'"></span>';
                                echo '<span><span class="heroBalance plus">+20</span><img src="'.getHeroImgPath('viper', 'full').'"></span>';
                            echo '</p>';
                        echo '</div>';
                    echo '</div>';
                echo '</div>';  
*/                              
            echo '</div>';
        echo '</div>';
    echo '</div>';







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
        //   <div class="form-group">
        //     <label for="message-text" class="col-form-label">Message:</label>
        //     <textarea class="form-control" id="message-text"></textarea>
        //   </div>
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



// -------------- Hero Ability Tooltip
echo '<div id="abilityTooltip" style="display: none;">';
    echo '<div class="iconTooltip iconTooltip_ability">';
        echo '<div class="abilityName"></div>'; //Mana Void
        echo '<div class="abilityHR1"></div>'; // empty ??
        echo '<div class="abilityTarget">ABILITY: <span class="attribVal">Unit Target</span>
                                <br>AFFECTS: <span class="attribVal">Enemy Units</span>
                                <br>DAMAGE TYPE: <span class="attribVal">Magical</span>
                                <br>PIERCES SPELL IMMUNITY: <span class="attribVal"><font color="#70EA72">Yes</font></span><br>
        </div>';
        echo '<div class="abilityHR2"></div>';
        echo '<div class="abilityDesc">For each point of mana missing by the target unit, damage is dealt to it and surrounding enemies.  The main target is also mini-stunned.</div>';
        echo '<div class="abilityNotes">The stun passes through spell immunity.<br>Damage is calculated based on the primary target\'s mana, but applied to all enemies within the area of effect.</div>';
        echo '<div class="abilityDmg"></div>';
        echo '<div class="abilityAttrib">DAMAGE: <span class="attribVal">0.6 / 0.85 / 1.1</span>
                                <br>STUN DURATION: <span class="attribVal">0.3</span>
                                <br>RADIUS: <span class="attribVal">500</span>
        </div>';
        echo '<div class="abilityCMB">';
            echo '<div class="cooldownMana">';
                echo '<div class="mana"><img alt="Mana Cost" title="Mana Cost" class="manaImg" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" width="16" height="16" border="0"> 125/200/275</div>';
                echo '<div class="cooldown"><img alt="Cooldown" title="Cooldown" class="cooldownImg" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" width="16" height="16" border="0"> 70</div>';
                echo '<br clear="left">';
            echo '</div>';
        echo '</div>';
        echo '<div class="abilityLore">After bringing enemies to their knees, Anti-Mage punishes them for their use of the arcane arts.</div>';
        //echo '<div class="BaseArrow ArrowLeft" style="left: 0px; top: 402px;"></div>';
    echo '</div>';
echo '</div>';


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

    echo 'window.LangPreStr["EDITOR"]["_CREATE_BALANCE_"] = "Создание баланса между тэгами";';
    
echo '</script>';

?>