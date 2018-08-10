/** 
 * 验证码控件
 */
Ext.define('ExtFrame.view.extEncap.verifyCode.VerifyCode', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.verifycode',
    inputType: 'codefield',
    codeUrl: Ext.BLANK_IMAGE_URL,
    isLoader: true,
    hidden:true,

    onRender: function (ct, position) {
        this.callParent(arguments);
        if (this.hidden) {
            this.codeEl = ct.createChild({
                tag: 'img',
                itemId: 'imgCode',
                hidden: this.hidden,
                src: this.codeUrl//Ext.BLANK_IMAGE_URL
            });
        } else {
            this.codeEl = ct.createChild({
                tag: 'img',
                itemId: 'imgCode',
                src: this.codeUrl//Ext.BLANK_IMAGE_URL
            });
        }
        this.codeEl.addCls('x-form-code');
        this.codeEl.on('click', this.loadCodeImg, this);

        if (this.isLoader) {
            this.loadCodeImg();
        }
    },
    aliasErrorIcon: function () {
        this.errorIcon.alignTo(this.codeEl, 'tl-tr', [2, 0]);
    },
    loadCodeImg: function () {
        //如果浏览器发现url不变，就认为图片没有改变，就会使用缓存中的图片，而不是重新向服务器请求，所以需要加一个参数，改变url   
        this.codeEl.set({
            src: this.codeUrl + '?id=' + Math.random()
        });
    },
    listeners: {
        show: function (me, eOpts) {
            me.allowBlank = false;
            me.codeEl.show();
        }
    }
});