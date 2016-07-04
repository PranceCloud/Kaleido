wui.reload_model = function () {
  $$('model_list').clearAll();
  $$('model_list').parse(wui.project_data_collection.model);
  $$('field_area').clearAll();
//      $$('model_list').select($$('model_list').getFirstId());
};

wui.reload_fields = function () {
  $$('field_area').clearAll();
  var selected_model = $$('model_list').getSelectedItem();
  $$('field_area').parse(selected_model.fields);
};

wui.model_componse = {
  id: "model", text: "Model",
  type: "space",
  padding: 0,
  on: {},
  cols: [
    {
      width: 360,
      rows: [
        {
          view: "toolbar",
          cols: [
            {
              view: "button", value: "New", width: 60, align: "center",
              click: function () {
                var pre_model = {defined: "normal", name: _.random(1000, 10000), fields: []};
                wui.project_data_collection.model.push(pre_model);
                $$('model_list').parse(wui.project_data_collection.model);
              }
            },
            {
              view: "button", value: "Delete", width: 60, align: "center",
              click: function () {
                var delete_model = $$('model_list').getSelectedItem();
                console.log("Delete Model => ", delete_model);
                if (delete_model) {
                  var new_project_model = _.filter(wui.project_data_collection.model, function (m) {
                    return delete_model.name != m.name;
                  });
                  wui.project_data_collection.model = new_project_model;
                  kadmin.model_destroy(delete_model).done(function () {
                    wui.reload_model();
                  });
                  console.log(new_project_model);
                }
              }
            },
            {
              view: "button", value: "Reload", width: 60, align: "center",
              click: function () {
                wui.reload_model();
              }
            },
            {
              view: "button", value: "Save",
              width: 60, align: "center",
              click: function () {
//                  console.log("SAVE 1 ", wui.project_data_collection);
//                  console.log("SAVE 2 ", JSON.stringify($$('model_list').getSelectedItem()));
                kadmin.model_save($$('model_list').getSelectedItem()).done(function () {
                  if (kadmin.require.status) {
                    webix.message("Save Success!");
                  }
                });
              }
            }
          ]
        },
        {
          id: 'model_list',
          view: "datatable",
          select: true,
          editable: true,
          editaction: "dblclick",
          scheme: {
            $init: function (obj) {
              obj["key"] = obj.name;
              obj["fields_num"] = _.size(obj.fields);
            }
          },
          columns: [
            {
              id: "name", header: "Name", editor: "text", width: 140
            },
            {
              id: "defined", editor: "richselect",
              options: ['normal', 'tree', 'setting'],
              header: "Defined"
            },
            {id: "fields_num", header: "Fields"}
          ],
          autowidth: true,
          resizeColumn: true,
//        data: wui.project_data_collection.model,
          on: {
            onItemClick: function (id, e, node) {
              webix.message("Selected datatable " + this.getItem(id).name);
//            var text = "Selected: "+grid.getSelectedId(true).join();
//            document.getElementById('testB').innerHTML = text;
              var select_model = this.getItem(id);
              webix.message("Model -> " + JSON.stringify(select_model.fields));
              $$('field_area').clearAll();
              $$('field_area').parse(select_model.fields);
              $$('field_join_form_area').hide();
            },
            onLoad: function () {
              console.log("model_list onLoad!");
              wui.project_data_collection = kadmin.project;
              $$('model_list').parse(wui.project_data_collection.model);
            }
          }
        }
      ]
    }, {
      rows: [
        {
          view: "toolbar",
          cols: [
            {
              view: "button", value: "New", width: 60, align: "center",
              click: function () {
                console.log();
                var new_field = {name: _.random(1000, 10000), type: "string", attrs: {}};
                var this_model = $$('model_list').getSelectedItem();
                if (!this_model) return false;
                var this_model_id = $$('model_list').getSelectedId();
                this_model['fields'].push(new_field);
                wui.update_project_data_collection(this_model.name, this_model);
                wui.reload_model();
                $$('model_list').select(this_model_id);
                $$('field_area').clearAll();
                $$('field_area').parse(this_model['fields']);
              }
            },
            {
              view: "button", value: "Delete", width: 60, align: "center",
              click: function () {
                var selected_delete_id = $$('field_area').getSelectedId();
                if (!selected_delete_id) return false;
                var this_model_id = $$('model_list').getSelectedId();
                var this_model = $$('model_list').getSelectedItem();
                $$('field_area').remove(selected_delete_id);
                this_model['fields'] = $$('field_area').serialize();
                wui.update_project_data_collection(this_model.name, this_model);
                wui.reload_model();
                $$('model_list').select(this_model_id);
              }
            }
          ]
        },
        {
          id: 'field_area',
          view: "datatable",
          select: true,
          editable: true,
          editaction: "dblclick",
          scheme: {
            $init: function (obj) {
              // obj["primary"] = (obj.attrs.primary == true) ? 'on' : 'off';
              obj["attrs_json"] = JSON.stringify(obj.attrs);
            }
          },
          columns: [
            {
              id: "primary", header: "P.Id",
              checkValue: true, uncheckValue: false,
              template: "{common.checkbox()}",
              width: 40
            },
            {id: "name", header: "Name", editor: "text", width: 120},
            {
              id: "type", editor: "richselect",
              options: ['string', 'text', 'int', 'float', 'image', 'file', 'time', 'date', 'aid', 'json', 'join'],
              header: "Type", width: 100
            },
            {id: "attrs_json", header: "Attrs", editor: "text", fillspace: true}
          ],
          on: {
            onItemClick: function (id, e, node) {
              webix.message("Selected field " + this.getItem(id).name);
              if (this.getItem(id).type == 'join') {
                $$('field_join_form_area').show();
                $$('field_join_form_area').parse(this.getItem(id).join);
              } else {
                $$('field_join_form_area').hide();
              }
            },
            onAfterEditStop: function (state, editor, ignoreUpdate) {
              console.log(state.value, ",", state.old);
              if (state.value != state.old) {
                webix.message(editor + " , " + state.old + " => " + state.value);
                
                if ((editor.column == "attrs_json")) {
                  var attrs = {};
                  try {
                    attrs = (state.value == '') ? '{}' : state.value;
                    attrs = JSON.parse(attrs);
                  } catch (e) {
                    attrs = {error: state.value};
                  }
                  var this_model = $$('model_list').getSelectedItem();
                  var this_field = $$('field_area').getSelectedItem();
                  this_field['attrs'] = attrs;
                  console.log(this_model.name, this_field.name, this_field);
                  wui.update_project_data_collection(this_model.name, this_field.name, this_field);
                  wui.reload_fields();
                  
                } else if ((editor.column == "type") && (state.value == "join")) {
                  $$('field_join_form_area').show();
                  $$('field_join_form_area').parse(state.join);
                } else {
                  $$('field_join_form_area').hide();
                }
              }
            }
          }
          
        },
//          {view: "resizer"},
        {
          height: 200,
          hidden: true,
          id: 'field_join_form_area',
          view: "form",
          on: {
            onBeforeLoad: function () {
              console.log("field_join_with_another_fields", $$('field_join_with_another_fields'));
              
              var fjf_list = $$('field_join_with_another_fields').getPopup().getList();
              fjf_list.clearAll();
              var fjf_list_data = kadmin.field_join_value($$('model_list').getSelectedItem().name);
              fjf_list.parse(fjf_list_data);
            }
          },
          elements: [
            {view: "text", name: 'name', label: "Alias Name"},
            {
              view: "richselect",
              label: 'Join Type',
              name: "type", options: [
              'has_one',
              'has_many'
            ]
            },
            {
              name: "field",
              label: "With Filed",
              view: "combo",
              id: "field_join_with_another_fields",
              options: {
                view: "suggest",
                filter: function (item, value) {
                  console.log(item, value);
//                    if (item.value.toString().toLowerCase().indexOf(value.toLowerCase()) === 0)
//                      return true;
//                    return false;
                },
                body: {
                  view: "list",
                  data: [],
//                  template: "#value#",
                  yCount: 7
                }
              }
            },
            {
              view: "button", value: "Update",
              click: function () {
                console.log($$('field_join_form_area').getValues());
                var this_model = $$('model_list').getSelectedItem();
                var this_field = $$('field_area').getSelectedItem();
                this_field['join'] = $$('field_join_form_area').getValues();
                console.log(this_model.name, this_field.name, this_field);
                wui.update_project_data_collection(this_model.name, this_field.name, this_field);
                $$('field_area').refresh();
              }
            }
          ]
        }
      ]
    }
  ]
};