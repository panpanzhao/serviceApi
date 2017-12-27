package com.idasound.api.wap.dto.cal;
/**
 * 试算输入项
 * @author zpp
 */
public class Input {
	
	private Object name;//显示项名称
	private Object code;//code或id
	private Object comp_type;//控件类型 自定义类型
	private Object default_val;//默认值
	private Object limit;//输入框输入值范围
	private Object back_name;//单位
	private Object val;//实际值
	private Object val_name;//实际值对应文字
	private Object enter_flag;
	private Object nameLength;
	private Object cal_flag;//是否参与试算
	
	public Object getName() {
		return name;
	}
	public void setName(Object name) {
		this.name = name;
	}
	public Object getCode() {
		return code;
	}
	public void setCode(Object code) {
		this.code = code;
	}
	public Object getComp_type() {
		return comp_type;
	}
	public void setComp_type(Object comp_type) {
		this.comp_type = comp_type;
	}
	public Object getDefault_val() {
		return default_val;
	}
	public void setDefault_val(Object default_val) {
		this.default_val = default_val;
	}
	public Object getBack_name() {
		return back_name;
	}
	public void setBack_name(Object back_name) {
		this.back_name = back_name;
	}
	public Object getLimit() {
		return limit;
	}
	public void setLimit(Object limit) {
		this.limit = limit;
	}
	public void setLimit(String limit) {
		this.limit = limit;
	}
	public Object getVal() {
		return val;
	}
	public void setVal(Object val) {
		this.val = val;
	}
	public Object getVal_name() {
		return val_name;
	}
	public void setVal_name(Object val_name) {
		this.val_name = val_name;
	}
	public Object getEnter_flag() {
		return enter_flag;
	}
	public void setEnter_flag(Object enter_flag) {
		this.enter_flag = enter_flag;
	}
	public Object getNameLength() {
		return nameLength;
	}
	public void setNameLength(Object nameLength) {
		this.nameLength = nameLength;
	}
	public Object getCal_flag() {
		return cal_flag;
	}
	public void setCal_flag(Object cal_flag) {
		this.cal_flag = cal_flag;
	}
	
}