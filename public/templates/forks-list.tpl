{{#if items}}
<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">Forks list<span class="toggler pull-right glyphicon glyphicon-eye-open"></span></div>
  <!-- <div class="panel-body">
    <p>Description here</p>
  </div> -->

  <!-- Table -->
  <table class="table">
    <tr>
      <th>repository</th>
      <th>updated</th>
      <th>starred</th>
      <th>rate</th>
    </tr>
    {{#each items}}
    <tr>
      <td>
        <a href="{{html_url}}">@{{owner.login}}</a>
      </td>
      <td>
        {{#date}}{{updated_at}}{{/date}}
      </td>
      <td>
        <span class="glyphicon octicon octicon-eye"  aria-hidden="true"></span><span class="badge">{{watchers}}</span>
      </td>
      <td class="rate-cell">
        <div class="rateControl" data-id="{{id}}" data-type="fork"></div>
      </td>
    </tr>
    {{/each}}
  </table>
</div>
{{/if}}
