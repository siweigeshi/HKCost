
Ext.define(
  'ExtFrame.view.main.sys.roleManager.RoleManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.sys.roleManager.RoleManagerController', 'ExtFrame.view.main.sys.roleManager.RoleManagerModel', 'ExtFrame.view.main.sys.roleManager.RoleGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'roleManager',
      viewModel: { type: 'roleManagerModel' },
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
                      name: 'OID',
                      itemId: 'hfOID',//注意，此itemId要写固定，functionjs中重置from有用到
                      bind: '{rec.OID}'
                  }, {
                      xtype: 'textfield',
                      name: 'Code',
                      bind: '{rec.Code}',
                      fieldLabel: '编号',
                      emptyText: '请输入编号',
                      labelWidth: 40,
                      maxLength: 25,
                  }, {
                      xtype: 'textfield',
                      name: 'Name',
                      bind: '{rec.Name}',
                      fieldLabel: '角色名称',
                      emptyText: '请输入角色名称',
                      allowBlank: false,
                      maxLength: 25
                  }, {
                      xtype: 'combo',
                      name: 'Permissions',
                      bind: '{rec.Permissions}',
                      editable: false,// 是否允许输入
                      emptyText: '请选择拥有的权限',
                      allowBlank: false,// 不允许为空
                      blankText: '请选择拥有的权限',// 该项如果没有选择，则提示错误信息,
                      multiSelect: true,
                      queryMode: 'local',
                      displayField: 'Name',
                      valueField: 'OID',
                      fieldLabel: '拥有权限',
                      store: Ext.create('Ext.data.Store', {
                          model: 'Ext.data.Model',
                          autoLoad: true,
                          proxy: {
                              type: 'ajax',
                              url: Tools.Method.getAPiRootPath() + "/api/PermissionManager/GetPermissionList?ct=json",
                              reader: {
                                  type: 'json',
                                  rootProperty: 'permissions'//数据根节点名称
                              }
                          }
                      }),
                      listeners: {
                          change: function (combo, newValue, oldValue, eOpts) {
                              if ((typeof (newValue[0])).toLocaleLowerCase() == 'object') {
                                  //加载记录数据
                                  var v = [];
                                  $.each(newValue, function (index, o) {
                                      v.push(o.OID);
                                  });
                                  combo.setValue(v);
                              }
                          }
                      }
                  }, {
                      xtype: 'combo',
                      name: 'State',
                      bind: '{rec.State}',
                      value: 0,//默认值
                      editable: false,// 是否允许输入
                      store: Ext.create('Ext.data.Store', {
                          fields: ['text', 'value'],
                          data: [{ 'value': '0', 'text': '正常' }, { 'value': '1', 'text': '停用' }]
                      }),
                      queryMode: 'local',
                      displayField: 'text',
                      valueField: 'value',
                      fieldLabel: '状态'
                  }]
              }]
          }, {
              xtype: 'rolegrid',
              itemId: me.eName + 'Grid',
              id: 'RoleManagerGrid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }
);


