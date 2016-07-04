/**
 * Created by Fred.Wu on 2016/6/27.
 */
wui.route_debug_init = function () {
  console.log("route_model_list onLoad!");
  $$('route_model_list').clearAll();
  wui.project_data_collection = kadmin.project;
  var route_collection = [];
  _.map(wui.project_data_collection.model, function (m) {
    route_collection.push({
      v: m,
      t: 'Model',
      action: 'list',
      name: m.name,
      method: 'get',
      link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name +
      "/model/show/" + m.name
    });
    route_collection.push({
      v: m,
      t: 'Model',
      action: 'create',
      name: m.name,
      method: 'post',
      link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name +
      "/model/create/" + m.name
    });
    route_collection.push({
      v: m,
      t: 'Model',
      action: 'destroy',
      name: m.name,
      method: 'post',
      link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name +
      "/model/destroy/" + m.name
    });
    route_collection.push({
      v: m,
      t: 'Model',
      action: 'update',
      name: m.name,
      method: 'post',
      link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name +
      "/model/update/" + m.name
    });
    route_collection.push({
      v: m,
      t: 'Model',
      action: 'search',
      name: m.name,
      method: 'post',
      link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name +
      "/model/search/" + m.name
    });
  });
  console.log("route_collection => ", route_collection);
  $$('route_model_list').parse(route_collection);
};

