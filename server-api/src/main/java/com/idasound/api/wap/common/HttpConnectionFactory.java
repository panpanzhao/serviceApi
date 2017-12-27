package com.idasound.api.wap.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.AbstractHttpEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.edasoft.efa.core.exception.EfaExceptionUtils;


public class HttpConnectionFactory
{
  private static final Logger logger = LoggerFactory.getLogger(HttpConnectionFactory.class);
  public Object getConnection()
  {
    return  HttpClients.createDefault();
  }

  public boolean closeConnection(Object connection)
  {
	  CloseableHttpClient httpclient = (CloseableHttpClient)connection;
    if (httpclient != null) {
      httpclient = null;
    }
    return false;
  }

  public Object invoke(Object connection, Object message)
    throws RPCCheckedException
  {
    return invoke(connection, "", null, message);
  }

  public Object invoke(Object connection, URI url, Object message)
    throws RPCCheckedException
  {
    return invoke(connection, url, null, message);
  }

  public Object invoke(Object connection, String urlStr, String method, Object message) throws RPCCheckedException {
    try {
      URL url = new URL(urlStr);

      URI uri = new URI(url.getProtocol(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), url.getQuery(), null);
      return invoke(connection, uri, method, message); } catch (Exception e) {
    }
    throw new RuntimeException();
  }
  
  public Object invoke(Object connection, String urlStr, String method, Object message, Class<?> clz) throws RPCCheckedException {
	    try {
	      URL url = new URL(urlStr);

	      URI uri = new URI(url.getProtocol(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), url.getQuery(), null);
	      return invoke(connection, uri, method, message, clz); } catch (Exception e) {
	    }
	    throw new RuntimeException();
	  }

  public Object invokeTaobao(Object connection, String urlStr, String method, Object message) throws RPCCheckedException {
    try {
      URL url = new URL(urlStr);
      URI uri = new URI(url.getProtocol(), url.getHost(), url.getPath(), url.getQuery(), null);
      return invokeTaobao(connection, uri, method, message); } catch (Exception e) {
    }
    throw new RuntimeException();
  }

  public static void main(String[] args) throws RPCCheckedException {
		HttpConnectionFactory http = new HttpConnectionFactory();
		Object obj=http.invoke(HttpClients.createDefault(), "http://203.195.200.108/cal/CmptBnft/?jsoncallback=?", "POST", "conds={'info_id':'205','single':{'count':8,'input':[{\"code\":\"age\",\"val\":\"1995-08-18\"},{\"code\":\"sex\",\"val\":0},{\"code\":\"job_type\",\"val\":0},{\"code\":\"area\",\"val\":0},{\"code\":\"737_product\",\"val\":{\"info_id\":\"207\",\"input\":[{\"code\":\"age\",\"val\":\"1995-08-18\"},{\"code\":\"sex\",\"val\":0},{\"code\":\"job_type\",\"val\":0},{\"code\":\"area\",\"val\":0},{\"code\":\"737_amount\",\"val\":10000},{\"code\":\"737_ins_term\",\"val\":10},{\"code\":\"737_pay_term\",\"val\":1000},{\"code\":\"737_flag\",\"val\":0}],\"out_put\":[{\"code\":\"737_ins_term\",\"val\":10},{\"code\":\"737_pay_term\",\"val\":1000},{\"code\":\"age\",\"val\":10},{\"code\":\"737_amount\",\"val\":0},{\"code\":\"737_pay_term\",\"val\":1000},{\"code\":\"737_ins_term\",\"val\":10},{\"code\":\"737_prem\",\"val\":0},{\"code\":\"prem\",\"val\":0}]}},{\"code\":\"681_amount\",\"val\":50000},{\"code\":\"681_ins_term\",\"val\":15},{\"code\":\"681_pay_term\",\"val\":1000}]},'bnft_list':{'count':0,'input':[]}}");
		if(obj!=null&&obj.toString().length()>0){
			System.out.println(obj.toString().lastIndexOf("\\)"));
			obj=obj.toString().substring(2,obj.toString().lastIndexOf(")"));
		}
		System.out.println(obj);
  }

