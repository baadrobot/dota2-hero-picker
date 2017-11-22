<?php
    //Must be required first! cos of start_session()
    require_once('ajax.all.include.php');

    if ($_POST['ajaxType'] == 'getAllTags')
    {
        $query = 'SELECT cf_d2TagList_id as `id`, cf_d2TagList_name_en_US as `name` FROM tb_dota2_tag_list ORDER BY cf_d2TagList_name_en_US;';
        $allTagsResultArray = $dbClass->select($query);

        ajaxReturnAndExit(array('php_result' => 'OK',
                                'tag_array' => $allTagsResultArray
        ));
    }
    elseif ($_POST['ajaxType'] == 'getHeroesWithSelectedTag')
    {
        $query = 'SELECT cf_d2HeroTagSet_hero_id as `id`, cf_d2HeroTagSet_tag_val as `value`
                    FROM tb_dota2_heroTag_set
                    WHERE cf_d2HeroTagSet_tag_id = ?;';
        $heroesWithSelectedTag = $dbClass->select($query, $_POST['tagId']);

        if (count($heroesWithSelectedTag) > 0)
        {
            ajaxReturnAndExit(array('php_result' => 'OK',
                                    'hero_id_and_value_array' => $heroesWithSelectedTag
            ));
        } else {
            ajaxReturnAndExit(array('php_result' => 'OK',
                                    'hero_id_and_value_array' => 'NONE'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'editorEditHeroTag') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'INSERT INTO tb_dota2_heroTag_set
                          SET cf_d2HeroTagSet_hero_id = ?, cf_d2HeroTagSet_tag_id = ?, cf_d2HeroTagSet_tag_val = ?, cf_d2HeroTagSet_selected_abilities = ?
                          ON DUPLICATE KEY UPDATE cf_d2HeroTagSet_tag_val=?, cf_d2HeroTagSet_selected_abilities = ?;';
        $isInsertOk = $dbClass->insert($query, $_POST['heroId'], $_POST['tagId'], $_POST['value'], $_POST['selectedAbilities'], $_POST['value'], $_POST['selectedAbilities']);

        if ($isInsertOk)
        {
            ajaxReturnAndExit(array('php_result'=>'OK'));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array('php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #xjun73-xz738-s872-v2gy76!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'editorGetHeroAbilitiesAndTagSet') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'SELECT cf_d2HeroAbilityList_id as `id`, cf_d2HeroAbilityList_abilityCodename as `abilityCodename`
                    FROM tb_dota2_hero_ability_list
                   WHERE cf_d2HeroAbilityList_heroId = ? AND cf_d2HeroAbilityList_isAbilityIgnored = 0 AND cf_d2HeroAbilityList_isAbilityForbidden = 0
                ORDER BY cf_d2HeroAbilityList_orderPosition;';
        $heroAbilitiesResult = $dbClass->select($query, $_POST['heroId']);

        $query = 'SELECT cf_d2HeroTagSet_tag_val as `value`, cf_d2HeroTagSet_selected_abilities as `selectedAbilities`
                    FROM tb_dota2_heroTag_set
                   WHERE cf_d2HeroTagSet_hero_id = ? AND cf_d2HeroTagSet_tag_id = ?;';
        $tagSetResult = $dbClass->select($query, $_POST['heroId'], $_POST['tagId']);

        if (count($tagSetResult) > 0)
        {
            if ($tagSetResult[0]['selectedAbilities'] == null)
            {
                $tagResult = 'HERO';
            } else {
                $tagResult = $tagSetResult[0]['selectedAbilities'];
            }
            $tagValue = $tagSetResult[0]['value'];
        } else
        {
            $tagResult = 'NONE';
            $tagValue = '';
        }
        ajaxReturnAndExit(array('php_result' => 'OK'
                ,'hero_abilities_array' => $heroAbilitiesResult
                ,'tag_result' => $tagResult
                ,'tag_value' => $tagValue
        ));
    }
    elseif (($_POST['ajaxType'] == 'editorEditHeroTagDeleteHeroTag') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'DELETE FROM tb_dota2_heroTag_set
                        WHERE `cf_d2HeroTagSet_hero_id` = ? AND `cf_d2HeroTagSet_tag_id` = ?;';
        $isDeleteOk = $dbClass->delete($query, $_POST['heroId'], $_POST['tagId']);
        if ($isDeleteOk)
        {
            ajaxReturnAndExit(array( 'php_result'=>'OK'));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #19gs0-kja2j-hwsu5-x66p!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'editorAddNewTag') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'INSERT INTO tb_dota2_tag_list SET cf_d2TagList_name_en_US = ?;';
        $isInsertOk = $dbClass->insert($query, $_POST['tagName']);
        if ($isInsertOk)
        {
            ajaxReturnAndExit(array( 'php_result'=>'OK'));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #32ge3-xmx73-xcik3-d83j!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'editorRenameTag') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'UPDATE tb_dota2_tag_list
                     SET cf_d2TagList_name_en_US = ?
                   WHERE cf_d2TagList_id = ?;';
        $isUpdateOk = $dbClass->update($query, $_POST['renamedTagName'], $_POST['renamedTagId']);

        if ($isUpdateOk)
        {
            ajaxReturnAndExit(array( 'php_result'=>'OK'));
        } else {
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #s3q-ls992-2s9c-0a0a!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'editorDeleteTag') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'DELETE FROM tb_dota2_heroTag_set
                         WHERE `cf_d2HeroTagSet_tag_id` = ?;';
        $isDeleteOkTwo = $dbClass->delete($query, $_POST['tagId']);

        $query2 = 'DELETE FROM tb_dota2_tag_list
                        WHERE `cf_d2TagList_id` = ?;';
        $isDeleteOkOne = $dbClass->delete($query2, $_POST['tagId']);

        if ($isDeleteOkOne && $isDeleteOkTwo)
        {
            ajaxReturnAndExit(array( 'php_result'=>'OK'));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #dj3ja-000s-p1k5n-w6g1!'
            ));
        }
    }
    elseif ($_POST['ajaxType'] == 'getAllBalanceTags')
    {
        $query = "SELECT
                    tb_dota2_tag_balance_set.cf_d2TagBalanceSet_first_tag_id AS firstTagId,
                    tb_dota2_tag_balance_set.cf_d2TagBalanceSet_second_tag_id AS secondTagId,
                    tb_dota2_tag_balance_set.cf_d2TagBalanceSet_balance_value AS value,
                    tb_dota2_tag_balance_set.cf_d2TagBalanceSet_set_type AS setType,
                    IFNULL(tb_lang_vars.cf_siteLang_ru_RU, '') AS d
                FROM tb_dota2_tag_balance_set
                LEFT JOIN tb_lang_vars
                    ON CONCAT('_BALANCE', tb_dota2_tag_balance_set.cf_d2TagBalanceSet_id, '_') = tb_lang_vars.cf_siteLang_pre
                WHERE tb_dota2_tag_balance_set.cf_d2TagBalanceSet_set_type = 1
                AND tb_dota2_tag_balance_set.cf_d2TagBalanceSet_balance_value > 0
                OR tb_dota2_tag_balance_set.cf_d2TagBalanceSet_set_type = 0
                ORDER BY value DESC;";
        $allBalanceTags = $dbClass->select($query);

        // $query = 'SELECT cf_d2TagBalanceSet_first_tag_id as `firstTagId`, cf_d2TagBalanceSet_second_tag_id as `secondTagId`, cf_d2TagBalanceSet_balance_value as `value`
        //             FROM tb_dota2_tag_list
        //            WHERE cf_d2TagList_id > ?;';

        // $allBalanceTags = $dbClass->select($query, 0);

        if (count($allBalanceTags) > 0)
        {
            ajaxReturnAndExit(array('php_result' => 'OK',
                                    'balance_tag_array' => $allBalanceTags
            ));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array('php_result' => 'OK',
            'balance_tag_array' => 'NONE'
            ));
        }

    }
    elseif (($_POST['ajaxType'] == 'editorAddNewTagBalance') && (isGotAccess(_ROLE_EDITOR)))
    {
        $balanceNote = $_POST['textareaValue'];
        if (($_POST['setType'] == 0) || ($_POST['balanceValue'] >= 0))
        {
            $firstTagId = $_POST['firstTagId'];
            $secondTagId = $_POST['secondTagId'];
            $balanceValue = $_POST['balanceValue'];
        } else
        {
            $firstTagId = $_POST['secondTagId'];
            $secondTagId = $_POST['firstTagId'];
            $balanceValue = $_POST['balanceValue'] * -1;

            if ($balanceNote != '')
            {
                $whatReplace = array("{h1}", "{a1}");
                $onWhat   = array("{h3}", "{a3}");
                $balanceNote = str_ireplace($whatReplace, $onWhat, $balanceNote);                
                $whatReplace = array("{h2}", "{a2}", "{h3}", "{a3}");
                $onWhat   = array("{h1}", "{a1}", "{h2}", "{a2}");
                $balanceNote = str_ireplace($whatReplace, $onWhat, $balanceNote);
            }
        }

        $query = 'SELECT cf_d2TagBalanceSet_id as `balanceSetId`
                    FROM tb_dota2_tag_balance_set
                    WHERE cf_d2TagBalanceSet_first_tag_id = ?
                      AND cf_d2TagBalanceSet_second_tag_id = ?;';

        $resultMirrorTagBalance = $dbClass->select($query, $secondTagId, $firstTagId);

        if (count($resultMirrorTagBalance) > 0)
        {
            $query = 'UPDATE tb_dota2_tag_balance_set
                            SET cf_d2TagBalanceSet_first_tag_id = ?
                              , cf_d2TagBalanceSet_second_tag_id = ?
                              , cf_d2TagBalanceSet_balance_value = ?
                            WHERE cf_d2TagBalanceSet_id = ?;';

            $isResultOk1 = $dbClass->update($query, $firstTagId, $secondTagId, $balanceValue, $resultMirrorTagBalance[0]['balanceSetId']);
        } else {
            $query = 'INSERT INTO tb_dota2_tag_balance_set
                            SET cf_d2TagBalanceSet_first_tag_id = ?, cf_d2TagBalanceSet_second_tag_id = ?, cf_d2TagBalanceSet_balance_value = ?, cf_d2TagBalanceSet_set_type = ?
                            ON DUPLICATE KEY UPDATE
                                cf_d2TagBalanceSet_first_tag_id = ?, cf_d2TagBalanceSet_second_tag_id = ?, cf_d2TagBalanceSet_balance_value = ?;';

            $isResultOk1 = $dbClass->insert($query, $firstTagId, $secondTagId, $balanceValue, $_POST['setType']
                                                , $firstTagId, $secondTagId, $balanceValue);
        }

        if ($balanceNote == '')
        {
            // delete balance notes
            $query = 'DELETE FROM tb_lang_vars
                            WHERE cf_siteLang_pre = CONCAT("_BALANCE", (SELECT cf_d2TagBalanceSet_id 
                                                    FROM tb_dota2_tag_balance_set 
                                                    WHERE cf_d2TagBalanceSet_first_tag_id = ? AND cf_d2TagBalanceSet_second_tag_id = ? LIMIT 1), "_");';

            $isResultOk2 = $dbClass->delete($query, $firstTagId, $secondTagId);
        } else {
            // insert/update balance notes
            $query = 'INSERT INTO tb_lang_vars
                            SET cf_siteLang_module = ?
                                , cf_siteLang_pre = CONCAT("_BALANCE", (SELECT cf_d2TagBalanceSet_id 
                                                    FROM tb_dota2_tag_balance_set 
                                                    WHERE cf_d2TagBalanceSet_first_tag_id = ? AND cf_d2TagBalanceSet_second_tag_id = ? LIMIT 1), "_")
                                , cf_siteLang_ru_RU = ?
                    ON DUPLICATE KEY UPDATE cf_siteLang_ru_RU = ?;';

            $isResultOk2 = $dbClass->insert($query, 'NOTES', $firstTagId, $secondTagId, $balanceNote, $balanceNote);            
        }

        if ($isResultOk1 && $isResultOk2)
        {
            ajaxReturnAndExit(array('php_result'=>'OK'));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array('php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #j2h4n-8ui2-n9a7-j2j!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'editorDeleteTagBalance') && (isGotAccess(_ROLE_EDITOR)))
    {
        $query = 'DELETE FROM tb_dota2_tag_balance_set
                         WHERE (cf_d2TagBalanceSet_first_tag_id = ? AND cf_d2TagBalanceSet_second_tag_id = ?) OR (cf_d2TagBalanceSet_first_tag_id = ? AND cf_d2TagBalanceSet_second_tag_id = ?);';
        $isDeleteOkOne = $dbClass->delete($query, $_POST['firstTagId'], $_POST['secondTagId'], $_POST['secondTagId'], $_POST['firstTagId']);

        // $query2 = 'DELETE FROM tb_dota2_tag_balance_set
        //                 WHERE cf_d2TagBalanceSet_second_tag_id = ? AND cf_d2TagBalanceSet_first_tag_id = ?;';
        // $isDeleteOkTwo = $dbClass->delete($query2, $_POST['secondTagId'], $_POST['firstTagId']);

        if ($isDeleteOkOne)
        {
            ajaxReturnAndExit(array( 'php_result'=>'OK'));
        } else {
            // no ajaxType in request
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #k66km-77s-1p0sd-xcv7!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'masterGetAllIgnoredAbilities') && (isGotAccess(_ROLE_MASTER)))
    {
        $query = 'SELECT cf_d2HeroAbilityList_id as `id`
                    FROM tb_dota2_hero_ability_list
                    WHERE cf_d2HeroAbilityList_isAbilityIgnored = ?;';

        $allIgnoredAbilitiesId = $dbClass->select($query, 1);

        ajaxReturnAndExit(array('php_result' => 'OK',
                                'ignored_abilities_id_array' => $allIgnoredAbilitiesId
        ));
    }
    elseif (($_POST['ajaxType'] == 'masterSetAbilityIgnore') && (isGotAccess(_ROLE_MASTER)))
    {
        if ($_POST['isIgnore'] == 0)
        {
            $isIgnore = 0;
        } else {
            $isIgnore = 1;
        }

        $query = 'UPDATE tb_dota2_hero_ability_list
                     SET cf_d2HeroAbilityList_isAbilityIgnored = ?
                   WHERE cf_d2HeroAbilityList_id = ?;';

        $isUpdateOk = $dbClass->update($query, $isIgnore, $_POST['tagId']);

        if ($isUpdateOk)
        {
            ajaxReturnAndExit(array( 'php_result'=>'OK',
                                  'php_is_ignore'=>$isIgnore,
                                     'php_tag_id'=>$_POST['tagId']));
        } else {
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'Ability ignore has not been updated! Error #g4na32-gv89m-0980v-2n308-3fr6v!'
            ));
        }
    }
    elseif (($_POST['ajaxType'] == 'masterSetManuals') && (isGotAccess(_ROLE_MASTER)))
    {
        $query = 'UPDATE tb_dota2_hero_ability_list
                     SET cf_d2HeroAbilityList_manualBuffDispellableB = ?
                        , cf_d2HeroAbilityList_manualBuffDispellableS = ?
                        , cf_d2HeroAbilityList_manualDebuffDispellableB = ?
                        , cf_d2HeroAbilityList_manualDebuffDispellableS = ?
                        , cf_d2HeroAbilityList_isConfirmed = 1
                   WHERE cf_d2HeroAbilityList_id = ?;';
        $isUpdateOk = $dbClass->update($query, $_POST['checkbox1'], $_POST['checkbox2'], $_POST['checkbox3'], $_POST['checkbox4'], $_POST['abilityId']);

        if ($isUpdateOk)
        {
             $query = 'SELECT updateDispellableAbilitiesTags(NULL);';
             $dbClass->select($query);

            ajaxReturnAndExit(array( 'php_result'=>'OK'));
        } else {
            ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                    'php_error_msg'=>'New tag has not been created! Error #ks8z-qq0q-vntt-47281!'
            ));
        }
    }
    else
    {
        ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                'php_error_msg'=>"Access denied, please login to your account!"
        ));
    }
?>