import requests
from bs4 import BeautifulSoup


def scrape_tel_aviv_weather():
    url = "https://www.timeanddate.com/weather/israel/tel-aviv"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
   
    # Send an HTTP GET request to the URL with custom headers
    response = requests.get(url, headers=headers)
   
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")
       
        # Find all post titles on the page
        post_titles = soup.find_all("div", class_="h2")
       
        # Extract and print the titles
        for idx, title in enumerate(post_titles, 1):
            print(f"{idx}. {title.text.strip()}")
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")


if __name__ == "__main__":
    scrape_tel_aviv_weather()