  public Object invoke(Object connection, URI url, String method, Object message)
    throws RPCCheckedException
  {
	  CloseableHttpClient httpclient = HttpClients.createDefault();
    HttpRequestBase httpMethod = null;

    StringBuffer stringBuffer = new StringBuffer();
    BufferedReader in = null;
	//发布100去掉此代理
/*	HttpHost proxyHost = new HttpHost("10.8.2.1", 80);
	httpclient.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY, proxyHost);*/
	//发布100去掉此代理
    if ("GET".equals(method)) {
      httpMethod = new HttpGet(url);
    } else if ("DELETE".equals(method)) {
      httpMethod = new HttpDelete(url);
    } else if ("PUT".equals(method)) {
      httpMethod = new HttpPut(url);
      if ((message instanceof String))
        ((HttpPut)httpMethod).setEntity(createEntity(StringEntity.class, message));
    }
    else {
      httpMethod = new HttpPost(url);
      if ((message instanceof String)) {
        ((HttpPost)httpMethod).setEntity(createEntity(StringEntity.class, message));
      }
    }
    HttpResponse response = null;
    try {
      response = httpclient.execute(httpMethod);

      HttpEntity resEntity = response.getEntity();
      if (response.getStatusLine().getStatusCode() != 200) {
    	  logger.error(response.getStatusLine().getReasonPhrase());
    	  throw new RPCCheckedException("EC_ISB_RPC_101", new String[] { String.valueOf(response.getStatusLine().getStatusCode()) }, "HTTP response code not equal 200.");
      }

      if (resEntity == null) {
        throw new RPCCheckedException("EC_ISB_RPC_102", new String[0], "HTTP response message is empty or null.");
      }

      in = new BufferedReader(new InputStreamReader(resEntity.getContent(), "utf-8"));
      while ((message = in.readLine()) != null) {
        stringBuffer.append(message);
      }
      message = stringBuffer.toString();
    } catch (ClientProtocolException e) {
      e.printStackTrace();
      throw new RPCCheckedException("EC_ISB_RPC_100", new String[0], e.getMessage());
    } catch (IOException e) {
      e.printStackTrace();
      throw new RPCCheckedException("EC_ISB_RPC_100", new String[0], e.getMessage());
    }
    return message;
  }
  
  public Object invoke(Object connection, URI url, String method, Object message,Class<?> entityClz)
		    throws RPCCheckedException
		  {
	  CloseableHttpClient httpclient = HttpClients.createDefault();
		    HttpRequestBase httpMethod = null;

		    StringBuffer stringBuffer = new StringBuffer();
		    BufferedReader in = null;
			//发布100去掉此代理
		/*	HttpHost proxyHost = new HttpHost("10.8.2.1", 80);
			httpclient.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY, proxyHost);*/
			//发布100去掉此代理
		    if ("GET".equals(method)) {
		      httpMethod = new HttpGet(url);
		    } else if ("DELETE".equals(method)) {
		      httpMethod = new HttpDelete(url);
		    } else if ("PUT".equals(method)) {
		      httpMethod = new HttpPut(url);
		        ((HttpPut)httpMethod).setEntity(createEntity(entityClz, message));
		    }
		    else {
		      httpMethod = new HttpPost(url);
		      ((HttpPost)httpMethod).setEntity(createEntity(entityClz, message));
		    }
		    HttpResponse response = null;
		    try {
		      response = httpclient.execute(httpMethod);

		      HttpEntity resEntity = response.getEntity();
		      if (response.getStatusLine().getStatusCode() != 200) {
		        throw new RPCCheckedException("EC_ISB_RPC_101", new String[] { String.valueOf(response.getStatusLine().getStatusCode()) }, "HTTP response code not equal 200.");
		      }

		      if (resEntity == null) {
		        throw new RPCCheckedException("EC_ISB_RPC_102", new String[0], "HTTP response message is empty or null.");
		      }

		      in = new BufferedReader(new InputStreamReader(resEntity.getContent(), "utf-8"));
		      while ((message = in.readLine()) != null) {
		        stringBuffer.append(message);
		      }
		      message = stringBuffer.toString();
		    } catch (ClientProtocolException e) {
		      e.printStackTrace();
		      throw new RPCCheckedException("EC_ISB_RPC_100", new String[0], e.getMessage());
		    } catch (IOException e) {
		      e.printStackTrace();
		      throw new RPCCheckedException("EC_ISB_RPC_100", new String[0], e.getMessage());
		    }
		    return message;
		  }

