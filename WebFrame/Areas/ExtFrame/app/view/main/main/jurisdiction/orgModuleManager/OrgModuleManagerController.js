Ext.define('ExtFrame.view.main.jurisdiction.orgModuleManager.OrgModuleManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.orgModuleManager',

    onClickButtonSave: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var treeGrid = this.getView();//获取当前grid控件
        var gridSearchToolbar = treeGrid.getDockedItems('gridsearchtoolbar')[0];//获取gridSearchbar搜索栏
        var orgId = gridSearchToolbar.down('#orgPicker').getValue();//获取搜索字段
        if (orgId == '00000000-0000-0000-0000-000000000000' || orgId == undefined) {
            //未选择组织机构
            Tools.Method.ShowTipsMsg(Tools.Msg.MSG00221, '4000', '3', null);
        } else {
            var checkedModule = new Array(0);
            var selectRecords = treeGrid.getChecked();//treeGrid.getSelection();
            var checkData = treeGrid.store.checkData;
            $.each(checkData, function (num,rec) {
                if (rec.checked) {
                    checkedModule.push(rec.OID);
                }
            });
            //$.each(selectRecords, function (index, rec) {
            //    checkedModule.push(rec.get('OID'));
            //})
            //$.each(treeGrid.store.getData().items, function (index, Module) {
            //    $.each(Module.data.toolbarBtns, function (i, action) {
            //        if (action.checked)
            //            checkedModule.push(action.OID);
            //    });
            //    $.each(Module.data.operationBtns, function (i, action) {
            //        if (action.checked)
            //            checkedModule.push(action.OID);
            //    });
            //    $.each(Module.data.pageBtns, function (i, action) {
            //        if (action.checked)
            //            checkedModule.push(action.OID);
            //    });
            //    $.each(Module.data.actions, function (i, action) {
            //        if (action.checked)
            //            checkedModule.push(action.OID);
            //    });
            //});
            if (checkedModule.length == 0) {
                //未选择任何权限给出提示，确定是否提交操作
                Ext.MessageBox.confirm('提醒', '确定要删除所选组织机构的所有权限吗？', function (btn) {
                    if (btn == 'yes') {

                        var data = { PostData: Ext.encode({ 'OrgId': orgId, 'ModuleIds': checkedModule }) };
                        //alert(Ext.encode(data));
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/OrgManager/PostOrgModuleSave?ct=json', 'POST', data, true, function (jsonData) {
                            if (jsonData) {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0007, '4000', '1', null);
                                ExtBtns = {};
                            }
                            else {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                            }
                        });
                    }
                });
            } else {
                Ext.MessageBox.confirm('提醒', '确定要修改所选组织机构的权限吗？', function (btn) {
                    if (btn == 'yes') {
                        var data = { PostData: Ext.encode({ 'OrgId': orgId, 'ModuleIds': checkedModule }) };
                        //alert(Ext.encode(data));
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/OrgManager/PostOrgModuleSave?ct=json', 'POST', data, true, function (jsonData) {
                            if (jsonData) {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0007, '4000', '1', null);
                                ExtBtns = {};
                            }
                            else {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                            }
                        });
                    }
                });
            }
        }
    },
    checkChange: function (node, checked, eOpts) {
        var dat = Ext.getCmp('tab-OrgModuleManager-grid').store.checkData;
        changeCheckData(node.data.OID, checked, dat);
        if (checked) {
            $.each(node.raw.toolbarBtns, function (index, toolbarBtn) {
                $('#' + toolbarBtn.OID).attr("checked", "checked");
                $('#' + toolbarBtn.OID).prop("checked", "checked");
                toolbarBtn.checked = true;
                changeCheckData(toolbarBtn.OID, true, dat);
            });
            $.each(node.raw.operationBtns, function (index, operationBtn) {
                $('#' + operationBtn.OID).attr("checked", "checked");
                $('#' + operationBtn.OID).prop("checked", "checked");
                operationBtn.checked = true;
                changeCheckData(operationBtn.OID, true, dat);
            });
            $.each(node.raw.pageBtns, function (index, pageBtn) {
                $('#' + pageBtn.OID).attr("checked", "checked");
                $('#' + pageBtn.OID).prop("checked", "checked");
                pageBtn.checked = true;
                changeCheckData(pageBtn.OID, true, dat);
            });
            $.each(node.raw.actions, function (index, action) {
                $('#' + action.OID).attr("checked", "checked");
                $('#' + action.OID).prop("checked", "checked");
                action.checked = true;
                changeCheckData(action.OID, true, dat);
            });
        } else {
            $.each(node.raw.toolbarBtns, function (index, toolbarBtn) {
                $('#' + toolbarBtn.OID).removeAttr("checked");
                toolbarBtn.checked = false;
                changeCheckData(toolbarBtn.OID, false, dat);
            });
            $.each(node.raw.operationBtns, function (index, operationBtn) {
                $('#' + operationBtn.OID).removeAttr("checked");
                operationBtn.checked = false;
                changeCheckData(operationBtn.OID, false, dat);
            });
            $.each(node.raw.pageBtns, function (index, pageBtn) {
                $('#' + pageBtn.OID).removeAttr("checked");
                pageBtn.checked = false;
                changeCheckData(pageBtn.OID, false, dat);
            });
            $.each(node.raw.actions, function (index, action) {
                $('#' + action.OID).removeAttr("checked");
                action.checked = false;
                changeCheckData(action.OID, false, dat);
            });
        }
        checkChild(node, checked);
    }
});
function checkChild(node, checked) {
    if (node.hasChildNodes()) {
        var dat = Ext.getCmp('tab-OrgModuleManager-grid').store.checkData;
        node.eachChild(function (child) {
            changeCheckData(child.data.OID, checked, dat);
            child.set('checked', checked);
            if (checked) {
                $.each(child.raw.toolbarBtns, function (index, toolbarBtn) {
                    $('#' + toolbarBtn.OID).attr("checked", "checked");
                    $('#' + toolbarBtn.OID).prop("checked", "checked");
                    toolbarBtn.checked = true;
                    changeCheckData(toolbarBtn.OID, true, dat);
                });
                $.each(child.raw.operationBtns, function (index, operationBtn) {
                    $('#' + operationBtn.OID).attr("checked", "checked");
                    $('#' + operationBtn.OID).prop("checked", "checked");
                    operationBtn.checked = true;
                    changeCheckData(operationBtn.OID, true, dat);
                });
                $.each(child.raw.pageBtns, function (index, pageBtn) {
                    $('#' + pageBtn.OID).attr("checked", "checked");
                    $('#' + pageBtn.OID).prop("checked", "checked");
                    pageBtn.checked = true;
                    changeCheckData(pageBtn.OID, true, dat);
                });
                $.each(child.raw.actions, function (index, action) {
                    $('#' + action.OID).attr("checked", "checked");
                    $('#' + action.OID).prop("checked", "checked");
                    action.checked = true;
                    changeCheckData(action.OID, true, dat);
                });
            } else {
                $.each(child.raw.toolbarBtns, function (index, toolbarBtn) {
                    $('#' + toolbarBtn.OID).removeAttr("checked");
                    toolbarBtn.checked = false;
                    changeCheckData(toolbarBtn.OID, false, dat);
                });
                $.each(child.raw.operationBtns, function (index, operationBtn) {
                    $('#' + operationBtn.OID).removeAttr("checked");
                    operationBtn.checked = false;
                    changeCheckData(operationBtn.OID, false, dat);
                });
                $.each(child.raw.pageBtns, function (index, pageBtn) {
                    $('#' + pageBtn.OID).removeAttr("checked");
                    pageBtn.checked = false;
                    changeCheckData(pageBtn.OID, false, dat);
                });
                $.each(child.raw.actions, function (index, action) {
                    $('#' + action.OID).removeAttr("checked");
                    action.checked = false;
                    changeCheckData(action.OID, false, dat);
                });
            }

            checkChild(child, checked);
        });
    }
}
function OrgModuleClick(o, actionType) {
    var orgModuleManagerGrid = Ext.getCmp('tab-OrgModuleManager-grid');
    $.each(orgModuleManagerGrid.store.getData().items, function (index, Module) {
        if (actionType == 'toolbarBtns') {
            $.each(Module.data.toolbarBtns, function (i, btn) {
                if (btn.OID == $(o).attr('id')) {
                    if ($(o).attr('checked') == 'checked') {
                        $(o).removeAttr('checked');
                        btn.checked = false;
                    } else {
                        $(o).attr('checked', 'checked');
                        btn.checked = true;
                    }
                    return; return;
                }
            });
        } else if (actionType == 'operationBtn') {
            $.each(Module.data.operationBtns, function (i, btn) {
                if (btn.OID == $(o).attr('id')) {
                    if ($(o).attr('checked') == 'checked') {
                        $(o).removeAttr('checked');
                        btn.checked = false;
                    } else {
                        $(o).attr('checked', 'checked');
                        btn.checked = true;
                    }
                    return; return;
                }
            });
        } else if (actionType == 'pageBtn') {
            $.each(Module.data.pageBtns, function (i, btn) {
                if (btn.OID == $(o).attr('id')) {
                    if ($(o).attr('checked') == 'checked') {
                        $(o).removeAttr('checked');
                        btn.checked = false;
                    } else {
                        $(o).attr('checked', 'checked');
                        btn.checked = true;
                    }
                    return; return;
                }
            });
        } else if (actionType == 'action') {
            $.each(Module.data.actions, function (i, btn) {
                if (btn.OID == $(o).attr('id')) {
                    if ($(o).attr('checked') == 'checked') {
                        $(o).removeAttr('checked');
                        btn.checked = false;
                    } else {
                        $(o).attr('checked', 'checked');
                        btn.checked = true;
                    }
                    return; return;
                }
            });
        }
    });
}

function changeCheckData(OID, Checked, checkArray) {
    for (var i = 0; i < checkArray.length; i++) {
        if (checkArray[i].OID == OID) {
            checkArray[i].checked = Checked;
            break;
        }
    }
}

//if($(this).attr('checked')=='checked') {$(this).removeAttr('checked');} else { $(this).attr('checked','checked');}