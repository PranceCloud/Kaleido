/**
 * Created by Fred.Wu on 2016/6/17.
 */
//  var kaleido_admin = {
//    project_name: 'admin'
//  };

var kaleido_admin = riot.observable();
kaleido_admin.admin_project = 'kaleido';
kaleido_admin.project_name = kaleido_admin.admin_project;
kaleido_admin.project_path = "";
kaleido_admin.project_allow_manage_ip = "";
kaleido_admin.admin_url = 'm';
kaleido_admin.base_url = '/';
kaleido_admin.project_prefix_url = 'project';

kaleido_admin.is_login = false;
kaleido_admin.is_admin = false;
kaleido_admin.admin_role_name = "admin";

kaleido_admin.username = "Guest";
kaleido_admin.session = null;
kaleido_admin.projects = [];
kaleido_admin.auth = {role: '', user: ''};

kaleido_admin.models = [];

var dd;

kaleido_admin.reset = function () {
  kaleido_admin.username = "Guest";
  kaleido_admin.is_login = false;
  kaleido_admin.is_admin = false;
  kaleido_admin.project_name = kaleido_admin.admin_project;
  kaleido_admin.models = {};
};

kaleido_admin.init_projects = function () {
  $.getJSON(this.base_url + this.admin_url + '/projects', function (projects) {
    kaleido_admin.projects = projects;
  });
};

kaleido_admin.refresh_session = function (backcall) {
  $.getJSON(kaleido_admin.base_url + 'me')
    .done(function (data) {
      dd = data;
      if ((_.isObject(data.account)) && (_.size(data.account) > 0)) {
        _.each(data.account, function (val, key) {
          kaleido_admin.username = val.auth.login_name;
          kaleido_admin.userrole = val.auth.role;
          kaleido_admin.project_name = key;
          kaleido_admin.auth = val.auth;
          if (key == kaleido_admin.admin_project) {
            kaleido_admin.is_admin = true;
            kaleido_admin.init_projects();
          }
        });
        kaleido_admin.is_login = true;
      }
    }).then(function () {
    if (typeof backcall == 'function') {
      backcall();
    }
  });

};

kaleido_admin.login = function (project_name, params, backcall) {
  $.ajax({
    url: kaleido_admin.base_url + "csrf",
    dataType: "json"
  }).done(function (data) {
    if (typeof data == "object") {
      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        jqXHR.setRequestHeader('X-CSRF-Token', data.csrf);
      });
      var project_auth_url = kaleido_admin.admin_url;
      if (project_name != kaleido_admin.admin_project) {
        project_auth_url = kaleido_admin.project_prefix_url + "/" + project_name;
      }
      $.post('/' + project_auth_url + '/auth/login',
        {
          'login_name': params.login_name,
          'login_password': md5(md5(params.login_password) + data.csrf),
          'csrf': data.csrf
        }).done(function (data) {
        console.log(data);
        kaleido_admin.trigger('login', data);
        if (data.status == true) {
          kaleido_admin.username = data.value.login_name;
          kaleido_admin.userrole = data.value.role;
          kaleido_admin.project_name = project_name;

          kaleido_admin.is_login = true;
          var redirect_url = '';
          if (kaleido_admin.project_name == kaleido_admin.admin_project) {
            kaleido_admin.is_admin = true;
            redirect_url = 'admin';
          } else {
            redirect_url = kaleido_admin.project_prefix_url + "/" + kaleido_admin.project_name;
          }
          kaleido_admin.refresh_session(function () {
            riot.update();
            riot.route(redirect_url);
          });
        }
      });
    }
  }).always(function () {
    if (typeof backcall == 'function') {
      backcall();
    }
  });
};

riot.mount('nav_in_menu', kaleido_admin);
riot.mount('nav_in_user', kaleido_admin);

//
kaleido_admin.refresh_session(function () {
  kaleido_admin.project_load();

  riot.route.exec();
  riot.update();
});

kaleido_admin.project_load = function () {
  $.getJSON(kaleido_admin.base_url +
      kaleido_admin.project_prefix_url + '/' +
      kaleido_admin.project_name + '/')
    .done(function (data) {
      kaleido_admin.models = data.model.data;
      kaleido_admin.project_path = data.path;
      kaleido_admin.project_allow_manage_ip = data.allowIP;
      kaleido_admin.trigger('project_load');
    });
};

kaleido_admin.project_update = function (project) {
  $.getJSON('/csrf')
    .done(
      function (data) {
        if (typeof data == "object") {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            jqXHR.setRequestHeader('X-CSRF-Token', data.csrf);
          });
          $.ajax({
            method: 'POST',
            url: '/project/' + kaleido_admin.project_name + '/update',
            data: JSON.stringify(project),
            contentType: 'application/json',
            success: function (j) {
              kaleido_admin.project_load();
              riot.update();
              kaleido_admin.trigger('project_update');
            }
          });
        }
      });
};

// model
kaleido_admin.model_load = function () {
  kaleido_admin.project_load();
  kaleido_admin.trigger('model_load');
};

kaleido_admin.model_create = function (model) {
  kaleido_admin.models.push(model);
  console.log(kaleido_admin.models);
  kaleido_admin.trigger('model_create', model);
};

