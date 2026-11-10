package com.company.utils;

import java.util.Objects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import io.github.bonigarcia.wdm.WebDriverManager;

public final class DriverFactory {

  private static final ThreadLocal<WebDriver> DRIVERS = new ThreadLocal<>();

  private DriverFactory() {
  }

  public static WebDriver createDriver() {
    WebDriver existing = DRIVERS.get();
    if (existing != null) {
      return existing;
    }
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--start-maximized");
    DRIVERS.set(new ChromeDriver(options));
    return DRIVERS.get();
  }

  public static WebDriver getDriver() {
    return Objects.requireNonNull(DRIVERS.get(),
        "WebDriver has not been created; call DriverFactory.createDriver() first");
  }

  public static void quitDriver() {
    WebDriver driver = DRIVERS.get();
    if (driver == null) {
      return;
    }
    try {
      driver.quit();
    } finally {
      DRIVERS.remove();
    }
  }
}
