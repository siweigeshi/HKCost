Ext.define(
  'ExtFrame.view.main.sys.permissionManager.PermissionManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.sys.permissionManager.PermissionManagerController', 'ExtFrame.view.main.sys.permissionManager.PermissionManagerModel', 'ExtFrame.view.main.sys.permissionManager.PermissionGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'permissionManager',
      viewModel: { type: 'permissionManagerModel' },
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
                  items: [{
                      xtype: 'hiddenfield',
                      itemId: 'hfOID',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'OID',
                      bind: '{rec.OID}'
                  }, {
                      xtype: 'textfield',
                      name: 'Name',
                      bind: '{rec.Name}',
                      fieldLabel: '名称',
                      emptyText: '请输入名称',
                      allowBlank: false,
                      maxLength: 25,
                      labelWidth: 40
                  }, {
                      xtype: 'textfield',
                      name: 'Description',
                      bind: '{rec.Description}',
                      fieldLabel: '描述',
                      maxLength: 100,
                      emptyText: '请输入权限描述',
                  }, {
                      xtype: 'hiddenfield',
                      name: 'CreateTime',
                      bind: '{rec.CreateTime}',
                      fieldLabel: '创建时间'
                  }]
              }]
          }, {
              xtype: 'permissiongrid',
              itemId: me.eName + 'Grid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }

);