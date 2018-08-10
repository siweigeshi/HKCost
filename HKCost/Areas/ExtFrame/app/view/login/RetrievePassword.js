Ext.define(
  'ExtFrame.view.login.RetrievePassword',
  {
      requires: ['ExtFrame.view.login.RetrievePasswordController', 'ExtFrame.view.extEncap.LinkButton', 'ExtFrame.view.extEncap.verifyCode.VerifyCode'],
      extend: 'Ext.container.Viewport',
      controller: 'retPwd',
      closable: false,
      resizable: false,
      title: '密钥找回--MVCFrame',
      glyph: 'xf007@FontAwesome',
      initComponent: function () {
          var width = 400;
          this.items = [{
              xtype: 'form',//父窗体
              itemId: 'step1',
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
                  text: '用户名',
                  style: {
                      color: '#535353'
                  }
              }, {
                  xtype: 'textfield',
                  itemId: 'UserName',
                  labelWidth: 50,
                  allowBlank: false,
                  value: '',
                  enableKeyEvents: true,
                  style: {
                      width: '360px',
                      height: '50px',
                      marginTop: '5px',
                      marginBottom: '10px'
                  }
              }, {
                  xtype: 'verifycode',
                  fieldLabel: '验证码',
                  emptyText: '请输入验证码',
                  width: 150,
                  labelWidth: 45,
                  enableKeyEvents: true,
                  hidden: false,
                  allowBlank: false,
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
                      }
                  }
              }],
              buttons: [{
                  name: 'returnLogin',
                  text: '返回登录页',
                  style: {
                      width: '175px',
                      height: '40px',
                      marginBottom: '10px'
                  },
                  listeners: {
                      click: 'onReturnLoginClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                  },
                  glyph: 'xf118@FontAwesome'
              }, {
                  name: 'loginbutton',
                  text: '下一步',
                  style: {
                      width: '175px',
                      height: '40px',
                      marginBottom: '10px'
                  },
                  glyph: 'xf110@FontAwesome',
                  region: 'center',
                  listeners: {
                      click: 'onNextClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                  }
              }]
          }, {
              xtype: 'form',//父窗体
              itemId: 'step2',
              hidden: true,
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
                  xtype: 'displayfield',
                  itemId: 'UserName',
                  labelWidth: 100,
                  fieldLabel: '重置密码用户名',
                  allowBlank: false
              }, {
                  xtype: 'combo',
                  itemId: 'retType',
                  emptyText: '请选择',
                  labelWidth: 100,
                  editable: false,// 是否允许输入
                  allowBlank: false,
                  store: Ext.create('Ext.data.Store', {
                      fields: ['abbr', 'name'],
                      data: [{ 'abbr': 'email', 'name': '电子邮箱' }]
                  }),
                  queryMode: 'local',
                  displayField: 'name',
                  valueField: 'abbr',
                  fieldLabel: '请选择验证方式',
                  value: 'email'
              }, {
                  xtype: 'textfield',
                  itemId: 'email',
                  fieldLabel: '请输入电子邮箱',
                  emptyText: '请输入电子邮箱',
                  allowBlank: false,
                  vtype: 'EmailVerification',
                  labelWidth: 100
              }, {
                  xtype: 'displayfield',
                  itemId: 'remark',
                  fieldStyle: 'color:red'
              }],
              buttons: [{
                  name: 'returnLogin',
                  text: '返回登录页',
                  style: {
                      width: '175px',
                      height: '40px',
                      marginBottom: '10px'
                  },
                  listeners: {
                      click: 'onReturnLoginClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                  },
                  glyph: 'xf118@FontAwesome'
              }, {
                  itemId: 'RetPwd',
                  text: '重置密码',
                  style: {
                      width: '175px',
                      height: '40px',
                      marginBottom: '10px'
                  },
                  glyph: 'xf110@FontAwesome',
                  region: 'center',
                  listeners: {
                      click: 'onRetPwdClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                  }
              }]
          }];
          this.callParent();
      }
  }
);