Ext.define(
  'ExtFrame.view.login.Login',
  {
      requires: ['ExtFrame.view.login.LoginController', 'ExtFrame.view.extEncap.LinkButton', 'ExtFrame.view.extEncap.verifyCode.VerifyCode'],
      extend: 'Ext.container.Viewport',
      controller: 'login',
      closable: false,
      resizable: false,
      loginFailNum: 0,
      //modal: true,
      //draggable: false,
      autoShow: true,
      title: '用户登录---MVCFrame',
      glyph: 'xf007@FontAwesome',
      initComponent: function () {
          var width = 400;
          //var height = 350;
          this.items = [{
              xtype: 'form',//父窗体
              bodyBorder: true,
              border: false,
              align: 'center',
              plain: true,
              x: $('#bgDiv').width() / 2 - width / 2,
              y: $('#bgDiv').height() / 2 - width / 2,
              width: width,
              //height: height,
              buttonAlign: 'center',
              labelAlign: 'right',
              bodyPadding: '30 20 30 20',
              items: [{
                  xtype: 'label',
                  text: '请输入用户名密码登录',
                  style: {
                      color: '#535353'
                  }
              }, {
                  xtype: 'textfield',
                  name: 'UserName',
                  labelWidth: 50,
                  //fieldLabel: '用户名',
                  allowBlank: false,
                  emptyText: '用户名或邮箱地址',
                  value: '',
                  enableKeyEvents: true,
                  style: {
                      width: '360px',
                      height: '50px',
                      marginTop: '5px',
                      marginBottom: '10px'
                  },
                  listeners: {
                      keyup: 'onKeyUp'
                  }
              }, {
                  xtype: 'textfield',
                  name: 'UserPwd',
                  labelWidth: 50,
                  inputType: 'password',
                  //fieldLabel: '密  码',
                  allowBlank: false,
                  emptyText: '请输入您的密码',
                  value: '',
                  enableKeyEvents: true,
                  glyph: '0xf0b2',
                  style: {
                      width: '360px',
                      height: '50px',
                      marginBottom: '10px'
                  },
                  listeners: {
                      keyup: 'onKeyUp'
                  }
              }, {
                  xtype: 'linkbutton',
                  text: '忘记密码？',
                  handler: 'onRetrievePasswordClick'
                  //function (e) {
                  //    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0032, 2000, 3, null);
                  //}
              }, {
                  xtype: 'verifycode',
                  fieldLabel: '验证码',
                  emptyText: '请输入验证码',
                  width:150,
                  labelWidth: 45,
                  enableKeyEvents: true,
                  hidden: true,
                  codeUrl: Tools.Method.getRootPath() + '/Areas/ExtFrame/app/view/extEncap/verifyCode/VerifyCode.ashx',
                  listeners: {
                      change: function (me, newValue, oldValue, eOpts) {
                          var value = me.getValue();
                          var valid;
                          if (value == '')
                              valid = "请输入验证码";
                          else {
                              if (newValue == $.cookie('CheckCode'))
                                  valid = true;
                              else {
                                  valid = "验证码不正确";
                              }
                          }
                          me.validation = valid;
                      },
                      keyup: 'onKeyUp'
                  }
              }],
              buttons: [{
                  name: 'registbutton',
                  text: '用户注册',
                  style: {
                      width: '175px',
                      height: '40px',
                      marginBottom: '10px'
                  },
                  glyph: 'xf118@FontAwesome'
              }, {
                  name: 'loginbutton',
                  text: '用户登录',
                  style: {
                      width: '175px',
                      height: '40px',
                      marginBottom: '10px'
                  },
                  glyph: 'xf110@FontAwesome',
                  region: 'center',
                  listeners: {
                      click: 'onLoginbtnClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                  }
              }]
          }];
          this.callParent();
      }
  }
);