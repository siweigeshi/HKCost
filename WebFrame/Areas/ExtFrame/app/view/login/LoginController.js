Ext.define(
  'ExtFrame.view.login.LoginController',
  {
      extend: 'Ext.app.ViewController',
      alias: 'controller.login',
      onKeyUp: function (textField, e) {
          if (e.getKey() == 13) {
              this.onLoginbtnClick();
          }

      },
      //用户登录按钮事件处理
      onLoginbtnClick: function () {
          //var form = this.lookupReference('form');
          var form = this.getView().down('form');
          var formValue = form.getValues();
          var UserPwd = $.md5(formValue.UserPwd);
          formValue.UserPwd = UserPwd;
          if (form.isValid()) {
              this.login({
                  data:form.getValues(),
                  scope: this,
                  success: 'onLoginSuccess',
                  failure: 'onLoginFailure'
              })
          }
      },
      onLoginFailure: function () {
          Ext.getBody().unmask();
      },
      onLoginSuccess: function (userId, userName, userOrg) {
          this.fireViewEvent('login', userId, userName, userOrg);
      },
      login: function (options) {
          var UserPwd = $.md5(options.data.UserPwd);
          options.data.UserPwd = UserPwd;
          var curController = this;
          var t1 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在请求页面...&nbsp;&nbsp;";
          Ext.getBody().mask(t1, 'page-loading');
          var t2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在登录系统...&nbsp;&nbsp;";
          curController.getView().mask(t2, 'page-loading');
          Ext.Ajax.request({
              url: Tools.Method.getAPiRootPath() + '/api/Base/PostUserForLogin?ct=json',
              method: 'POST',
              params: options.data,
              dataType: 'json',
              contentType: 'application/json',
              success: function (response) {
                  curController.getView().unmask();
                  var jsonData = Ext.decode(response.responseText);
                  curController.onLoginReturn(options, jsonData.result, jsonData);
              },
              failure: function (response, opts) {
                  console.log('server-side failure with status code ' + response.status);
              }
          });
      },
      onLoginReturn: function (options, success, jsonData) {
          if (success) {
              Tools.Method.AddCookie("CurUser", "['" + jsonData.user.OID + "','" + jsonData.user.Name + "','']", 20);
              Ext.callback(options.success, options.scope, [jsonData.user.OID, jsonData.user.Name, jsonData.user.Orgs]);
              return;
          }
          else {
              this.getView().loginFailNum++;
              if (this.getView().loginFailNum == 2) {
                  this.getView().down('verifycode').show()
              } else if (this.getView().loginFailNum > 2) {
                  this.getView().down('verifycode').setValue('');
                  this.getView().down('verifycode').loadCodeImg();
              }
              Ext.MessageBox.alert('登录失败', '用户名密码不正确！');
          }
      },
      //用户忘记密码时间处理
      onRetrievePasswordClick: function () {
          this.fireViewEvent('retrievePassword');
      }
  }
);