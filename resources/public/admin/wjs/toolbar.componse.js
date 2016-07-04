/**
 * Created by fredwu on 16-6-26.
 */

wui.toolbarMenu = [
  {id: "login", value: "Login", icon: "user"},
  {id: "blog", value: "Blog", icon: "envelope"},
  {id: "help", value: "Help", icon: "support"}
];

wui.toolbar = {
  id: "toolbar",
  view: "toolbar",
  height: 42,
  cols: [
    {
      template: "<div style='padding-top:5px;padding-left:5px;font-size:15px;color:white;'>Kaleido</div>",
      width: 200,
      type: "clean"
    },
    {
      id: "topMenu",
      view: "menu",
      data: wui.toolbarMenu,
      on: {
        onMenuItemClick: function (id) {
          webix.message("Value: " + this.getMenuItem(id).value +
            " Id: " + this.getMenuItem(id).id);
          switch (this.getMenuItem(id).id) {
            case 'manager_project':
              wui.switchWorkArea('project', kadmin.project.name);
              kadmin.project_load();
              break;
            case 'login':
              kadmin.login('blog', 'test', 'test').done(function () {
                console.log("wui update_toolbar =>", kadmin.auth);
                if ('blog' == kadmin.setting.admin_project) {
                  wui.switchWorkArea('admin');
                } else {
                  wui.switchWorkArea('project', 'blog');
                }
                wui.update_toolbar(
                  'update',
                  'login',
                  {
                    id: "logout",
                    value: '<i>' + kadmin.auth.username + "</i> (" + kadmin.auth.userrole + ") Logout ",
                    icon: "user"
                  });
                kadmin.project_load().done(function () {
                  wui.project_data_collection = kadmin.project;
                  $$('model_list').parse(wui.project_data_collection.model);
                });
              });
              break;
            case 'logout':
              kadmin.logout().done(function () {
                wui.reset();
                wui.switchWorkArea('wellcom', null);
                wui.update_toolbar(
                  'update',
                  'logout',
                  {id: "login", value: 'Login', icon: "user"});
                wui.update_toolbar('remove', 'manager_project');
              });
              break;
            default:
              webix.message("No Event!");
          }
        }
      }
    }
  ]
};
