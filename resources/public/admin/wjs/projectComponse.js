
wui.reload_project = function () {
  kadmin.project_load().done(function () {
    wui.reload_model();
  });
};