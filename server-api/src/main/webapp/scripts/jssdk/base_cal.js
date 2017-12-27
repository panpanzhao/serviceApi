compose.require(["scripts/common/service.js","scripts/common/option.js",
                 "scripts/common/template_service.js",
                 "scripts/jssdk/common/pop.js"],
                 function(service,option,templateService,pop){
	var resultObj={};
	
	var cal_html
		//cal_html_benefit=templateService.service_html(jstempBasePath+"/html/policy/cal/cal_benefit.html");
	
	var productId,cal_html,cal_url,cal_input_url,
		data,pageView_html,pageViewMain_html,pageViewSub_html,
		jobType,jobValue;
	var calInit=function(compId,calparam,backFun){
		productId=calparam.productId; //产品id
		cal_input_url=calparam.cal_input_url;
		cal_url=calparam.cal_url;
		var templateHtml=calparam.template;//模板
		var job=calparam.job;//职业
			jobType=job.type;
			jobValue=job.value;
			
		cal_html=templateService.service_html(templateHtml);
	    data=templateService.service_url(cal_input_url+"?productId="+productId);
		if(data==null||data.data==null){
			errorPage("系统繁忙,请稍后重试");
			return;
		};
		var message=data.data;
		if(message.header.response_code!="0"){
			errorPage(message.header.response_msg.default_msg);
			return;
		};
		data=message.data;
		data_template.productName=data.productName;
		data_template.basicGroup=data.basicGroup;
		data_template.main_group_list=data.main_group_list;
		data_template.sub_group_list=data.sub_group_list;
		data_template.premGroup=data.premGroup;
		data_template.param=data.param;
	    pageView_html=template.compile(cal_html)(data_template);
	    if(compId!=null){
	    	compId.html(pageView_html);
	    }else{
	    	$("body").html(pageView_html);
	    }
	    pageViewMain_html=$("#pageViewMain").html();//主险信息
		pageViewSub_html=$("#pageViewSub").html();//附加险信息
		
	    if($("[data-code=codeAge]").attr("data-min")==null||$("[data-code=codeAge]").attr("data-min")==""||$("[data-code=codeAge]").attr("data-max")==null||$("[data-code=codeAge]").attr("data-max")==""){
			$("[data-code=codeAge]").attr("data-min",0);$("[data-code=codeAge]").attr("data-max",100);
		}
		var selectOption="";
	    for(var ageIndex=$("[data-code=codeAge]").attr("data-min");ageIndex<$("[data-code=codeAge]").attr("data-max");ageIndex++){
	    	selectOption+="<option value="+ageIndex+">"+ageIndex+"岁</option>";
	    }
	    $("[data-code=age]").attr({"data-min":nowDate.getFullYear()-$("[data-code=codeAge]").attr("data-max"),"data-max":nowDate.getFullYear()-$("[data-code=codeAge]").attr("data-min")});
	    $("[data-code=codeAge]").html(selectOption);
	    $("[data-code=codeAge]").val($("[data-code=age]").attr("data-default_val"));
	    setYMD($("[data-code=codeAge]").val());
	    
	  //利益演示展示
		$("#calNextBtn").bind("click",function(){
			if(nextEvent()){
				backFun(resultObj);
			}
		});
		initEvent();
	},/**
	 * 初始化绑定事件
	 */
	initEvent=function(){
		$("[data-code=job]").bind("click",function(){
			var thit=$(this)
			pop.jobPop({"parentId":0,"jobType":jobType,"jobValue":jobValue},function(backData){
				var job_str=""
				$.each(backData||[],function(index,item){
					if(index==backData.length-1){
						job_str+=(item.name)
					}else{
						job_str+=(item.name+"-")
					}
					if(index==backData.length-1&&$("[data-group=flagOGroup][data-code=profession]").length>0){//职业代码
						$("[data-group=flagOGroup][data-code=profession]").attr({"data-value":item.code,"value":item.code});
					}
				});
				thit.val(job_str);
			});
		});
		
		//单选控件
	    $.each($("[data-type=RECT]")||[],function(index,obj){
	    	var code=$(obj).attr("data-code");
	    	$("[data-name="+code+"]").unbind("click").bind("click",function(){
	    		$(this).addClass("current").siblings().removeClass("current");
	    		$(obj).attr({"value":$(this).attr("data-value"),"data-val_text":$(this).text()});
	    		//基本信息更改试算
	    		if($(obj).attr("data-group")=="basicGroup"&&$(obj).attr("data-cal_flag")=="Y"){
	    			execCal();
	    		}
	    	});
	    });
	    //输入框
	    $.each($("[data-type=INPUT]")||[],function(index,obj){
	    	$(obj).unbind("blur").bind("blur",function(){
	    		$(this).attr({"value":$(this).val()});
	    		//基本信息更改试算
	    		if($(this).attr("data-group")=="basicGroup"&&$(this).attr("data-cal_flag")=="Y"){
	    			execCal();
	    		}
	    	});
	    });
	    //选择框
	    $.each($("[data-type=SELECT]")||[],function(index,obj){
	    	$(obj).unbind("change").bind("change",function(){
	    		$(this).find("option[value="+$(this).val()+"]").attr({"selected":"selected"}).siblings().removeAttr("selected");
	    		//基本信息更改试算
	    		if($(this).attr("data-code")=="codeAge"){
	    			setYMD($(this).val());
	    		}
	    		if($(this).attr("data-group")=="basicGroup"&&$(this).attr("data-cal_flag")=="Y"){
	    			execCal();
	    		}
	    	});
	    });
	    //复选框
	    $.each($("[data-type=CHECKBOX]")||[],function(index,obj){
	    	$(obj).unbind("click").bind("click",function(){
	    		if($(this).attr("data-comp_type")=="STATIC"){
	    			errorPage("该附加险必须附加");
	    			return true;
	    		}
	    		
	    		if($(this).attr("data-value")=="1"){
	    			$(this).attr({"data-value":"0"});
	    			$(this).removeClass("checked");
	    			$(this).closest("div.page-box").next("div").css({"display":"none"});
	    			//解决附加险缓存问题
	    			$(this).closest("div[data-out_put]").attr({"data-out_put":"[]"});
	    		}else{
	    			$(this).attr({"data-value":"1"});
	    			$(this).addClass("checked");
	    			$(this).closest("div.page-box").next("div").css({"display":"block"});
	    		}
	    	});
	    });
	    //时间控件
	    $.each($("[data-type=DATE]")||[],function(index,obj){
	    	$(obj).unbind("click").bind("click",function(){
	        	//var options={"type":"date","value":""+$(this).attr("value")+"","beginYear":1970,"endYear":2016};
	        	var options={"type":"date","value":""+$(this).attr("value")+"","beginYear":$(this).attr("data-min"),"endYear":$(this).attr("data-max")};
	        	/*
	        	 * 首次显示时实例化组件
	        	 * 示例为了简洁，将 options 放在了按钮的 dom 上
	        	 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
	        	 */
	        	var picker = new mui.DtPicker(options);
	        	picker.show(function(rs) {
	        		/*
	        		 * rs.value 拼合后的 value
	        		 * rs.text 拼合后的 text
	        		 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
	        		 * rs.m 月，用法同年
	        		 * rs.d 日，用法同年
	        		 * rs.h 时，用法同年
	        		 * rs.i 分（minutes 的第二个字母），用法同年
	        		 */
	        		$(obj).attr({"value":rs.text}).val(rs.text);
	        		/* 
	        		 * 返回 false 可以阻止选择框的关闭
	        		 * return false;
	        		 */
	        		/*
	        		 * 释放组件资源，释放后将将不能再操作组件
	        		 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
	        		 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
	        		 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
	        		 */
	        		picker.dispose();
	        		//基本信息更改试算
		    		if($(obj).attr("data-code")=="age"){
		    			$("[data-code=codeAge]").val(jsGetAge(rs.text));
		    			execCal();
		    		}
	        	});
	    	})
	    });
	    
	    //添加主险按钮
		$("#add_main_button").unbind("click").bind("click",function(){
			$("#mask-shadow").show();
			$("#main-page_cal").addClass("p-show");
		});
		//添加附加险按钮
		$("#add_sub_button").unbind("click").bind("click",function(){
			$("#mask-shadow").show();
			$("#attached-page_cal").addClass("p-show");
		});
	    
	    //主险取消按钮
		$("#close_main").unbind("click").bind("click",function(){
			$("#pageViewMain").html(pageViewMain_html);//主险信息
			$("#main-page_cal").removeClass("p-show");
			$("#mask-shadow").hide();
			initEvent();
		});
		//附加险取消按钮
		$("#close_sub").unbind("click").bind("click",function(){
			$("#pageViewSub").html(pageViewSub_html);//附加险
			$("#attached-page_cal").removeClass("p-show");
			$("#mask-shadow").hide();
			initEvent();
		});
		
		//主险确认试算按钮
		$("#cal_main_button").unbind("click").bind("click",function(){
			execCal();
		});
		//附加险确认试算按钮
		$("#cal_sub_button").unbind("click").bind("click",function(){
			execCal();
		});
	};
	
	
	//扩展startWith
	String.prototype.startWith=function(str){     
	      var reg = new RegExp("^"+str);     
	      return reg.test(this);        
	};
	//扩展endWith
	String.prototype.endWith=function(str){     
	      var reg = new RegExp(str+"$");   
	      return reg.test(this);
	};
	//处理时间格式YYYY-MM-DD
	function dealDate(code,defaultVal){
		var value = $.trim(defaultVal)==''?0:defaultVal;
		
		var date = new Date(),
		    seperator = "-";
	    //年龄
	    if(code =='age' && defaultVal && defaultVal.length > 0){ 
	    	return "";
	    }else if(code =='age'){
	    	return "";
	    }else{
	    	date.setDate(date.getDate()+parseInt(value));
	    }
	    var year = date.getFullYear(),
		    month = date.getMonth() + 1,
		    strDate = date.getDate();
	    
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    return year + seperator + month + seperator + strDate;
	};
	var nowDate = new Date();
	function setYMD(val){
    	var ageDate = new Date();
		    ageDate.setFullYear(nowDate.getFullYear()-val);
		    var ageVal=ageDate.getFullYear()+"-"+(ageDate.getMonth()+1)+"-"+ageDate.getDate();
		 	$("[data-code=age]").attr({"value":ageVal}).val(ageVal);;
	}
	//调用试算
	var execCal=function(){
		
		var calData=getCalData();
		
		resultObj.basicOption=calData.basicOption;
		resultObj.mainOption=calData.mainOption;
		resultObj.subGroup=calData.subGroup;
		
		showLoading();
		$("[data-code=prem]").attr({"value":0}).val(0);
		service.serviceObj(cal_url,calData,success);
	};
	//获取试算数据
	var getCalData=function(){
		//收集页面信息
		var calRisk=new Object();
		calRisk.productId=productId;
		calRisk.basicOption=option.getOptions("basicGroup");//基本信息
		//对职业特殊处理
		var job_type=new Object();job_type.code="job_type";job_type.val="1";
		var job_type_code=new Object();job_type_code.code="job_type_code";job_type_code.val="N001";
		var job_code=new Object();job_code.code="job_code";job_code.val="N001009";
		calRisk.basicOption.push(job_type);calRisk.basicOption.push(job_type_code);calRisk.basicOption.push(job_code);
		var renew_flag=new Object();renew_flag.code="_renew_flag";renew_flag.val="1";
		calRisk.basicOption.push(renew_flag);
		
		calRisk.mainOption=option.getOptions("mainGroup");//主险信息
		//附加险
		var subGroup=[];//附加险
		$.each($("[data-subprd_id][data-subprd_code]")||[],function(index,subPrd){
			var sub=new Object();
				sub.subCode=$(subPrd).attr("data-subprd_code");
				sub.subId=$(subPrd).attr("data-subprd_id");
				if($(subPrd).find("i[data-code$=_flag]")!=null&&$(subPrd).find("i[data-code$=_flag]").attr("data-value")=="1"){
					sub.outputOption=[];
				}else{
					sub.outputOption=eval("("+$(subPrd).attr("data-out_put")+")");
				}
				sub.option=sub_main_array(calRisk.mainOption,option.getChildOptions("subGroup",$(subPrd)));
			subGroup.push(sub);
		});
		calRisk.subCal=subGroup;
		return calRisk;
	},sub_main_array=function(main_array,sub_array){//附加险中添加主险的一些信息
		$.each(main_array, function(index,main_param) {
			var param=new Object();
				param.type=main_param.type;
				param.show_name=main_param.show_name;
				param.val_text=main_param.val_text;
				param.back_name=main_param.back_name;
			if(main_param.code!=null&&main_param.code.endWith("_name")){
				param.code="_main_code";
				param.val=main_param.code.substring(0,main_param.code.indexOf("_name"));
				sub_array.push(param);
			}else if(main_param.code!=null&&main_param.code.endWith("_ins_term")){
				param.code="_ins_term";
				param.val=main_param.val;
				sub_array.push(param);
			}else if(main_param.code!=null&&main_param.code.endWith("_pay_term")){
				param.code="_pay_term";
				param.val=main_param.val;
				sub_array.push(param);
			}else if(main_param.code!=null&&main_param.code.endWith("_amount")){
				param.code="_amount";
				param.val=main_param.val;
				sub_array.push(param);
			}
		});	
		return sub_array;
	};
	//试算成功后处理
	var success=function(data){
		$("#main-page_cal,#attached-page_cal").removeClass("p-show");
		$("#mask-shadow").hide();
		
		var product_output=data.data.product_output,
			output=data.data.output,
			benefits=data.data.benefits,
			bnft_list=data.data.bnft_list
		
		productOutput(product_output);//附加险处理
		outPut(output);//输出变量处理
		benefitsout(benefits);
		
		pageViewMain_html=$("#pageViewMain").html();//主险信息
		pageViewSub_html=$("#pageViewSub").html();//附加险信息
		
		resultObj.benefits=benefits;
		resultObj.bnft_list=bnft_list;
		resultObj.output=output;
	},productOutput=function(product_output){//附加险output处理
		$.each(product_output||[],function(index,subOutput){
			$("[data-subprd_code="+subOutput.code+"]").attr({"data-out_put":JSON.stringify(subOutput.val)});
			outPut(subOutput.val);//附加险输出变量处理
		})
	},outPut=function(output){//输出变量处理
		$.each(output||[],function(index,outParam){
			var thit=$("[data-code="+outParam.code+"]"),type=thit.attr("data-type");
			if(type == "OUTPUT"){
				if(outParam.code=="prem"){
					thit.text(outParam.val).attr("value",outParam.val);
					resultObj.prem=outParam.val;
				}else if(outParam.code.endWith("date")){
					var val;
					if(outParam.val instanceof Array){
						val = outParam.val[0]+"-"+outParam.val[1]+"-"+outParam.val[2];												
					}else{
						val=outParam.val;
					}
					thit.text(val).attr("value",val);
				}else{
					thit.text(outParam.val).attr("value",outParam.val);
				}
			}
			//隐藏输出变量包含_OPT_的一些值（ 联动效果）
			optPara(outParam);
		});
	},optPara=function(outParam){
		var code = outParam.code,
			val  = outParam.val;
		//隐藏输出变量包含_OPT_的一些值
		if(code.indexOf("_OPT_")>-1){
			var otherCode=code.substring(code.indexOf("_OPT_")+5);
			if(val.length>0){
				if($("[data-code="+otherCode+"]").attr("data-type")=="SELECT"){//下拉
					$("[data-code="+otherCode+"] option").attr("disabled",false);//下拉框处理,全部设置成可选
					for(var i= 0 ;i< val.length; i++){
						if(i==0){
							$("[data-code="+otherCode+"] option[value='"+val[i]+"']").attr({"selected":"selected"}).siblings().removeAttr("selected");//选择下拉框的值
						}else{
							$("[data-code="+otherCode+"] option[value='"+val[i]+"']").attr({"disabled":true});//设置下拉框不可选
						}
					}
				}else if($("[data-code="+otherCode+"]").attr("data-type")=="RECT"){
					$("[data-name="+otherCode+"]").css({"display":"block"});//单选
					for(var i= 0 ;i< val.length; i++){
						if(i==0){
							$("[data-code="+otherCode+"]").attr({"value":val[i]});//选择下拉框的值
							$("[data-name="+otherCode+"][data-value="+val[i]+"]").addClass("current").siblings().removeClass("current");//单选框
						}else{
							$("[data-name="+otherCode+"][data-value="+val[i]+"]").css({"display":"none"});//设置单选不显示
						}
					}
				}else if($("[data-code="+otherCode+"]").attr("data-type")=="CHECKBOX"){
					if(val.length==2&&val[0]==0&&val[1]==1){//不能选中处理
						$("[data-code="+otherCode+"]").attr({"data-value":0,"data-comp_type":"RECT"}).removeClass("checked");
						$("[data-code="+otherCode+"]").closest("div.page-box").next("div").css({"display":"none"});
						$("[data-code="+otherCode+"]").closest("div[data-subprd_id][data-subprd_code]").css({"display":"none"});
					}else if(val.length==2&&val[0]==1&&val[1]==0){//必选选中处理
						$("[data-code="+otherCode+"]").attr({"data-value":1,"data-comp_type":"STATIC"}).addClass("checked");
						$("[data-code="+otherCode+"]").closest("div.page-box").next("div").css({"display":"block"});
						$("[data-code="+otherCode+"]").closest("div[data-subprd_id][data-subprd_code]").css({"display":"block"});
					}
				}else if($("[data-code="+otherCode+"]").attr("data-type")=="INPUT"){
					$("[data-code="+otherCode+"]").attr({"value":val[0]});
				}
			}else{
				$("[data-code="+otherCode+"] option").attr("disabled",false);//下拉框处理,全部设置成可选
				$("[data-name="+otherCode+"]").css({"display":"block"});
				
				if($("[data-code="+otherCode+"]").attr("data-type")=="CHECKBOX"){
					$("[data-code="+otherCode+"]").attr({"data-comp_type":"RECT"});
					$("[data-code="+otherCode+"]").closest("div[data-subprd_id][data-subprd_code]").css({"display":"block"});
				}
			}
		};		
	},benefitsout=function(benefits){
		var main_benefit=[],main_prem=0,
			sub_benefit=[],sub_prem=0;
		$.each(benefits.content||[],function(index,benefit){
			if(benefit==null){
				return true;
			}
			if((benefit.itf_type=="1"||benefit.itf_type=="2"||benefit.itf_type=="3")&&(benefit.itf_share>0||benefit.itf_prem>0)){
				var benefitObj={};
				benefitObj.amount=benefit.amount;
				benefitObj.name=benefit.name.indexOf("$")>=0?benefit.name.substr(benefit.name.indexOf("$")+1):benefit.name;
				
				if(benefit.itf_prem>0){
					benefitObj.itf_prem=benefit.itf_prem+"元";
				}else{
					benefitObj.itf_prem="-";
				}
				
				if(benefit.itf_insuyear==1000){
					benefitObj.itf_insuyear="终身";
				}else{
					if(benefit.itf_insuyearflag=="A"){
						benefitObj.itf_insuyear="至"+benefit.itf_insuyear+"岁";
					}else{
						benefitObj.itf_insuyear=benefit.itf_insuyear+"年";
					}
				}
				
				if(benefit.itf_payendyear==1000){
					benefitObj.itf_payendyear="一次交清";
				}else{
					if(benefit.itf_payendyearflag=="A"){
						benefitObj.itf_payendyear="至"+benefit.itf_payendyear+"岁";
					}else{
						benefitObj.itf_payendyear=benefit.itf_payendyear+"年";
					}
				}
					
				if(main_benefit.length<=0){
					main_prem=benefit.itf_prem;
					main_benefit.push(benefitObj);
				}else{
					sub_prem+=benefit.itf_prem;
					sub_benefit.push(benefitObj);
				}
			}
		});
		
		if(main_benefit.length>0){//主险利益信息
			var benefitObj={};benefitObj.benefits=main_benefit;
			//$("#main_benefit").html(template.compile(cal_html_benefit)(benefitObj));
			$("#main_prem").html("首年保费："+main_prem+"元");
			$("#add_main_button").html('<a href="javascript:void(0);" class="page-edit">修改</a>');
		}else{
			$("#main_benefit").html("");
			$("#main_prem").html("");
			$("#add_main_button").html('<a href="javascript:;" class="w70 tc db add-main"><span class="f24 page-add  bgc-ffa456">+</span><p class="c-f10">添加主险</p></a>');
		}
		if(sub_benefit.length>0){//附加险利益信息
			var benefitObj={};benefitObj.benefits=sub_benefit;
			//$("#sub_benefit").html(template.compile(cal_html_benefit)(benefitObj));
			if(sub_prem>0){
				$("#sub_prem").html("首年保费："+sub_prem+"元");
			}
			$("#add_sub_button").removeClass("w70").html('<a href="javascript:void(0);" class="page-edit">修改</a>');
		}else{
			$("#sub_benefit").html("");
			$("#sub_prem").html("");
			$("#add_sub_button").addClass("w70").html('<a href="javascript:void(0);" class="w100 tc db add-attached"><span class="f24 page-add  bgc-e7b420">+</span><p class="c-f10">添加附加险</p></a>');
		}
	},fail=function(){
		
	};
	
	var nextEvent=function(){
		var isValidate=true;
		if($("[data-code=prem]").attr("value")==null||$("[data-code=prem]").attr("value")==""||$("[data-code=prem]").attr("value")=="0"){
			errorPage("请先调整选项算算价格");
			isValidate=false;
		}
		if(isValidate&&$("[data-code=profession]").length>0&&$("[data-code=profession]").attr("value")==null){
			errorPage("请选择职业类别");
			isValidate=false;
		}
		return isValidate;
	},getResultData=function(policyObj){
		var policy=policyObj.policy||{};
			policy.premium=$("[data-code=prem]").attr("value");
		//收集页面信息
		var calRisk=new Object();
		calRisk.productId=productId;
		calRisk.basicOption=option.getOptions("basicGroup");//基本信息
		
		calRisk.mainOption=option.getOptions("mainGroup");//主险信息
		//附加险
		var subGroup=[];//附加险
		$.each($("[data-subprd_id][data-subprd_code]")||[],function(index,subPrd){
			var sub=new Object();
				sub.subCode=$(subPrd).attr("data-subprd_code");
				sub.subId=$(subPrd).attr("data-subprd_id");
				if($(subPrd).find("i[data-code$=_flag]")!=null&&$(subPrd).find("i[data-code$=_flag]").attr("data-value")=="1"){
					sub.outputOption=[];
				}else{
					sub.outputOption=eval("("+$(subPrd).attr("data-out_put")+")");
				}
				sub.option=sub_main_array(calRisk.mainOption,option.getChildOptions("subGroup",$(subPrd)));
			subGroup.push(sub);
		});
		calRisk.subCal=subGroup;
		policyObj.calRisk=calRisk;
		
		var flagOption=policyObj.flagOption||[];//页面标识
		policyObj.flagOption=option.getOptions("flagOGroup",flagOption);//页面标识
		
		var flagMap=policyObj.flagMap||{};//页面标识
//		$.each(resultObj.output||[],function(index,item){
//			flagMap[item.code]=item.val;
//		});
		if($("[data-group=basicGroup][data-code=insured_type]").length>0){
			flagMap["insuredType"]=$("[data-group=basicGroup][data-code=insured_type]").val();
		}
		if($("[data-group=basicGroup][data-code=age]").length>0){
			flagMap["age"]=$("[data-group=basicGroup][data-code=age]").val();
		}
		if($("[data-group=basicGroup][data-code=sex]").length>0){
			flagMap["sex"]=$("[data-group=basicGroup][data-code=sex]").val();
		}
		policyObj.flagMap=flagMap;
		
		return policyObj;
	}
	
    return{
    	calInit:calInit,
    	initEvent:initEvent,
    	nextEvent:nextEvent,
    	getResultData:getResultData
    }
	
});