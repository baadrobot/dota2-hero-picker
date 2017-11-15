<?php
    global $dbClass;

    echo '<div>Welcome home!</div>';

    if (isGotAccess(_ROLE_MASTER))
    {
        echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=user_profile">Профайл пользователя</a></div>';
        echo '<br>';
    }


    if (isGotAccess(_ROLE_EDITOR))
    {
        echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=editor">Открыть редактор баланса</a></div>';
    }
    if (isGotAccess(_ROLE_MASTER))
    {
        echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=master">Открыть мастер редактор</a></div>';
    }


?>

<!-- <div class="form-check form-check-inline">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="counterpickOrSynergy" checked="checked" value="1"> Контрпик
  </label>
</div>
<div class="form-check form-check-inline">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="counterpickOrSynergy" value="0"> Синергия
  </label>
</div> -->