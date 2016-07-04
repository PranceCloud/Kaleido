/**
 * Created by fredwu on 16-6-26.
 */


wui.wellcom_componse = {
  id: "wellcom", text: "Well", template: "<i>welcome</i>",
};

wui.info_componse = {
  id: "info", text: "Info", template: "<i>info</i>",
};

wui.setting_componse = {
  id: "setting", text: "Setting", template: "<i>setting_componse</i>",
};

/*
 model,field,array
 model,array
 */
wui.update_project_data_collection = function () {
  var i, s, numargs = arguments.length;
  switch (numargs) {
    case 2:
      var model = arguments[0];
      var values = arguments[1];
      _.each(wui.project_data_collection.model, function (m, j) {
        if (m.name == model) {
          wui.project_data_collection.model[j] = values;
        }
      });
      break;
    case 3:
      var model = arguments[0];
      var field = arguments[1];
      var values = arguments[2];
      _.each(wui.project_data_collection.model, function (m, j) {
        if (m.name == model) {
          _.each(m.fields, function (f, k) {
            if (f.name == field) {
              wui.project_data_collection.model[j].fields[k] = values;
            }
          });
        }
      });
      break;
    default:
      webix.message("update_project_data_collection => No Found!");
  }
  
};

wui.event_componse = {
  id: "event", text: "Event", template: "<i>event</i>",
};

wui.proxy_componse = {
  id: "proxy", text: "Proxy", template: "<i>proxy_componse</i>",
};

wui.account_componse = {
  id: "account", text: "Account", template: "<i>account_componse</i>",
};

wui.logger_componse = {
  id: "logger", text: "Logger", template: "<i>logger_componse</i>",
};

wui.workarea_wellcom_menu = [
  wui.wellcom_componse
];

wui.workarea_componses = [
  wui.wellcom_componse,
  wui.info_componse,
  wui.setting_componse,
  wui.model_componse,
  wui.event_componse,
  wui.proxy_componse,
  wui.account_componse,
  wui.logger_componse,
  wui.route_debug_componse
];

wui.workarea_project_menu = [
  wui.info_componse,
  wui.setting_componse,
  wui.model_componse,
  wui.event_componse,
  wui.proxy_componse,
  wui.account_componse,
  wui.logger_componse,
  wui.route_debug_componse
];

wui.leftMenu = _.map(wui.workarea_wellcom_menu, function (w) {
  return {id: w.id, value: w.text, select: w.select};
});

//  [wellcom,project,admin,help,blog]
wui.switchWorkArea = function (work, project_name) {
  console.log("wui.switchWorkArea => ", work, project_name);
  switch (work) {
    case 'wellcom':
      console.log("switchWorkArea => " + work);
      wui.leftMenu = _.map(wui.workarea_wellcom_menu, function (w) {
        return {id: w.id, value: w.text, select: w.select};
      });
      $$('leftMenu').clearAll();
      $$('leftMenu').parse(wui.leftMenu);
      $$('leftMenu').select('wellcom');
      $$("workArea").setValue('wellcom');
      break;
    case 'project':
      console.log("switchWorkArea => " + work);
      wui.update_toolbar(
          'update',
          'manager_project',
          {id: "manager_project", value: 'Project - ' + project_name, icon: "qrcode"});
      wui.leftMenu = _.map(wui.workarea_project_menu, function (w) {
        return {id: w.id, value: w.text, select: w.select};
      });
      $$('leftMenu').clearAll();
      $$('leftMenu').parse(wui.leftMenu);
      $$('leftMenu').select('info');
      $$("workArea").setValue('info');
      break;
    case 'model':
      $$("workArea").setValue('model');        
      break;
    case 'route_debug':
      wui.route_debug_init();
      $$("workArea").setValue('route_debug');
      break;
    default:
      webix.message("switchWork Fail! " + work);
  }
};

wui.project_data_collection = new webix.DataCollection();

wui.reset = function () {
  kadmin.reset();
  wui.project_data_collection = new webix.DataCollection();
  $$('model_list').clearAll();
};

wui.update_toolbar = function (action, menuId, value) {
  var newToolbarMenu = [];
  switch (action) {
    case 'remove':
      newToolbarMenu = _.filter(wui.toolbarMenu, function (m) {
        return m.id != menuId;
      });
      break;
    case 'update':
      var existed = false;
      newToolbarMenu = _.map(wui.toolbarMenu, function (m) {
        if (m.id == menuId) {
          existed = true;
          return value;
        } else {
          return m;
        }
      });
      if (!existed) {
        newToolbarMenu.push(value)
      }
      break;
    default:
      webix.message("No Action in update_toolbar! => " + action);
  }
  wui.toolbarMenu = newToolbarMenu;
  console.log("wui.toolbarMenu => ", action, menuId, wui.toolbarMenu);
  $$('topMenu').clearAll();
  $$('topMenu').parse(wui.toolbarMenu);
};

wui.leftbar = {
  view: "menu", id: "leftMenu",
  layout: "y", width: 200,
  select: true,
  data: wui.leftMenu,
  on: {
    onMenuItemClick: function (id) {
      wui.switchWorkArea(id);
    }
  }
};

wui.me = function () {
  kadmin.me().then(function () {
    console.log(kadmin.auth);
    if (kadmin.auth.is_login && !(kadmin.project.name == '')) {
      kadmin.project_load(function () {
        wui.switchWorkArea('project', kadmin.project.name);
        wui.project_data_collection = kadmin.project;
        $$('model_list').parse(wui.project_data_collection.model);
        wui.update_toolbar(
            'update',
            'login',
            {
              id: "logout",
              value: '<i>' + kadmin.auth.username + "</i> (" + kadmin.auth.userrole + ") Logout ",
              icon: "user"
            });
      });
    }
  });
};

wui.workarea = {
  id: "workArea",
  view: "multiview",
  fitBiggest: true,
  animate: false,
  keepViews: false,
  cells: wui.workarea_componses
};




