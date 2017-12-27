<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/layouts/base.jsp"%>


<link rel="stylesheet" type="text/css" href="${cssBasePath}/base_my.css?v=${version}" />
<link rel="stylesheet" type="text/css" href="${cssBasePath}/mainbx_my.css?v=${version}" />
<link rel="stylesheet" type="text/css" href="${cssBasePath}/lib/weui.css" />

<script type="text/javascript" src="${scriptBasePath}/lib/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${scriptBasePath}/lib/template.js"></script>
<script type="text/javascript" src="${scriptBasePath}/lib/jweixin-1.2.0.js"></script>

<script type="text/javascript" src="${scriptBasePath}/lib/easydialog.js"></script>

<script type="text/javascript" src="${scriptBasePath}/common/base_fun.js?v=${version}"></script>


<script type="text/javascript">
var jsbaseContextPath="${baseContextPath}";
var jscontextPath="${contextPath}";

var jsbaseServerPath="${baseServerPath}";
var jsscriptBasePath="${scriptBasePath}";
var jsimagesBasePath="${imagesBasePath}";
var jstempBasePath="${templateBasePath}";

var jsimagesServerPath="${imagesServerPath}";

var jsversion="${version}";

var data_template={};
data_template.contextPath="${contextPath}";

data_template.scriptBasePath="${scriptBasePath}";
data_template.imagesBasePath="${imagesBasePath}";

data_template.imagesServerPath="${imagesServerPath}";
data_template.fileBasePath="${fileBasePath}";
</script>
<script type="text/javascript" src="${scriptBasePath}/common/base_compose.js"></script>