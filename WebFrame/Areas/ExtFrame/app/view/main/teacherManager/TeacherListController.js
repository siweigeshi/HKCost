Ext.define('ExtFrame.view.main.teacherManager.TeacherListController', {
    extend: 'Ext.app.ViewController',
    //requires: [
    //    'Ext.MessageBox'
    //],
    alias: 'controller.teacherList',
    constructor: function () { },
    onClickButton: function () {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },
    onClickButtonAdd: function () {
        alert("studentList_Add");
    },
    onClickButtonEdit: function () {
        alert("studentList_Edit");
    },
    onClickButtonDel: function () {
        var pnGrid = Ext.getCmp('tab-StudentArchives-grid');//根据id（tab-[MenuId]-grid ）获取GridPanel对象
        var selectRows = pnGrid.getSelectionModel().getSelection();//获取选中的Row对象
        alert(selectRows);
        //alert("studentList_Del");
    },
    onClickButtonLook: function () {
        alert("studentList_Look");
    },
    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});