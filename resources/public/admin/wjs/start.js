/**
 * Created by fredwu on 16-6-26.
 */
webix.debug = false;
webix.attachEvent("onReady", function () {
  webix.ui({
    type: "space", id: "main", rows: [
      wui.toolbar,
      {
        type: "space",
        padding: 0,
        cols: [
          wui.leftbar,
          wui.workarea
        ]
      }
    ]
  });

  wui.switchWorkArea("wellcom");
  wui.me();
});