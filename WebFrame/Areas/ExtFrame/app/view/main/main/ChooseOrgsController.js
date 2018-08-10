Ext.define(
  'ExtFrame.view.main.ChooseOrgsController',
  {
      extend: 'Ext.app.ViewController',
      alias: 'controller.chooseOrgs',
      onKeyUp: function (textField, e) {
          if (e.getKey() == 13) {
              this.onChooseOrgClick();
          }

      },
      //用户登录按钮事件处理
      onChooseOrgClick: function () {
          var form = this.lookupReference('form');
          if (form.isValid()) {
              this.chooseOrg({
                  data: form.getValues(),
                  scope: this,
                  success: 'onLoginSuccess',
                  failure: 'onLoginFailure'
              })
          }
      },
      onLoginFailure: function () {
          Ext.getBody().unmask();
      },
      onLoginSuccess: function (UserName,DefaultOrgId, Orgs) {
          this.fireViewEvent('chooseOrgs', UserName,DefaultOrgId, Orgs);
      },
      chooseOrg: function (options) {
          var CurUser = Ext.decode($.cookie('CurUser'));
          var DefaultOrgId = options.data.OrgCombo;
          var UserName = CurUser[1];
          var Orgs = Ext.decode(options.data.Orgs);
          CurUser[2] = DefaultOrgId;
          Tools.Method.AddCookie('CurUser', Ext.encode(CurUser), 20);
          Ext.callback(options.success, options.scope, [UserName,DefaultOrgId, Orgs]);
      }
  }
);