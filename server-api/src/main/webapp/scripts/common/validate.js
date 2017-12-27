compose.require("validate", function () {
	String.prototype.format=function(arg){  
	  if(arg.length==0) return this;  
	  for(var s=this, i=0; i<arg.length; i++){
	    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arg[i]); 
	  }
	  return s;
	};
	
	/**
	 * 通过身份证获取出生日期
	 * 
	 * @param idCard
	 *            15/18位身份证号码
	 * @return 
	 */
	 var birthDayByIdCard=function(idCard){
		idCard = $.trim(idCard.replace(/ /g, "")); // 去掉字符串头尾空格
		if (idCard.length == 15) {
			var year = idCard.substring(6, 8);
			var month =idCard.substring(8, 10);
			var day = idCard.substring(10, 12);
			return year+'-'+month+'-'+day;
		} else {
			var year = idCard.substring(6, 10);
			var month = idCard.substring(10, 12);
			var day = idCard.substring(12, 14);
			return year+'-'+month+'-'+day;
		}		
	}
  
	/**
	 * 通过身份证判断是男是女
	 * 
	 * @param idCard
	 *            15/18位身份证号码
	 * @return '0'-男,'1'-女
	 */
	var maleOrFemalByIdCard=function(idCard) {
		idCard = $.trim(idCard.replace(/ /g, "")); // 对身份证号码做处理。包括字符间有空格。
		if (idCard.length == 15) {
			if (idCard.substring(14, 15) % 2 == 0) {
				return '1';
			} else {
				return '0';
			}
		} else if (idCard.length == 18) {
			if (idCard.substring(14, 17) % 2 == 0) {
				return '1';
			} else {
				return '0';
			}
		} else {
			return null;
		}
	};
	/**
	 * 身份证验证
	 */
	var idCardValidate=function(idCard) {
		var idCard = $.trim(idCard.replace(/ /g, "")); // 去掉字符串头尾空格
		/**
		 * 验证15位数身份证号码中的生日是否是有效生日
		 * 
		 * @param idCard15
		 *            15位书身份证字符串
		 * @return
		 */
		var isValidityBrithBy15IdCard=function(idCard15) {
			var year = idCard15.substring(6, 8);
			var month = idCard15.substring(8, 10);
			var day = idCard15.substring(10, 12);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
			// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
			if (temp_date.getYear() != parseFloat(year)
					|| temp_date.getMonth() != parseFloat(month) - 1
					|| temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		};
		/**
		 * 验证18位数身份证号码中的生日是否是有效生日
		 * 
		 * @param idCard
		 *            18位书身份证字符串
		 * @return
		 */
		var isValidityBrithBy18IdCard=function(idCard18) {
			var year = idCard18.substring(6, 10);
			var month = idCard18.substring(10, 12);
			var day = idCard18.substring(12, 14);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
			// 这里用getFullYear()获取年份，避免千年虫问题
			if (temp_date.getFullYear() != parseFloat(year)
					|| temp_date.getMonth() != parseFloat(month) - 1
					|| temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		};
		/**
		 * 判断身份证号码为18位时最后的验证位是否正确
		 * 
		 * @param a_idCard
		 *            身份证号码数组
		 * @return
		 */
		var isTrueValidateCodeBy18IdCard=function(a_idCard){
			var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ]; // 加权因子
			var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]; // 身份证验证位值.10代表X
			var sum = 0; // 声明加权求和变量
			if (a_idCard[17].toLowerCase() == 'x') {
				a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
			}
			for (var i = 0; i < 17; i++) {
				sum += Wi[i] * a_idCard[i]; // 加权求和
			}
			valCodePosition = sum % 11; // 得到验证码所位置
			if (a_idCard[17] == ValideCode[valCodePosition]) {
				return true;
			} else {
				return false;
			}
		};
		if (idCard.length == 15) {
			return isValidityBrithBy15IdCard(idCard); // 进行15位身份证的验证
		} else if (idCard.length == 18) {
			var a_idCard = idCard.split(""); // 得到身份证数组
			if (isValidityBrithBy18IdCard(idCard)
					&& isTrueValidateCodeBy18IdCard(a_idCard)) { // 进行18位身份证的基本验证和第18位的验证
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	/**
	 * 银行卡号校验
	 */
	var luhmCheck=function(bankno){
		if (bankno.length < 16 || bankno.length > 19) {
			//$("#banknoInfo").html("银行卡号长度必须在16到19之间");
			return false;
		}
		var num = /^\d*$/;  //全数字
		if (!num.exec(bankno)) {
			//$("#banknoInfo").html("银行卡号必须全为数字");
			return false;
		}
		//开头6位
		var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
		if (strBin.indexOf(bankno.substring(0, 2))== -1) {
			//$("#banknoInfo").html("银行卡号开头6位不符合规范");
			return false;
		}
        var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
    
        var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
        var newArr=new Array();
        for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i,1));
        }
        var arrJiShu=new Array();  //奇数位*2的积 <9
        var arrJiShu2=new Array(); //奇数位*2的积 >9
        
        var arrOuShu=new Array();  //偶数位数组
        for(var j=0;j<newArr.length;j++){
            if((j+1)%2==1){//奇数位
                if(parseInt(newArr[j])*2<9){
                arrJiShu.push(parseInt(newArr[j])*2);
                }else{
                	arrJiShu2.push(parseInt(newArr[j])*2);
                }
            }else{//偶数位
            	arrOuShu.push(newArr[j]);
            }
        }
        
        var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
        for(var h=0;h<arrJiShu2.length;h++){
            jishu_child1.push(parseInt(arrJiShu2[h])%10);
            jishu_child2.push(parseInt(arrJiShu2[h])/10);
        }        
        
        var sumJiShu=0; //奇数位*2 < 9 的数组之和
        var sumOuShu=0; //偶数位数组之和
        var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal=0;
        for(var m=0;m<arrJiShu.length;m++){
            sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
        }
        
        for(var n=0;n<arrOuShu.length;n++){
            sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
        }
        
        for(var p=0;p<jishu_child1.length;p++){
            sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
            sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
        }      
        //计算总和
        sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
        
        //计算Luhm值
        var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
        var luhm= 10-k;
        
        if(lastNum==luhm){
        	return true;
        }
        else{
        	return false;
        }        
	};
	/**
	 * 中文数校验
	 */
	var minChinese=function(val,_min){
		var countZh = 0;
		for(var i=0;i<val.length;i++){
			if(!/[u00-uff]/.test(val.charAt(i))){
				countZh = countZh+1;
			}
		}
		if(countZh>=_min){
			return true;
		}else{
			return false;
		}
	},maxChinese=function(val,_max){
		var countZh = 0;
		for(var i=0;i<val.length;i++){
			if(!/[u00-uff]/.test(val.charAt(i))){
				countZh = countZh+1;
			}
		}
		if(countZh<=_max){
			return true;
		}else{
			return false;
		}		
	};
	
	// 表达式校验规则
	var validateRegExp = {
		intege : "^-?[1-9]\\d*$", // 整数
		intege1 : "^[1-9]\\d*$", // 正整数
		intege2 : "^-[1-9]\\d*$", // 负整数
		num : "^([+-]?)\\d*\\.?\\d+$", // 数字
		num1 : "^[1-9]\\d*|0$", // 正数（正整数 + 0）
		num2 : "^-[1-9]\\d*|0$", // 负数（负整数 + 0）
		num3 : "\\d*\\.?\\d+$", // 数字
		ascii : "^[\\x00-\\xFF]+$", // 仅ACSII字符
		chinese : "^[\\u4e00-\\u9fa5]+$", // 仅中文
		date : "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$", // 日期
		email : "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", // 邮件
		letter : "^[A-Za-z]+$", // 字母
		letter_l : "^[a-z]+$", // 小写字母
		letter_u : "^[A-Z]+$", // 大写字母
		mobile : "^0?(13|15|18|14|17)[0-9]{9}$", // 手机^(|(1((3\d)|(4[57])|(5[012356789])|(7[0678])|(8\d))\d{8}))$
		notempty : "^\\S+$", // 非空
		password : "^.*[A-Za-z0-9\\w_-]+.*$", // 密码
		fullNumber : "^[0-9]+$", // 数字
		tel : "^[0-9\-()（）]{7,18}$", // 电话号码的函数(包括验证国内区号,国际区号,分机号)
		url : "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", // url
		username : "^[A-Za-z0-9 .\\-\\u4e00-\\u9fa5]+$",// 用户名
		phone:"^(|(1((3\d)|(4[57])|(5[012356789])|(7[0678])|(8\d))\d{8}))$",//手机用户
		name:"^[A-Za-z\\u4e00-\\u9fa5]+$",//姓名
		zipNo : "^[1-9][0-9]{5}$",// 邮政编码
		licenseNum	:"^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$", //车牌号
		height : /^[1-9]\d{0,2}(\.\d{1,2})?$/g,//身高
		weight : /^[1-9]\d{0,2}(\.\d{1,2})?$/g, //体重
		carNo:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/ //车牌号校验规则
	};
	//默认错误提示
	var validateMessage={
		request:"该输入项不能为空",
		intege:"请输入整数",
		intege1:"请输入正整数",
		intege2:"请输入负整数",
		num1:"请输入正整数（可为0）",
		name:"姓名格式输入有误",
		licenseNum:"输入的车牌号不正确",
		rangelength:"请输入一个长度介于 {0} 和 {1} 之间的字符串",
		range:"请输入一个介于 {0} 和 {1} 之间的数字",
		maxlength:"请输入一个长度最多是 {0} 的字符串",
		minlength:"请输入一个长度最少是 {0} 的字符串",
		maxChinese:"请输入一个长度最多是 {0} 的汉字",
		minChinese:"请输入一个长度最少是 {0} 的汉字",
		length:"请输入一个长度为 {0} 的字符串",
		idCard:"身份证号码输入有误",
		sex:"性别与身份证号码输入不符",
		birthDate:"出生日期与身份证号码输入不符",
		phone:"手机号格式输入有误",
		mobile:"手机号格式输入有误",
		email:"电子邮件输入有误",
		zipNo:"邮编格式输入有误",
		luhmNo:"银行卡号输入有误"
	};
	//自定义校验规则
	var validateRules={
		isNull : function(str) {
			return (str == "" || typeof str != "string");
		},
		rangelength : function(str, _min, _max) {
			return (str.length >= _min && str.length <= _max);
		},
		range:function(number, _min, _max){
			return (number >= _min && number <= _max);
		},
		maxlength:function(str,_max){
			return str.length<=_max;
		},
		minlength:function(str,_min){
			return str.length>=_min;
		},
		maxChinese:maxChinese,
		minChinese:minChinese,
		length:function(str,length){
			return str.length==length;
		},
		idCard :idCardValidate,
		luhmCheck:luhmCheck
	};
	//页面信息验证
	var validate=function(thit){
		var val=thit.val()||thit.attr("data-value");
		
		var rules=eval("("+thit.attr("data-rules")+")");//规则
		var message=eval("("+thit.attr("data-message")+")")||[];//错误提示
		if(rules==null){
			return;
		}
		if(rules.request&&(val==null||val=="")){//非空校验
			return message["request"]||validateMessage["request"];
		}
		if(val!=null&&val!=""){//其他非空校验
			if(rules.regExp&&!new RegExp(validateRegExp[rules.regExp]).test(val)){//正则表达式校验
				return message[rules.regExp]||validateMessage[rules.regExp];
			}else if(rules.idCardByType){//身份证,性别,出生日期校验
				var type=$(rules.idCardByType[0]),sex=$(rules.idCardByType[1]),birthDate=$(rules.idCardByType[2]);
				var msg;
				if(type.attr("value")=="1"||type.attr("data-value")=="1"){ //身份证验证
					if(!idCardValidate(val)){
						msg=message["idCard"]||validateMessage["idCard"];
					}else if(sex.length>1&&maleOrFemalByIdCard(val)!=$(rules.idCardByType[1]+":checked").val()){//单选框
						msg=message["sex"]||validateMessage["sex"];
					}else if(sex.length==1&&sex.val()!=""&&maleOrFemalByIdCard(val)!=sex.val()){//下拉框
						msg=message["sex"]||validateMessage["sex"];
					}else if(birthDate.length>0&&birthDate.val()!=""&&birthDayByIdCard(val)!=birthDate.val()){
						msg=message["birthDate"]||validateMessage["birthDate"];
					}
				}
				return msg;
			}else if(rules.idCard&&!validateRules.idCard(val)){
				return message["idCard"]||validateMessage["idCard"];
			}else if(rules.rangelength&&!validateRules.rangelength(val,rules.rangelength[0],rules.rangelength[1])){//长度范围校验
				return (message["rangelength"]||validateMessage["rangelength"]).format(rules.rangelength);
			}else if(rules.range&&!validateRules.range(val,rules.range[0],rules.range[1])){//数字范围校验
				return (message["range"]||validateMessage["range"]).format(rules.range);
			}else if(rules.maxlength&&!validateRules.maxlength(val,rules.maxlength)){//长度最大值校验
				return (message["maxlength"]||validateMessage["maxlength"]).format(rules.maxlength);
			}else if(rules.minlength&&!validateRules.minlength(val,rules.minlength)){//长度最小值校验
				return (message["minlength"]||validateMessage["minlength"]).format(rules.minlength);
			}else if(rules.minChinese&&!validateRules.minChinese(val,rules.minChinese)){//长度最小值校验
				return (message["minChinese"]||validateMessage["minChinese"]).format(rules.minChinese);
			}else if(rules.maxChinese&&!validateRules.maxChinese(val,rules.maxChinese)){//长度最大值校验
				return (message["maxChinese"]||validateMessage["maxChinese"]).format(rules.maxChinese);
			}else if(rules.length&&!validateRules.length(val,rules.length)){//长度校验
				return (message["length"]||validateMessage["length"]).format(rules.length);
			}else if(rules.luhmCheck&&!validateRules.luhmCheck(val)){//银行卡号校验
				return message["luhmNo"]||validateMessage["luhmNo"];
			}
		}
	};
	//身份证绑定事件
	var idCarBind=function(type,number,sex,birthDate){
		$(number).bind("blur",function(){
			if(($(type).val()=="1"||$(type).val()=="0")&&idCardValidate($(this).val())){
				if(sex.length>1){
					$(sex+"[value="+maleOrFemalByIdCard($(this).val())+"]").prop("checked",true);
				}else{
					$(sex).val(maleOrFemalByIdCard($(this).val()));
				}
				$(birthDate).val(birthDayByIdCard($(this).val()));
			}
		});		
	}
	
	return{
		validate:validate,
		idCard:idCardValidate,
		sexByIdCard:maleOrFemalByIdCard,
		birthDayByIdCard:birthDayByIdCard,
		idCarBind:idCarBind
	}

	
});
