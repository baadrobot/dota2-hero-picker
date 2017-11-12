<?php

            echo '<div id="pleaseWait" class="modal loader">';
                echo '<div class="modal-dialog" style="display:none"></div>';
            echo '</div>';

            // -------------- edit hero tag delete dialog popup
            
            echo '<div id="confirmDialog" class="modal" tabindex="-1" role="dialog" aria-hidden="true">';
                echo '<div class="modal-dialog" role="document">';
                    echo '<div class="modal-content">';
                    echo '<div class="modal-header">';
                        echo '<h5 id="confirmDialogTitle" class="modal-title"></h5>';
                    echo '</div>';

                    echo '<div id="confirmDialogText" class="modal-body"></div>';

                    echo '<div class="modal-footer">';
                        echo '<button id="btnConfirmDialogDelete" type="button" data-dismiss="modal"></button>';
                        echo '<button id="btnConfirmDialogOK" type="button" data-dismiss="modal"></button>';
                        echo '<button id="btnConfirmDialogCancel" type="button" class="btn btn-secondary" data-dismiss="modal"></button>';
                    echo '</div>';
                    echo '</div>';
                echo '</div>';
            echo '</div>';

        echo '</div>'; // end of container
    echo '</body>';
echo '</html>';

?>