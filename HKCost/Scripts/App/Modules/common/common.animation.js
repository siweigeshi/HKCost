//animate.css动画触动一次方法
$.fn.extend({
    modalCss: function (animationName) {
    	//css3 监听动画结束时间
        var modalEnd = 'webkitmodalEnd mozmodalEnd MSmodalEnd omodalEnd modalEnd';
        this.addClass('animated ' + animationName).one(modalEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});
/**
 * 显示模态框方法
 * @param targetModal 模态框选择器，jquery选择器
 * @param animateName 动作id
 */
var modalShow = function(targetModal, modalIndex){
    var modalIn = [
    	"bounceIn", "bounceInUp", "bounceInRight", "bounceInDown", "bounceInLeft", //0-4 到达位置后弹跳
        "fadeIn", "fadeInUp", "fadeInRight", "fadeInDown", "fadeInLeft", //5-9 平淡（缓）
        "fadeInBig", "fadeInUpBig", "fadeInRightBig", "fadeInDownBig", "fadeInLeftBig", //10-14 平淡（急）
        "rotateIn", "rotateInUpLeft", "rotateInUpRight", "rotateInDownRight", "rotateInDownLeft",//15-19 翻转
        "zoomIn", "zoomInUp", "zoomInRight", "zoomInDown", "zoomInLeft", //20-24 小变大 弧线
        "slideIn", "slideInRight", "slideInUp","slideInDown","slideInLeft", //25-29 减缓平滑
        "flipInX","flipInY",//30-31 左右（上下） 晃动
        "lightSpeedIn",//32 右方  类似汽车刹车
        "rollIn"//33 正左方翻转
        ];
    $(targetModal).show().modalCss(modalIn[modalIndex]);
}
var modalHide = function(targetModal, modalIndex){
    var modalOut = [
    	"bounceOut", "bounceOutUp", "bounceOutRight", "bounceOutDown", "bounceOutLeft", //0-4 到达位置后弹跳
        "fadeOut", "fadeOutUp", "fadeOutRight", "fadeOutDown", "fadeOutLeft", //5-9 平淡（缓）
        "fadeOutBig", "fadeOutUpBig", "fadeOutRightBig", "fadeOutDownBig", "fadeOutLeftBig", //10-14 平淡（急）
        "rotateOut", "rotateOutUpLeft", "rotateOutUpRight", "rotateOutDownRight", "rotateOutDownLeft",//15-19 翻转
        "zoomOut", "zoomOutUp", "zoomOutRight", "zoomOutDown", "zoomOutLeft", //20-24 小变大 弧线
        "slideOut", "slideOutRight", "slideOutUp","slideOutDown","slideOutLeft", //25-29 减缓平滑
        "flipOutX","flipOutY",//30-31 左右（上下） 晃动
        "lightSpeedOut",//32 右方  类似汽车刹车
        "rollOut"//33 正左方翻转
        ];
    $(targetModal).children().click(function(e){e.stopPropagation()});
    $(targetModal).modalCss(modalOut[modalIndex]);
    $(targetModal).delay(0).hide(600,function(){
        $(this).removeClass('animated ' + modalOut[modalIndex]);
    });
}