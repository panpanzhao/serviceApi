package com.idasound.api.wap.dto.cal;

import java.util.List;
import java.util.Map;

/**
 * 试算输入项
 * @author zpp
 */
public class InputAttr {
	private Map<String,Input> inputMap;//特殊的输入项
	private List<Input> inputList;//普通的输入项
	
	private String out_put;//附加险需要的输出信息
	private String code;//附加险code;
	private String val;//附加险id;
	

	
	public Map<String, Input> getInputMap() {
		return inputMap;
	}
	public void setInputMap(Map<String, Input> inputMap) {
		this.inputMap = inputMap;
	}
	public List<Input> getInputList() {
		return inputList;
	}
	public void setInputList(List<Input> inputList) {
		this.inputList = inputList;
	}
	public String getOut_put() {
		return out_put;
	}
	public void setOut_put(String out_put) {
		this.out_put = out_put;
	}	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getVal() {
		return val;
	}
	public void setVal(String val) {
		this.val = val;
	}
}