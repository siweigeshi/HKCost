Ext.define('ExtFrame.view.main.studentManager.StudentListController', {
    extend: 'Ext.app.ViewController',
    uses: ['ExtFrame.view.main.studentManager.StudentDetail'],
    alias: 'controller.studentList',

    onClickButtonAdd: function () {
        GridToolbar.AddEncap("StudentArchives", ExtFrame.view.main.studentManager.StudentDetail);
    },
    onClickButtonEdit: function () {
        GridToolbar.EditEncap("StudentArchives", ExtFrame.view.main.studentManager.StudentDetail);
    },
    onClickButtonDel: function () {
        GridToolbar.DeleteEncap("StudentArchives", 'deleteUrl');//试用，需要改为正式的deleteURL
    },
    onClickButtonLook: function () {
        GridToolbar.LookEncap("StudentArchives", ExtFrame.view.main.studentManager.StudentDetail);
    }
});