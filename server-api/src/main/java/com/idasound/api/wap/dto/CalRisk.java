package com.idasound.api.wap.dto;

import java.util.List;
/**
 * 试算实体类
 * @author zpp
 *
 */
public class CalRisk {
	private String productId; //产品Id
	private String prem;//保费
	private String price;//价格
	
	private List<Option> basicOption; //基本信息
	private List<Option> mainOption;//主险信息
	private List<Option> ruleOption;//规则信息
	private List<SubCal> subCal;//附加险信息
		
	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}


	public String getPrem() {
		return prem;
	}


	public void setPrem(String prem) {
		this.prem = prem;
	}


	public String getPrice() {
		return price;
	}


	public void setPrice(String price) {
		this.price = price;
	}


	public List<Option> getBasicOption() {
		return basicOption;
	}


	public void setBasicOption(List<Option> basicOption) {
		this.basicOption = basicOption;
	}


	public List<Option> getMainOption() {
		return mainOption;
	}


	public void setMainOption(List<Option> mainOption) {
		this.mainOption = mainOption;
	}


	public List<Option> getRuleOption() {
		return ruleOption;
	}

	public void setRuleOption(List<Option> ruleOption) {
		this.ruleOption = ruleOption;
	}

	public List<SubCal> getSubCal() {
		return subCal;
	}

	public void setSubCal(List<SubCal> subCal) {
		this.subCal = subCal;
	}
	
	//附加险信息
	public static class SubCal{
		private String subId;
		private String subCode;
		private List<Option> option;
		private List<SubOutOption> outputOption;
		public String getSubId() {
			return subId;
		}
		public void setSubId(String subId) {
			this.subId = subId;
		}
		public String getSubCode() {
			return subCode;
		}
		public void setSubCode(String subCode) {
			this.subCode = subCode;
		}
		public List<Option> getOption() {
			return option;
		}
		public void setOption(List<Option> option) {
			this.option = option;
		}		
		public List<SubOutOption> getOutputOption() {
			return outputOption;
		}
		public void setOutputOption(List<SubOutOption> outputOption) {
			this.outputOption = outputOption;
		}

		public static class SubOutOption{
			private Object code;//录入项唯一code
			private Object val;
			private Object name;
			public Object getCode() {
				return code;
			}
			public void setCode(Object code) {
				this.code = code;
			}
			public Object getVal() {
				return val;
			}
			public void setVal(Object val) {
				this.val = val;
			}
			public Object getName() {
				return name;
			}
			public void setName(Object name) {
				this.name = name;
			}
		}
	}

}