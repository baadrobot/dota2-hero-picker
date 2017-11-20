<?php

// -------------- Hero Ability Tooltip
echo '<div id="abilityTooltip" style="display: none;">';
    echo '<div class="iconTooltip iconTooltip_ability">';
        echo '<div class="abilityName"></div>';
        echo '<div class="abilityHR1"></div>';
        echo '<div class="abilityTarget"></div>';

        echo '<div id="abilityDispellable">РАЗВЕИВАНИЕ: <span class="attribVal"></span></div>';

        echo '<div class="abilityHR2"></div>';
        echo '<div class="abilityDesc"></div>';
        echo '<div class="abilityNotes"></div>';
        echo '<div class="abilityDmg"></div>';

        
        echo '<div class="abilityAttrib">DAMAGE: <span class="attribVal">0.6 / 0.85 / 1.1</span>';
                                echo '<br>STUN DURATION: <span class="attribVal">0.3</span>';
 
                                echo '<br>RADIUS: <span class="attribVal">500</span>';
 
        echo '</div>';


        echo '<div class="abilityCMB">';
            echo '<div class="cooldownMana">';
                echo '<div class="mana"><img alt="Mana Cost" title="Mana Cost" class="manaImg" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" width="16" height="16" border="0"> 125/200/275</div>';
                echo '<div class="cooldown"><img alt="Cooldown" title="Cooldown" class="cooldownImg" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" width="16" height="16" border="0"> 70</div>';
                echo '<br clear="left">';
            echo '</div>';
        echo '</div>';
        echo '<div class="abilityLore"></div>';
        //echo '<div class="BaseArrow ArrowLeft" style="left: 0px; top: 402px;"></div>';
    echo '</div>';
echo '</div>';

?>