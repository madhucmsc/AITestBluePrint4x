package com.company.pages;

import java.time.Duration;

import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {

  private static final String LOGIN_PAGE_HOST = "login.salesforce.com";

  private final WebDriver driver;
  private final WebDriverWait wait;

  @FindBy(xpath = "//input[@id='username']")
  private WebElement usernameInput;

  @FindBy(xpath = "//input[@id='password']")
  private WebElement passwordInput;

  @FindBy(xpath = "//input[@id='Login'] | //button[@id='Login']")
  private WebElement loginButton;

  @FindBy(xpath = "//label[@for='rememberUn']")
  private WebElement rememberLabel;

  @FindBy(xpath = "//input[@id='rememberUn']")
  private WebElement rememberCheckbox;

  @FindBy(xpath = "//div[@id='error']")
  private WebElement errorMessage;

  public LoginPage(WebDriver driver) {
    this.driver = driver;
    this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    PageFactory.initElements(driver, this);
  }

  public void enterUsername(String username) {
    try {
      wait.until(ExpectedConditions.visibilityOf(usernameInput));
      usernameInput.clear();
      usernameInput.sendKeys(username);
    } catch (WebDriverException e) {
      throw new RuntimeException("Unable to enter the username", e);
    }
  }

  public void enterPassword(String password) {
    try {
      wait.until(ExpectedConditions.visibilityOf(passwordInput));
      passwordInput.clear();
      passwordInput.sendKeys(password);
    } catch (WebDriverException e) {
      throw new RuntimeException("Unable to enter the password", e);
    }
  }

  public void toggleRememberMe(boolean enable) {
    try {
      wait.until(ExpectedConditions.elementToBeClickable(rememberLabel));
      if (rememberCheckbox.isSelected() != enable) {
        rememberLabel.click();
        wait.until(d -> rememberCheckbox.isSelected() == enable);
      }
    } catch (WebDriverException e) {
      throw new RuntimeException("Unable to toggle the 'Remember me' checkbox to " + enable, e);
    }
  }

  public void clickLogin() {
    try {
      wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
    } catch (WebDriverException e) {
      throw new RuntimeException("Unable to click the Log In button", e);
    }
  }

  public boolean login(String username, String password) {
    try {
      enterUsername(username);
      enterPassword(password);
      clickLogin();
    } catch (RuntimeException e) {
      throw new RuntimeException("Login failed while submitting the credentials", e);
    }
    try {
      wait.until(d -> {
        String url = d.getCurrentUrl();
        boolean leftLoginPage = url != null && !url.contains(LOGIN_PAGE_HOST);
        return leftLoginPage || isErrorDisplayed();
      });
    } catch (TimeoutException e) {
      return false;
    }
    if (isErrorDisplayed()) {
      return false;
    }
    String url = driver.getCurrentUrl();
    return url != null && !url.contains(LOGIN_PAGE_HOST);
  }

  public boolean isErrorDisplayed() {
    try {
      return errorMessage.isDisplayed();
    } catch (WebDriverException e) {
      return false;
    }
  }

  public String getErrorMessage() {
    try {
      if (!isErrorDisplayed()) {
        return "";
      }
      return errorMessage.getText();
    } catch (WebDriverException e) {
      throw new RuntimeException("Unable to read the login error message", e);
    }
  }
}
