package com.idasound.api.wap.common;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.edasoft.efa.core.exception.EfaAppCheckedException;

public class RPCCheckedException extends EfaAppCheckedException
{
  public static final long serialVersionUID = 20100929130845L;

  public RPCCheckedException(String code, String[] params, String defaultMessage)
  {
    super(code, params, defaultMessage);
    validateCode(code);
  }

  public RPCCheckedException(String code, String[] params, String defaultMessage, Throwable cause) {
    super(code, params, defaultMessage, cause);
    validateCode(code);
  }

  private void validateCode(String code) {
    Assert.isTrue((StringUtils.hasText(code)) && (code.startsWith("EC_")), "Exception Code must start with 'EC_'");
  }
}