var cData = Ext.create('Ext.data.Store', {
    id: 'comid',
    fields: ['abbr', 'name'],
    data: null
});
Ext.define('data', {
    extend: 'Ext.data.Model',
    fields: ['abbr', 'name']
});
Ext.define(
  'ExtFrame.view.main.sys.dictionaryManager.DictionaryManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.sys.dictionaryManager.DictinoaryManagerController', 'ExtFrame.view.main.sys.dictionaryManager.DictionaryManagerModel', 'ExtFrame.view.main.sys.dictionaryManager.DictionaryGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'dictionaryManager',
      viewModel: { type: 'dictionaryManagerModel' },
      eName: '',//用于构造itemId，很重要，要和数据库存储的模块Ename对应
      initComponent: function () {
          var me = this;
          me.items = [{
              xtype: 'form',
              itemId: 'DictionaryManagerForm',
              eName: me.eName,
              region: 'north',
              bodyPadding: 3,
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
                      name: 'TITLE',
                      bind: '{rec.TITLE}',
                      fieldLabel: '名称',
                      labelWidth: 50,
                      emptyText: '请输入名称',
                      allowBlank: false,
                      maxLength: 25
                  }, {
                      xtype: 'textfield',
                      name: 'FILENAME',
                      bind: '{rec.FILENAME}',
                      fieldLabel: '对应字段名称',
                      emptyText: '请输入字段对应名称',
                      allowBlank: false,
                      maxLength: 25
                  }, {
                      xtype: 'textfield',
                      id: 'ddltext',
                      fieldLabel: '下拉框text',
                      maxLength: 25,
                  }, {
                      xtype: 'textfield',
                      id: 'ddlvalue',
                      vtype: 'OnlyEnglishAndNum',
                      fieldLabel: '下拉框value',
                      maxLength: 25
                  }, {
                      xtype: 'button',
                      text: '添加一条',
                      allowBlank: false,
                      listeners: {//添加监听事件 可以结合handler测试这两个事件哪个最先执行
                          "click": function () {
                              if (Ext.getCmp('ddltext').getValue() == '') {
                                  Tools.Method.ShowTipsMsg('请填写下拉框的text', '2000', '3', null);
                                  return false;
                              } else if (Ext.getCmp('ddlvalue').getValue() == '') {
                                  Tools.Method.ShowTipsMsg('请填写下拉框的value', '2000', '3', null);
                                  return false;
                              } else if (!Tools.Method.StrValidEncap(Ext.getCmp('ddlvalue').getValue(), 'letterAndNum')) {
                                  return false;
                              }
                              var res = true;
                              var grid = Ext.getCmp('showSelect');
                              var store = grid.getStore();
                              for (var i = 0; i < store.getCount() ; i++) {
                                  if (store.getAt(i).data.abbr == Ext.getCmp('ddlvalue').getValue()) {
                                      Tools.Method.ShowTipsMsg('添加的value不能重复', '4000', '2', null);
                                      res = false;
                                      break;
                                  }
                              } if (res) {
                                  var r = Ext.create('data', { name: Ext.getCmp('ddltext').getValue(), abbr: Ext.getCmp('ddlvalue').getValue() });//这里的数据如果是用户输入的话，只需要换成那个文本框的值就行了，val: Ext.getCmp('xxxid号').getValue()
                                  cData.insert(0, r);
                                  Ext.getCmp('showSelect').setValue(Ext.getCmp('ddlvalue').getValue());
                              }
                          }
                      }
                  }]
              },
              {
                  layout: 'column',
                  items: [{
                      xtype: 'combo',
                      id: 'showSelect',
                      value: '0',
                      editable: false,// 是否允许输入
                      store: cData,
                      queryMode: 'local',
                      displayField: 'name',
                      valueField: 'abbr',
                      fieldLabel: '下拉框',
                      width: 180,
                      labelWidth: 50
                  }, {
                      xtype: 'button',
                      text: '删除一条',
                      allowBlank: false,
                      maxLength: 25,
                      listeners: {//添加监听事件 可以结合handler测试这两个事件哪个最先执行
                          "click": function () {
                              var removeVal = Ext.getCmp('showSelect').getValue();
                              if (removeVal != "") {
                                  var grid = Ext.getCmp('showSelect');
                                  var store = grid.getStore();
                                  for (var i = 0; i < store.getCount() ; i++) {
                                      if (store.getAt(i).data.abbr == removeVal) {
                                          Ext.getCmp('showSelect').setValue("");
                                          store.removeAt(i);
                                      }
                                  }
                              }
                          }
                      }
                  }]
              },
              {
                  layout: 'column',
                  items: [{
                      xtype: 'textareafield',
                      name: 'REMARK',
                      bind: '{rec.REMARK}',
                      fieldLabel: '备注',
                      emptyText: '请输入备注',
                      maxLength: 100,
                      width: 350,
                      labelWidth: 40
                  }]
              }]
          }, {
              xtype: 'dictionarygrid',
              itemId: 'DictionaryManagerGrid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }
);