<?php
    
        echo '<div id="pleaseWait" class="modal loader">';
            echo '<div class="modal-dialog" style="display:none"></div>';
        echo '</div>';

        // -------------- edit hero tag delete dialog popup
        echo
        '<div id="confirmDialog" class="modal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 id="confirmDialogTitle" class="modal-title"></h5>
                </div>
                
                <div id="confirmDialogText" class="modal-body"></div>

                <div class="modal-footer">
                    <button id="btnConfirmDialogDelete" type="button" data-dismiss="modal"></button>
                    <button id="btnConfirmDialogOK" type="button" data-dismiss="modal"></button>
                    <button id="btnConfirmDialogCancel" type="button" class="btn btn-secondary" data-dismiss="modal"></button>
                </div>
                </div>
            </div>
        </div>';
    echo '</body>';
echo '</html>';

?>