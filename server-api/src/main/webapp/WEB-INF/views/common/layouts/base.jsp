<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib uri="http://www.edasoft.com/tags/efa" prefix="efa"%>

<c:set var="baseContextPath" value="${pageContext.request.scheme }://${pageContext.request.serverName }:${pageContext.request.serverPort}${pageContext.request.contextPath}" />
<c:set var="contextPath" value="${pageContext.request.contextPath}" />

<c:set var="baseServerPath" value="${pageContext.request.scheme }://${pageContext.request.serverName }:${pageContext.request.serverPort}${pageContext.request.contextPath}" />
<%-- <c:set var="baseServerPath" value="${pageContext.request.scheme }://${pageContext.request.serverName }/wxstatic" /> --%>
<c:set var="cssBasePath" value="${baseServerPath }/styles" />
<c:set var="scriptBasePath" value="${baseServerPath }/scripts" />
<c:set var="imagesBasePath" value="${baseServerPath }/images" />
<c:set var="fileBasePath" value="${baseServerPath }/file" />
<c:set var="templateBasePath" value="${baseServerPath }/template" />

<c:set var="imagesServerPath" value="${pageContext.request.scheme }://${pageContext.request.serverName }" />
<%-- <c:set var="imagesServerPath" value="http://119.23.173.69" /> --%>

<c:set var="version" value="20171215" />
<%response.setHeader("Cache-Control","no-cache,no-strore");response.setHeader("Pragma","no-cache");response.setDateHeader("Expires",-1);%>