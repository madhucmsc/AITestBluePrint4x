package com.company.base;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

import com.company.utils.DriverFactory;

public abstract class BaseTest {

  protected WebDriver driver;
  protected WebDriverWait wait;

  @BeforeTest
  public void setUp() {
    try {
      driver = DriverFactory.createDriver();
      driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
      wait = new WebDriverWait(driver, Duration.ofSeconds(20));
      String baseUrl = System.getProperty("baseUrl", "https://login.salesforce.com/?locale=in");
      driver.get(baseUrl);
    } catch (RuntimeException e) {
      DriverFactory.quitDriver();
      throw e;
    }
  }

  @AfterTest
  public void tearDown() {
    try {
      DriverFactory.quitDriver();
    } catch (RuntimeException e) {
      throw new RuntimeException("Failed to quit the WebDriver during teardown", e);
    }
  }
}
