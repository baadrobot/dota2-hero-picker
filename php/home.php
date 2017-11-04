<?php
    global $dbClass;    

    echo 'Welcome home!';
    echo '<br />';
    if (isGotAccess(_ROLE_EDITOR))
    {
        echo '<a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=editor">Открыть редактор героев</a>';
    }
?>