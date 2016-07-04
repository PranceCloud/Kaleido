kadmin =
  setting:
    admin_project: 'kaleido'
    admin_url: 'm'
    base_url: '/'
    project_prefix_url: 'project'

  project:
    name: 'kaleido'
    path: ''
    allow_manage_ip: ''
    model: []

  auth:
    is_login: false
    is_admin: false
    admin_role_name: "admin"
    username: "Guest"
    session: null
    auth: {role: '', user: ''}
    csrf: '?'

  projects: []
  require: {}

  with_csrf: (call)->
    f = (dtd) ->
      dtd = $.Deferred()
      $.getJSON(kadmin.setting.base_url + 'csrf')
      .done((d)->
        if typeof d == "object"
          kadmin.auth.csrf = d.csrf
          console.log("with_csrf resolve!")
          dtd.resolve()
          call() if typeof call == 'function'
      )
      dtd.promise()
    $.when(f())

  reset: ->
    this.auth.username = "Guest";
    this.auth.is_login = false;
    this.auth.is_admin = false;
    this.project.name = '';
    this.project.model = [];

  me: (call)->
    $.getJSON(kadmin.setting.base_url + 'me').done((data) ->
      if _.isObject(data.account) && (_.size(data.account) > 0)
        _.each(data.account, (val, key)->
          kadmin.auth.username = val.auth.login_name
          kadmin.auth.userrole = val.auth.role
          kadmin.auth.session = val.auth
          kadmin.project.name = key
          kadmin.auth.is_login = true
          kadmin.auth.is_admin = true if (key == kadmin.admin_project)
        )
    ).always(->
      call() if typeof call == 'function'
    )

  logout: (call) ->
    f = (dtd) ->
      dtd = $.Deferred()
      $.getJSON(kadmin.setting.base_url + kadmin.setting.admin_url + '/auth/logout', ->
        kadmin.reset()
        dtd.resolve()
        call() if typeof call == 'function'
      )
      dtd.promise()
    $.when(f())

  login: (project, user, password)->
    l = {
      csrf: ''
      login_name: user
      login_password: password
      project_name: project
    }
    project_auth_url = kadmin.setting.admin_url;
    if not (l.project_name == kadmin.setting.admin_project)
      project_auth_url = kadmin.setting.project_prefix_url + "/" + l.project_name;


    f = (dtd) ->
      dtd = $.Deferred()
      kadmin.with_csrf().done(->
        $.ajaxPrefilter((options, originalOptions, jqXHR) ->
          jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
        )
        console.log("kadmin login beforeSend =>", kadmin.auth.csrf)
        $.ajax(
          {
            url: kadmin.setting.base_url + project_auth_url + '/auth/login',
            method: 'POST',
            data: {
              'login_name': l.login_name
              'login_password': md5(md5(l.login_password) + kadmin.auth.csrf)
              'csrf': kadmin.auth.csrf
            }
          })
        .done((data) ->
          if data.status == true
            kadmin.auth.is_login = true
            kadmin.auth.username = data.value.login_name
            kadmin.auth.userrole = data.value.role
            kadmin.project.name = l.project_name
            kadmin.auth.is_login = true
            if l.project_name == kadmin.setting.admin_project
              kadmin.auth.is_admin = true
          else
            kadmin.auth.is_login = false
          console.log("login resolve!")
          dtd.resolve()
        )
      )
      dtd.promise()
    $.when(f())

  project_load: (call)->
    f = (dtd) ->
      dtd = $.Deferred()
      $.getJSON(kadmin.setting.base_url + kadmin.setting.project_prefix_url + '/' + kadmin.project.name + '/')
      .done((data) ->
        kadmin.project.model = data.model.data
        kadmin.project.path = data.path
        kadmin.project.allow_manage_ip = data.allowIP
        dtd.resolve()
        call() if typeof call == 'function'
      )
      dtd.promise()
    $.when(f())

  model_parse: (call)->
    f = (dtd) ->
      dtd = $.Deferred()
      if not (kadmin.project.name == '') && kadmin.project.model?
        console.log(kadmin.project.model)

      dtd.resolve()
      call() if typeof call == 'function'

      dtd.promise()
    $.when(f())

  field_join_value: (current_model, call) ->
#    console.log(current_model, kadmin.project.model)
    models = _.filter(kadmin.project.model, (m)->
      return m.name != current_model
    )
    #    fields = _.flatten(_.map(models, (m)-> m.fields))
    _fields = _.filter(
      _.flatten(_.map(models, (m)->
        mm = m
        _.map(m.fields, (m1) ->
          nm = m1
          nm.model_name = mm.name
          nm)
      )),
      (m)->
        not (_.contains(["join", "json"], m.type))
    )
    fields = _.map(_fields, (f)-> return f.model_name + "." + f.name)
    console.log(fields)
    fields
#    ["123123", '12312331', '234234432', new Date().getTime().toString()]

  model_destroy: (model, call)->
    m = model
    f = (dtd) ->
      dtd = $.Deferred()
      console.log("kadmin model_destroy => ", m)
      kadmin.with_csrf().done(->
        $.ajaxPrefilter((options, originalOptions, jqXHR) ->
          jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
        )
        $.ajax(
          {
            url: kadmin.setting.base_url + kadmin.setting.project_prefix_url + '/' + kadmin.project.name + '/destroy/model',
            contentType: 'application/json'
            method: 'POST'
            data: JSON.stringify(m)
          })
        .done((data) ->
          dtd.resolve()
          call() if typeof call == 'function'
        )
      )
      dtd.promise()
    $.when(f())

  model_save: (values, call)->
    model_value = values
    f = (dtd) ->
      dtd = $.Deferred()
      console.log("kadmin model_save => ", model_value)

      kadmin.with_csrf().done(->
        $.ajaxPrefilter((options, originalOptions, jqXHR) ->
          jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
        )
        $.ajax(
          {
            url: kadmin.setting.base_url + kadmin.setting.project_prefix_url + '/' + kadmin.project.name + '/update/model',
            contentType: 'application/json'
            method: 'POST'
            data: JSON.stringify(model_value)
          })
        .done((data) ->
          kadmin.require = data
          dtd.resolve()
          call() if typeof call == 'function'
        )
      )

      dtd.promise()
    $.when(f())

  project_save: (values, call)->
    project_value = values
    f = (dtd) ->
      dtd = $.Deferred()
      console.log(project_value)

      kadmin.with_csrf().done(->
        $.ajaxPrefilter((options, originalOptions, jqXHR) ->
          jqXHR.setRequestHeader('X-CSRF-Token', kadmin.auth.csrf)
        )
        $.ajax(
          {
            url: kadmin.setting.base_url + kadmin.setting.project_prefix_url + '/' + project_value.name + '/update/model',
            contentType: 'application/json'
            method: 'POST',
            data: JSON.stringify(project_value)
          })
        .done((data) ->
          dtd.resolve()
          call() if typeof call == 'function'
        )
      )

      dtd.promise()
    $.when(f())

  project_delete: (name, call) ->
    f = (dtd) ->
      dtd = $.Deferred()
      console.log(name)

      dtd.resolve()
      call() if typeof call == 'function'

      dtd.promise()
    $.when(f())


    
    



