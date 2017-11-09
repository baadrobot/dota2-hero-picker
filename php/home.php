<?php
    global $dbClass;

    echo '<div>Welcome home!</div>';

    if (isGotAccess(_ROLE_MASTER))
    {
        echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=master">Открыть мастер редактор</a></div>';
    }

    if (isGotAccess(_ROLE_EDITOR))
    {
        echo '<div><a href="/index.php?lang='.$_SESSION['SUserLang'].'&component=editor">Открыть редактор баланса</a></div>';
    }


?>