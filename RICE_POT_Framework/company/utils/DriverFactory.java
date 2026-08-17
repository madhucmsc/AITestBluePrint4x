package com.company.utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import io.github.bonigarcia.wdm.WebDriverManager;

public class DriverFactory {
  private static final ThreadLocal<WebDriver> TL_DRIVER = new ThreadLocal<>();

  public static WebDriver createDriver() {
    if (TL_DRIVER.get() == null) {
      WebDriverManager.chromedriver().setup();
      ChromeOptions options = new ChromeOptions();
      options.addArguments("--start-maximized");
      TL_DRIVER.set(new ChromeDriver(options));
    }
    return TL_DRIVER.get();
  }

  public static WebDriver getDriver() {
    return TL_DRIVER.get();
  }

  public static void quitDriver() {
    WebDriver driver = TL_DRIVER.get();
    if (driver != null) {
      try {
        driver.quit();
      } catch (Exception e) {
      }
      TL_DRIVER.remove();
    }
  }
}
