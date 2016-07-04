riot.tag2('admin', '<div class="row"> <div class="col-lg-12"> <div class="page-header"> <h3 id="forms">Admin</h3> </div> </div> <div class="col-lg-12"> <ul class="nav nav-pills"> <li each="{action_menu}" class="{active: active}" show="{show}"> <a onclick="{select_menu}" style="cursor: pointer"> <i class="glyphicon glyphicon-{icon}" show="{icon: icon}"></i> {title}</a> </li> </ul> </div> <div class="col-lg-12" id="work_area" style="margin-top: 10px;"> </div> </div>', '', '', function(opts) {
    var self = this
    self.action_menu = [
      {id: 0, action: 'info', title: 'Info', active: true, show: true},
      {id: 1, action: 'setting', title: 'Setting', active: false, show: (opts.admin_role_name == opts.userrole)},
      {id: 2, action: 'project', title: 'Project', active: false, show: (opts.admin_role_name == opts.userrole)},
      {id: 3, action: 'event', title: 'Event', active: false, show: (opts.admin_role_name == opts.userrole)},
      {id: 4, action: 'proxy', title: 'Proxy', active: false, show: (opts.admin_role_name == opts.userrole)},
      {id: 5, action: 'account', title: 'Account', active: false, show: (opts.admin_role_name == opts.userrole)},
      {
        id: 6,
        action: 'logger',
        title: 'Logger',
        active: false,
        show: (opts.admin_role_name == opts.userrole),
        icon: "eye-open"
      }
    ];

    this.select_menu = function(e)
    {
      console.log(e);
      _.map(self.action_menu, function (v, k) {
        self.action_menu[k]['active'] = false
      });
      self.action_menu[e.item.id]['active'] = true;
      riot.mount(document.getElementById('work_area'), 'admin_' + e.item.action, opts);
      switch (e.item.action) {
        case 'info':
          self.action_info();
          break;
        case 'project':
          self.action_project();
          break;
        case 'event':
          self.action_event();
          break;
        case 'logger':
          self.action_logger();
          break;
        case 'setting':
          self.action_setting();
          break;
        case 'proxy':
          self.action_proxy();
          break;
        case 'account':
          self.action_account();
          break;
        default:
          riot.mount(document.getElementById('work_area'), 'Nothing!');
      }
    }.bind(this)

    this.action_info = function()
    {
      self.info = "fFF"
    }.bind(this)

    this.action_project = function()
    {
      self.info = "project"
    }.bind(this)

    this.action_event = function()
    {
      self.info = "event"
    }.bind(this)

    this.action_logger = function()
    {
      self.info = "logger"
    }.bind(this)

    this.action_setting = function()
    {
      self.info = "setting"
    }.bind(this)

    this.action_proxy = function()
    {
      self.info = "proxy"
    }.bind(this)

    this.action_account = function()
    {
      self.info = "account"
    }.bind(this)

    self.on('mount', function () {
      if (!opts.is_login) {
        riot.route('login');
        return;
      }

      self.select_menu({item: {id: 0, action: 'info', title: 'Info', active: true, show: true}});
      self.update();
    });
});

riot.tag2('admin_event', 'event', '', '', function(opts) {
});
riot.tag2('admin_logger', 'logger', '', '', function(opts) {
});
riot.tag2('admin_account', '<legend></legend> <div class="btn-group"> <a href="#" class="btn btn-info btn-xs">Create</a> </div> <table class="table table-striped table-hover "> <thead> <tr> <th>#</th> <th>Name</th> <th>Email</th> <th>Role</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{opts.projects}" class="{active: active}"> <td>-</td> <td>{name}</td> <td></td> <td></td> <td style="text-align: center"> <a href="#" class="btn btn-success btn-xs">Edit</a> <a href="#" class="btn btn-danger btn-xs">Delete</a> </td> </tr> </tbody> </table>', '', '', function(opts) {
    var self = this

    self.on('mount', function () {
      if (!opts.is_login) {
        riot.route('login');
        return;
      }
      console.log(opts.projects)
    })
});

