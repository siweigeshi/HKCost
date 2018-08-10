Ext.define(
  'ExtFrame.view.login.NewPwdController',
  {
      extend: 'Ext.app.ViewController',
      alias: 'controller.newPwdController',
      //用户保存密码事件处理
      onNewPwdClick: function () {
          var view = this.getView();
          var form = view.down('form');
          var me = this;
          if (form.isValid()) {
              form.down('button').setDisabled(true);
              var v = true;
              var msg = '';
              var urlParams = Tools.Method.GetUrlParams();
              var rec = {};
              rec.UserName = view.userName;
              rec.userPwd = $.md5(form.down('#NewPwd').getValue());//MD5加密
              rec.signature = urlParams['signature'];
              rec.timestamp = urlParams['timestamp'];
              rec.nonce = urlParams['nonce'];
              rec.value = urlParams['value'];
              var data = Tools.Method.GetPostData(Ext.encode(rec));
              Tools.Method.ExtAjaxRequestEncap('/api/Base/PostChangePwdSave?ct=json',
              'POST', data, false, function (jsonData) {
                  v = jsonData.res;
                  msg = jsonData.msg;
                  Tools.Method.ShowTipsMsg(msg,3000, v ? 1 : 2, function () {
                      me.fireViewEvent('CreateNewPwd');
                 })
              });
          }
      }
  }
);