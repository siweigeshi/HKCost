
Ext.onReady(function () {

    // 封装表单控件自定义验证
    Ext.apply(Ext.form.field.VTypes, {
        dateRangeMaxs: [],
        dateRangeMins: [],
        //日期控件关联验证。
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },
        daterangeText: 'Start date must be less than end date',
        //日期控件关联验证。
        monthAndDay: function (val, field) {
            if (val.length != 5)
                return false;
            var date = new Date('2015-' + val);
            if (date.toString() == 'Invalid Date')
                return false;
            if (field.startDateField) {
                var start = field.up('form').down('#' + field.startDateField);
                var startDate = new Date('2015-' + start.getValue());
                if (date < startDate)
                    return false;
            }
            else if (field.endDateField) {
                var end = field.up('form').down('#' + field.endDateField);
                var endDate = new Date('2015-' + end.getValue());
                if (date > endDate)
                    return false;
            }
            return true;
        },
        monthAndDayText: '请输入正确的格式(05-31)；开始时间必须早于结束时间',
        //日期控件关联验证。
        monthAndDayGrid: function (val, field) {
            if (val.length != 5)
                return false;
            var date = new Date('2015-' + val);
            if (date.toString() == 'Invalid Date')
                return false;
            if (field.startDateField) {
                var start = field.up('grid').getDefaultFocus();
                var startDate = new Date('2015-' + start.getValue());
                if (date < startDate)
                    return false;
            }
            else if (field.endDateField) {
                var end = field.up('grid').down('#' + field.endDateField);
                var endDate = new Date('2015-' + end.getValue());
                if (date > endDate)
                    return false;
            }
            return true;
        },
        monthAndDayGridText: '请输入正确的格式(05-31)；开始时间必须早于结束时间',
        //只能输入英文字母的验证。
        OnlyEnglishletters: function (val, field) {
            return Tools.Method.StrValidEncap(val, 'letter');
        },
        OnlyEnglishlettersText: '只能输入a-z,A-Z英文字母',
        //固定电话验证。
        FixedPhoneVerification: function (val, field) {
            return Tools.Method.StrValidEncap(val, 'phone');
        },
        FixedPhoneVerificationText: '请输入有效的固定电话！',
        //手机号码验证。
        Phonenumberverification: function (val, field) {
            return Tools.Method.StrValidEncap(val, 'mobile2');
        },
        PhonenumberverificationText: '请输入有效的手机号码！',
        //email验证。
        EmailVerification: function (val, field) {
            return Tools.Method.StrValidEncap(val, 'email');
        },
        EmailVerificationText: '请输入有效的电子邮箱！',
        //邮政编码验证。
        ZIPCodeverification: function (val, field) {
            return Tools.Method.StrValidEncap(val, 'postalcode');
        },
        ZIPCodeverificationText: '请输入正确的邮编！',
        OnlyEnglishAndNum: function (val, field) {
            return Tools.Method.StrValidEncap(val, 'letterAndNum');
        },
        OnlyEnglishAndNumText: '只能输入a-z,A-Z,0-9英文字母或数字',
        textFirst: '',
        textAgain: '',
        EquaVerification: function (val, field) {
            var verification = false;
            if (field.firstField) {
                var first = field.up('form').down('#' + field.firstField);
                if (val == first.getValue()) {
                    verification = true;
                    if (this.textAgain != val) {
                        this.textAgain = val;
                        first.validate();
                    }

                }
                else {
                    verification = false;
                    if (this.textAgain != val) {
                        this.textAgain = val;
                        first.validate();
                    }
                }
            } else if (field.AgainField) {
                var again = field.up('form').down('#' + field.AgainField);
                if (val == again.getValue()) {
                    verification = true;
                    if (this.textFirst != val) {
                        this.textFirst = val;
                        again.validate();
                    }
                    //again.validate();
                }
                else {
                    verification = false;
                    if (this.textFirst != val) {
                        this.textFirst = val;
                        again.validate();
                    }
                    //again.validate();
                }
            }
            return verification;
        },
        EquaVerificationText: '两次输入不一致'
    });

});

/**
 * The main application controller. This is a good place to handle things like routes.
 * 这是主程序的控制器，这里适合做类似路由转发这样的事情
 */
