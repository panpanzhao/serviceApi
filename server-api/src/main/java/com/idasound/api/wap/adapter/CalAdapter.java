package com.idasound.api.wap.adapter;

import java.util.Iterator;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.idasound.api.wap.dto.CalRisk;
import com.idasound.api.wap.dto.CalRisk.SubCal;
import com.idasound.api.wap.dto.CalRisk.SubCal.SubOutOption;
import com.idasound.api.wap.dto.Option;
/**
 * @ClassName: CarAdapter
 * @Description: 用于车险调用服务请求数据组织
 * @author haowang@idasound.com
 * @date 2016年7月6日 下午6:00:37
 */
public class CalAdapter {
    /**
     * 
    * @Title: transferQuoteData 
    * @Description: 试算请求数据转换
    * @param @param reqPremium
    * @param @return
    * @return String 
    * @throws
     */
	public static  String transferQuoteData(CalRisk calRisk) {
		// 定义返回结构
		JSONObject dataObj = new JSONObject();
		dataObj.put("obj_type", "1");
		dataObj.put("obj_role", "PC201_OPTION_POLICY");
		dataObj.put("id", calRisk.getProductId());//产品Id
		
		//基本信息参数转换
		JSONArray policyOption=getCalPolicyOption(calRisk);
		dataObj.put("policy_option", policyOption);
		return dataObj.toJSONString();
	}
	/**
	 * 获取试算的基本信息
	 * @param calRisk
	 * @return
	 */
	public static JSONArray getCalPolicyOption(CalRisk calRisk){
		JSONArray policyOption=new JSONArray();
		//基本信息参数转换
		JSONArray baseArray=new JSONArray();
		JSONObject baseObject=null;
		List<Option> baseOptionList=calRisk.getBasicOption();
		for (Iterator<Option> iter = baseOptionList.iterator(); iter.hasNext();) {
			Option baseOptionDto=iter.next();
			baseObject=new JSONObject();
			baseObject.put("code", baseOptionDto.getCode());
			baseObject.put("val", parseNum(baseOptionDto.getVal()));
			baseArray.add(baseObject);
		}
		policyOption.addAll(baseArray);	
		
		//主险信息参数转换
		List<Option> mainOptionList=calRisk.getMainOption();
		JSONObject mainObject=null;
		for (Iterator<Option> iter = mainOptionList.iterator(); iter.hasNext();) {
			Option mainOptionDto=iter.next();
			mainObject=new JSONObject();
			mainObject.put("code", mainOptionDto.getCode());
			mainObject.put("val", parseNum(mainOptionDto.getVal()));
			policyOption.add(mainObject);
		}
		
		//附加险参数转换
		List<SubCal> subCalList=calRisk.getSubCal();
		JSONObject subObject=null;
		if(subCalList==null){
			return policyOption;
		}
		for (Iterator<SubCal> iter = subCalList.iterator(); iter.hasNext();) {
			SubCal subCal=iter.next();//附加险信息
			subObject=new JSONObject();
			subObject.put("code", subCal.getSubCode());
			subObject.put("val", subInput(subCal,baseArray));
			policyOption.add(subObject);
		}
		return policyOption;
	}
	private static String subInput(SubCal subCal,JSONArray baseArray){
		JSONObject subValObj=new JSONObject();//附加险信息
		subValObj.put("info_id", subCal.getSubId());
		
		JSONArray inputArray=new JSONArray();
		JSONObject subObject=null;
		List<Option> subOptionList=subCal.getOption();
		for (Iterator<Option> iter = subOptionList.iterator(); iter.hasNext();) {
			Option subOptionDto=iter.next();
			subObject=new JSONObject();
			subObject.put("code", subOptionDto.getCode());
			subObject.put("val", parseNum(subOptionDto.getVal()));
			inputArray.add(subObject);
		}
		for (Iterator<Object> iter = baseArray.iterator(); iter.hasNext();) {
			JSONObject inputIter=(JSONObject)iter.next();
			subObject=new JSONObject();
			subObject.put("code", inputIter.getString("code"));
			subObject.put("val", parseNum(inputIter.getString("val")));
			inputArray.add(subObject);			
		}
		subValObj.put("input", inputArray);
		if(subCal.getOutputOption()!=null&&subCal.getOutputOption().size()>0){
			JSONArray outOptionArray=new JSONArray();
			JSONObject outOptionObj=null;
			for (Iterator<SubOutOption> iter = subCal.getOutputOption().iterator(); iter.hasNext();) {
				SubOutOption subOutOption=iter.next();
				outOptionObj=new JSONObject();
				outOptionObj.put("code", subOutOption.getCode());
				outOptionObj.put("val", parseNum(subOutOption.getVal()));
				outOptionArray.add(outOptionObj);
			}
			subValObj.put("out_put", outOptionArray);			
		}
		return subValObj.toString();
	}
	/**
	 *	判断字符串是否为数字类型
	 * @param str
	 * @return
	 */
	private static  Object parseNum(Object obj){
		String str="";
		if(obj instanceof String){
			str=""+obj;
		}else{
			return obj;
		}
		
		if(str==null||"".equals(str)){
			return "";
		}
		if(str.matches("^(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$")&&str.indexOf(".")>0){
			return Float.parseFloat(str);
		}
		if(str.matches("^(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$")){
			return Integer.parseInt(str);
		}
		return str;
	}
	
}
