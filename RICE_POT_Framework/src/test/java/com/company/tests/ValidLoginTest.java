package com.company.tests;

import com.company.base.BaseTest;
import com.company.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ValidLoginTest extends BaseTest {

  @Test
  public void validLogin() {
    String username = System.getProperty("username", "");
    String password = System.getProperty("password", "");
    LoginPage loginPage = new LoginPage(driver);
    boolean success = loginPage.login(username, password);
    Assert.assertTrue(success, "Expected successful login but login failed");
  }
}