riot.tag2('admin_event', '<legend></legend> <div class="btn-group"> <a class="btn btn-info btn-xs">Create</a> <a href="#" class="btn btn-info btn-xs dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="#">Timer</a></li> <li class="divider"></li> <li><a href="#">Before Create Project</a></li> <li><a href="#">Before Update Project</a></li> <li><a href="#">Before Destroy Project</a></li> <li class="divider"></li> <li><a href="#">After Create Project</a></li> <li><a href="#">After Update Project</a></li> <li><a href="#">After Destroy Project</a></li> <li class="divider"></li> <li><a href="#">Custom</a></li> </ul> </div> <table class="table table-striped table-hover "> <thead> <tr> <th>#</th> <th>Name</th> <th>Trigger</th> <th>Parameter</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{opts.projects}" class="{active: active}"> <td>-</td> <td>{name}</td> <td></td> <td></td> <td style="text-align: center"> <a href="#" class="btn btn-success btn-xs">Edit</a> <a href="#" class="btn btn-danger btn-xs">Delete</a> </td> </tr> </tbody> </table>', '', '', function(opts) {
});
riot.tag2('admin_info', '<legend></legend> <div class="list-group"> <a href="#" class="list-group-item"> <h4 class="list-group-item-heading">List group item heading</h4> <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p> </a> <a href="#" class="list-group-item"> <h4 class="list-group-item-heading">List group item heading</h4> <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p> </a> </div>', '', '', function(opts) {
});

riot.tag2('admin_project', '<legend></legend> <div> <a href="#" class="btn btn-info btn-xs">Create</a> </div> <table class="table table-striped table-hover "> <thead> <tr> <th>#</th> <th>Name</th> <th>Status</th> <th>Model Num</th> <th>Event Num</th> <th>Account Num</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{opts.projects}" class="{active: active}"> <td>-</td> <td>{name}</td> <td></td> <td></td> <td></td> <td></td> <td style="text-align: center"> <a href="#" class="btn btn-success btn-xs">Run</a> <a href="#" class="btn btn-warning btn-xs">Stop</a> <a href="#" class="btn btn-danger btn-xs">Destory</a> </td> </tr> </tbody> </table>', '', '', function(opts) {
    var self = this

    self.on('mount', function () {
      if (!opts.is_login) {
        riot.route('login');
        return;
      }
      console.log(opts.projects)
    })
});

riot.tag2('admin_proxy', '<legend></legend> <div class="btn-group"> <a href="#" class="btn btn-info btn-xs">Create</a> </div> <table class="table table-striped table-hover "> <thead> <tr> <th>#</th> <th>Name</th> <th>URL</th> <th>Method</th> <th>Parameter</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{opts.projects}" class="{active: active}"> <td>-</td> <td>{name}</td> <td></td> <td></td> <td></td> <td style="text-align: center"> <a href="#" class="btn btn-success btn-xs">Edit</a> <a href="#" class="btn btn-danger btn-xs">Delete</a> </td> </tr> </tbody> </table>', '', '', function(opts) {
});
riot.tag2('admin_setting', '<legend></legend> <form class="form-horizontal"> <fieldset> <div class="form-group"> <label for="inputName" class="col-lg-2 control-label">Project prefix</label> <div class="col-lg-9"> <input type="text" class="form-control" name="name" id="inputName" placeholder="project"> </div> </div> <div class="form-group"> <label for="textArea" class="col-lg-2 control-label">Allow Manage IP</label> <div class="col-lg-9"> <textarea class="form-control" rows="3" id="textArea"></textarea> </div> </div> <span class="help-block col-lg-offset-2"> More settings, please use [kaleido.edu]. </span> <div class="form-group"> <div class="col-lg-9 col-lg-offset-2"> <button type="reset" class="btn btn-default">Cancel</button> <button type="submit" class="btn btn-primary">Save</button> </div> </div> </fieldset> </form>', '', '', function(opts) {
});

