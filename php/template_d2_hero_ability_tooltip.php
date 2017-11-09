<?php

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

?>