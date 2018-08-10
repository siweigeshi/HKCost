Ext.define(
  'ExtFrame.view.main.sys.moduleManager.ModuleManager',
  {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.main.sys.moduleManager.ModuleManagerController', 'ExtFrame.view.main.sys.moduleManager.ModuleManagerModel', 'ExtFrame.view.main.sys.moduleManager.ModuleGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'moduleManager',
      viewModel: { type: 'moduleManagerModel' },
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
                  xtype: 'hiddenfield',
                  itemId: 'hfOID',
                  name: 'OID',
                  bind: '{rec.OID}'
              }, {
                  xtype: 'hiddenfield',
                  name: 'PathHandler',
                  bind: '{rec.PathHandler}'
              }, {
                  layout: 'column',
                  itemId: 'column1',
                  items: [{
                      xtype: 'combo',
                      name: 'Flag',
                      bind: '{rec.Flag}',
                      itemId: 'moduleManagerFlag',
                      editable: false,// 是否允许输入
                      emptyText: '请选择',
                      allowBlank: false,// 不允许为空
                      blankText: '请选择',// 该项如果没有选择，则提示错误信息,
                      store: Ext.create('Ext.data.TreeStore', {
                          model: 'Ext.data.TreeModel',
                          autoLoad: true,
                          proxy: {
                              type: 'ajax',
                              url: Tools.Method.getAPiRootPath() + "/api/Base/GetDicList?ct=json&fileName=MODULETYPE",
                              reader: {
                                  type: 'json',
                                  //rootProperty: 'Orgs'//数据根节点名称
                              }
                          }
                      }),
                      queryMode: 'local',
                      displayField: 'Text',
                      valueField: 'Value',
                      fieldLabel: '类型',
                      labelWidth: 40,
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              var EnameTextFiled = me.up('#ModuleManagerForm').down('#EName');
                              EnameTextFiled.setValue('');
                          }
                      }
                  },{
                      xtype: 'hiddenfield',
                      itemId: 'hfModule',
                      name: 'ParentOID',
                      bind: '{rec.ParentOID}',
                      value: '00000000-0000-0000-0000-000000000000'
                  },{
                       xtype: 'textfield',
                       itemId: 'modulePicker',
                       fieldLabel: '上级菜单',
                       disabled:true,
                       maxLength: 100,
                       value:'根节点'
                   },{
                      xtype: 'textfield',
                      name: 'PathHandler',
                      bind: '{rec.PathHandler}',
                      fieldLabel: '类名/事件',
                      maxLength: 100
                  },{
                      xtype: 'combo',
                      name: 'ButtonId',
                      itemId: 'ButtonId',
                      bind: '{rec.ButtonId}',
                      editable: false,// 是否允许输入
                      emptyText: '请选择',
                      queryMode: 'local',
                      displayField: 'Name',
                      valueField: 'OID',
                      fieldLabel: '所属按钮',
                      store: Ext.create('Ext.data.Store', {
                          model: 'Ext.data.Model',
                          autoLoad: true,
                          pageSize:0,
                          proxy: {
                              type: 'ajax',
                              url: Tools.Method.getAPiRootPath() + "/api/ButtonsManager/GetButtonsList?ct=json",
                              reader: {
                                  type: 'json',
                                  rootProperty: 'buttons'//数据根节点名称
                              }
                          },
                          listeners: {
                              load: function (store, records, successful, eOpts) {
                                  if (records.length > 0) {
                                      var record = { Name: '无', OID: '' };
                                      store.insert(0, record)
                                  }
                              },
                          }
                      }),
                      listeners: {
                          //捕捉异常处理
                          select: function (combo, record, index) {
                              var data = record.getData();
                              if (data.OID != '') {
                                  var json = this.up("#ModuleManagerForm").getForm().getValues();
                                  json.Name = data.Name;
                                  json.Ico = data.Ico;
                                  json.EName = data.EName;
                                  json.Description = data.Description;
                                  json.SortCode = data.SortCode;
                                  json.PathHandler = data.EventMethod;
                                  json.Permissions = null;
                                  this.up("#ModuleManagerForm").getForm().setValues(json);
                              }
                          },
                          exception: function (theproxy, response, operation, options) {
                              Tools.Method.ExceptionEncap(response);
                          }
                      }
                  }]
              }, {
                  layout: 'column',
                  items: [{
                      xtype: 'textfield',
                      name: 'Name',
                      itemId: 'Name',
                      bind: '{rec.Name}',
                      fieldLabel: '名称',
                      labelWidth: 40,
                      allowBlank: false,// 不允许为空
                      maxLength: 25
                  }, {
                      xtype: 'textfield',
                      name: 'EName',
                      itemId: 'EName',
                      bind: '{rec.EName}',
                      fieldLabel: '英文名称',
                      //vtype: 'OnlyEnglishAndNum',
                      allowBlank: false,// 不允许为空
                      maxLength: 50,
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              var value = me.getValue();
                              if (value == '')
                                  valid = "请输入用户名";
                              else {
                                  var FlagValue = me.up('#ModuleManagerForm').down('#moduleManagerFlag').getValue();
                                  if (FlagValue == 0) {
                                      var OID;
                                      if (me.OID != undefined && me.OID != '') {
                                          OID = me.OID;
                                          me.OID = '';
                                      } else {
                                          OID = me.up('#ModuleManagerForm').down('#hfOID').getValue();
                                      }
                                      Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/GetIsExist?ct=json&OID=' + OID + '&col=EName&val=' + value, 'GET', null, false, function (jsonData) {
                                          if (jsonData) {
                                              valid = "英文名称已存在，请更换";
                                          }
                                          else {
                                              valid = true;
                                          }
                                      });
                                  } else {
                                      valid = true;
                                  }
                              }
                              me.validation = valid;
                          }
                      }
                  }, {
                      xtype: 'displayfield',
                      name: 'Ico',
                      itemId: 'Ico',
                      id: 'MemuIco',
                      bind: '{rec.Ico}',
                      fieldLabel: '图  标',
                      width: 194,
                      maxLength: 50

                  }, {
                      xtype: 'button',
                      scale: 'small',
                      text: '选择图标',
                      glyph: 0xf03e,
                      eName: 'ChoiceIco',
                      //style: {background:'#FFFFFF'},
                      handler: 'onClickButtonIco',
                      listeners: {
                          beforerender: function (btn, eOpts) {
                              if (Tools.Method.getPageBtnPower(btn.eName, me.eName))
                                  btn.hidden = false;
                              else {
                                  btn.hidden = true;
                              }
                          }
                      }
                  }, {
                      xtype: 'textfield',
                      name: 'Url',
                      itemId: 'Url',
                      bind: '{rec.Url}',
                      fieldLabel: 'action路径',
                      maxLength: 200
                  }]
              },
              {
                  layout: 'column',
                  items: [{
                      xtype: 'textfield',
                      name: 'Code',
                      itemId: 'Code',
                      bind: '{rec.Code}',
                      fieldLabel: '编号',
                      allowBlank: false,// 不允许为空
                      maxLength: 25,
                      labelWidth: 40
                  }, {
                      xtype: 'textfield',
                      name: 'SortCode',
                      itemId: 'SortCode',
                      bind: '{rec.SortCode}',
                      fieldLabel: '排序编号'

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
                          pageSize:0,
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
                      itemId: 'State',
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

              },
              {
                  layout: 'column',
                  items: [{
                      xtype: 'textareafield',
                      name: 'Description',
                      bind: '{rec.Description}',
                      fieldLabel: '描述',
                      emptyText: '请书写描述内容',
                      width: 450,
                      labelWidth: 40,
                      maxLength: 100,
                  }]
              }]
          }, {
              xtype: 'modulegrid',
              itemId: me.eName + 'Grid',
              id: 'ModuleManagerGrid',
              eName: me.eName,
              region: 'center'
          }];
          me.callParent();
      }
  }

);
