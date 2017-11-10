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
    //nurax - доделать!
    elseif ($_POST['ajaxType'] == 'getAllBalanceTags')
    {
        $query = 'SELECT cf_d2TagBalanceSet_first_tag_id as `firstTagId`, cf_d2TagBalanceSet_second_tag_id as `secondTagId`, cf_d2TagBalanceSet_balance_value as `value`, cf_d2TagBalanceSet_set_type as `setType`
                    FROM tb_dota2_tag_balance_set
                    WHERE (cf_d2TagBalanceSet_balance_value > 0 AND cf_d2TagBalanceSet_set_type = 1)
                    OR    (cf_d2TagBalanceSet_set_type = 0);';

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

        if ($_POST['setType'] == 0)
        {
            $query = 'INSERT INTO tb_dota2_tag_balance_set
                            SET cf_d2TagBalanceSet_first_tag_id = ?, cf_d2TagBalanceSet_second_tag_id = ?, cf_d2TagBalanceSet_balance_value = ?, cf_d2TagBalanceSet_set_type = ?
                            ON DUPLICATE KEY UPDATE cf_d2TagBalanceSet_first_tag_id = ?, cf_d2TagBalanceSet_second_tag_id = ?, cf_d2TagBalanceSet_balance_value = ?;';

            $isInsertOk = $dbClass->insert($query, $_POST['firstTagId'], $_POST['secondTagId'], $_POST['balanceValue'], $_POST['setType'], $_POST['firstTagId'], $_POST['secondTagId'], $_POST['balanceValue']);
        } else if (($_POST['setType'] == 1) && (($_POST['firstTagId']) != ($_POST['secondTagId'])))
        {
            $query = 'INSERT INTO tb_dota2_tag_balance_set
            SET cf_d2TagBalanceSet_first_tag_id = ?, cf_d2TagBalanceSet_second_tag_id = ?, cf_d2TagBalanceSet_balance_value = ?, cf_d2TagBalanceSet_set_type = ?
            ON DUPLICATE KEY UPDATE cf_d2TagBalanceSet_first_tag_id = ?, cf_d2TagBalanceSet_second_tag_id = ?, cf_d2TagBalanceSet_balance_value = ?;';

            $isInsertOk = $dbClass->insert($query, $_POST['firstTagId'], $_POST['secondTagId'], $_POST['balanceValue'], $_POST['setType'], $_POST['firstTagId'], $_POST['secondTagId'], $_POST['balanceValue']);
        } else {
            ajaxReturnAndExit(array('php_result'=>'ERROR',
                'php_error_msg'=>'New tag has not been created! Error #j2h4n-8ui2-n9a7-j2j!'
            ));
        }

        if ($isInsertOk)
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
    else
    {
        ajaxReturnAndExit(array( 'php_result'=>'ERROR',
                                'php_error_msg'=>"Access denied, please login to your account!"
        ));
    }
?>