wui.route_debug_model_array = {
  default: [
    {view: "text", id: "route_debug_model_link", label: "link", name: "link"},
    {view: "text", id: "route_debug_model_method", label: "method", name: "method"},
    {view: "textarea", label: "data", height: 200, id: "route_debug_model_data"},
    {template: '{"condition":{"bbbb":"dsf"},"page":1,"page-num":10,"order":"name,1"}', autoheight: true, scroll: "y"},
    {
      view: "button", value: "Test", type: "danger",
      click: function () {
        var url = $$('route_debug_model_link').getValue();
        var method = $$('route_debug_model_method').getValue();
        var data = $$('route_debug_model_data').getValue();
        webix.message($$('route_debug_model_link').getValue());
        kadmin.with_csrf().done(function () {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
              jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
            }
          );
          $.ajax({
            url: url,
            method: method,
            data: data,
            contentType: 'application/json',
            dataType: "json"
          }).fail(function (jqXHR, textStatus, errorThrown) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).done(function (j) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).always(function () {
            $('#light_json_code').html($('#light_json_code').html().replace(/\n/g, '<br/>'));
            $('#light_json_code').each(function (i, block) {
              hljs.configure({useBR: true})
              hljs.highlightBlock(block);
            });
          });
        });
      }
    }
  ],
  destroy: [
    {view: "text", id: "route_debug_model_link", label: "link", name: "link"},
    {view: "text", id: "route_debug_model_id", label: "Primary ID", name: "_id"},
    {view: "text", id: "route_debug_model_method", label: "method", name: "method"},
    {view: "textarea", label: "data", height: 100, id: "route_debug_model_data"},
    {template: '{"condition":{"bbbb":"dsf"},"allow_empty_condition"=>true}', autoheight: true, scroll: "y"},
    {
      view: "button", value: "Test", type: "danger",
      click: function () {
        var url = $$('route_debug_model_link').getValue();
        var _id = $$('route_debug_model_id').getValue();
        var method = $$('route_debug_model_method').getValue();
        var data = $$('route_debug_model_data').getValue();
        webix.message($$('route_debug_model_link').getValue());
        kadmin.with_csrf().done(function () {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
              jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
            }
          );
          $.ajax({
            url: url + (_id == "" ? "" : "/" + _id),
            method: method,
            data: data,
            contentType: 'application/json',
            dataType: "json"
          }).fail(function (jqXHR, textStatus, errorThrown) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).done(function (j) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).always(function () {
            $('#light_json_code').html($('#light_json_code').html().replace(/\n/g, '<br/>'));
            $('#light_json_code').each(function (i, block) {
              hljs.configure({useBR: true})
              hljs.highlightBlock(block);
            });
          });
        });
      }
    }
  ],
  list: [
    {view: "text", id: "route_debug_model_link", label: "Link", name: "link"},
    {view: "text", id: "route_debug_model_id", label: "Primary ID", name: "_id"},
    {view: "text", id: "route_debug_model_params", label: "Params", name: "params"},
    {template: "params: ?page=x&page-num=x&order=_id,1", height: 30},
    {
      view: "text", id: "route_debug_model_method", label: "method",
      name: "method"
    },
    {
      view: "button", value: "Test", type: "danger",
      click: function () {
        var url = $$('route_debug_model_link').getValue();
        var _id = $$('route_debug_model_id').getValue();
        var params = $$('route_debug_model_params').getValue();
        var method = $$('route_debug_model_method').getValue();
        webix.message($$('route_debug_model_link').getValue());
        $.ajax({
          url: url + (_id == "" ? "" : "/" + _id) + (params == "" ? "" : params),
          method: method,
          data: {},
          dataType: "json"
        }).done(function (j) {
          $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + '</div>');
          $$('route_require').refresh();
          $('#light_json_code').html($('#light_json_code').html().replace(/\n/g, '<br/>'));
          $('#light_json_code').each(function (i, block) {
            hljs.configure({useBR: true})
            hljs.highlightBlock(block);
          });
        });
      }
    }
  ],
  create: function (item) {
    console.log(item);
    var tItem = item;
    var fields = _.map(item.v.fields, function (m) {
      switch (m.type) {
        case 'image':
        case 'file':
          var upload_url = kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/upload";
          return {
            view: "uploader",
            id: 'id_model_' + m.name,
            label: m.name,
            name: m.name,
            multiple: (typeof m.attrs.multi == 'undefined') ? false : m.attrs.multi,
            upload: upload_url,
            on: {
              onFileUpload: function (item, response) {
                if (response.status == true) {
                  //var v = {};
                  //v[item.value.field] = item.value._id;
                  //console.log(v);
                  //$$('route_require_area').setValues(v);
                  $$('id_model_' + m.name).setValue(item.value._id);
                }
              },
              onItemClick: function () {
                var self = this;
                kadmin.with_csrf().done(function () {
                  self.define('formData', {
                    "__anti-forgery-token": kadmin.auth.csrf,
                    model: tItem.name,
                    field: m.name,
                    upload_name: 'upload'
                  });
                });
              }
            }
          };
          break;
        default:
          return {view: "text", id: 'id_' + m.name, name: m.name, label: m.name}
      }
    });
    var button_submit = {
      view: "button", type: "danger", value: "Test",
      click: function () {
        //console.log($$('route_require_area').getValues());
        var post_values = $$('route_require_area').getValues();
        var url = kadmin.setting.base_url + kadmin.setting.project_prefix_url +
          "/" + kadmin.project.name + "/model/create/" + post_values.v.name;

        kadmin.with_csrf().done(function () {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
              jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
            }
          );
          $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(post_values),
            contentType: 'application/json'
          }).fail(function (jqXHR, textStatus, errorThrown) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).done(function (j) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).always(function () {
            $('#light_json_code').html($('#light_json_code').html().replace(/\n/g, '<br/>'));
            $('#light_json_code').each(function (i, block) {
              hljs.configure({useBR: true})
              hljs.highlightBlock(block);
            });
          });
        });
      }
    };
    fields.push(button_submit);
    return fields;
  },
  update: function (item) {
    console.log(item);
    var tItem = item;
    var id_field = {
      view: "text", type: "text", value: "", label: "_ID", name: "_id"
    };
    var condition_field = {
      view: "textarea", label: "condition", name: "_condition",
      height: 100, id: "route_debug_model_data"
    };
    var fields = _.map(item.v.fields, function (m) {
      switch (m.type) {
        case 'image':
        case 'file':
          var upload_url = kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/upload";
          return {
            view: "uploader",
            id: 'id_model_' + m.name,
            label: m.name,
            name: m.name,
            multiple: (typeof m.attrs.multi == 'undefined') ? false : m.attrs.multi,
            upload: upload_url,
            on: {
              onFileUpload: function (item, response) {
                if (response.status == true) {
                  //var v = {};
                  //v[item.value.field] = item.value._id;
                  //console.log(v);
                  //$$('route_require_area').setValues(v);
                  $$('id_model_' + m.name).setValue(item.value._id);
                }
              },
              onItemClick: function () {
                var self = this;
                kadmin.with_csrf().done(function () {
                  self.define('formData', {
                    "__anti-forgery-token": kadmin.auth.csrf,
                    model: tItem.name,
                    field: m.name,
                    upload_name: 'upload'
                  });
                });
              }
            }
          };
          break;
        default:
          return {view: "text", id: 'id_' + m.name, name: m.name, label: m.name}
      }
    });
    var button_submit = {
      view: "button", type: "danger", value: "Test",
      click: function () {
        //console.log($$('route_require_area').getValues());
        var r = function () {
          var rv = update_values;
          delete rv['_condition'];
          delete rv['_id'];
          return rv;
        };
        var update_values = $$('route_require_area').getValues();
        var post_values = {
          "condition": update_values['_condition'],
          "_id": update_values["_id"],
          "value": r()
        };
        var selected_model = $$('route_model_list').getSelectedItem();
        var url = kadmin.setting.base_url + kadmin.setting.project_prefix_url +
          "/" + kadmin.project.name + "/model/update/" + selected_model.v.name;

        kadmin.with_csrf().done(function () {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
              jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
            }
          );
          $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(post_values),
            contentType: 'application/json'
          }).fail(function (jqXHR, textStatus, errorThrown) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).done(function (j) {
            $$('route_require').define('template', '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + '</div>');
            $$('route_require').refresh();
          }).always(function () {
            $('#light_json_code').html($('#light_json_code').html().replace(/\n/g, '<br/>'));
            $('#light_json_code').each(function (i, block) {
              hljs.configure({useBR: true});
              hljs.highlightBlock(block);
            });
          });
        });
      }
    };
    // var j = _.flatten(id_field, fields);
    // console.log(j);
    // console.log(fields);
    // var j = [];
    // return j.push(id_field).push(fields).push(button_submit);
    fields.push(id_field);
    fields.push(condition_field);
    fields.push(button_submit);
    return fields;
  }
};

