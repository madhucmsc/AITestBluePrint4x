package com.company.tests;

import com.company.base.BaseTest;
import com.company.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class InvalidLoginTest extends BaseTest {

  @Test
  public void invalidLogin() {
    String username = System.getProperty("invalidUsername", "invalid@example.com");
    String password = System.getProperty("invalidPassword", "InvalidPass123");
    LoginPage loginPage = new LoginPage(driver);
    boolean success = loginPage.login(username, password);
    Assert.assertFalse(success, "Expected login to fail with invalid credentials");
    String error = loginPage.getErrorMessage();
    Assert.assertTrue(error.length() > 0, "Expected an error message to be displayed for invalid login");
  }
}
