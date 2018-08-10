Ext.define('ExtFrame.view.extEncap.FileUploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileupload'
});
function RemoveFile(fileid) {
    //alert('RemoveFile' + fileid);
    $('#file-' + fileid).remove();
    var file = uploader.getFile(fileid);
    uploader.removeFile(file);
    if ($('#browse').attr('disabled') == 'disabled')
        $('#browse').removeAttr('disabled')
}
function DeleteFile(fileid) {
    //alert('DeleteFile' + fileid);
    var paths = new Array(0);
    $('#file-' + fileid).remove();
    for (var i = 0; i < uploadedFilesInfo.length; i++) {
        if (uploadedFilesInfo[i].id == fileid) {
            paths.push(uploadedFilesInfo[i].Path);
            uploadedFilesInfo.splice(i, 1);
            break;
        }
    }
    if ($('#browse').attr("disabled") == "disabled")
        $('#browse').attr("disabled", "");
    //发起ajax请求删除已上传文件
    var data = Tools.Method.GetPostData(Ext.encode(paths)); //{ paths: Ext.encode(paths) }; //
    Tools.Method.ExtAjaxRequestEncap(Tools.Method.getRootPath() + '/Areas/ExtFrame/resources/PlUpload/DeleteFile.ashx', 'POST', data, true, function (jsonData) {});
    
}