riot.tag2('help', '<div class="row"> <div class="col-lg-12"> <div class="page-header"> <h3 id="forms">Help</h3> </div> </div> </div>', '', '', function(opts) {
});
riot.tag2('login', '<div class="row page-header"> <div class="col-lg-6"> <div class="well bs-component"> <form class="form-horizontal" method="post"> <fieldset> <legend>Auth</legend> <div class="form-group"> <label for="project_name" class="col-lg-2 control-label">Project</label> <div class="col-lg-10"> <input type="text" class="form-control" value="{opts.project_name}" id="project_name" name="project_name" placeholder="Name"> </div> </div> <div class="form-group {login_name_has_error}"> <label for="login_name" class="col-lg-2 control-label">Name</label> <div class="col-lg-10"> <input type="text" class="form-control" id="login_name" name="login_name" placeholder="Name"> </div> </div> <div class="form-group {login_password_has_error}"> <label for="login_password" class="col-lg-2 control-label">Password</label> <div class="col-lg-10"> <input type="password" class="form-control" id="login_password" name="login_password" placeholder="Password"> </div> </div> <div class="form-group"> <div class="col-lg-10 col-lg-offset-2"> <button type="reset" class="btn btn-default">Cancel</button> <button type="submit" class="btn btn-primary" onclick="{login}">Submit</button> </div> </div> <div class="form-group" show="{message.length> 0}"> <div class="col-lg-10 col-lg-offset-2"> <div class="alert alert-dismissible alert-warning">{message}</div> </div> </div> </fieldset> </form> </div> </div> </div> <div class="row page-header"> <div class="col-lg-4 col-lg-offset-1"> FE {message} </div> </div>', '', '', function(opts) {
    var self = this;
    self.message = "";
    self.login_name_has_error = "";
    self.login_password_has_error = "";

    this.login = function()
    {
      if ($("#project_name").val().length == 0) {
        self.login_name_has_error = "has-error"
        self.update()
      } else if ($("#login_name").val().length == 0) {
        self.login_name_has_error = "has-error"
        self.update()
      } else if ($("#login_password").val().length == 0) {
        self.login_name_has_error = ""
        self.login_password_has_error = "has-error"
        self.update()
      } else {
        opts.login($("#project_name").val(), {
          login_name: self.login_name.value,
          login_password: self.login_password.value
        })
      }
    }.bind(this)

    opts.on('login', function (json) {
      self.message = json.message;
      self.update();
      console.log(this.message);
    })

});
riot.tag2('nav_in_menu', '<ul class="nav navbar-nav"> <li show="{opts.is_login && opts.is_admin}"> <a href="#admin"><i class="glyphicon glyphicon-fire"></i> Admin</a> </li> <li class="dropdown" show="{opts.is_login && (!opts.is_admin)}"> <a href="#project/{opts.project_name}"> <i class="glyphicon glyphicon-inbox"></i> Project - {opts.project_name}</a> </li> <li> <a href="#help"><i class="glyphicon glyphicon-road"></i> Help</a> </li> <li> <a href="http://www.91here.com/kaleido" target="_blank"><i class="glyphicon glyphicon-link"></i> Blog</a> </li> </ul>', '', '', function(opts) {
});
riot.tag2('nav_in_user', '<ul class="nav navbar-nav navbar-right"> <li hide="{opts.is_login}"><a href="#login">Login</a></li> <li show="{opts.is_login}"><a href="#user/profile">{opts.username} [{opts.userrole}] ({opts.project_name})</a></li> <li show="{opts.is_login}"><a href="#logout">logout</a></li> </ul>', '', '', function(opts) {
    var self = this;

    opts.on('login', function (json) {
      if (json.status == true) {
      }
      self.update();
    })
});
riot.tag2('project', '<div class="row"> <div class="col-lg-12"> <div class="page-header"> <h3 id="forms">Project {opts.project_name}</h3> </div> </div> <div class="col-lg-12"> <ul class="nav nav-pills"> <li each="{action_menu}" class="{active: active}" show="{show: show}"> <a onclick="{select_menu}" style="cursor: pointer"> <i class="glyphicon glyphicon-{icon}" show="{icon: icon}"></i> {title}</a> </li> </ul> </div> <div class="col-lg-12" id="work_area" style="margin-top: 10px;"> </div> </div>', '', '', function(opts) {
    var self = this

    self.action_menu = [
      {id: 0, action: 'info', title: 'Info', active: true, show: true},
      {id: 1, action: 'setting', title: 'Setting', active: false, show: (opts.admin_role_name == opts.auth.role)},
      {id: 2, action: 'model', title: 'Model', active: false, show: (opts.admin_role_name == opts.auth.role)},
      {id: 3, action: 'event', title: 'Event', active: false, show: (opts.admin_role_name == opts.auth.role)},
      {id: 4, action: 'proxy', title: 'Proxy', active: false, show: (opts.admin_role_name == opts.auth.role)},
      {id: 5, action: 'account', title: 'Account', active: false, show: (opts.admin_role_name == opts.auth.role)},
      {id: 6, action: 'logger', title: 'Logger', active: false, show: true, icon: "eye-open"},
      {
        id: 7,
        action: 'route',
        title: 'Route & Test',
        active: false,
        icon: "eye-open",
        show: (opts.admin_role_name == opts.auth.role)
      }
    ];

    this.select_menu = function(e)
    {
      _.map(self.action_menu, function (v, k) {
        self.action_menu[k]['active'] = false
      });
      self.action_menu[e.item.id]['active'] = true;
      if (_.contains(["setting", "account", "route", "model"], e.item.action)) {
        riot.mount(document.getElementById('work_area'), 'project_' + e.item.action, kaleido_admin);
      } else
        riot.mount(document.getElementById('work_area'), 'admin_' + e.item.action, opts);
      switch (e.item.action) {
        case 'info':
          self.action_info();
          break;
        case 'event':
          self.action_event();
          break;
        case 'model':
          self.action_model();
          break;
        case 'logger':
          self.action_logger();
          break;
        case 'setting':
          self.action_setting();
          break;
        case 'proxy':
          self.action_proxy();
          break;
        case 'account':
          self.action_account();
          break;
        case 'route':
          self.action_route();
          break;
        default:
          riot.mount(document.getElementById('work_area'), 'Nothing!');
      }

    }.bind(this)

    this.action_info = function()
    {
      self.info = "fFF"
    }.bind(this)

    this.action_event = function()
    {
      self.info = "event"
    }.bind(this)

    this.action_model = function()
    {
      self.info = "model"
    }.bind(this)

    this.action_logger = function()
    {
      self.info = "logger"
    }.bind(this)

    this.action_setting = function()
    {
      self.info = "setting"
    }.bind(this)

    this.action_proxy = function()
    {
      self.info = "proxy"
    }.bind(this)

    this.action_account = function()
    {
      self.info = "account"
    }.bind(this)

    this.action_route = function()
    {
      self.info = "route"
    }.bind(this)

    self.on('update', function () {
      console.log("update!");
    });

    self.on('mount', function () {
      console.log(this.action_menu);
      if (!opts.is_login) {
        riot.route('login/' + opts.project_name);
        return;
      }
      self.select_menu({item: {id: 0, action: 'info', title: 'Info', active: true, show: true}})
      self.update();
    })
});
riot.tag2('project_account', '<legend></legend> <div class="btn-group"> <span><a href="#" class="btn btn-info btn-xs">Create</a></span> <span><a href="#" class="btn btn-warning btn-xs">Import</a></span> </div> <table class="table table-striped table-hover "> <thead> <tr> <th>#</th> <th>Name</th> <th>Email</th> <th>Role</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{opts.projects}" class="{active: active}"> <td>-</td> <td>{name}</td> <td></td> <td></td> <td style="text-align: center"> <a href="#" class="btn btn-success btn-xs">Edit</a> <a href="#" class="btn btn-danger btn-xs">Delete</a> </td> </tr> </tbody> </table>', '', '', function(opts) {
    var self = this

    self.on('mount', function () {
      if (!opts.is_login) {
        riot.route('login');
        return;
      }
      console.log(opts.projects)
    })
});