kaleido_admin.field_insert = function (model_name) {
  var new_field = {name: _.random(1000, 10000), attrs: {}, type: 'string'}
  _.each(kaleido_admin.models, function (m, j) {
    if (m.name == model_name) {
      kaleido_admin.models[j].fields.push(new_field)
    }
  });
  return new_field;
};

kaleido_admin.field_delete = function (model_name, delete_data) {
  _.each(kaleido_admin.models, function (m, j) {
    if (m.name == model_name) {
      kaleido_admin.models[j].fields = _.filter(m.fields, function (f) {
        return delete_data.name != f.name;
      })
    }
  });
  console.log("kaleido_admin.models ", kaleido_admin.models);
};

kaleido_admin.field_update = function (model_name, update_data) {
  console.log("kaleido_admin.field_update() ", model_name);
  console.log("field_update_data ", update_data);
  console.log("kaleido_admin.models ", kaleido_admin.models);
  _.each(kaleido_admin.models, function (m, j) {
    if (m.name == model_name) {
      _.each(m.fields, function (f, i) {
        var key = (update_data.key == "") ? f.name : update_data.key;
        if (key == f.name) {
          console.log(kaleido_admin.models[j].fields[i]);
          kaleido_admin.models[j].fields[i] = update_data;
        }
      })
    }
  });
  console.log("kaleido_admin.models ", kaleido_admin.models);

  kaleido_admin.trigger('field_update')
};

kaleido_admin.model_update = function (model) {
  console.log("kaleido_admin.model_update() ", model);
  console.log("kaleido_admin.models ", kaleido_admin.models);
  _.each(kaleido_admin.models, function (m, j) {
    if (m.name == model.key) {
      kaleido_admin.models[j].name = model.name;
      kaleido_admin.models[j].defined = model.defined;
    }
  });
  var Post_model = {};
  Post_model = _.find(kaleido_admin.models, function (m) {
    return model.name == m.name
  });
  Post_model.key = model.key;
  Post_model.defined = model.defined;
//    console.log(Post_model);
  $.getJSON('/csrf',
    function (data) {
      if (typeof data == "object") {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
          jqXHR.setRequestHeader('X-CSRF-Token', data.csrf);
        });
        $.ajax({
          method: 'POST',
          url: '/project/' + kaleido_admin.project_name + '/update/model',
          data: JSON.stringify(Post_model),
          contentType: 'application/json',
          success: function (j) {
//                console.log(JSON.stringify(Post_model));
//                console.log("Post /project/blog/update ", j);
            kaleido_admin.model_load();
          }
        });
      }
    });
  kaleido_admin.trigger('model_update')
};

kaleido_admin.model_delete = function (model) {
  console.log(kaleido_admin.models);
  console.log(model);
  var Post_model = model;
  $.getJSON('/csrf',
    function (data) {
      if (typeof data == "object") {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
          jqXHR.setRequestHeader('X-CSRF-Token', data.csrf);
        });
        $.ajax({
          method: 'POST',
          url: '/project/' + kaleido_admin.project_name + '/destroy/model',
          data: JSON.stringify(Post_model),
          contentType: 'application/json',
          success: function (j) {
//                console.log(JSON.stringify(Post_model));
//                console.log("Post /project/blog/update ", j);
            kaleido_admin.model_load();
          }
        });
      }
    });
  kaleido_admin.trigger('model_delete', model);
};

kaleido_admin.model_push = function (model) {
  kaleido_admin.trigger('model_update', model)
};

jQuery(document).ready(function () {
  riot.route.start();
  riot.route(function (f1, f2, f3) {
    console.log("!!!3 " + f1 + f2 + f3);
  });
  riot.route("", function () {
    riot.mount(document.getElementById('main'), 'start', kaleido_admin);
    console.log("Start!");
  });
  riot.route("admin", function () {
    if (kaleido_admin.project_name != kaleido_admin.admin_project) {
      riot.route("");
    }
    riot.mount(document.getElementById('main'), 'admin', kaleido_admin);
    console.log("Admin!");
  });
  riot.route("project/*", function (name) {
    console.log("project/* name => " + name);
    console.log("is_login => " + kaleido_admin.is_login);
    if (!kaleido_admin.is_login) {
      riot.route("login/" + name);
      return;
    }
    if (name == kaleido_admin.admin_project) {
      riot.route("admin");
    }
    riot.mount(document.getElementById('main'), 'project', kaleido_admin);
    console.log("Project " + name);
  });
  //
  riot.route("login", function () {
    riot.mount(document.getElementById('main'), 'login', kaleido_admin);
  });
  riot.route("login/*", function (name) {
    if (typeof name == "undefined") {
      name = kaleido_admin.admin_project;
    }
    kaleido_admin.project_name = name;
    riot.mount(document.getElementById('main'), 'login', kaleido_admin);
    console.log("LOGIN!");
  });
  //
  riot.route("logout", function () {
    $.getJSON('/m/auth/logout', function () {
      kaleido_admin.reset();
      riot.route("");
      riot.update();
      console.log("LOGOUT!");
    });
  });
  riot.route("help", function () {
    riot.mount(document.getElementById('main'), 'help');
    console.log("help!");
  });

  //riot.route.exec();
});

function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};
  
  $.map(unindexed_array, function(n, i){
    indexed_array[n['name']] = n['value'];
  });
  
  return indexed_array;
}