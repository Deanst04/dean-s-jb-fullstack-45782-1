from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.common.keys import Keys


driver = webdriver.Chrome()
driver.get("http://127.0.0.1:5500/driver.html")
time.sleep(2)


# Get all anchor elements
email = driver.find_element(By.ID, "email")
# Clear any pre-filled text (optional)
email.clear()
time.sleep(2)
# Type a new email into the input field
email.send_keys("waga@com")


# Get all anchor elements
password = driver.find_element(By.ID, "password")
# Clear any pre-filled text (optional)
password.clear()
time.sleep(1)
# Type a new pas into the input field
password.send_keys("123456")


# Find the driver button and click it
button = driver.find_element(By.ID, "driverButton")  # You need to replace "driver-button" with the actual ID or class of your driver button
button.click()
time.sleep(5)
driver.quit()
