import requests
from bs4 import BeautifulSoup


def scrape_tel_aviv_weather():
    url = "https://www.timeanddate.com/weather/israel"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
   
    # Send an HTTP GET request to the URL with custom headers
    response = requests.get(url, headers=headers)
   
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")
       
        # Find all post titles on the page
        elements_by_class = soup.find_all(class_="rbi")
        a_elements = soup.find_all("a", href=lambda h: h and h.startswith("/weather/israel/"))
       
        # Extract and print the titles
        for city, temp in zip(a_elements, elements_by_class):
            city_name = city.get_text(strip=True)
            temperature = temp.get_text(strip=True)

            print(f"{city_name} → {temperature}")
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")


if __name__ == "__main__":
    scrape_tel_aviv_weather()
