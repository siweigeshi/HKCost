Ext.define('ExtFrame.view.main.cms.articleCategoryManager.ArticleCategoryManager', {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.cms.articleCategoryManager.ArticleCategoryController', 'ExtFrame.view.main.cms.articleCategoryManager.ArticleCategoryManagerModel',
          'ExtFrame.view.main.cms.articleCategoryManager.ArticleCategoryGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'articleCategoryManager',
      viewModel: { type: 'ArticleCategoryManagerModel' },
      //eName: 'ArticleCategory',//用于构造itemId，很重要，要和数据库存储的模块Ename对应
      initComponent: function () {
          var me = this;
          me.valid = true;
          me.items = [{
              xtype: 'form',
              itemId: me.eName+'Form',
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
                      name: 'LT',
                      bind: '{rec.LT}'
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfRT',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'RT',
                      bind: '{rec.RT}'
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfParentOID',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'ParentOID',
                      bind: '{rec.ParentOID}',
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              me.up('form').down('#typePicker').setValue(newValue);
                          }
                      }
                  }, {
                      xtype: 'textfield',
                      name: 'Name',
                      bind: '{rec.Name}',
                      fieldLabel: '类型名称',
                      emptyText: '请输入类型名称',
                      allowBlank: false,
                      labelWidth: 80
                  }, {
                      xtype: 'textfield',
                      name: 'CallIndex',
                      itemId: 'CallIndex',
                      bind: '{rec.CallIndex}',
                      fieldLabel: '调用别名',
                      emptyText: '请输入调用别名',
                      allowBlank: false,
                      labelWidth: 80,
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              var OID;
                              if (me.OID != undefined && me.OID != '') {
                                  OID = me.OID;
                                  me.OID = '';
                              } else {
                                  OID = me.up('#column1').down('#hfOID').getValue();
                              }

                              valid = false;
                              Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ArticleCategory/GetCallIndexBool?ct=json&OID=' + OID + '&CallIndex=' + newValue + '',
                                  'GET', null, false, function (jsonData) {
                                      if (!jsonData) {
                                          valid = "调用别名已经存在";
                                      }
                                  });
                              me.validation = valid;
                          }
                      }
                  },{
                      xtype: 'textfield',
                      name: 'SeoTitle',
                      bind: '{rec.SeoTitle}',
                      fieldLabel: 'SeoTitle',
                      emptyText: '请输入SeoTitle',
                      labelWidth: 80
                  }, {
                      xtype: 'textfield',
                      name: 'SeoKeyword',
                      bind: '{rec.SeoKeyword}',
                      fieldLabel: 'SeoKeyword',
                      emptyText: '请输入SeoKeyword',
                      labelWidth: 80
                  }]
              }, {
                  layout: 'column',
                  itemId: 'column2',
                  items: [{
                      xtype: 'textfield',
                      name: 'SeoDescription',
                      bind: '{rec.SeoDescription}',
                      fieldLabel: 'SeoDescription',
                      emptyText: '请输入SeoDescription',
                      labelWidth: 80
                  },  {
                      xtype: 'treepicker',
                      itemId: 'typePicker',
                      fieldLabel: '上级类型',
                      displayField: 'Name',
                      valueField: 'OID',
                      forceSelection: true,// 只能选择下拉框里面的内容
                      emptyText: '请选择',
                      blankText: '请选择',// 该项如果没有选择，则提示错误信息
                      rootVisible: false,
                      labelWidth: 80,
                      valid : true,
                      initComponent: function () {
                          var treepicker = this;
                          treepicker.store = Ext.create('Ext.data.TreeStore', {
                              model: 'Ext.data.TreeModel',
                              autoLoad: true,
                              root: {
                                  OID: '00000000-0000-0000-0000-000000000000',
                                  Name: '', 
                                  id: '00000000-0000-0000-0000-000000000000',
                                  expanded: true
                              },
                              proxy: {
                                  type: 'ajax',
                                  url: Tools.Method.getAPiRootPath() + '/api/ArticleCategory/GetTreeList?ct=json',
                                  reader: {
                                      type: 'json',
                                      rootproperty: 'children',//数据根节点名称
                                  }
                              },
                              clearOnLoad: true,
                              nodeParam: 'PID'
                          });
                          treepicker.callParent();
                      },
                      listeners: {
                          select: function (treepicker, record, eOpts) {
                              var form = treepicker.up('#'+me.eName + 'Form');
                              //var validation;
                              var rtNum = form.down('#hfRT').getValue();
                              var ltNum = form.down('#hfLT').getValue();
                              if (Number(record.data.LT) >= ltNum && Number(record.data.LT) <= rtNum) {
                                  me.valid = false;
                              } else {
                                  form.down('#hfParentOID').setValue(record.data.OID);
                                  me.valid = true;
                              }
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
                      labelWidth: 80,
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
                      xtype: 'textareafield',
                      name: 'Remark',
                      bind: '{rec.Remark}',
                      fieldLabel: '备注',
                      emptyText: '请书写备注内容',
                      labelWidth: 80
                  }]
              }]
          }, {
              xtype: 'articlecategorygrid',
              itemId: me.eName + 'Grid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  });