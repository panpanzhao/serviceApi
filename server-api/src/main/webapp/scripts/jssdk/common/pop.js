compose.require("pop",["scripts/common/template_service.js"],function (templateService) {
	var filterMap=function(map,value){
		var flag=false;
		$.each(map||[],function(index,val){
			if(val==value){
				flag=true;
				return false;
			}
		});
		return flag;
	}
	var cityPop=function(obj){	
		var thit=obj.thit;
		var data=obj.data;
		var layer=obj.layer;
		var filter=obj.filter;
		var province=obj.province;
		var city=obj.city;
		var county=obj.county;
		
		var city_data;
		if(data!=null&&data!=""){
			city_data=templateService.service_data(jstempBasePath+""+data);
		}else{
			city_data=templateService.service_data(jstempBasePath+"/json/common/city.json");
		}
		//城市过滤条件
		if(filter!=null){
			//过滤省
			if(filter.province!=null){
				city_data=city_data.filter(function(element, index, array){
					if(filterMap(filter.province,element.value)){
						return false;
					}else{
						return true;
					}
				});
			}
			//过滤市
			if(filter.city!=null||filter.county!=null){
				$.each(city_data||[],function(indent,obj){
					if(filter.city!=null&&obj.children!=null){
						obj.children=obj.children.filter(function(element, index, array){
							if(filterMap(filter.city,element.value)){
								return false;
							}else{
								return true;
							}
						});					
					}
					//过滤县
					if(filter.county!=null&&obj.children!=null){
						$.each(obj.children||[],function(i,o){
							if(o.children!=null){
								o.children=o.children.filter(function(element, index, array){
									if(filterMap(filter.county,element.value)){
										return false;
									}else{
										return true;
									}
								});									
							}
						})
					}
				})
			}
		}
		layer=layer==null||layer==""?3:layer;
		var cityPicker = new mui.PopPicker({"layer":layer});  
			cityPicker.setData(city_data);
		
			if(layer==2){
				cityPicker.pickers[0].setSelectedValue(province.attr("value")||province.attr("data-value"),0);
				setTimeout(function() {
					cityPicker.pickers[1].setSelectedValue(city.attr("value")||city.attr("data-value"),0);
				}, 100);
			}else{
				cityPicker.pickers[0].setSelectedValue(province.attr("value")||province.attr("data-value"),0);
				setTimeout(function() {
					cityPicker.pickers[1].setSelectedValue(city.attr("value")||city.attr("data-value"),0);
				}, 100);
				setTimeout(function() {
					cityPicker.pickers[2].setSelectedValue(county.attr("value")||county.attr("data-value"),0);
				}, 200);
			}

			
			cityPicker.show(function (selectItems) {
				var text=""
				if(selectItems[0]!=null){
					text+=(selectItems[0].text||"");
					province.attr({"value":selectItems[0].value,"data-value":selectItems[0].value});
				}
				if(selectItems[1]!=null){
					text+="-"+(selectItems[1].text||"");
					city.attr({"value":selectItems[1].value,"data-value":selectItems[1].value});
				}
				if(selectItems[2]!=null){
					text+="-"+(selectItems[2].text||"");
					county.attr({"value":selectItems[2].value,"data-value":selectItems[2].value});
				}
				thit.attr({"value":text});
				//cityPicker.dispose();
			});
	};
	var selectPop=function(code,thit,val){
		var selectData=templateService.service_data(jstempBasePath+"/json/common/"+code+".json");
		var picker = new mui.PopPicker({"layer":1});
			picker.setData(selectData);
			picker.pickers[0].setSelectedValue(val);
			picker.show(function (selectItems) {
				thit.attr({"value":selectItems[0].text,"data-value":selectItems[0].value});
				picker.dispose();
			});
	}
	var jobPop=function(paramData,backEven){
		var parentId=paramData.parentId;
		var job_type=paramData.jobType;
		var job_value=paramData.jobValue;
		var job_data;
		if(job_type=="code"){
			job_data=templateService.service_data(jstempBasePath+"/json/common/"+job_value+".json");
		}else{
			job_data=templateService.service_data(job_value);
		}
		var job_html=templateService.service_html(jstempBasePath+"/html/common/job.html");
		
		var backObj=[];
		var li_template="{{each li_data as item}}<li data-id='{{item.id}}' data-code='{{item.code}}' data-level='{{item.level}}'>{{item.name}}</li>{{/each}}";
		var job_li=function(parentId){
			var jobData={};
				jobData.li_data=job_data.filter(function(item,index,array){if(item.parentId==parentId){return true}});
			$("#job_list").html(template.compile(li_template)(jobData));
			$("#job_list li").bind("click",function(){
				job_li($(this).attr("data-id"));
				var job={};
					job.id=$(this).attr("data-id");
					job.code=$(this).attr("data-code");
					job.name=$(this).text();
					job.level=$(this).attr("data-level");
				backObj.push(job);
				if(backObj.length==3){
					job_close();
					backEven(backObj);
				}
			});
		},job_close=function(){
			$("#job_comp").removeClass("loc-show");
			setTimeout(function() {
				$("#job-shadow").hide();
				$("#job_comp").remove();
				$("#job-shadow").remove();
			}, 300);
			
		},setJobCode=function(jobId){
			var jobArray=job_data.filter(function(item,index,array){
					if(jobId.indexOf(item.id+",")>-1){return true}
				});
			if(jobArray&&jobArray.length>0){
				backObj=[]; 
				$.each(jobArray,function(index,item){
					var job={};
					job.id=item.id;
					job.code=item.code;
					job.name=item.name;
					job.level=item.level;
					backObj.push(job);
					if(backObj.length==3){
						job_close();
						backEven(backObj);
					}
				})
			}
		};
		
		data_template.job=job_data.filter(function(item,index,array){if(item.parentId==parentId){return true}});
		templateHtml=template.compile(job_html)(data_template);
		$("body").append(templateHtml);
		job_li(parentId);
		$("#job-shadow").show();
		$("#job_comp").addClass("loc-show");
		
		$("#job_close").bind("click",function(){
			job_close();
		})
		$("#job_bnt a").bind("click",function(){
			backObj=[];
			job_li($(this).attr("data-parentId"));
		});
		$("#job_select").bind("change",function(){
			setJobCode($(this).find("option:selected").attr("data-jobId"));
		});
		
	}

	return{
		cityPop:cityPop,
		jobPop:jobPop,
		selectPop:selectPop
	}
});
