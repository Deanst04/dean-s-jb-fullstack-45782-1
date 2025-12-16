from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


driver = webdriver.Chrome()
driver.get("https://www.youtube.com/watch?v=l30Eb76Tk5s")
print("waiting for the video")
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.TAG_NAME, "video"))
)
print("the video loaded")
time.sleep(15)
print("stopped watching the video")
driver.find_element(By.TAG_NAME, "body").send_keys(Keys.SPACE)
print("hit space key")
driver.quit()