riot.tag2('model_form', '<h4>{opts.model.action} Model - {opts.model.data.name}</h4> <fieldset class="well"> <form class="form-horizontal" onsubmit="return false;"> <div class="row"> <div class="col-md-10 col-md-offset-1"> <span class="label label-info">Table</span> </div> </div> <div class="form-group form-group-sm"> <label for="inputModelName" class="col-sm-2 control-label">Name</label> <div class="col-sm-5"> <input type="hidden" name="table_key" id="table_key" value="{opts.model.data.name}"> <input type="text" class="form-control input-sm" name="table_name" id="table_name" value="{opts.model.data.name || \'\'}" id="inputModelName" placeholder="name"> </div> </div> <div class="form-group form-group-sm"> <label for="table_defined" class="col-sm-2 control-label">Defined</label> <div class="col-sm-5"> <select class="form-control input-sm" id="table_defined" name="table_defined" value="{opts.model.defined}"> <option value="normal">Normal</option> <option value="tree">Tree</option> <option value="attribute">Attribute</option> </select> </div> </div> </form> <fieldset class="well col-lg-offset-1"> <div class="form-group"> <span class="label label-info">Fields list</span> <table class="table table-striped table-hover"> <thead> <tr> <th>Name</th> <th>Type</th> <th>Attrs</th> <th>Join</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{opts.model.data.fields}"> <td>{name}</td> <td>{type}</td> <td>{_.size(attrs) || ⁗-⁗}</td> <td>{_.size(join) ? ⁗Y⁗:⁗-⁗}</td> <td style="text-align: center"> <a onclick="{edit_field}" class="btn btn-success btn-xs">Edit</a> <a onclick="{delete_field}" class="btn btn-danger btn-xs">Delete</a> </td> </tr> </tbody> </table> </div> <div class="form-group"> <div class="col-lg-9"> <button type="button" class="btn btn-success btn-xs" onclick="{new_field}">New Field</button> <button type="button" class="btn btn-primary btn-xs" onclick="{save}">Save Table</button> </div> </div> </fieldset> <fieldset class="well col-lg-offset-1" show="{open_field_form: open_field_form}"> {JSON.stringify(select_field)} <form class="form-horizontal" onsubmit="return false;" id="field_join"> <span class="label label-info">Fields Info</span> <div class="form-group form-group-sm"> <label for="field_name" class="col-sm-2 control-label">Field Name</label> <div class="col-sm-5"> <input type="hidden" name="field_key" value="{select_field.name || \'\'}"> <input type="text" class="form-control input-sm" name="field_name" value="{select_field.name || \'\'}" id="field_name" placeholder="name"> </div> </div> <div class="form-group form-group-sm"> <label for="field_type" class="col-sm-2 control-label">Type</label> <div class="col-sm-2"> <select class="form-control" id="field_type" name="field_type" value="{select_field.type || \'\'}" onchange="{field_type_change}"> <option value="string">String</option> <option value="text">Text</option> <option value="int">Int</option> <option value="float">Float</option> <option value="image">Image</option> <option value="file">File</option> <option value="time">Time</option> <option value="date">Date</option> <option value="aid">OwnId</option> <option value="join">Join</option> </select> </div> <label for="field_attrs" class="col-sm-1 control-label">Attrs</label> <div class="col-sm-6"> <input type="text" class="form-control" name="field_attrs" value="{select_field.attrs_json || \'\'}" id="field_attrs" placeholder="\\{\\}"> </div> </div> <div class="form-group form-group-sm" show="{self.field_type.value == \'join\'}"> <label class="col-sm-2 control-label">Join</label> <div class="col-sm-9"> <button type="button" class="btn btn-success btn-xs" onclick="{add_new_join_field}"> + </button> <table class="table table-striped table-hover"> <thead> <tr> <th>Name</th> <th>Join Type</th> <th>Join Field</th> <th></th> </tr> </thead> <tbody> <tr each="{select_field.join}"> <td> <input type="text" class="form-control input-sm" name="join_{md5(name)}_name" value="{name}" placeholder="name"> </td> <td> <select class="form-control" id="inputJoinType" name="join_{md5(name)}_type" value="{type}"> <option value="has_one">Has_one</option> <option value="has_many">Has_many</option> </select> </td> <td> <input type="text" class="form-control input-sm" name="join_{md5(name)}_field" value="{field}" placeholder="table.field"> </td> <td style="text-align: center"> <a onclick="{remove_join_field}" class="btn btn-danger btn-xs">Remove</a> </td> </tr> </tbody> </table> </div> </div> <div class="form-group"> <div class="col-lg-9"> <button type="button" class="btn btn-primary btn-xs" onclick="{save_field}"> Change Field </button> </div> </div> </form> </fieldset> </fieldset>', '', '', function(opts) {
    var self = this
    self.select_field = []
    self.open_field_form = false

    this.save = function(e)
    {
      var update_table = {
        key: self.table_key.value,
        name: self.table_name.value,
        defined: self.table_defined.value
      };
      kaleido_admin.model_update(update_table)

    }.bind(this)

    this.add_new_join_field = function(e)
    {
      random_key = _.random(1000, 10000);
      new_join_field = {name: random_key, type: "has_one", field: ""}
      if (typeof self.select_field.join == 'undefined') {
        self.select_field.join = []
      }
      self.select_field.join.push(new_join_field)
      self.update()
    }.bind(this)

    this.remove_join_field = function(e)
    {
      console.log(e)
      self.select_field.join = _.filter(self.select_field.join, function (d) {
        return e.item.name != d.name
      })
      self.update()
    }.bind(this)

    this.new_field = function(e)
    {

      var n = kaleido_admin.field_insert(opts.model.data.name)
      self.edit_field({item: n})
    }.bind(this)

    this.edit_field = function(e)
    {
      self.select_field = {}
      self.update()
      self.select_field = e.item
      self.select_field.attrs_json = JSON.stringify(self.select_field.attrs)
      self.open_field_form = true
      self.update()
    }.bind(this)

    this.delete_field = function(e)
    {
      console.log(e.item)
      kaleido_admin.field_delete(opts.model.data.name, e.item)
      self.update()
    }.bind(this)

    this.save_field = function(e)
    {

      var field_values = {}
      field_values.join = []
      field_values.key = this.field_key.value
      field_values.name = this.field_name.value
      field_values.type = this.field_type.value
      try {
        field_values.attrs = (this.field_attrs.value == '') ? '{}' : this.field_attrs.value
        field_values.attrs = JSON.parse(field_values.attrs)
      } catch (e) {
        field_values.attrs = {error: this.field_attrs.value}
      }
      if (field_values.type == 'join') {
        var f_join = {}
        _.map($('#field_join').serializeArray(), function (d) {
          var jf = d.name.split('_')
          if (_.size(jf) == 3) {
            f_join[jf[1]] = (typeof f_join[jf[1]] == 'undefined') ? {} : f_join[jf[1]]
            f_join[jf[1]][jf[2]] = d.value
          }
        });
        _.map(f_join, function (d) {
          field_values.join.push(d)
        })
      } else {

        delete field_values.join
      }
      self.select_field = field_values
      self.select_field.attrs_json = JSON.stringify(self.select_field.attrs)

      kaleido_admin.field_update(opts.model.data.name, self.select_field)
      self.update()
    }.bind(this)

    this.field_type_change = function(e)
    {

    }.bind(this)

    self.model = {}

    self.on('update',function() {
      self.model = kaleido_admin.models
    })

    self.on('mount', function () {

      self.model = kaleido_admin.models

    })

});
riot.tag2('project_model', '<legend></legend> <div class="col-lg-12" id="model_form" show="{open_form: open_form}"></div> <div class="btn-group"> <a onclick="{create}" class="btn btn-info btn-xs">Create Table</a> <a class="btn btn-info btn-xs dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a> <ul class="dropdown-menu"> <li><a onclick="{create}" style="cursor: pointer">Normal</a></li> <li><a onclick="{create}" id="tree" style="cursor: pointer">Tree</a></li> <li><a onclick="{create}" id="attribute" style="cursor: pointer">Attribute</a></li> </ul> </div> <div class="btn-group"> <a onclick="{load}" class="btn btn-info btn-xs">Refresh Table</a> </div> <table class="table table-striped table-hover"> <thead> <tr> <th>#</th> <th>Name</th> <th>Type</th> <th>Fields</th> <th style="width: 200px"></th> </tr> </thead> <tbody> <tr each="{models}"> <td>-</td> <td>{name || ⁗!?⁗}</td> <td>{defined || ⁗!?⁗}</td> <td>{fields.length}</td> <td style="text-align: center"> <a onclick="{edit}" class="btn btn-success btn-xs">Edit</a> <a onclick="{remove}" class="btn btn-danger btn-xs">Delete</a> </td> </tr> </tbody> </table>', '', '', function(opts) {
    var self = this

    self.model = {}
    self.open_form = false

    this.remove = function(e)
    {
      kaleido_admin.model_delete(e.item)
    }.bind(this)

    this.edit = function(e)
    {
      console.log(e)
      self.model = {action: 'update', defined: e.item.defined, data: e.item}
      self.form()
    }.bind(this)

    this.create = function(e)
    {
      var defined = (e.currentTarget.id == "") ? "normal" : e.currentTarget.id
      var pre_model = {defined: defined, name: _.random(1000, 10000), fields: []}
      kaleido_admin.model_create(pre_model)

    }.bind(this)

    this.form = function(d)
    {
      console.log(self.model)
      self.open_form = true
      riot.mount(document.getElementById('model_form'), 'model_form', {model: self.model})

    }.bind(this)

    this.load = function()
    {
      self.open_form = false
      opts.model_load()
    }.bind(this)

    self.on('mount', function () {
      if (!opts.is_login) {
        riot.route('login');
        return;
      }
      self.load()
    })

    opts.on('model_load', function () {
      self.models = kaleido_admin.models
      self.update()
    })

    opts.on('model_update', function () {
      self.models = kaleido_admin.models
      self.update()
    })
});

