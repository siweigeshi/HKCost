Ext.define(
  'ExtFrame.view.main.sys.orgManager.OrgManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.sys.orgManager.OrgManagerController', 'ExtFrame.view.main.sys.orgManager.OrgManagerModel', 'ExtFrame.view.main.sys.orgManager.OrgGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'orgManager',
      viewModel: { type: 'orgManagerModel' },
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
                      xtype: 'hiddenfield',
                      itemId: 'hfLT',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'LT'
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfRT',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'RT'
                  }, {
                      xtype: 'textfield',
                      name: 'Name',
                      bind: '{rec.Name}',
                      fieldLabel: '机构名称',
                      emptyText: '请输入机构名称',
                      allowBlank: false,
                      labelWidth: 60
                  }, {
                      xtype: 'textfield',
                      name: 'EnglishName',
                      bind: '{rec.EnglishName}',
                      emptyText: '请输入英文名称',
                      allowBlank: false,
                      fieldLabel: '英文名称'
                  }, {
                      xtype: 'textfield',
                      name: 'ShortName',
                      bind: '{rec.ShortName}',
                      emptyText: '请输入机构简称',
                      fieldLabel: '机构简称'
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfOrg',
                      name: 'ParentOID',
                      bind: '{rec.ParentOID}',
                      value: '00000000-0000-0000-0000-000000000000'
                  }, {
                      xtype: 'textfield',
                      itemId: 'orgPicker',
                      disabled:true,
                      fieldLabel: '上级机构',
                      value:'根节点'
                  }]
              }, {
                  layout: 'column',
                  itemId: 'column2',
                  items: [{
                      xtype: 'textfield',
                      name: 'Code',
                      bind: '{rec.Code}',
                      emptyText: '请输入机构编号',
                      allowBlank: false,
                      fieldLabel: '机构编号',
                      labelWidth: 60,
                      listeners: {
                          change: function (combo, newValue, oldValue) {
                              this.setValue(newValue.replace(/[^\d]/g, ''));
                          }
                      }
                  }, {
                      xtype: 'textfield',
                      name: 'OrgNo',
                      bind: '{rec.OrgNo}',
                      emptyText: '请输入机构号',
                      fieldLabel: '机构号',
                      listeners: {
                          change: function (combo, newValue, oldValue) {
                              this.setValue(newValue.replace(/[^\d]/g, ''));
                          }
                      }
                  }, {
                      xtype: 'combo',
                      name: 'State',
                      bind: '{rec.State}',
                      itemId: 'State',
                      editable: false,// 是否允许输入
                      emptyText: '请选择',
                      allowBlank: false,// 不允许为空
                      blankText: '请选择',// 该项如果没有选择，则提示错误信息,
                      store: Ext.create('Ext.data.Store', {
                          fields: ['abbr', 'name'],
                          data: [{ 'abbr': '0', 'name': '正常' }, { 'abbr': '1', 'name': '停用' }]
                      }),
                      queryMode: 'local',
                      displayField: 'name',
                      valueField: 'abbr',
                      fieldLabel: '状态',
                      listeners: {
                          afterRender: function (combo) {
                              combo.setValue(combo.getStore().getAt(0).data.abbr);
                          }
                      }
                  }]
              }, {
                  layout: 'column',
                  itemId: 'column3',
                  items: [{
                      xtype: 'textfield',
                      name: 'SortCode',
                      bind: '{rec.SortCode}',
                      emptyText: '请输入机构排序标号',
                      fieldLabel: '排序',
                      labelWidth: 60,
                      listeners: {
                          change: function (combo, newValue, oldValue) {
                              this.setValue(newValue.replace(/[^\d]/g, ''));
                          }
                      }
                  }, {
                      xtype: 'textareafield',
                      name: 'Description',
                      bind: '{rec.Description}',
                      fieldLabel: '描述',
                      emptyText: '请书写描述内容',
                      width: 450
                  }]
              }]
          }, {
              xtype: 'orggrid',
              itemId: me.eName + 'Grid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }

);