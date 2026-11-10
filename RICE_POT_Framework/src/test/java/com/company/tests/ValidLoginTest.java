package com.company.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.company.base.BaseTest;
import com.company.pages.LoginPage;

public class ValidLoginTest extends BaseTest {

  @Test
  public void validLogin() {
    String username = System.getProperty("username", "");
    String password = System.getProperty("password", "");
    Assert.assertFalse(username.isEmpty(), "A valid username must be supplied via -Dusername");
    Assert.assertFalse(password.isEmpty(), "A valid password must be supplied via -Dpassword");

    try {
      LoginPage loginPage = new LoginPage(driver);
      boolean loggedIn = loginPage.login(username, password);
      Assert.assertTrue(loggedIn,
          "Expected a successful login, but the page did not navigate away from the login screen");
    } catch (RuntimeException e) {
      throw new AssertionError("Valid-login flow raised an unexpected error", e);
    }
  }
}
