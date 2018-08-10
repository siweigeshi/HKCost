Ext.define(
  'ExtFrame.view.login.RetrievePasswordController',
  {
      extend: 'Ext.app.ViewController',
      alias: 'controller.retPwd',
      onReturnLoginClick: function () {
          //var form = this.lookupReference('form');
          this.fireViewEvent('returnLogin');
      },
      onNextClick: function () {
          var formStep1 = this.getView().down('#step1');
          if (formStep1.isValid()) {
              var userName = formStep1.down('#UserName').getValue();
              var formStep2 = this.getView().down('#step2');
              formStep2.down('#UserName').setValue(userName);
              formStep1.hide();
              formStep2.show(true);
          }
      },
      onRetPwdClick: function () {
          var me = this;
          var form = this.getView().down('#step2');
          if (form.isValid()) {
              var btnRetPwd = form.down('#RetPwd');
              var countdown = 120;
              btnRetPwd.setDisabled(true);
              var retType = form.down('#retType').getValue();
              if (retType == 'email') {
                  var userName = form.down('#UserName').getValue();
                  var email = form.down('#email').getValue();
                  var random = me.createRandom();
                  var remark = '';
                  var rec = {};
                  rec.UserName = userName;
                  rec.Email = email;
                  rec.Random = random;
                  var data = Tools.Method.GetPostData(Ext.encode(rec));
                  Tools.Method.ExtAjaxRequestEncap('/api/Base/PostSendEmailSave?ct=json', 'POST', data, true, function (jsonData) {
                      if (jsonData.res) {
                          remark = '请登录 ' + email + ' 安全邮箱，打开邮件序号为：' + random + '的邮件，重置密码。'
                          form.down('#remark').setValue(remark);
                          me.oneSecond(countdown, btnRetPwd);
                      } else {
                          remark = '您输入的邮箱和用户不符，请更改后再试！';
                          form.down('#remark').setValue(remark);
                      }
                  });
              }

          }
      },
      oneSecond: function (Num, btnRetPwd) {
          var me = this;

          if (Num == 0) {
              btnRetPwd.setText('重新发送')
              btnRetPwd.setDisabled(false);
          } else {
              btnRetPwd.setText('重置密码(' + Num + 's)')
              setTimeout(function () {
                  Num--;
                  me.oneSecond(Num, btnRetPwd);
              }, 1000);
          }
      },
      createRandom: function () {
          //生成4为随机数
          var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          var random = "";
          for (var i = 0; i < 4 ; i++) {
              var id = Math.ceil(Math.random() * 10);
              random += chars[id-1];
          }
          return random;
      }
  }
);