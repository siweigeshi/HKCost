Ext.define(
  'ExtFrame.view.main.jurisdiction.userRoleManager.UserRoleManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.jurisdiction.userRoleManager.UserRoleManagerController', 'ExtFrame.view.main.jurisdiction.userRoleManager.UserRoleManagerModel', 'ExtFrame.view.main.jurisdiction.userRoleManager.UserRoleGrid', 'ExtFrame.view.main.jurisdiction.userRoleManager.RoleUserGrid', 'ExtFrame.view.extEncap.TreeCombo'],//请求MainController类
      layout: { type: 'border' },
      controller: 'userRoleManager',
      viewModel: { type: 'userRoleManagerModel' },
      eName: '',//用于构造itemId，很重要，要和数据库存储的模块Ename对应
      initComponent: function () {
          var me = this;
          me.items = [{
              xtype: 'userRoleGrid',
              title: '选择用户',
              itemId: 'UserRoleManagerGrid',
              eName: me.eName,
              region: 'north'
          }, {
              xtype: 'roleUserGrid',
              id: 'RoleUserGrid',
              title: '选择分配角色',
              itemId: 'RoleUserGrid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }

);