wui.route_debug_componse = {
  id: "route_debug", text: "Route & Debug",
  type: "space",
  padding: 0,
  cols: [
    {
      gravity: 1,
      rows: [
        {
          template: "List Routes",
          height: 35,
          type: "header"
        },
        {
          id: 'route_model_list',
          view: "datatable",
          select: true,
          scheme: {
            $init: function (obj) {
              obj["key"] = obj.name;
              obj["action_name"] = obj.name + ' - ' + obj.action;
            }
          },
          ready: function () {
          },
          columns: [
            {id: "t", width: 60, header: "Type"},
            {id: "action_name", width: 200, header: "Name"},
            {id: "method", width: 60, header: "Method"},
            {id: "link", header: "Base Link", fillspace: true}
          ],
          resizeColumn: true,
          on: {
            onItemClick: function (id, e, node) {
              var item = this.getItem(id);
              console.log(item);
              webix.message(item.action);
              switch (item.action) {
                case 'list':
                  webix.ui(wui.route_debug_model_array.list, $$('route_require_area'));
                  $$('route_require_area').parse(item);
                  break;
                case 'create':
                  webix.ui(wui.route_debug_model_array.create(item), $$('route_require_area'));
                  $$('route_require_area').parse(item);
                  break;
                case 'destroy':
                  webix.ui(wui.route_debug_model_array.destroy, $$('route_require_area'));
                  $$('route_require_area').parse(item);
                  break;
                case 'update':
                  webix.ui(wui.route_debug_model_array.update(item), $$('route_require_area'));
                  $$('route_require_area').clear();
                  // $$('route_require_area').parse(item);
                  break;
                default:
                  webix.ui(wui.route_debug_model_array.default, $$('route_require_area'));
                  $$('route_require_area').parse(item);
              }
              $$('route_require').define('template', 'Waiting...');
              $$('route_require').refresh();
            }
          }
        }
      ]
    },
    {view: "resizer"},
    {
      type: "space",
      padding: 0,
      rows: [
        {
          id: 'route_require_area',
          view: "form",
          scroll: "y",
          elements: [],
          minWidth: 200,
          autoHeight: true
        },
        {view: "resizer"},
        {
          id: 'route_require',
          scroll: "y",
          template: 'waiting...',
          height: 100
        }
      ]
    }

  ]
};