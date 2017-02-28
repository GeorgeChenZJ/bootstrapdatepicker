/**
 * George Chen
 * 2017/1/20
 * 基于bootstrap、jquery的日期控件
 *
 * 1. Add DOM to the document:
 *   <div id="your_id" class="input-group"></div>
 *
 * 2. Add codes to scripts
 *      var datePicker1 = new DatePicker({
     *          id: "date_picker_1",
     *      //  date: "2017-01-01",
     *      //  mirrorID: "mirror"
     *      //  hideInput: true,
     *      //  static: true,
     *      //  format: dd/mm/yyyy
     *      })
 * parameter:
 *    id：(essential)id of your container(class "input-group" is essential too)
 *    date: initial date formatted as "2017-01-01" or given from system date
 *    mirrorID: show the date on another input
 *    hideInput；hide the input
 *    static: show continuously
 *    format: the format string must contains 'yyyy', 'mm' and 'dd' or
 */
(function($) {
    var DatePicker = function(obj){
        if(!this instanceof DatePicker)
            throw new Error("A instance of DatePicker is required");
        if(!obj||!obj.id)
            throw new Error("Container id is essential.");

        var dateStrArr;
        if(obj.date){
            if(!this.checkDate(obj.date)) return;
            dateStrArr = obj.date.split("-")
        }else {
            //获取当前日期
            dateStrArr = this.getNowFormatDate().split("-")
        }
        this.year = dateStrArr[0];
        this.month = dateStrArr[1];
        this.day = dateStrArr[2];

        //获取插件容器
        this.containerNode = $("#"+obj.id);
        this.mirrorID = obj.mirrorID || undefined;

        this.hideInput = obj.hideInput || false;
        this.static = obj.static || false;
        this.format = obj.format.toLowerCase() || undefined;

        //加载DOM，绑定事件
        this.loadDOM();
        this.bindEvents();

    };
    DatePicker.prototype = {
        //加载DOM
        loadDOM: function(type){
            var html = "";
            if(!this.hideInput)
                html += "<input class='form-control' type='text'> ";

            html += "<span class='input-group-btn'> ";

            if(!this.static)
                html += "<div class='dropdown'> " +
                    "<button class='btn btn-sm btn-default dropdown-toggle' type='button' data-toggle='dropdown'> " +
                    "<span class='glyphicon glyphicon-calendar'></span> " +
                    "</button> ";
            else
                html += "<div class='dropdown open'> ";

            html += "<ul class='dropdown-menu dropdown-menu-mine' role='menu' aria-labelledby='dropdownMenu1'> " +
                "<div class='btn-group-head'>" +
                " <button type='button' class='btn btn-primary btn-left' data-type='year' data-date="+this.year+">年</button>" +
                " <button type='button' class='btn btn-primary btn-middle' data-type='month' data-date="+this.month+">月</button>" +
                " <button type='button' class='btn btn-primary btn-right' data-type='day' data-date="+this.day+">日</button>" +
                "</div></ul></div></span>";
            this.containerNode.html(html);
            this.headNode = this.containerNode.find("div.btn-group-head");
            this.switchToYear()
        },

        //绑定事件
        bindEvents: function(){
            var self = this;
            this.headNode.click(function(e){
                var _$button = $(e.target),
                    _type = _$button.attr("data-type");
                switch (_type){
                    case "year":
                        self.switchToYear();
                        break;
                    case "month":
                        self.switchToMonth();
                        break;
                    case "day":
                        self.switchToDay();
                        break;
                }
            });
            //阻止冒泡
            this.containerNode.find("ul.dropdown-menu-mine").click(function(e){
                e.stopPropagation()
            });
        },

        switchToYear: function () {
            var $head = this.headNode;
            $head.siblings().remove();
            var btn1 = " <button type='button' class='btn btn-default' data-type='year' data-date=",
                html = "<div class='year-group'>" +
                    "<div class='group-1'>" +
                    " <button type='button' class='btn btn-default' data-type='year'><span class='glyphicon glyphicon-chevron-up'></span></button>";
            //年
            html += btn1+(+(this.year)+2)+">"+(+(this.year)+2)+"</button>" +
                btn1+(+(this.year)+1)+">"+(+(this.year)+1)+"</button>" +
                btn1+this.year+">"+this.year+"</button>" +
                btn1+(+(this.year)-1)+">"+(+(this.year)-1)+"</button>" +
                btn1+(+(this.year)-2)+">"+(+(this.year)-2)+"</button>" +
                " <button type='button' class='btn btn-default' data-type='year'><span class='glyphicon glyphicon-chevron-down'></span></button> " +
                "</div><div class='group-2'>" +
                " <button type='button' class='btn btn-default' data-type='month'><span class='glyphicon glyphicon-chevron-up'></span></button>";
            //月
            var m1, m2, m3, m4, m5;
            m3 = +(this.month);
            (m2 = m3 + 1)>12?(m2-=12):null;if(m2<10)m2="0"+m2;
            (m1 = m3 + 2)>12?(m1-=12):null;if(m1<10)m1="0"+m1;
            (m4 = m3 - 1)<1?(m4+=12):null;if(m4<10)m4="0"+m4;
            (m5 = m3 - 2)<1?(m5+=12):null;if(m5<10)m5="0"+m5;
            if(m3<10)m3="0"+m3;
            btn1 = " <button type='button' class='btn btn-default' data-type='month' data-date=";
            html += btn1+m1+">"+(+m1)+"</button>" +
                btn1+m2+">"+(+m2)+"</button>" +
                btn1+m3+">"+(+m3)+"</button>" +
                btn1+m4+">"+(+m4)+"</button>" +
                btn1+m5+">"+(+m5)+"</button>" +
                " <button type='button' class='btn btn-default' data-type='month'><span class='glyphicon glyphicon-chevron-down'></span></button> " +
                "</div><div class='group-3'>" +
                " <button type='button' class='btn btn-default' data-type='day'><span class='glyphicon glyphicon-chevron-up'></span></button>";
            //日
            var d1, d2, d3, d4, d5, days=this.getDaysOfMonth(this.month, this.year);
            d3 = +this.day;
            (d2 = d3 + 1)>days?(d2-=days):null;if(d2<10)d2="0"+d2;
            (d1 = d3 + 2)>days?(d1-=days):null;if(d1<10)d1="0"+d1;
            (d4 = d3 - 1)<1?(d4+=days):null;if(d4<10)d4="0"+d4;
            (d5 = d3 - 2)<1?(d5+=days):null;if(d5<10)d5="0"+d5;
            if(d3<10)d3="0"+d3;
            btn1 = " <button type='button' class='btn btn-default' data-type='day' data-date=";
            html += btn1+d1+">"+(+d1)+"</button>" +
                btn1+d2+">"+(+d2)+"</button>" +
                btn1+d3+">"+(+d3)+"</button>" +
                btn1+d4+">"+(+d4)+"</button>" +
                btn1+d5+">"+(+d5)+"</button>" +
                " <button type='button' class='btn btn-default' data-type='day'><span class='glyphicon glyphicon-chevron-down'></span></button> " +
                "</div></div>";
            $head.after(html)
                .siblings().find("button[data-date="+ this.month +"][data-type=month]," +
                "button[data-date="+ this.day +"][data-type=day]," +
                "button[data-date="+ this.year +"]").addClass("active");
            this.bindEventsYs();
        },

        switchToMonth: function () {
            var $head = this.headNode;
            $head.siblings().remove();
            var btn1 = " <button type='button' class='btn btn-default' data-type='month' data-date=",
                html = "<div class='month-group'><div>" +
                    btn1+"'01'>一月</button>" +
                    btn1+"'02'>二月</button>" +
                    btn1+"'03'>三月</button> " +
                    "</div><div>" +
                    btn1+"'04'>四月</button>" +
                    btn1+"'05'>五月</button>" +
                    btn1+"'06'>六月</button> " +
                    "</div><div>" +
                    btn1+"'07'>七月</button>" +
                    btn1+"'08'>八月</button>" +
                    btn1+"'09'>九月</button> " +
                    "</div><div>" +
                    btn1+"'10'>十月</button>" +
                    btn1+"'11'>十一月</button>" +
                    btn1+"'12'>十二月</button>" +
                    "</div></div>";
            $head.after(html);
            $head.siblings().find("button[data-date="+ this.month +"]").addClass("active");
            this.bindEventsDsMs()
        },

        switchToDay: function () {
            var $head = this.headNode,
                btn1 = " <button type='button' class='btn btn-default' data-type='day' data-date=";
            $head.siblings().remove();
            var html = "<div class='day-group'>" +
                "<div style='float:right;padding-right: 2px;'>" +
                btn1+"'01'>1</button>" +
                btn1+"'02'>2</button>" +
                btn1+"'03'>3</button>" +
                btn1+"'04'>4</button>" +
                btn1+"'05'>5</button>" +
                btn1+"'06'>6</button>" +
                "</div><div style='padding-top:30px;padding-left: 2px;'>" +
                btn1+"'07'>7</button>" +
                btn1+"'08'>8</button>" +
                btn1+"'09'>9</button>" +
                btn1+"'10'>10</button>" +
                btn1+"'11'>11</button>" +
                btn1+"'12'>12</button>" +
                btn1+"'13'>13</button>" +
                "</div><div>" +
                btn1+"'14'>14</button>" +
                btn1+"'15'>15</button>" +
                btn1+"'16'>16</button>" +
                btn1+"'17'>17</button>" +
                btn1+"'18'>18</button>" +
                btn1+"'19'>19</button>" +
                btn1+"'20'>20</button>" +
                "</div><div>" +
                btn1+"'21'>21</button>" +
                btn1+"'22'>22</button>" +
                btn1+"'23'>23</button>" +
                btn1+"'24'>24</button>" +
                btn1+"'25'>25</button>" +
                btn1+"'26'>26</button>" +
                btn1+"'27'>27</button>" +
                "</div><div style='float:left;padding-left: 2px;'>";

            var days = this.getDaysOfMonth(this.month, this.year);
            if(days>=28)
                html += btn1+"'28'>28</button>";
            if(days>=29)
                html += btn1+"'29'>29</button>";
            if(days>=30)
                html += btn1+"'30'>30</button>";
            if(days>=31)
                html += btn1+"'31'>31</button>";

            html += "</div></div>";
            $head.after(html);
            $head.siblings().find("button[data-date="+ this.day +"]").addClass("active");
            this.bindEventsDsMs()
        },

        //月份或日的按钮点击事件
        bindEventsDsMs: function () {
            var self = this,
                $head = this.headNode;
            $head.siblings().click(function (e) {
                var tg = e.target;
                var $this = $(tg);
                if(tg.nodeName==="BUTTON"){
                    $head.siblings().find("button.active").removeClass("active");
                    $this.addClass("active");
                    var date = $this.attr("data-date"),
                        headBtn = $head.find("button[data-type="+$this.attr("data-type")+"]")
                            .attr("data-date",date),
                        type = $this.attr("data-type");
                    if(type=="day"){
                        self.day = date;
                        type = "日";
                    }else {
                        //新最大日
                        var days = self.getDaysOfMonth(date, self.year);
                        if(self.day>=days){
                            //如果原日期大于更新后的最大天数
                            self.day = days;
                            $head.find("button[data-type=day]").attr("data-date", days).html(days+"日");
                        }
                        self.month = date;
                        type = "月";
                    }
                    headBtn.html(date+type);
                    self.changeInput();
                }
            })
        },

        //年月日选择组的事件
        bindEventsYs: function () {
            var self = this,
                $head = this.headNode,
                $groups = $head.siblings();
            $groups.click(function (e) {
                var tg = e.target,
                    $this = $(tg),
                    node = tg.nodeName,
                    days,
                    i;
                if(node!="BUTTON"){
                    if(node=="SPAN")$this = $this.parent();
                    else return
                }
                var type = $this.attr("data-type");
                if($this.attr("data-date")){
                    //选择日期
                    var date = $this.attr("data-date"),
                        days0 = self.getDaysOfMonth(self.month, self.year),
                        $maxDayBtn;
                    $this.siblings(".active").removeClass("active");
                    $this.addClass("active");
                    switch (type){
                        case "year":
                            $head.find("button[data-type=year]").attr("data-date", date).html(date+"年");
                            //二月天数可能会变化
                            if(self.month==2){
                                $maxDayBtn = $head.siblings(".year-group").children(".group-3").find("button[data-date="+days0+"]");
                                if($maxDayBtn.length>0){
                                    days = self.getDaysOfMonth(self.month, date);
                                    if(days0!=days){
                                        if(self.day==days0&&days<days0){
                                            self.day = days;
                                            $head.find("button[data-type=day]").attr("data-date", days).html(days+"日");
                                        }
                                        i = 0;
                                        do {
                                            $maxDayBtn.attr("data-date", days-i).html(days-i);
                                            if(self.day==days-i){
                                                $maxDayBtn.siblings("button.active").removeClass("active");
                                                $maxDayBtn.addClass("active");
                                            } else
                                                $maxDayBtn.removeClass("active");
                                            $maxDayBtn = $maxDayBtn.next("button[data-date]");
                                            i++;
                                        }while ($maxDayBtn.length>0)
                                    }
                                }
                            }
                            self.year = date;
                            self.changeInput();
                            break;
                        case "month":
                            $head.find("button[data-type=month]").attr("data-date", date).html(date+"月");
                            $maxDayBtn = $head.siblings(".year-group").children(".group-3").find("button[data-date="+days0+"]");
                            if($maxDayBtn.length>0){
                                days = self.getDaysOfMonth(date, self.year);
                                if(days0!=days){
                                    if(self.day==days0&&days<days0){
                                        self.day = days;
                                        $head.find("button[data-type=day]").attr("data-date", days).html(days+"日");
                                    }
                                    i = 0;
                                    do {
                                        $maxDayBtn.attr("data-date", days-i).html(days-i);
                                        if(self.day==days-i){
                                            $maxDayBtn.siblings("button.active").removeClass("active");
                                            $maxDayBtn.addClass("active");
                                        } else
                                            $maxDayBtn.removeClass("active");
                                        $maxDayBtn = $maxDayBtn.next("button[data-date]");
                                        i++;
                                    }while ($maxDayBtn.length>0)
                                }
                            }
                            self.month = date;
                            self.changeInput();
                            break;
                        case "day":
                            $head.find("button[data-type=day]").attr("data-date", date).html(date+"日");
                            self.day = date;
                            self.changeInput();
                            break;
                    }
                }else if($this.next().length>0){
                    //向上切換
                    var $buttons = $this.siblings(),
                        first = +$($buttons[0]).attr("data-date");
                    switch (type){
                        case "year":
                            i=0;
                            for(;i<5;i++){
                                var _$button = $($buttons[i]),
                                    num = first -i + 5;
                                _$button.attr("data-date", num).html(num);
                            }
                            $buttons.filter(".active").removeClass("active");
                            $buttons.filter("[data-date="+self.year+"]").addClass("active");
                            break;
                        case "month":
                            i=0;
                            for(;i<5;i++){
                                var _$button = $($buttons[i]),
                                    num = first - i + 2;
                                if(num<1){
                                    num = num + 12;
                                }
                                if(num>12){
                                    num = num - 12;
                                }
                                if(num<10){
                                    _$button.attr("data-date", "0"+num).html(num);
                                }else{
                                    _$button.attr("data-date", num).html(num);
                                }
                            }
                            $buttons.filter(".active").removeClass("active");
                            $buttons.filter("[data-date="+self.month+"]").addClass("active");
                            break;
                        case "day":
                            days = self.getDaysOfMonth(self.month, self.year);
                            i=0;
                            for(;i<5;i++){
                                var _$button = $($buttons[i]),
                                    num = first - i + 5;
                                if(num<1){
                                    num = num + days;
                                }
                                if(num>days){
                                    num = num - days;
                                }
                                if(num<10){
                                    _$button.attr("data-date", "0"+num).html(num);
                                }else{
                                    _$button.attr("data-date", num).html(num);
                                }
                            }
                            $buttons.filter(".active").removeClass("active");
                            $buttons.filter("[data-date="+self.day+"]").addClass("active");
                    }
                } else {
                    //向下切換
                    var $buttons = $this.siblings(),
                        first = +$($buttons[1]).attr("data-date");
                    switch (type){
                        case "year":
                            i=0;
                            for(;i<5;i++){
                                var _$button = $($buttons[i+1]),
                                    num = first -i - 5;
                                _$button.attr("data-date", num).html(num);
                            }
                            $buttons.filter(".active").removeClass("active");
                            $buttons.filter("[data-date="+self.year+"]").addClass("active");
                            break;
                        case "month":
                            i=0;
                            for(;i<5;i++){
                                var _$button = $($buttons[i+1]),
                                    num = first - i - 2;
                                if(num<1){
                                    num = num + 12;
                                }
                                if(num>12){
                                    num = num - 12;
                                }
                                if(num<10){
                                    _$button.attr("data-date", "0"+num).html(num);
                                }else{
                                    _$button.attr("data-date", num).html(num);
                                }
                            }
                            $buttons.filter(".active").removeClass("active");
                            $buttons.filter("[data-date="+self.month+"]").addClass("active");
                            break;
                        case "day":
                            days = self.getDaysOfMonth(self.month, self.year);
                            i=0;
                            for(;i<5;i++){
                                var _$button = $($buttons[i+1]),
                                    num = first - i - 5;
                                if(num<1){
                                    num = num + days;
                                }
                                if(num>days){
                                    num = num - days;
                                }
                                if(num<10){
                                    _$button.attr("data-date", "0"+num).html(num);
                                }else{
                                    _$button.attr("data-date", num).html(num);
                                }
                            }
                            $buttons.filter(".active").removeClass("active");
                            $buttons.filter("[data-date="+self.day+"]").addClass("active");
                    }
                }
            })
        },

        //同步input的数据
        changeInput: function () {
            var format = this.format,
                date;
            if(format){
                date = format.replace(/yyyy/,this.year)
                    .replace(/mm/,this.month)
                    .replace(/dd/,this.day)
            }else{
                date = this.year+"-"+this.month+"-"+this.day
            }
            this.containerNode.children("input").val(date);
            if(this.mirrorID){
                $("#"+this.mirrorID).val(date);
            }
        },

        //计算月的天数
        getDaysOfMonth: function (month, year) {
            month = +month;
            year = +year;
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    return 31;
                    break;
                case 2:
                    return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) == true ? 29 : 28;
                    break;
                default:
                    return 30;
            }
        },

        //获取当前日期，格式 2017-01-01
        getNowFormatDate: function(){
            var date = new Date(),
                separator = "-",
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            return year + separator + month + separator + strDate;
        },

        //检查日期 2017-01-01
        checkDate: function (dateStr) {
            try{
                var a = dateStr.indexOf('-'),
                    b = dateStr.indexOf('-',5),
                    c = new Date(dateStr).getDate(),
                    d = dateStr.substring(dateStr.length-2);
            }catch(err){
                return false;
            }
            return (a==4 && b==7 && c==d)
        }
    };

    window["DatePicker"] = DatePicker;
})(jQuery);
