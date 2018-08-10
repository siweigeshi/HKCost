Ext.define('ExtFrame.view.main.UserInfoController',
  {
      extend: 'Ext.app.ViewController',
      alias: 'controller.userInfoController',
      //用户更改密码事件处理
      onChangeInfoClick: function () {
          var view = this.getView();
          var form = view.down('form');
          if (form.isValid()) {
              var record = view.getViewModel().getData().rec;
              var data = Tools.Method.GetPostData(Ext.encode(record));
              Tools.Method.ExtAjaxRequestEncap('/api/Base/MyInfoUpdate?ct=json', 'POST', data, true, function (jsonData) {
                  if (jsonData) {
                      Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                      view.close();
                  } else {
                      Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                  }
              });
          }
      }
  }
);