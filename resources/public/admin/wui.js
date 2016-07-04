wui.reload_model = function() {
    $$("model_list").clearAll(), $$("model_list").parse(wui.project_data_collection.model), 
    $$("field_area").clearAll();
}, wui.reload_fields = function() {
    $$("field_area").clearAll();
    var selected_model = $$("model_list").getSelectedItem();
    $$("field_area").parse(selected_model.fields);
}, wui.model_componse = {
    id: "model",
    text: "Model",
    type: "space",
    padding: 0,
    on: {},
    cols: [ {
        width: 360,
        rows: [ {
            view: "toolbar",
            cols: [ {
                view: "button",
                value: "New",
                width: 60,
                align: "center",
                click: function() {
                    var pre_model = {
                        defined: "normal",
                        name: _.random(1e3, 1e4),
                        fields: []
                    };
                    wui.project_data_collection.model.push(pre_model), $$("model_list").parse(wui.project_data_collection.model);
                }
            }, {
                view: "button",
                value: "Delete",
                width: 60,
                align: "center",
                click: function() {
                    var delete_model = $$("model_list").getSelectedItem();
                    if (console.log("Delete Model => ", delete_model), delete_model) {
                        var new_project_model = _.filter(wui.project_data_collection.model, function(m) {
                            return delete_model.name != m.name;
                        });
                        wui.project_data_collection.model = new_project_model, kadmin.model_destroy(delete_model).done(function() {
                            wui.reload_model();
                        }), console.log(new_project_model);
                    }
                }
            }, {
                view: "button",
                value: "Reload",
                width: 60,
                align: "center",
                click: function() {
                    wui.reload_model();
                }
            }, {
                view: "button",
                value: "Save",
                width: 60,
                align: "center",
                click: function() {
                    kadmin.model_save($$("model_list").getSelectedItem()).done(function() {
                        kadmin.require.status && webix.message("Save Success!");
                    });
                }
            } ]
        }, {
            id: "model_list",
            view: "datatable",
            select: !0,
            editable: !0,
            editaction: "dblclick",
            scheme: {
                $init: function(obj) {
                    obj.key = obj.name, obj.fields_num = _.size(obj.fields);
                }
            },
            columns: [ {
                id: "name",
                header: "Name",
                editor: "text",
                width: 140
            }, {
                id: "defined",
                editor: "richselect",
                options: [ "normal", "tree", "setting" ],
                header: "Defined"
            }, {
                id: "fields_num",
                header: "Fields"
            } ],
            autowidth: !0,
            resizeColumn: !0,
            on: {
                onItemClick: function(id, e, node) {
                    webix.message("Selected datatable " + this.getItem(id).name);
                    var select_model = this.getItem(id);
                    webix.message("Model -> " + JSON.stringify(select_model.fields)), $$("field_area").clearAll(), 
                    $$("field_area").parse(select_model.fields), $$("field_join_form_area").hide();
                },
                onLoad: function() {
                    console.log("model_list onLoad!"), wui.project_data_collection = kadmin.project, 
                    $$("model_list").parse(wui.project_data_collection.model);
                }
            }
        } ]
    }, {
        rows: [ {
            view: "toolbar",
            cols: [ {
                view: "button",
                value: "New",
                width: 60,
                align: "center",
                click: function() {
                    console.log();
                    var new_field = {
                        name: _.random(1e3, 1e4),
                        type: "string",
                        attrs: {}
                    }, this_model = $$("model_list").getSelectedItem();
                    if (!this_model) return !1;
                    var this_model_id = $$("model_list").getSelectedId();
                    this_model.fields.push(new_field), wui.update_project_data_collection(this_model.name, this_model), 
                    wui.reload_model(), $$("model_list").select(this_model_id), $$("field_area").clearAll(), 
                    $$("field_area").parse(this_model.fields);
                }
            }, {
                view: "button",
                value: "Delete",
                width: 60,
                align: "center",
                click: function() {
                    var selected_delete_id = $$("field_area").getSelectedId();
                    if (!selected_delete_id) return !1;
                    var this_model_id = $$("model_list").getSelectedId(), this_model = $$("model_list").getSelectedItem();
                    $$("field_area").remove(selected_delete_id), this_model.fields = $$("field_area").serialize(), 
                    wui.update_project_data_collection(this_model.name, this_model), wui.reload_model(), 
                    $$("model_list").select(this_model_id);
                }
            } ]
        }, {
            id: "field_area",
            view: "datatable",
            select: !0,
            editable: !0,
            editaction: "dblclick",
            scheme: {
                $init: function(obj) {
                    obj.attrs_json = JSON.stringify(obj.attrs);
                }
            },
            columns: [ {
                id: "primary",
                header: "P.Id",
                checkValue: !0,
                uncheckValue: !1,
                template: "{common.checkbox()}",
                width: 40
            }, {
                id: "name",
                header: "Name",
                editor: "text",
                width: 120
            }, {
                id: "type",
                editor: "richselect",
                options: [ "string", "text", "int", "float", "image", "file", "time", "date", "aid", "json", "join" ],
                header: "Type",
                width: 100
            }, {
                id: "attrs_json",
                header: "Attrs",
                editor: "text",
                fillspace: !0
            } ],
            on: {
                onItemClick: function(id, e, node) {
                    webix.message("Selected field " + this.getItem(id).name), "join" == this.getItem(id).type ? ($$("field_join_form_area").show(), 
                    $$("field_join_form_area").parse(this.getItem(id).join)) : $$("field_join_form_area").hide();
                },
                onAfterEditStop: function(state, editor, ignoreUpdate) {
                    if (console.log(state.value, ",", state.old), state.value != state.old) if (webix.message(editor + " , " + state.old + " => " + state.value), 
                    "attrs_json" == editor.column) {
                        var attrs = {};
                        try {
                            attrs = "" == state.value ? "{}" : state.value, attrs = JSON.parse(attrs);
                        } catch (e) {
                            attrs = {
                                error: state.value
                            };
                        }
                        var this_model = $$("model_list").getSelectedItem(), this_field = $$("field_area").getSelectedItem();
                        this_field.attrs = attrs, console.log(this_model.name, this_field.name, this_field), 
                        wui.update_project_data_collection(this_model.name, this_field.name, this_field), 
                        wui.reload_fields();
                    } else "type" == editor.column && "join" == state.value ? ($$("field_join_form_area").show(), 
                    $$("field_join_form_area").parse(state.join)) : $$("field_join_form_area").hide();
                }
            }
        }, {
            height: 200,
            hidden: !0,
            id: "field_join_form_area",
            view: "form",
            on: {
                onBeforeLoad: function() {
                    console.log("field_join_with_another_fields", $$("field_join_with_another_fields"));
                    var fjf_list = $$("field_join_with_another_fields").getPopup().getList();
                    fjf_list.clearAll();
                    var fjf_list_data = kadmin.field_join_value($$("model_list").getSelectedItem().name);
                    fjf_list.parse(fjf_list_data);
                }
            },
            elements: [ {
                view: "text",
                name: "name",
                label: "Alias Name"
            }, {
                view: "richselect",
                label: "Join Type",
                name: "type",
                options: [ "has_one", "has_many" ]
            }, {
                name: "field",
                label: "With Filed",
                view: "combo",
                id: "field_join_with_another_fields",
                options: {
                    view: "suggest",
                    filter: function(item, value) {
                        console.log(item, value);
                    },
                    body: {
                        view: "list",
                        data: [],
                        yCount: 7
                    }
                }
            }, {
                view: "button",
                value: "Update",
                click: function() {
                    console.log($$("field_join_form_area").getValues());
                    var this_model = $$("model_list").getSelectedItem(), this_field = $$("field_area").getSelectedItem();
                    this_field.join = $$("field_join_form_area").getValues(), console.log(this_model.name, this_field.name, this_field), 
                    wui.update_project_data_collection(this_model.name, this_field.name, this_field), 
                    $$("field_area").refresh();
                }
            } ]
        } ]
    } ]
}, wui.reload_project = function() {
    kadmin.project_load().done(function() {
        wui.reload_model();
    });
}, wui.route_debug_init = function() {
    console.log("route_model_list onLoad!"), $$("route_model_list").clearAll(), wui.project_data_collection = kadmin.project;
    var route_collection = [];
    _.map(wui.project_data_collection.model, function(m) {
        route_collection.push({
            v: m,
            t: "Model",
            action: "list",
            name: m.name,
            method: "get",
            link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/show/" + m.name
        }), route_collection.push({
            v: m,
            t: "Model",
            action: "create",
            name: m.name,
            method: "post",
            link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/create/" + m.name
        }), route_collection.push({
            v: m,
            t: "Model",
            action: "destroy",
            name: m.name,
            method: "post",
            link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/destroy/" + m.name
        }), route_collection.push({
            v: m,
            t: "Model",
            action: "update",
            name: m.name,
            method: "post",
            link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/update/" + m.name
        }), route_collection.push({
            v: m,
            t: "Model",
            action: "search",
            name: m.name,
            method: "post",
            link: kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/search/" + m.name
        });
    }), console.log("route_collection => ", route_collection), $$("route_model_list").parse(route_collection);
}, wui.route_debug_model_array = {
    "default": [ {
        view: "text",
        id: "route_debug_model_link",
        label: "link",
        name: "link"
    }, {
        view: "text",
        id: "route_debug_model_method",
        label: "method",
        name: "method"
    }, {
        view: "textarea",
        label: "data",
        height: 200,
        id: "route_debug_model_data"
    }, {
        template: '{"condition":{"bbbb":"dsf"},"page":1,"page-num":10,"order":"name,1"}',
        autoheight: !0,
        scroll: "y"
    }, {
        view: "button",
        value: "Test",
        type: "danger",
        click: function() {
            var url = $$("route_debug_model_link").getValue(), method = $$("route_debug_model_method").getValue(), data = $$("route_debug_model_data").getValue();
            webix.message($$("route_debug_model_link").getValue()), kadmin.with_csrf().done(function() {
                $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                    jqXHR.setRequestHeader("X-CSRF-Token", kadmin.auth.csrf);
                }), $.ajax({
                    url: url,
                    method: method,
                    data: data,
                    contentType: "application/json",
                    dataType: "json"
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + "</div>"), 
                    $$("route_require").refresh();
                }).done(function(j) {
                    $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + "</div>"), 
                    $$("route_require").refresh();
                }).always(function() {
                    $("#light_json_code").html($("#light_json_code").html().replace(/\n/g, "<br/>")), 
                    $("#light_json_code").each(function(i, block) {
                        hljs.configure({
                            useBR: !0
                        }), hljs.highlightBlock(block);
                    });
                });
            });
        }
    } ],
    destroy: [ {
        view: "text",
        id: "route_debug_model_link",
        label: "link",
        name: "link"
    }, {
        view: "text",
        id: "route_debug_model_id",
        label: "Primary ID",
        name: "_id"
    }, {
        view: "text",
        id: "route_debug_model_method",
        label: "method",
        name: "method"
    }, {
        view: "textarea",
        label: "data",
        height: 100,
        id: "route_debug_model_data"
    }, {
        template: '{"condition":{"bbbb":"dsf"},"allow_empty_condition"=>true}',
        autoheight: !0,
        scroll: "y"
    }, {
        view: "button",
        value: "Test",
        type: "danger",
        click: function() {
            var url = $$("route_debug_model_link").getValue(), _id = $$("route_debug_model_id").getValue(), method = $$("route_debug_model_method").getValue(), data = $$("route_debug_model_data").getValue();
            webix.message($$("route_debug_model_link").getValue()), kadmin.with_csrf().done(function() {
                $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                    jqXHR.setRequestHeader("X-CSRF-Token", kadmin.auth.csrf);
                }), $.ajax({
                    url: url + ("" == _id ? "" : "/" + _id),
                    method: method,
                    data: data,
                    contentType: "application/json",
                    dataType: "json"
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + "</div>"), 
                    $$("route_require").refresh();
                }).done(function(j) {
                    $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + "</div>"), 
                    $$("route_require").refresh();
                }).always(function() {
                    $("#light_json_code").html($("#light_json_code").html().replace(/\n/g, "<br/>")), 
                    $("#light_json_code").each(function(i, block) {
                        hljs.configure({
                            useBR: !0
                        }), hljs.highlightBlock(block);
                    });
                });
            });
        }
    } ],
    list: [ {
        view: "text",
        id: "route_debug_model_link",
        label: "Link",
        name: "link"
    }, {
        view: "text",
        id: "route_debug_model_id",
        label: "Primary ID",
        name: "_id"
    }, {
        view: "text",
        id: "route_debug_model_params",
        label: "Params",
        name: "params"
    }, {
        template: "params: ?page=x&page-num=x&order=_id,1",
        height: 30
    }, {
        view: "text",
        id: "route_debug_model_method",
        label: "method",
        name: "method"
    }, {
        view: "button",
        value: "Test",
        type: "danger",
        click: function() {
            var url = $$("route_debug_model_link").getValue(), _id = $$("route_debug_model_id").getValue(), params = $$("route_debug_model_params").getValue(), method = $$("route_debug_model_method").getValue();
            webix.message($$("route_debug_model_link").getValue()), $.ajax({
                url: url + ("" == _id ? "" : "/" + _id) + ("" == params ? "" : params),
                method: method,
                data: {},
                dataType: "json"
            }).done(function(j) {
                $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + "</div>"), 
                $$("route_require").refresh(), $("#light_json_code").html($("#light_json_code").html().replace(/\n/g, "<br/>")), 
                $("#light_json_code").each(function(i, block) {
                    hljs.configure({
                        useBR: !0
                    }), hljs.highlightBlock(block);
                });
            });
        }
    } ],
    create: function(item) {
        console.log(item);
        var tItem = item, fields = _.map(item.v.fields, function(m) {
            switch (m.type) {
              case "image":
              case "file":
                var upload_url = kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/upload";
                return {
                    view: "uploader",
                    id: "id_model_" + m.name,
                    label: m.name,
                    name: m.name,
                    multiple: "undefined" != typeof m.attrs.multi && m.attrs.multi,
                    upload: upload_url,
                    on: {
                        onFileUpload: function(item, response) {
                            1 == response.status && $$("id_model_" + m.name).setValue(item.value._id);
                        },
                        onItemClick: function() {
                            var self = this;
                            kadmin.with_csrf().done(function() {
                                self.define("formData", {
                                    "__anti-forgery-token": kadmin.auth.csrf,
                                    model: tItem.name,
                                    field: m.name,
                                    upload_name: "upload"
                                });
                            });
                        }
                    }
                };

              default:
                return {
                    view: "text",
                    id: "id_" + m.name,
                    name: m.name,
                    label: m.name
                };
            }
        }), button_submit = {
            view: "button",
            type: "danger",
            value: "Test",
            click: function() {
                var post_values = $$("route_require_area").getValues(), url = kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/create/" + post_values.v.name;
                kadmin.with_csrf().done(function() {
                    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                        jqXHR.setRequestHeader("X-CSRF-Token", kadmin.auth.csrf);
                    }), $.ajax({
                        url: url,
                        method: "POST",
                        data: JSON.stringify(post_values),
                        contentType: "application/json"
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + "</div>"), 
                        $$("route_require").refresh();
                    }).done(function(j) {
                        $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + "</div>"), 
                        $$("route_require").refresh();
                    }).always(function() {
                        $("#light_json_code").html($("#light_json_code").html().replace(/\n/g, "<br/>")), 
                        $("#light_json_code").each(function(i, block) {
                            hljs.configure({
                                useBR: !0
                            }), hljs.highlightBlock(block);
                        });
                    });
                });
            }
        };
        return fields.push(button_submit), fields;
    },
    update: function(item) {
        console.log(item);
        var tItem = item, id_field = {
            view: "text",
            type: "text",
            value: "",
            label: "_ID",
            name: "_id"
        }, condition_field = {
            view: "textarea",
            label: "condition",
            name: "_condition",
            height: 100,
            id: "route_debug_model_data"
        }, fields = _.map(item.v.fields, function(m) {
            switch (m.type) {
              case "image":
              case "file":
                var upload_url = kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/upload";
                return {
                    view: "uploader",
                    id: "id_model_" + m.name,
                    label: m.name,
                    name: m.name,
                    multiple: "undefined" != typeof m.attrs.multi && m.attrs.multi,
                    upload: upload_url,
                    on: {
                        onFileUpload: function(item, response) {
                            1 == response.status && $$("id_model_" + m.name).setValue(item.value._id);
                        },
                        onItemClick: function() {
                            var self = this;
                            kadmin.with_csrf().done(function() {
                                self.define("formData", {
                                    "__anti-forgery-token": kadmin.auth.csrf,
                                    model: tItem.name,
                                    field: m.name,
                                    upload_name: "upload"
                                });
                            });
                        }
                    }
                };

              default:
                return {
                    view: "text",
                    id: "id_" + m.name,
                    name: m.name,
                    label: m.name
                };
            }
        }), button_submit = {
            view: "button",
            type: "danger",
            value: "Test",
            click: function() {
                var r = function() {
                    var rv = update_values;
                    return delete rv._condition, delete rv._id, rv;
                }, update_values = $$("route_require_area").getValues(), post_values = {
                    condition: update_values._condition,
                    _id: update_values._id,
                    value: r()
                }, selected_model = $$("route_model_list").getSelectedItem(), url = kadmin.setting.base_url + kadmin.setting.project_prefix_url + "/" + kadmin.project.name + "/model/update/" + selected_model.v.name;
                kadmin.with_csrf().done(function() {
                    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                        jqXHR.setRequestHeader("X-CSRF-Token", kadmin.auth.csrf);
                    }), $.ajax({
                        url: url,
                        method: "POST",
                        data: JSON.stringify(post_values),
                        contentType: "application/json"
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(jqXHR, null, "&nbsp;") + "</div>"), 
                        $$("route_require").refresh();
                    }).done(function(j) {
                        $$("route_require").define("template", '<div id="light_json_code">' + JSON.stringify(j, null, "&nbsp;") + "</div>"), 
                        $$("route_require").refresh();
                    }).always(function() {
                        $("#light_json_code").html($("#light_json_code").html().replace(/\n/g, "<br/>")), 
                        $("#light_json_code").each(function(i, block) {
                            hljs.configure({
                                useBR: !0
                            }), hljs.highlightBlock(block);
                        });
                    });
                });
            }
        };
        return fields.push(id_field), fields.push(condition_field), fields.push(button_submit), 
        fields;
    }
}, wui.route_debug_componse = {
    id: "route_debug",
    text: "Route & Debug",
    type: "space",
    padding: 0,
    cols: [ {
        gravity: 1,
        rows: [ {
            template: "List Routes",
            height: 35,
            type: "header"
        }, {
            id: "route_model_list",
            view: "datatable",
            select: !0,
            scheme: {
                $init: function(obj) {
                    obj.key = obj.name, obj.action_name = obj.name + " - " + obj.action;
                }
            },
            ready: function() {},
            columns: [ {
                id: "t",
                width: 60,
                header: "Type"
            }, {
                id: "action_name",
                width: 200,
                header: "Name"
            }, {
                id: "method",
                width: 60,
                header: "Method"
            }, {
                id: "link",
                header: "Base Link",
                fillspace: !0
            } ],
            resizeColumn: !0,
            on: {
                onItemClick: function(id, e, node) {
                    var item = this.getItem(id);
                    switch (console.log(item), webix.message(item.action), item.action) {
                      case "list":
                        webix.ui(wui.route_debug_model_array.list, $$("route_require_area")), $$("route_require_area").parse(item);
                        break;

                      case "create":
                        webix.ui(wui.route_debug_model_array.create(item), $$("route_require_area")), $$("route_require_area").parse(item);
                        break;

                      case "destroy":
                        webix.ui(wui.route_debug_model_array.destroy, $$("route_require_area")), $$("route_require_area").parse(item);
                        break;

                      case "update":
                        webix.ui(wui.route_debug_model_array.update(item), $$("route_require_area")), $$("route_require_area").clear();
                        break;

                      default:
                        webix.ui(wui.route_debug_model_array["default"], $$("route_require_area")), $$("route_require_area").parse(item);
                    }
                    $$("route_require").define("template", "Waiting..."), $$("route_require").refresh();
                }
            }
        } ]
    }, {
        view: "resizer"
    }, {
        type: "space",
        padding: 0,
        rows: [ {
            id: "route_require_area",
            view: "form",
            scroll: "y",
            elements: [],
            minWidth: 200,
            autoHeight: !0
        }, {
            view: "resizer"
        }, {
            id: "route_require",
            scroll: "y",
            template: "waiting...",
            height: 100
        } ]
    } ]
}, webix.debug = !1, webix.attachEvent("onReady", function() {
    webix.ui({
        type: "space",
        id: "main",
        rows: [ wui.toolbar, {
            type: "space",
            padding: 0,
            cols: [ wui.leftbar, wui.workarea ]
        } ]
    }), wui.switchWorkArea("wellcom"), wui.me();
}), wui.toolbarMenu = [ {
    id: "login",
    value: "Login",
    icon: "user"
}, {
    id: "blog",
    value: "Blog",
    icon: "envelope"
}, {
    id: "help",
    value: "Help",
    icon: "support"
} ], wui.toolbar = {
    id: "toolbar",
    view: "toolbar",
    height: 42,
    cols: [ {
        template: "<div style='padding-top:5px;padding-left:5px;font-size:15px;color:white;'>Kaleido</div>",
        width: 200,
        type: "clean"
    }, {
        id: "topMenu",
        view: "menu",
        data: wui.toolbarMenu,
        on: {
            onMenuItemClick: function(id) {
                switch (webix.message("Value: " + this.getMenuItem(id).value + " Id: " + this.getMenuItem(id).id), 
                this.getMenuItem(id).id) {
                  case "manager_project":
                    wui.switchWorkArea("project", kadmin.project.name), kadmin.project_load();
                    break;

                  case "login":
                    kadmin.login("blog", "test", "test").done(function() {
                        console.log("wui update_toolbar =>", kadmin.auth), "blog" == kadmin.setting.admin_project ? wui.switchWorkArea("admin") : wui.switchWorkArea("project", "blog"), 
                        wui.update_toolbar("update", "login", {
                            id: "logout",
                            value: "<i>" + kadmin.auth.username + "</i> (" + kadmin.auth.userrole + ") Logout ",
                            icon: "user"
                        }), kadmin.project_load().done(function() {
                            wui.project_data_collection = kadmin.project, $$("model_list").parse(wui.project_data_collection.model);
                        });
                    });
                    break;

                  case "logout":
                    kadmin.logout().done(function() {
                        wui.reset(), wui.switchWorkArea("wellcom", null), wui.update_toolbar("update", "logout", {
                            id: "login",
                            value: "Login",
                            icon: "user"
                        }), wui.update_toolbar("remove", "manager_project");
                    });
                    break;

                  default:
                    webix.message("No Event!");
                }
            }
        }
    } ]
}, wui.wellcom_componse = {
    id: "wellcom",
    text: "Well",
    template: "<i>welcome</i>"
}, wui.info_componse = {
    id: "info",
    text: "Info",
    template: "<i>info</i>"
}, wui.setting_componse = {
    id: "setting",
    text: "Setting",
    template: "<i>setting_componse</i>"
}, wui.update_project_data_collection = function() {
    var numargs = arguments.length;
    switch (numargs) {
      case 2:
        var model = arguments[0], values = arguments[1];
        _.each(wui.project_data_collection.model, function(m, j) {
            m.name == model && (wui.project_data_collection.model[j] = values);
        });
        break;

      case 3:
        var model = arguments[0], field = arguments[1], values = arguments[2];
        _.each(wui.project_data_collection.model, function(m, j) {
            m.name == model && _.each(m.fields, function(f, k) {
                f.name == field && (wui.project_data_collection.model[j].fields[k] = values);
            });
        });
        break;

      default:
        webix.message("update_project_data_collection => No Found!");
    }
}, wui.event_componse = {
    id: "event",
    text: "Event",
    template: "<i>event</i>"
}, wui.proxy_componse = {
    id: "proxy",
    text: "Proxy",
    template: "<i>proxy_componse</i>"
}, wui.account_componse = {
    id: "account",
    text: "Account",
    template: "<i>account_componse</i>"
}, wui.logger_componse = {
    id: "logger",
    text: "Logger",
    template: "<i>logger_componse</i>"
}, wui.workarea_wellcom_menu = [ wui.wellcom_componse ], wui.workarea_componses = [ wui.wellcom_componse, wui.info_componse, wui.setting_componse, wui.model_componse, wui.event_componse, wui.proxy_componse, wui.account_componse, wui.logger_componse, wui.route_debug_componse ], 
wui.workarea_project_menu = [ wui.info_componse, wui.setting_componse, wui.model_componse, wui.event_componse, wui.proxy_componse, wui.account_componse, wui.logger_componse, wui.route_debug_componse ], 
wui.leftMenu = _.map(wui.workarea_wellcom_menu, function(w) {
    return {
        id: w.id,
        value: w.text,
        select: w.select
    };
}), wui.switchWorkArea = function(work, project_name) {
    switch (console.log("wui.switchWorkArea => ", work, project_name), work) {
      case "wellcom":
        console.log("switchWorkArea => " + work), wui.leftMenu = _.map(wui.workarea_wellcom_menu, function(w) {
            return {
                id: w.id,
                value: w.text,
                select: w.select
            };
        }), $$("leftMenu").clearAll(), $$("leftMenu").parse(wui.leftMenu), $$("leftMenu").select("wellcom"), 
        $$("workArea").setValue("wellcom");
        break;

      case "project":
        console.log("switchWorkArea => " + work), wui.update_toolbar("update", "manager_project", {
            id: "manager_project",
            value: "Project - " + project_name,
            icon: "qrcode"
        }), wui.leftMenu = _.map(wui.workarea_project_menu, function(w) {
            return {
                id: w.id,
                value: w.text,
                select: w.select
            };
        }), $$("leftMenu").clearAll(), $$("leftMenu").parse(wui.leftMenu), $$("leftMenu").select("info"), 
        $$("workArea").setValue("info");
        break;

      case "model":
        $$("workArea").setValue("model");
        break;

      case "route_debug":
        wui.route_debug_init(), $$("workArea").setValue("route_debug");
        break;

      default:
        webix.message("switchWork Fail! " + work);
    }
}, wui.project_data_collection = new webix.DataCollection(), wui.reset = function() {
    kadmin.reset(), wui.project_data_collection = new webix.DataCollection(), $$("model_list").clearAll();
}, wui.update_toolbar = function(action, menuId, value) {
    var newToolbarMenu = [];
    switch (action) {
      case "remove":
        newToolbarMenu = _.filter(wui.toolbarMenu, function(m) {
            return m.id != menuId;
        });
        break;

      case "update":
        var existed = !1;
        newToolbarMenu = _.map(wui.toolbarMenu, function(m) {
            return m.id == menuId ? (existed = !0, value) : m;
        }), existed || newToolbarMenu.push(value);
        break;

      default:
        webix.message("No Action in update_toolbar! => " + action);
    }
    wui.toolbarMenu = newToolbarMenu, console.log("wui.toolbarMenu => ", action, menuId, wui.toolbarMenu), 
    $$("topMenu").clearAll(), $$("topMenu").parse(wui.toolbarMenu);
}, wui.leftbar = {
    view: "menu",
    id: "leftMenu",
    layout: "y",
    width: 200,
    select: !0,
    data: wui.leftMenu,
    on: {
        onMenuItemClick: function(id) {
            wui.switchWorkArea(id);
        }
    }
}, wui.me = function() {
    kadmin.me().then(function() {
        console.log(kadmin.auth), kadmin.auth.is_login && "" != kadmin.project.name && kadmin.project_load(function() {
            wui.switchWorkArea("project", kadmin.project.name), wui.project_data_collection = kadmin.project, 
            $$("model_list").parse(wui.project_data_collection.model), wui.update_toolbar("update", "login", {
                id: "logout",
                value: "<i>" + kadmin.auth.username + "</i> (" + kadmin.auth.userrole + ") Logout ",
                icon: "user"
            });
        });
    });
}, wui.workarea = {
    id: "workArea",
    view: "multiview",
    fitBiggest: !0,
    animate: !1,
    keepViews: !1,
    cells: wui.workarea_componses
};
