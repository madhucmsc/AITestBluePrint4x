package com.company.base;

import com.company.utils.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

import java.time.Duration;

public class BaseTest {
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
    } catch (Exception e) {
      DriverFactory.quitDriver();
      throw e;
    }
  }

  @AfterTest
  public void tearDown() {
    try {
      DriverFactory.quitDriver();
    } catch (Exception e) {
    }
  }
}
