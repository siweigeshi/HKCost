Ext.define(
  'ExtFrame.view.main.sys.userManager.UserManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.sys.userManager.UserManagerController', 'ExtFrame.view.main.sys.userManager.UserManagerModel', 'ExtFrame.view.main.sys.userManager.UserGrid', 'ExtFrame.view.extEncap.TreeCombo'],//请求MainController类
      layout: { type: 'border' },
      controller: 'userManager',
      viewModel: { type: 'userManagerModel' },
      eName: '',//用于构造itemId，很重要，要和数据库存储的模块Ename对应
      initComponent: function () {
          var me = this;
          me.items = [{
              xtype: 'form',
              itemId: me.eName + 'Form',
              eName: me.eName,
              region: 'north',
              bodyPadding: 5,
              padding: 2,
              defaults: {
                  bodyPadding: 5
              },
              fieldDefaults: {
                  labelAlign: 'right'
              },
              items: [{
                  layout: 'column',
                  itemId: 'column1',
                  items: [{
                      xtype: 'hiddenfield',
                      itemId: 'hfOID',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'OID',
                      bind: '{rec.OID}'
                  }, {
                      xtype: 'textfield',
                      name: 'Name',
                      bind: '{rec.Name}',
                      fieldLabel: '姓名',
                      emptyText: '请输入姓名',
                      allowBlank: false,
                      labelWidth: 60
                  }, {
                      xtype: 'textfield',
                      itemId: 'UserName',
                      name: 'UserName',
                      bind: '{rec.UserName}',
                      fieldLabel: '用户名',
                      emptyText: '请输入用户名',
                      allowBlank: false,// 不允许为空
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              var value = me.getValue();
                              if (value == '')
                                  valid = "请输入用户名";
                              else {
                                  var OID;
                                  if (me.OID != undefined && me.OID != '') {
                                      OID = me.OID;
                                      me.OID = '';
                                  } else {
                                      OID = me.up('#column1').down('#hfOID').getValue();
                                  }
                                  Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/UserManager/GetIsExist?ct=json&OID=' + OID + '&col=UserName&val=' + value, 'GET', null, false, function (jsonData) {
                                      if (jsonData) {
                                          valid = "用户名已存在，请更换";
                                      }
                                      else {
                                          valid = true;
                                      }
                                  });
                              }
                              me.validation = valid;
                          }
                      }
                  }, {
                      xtype: 'hiddenfield',
                      name: 'UserPwd',
                      bind: '{rec.UserPwd}',
                      //inputType: 'password',
                      labelWidth: 60
                  }, {
                      xtype: 'textfield',
                      itemId: 'Email',
                      name: 'EMAIL',
                      bind: '{rec.EMAIL}',
                      emptyText: '请输入邮箱',
                      allowBlank: false,
                      //inputType: 'password',
                      fieldLabel: '邮箱',
                      labelWidth: 60,
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              if (newValue == '' || newValue == null) {
                                  return;
                              } else if (!Tools.Method.StrValidEncap(newValue, 'email')) {
                                  valid = "邮箱格式不正确";
                              } else {
                                  var OID = me.OID;
                                  Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/UserManager/GetIsExist?ct=json&OID=' + OID + '&col=EMAIL&val=' + newValue, 'GET', null, false, function (jsonData) {
                                      if (jsonData) {
                                          valid = "邮箱已存在，请更换";
                                      }
                                      else {
                                          valid = true;
                                      }
                                  });
                              }
                              me.validation = valid;
                          }
                      }
                  }]
              }, {
                  layout: 'column',
                  itemId: 'column2',
                  items: [{
                      xtype: 'combo',
                      name: 'State',
                      bind: '{rec.State}',
                      emptyText: '请选择状态',
                      labelWidth: 60,
                      editable: false,// 是否允许输入
                      allowBlank: false,
                      store: Ext.create('Ext.data.Store', {
                          fields: ['abbr', 'name'],
                          data: [{ 'abbr': '0', 'name': '正常' }, { 'abbr': '1', 'name': '停用' }]
                      }),
                      queryMode: 'local',
                      displayField: 'name',
                      valueField: 'abbr',
                      fieldLabel: '状态',
                      value: 0
                  },
                  {
                      xtype: 'hiddenfield',
                      itemId: 'hfOrgs',
                      bind: '{rec.Orgs}'
                  },
                  {
                      xtype: 'multitreepicker',
                      itemId: 'treeOrg',
                      name: 'Orgs',
                      //allowBlank: false,
                      emptyText: '请选择组织结构',
                      fieldLabel: '组织机构',
                      displayField: 'Name',
                      valueField: 'OID',
                      initComponent: function () {
                          var treeOrgs = this;
                          treeOrgs.store = Ext.create('Ext.data.TreeStore', {
                              model: 'Ext.data.TreeModel',
                              autoLoad: true,
                              proxy: {
                                  type: 'ajax',
                                  url: Tools.Method.getAPiRootPath() + '/api/OrgManager/GetOrgList?ct=json&type=all',
                                  //扩展参数
                                  extraParams: {
                                      'orgId': '00000000-0000-0000-0000-000000000000'
                                  }
                              },
                              folderSort: true
                          })
                          treeOrgs.callParent();
                      },
                      listeners: {
                          change: function (treepicker, newValue, oldValue, eOpts) {
                              treepicker.up('#column2').down('#hfOrgs').setValue(Ext.encode(newValue));
                          },
                          select: function (treepicker, record, eOpts) {
                              treepicker.up('#column2').down('#hfOrgs').setValue(Ext.encode(treepicker.getValue()));
                          }
                      }
                  }]
              }]
          }, {
              xtype: 'usergrid',
              itemId: me.eName + 'Grid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }

);