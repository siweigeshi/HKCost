Ext.define(
  'ExtFrame.view.main.ChangePwdController',
  {
      extend: 'Ext.app.ViewController',
      alias: 'controller.changePwdController',
      //用户更改密码事件处理
      onChangePwdClick: function () {
          var view = this.getView();
          var form = view.down('form');
          if (form.isValid()) {
              var CurUser = Ext.decode($.cookie('CurUser'));
              var userOID = CurUser[0];
              var oldPwd = form.down('#OldPwd').getValue();
              var newPwd = form.down('#NewPwd').getValue();
              var oldPwdMd5 = $.md5(oldPwd);//原密码MD5加密
              var newPwdMd5 = $.md5(newPwd);//新密码MD5加密
              var json = { userOID: userOID, oldPwd: oldPwdMd5, newPwd: newPwdMd5 };
              var data = Tools.Method.GetPostData(Ext.encode(json), true);
              Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/base/ChangePwdUpdate?ct=json', 'POST', data, false, function (jsonData) {
                  if (jsonData) {
                      view.close();
                      Tools.Method.ShowTipsMsg('修改密码成功！', 3000, 1, null);
                  } else {
                      Tools.Method.ShowTipsMsg('原密码不正确！', 3000, 2, null);
                  }
              });
          }
      }
  }
);