package com.idasound.api.wap.dto;
/**
 * 信息录入项
 * @author zpp
 *
 */
public class Option {

	private Object code;//录入项唯一code
	private Object type;//输入项类型
	private Object short_name;//输入项名称
	private Object val;//输入项值
	private Object val_text;//输入项显示值
	private Object back_name;//输入项值的单位
	
	public Object getCode() {
		return code;
	}
	public void setCode(Object code) {
		this.code = code;
	}
	public Object getType() {
		return type;
	}
	public void setType(Object type) {
		this.type = type;
	}
	public Object getShort_name() {
		return short_name;
	}
	public void setShort_name(Object short_name) {
		this.short_name = short_name;
	}
	public Object getVal() {
		return val;
	}
	public void setVal(Object val) {
		this.val = val;
	}
	public Object getVal_text() {
		return val_text;
	}
	public void setVal_text(Object val_text) {
		this.val_text = val_text;
	}
	public Object getBack_name() {
		return back_name;
	}
	public void setBack_name(Object back_name) {
		this.back_name = back_name;
	}
}
