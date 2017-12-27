package com.idasound.api.wap.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.idasound.api.wap.common.HttpConnectionFactory;
import com.idasound.api.wap.common.RPCCheckedException;

@Service
public class HttpService {
	private static final Logger logger = LoggerFactory.getLogger(HttpService.class);
	@Value("${request_url}")
	private String REQUEST_URL;
	@Value("${service_url}")
	private String SERVICE_URL;
	@Value("${user_id}")
	private String USER_ID;
	
	private static  HttpConnectionFactory httpConnection=new HttpConnectionFactory();
	
	public String resultMsg(String msg){
		return String.format("{\"header\": {\"response_code\": \"1\",\"response_msg\": {\"default_msg\": \"%s\"}},\"data\": {}}", msg);
	}
	/**
	 * 通过产品ID获取输入项
	 * @param productId
	 * @return
	 */
	public  JSONObject postModelByCode(String code,JSONObject dataParam){
		Object result=null;
		JSONObject reqObject=new JSONObject();
		try {
			JSONObject header=new JSONObject();
			header.put("user_id", USER_ID);
			header.put("service_code", code);
			header.put("sign", "E0221BB3A4561FCC2439363115FA9581");
			header.put("serial_id", "");
			header.put("request_time", "");
			
			reqObject.put("header", header);
			reqObject.put("data", dataParam);
			logger.info("请求{}的报文数据:{}", new Object[]{code,reqObject.toString()});
			result = httpConnection.invoke(httpConnection.getConnection(), REQUEST_URL, "POST", reqObject.toString());
			logger.info("请求{}的返回报文数据:{}", new Object[]{code,result});
			JSONObject resultObj=JSONObject.parseObject(result==null?"{}":result.toString());
			if(resultObj.getJSONObject("header")==null||resultObj.getJSONObject("header").get("response_code")==null){
				logger.error("请求{}接口返回数据有误:{}", new Object[]{code,resultObj.toString()});
				return JSONObject.parseObject(resultMsg("系统繁忙,请稍后重试"));
			}
			return resultObj;
		} catch (Exception e) {
			logger.error("请求{}接口异常", new Object[]{code});
			return JSONObject.parseObject(resultMsg("系统繁忙,请稍后重试"));
		}
	}
	/**
	 * 通过产品ID获取输入项
	 * @param productId
	 * @return
	 */
	public  JSONObject postModelByUrl(String url,JSONObject dataParam){
		Object result=null;
		JSONObject reqObject=new JSONObject();
		try {
			JSONObject header=new JSONObject();
			header.put("user_id", USER_ID);
			header.put("service_code", "");
			header.put("sign", "E0221BB3A4561FCC2439363115FA9581");
			header.put("serial_id", "");
			header.put("request_time", "");
			
			reqObject.put("header", header);
			reqObject.put("data", dataParam);
			//logger.info("请求{}的报文数据:{}", new Object[]{url,reqObject.toString()});
			result = httpConnection.invoke(httpConnection.getConnection(), url, "POST", reqObject.toString());
			logger.info("请求{}的返回报文数据:{}", new Object[]{url,result});
			JSONObject resultObj=JSONObject.parseObject(result==null?"{}":result.toString());
			if(resultObj.getJSONObject("header")==null||resultObj.getJSONObject("header").get("response_code")==null){
				logger.error("请求{}接口返回数据有误:{}", new Object[]{url,resultObj.toString()});
				return JSONObject.parseObject(resultMsg("系统繁忙,请稍后重试"));
			}
			return resultObj;
		} catch (Exception e) {
			logger.error("请求{}接口异常", new Object[]{url});
			return JSONObject.parseObject(resultMsg("系统繁忙,请稍后重试"));
		}
	}
	/**
	 * 
	 * @param 
	 * @return
	 */
	public  JSONObject postByUrl(String url,JSONObject dataParam){
		Object result=null;
		try {
			logger.info("请求报文数据:{}", new Object[]{dataParam});
			result = httpConnection.invoke(httpConnection.getConnection(), url, "POST", dataParam.toString());
			logger.info("返回报文数据:{}", new Object[]{result});
			JSONObject resultObj=JSONObject.parseObject(result==null?"{}":result.toString());
			return resultObj;
		} catch (Exception e) {
			return JSONObject.parseObject(resultMsg("系统繁忙,请稍后重试"));
		}
	}
	/**
	 * 
	 * @param 
	 * @return
	 */
	public  JSONObject postByUrl(String url,String dataParam){
		Object result=null;
		try {
			logger.info("请求{}地址的报文数据:{}", new Object[]{url,dataParam});
			result = httpConnection.invoke(httpConnection.getConnection(), url, "POST", dataParam);
			logger.info("返回报文数据:{}", new Object[]{result});
			JSONObject resultObj=JSONObject.parseObject(result==null?"{}":result.toString());
			return resultObj;
		} catch (Exception e) {
			return JSONObject.parseObject(resultMsg("系统繁忙,请稍后重试"));
		}
	}


	
	public String getREQUEST_URL() {
		return REQUEST_URL;
	}
	public void setREQUEST_URL(String rEQUEST_URL) {
		REQUEST_URL = rEQUEST_URL;
	}
	public String getUSER_ID() {
		return USER_ID;
	}
	public void setUSER_ID(String uSER_ID) {
		USER_ID = uSER_ID;
	}
	
	public static void main(String[] args) {
		try {
			Object str=httpConnection.invoke(httpConnection.getConnection(), "http://119.23.173.69/ju321/isb-common-adapter-in/commonReqUrl?appId=wx948602ee622d64b2", "POST", "{\"data\":{\"product_id\":\"16a15934e5fa11e7bb25080027225143\"},\"header\":{\"request_time\":\"\",\"serial_id\":\"\",\"service_code\":\"getPremInputModelIn\",\"sign\":\"E0221BB3A4561FCC2439363115FA9581\",\"user_id\":\"5128f775a8224bd4b0cf8bb05c864f8a\"}}");
			System.out.println(str);
		} catch (RPCCheckedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
