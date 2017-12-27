compose.require('option',function () {
	//表单元素的获取和写入
	var getOption=function($thit){
		if($thit.attr("data-type")=="INPUT"||$thit.attr("data-type")=="RANGE"||$thit.attr("data-type")=="DATE"){
			return {"code":$thit.attr("data-code"),"val":$thit.val(),"val_text":$thit.val(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
		}else if($thit.attr("data-type")=="SELECT"||$thit.attr("data-type")=="RULER"){
			return {"code":$thit.attr("data-code"),"val":$thit.val(),"val_text":$thit.find("option:selected").text()||$thit.val(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
		}else if($thit.attr("data-type")=="RECT"){
			return {"code":$thit.attr("data-code"),"val":$thit.val(),"val_text":$thit.attr("data-val_text")||$thit.val(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
		}else if($thit.attr("data-type")=="CHECKBOX"){
			return {"code":$thit.attr("data-code"),"val":$thit.attr("data-value"),"val_text":$thit.attr("data-value"),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
		}else if($thit.attr("data-type")=="RADIO"||$thit.attr("data-type")=="CHECKBOX"){
			if($thit.is(":checked")){
				return {"code":$thit.attr("data-code"),"val":$thit.val(),"val_text":$thit.attr("data-val_text")||$thit.val(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
			}else if($("[data-group="+$thit.attr("data-group")+"][data-code="+$thit.attr("data-code")+"]").length<=1){
				return {"code":$thit.attr("data-code"),"val":0,"val_text":$thit.attr("data-val_text")||$thit.val(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
			}
		}else if($thit.attr("data-type")=="STATIC"||$thit.attr("data-type")=="OUTPUT"){
			return {"code":$thit.attr("data-code"),"val":$thit.attr("value")||$thit.attr("data-value"),"val_text":$thit.attr("data-val_text")||$thit.text(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
		}else if($thit.attr("data-type")=="POP"){
			return {"code":$thit.attr("data-code"),"val":$thit.val(),"val_text":$thit.val(),"short_name":$thit.attr("data-short_name"),"type":$thit.attr("data-type")};
		}
	},getOptions=function(group,oldList){
		var optionList=[],optionObj={};
		$.each($("[data-group="+group+"]")||[],function(index,thit){
			var option=getOption($(thit));
			if(option){optionList.push(option);optionObj[option.code]=option};
		});
		//处理缓存有的数据
		if(oldList!=null&&oldList.length>0){
			$.each(oldList,function(index,option){
				if(!optionObj[option.code]){
					optionList.push(option);
				}
			});
		}
		return optionList;
	},getOptionsByFilter=function(filter,oldList){
		var optionList=[],optionObj={};
		$.each($(""+filter+"")||[],function(index,thit){
			var option=getOption($(thit));
			if(option){optionList.push(option);optionObj[option.code]=option};
		});
		//处理缓存有的数据
		if(oldList!=null&&oldList.length>0){
			$.each(oldList,function(index,option){
				if(!optionObj[option.code]){
					optionList.push(option);
				}
			});
		}
		return optionList;
	},getChildOptions=function(group,parent,oldList){
		var optionList=[],optionObj={};
		$.each(parent.find("[data-group="+group+"]")||[],function(index,thit){
			var option=getOption($(thit));
			if(option){optionList.push(option);optionObj[option.code]=option};
		});
		//处理缓存有的数据
		if(oldList!=null&&oldList.length>0){
			$.each(oldList,function(index,option){
				if(!optionObj[option.code]){
					optionList.push(option);
				}
			});
		}
		return optionList;
	},getObj=function(group,obj){
		var obj=obj||{};
		$.each($("[data-group="+group+"]"),function(index,thit){
			var $thit=$(thit);
			if($thit.attr("data-type")=="input"||$thit.attr("data-type")=="select"||$thit.attr("data-type")=="date"){
				obj[$thit.attr("data-code")]=$thit.val();
			}else if($thit.attr("data-type")=="radio"&&$thit.is(":checked")){
				obj[$thit.attr("data-code")]=$thit.val();
			}else if($thit.attr("data-type")=="checkbox"){
				if($thit.is(":checked")){
					obj[$thit.attr("data-code")]=$thit.val();
				}else if($("[data-group="+group+"][data-code="+$thit.attr("data-code")+"]").length<=1){//只有一个多选框
					obj[$thit.attr("data-code")]=null;
				}
			}else if($thit.attr("data-type")=="img"){
				obj[$thit.attr("data-code")]=$thit.attr("data-value");
			}
		});
		return obj;
	};
	var setOptions=function(data,group){
		if(group!=null){
			group="[data-group="+group+"]";
		}else{
			group="";
		}
		$.each(data||[],function(index,obj){
			if(obj.type=="INPUT"||obj.type=="DATE"||obj.type=="SELECT"){
				$(""+group+"[data-code="+obj.code+"]").attr({"value":obj.val}).val(obj.val);
			}else if(obj.type=="RECT"){
				var thit=$(""+group+"[data-code="+obj.code+"]");
				thit.val(obj.val);
				if(obj.val==null||obj.val==""){
					thit.closest("div").find("[data-name="+obj.code+"][data-value='']").addClass("current").siblings().removeClass("current");
				}else{
					thit.closest("div").find("[data-name="+obj.code+"][data-value="+obj.val+"]").addClass("current").siblings().removeClass("current");
				}
			}else if(obj.type=="RADIO"){
				$(""+group+"[data-code="+obj.code+"][value="+obj.val+"]").prop("checked",true);
			}else if(obj.type=="CHECKBOX"){
				$(""+group+"[data-code="+obj.code+"][value="+obj.val+"]").attr("checked",true);
			}else if(obj.type=="OUTPUT"){
				$(""+group+"[data-code="+obj.code+"]").attr({"value":obj.val,"data-value":obj.val}).html(obj.val);
			}else if(obj.type=="POP"){
				$(""+group+"[data-code="+obj.code+"]").attr({"value":obj.val,"data-value":obj.val});
			}
		})
	},setChildOptions=function(parent,data){
		$.each(data||[],function(index,obj){
			if(obj.type=="input"||obj.type=="select"||obj.type=="date"||obj.type=="INPUT"||obj.type=="DATE"||obj.type=="SELECT"){
				parent.find("[data-code="+obj.code+"]").val(obj.val);
			}else if(obj.type=="radio"||obj.type=="RECT"){
				parent.find("[data-code="+obj.code+"][value="+obj.val+"]").prop("checked",true);
			}else if(obj.type=="checkbox"){
				parent.find("[data-code="+obj.code+"][value="+obj.val+"]").attr("checked",true);
			}
		})
	},setObj=function(data){
		$.each(data||{},function(code,value){
			var thit=$("[data-code="+code+"]").length>1?$($("[data-code="+code+"]")[0]):$("[data-code="+code+"]");
			var type=thit.attr("data-type");
			if(type=="input"||type=="select"||type=="date"){
				$("[data-code="+code+"]").val(value);
			}else if(type=="radio"){
				$("[data-code="+code+"][value="+value+"]").prop("checked",true);
			}else if(type=="checkbox"){
				$("[data-code="+code+"][value="+value+"]").attr("checked",true);
			}
		})
	},setGroupCodeValue=function(group,code,value){
		var thit=$("[data-group="+group+"][data-code="+code+"]").length>1?$($("[data-group="+group+"][data-code="+code+"]")[0]):$("[data-group="+group+"][data-code="+code+"]");
		var type=thit.attr("data-type");
		if(type=="INPUT"||type=="SELECT"||type=="DATE"){
			$("[data-group="+group+"][data-code="+code+"]").val(value);
		}else if(type=="radio"){
			$("[data-group="+group+"][data-code="+code+"][value="+value+"]").prop("checked",true);
		}else if(type=="checkbox"){
			$("[data-group="+group+"][data-code="+code+"][value="+value+"]").attr("checked",true);
		};
	};
	
	return {
		getOption:getOption,
		getOptions:getOptions,
		getOptionsByFilter:getOptionsByFilter,
		getChildOptions:getChildOptions,
		getObj:getObj,
		setObj:setObj,
		setGroupCodeValue:setGroupCodeValue,
		setOptions:setOptions,
		setChildOptions:setChildOptions
	};
});
