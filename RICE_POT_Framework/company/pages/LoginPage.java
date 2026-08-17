package com.company.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.TimeoutException;
import java.time.Duration;

public class LoginPage {
  private final WebDriver driver;
  private final WebDriverWait wait;

  @FindBy(xpath = "(//input[@type='text' or @type='email' or contains(translate(@placeholder,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'email') or contains(translate(@placeholder,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'username')])[1]")
  private WebElement usernameInput;

  @FindBy(xpath = "(//input[@type='password'])[1]")
  private WebElement passwordInput;

  @FindBy(xpath = "(//button[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'log in') or //button[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'login')] | //input[@type='submit' and (contains(translate(@value,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'log') or contains(translate(@value,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'sign'))] )[1]")
  private WebElement loginButton;

  @FindBy(xpath = "//label[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'remember')]/input | (//input[@type='checkbox'])[1]")
  private WebElement rememberCheckbox;

  @FindBy(xpath = "(//*[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'incorrect') or contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'verify') or contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'error')])[1]")
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
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public void enterPassword(String password) {
    try {
      wait.until(ExpectedConditions.visibilityOf(passwordInput));
      passwordInput.clear();
      passwordInput.sendKeys(password);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public void toggleRememberMe(boolean enable) {
    try {
      wait.until(ExpectedConditions.elementToBeClickable(rememberCheckbox));
      if (rememberCheckbox.isSelected() != enable) {
        rememberCheckbox.click();
      }
    } catch (Exception e) {
      try {
        if (rememberCheckbox.isSelected() != enable) {
          rememberCheckbox.click();
        }
      } catch (Exception ex) {
        throw new RuntimeException(ex);
      }
    }
  }

  public void clickLogin() {
    try {
      wait.until(ExpectedConditions.elementToBeClickable(loginButton));
      loginButton.click();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public boolean login(String user, String pass) {
    try {
      enterUsername(user);
      enterPassword(pass);
      clickLogin();
      try {
        wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("login.salesforce.com")));
        return true;
      } catch (TimeoutException te) {
        return false;
      }
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public String getErrorMessage() {
    try {
      wait.until(ExpectedConditions.visibilityOf(errorMessage));
      return errorMessage.getText();
    } catch (Exception e) {
      return "";
    }
  }
}
