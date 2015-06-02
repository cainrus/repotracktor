{{#if items}}
<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">Repository contributors<span class="toggler pull-right glyphicon glyphicon-eye-open"></span></div>
  <!-- <div class="panel-body">
    <p>Vote for your favorite contributors</p>
  </div> -->

  <!-- Table -->
  <table class="table col-md-12">
    <tr>
      <th></th>
      <th>name</th>
      <th>repositories</th>
      <th>gists</th>
      <th>followers</th>
      <th>email</th>
      <th>rate</th>
    </tr>
    {{#each items}}
    <tr>
      <td>
        <a  class="shake shake-little" href="{{html_url}}">
          <img src="{{avatar_url}}" alt="Avatar" width=40 height=40>
        </a>
      </td>
      <td>
        <a  class="shake shake-little" href="{{html_url}}">
          <strong>{{name}} @{{login}}</strong>
        </a>
      </td>
      <td>
        <span class="glyphicon octicon octicon-repo"  aria-hidden="true"></span><span class="badge">{{public_repos}}</span>
      </td>
      <td>
        <span class="glyphicon octicon octicon-gist"  aria-hidden="true"></span><span class="badge">{{public_gists}}</span>
      </td>
      <td>
        <span class="glyphicon octicon octicon-heart"  aria-hidden="true"></span><span class="badge">{{followers}}</span>
      </td>
      <td>
        {{#if email}}<a  class="shake shake-slow" href="mailto:{{email}}" title="Email"><span class="glyphicon octicon octicon-mail"></span></a>{{/if}}
      </td>
      <td class="rate-cell">
        <div class="rateControl" data-id="{{id}}" data-type="collaborator"></div>
      </td>

    </tr>
    {{/each}}
  </table>
</div>
{{/if}}
