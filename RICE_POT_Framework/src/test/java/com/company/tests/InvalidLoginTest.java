package com.company.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.company.base.BaseTest;
import com.company.pages.LoginPage;

public class InvalidLoginTest extends BaseTest {

  @Test
  public void invalidLogin() {
    String invalidUsername = System.getProperty("invalidUsername", "invalid@example.com");
    String invalidPassword = System.getProperty("invalidPassword", "InvalidPass123");

    try {
      LoginPage loginPage = new LoginPage(driver);
      boolean loggedIn = loginPage.login(invalidUsername, invalidPassword);
      Assert.assertFalse(loggedIn,
          "Expected login to fail with invalid credentials, but the login appeared to succeed");

      String errorMessage = loginPage.getErrorMessage();
      Assert.assertFalse(errorMessage.isEmpty(),
          "Expected a Salesforce error message to be shown for invalid credentials");
    } catch (RuntimeException e) {
      throw new AssertionError("Invalid-login flow raised an unexpected error", e);
    }
  }
}
