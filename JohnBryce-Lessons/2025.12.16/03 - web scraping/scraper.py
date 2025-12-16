from playwright.sync_api import sync_playwright


# This is the main function to run the script
def run():
    with sync_playwright() as p:
        # Launch the browser (you can specify 'firefox', 'webkit', or 'webkit')
        browser = p.chromium.launch(headless=False)  # Set headless=False to see the browser
        page = browser.new_page()


        # Navigate to a website
        page.goto("https://example.com")
       
        # Take a screenshot
        page.screenshot(path="example_screenshot.png")
       
        # Extract the title of the page
        title = page.title()
        print(f"Page Title: {title}")
       
        # Optionally, you can extract the content of a specific element
        # For example, extracting the text inside a <h1> element:
        header_text = page.locator("h1").inner_text()
        print(f"Header Text: {header_text}")


        # Close the browser
        browser.close()


if __name__ == "__main__":
    run()