  private AbstractHttpEntity createEntity(Class clazz, Object message)
  {
    if (clazz.getSimpleName().equals("StringEntity")) {
      StringEntity entity = null;
      try {
        entity = new StringEntity(String.valueOf(message), "UTF-8");
      } catch (Exception e) {
        e.printStackTrace();
        EfaExceptionUtils.throwEfaAppException("EC_ISB_UN_053", new String[0], "charset encode exception");
      }

      entity.setContentType(new BasicHeader("Content-Type", "application/json"));
      return entity;
    }else if(clazz.getSimpleName().equals("UrlEncodedFormEntity")) {
    	UrlEncodedFormEntity urlEncodedFormEntity = null;
    	try {
			urlEncodedFormEntity = new UrlEncodedFormEntity((List<? extends NameValuePair>) message, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
	        EfaExceptionUtils.throwEfaAppException("EC_ISB_UN_053", new String[0], "unsupported encoding exception");
		}
    	return urlEncodedFormEntity;
    }
    return null;
  }

  public Object invokeTaobao(Object connection, URI url, String method, Object message)
    throws RPCCheckedException
  {
	  CloseableHttpClient httpclient = HttpClients.createDefault();
    HttpRequestBase httpMethod = null;

    StringBuffer stringBuffer = new StringBuffer();
    BufferedReader in = null;
    if ("GET".equals(method)) {
      httpMethod = new HttpGet(url);
    } else if ("DELETE".equals(method)) {
      httpMethod = new HttpDelete(url);
    } else if ("PUT".equals(method)) {
      httpMethod = new HttpPut(url);
      if ((message instanceof String))
        ((HttpPut)httpMethod).setEntity(createTaobaoEntity(StringEntity.class, message));
    }
    else {
      httpMethod = new HttpPost(url);
      if ((message instanceof String)) {
        ((HttpPost)httpMethod).setEntity(createTaobaoEntity(StringEntity.class, message));
      }
    }
    HttpResponse response = null;
    try {
      response = httpclient.execute(httpMethod);

      HttpEntity resEntity = response.getEntity();
      if (response.getStatusLine().getStatusCode() != 200) {
        throw new RPCCheckedException("EC_ISB_RPC_101", new String[] { String.valueOf(response.getStatusLine().getStatusCode()) }, "HTTP response code not equal 200.");
      }

      if (resEntity == null) {
        throw new RPCCheckedException("EC_ISB_RPC_102", new String[0], "HTTP response message is empty or null.");
      }

      in = new BufferedReader(new InputStreamReader(resEntity.getContent(), "GBK"));
      while ((message = in.readLine()) != null) {
        stringBuffer.append(message);
      }
      message = stringBuffer.toString();
    } catch (ClientProtocolException e) {
      e.printStackTrace();
      throw new RPCCheckedException("EC_ISB_RPC_100", new String[0], e.getMessage());
    } catch (IOException e) {
      e.printStackTrace();
      throw new RPCCheckedException("EC_ISB_RPC_100", new String[0], e.getMessage());
    }
    return message;
  }

  private AbstractHttpEntity createTaobaoEntity(Class clazz, Object message)
  {
    if (clazz.getSimpleName().equals("StringEntity")) {
      StringEntity entity = null;
      try {
        entity = new StringEntity(String.valueOf(message), "GBK");
      } catch (Exception e) {
        e.printStackTrace();
        EfaExceptionUtils.throwEfaAppException("EC_ISB_UN_053", new String[0], "charset encode exception");
      }

      entity.setContentType(new BasicHeader("Content-Type", "application/xml"));
      return entity;
    }
    return null;
  }

  public String getBody(Object connection, String servletUrl, Map<String,Object> map, String charset)
    throws RPCCheckedException
  {
    String body = "";
    CloseableHttpClient httpclient = HttpClients.createDefault();
    HttpResponse response = null;
    try {
      HttpPost httpPost = new HttpPost(servletUrl);
      if ((map != null) && (map.size() > 0)) {
    	  List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();  
	        for (String key : map.keySet()) {  
	            nameValuePairs.add(new BasicNameValuePair(key,(String) map.get(key)));  
	        } 
    	  
        httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));
      }
      response = httpclient.execute(httpPost);

      Integer status = Integer.valueOf(response.getStatusLine().getStatusCode());
      if (status.intValue() != 200) {
        throw new RPCCheckedException("EC_ISB_RPC_101", new String[] { String.valueOf(response.getStatusLine().getStatusCode()) }, "HTTP response code not equal 200.");
      }

      HttpEntity entity = response.getEntity();
      body = EntityUtils.toString(entity, charset);
    }
    catch (Exception e) {
      throw new RPCCheckedException("EC_ISB_RPC_100", new String[] { String.valueOf(response.getStatusLine().getStatusCode()) }, "HTTP response code");
    }
    finally {
      try {
		httpclient.close();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
    }
    return body;
  }
  
	
	//获取ip
	private String getRemortIP(HttpServletRequest request) { 
	    if (request.getHeader("x-forwarded-for") == null) { 
	        return request.getRemoteAddr(); 
	    } 
	    return request.getHeader("x-forwarded-for"); 
	}
	/**
	 * 调用后台接口
	 * @param   jsonStr
	 * @return  result={"flag":"","msg",""}
	 * @return  flag  0 成功   1失败
	 */
	public JSONObject resultInfo(String url,String jsonStr,HttpServletRequest request){
		String ip =getRemortIP(request);
		//调用返回的json格式字符串*/
		String result = null;
		//json字符串转换为json对象
		JSONObject obj = new  JSONObject();
		
		long begin = new Date().getTime();
		logger.info("------------------------调用远程数据开始(ip:"+ip+")");
		logger.info("------------------------url :"+url);
		logger.info("------------------------data:"+jsonStr);
		//开始调用.....
		try {
			result = (String) invoke(getConnection(),url,"POST",jsonStr);
			//result = "{\"header\":{\"response_code\":\"0\"},\"data\":{\"list\":[{\"id\":\"5aea1bcfbe2443cf9f0bdada83d21aa6\",\"name\":\"少儿保障系列\",\"pic\":\"\",\"productList\":[{\"product\":{\"amountPremium\":\"1000/437\",\"authLink\":\"\",\"beneficiaryLimit\":5,\"categoryId\":\"\",\"clauseLink\":\"\",\"code\":\"183\",\"createtime\":\"2014-05-22 06:21:28\",\"detailUrl\":\"../common/image/productDetial/C_319a5a29d8aa42abbfc8b544bc52c954.gif\",\"electricPolicy\":\"\",\"epolicyTemplate\":\"\",\"id\":\"828680335e404104bc77a1192b1bb4b0\",\"importantNotice\":\"\",\"independent\":\"1\",\"insTerm\":\"28\",\"insureNotice\":\"111\",\"insuredChangeType\":\"\",\"introduction\":\"匹配子女教育计划，给付成长关爱金；增添万能账户，保证最低收益，领取灵活；更有满期给付、保费豁免功能，关爱风雨无阻！\",\"isBill\":\"\",\"isOrder\":\"0\",\"iscard\":\"0\",\"ishealth\":\"0\",\"islegal\":\"0\",\"isonline\":\"\",\"isprincipal\":\"\",\"isrecommend\":\"\",\"levelSelectable\":\"\",\"maxPremium\":\"5000\",\"minPremium\":\"300\",\"multiple\":\"\",\"name\":\"i成长少儿年金保险\",\"parrentCode\":\"\",\"picPath\":\"/publish/echannel/images/front-end/Product/f293fd3282c844e584fac8ea2daaeb65\\\\0617224040_iczsenj.png\",\"policyLimit\":5,\"policyRelation\":\"0\",\"price\":\"300\",\"provisionLink\":\"\",\"recommendOrder\":0,\"responsibleSelectable\":\"1\",\"securityFeatures\":\"\",\"source\":\"f293fd3282c844e584fac8ea2daaeb65\",\"sourceName\":\"新华保险公司\",\"status\":\"3\",\"tagList\":\"\",\"targetUsers\":\"\",\"warmNotice\":\"\"},\"flowList\":[{\"createTime\":\"2014-05-21 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"059bc1aef5e74f359290607959df95d2\",\"flowBrief\":\"app（投自-受=被）\",\"flowCode\":\"10016\",\"flowName\":\"app端销售流程（投保被保人自定义-受益人=被保人）\",\"id\":\"f6e5bf029a6648ad85506d0f4f0477ba\",\"newDate\":\"2014-05-21 00:00:00\",\"updateTime\":\"2014-05-21 00:00:00\",\"updateUserid\":\"admin\"},{\"createTime\":\"2014-05-21 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"059bc1aef5e74f359290607959df95d2\",\"flowBrief\":\"app（投自-受=被）\",\"flowCode\":\"10016\",\"flowName\":\"app端销售流程（投保被保人自定义-受益人=被保人）\",\"id\":\"f6e5bf029a6648ad85506d0f4f0477ba\",\"newDate\":\"2014-05-21 00:00:00\",\"updateTime\":\"2014-05-21 00:00:00\",\"updateUserid\":\"admin\"}]},{\"product\":{\"amountPremium\":\"10000元起\",\"authLink\":\"\",\"beneficiaryLimit\":5,\"categoryId\":\"\",\"clauseLink\":\"\",\"code\":\"00171000\",\"createtime\":\"2013-11-20 14:07:55\",\"detailUrl\":\"../common/image/productDetial/C_d9cddea033d04b2698db337b8b6ee91a.gif\",\"electricPolicy\":\"\",\"epolicyTemplate\":\"\",\"id\":\"d9cddea033d04b2698db337b8b6ee91a\",\"importantNotice\":\"安心宝贝少儿两全保险 （一）满期生存保险金 被保险人生存至保险期间届满，本公司按本合同保险金额给付满期生存保险金，本合同终止。\",\"independent\":\"1\",\"insTerm\":\"30天-16周岁\",\"insureNotice\":\"被保险人范围：30天以上至16周岁以下身体健康者 投保人范围：被保险人父母保险期间：自合同生效日零时起至被保险人年满25周岁保单生效对应日零时交费方式：一次交清、年交 交费期间：一次交清、三年、五年、十年、至18周岁保单生效对应日前一日 其它：本产品暂不受理网上退保\",\"insuredChangeType\":\"\",\"introduction\":\"宝贝成长乐无忧，重大疾病安心保。 25种重疾2种特疾全覆盖，呵护宝贝安心成长。 让父母放心呵护，助宝贝安心成长。\",\"isBill\":\"\",\"isOrder\":\"1\",\"iscard\":\"0\",\"ishealth\":\"1\",\"islegal\":\"1\",\"isonline\":\"\",\"isprincipal\":\"\",\"isrecommend\":\"\",\"levelSelectable\":\"\",\"maxPremium\":\"200000\",\"minPremium\":\"100000\",\"multiple\":\"\",\"name\":\"安心宝贝少儿重大疾病保障计划\",\"parrentCode\":\"\",\"picPath\":\"/publish/echannel/images/front-end/Product/f293fd3282c844e584fac8ea2daaeb65\\\\0617220724_2.png\",\"policyLimit\":5,\"policyRelation\":\"0\",\"price\":\"10000\",\"provisionLink\":\"http://www.newchinalife.com/nciservice/userfiles/file/AnXinBaoBeiBaoXianTiaoKuan.pdf\",\"recommendOrder\":0,\"responsibleSelectable\":\"1\",\"securityFeatures\":\"\",\"source\":\"f293fd3282c844e584fac8ea2daaeb65\",\"sourceName\":\"新华保险公司\",\"status\":\"3\",\"tagList\":\"\",\"targetUsers\":\"\",\"warmNotice\":\"\"},\"flowList\":[{\"createTime\":\"2014-03-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"dd48ac604c6d4fff8f46c9d4392fcb58\",\"flowBrief\":\"app\",\"flowCode\":\"10014\",\"flowName\":\"app端销售流程\",\"id\":\"f0dcbbaa76b04abbbf87533e0acaedcf\",\"newDate\":\"2014-03-14 00:00:00\",\"updateTime\":\"2014-03-14 00:00:00\",\"updateUserid\":\"admin\"},{\"createTime\":\"2014-03-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"dd48ac604c6d4fff8f46c9d4392fcb58\",\"flowBrief\":\"app\",\"flowCode\":\"10014\",\"flowName\":\"app端销售流程\",\"id\":\"f0dcbbaa76b04abbbf87533e0acaedcf\",\"newDate\":\"2014-03-14 00:00:00\",\"updateTime\":\"2014-03-14 00:00:00\",\"updateUserid\":\"admin\"}]}]},{\"id\":\"4373b687a6194c58a83be2887d6cf035\",\"name\":\"女性保障系列\",\"pic\":\"\",\"productList\":[{\"product\":{\"amountPremium\":\"10000/13\",\"authLink\":\"\",\"beneficiaryLimit\":5,\"categoryId\":\"\",\"clauseLink\":\"\",\"code\":\"784\",\"createtime\":\"2014-05-21 05:37:40\",\"detailUrl\":\"../common/image/productDetial/C_319a5a29d8aa42abbfc8b544bc52c954.gif\",\"electricPolicy\":\"\",\"epolicyTemplate\":\"\",\"id\":\"d4099e911bde41de856f3e123274464e\",\"importantNotice\":\"\",\"independent\":\"1\",\"insTerm\":\"1年\",\"insureNotice\":\"111\",\"insuredChangeType\":\"\",\"introduction\":\"小投入，大保障， 十余种女性易发高发疾病全覆盖，更有保障面部毁损整容资金。\",\"isBill\":\"\",\"isOrder\":\"0\",\"iscard\":\"0\",\"ishealth\":\"0\",\"islegal\":\"0\",\"isonline\":\"\",\"isprincipal\":\"\",\"isrecommend\":\"\",\"levelSelectable\":\"\",\"maxPremium\":\"1000\",\"minPremium\":\"13\",\"multiple\":\"\",\"name\":\"i她女性特定疾病保险\",\"parrentCode\":\"\",\"picPath\":\"/publish/echannel/images/front-end/Product/f293fd3282c844e584fac8ea2daaeb65\\\\0521053740_2.png\",\"policyLimit\":5,\"policyRelation\":\"0\",\"price\":\"13\",\"provisionLink\":\"\",\"recommendOrder\":0,\"responsibleSelectable\":\"0\",\"securityFeatures\":\"\",\"source\":\"f293fd3282c844e584fac8ea2daaeb65\",\"sourceName\":\"新华保险公司\",\"status\":\"3\",\"tagList\":\"\",\"targetUsers\":\"\",\"warmNotice\":\"\"},\"flowList\":[{\"createTime\":\"2014-05-21 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"37d094dbb93448b48147a6365aeeb953\",\"flowBrief\":\"app（投自-受=被）\",\"flowCode\":\"10016\",\"flowName\":\"app端销售流程（投保被保人自定义-受益人=被保人）\",\"id\":\"f6e5bf029a6648ad85506d0f4f0477ba\",\"newDate\":\"2014-05-21 00:00:00\",\"updateTime\":\"2014-05-21 00:00:00\",\"updateUserid\":\"admin\"},{\"createTime\":\"2014-05-21 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"37d094dbb93448b48147a6365aeeb953\",\"flowBrief\":\"app（投自-受=被）\",\"flowCode\":\"10016\",\"flowName\":\"app端销售流程（投保被保人自定义-受益人=被保人）\",\"id\":\"f6e5bf029a6648ad85506d0f4f0477ba\",\"newDate\":\"2014-05-21 00:00:00\",\"updateTime\":\"2014-05-21 00:00:00\",\"updateUserid\":\"admin\"}]}]},{\"id\":\"48edc70618064732aaf24303f509e1f1\",\"name\":\"投资理财系列\",\"pic\":\"\",\"productList\":[{\"product\":{\"amountPremium\":\"1000/份\",\"authLink\":\"\",\"beneficiaryLimit\":5,\"categoryId\":\"\",\"clauseLink\":\"\",\"code\":\"914\",\"createtime\":\"2014-05-16 04:41:25\",\"detailUrl\":\"../common/image/productDetial/C_319a5a29d8aa42abbfc8b544bc52c954.gif\",\"electricPolicy\":\"\",\"epolicyTemplate\":\"\",\"id\":\"da3a07bb217648e390521d99b4917fbe\",\"importantNotice\":\"\",\"independent\":\"1\",\"insTerm\":\"7年\",\"insureNotice\":\"111\",\"insuredChangeType\":\"\",\"introduction\":\"安全、稳健、灵活的保险理财产, 挂钩特定项目的资产导向型产品\",\"isBill\":\"\",\"isOrder\":\"0\",\"iscard\":\"0\",\"ishealth\":\"0\",\"islegal\":\"0\",\"isonline\":\"\",\"isprincipal\":\"\",\"isrecommend\":\"\",\"levelSelectable\":\"\",\"maxPremium\":\"199000\",\"minPremium\":\"1000\",\"multiple\":\"\",\"name\":\"i理财两全保险（万能型）\",\"parrentCode\":\"\",\"picPath\":\"/publish/echannel/images/front-end/Product/f293fd3282c844e584fac8ea2daaeb65\\\\0516044125_1.png\",\"policyLimit\":5,\"policyRelation\":\"0\",\"price\":\"1000\",\"provisionLink\":\"\",\"recommendOrder\":0,\"responsibleSelectable\":\"0\",\"securityFeatures\":\"\",\"source\":\"f293fd3282c844e584fac8ea2daaeb65\",\"sourceName\":\"新华保险公司\",\"status\":\"3\",\"tagList\":\"\",\"targetUsers\":\"\",\"warmNotice\":\"\"},\"flowList\":[{\"createTime\":\"2014-05-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"9d2be413e28343cabe6f54cd34f14f00\",\"flowBrief\":\"app-投被相同-受自\",\"flowCode\":\"10015\",\"flowName\":\"app端销售流程（投保被保人相同-受益人自定义）\",\"id\":\"6597b2206138421f9ddce28b081a6cdb\",\"newDate\":\"2014-05-14 00:00:00\",\"updateTime\":\"2014-05-14 00:00:00\",\"updateUserid\":\"admin\"},{\"createTime\":\"2014-05-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"9d2be413e28343cabe6f54cd34f14f00\",\"flowBrief\":\"app-投被相同-受自\",\"flowCode\":\"10015\",\"flowName\":\"app端销售流程（投保被保人相同-受益人自定义）\",\"id\":\"6597b2206138421f9ddce28b081a6cdb\",\"newDate\":\"2014-05-14 00:00:00\",\"updateTime\":\"2014-05-14 00:00:00\",\"updateUserid\":\"admin\"}]}]},{\"id\":\"2c56821db535401eb377e7a82c2edca2\",\"name\":\"长期保障系列\",\"pic\":\"\",\"productList\":[{\"product\":{\"amountPremium\":\"10万/50\",\"authLink\":\"\",\"beneficiaryLimit\":5,\"categoryId\":\"\",\"clauseLink\":\"\",\"code\":\"177\",\"createtime\":\"2014-03-12 09:57:04\",\"detailUrl\":\"../common/image/productDetial/C_319a5a29d8aa42abbfc8b544bc52c954.gif\",\"electricPolicy\":\"\",\"epolicyTemplate\":\"\",\"id\":\"319a5a29d8aa42abbfc8b544bc52c954\",\"importantNotice\":\"保险责任： 身故或身体全残保险金\",\"independent\":\"1\",\"insTerm\":\"10/20/30年\",\"insureNotice\":\"投保年龄：18-61岁 投保期间：10/20/30年、至被保险人50/60/70周岁\",\"insuredChangeType\":\"\",\"introduction\":\"保障因意外或疾病所致的身故或全残，保费便宜实惠，小投入大保障，能够让家庭免遭突发事故带来的冲击。\",\"isBill\":\"\",\"isOrder\":\"1\",\"iscard\":\"0\",\"ishealth\":\"1\",\"islegal\":\"1\",\"isonline\":\"\",\"isprincipal\":\"\",\"isrecommend\":\"\",\"levelSelectable\":\"\",\"maxPremium\":\"33600\",\"minPremium\":\"50\",\"multiple\":\"\",\"name\":\"i守护定期寿险\",\"parrentCode\":\"\",\"picPath\":\"/publish/echannel/images/front-end/Product/f293fd3282c844e584fac8ea2daaeb65\\\\0411092738_3.png\",\"policyLimit\":5,\"policyRelation\":\"1\",\"price\":\"50\",\"provisionLink\":\"http://www.newchinalife.com/nciservice/userfiles/file/IShouHuTiaoKuan.pdf\",\"recommendOrder\":0,\"responsibleSelectable\":\"1\",\"securityFeatures\":\"\",\"source\":\"f293fd3282c844e584fac8ea2daaeb65\",\"sourceName\":\"新华保险公司\",\"status\":\"3\",\"tagList\":\"\",\"targetUsers\":\"\",\"warmNotice\":\"\"},\"flowList\":[{\"createTime\":\"2014-03-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"e14420b8a17e4f6488814fb2262de915\",\"flowBrief\":\"app\",\"flowCode\":\"10014\",\"flowName\":\"app端销售流程\",\"id\":\"f0dcbbaa76b04abbbf87533e0acaedcf\",\"newDate\":\"2014-03-14 00:00:00\",\"updateTime\":\"2014-03-14 00:00:00\",\"updateUserid\":\"admin\"},{\"createTime\":\"2014-03-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"e14420b8a17e4f6488814fb2262de915\",\"flowBrief\":\"app\",\"flowCode\":\"10014\",\"flowName\":\"app端销售流程\",\"id\":\"f0dcbbaa76b04abbbf87533e0acaedcf\",\"newDate\":\"2014-03-14 00:00:00\",\"updateTime\":\"2014-03-14 00:00:00\",\"updateUserid\":\"admin\"}]},{\"product\":{\"amountPremium\":\"10\",\"authLink\":\"\",\"beneficiaryLimit\":5,\"categoryId\":\"\",\"clauseLink\":\"\",\"code\":\"00170100\",\"createtime\":\"2014-05-13 04:30:43\",\"detailUrl\":\"../common/image/productDetial/C_319a5a29d8aa42abbfc8b544bc52c954.gif\",\"electricPolicy\":\"\",\"epolicyTemplate\":\"\",\"id\":\"1bc067602dda4b049d666e0337d3c212\",\"importantNotice\":\"\",\"independent\":\"1\",\"insTerm\":\"20年\",\"insureNotice\":\"-\",\"insuredChangeType\":\"\",\"introduction\":\"i相伴重大疾病保障计划介绍\",\"isBill\":\"\",\"isOrder\":\"0\",\"iscard\":\"0\",\"ishealth\":\"0\",\"islegal\":\"0\",\"isonline\":\"\",\"isprincipal\":\"\",\"isrecommend\":\"\",\"levelSelectable\":\"\",\"maxPremium\":\"5000\",\"minPremium\":\"10\",\"multiple\":\"\",\"name\":\"i相伴重大疾病保障计划\",\"parrentCode\":\"\",\"picPath\":\"/publish/echannel/images/front-end/Product/f293fd3282c844e584fac8ea2daaeb65\\\\0617230044_ixb.png\",\"policyLimit\":5,\"policyRelation\":\"0\",\"price\":\"10\",\"provisionLink\":\"\",\"recommendOrder\":0,\"responsibleSelectable\":\"0\",\"securityFeatures\":\"\",\"source\":\"f293fd3282c844e584fac8ea2daaeb65\",\"sourceName\":\"新华保险公司\",\"status\":\"3\",\"tagList\":\"\",\"targetUsers\":\"\",\"warmNotice\":\"\"},\"flowList\":[{\"createTime\":\"2014-05-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"c2d6ce04de6e47729a0edc035a4cdbe4\",\"flowBrief\":\"app-投被相同-受自\",\"flowCode\":\"10015\",\"flowName\":\"app端销售流程（投保被保人相同-受益人自定义）\",\"id\":\"6597b2206138421f9ddce28b081a6cdb\",\"newDate\":\"2014-05-14 00:00:00\",\"updateTime\":\"2014-05-14 00:00:00\",\"updateUserid\":\"admin\"},{\"createTime\":\"2014-05-14 00:00:00\",\"createUserid\":\"admin\",\"fcid\":\"c2d6ce04de6e47729a0edc035a4cdbe4\",\"flowBrief\":\"app-投被相同-受自\",\"flowCode\":\"10015\",\"flowName\":\"app端销售流程（投保被保人相同-受益人自定义）\",\"id\":\"6597b2206138421f9ddce28b081a6cdb\",\"newDate\":\"2014-05-14 00:00:00\",\"updateTime\":\"2014-05-14 00:00:00\",\"updateUserid\":\"admin\"}]}]}]}}";
		} catch (Exception e) {
			e.printStackTrace();
		}
		long end = new Date().getTime();
		logger.info("------------------------调用远程数据结束,用时:"+(end - begin)/1000 +"s,返回信息："+result);
		if(result != null&&!"".equals(result)){
			obj = JSONObject.fromObject(result);
		}else{
			JSONObject header=new JSONObject();
			header.put("response_code", "2");
			header.put("response_msg", "结果返回null值!");
			obj.put("header", header);
		}
		return obj;
	}
	
	/**
	 * map转换为json
	 * @param inputMap
	 * @return
	 */
	public  String generateInputJson(Map<String,Object> inputMap){
		JSONObject jsonObject=JSONObject.fromObject(inputMap);
		return jsonObject.toString();
	}
	
}