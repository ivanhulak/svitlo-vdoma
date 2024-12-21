from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time
import json
import random

def random_delay(min_seconds, max_seconds):
    delay = random.uniform(min_seconds, max_seconds)
    time.sleep(delay)

options = Options()
user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
]

options.add_argument(f'user-agent={random.choice(user_agents)}')
options.add_argument('--disable-blink-features=AutomationControlled')

def constructProductsArray(elements, category):
    product_details_list = []
    for product in elements:
        try:
            name = product.find_element(By.CSS_SELECTOR, 'a.prdl-item__name').text
            price = float(product.find_element(By.CSS_SELECTOR, 'div.products-list-item-price__actions-price-current').text[:-1].replace(" ", ""))
            # rate = float(product.find_element(By.CSS_SELECTOR, 'div.rating-number-box__value').text)
            try:
                rate = float(product.find_element(By.CSS_SELECTOR, 'div.rating-number-box__value').text)
            except:
                rate = 0.0
                print("Rate element not found, setting rate to 0.0")
            commentsCount = float(product.find_element(By.CSS_SELECTOR, 'div.prdl-item__reviews').text)
            product_details = {
                'name': name,
                'price': price,
                'rate': rate,
                'commentsCount': commentsCount,
                'category': category
            }
            product_details_list.append(product_details)
        except Exception as e:
            print(f"An error occurred: {e}")
    return product_details_list

##
driver = webdriver.Chrome(options=options)

# category_url = 'https://comfy.ua/ua/solar-panels'
# category_name = category_url.rstrip('/').split('/')[-1]

# driver.get(category_url)

# for _ in range(5):
#     driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)

# product_elements = driver.find_elements(By.CSS_SELECTOR, 'div.products-catalog-grid__item')

# products_list = constructProductsArray(product_elements, category_name)

category_url = 'https://comfy.ua/ua/lantern'
category_name = category_url.rstrip('/').split('/')[-1]

driver.get(category_url)

for _ in range(5):
    driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)

product_elements = driver.find_elements(By.CSS_SELECTOR, 'div.products-catalog-grid__item')

products_list=constructProductsArray(product_elements, category_name)

# category_url = 'https://comfy.ua/ua/istochnik-b-p'
# category_name = category_url.rstrip('/').split('/')[-1]

# driver.get(category_url)

# for _ in range(5):
#     driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)

# product_elements = driver.find_elements(By.CSS_SELECTOR, 'div.products-catalog-grid__item')

# products_list+= constructProductsArray(product_elements, category_name)

driver.quit()
##

def sort_products_by_popularity(products, limit=20):
    def calculate_popularity(product):
        return (product['rate'] * 2) + product['commentsCount'] - (product['price'] * 0.1)

    sorted_products = sorted(products, key=calculate_popularity, reverse=True)

    return sorted_products[:limit]

print(products_list)

with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(sort_products_by_popularity(products_list), f, ensure_ascii=False, indent=4)

print("Scraping completed. Product details saved to products.json")