Ext.define('ExtFrame.controller.Root',
	{
	    extend: 'Ext.app.Controller',
	    uses: ['ExtFrame.view.login.Login', 'ExtFrame.view.main.Main', 'ExtFrame.view.main.ChooseOrgs', 'ExtFrame.view.login.RetrievePassword', 'ExtFrame.view.login.NewPwd'],
	    /**
         * 初始化事件
         */
	    onLaunch: function () {
	        var me = this;
	        if (Ext.isIE8) {
	            Ext.Msg.alert('亲，本例子不支持IE8哟');
	            return;
	        };
	        var urlParams = Tools.Method.GetUrlParams();
	        if (urlParams['value'] != undefined && urlParams['value'] != '') {
	            var data = Tools.Method.GetPostData(urlParams['value'], false);
	            var v = false;
	            var userName = '';
	            Tools.Method.ExtAjaxRequestEncap('/api/Base/GetFindPwdByCode?ct=json&signature='
                    + urlParams['signature'] + '&timestamp=' + urlParams['timestamp'] + '&nonce=' + urlParams['nonce'] + '&value=' + urlParams['value'],
                    'GET', null, false, function (jsonData) {
	                v = jsonData.res;
	                userName = jsonData.userName;
	            });
	            if (v) {
	                me.showNewPwd(userName);
	            } else {
	                Tools.Method.ShowTipsMsg('url不合法，3秒后将自动跳转至登录页。', 3000, 3, function () { me.showLogin(); })
	                
	            }
	        }
	        else if ($.cookie('CurUser') == undefined) {
	            me.showLogin();
	        }
	        else {
	            var CurUser = Ext.decode($.cookie('CurUser'));
	            var t = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在请求页面...&nbsp;&nbsp;";
	            Ext.getBody().mask(t, 'page-loading');
	            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/Base/PostUserByOID?ct=json', 'POST', { 'OID': CurUser[0] }, true, function (jsonData) {
	                me.showUI(CurUser[0], CurUser[1], jsonData.Orgs)
	            });
	        }
	    },
	    /**
         * logincontroller 的 "login" 事件回调.
         * @param user
         * @param loginManager
         */
	    onLogin: function (userId, userName, userOrgs, loginController) {
	        this.login.destroy();
	        this.showUI(userId, userName, userOrgs);
	    },
	    /**
         * mainController 的 "Logout" 事件回调.
         * @param mainManager
         */
	    onLogout: function (mainController) {
	        $.removeData(ExtBtns);
	        $.removeData(ExtCacheData);
	        this.viewport.destroy();
	        this.showLogin();
	    },
	    /**
         * RetrievePasswordController 的 "onReturnLoginClick" 事件回调.
         * @param mainManager
         */
	    onReturnLogin:function(){
	        this.retpwd.destroy();
	        this.showLogin();
	    },
	    /**
         * NewPwdController 的 "onNewPwdClick" 事件回调.
         * @param mainManager
         */
	    onCreateNewPwd:function(){
	        this.newPwd.destroy();
	        this.showLogin();
	    },
	    /**
         * chooseOrgsController 的 "chooseOrgs" 事件回调.
         * @param mainManager
         */
	    onChooseOrgs: function (userName, DefaultOrgId, Orgs) {
	        this.chooseOrgs.destroy();
	        this.showMain(userName, DefaultOrgId, Orgs);
	    },
	    /**
         * logincontroller 的 "onRetrievePasswordClick" 事件回调.
         * @param mainManager
         */
	    onRetrievePassword: function () {
	        this.login.destroy();
	        this.showRetrievePassword();
	    },
	    showUI: function (userId, userName, userOrgs) {
	        //判断是否选定活动组织机构
	        var CurUser = Ext.decode($.cookie('CurUser'));

	        if (CurUser[2] != '') {
	            //显示主界面
	            this.showMain(userName, CurUser[2], userOrgs);
	        } else {
	            if (userOrgs.length > 1) {
	                //选择处于激活状态的组织机构
	                if (this.login != undefined) {
	                    this.login.destroy();
	                }
	                this.chooseOrgs = new ExtFrame.view.main.ChooseOrgs({
	                    orgs: userOrgs,
	                    listeners: {
	                        scope: this,
	                        chooseOrgs: 'onChooseOrgs'
	                    }
	                });

	            }
	            else if (userOrgs.length == 1) {
	                //将唯一的组织机构激活
	                DefaultOrgId = userOrgs[0].OID;
	                Tools.Method.AddCookie("CurUser", "[\"" + userId + "\",\"" + userName + "\",\"" + DefaultOrgId + "\"]", 20);
	                //显示主界面
	                this.showMain(userName, DefaultOrgId, userOrgs);
	            }
	            else {
	                this.showLogin();
	                Ext.MessageBox.alert('登录失败', '用户不在任何组织机构中！请联系系统管理员');
	            }
	        }
	    },
	    showLogin: function () {
	        var bgObj = document.getElementById('bgDiv');
	        if (bgObj == undefined) {
	            var bgObj = document.createElement("div");//创建一个div对象（背景层）
	            //定义div属性     
	            bgObj.setAttribute("id", "bgDiv");
	            bgObj.style.position = "absolute";
	            bgObj.style.background = "#777";
	            bgObj.style.backgroundImage = "url(resources/image/lock-screen-background.jpg)";
	            bgObj.style.backgroundSize = "cover";
	            bgObj.style.width = "100%";
	            bgObj.style.height = "100%";
	            bgObj.style.zIndex = "-1";
	            bgObj.style.display = "fixed";
	            bgObj.style.top = 0;

	            var topDiv = document.createElement("div");//创建一个div对象（顶部）
	            //定义div属性     
	            topDiv.setAttribute("id", "topDiv");
	            topDiv.style.position = "absolute";
	            topDiv.style.background = "#35baf6";

	            topDiv.style.width = "100%";
	            topDiv.style.height = "50px";
	            topDiv.style.display = "fixed";
	            topDiv.style.top = 0;
	            topDiv.style.fontSize = "24px";
	            topDiv.style.lineHeight = "50px";
	            topDiv.style.textAlign = "center";
	            topDiv.style.color = "#fff";
	            topDiv.innerHTML = "MVCFrame -- 用户登录";
	            bgObj.appendChild(topDiv);

	            document.body.appendChild(bgObj);//在body内添加该div对象
	        }
	        this.login = new ExtFrame.view.login.Login({
	            listeners: {
	                scope: this,
	                login: 'onLogin',
	                retrievePassword: 'onRetrievePassword'
	            }
	        });
	    },
	    showNewPwd: function (userName) {
	        var bgObj = document.getElementById('bgDiv');
	        if (bgObj == undefined) {
	            var bgObj = document.createElement("div");//创建一个div对象（背景层）
	            //定义div属性     
	            bgObj.setAttribute("id", "bgDiv");
	            bgObj.style.position = "absolute";
	            bgObj.style.background = "#777";
	            bgObj.style.backgroundImage = "url(resources/image/lock-screen-background.jpg)";
	            bgObj.style.backgroundSize = "cover";
	            bgObj.style.width = "100%";
	            bgObj.style.height = "100%";
	            bgObj.style.zIndex = "-1";
	            bgObj.style.display = "fixed";
	            bgObj.style.top = 0;

	            var topDiv = document.createElement("div");//创建一个div对象（顶部）
	            //定义div属性     
	            topDiv.setAttribute("id", "topDiv");
	            topDiv.style.position = "absolute";
	            topDiv.style.background = "#35baf6";

	            topDiv.style.width = "100%";
	            topDiv.style.height = "50px";
	            topDiv.style.display = "fixed";
	            topDiv.style.top = 0;
	            topDiv.style.fontSize = "24px";
	            topDiv.style.lineHeight = "50px";
	            topDiv.style.textAlign = "center";
	            topDiv.style.color = "#fff";
	            topDiv.innerHTML = "MVCFrame -- 重置密码";
	            bgObj.appendChild(topDiv);

	            document.body.appendChild(bgObj);//在body内添加该div对象
	        }
	        this.newPwd = new ExtFrame.view.login.NewPwd({
	            userName:userName,
	            listeners: {
	                scope: this,
	                CreateNewPwd: 'onCreateNewPwd'
	            }
	        });
	    },
	    showRetrievePassword: function () {
	        var topDiv = document.getElementById("topDiv");
	        topDiv.innerHTML = "MVCFrame -- 重置密码";
	        this.retpwd = new ExtFrame.view.login.RetrievePassword({
	            listeners: {
	                scope: this,
	                returnLogin: 'onReturnLogin',
	                //retrievePassword: 'onRetrievePassword'
	            }
	        });
	    },
	    showMain: function (userName, DefaultOrgId, Orgs) {
	        var bgObj = document.getElementById('bgDiv');
	        if (bgObj)
	            document.body.removeChild(bgObj);
	        this.viewport = new ExtFrame.view.main.Main(
                        {   //用户信息传入视图         
                            viewModel: {
                                data:
                                  {
                                      currentUser: userName,
                                      defaultOrgId: DefaultOrgId,
                                      userOrgs: Orgs
                                  }
                            },
                            id: 'Main',
                            listeners: {
                                scope: this,
                                onSignoutClick: 'onLogout',
                                onShowLogin: 'onLogout'
                            }
                        }
                    );
	        Ext.getBody().unmask();
	    }
	});