riot.tag2('project_route', '<legend></legend> <div class="row" if="{is_response}"> <div class="col-md-10 col-md-offset-1 well"> <h5>{this.method} - {this.url}</h5> <div><code class="json" id="response_code">{JSON.stringify(this.response)}</code></div> </div> </div> <div class="row" if="{is_form}"> <fieldset class="well col-md-10 col-lg-offset-1"> <h5>Add {this._form.name}</h5> <form class="form-horizontal" id="{this._form.name}_form" onsubmit="return false;" enctype="multipart/form-data"> <div each="{this._form.fields}" class="form-group form-group-sm"> <label for="input_{name}" class="col-sm-2 control-label">{name}</label> <div class="col-sm-9"> <input if="{_.contains([⁗string⁗,⁗text⁗,⁗int⁗,⁗float⁗,⁗time⁗],type)}" type="text" class="form-control" name="{name}" value="{attrs.default}" id="input_{name}" placeholder="{attrs.limit}"> <span if="{type== ⁗image⁗}"> <input type="file" multiple class="form-control" name="{name}" id="upload_image_{name}"> <input type="hidden" id="upload_{name}" name="{name}"> </span> <span if="{type== ⁗file⁗}"> <input type="file" multiple class="form-control" name="{name}" id="upload_file_{name}"> <input type="hidden" id="upload_{name}" name="{name}"> </span> </div> </div> <div class="form-group"> <div class="col-lg-9"> <button type="button" class="btn btn-primary btn-xs" onclick="{add_record_form}"> Save </button> </div> </div> </form> </fieldset> </div> <span class="label label-default">Model</span> <table class="table table-striped table-hover "> <thead> <tr> <th style="width:16%">Name</th> <th>List</th> <th>Search</th> <th>Insert</th> <th>Show</th> <th>Delete</th> </tr> </thead> <tbody> <tr each="{this.models_path_list}"> <td>{name}</td> <td>{list_action.method} - {list_action.path} <a onclick="{list}" class="btn-sm" style="cursor: pointer">link</a> </td> <td>{search_action.method} - {search_action.path} <a onclick="{search}" class="btn-sm" style="cursor: pointer">link</a> </td> <th><a onclick="{add_record}" class="btn-sm" style="cursor: pointer;">add</a></th> <td>By list</td> <td>By list</td> </tr> </tbody> </table>', '', '', function(opts) {


    var self = this

    self.is_response = false
    self.is_form = false

    self.models_path_list = []
    self.response = "..."
    self.method = ""
    self.url = ""
    self.response = ""

    self._form = {}

    this.add_record = function(e)
    {
      self._form = _.find(kaleido_admin.models, function (m) {
        return m.name == e.item.name
      })

      self.is_form = (self.is_form) ? false : true

      self.is_response = false
      self.update()
      var upload_url = kaleido_admin.base_url + kaleido_admin.project_prefix_url + "/" + kaleido_admin.project_name + "/upload"

      var callback = function (data) {
        if (typeof data == "object") {
          _.each($('#' + self._form.name + "_form input[type=file]"), function (e) {
            $(e).pekeUpload({
              url: upload_url,
              data: {
                "__anti-forgery-token": data.csrf,
                field: e.name,
                model: self._form.name
              },

              onFileSuccess: function (f, data) {
                console.log(f, data)
                $("#upload_" + data.value.field).attr('value', data.value._id)
              }
            })
          })
        }
      }
      $.getJSON('/csrf').done(function (data) {
        callback(data)
      });

    }.bind(this)

    this.add_record_form = function()
    {
      var post_data = getFormData($("#" + this._form.name + "_form"))

      var create_url = kaleido_admin.base_url + kaleido_admin.project_prefix_url +
          "/" + kaleido_admin.project_name +
          "/model/" + "create" + "/" + self._form.name;

      $.getJSON('/csrf')
          .done(
              function (data) {
                if (typeof data == "object") {
                  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    jqXHR.setRequestHeader('X-CSRF-Token', data.csrf);
                  });
                  console.log(create_url)
                  console.log(post_data)
                  $.ajax({
                    method: 'POST',
                    url: create_url,
                    data: JSON.stringify(post_data),
                    contentType: 'application/json',
                    success: function (j) {
                      console.log(j)
                    }
                  });
                }
              });
    }.bind(this)

    this.test_remote = function(method, url, data)
    {
      $.ajax({
        url: url,
        method: method,
        data: data,
        dataType: "json"
      }).done(function (msg) {
        self.method = method
        self.url = url
        self.response = msg
      }).fail(function (jqXHR, textStatus) {
        self.method = method
        self.url = url
        self.response = textStatus
        $('div code').html(textStatus)

      }).always(function () {
        self.is_response = true
        console.log(JSON.stringify(self.response, null, " "))
        self.update()
        $('div code').html(JSON.stringify(self.response, null, "&nbsp;"))
        $('div code').html($('div code').html().replace(/\n/g, '<br/>'));
        $('div code').each(function (i, block) {
          hljs.configure({useBR: true})
          hljs.highlightBlock(block);
        });
      });
    }.bind(this)

    this.list = function(e)
    {

      this.test_remote(e.item.list_action.method, e.item.list_action.path, {})
      console.log(e.item)
    }.bind(this)

    this.search = function(e)
    {
      this.test_remote(e.item.list_action.method, e.item.search_action.path, {})
    }.bind(this)

    self.on('update', function () {

    });

    self.on('mount', function () {
      if (!opts.is_login) {
        riot.route('login');
        return;
      }
      kaleido_admin.project_load()
    })

    opts.on('project_load', function () {
      $.getScript('debug/uploadfile.min.js');
      console.log("project_load in route!")
      self.models_path_list = _.map(opts.models, function (m) {
        var n = {name: m.name}
        n.list_action = {
          method: 'get',
          path: kaleido_admin.base_url + kaleido_admin.project_prefix_url + "/" + kaleido_admin.project_name +
          "/model/show/" + m.name
        };
        n.search_action = {
          method: 'get',
          path: kaleido_admin.base_url + kaleido_admin.project_prefix_url + "/" + kaleido_admin.project_name +
          "/model/search/" + m.name
        };
        return n
      });
      self.update()
    })
});

