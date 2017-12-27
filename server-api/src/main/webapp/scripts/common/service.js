compose.require('service',function () {
	var url = {
			
	};
	var serviceObj=function(url,data,successCallBack,errorCallBack){
		$.ajax({
			type: "POST",
			url:url,
			timeout:600000,
			data:JSON.stringify(data),
			dataType:"json",
			contentType : "application/json;charset=utf-8",
			success: function(data,textStatus,jqXHR){
				close_loading();
				if(data==null||data.data==null){
					errorPage("系统繁忙,请稍后重试");
					return;
				};
				var message=data.data;
				if(message.header.response_code!="0"){
					if(errorCallBack!=null){
						errorCallBack(message.header);
					}else{
						errorPage(message.header.response_msg.default_msg);
					}
					return;
				};
				successCallBack(message);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				close_loading();
				if(errorCallBack!=null){
					errorCallBack();
				}else{
					errorPage("系统繁忙,请稍后重试");
				}
			}
		});
	};
	var serviceJson=function(url,data,successCallBack,errorCallBack){
		$.ajax({
			type: "POST",
			url:url,
			timeout : 600000,
			data:data,
			dataType:"json",
			success: function(data,textStatus,jqXHR){
				close_loading();
				if(data==null||data.data==null){
					errorPage("系统繁忙,请稍后重试");
					if(errorCallBack!=null)errorCallBack();
					return;
				}
				var message=data.data;
				if(message.header.response_code!="0"){
					if(errorCallBack!=null){
						errorCallBack(message.header);
					}else{
						errorPage(message.header.response_msg.default_msg);
					}
					return;
				}				
				successCallBack(message);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				close_loading();
				if(errorCallBack!=null){
					errorCallBack();
				}else{
					errorPage("系统繁忙,请稍后重试");
				}
			}
		});
	};
	var serviceMongo=function(url,data,successCallBack,errorCallBack){
		$.ajax({
			type: "POST",
			url:url,
			timeout : 600000,
			data:data,
			dataType:"json",
			success: function(data,textStatus,jqXHR){
				close_loading();
				if(data==null||data.data==null){
					if(errorCallBack!=null){
						errorCallBack();
					}
					return;
				}
				var message=data.data;
				if(message.header.response_code=="0"){
					successCallBack(data.data);
				}else{
					if(errorCallBack!=null){
						errorCallBack();
					}
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				close_loading();
				if(errorCallBack!=null){
					errorCallBack();
				}else{
					errorPage("系统繁忙,请稍后重试");
				}
			}
		});
	};
	return {
		url:url,//ajax调用地址
		serviceObj:serviceObj,//传递对象用
		serviceJson:serviceJson,//传递字符串用
		serviceMongo:serviceMongo
	};
});