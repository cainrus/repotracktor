<div class="btn-group btn-group-xs btn-group-justified" role="group">
  <a class='rate-up btn btn-primary {{#if isVotedUp}}active{{/if}}'>
    <span class="glyphicon glyphicon-thumbs-up"></span>
  </a>
  <a class='rate-total btn btn-primary disabled'>{{total}}</a>
  <a class='rate-down btn btn-danger {{#if isVotedDown}}active{{/if}}'>
    <span class="glyphicon glyphicon-thumbs-down"></span>
  </a>
</div>
