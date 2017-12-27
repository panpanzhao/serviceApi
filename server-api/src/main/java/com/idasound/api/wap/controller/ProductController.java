package com.idasound.api.wap.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.idasound.api.wap.adapter.CalAdapter;
import com.idasound.api.wap.dto.CalRisk;
import com.idasound.api.wap.service.HttpService;

@Controller
public class ProductController {
	@Autowired
	HttpService httpService;
	/**
	 * 试算测试
	 * @param modelMap
	 * @return
	 */
	@RequestMapping(value ="/api/cal")
	public String calApi(ModelMap modelMap,String productId) {
		modelMap.put("productId", productId);
		return "calApi.view";
	}
	/**
	 * 获取试算输入变量
	 * @param modelMap
	 * @param param
	 */
	@RequestMapping(value ="/calInput")
	public void calInput(ModelMap modelMap,@RequestParam Map<String,Object> param) {
		JSONObject resJson=new JSONObject();
		try {
			JSONObject paramObj=new JSONObject();
			paramObj.put("product_id", param.get("productId"));
			//调用接口
			resJson=httpService.postModelByCode("getPremInputModelIn",paramObj);
		} catch (Exception e) {
			resJson=JSON.parseObject(httpService.resultMsg("获取输入数据异常"));
		}
		modelMap.put("data", resJson);
	}
	
	@RequestMapping(value ="/calService")
	public void calService(ModelMap modelMap,@RequestBody CalRisk calRisk) {
		if(calRisk==null){
			modelMap.put("data", httpService.resultMsg("请求数据有误"));
			return;
		}
		//数据转换
		String calRiskJson=CalAdapter.transferQuoteData(calRisk);//数据转换
		if(calRiskJson==null){
			modelMap.put("data", httpService.resultMsg("数据转换异常"));
			return;
		}
		//调用接口
		JSONObject resultObj=httpService.postModelByCode("premCalculationIn", JSONObject.parseObject(calRiskJson));
		
		modelMap.put("data",resultObj);
	}
}
