package com.idasound.api.wap.dto.cal;



public class InputGroup {
	private String name; //分组名称
	private String show_name;//分组显示名称
	private String show_type;//分组类型
	private String title_name;
	private InputAttr inputAttr;//险种信息
	
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getShow_name() {
		return show_name;
	}
	public void setShow_name(String show_name) {
		this.show_name = show_name;
	}
	public String getShow_type() {
		return show_type;
	}
	public void setShow_type(String show_type) {
		this.show_type = show_type;
	}
	
	public String getTitle_name() {
		return title_name;
	}
	public void setTitle_name(String title_name) {
		this.title_name = title_name;
	}
	public InputAttr getInputAttr() {
		return inputAttr;
	}
	public void setInputAttr(InputAttr inputAttr) {
		this.inputAttr = inputAttr;
	}
}
