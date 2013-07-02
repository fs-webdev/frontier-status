var superagent = require('superagent');
var domready = require('domready');
var cookie = require('cookie');
var json = require('json');

var accessToken = cookie('accessToken');
var org = '';

if (typeof accessToken !== 'undefined') {
  superagent.get('https://api.github.com/orgs/fs-webdev/repos')
  .set('Authorization', 'bearer ' + accessToken)
  .end(function(data) {
    domready(function() {
      for (var i = 0; i < data.body.length; i++) {
        getPackageContents(data.body[i].name, 'fs-webdev');
      }
    });
  });

  // superagent.get('https://api.github.com/orgs/FamilySearch/repos')
  // .set('Authorization', 'bearer ' + accessToken)
  // .end(function(data) {
  //   domready(function() {
  //     for (var i = 0; i < data.body.length; i++) {
  //       getPackageContents(data.body[i].name, 'FamilySearch');
  //     }
  //   });
  // });
}

function getPackageContents (repoName, org) {
      var repoList = document.getElementById('repos');

      superagent.get('https://api.github.com/repos/' + org + '/' + repoName + '/contents/package.json')
      .set('Accept', 'application/vnd.github.raw+json')
      .set('Authorization', 'bearer ' + accessToken)
      .end(function(data) {
        if (data.ok) {
          var repo = {};
          try {
            repo = json.parse(data.text);
          } catch(ex) {
            console.log('ex:', ex);
          }

          if (repo.dependencies && repo.dependencies !== null && typeof repo.dependencies['shared-ui'] !== 'undefined') {
            var tr = document.createElement('tr');
            var nameTr = document.createElement('td');
            var repoTr = document.createElement('td');
            nameTr.appendChild(document.createTextNode(repo.name));
            nameTr.className = 'name';
            repoTr.appendChild(document.createTextNode(repo.dependencies['shared-ui']));
            tr.appendChild(nameTr);
            tr.appendChild(repoTr);
            repoList.appendChild(tr);
          }

        }
      });
}