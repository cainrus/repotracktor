{{#if text}}
<div class="alert alert-danger alert-dismissible" role="alert">
    <!--<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>-->
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <span class="sr-only">Error:</span>
    {{text}}
</div>
{{/if}}
