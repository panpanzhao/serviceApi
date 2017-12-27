compose.require("template_service",function () {
	var html = {
			
	},data={
			
	}
	var service_html=function(html_url){
		return $.ajax({
			type: "GET",
			url:html_url+"?v="+jsversion,
			timeout:600000,
			dataType:"text",
			async: false
		}).responseText;
	};
	var service_data=function(html_data){
		return $.ajax({
			type: "GET",
			url:html_data+"?v="+jsversion,
			timeout : 600000,
			dataType:"json",
			async: false
		}).responseJSON;
	};
	var service_url=function(html_data){
		return $.ajax({
			type: "GET",
			url:html_data,
			timeout : 600000,
			dataType:"json",
			async: false
		}).responseJSON;
	};
	return {
		html:html,//ajax调用地址
		data:data,//传递对象用
		service_html:service_html,
		service_url:service_url,
		service_data:service_data
	};
});