riot.tag2('project_setting', '<legend></legend> <form class="form-horizontal"> <fieldset> <div class="form-group"> <label for="project_name" class="col-lg-2 control-label">Name</label> <div class="col-lg-9"> <input type="text" class="form-control" value="{opts.project_name}" name="project_name" id="project_name" placeholder="project"> </div> </div> <div class="form-group"> <label for="project_path" class="col-lg-2 control-label">Url Path</label> <div class="col-lg-9"> <input type="text" class="form-control" value="{opts.project_path}" name="project_path" id="project_path" placeholder="path/"> <span class="help-block"> Real Path is [Web Server Base Path]/[Kaleido Project Path]/[Your Project Path] </span> </div> </div> <div class="form-group"> <label for="project_allow_manage_ip" class="col-lg-2 control-label">Allow Manage IP</label> <div class="col-lg-9"> <textarea class="form-control" rows="3" name="project_allow_manage_ip" id="project_allow_manage_ip" placeholder="*">{opts.project_allow_manage_ip}</textarea> </div> </div> <span class="help-block col-lg-offset-2"> More settings, please use [kaleido.edu]. </span> <div class="form-group"> <div class="col-lg-9 col-lg-offset-2"> <button onclick="{save}" class="btn btn-primary">Save</button> </div> </div> </fieldset> </form>', '', '', function(opts) {
    var self = this
    this.save = function()
    {
      var project = {
        name: self.project_name.value,
        path: self.project_path.value,
        allowIP: self.project_allow_manage_ip.value
      }
      kaleido_admin.project_update(project)
    }.bind(this)

    self.on('project_update', function () {
      self.update()
    });
});

riot.tag2('start', '<div class="row page-header"> <div class="col-lg-10"> HELO! </div> </div>', '', '', function(opts) {
});