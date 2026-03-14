import sys
import cv2
import json
from paddleocr import PaddleOCR

# Load OCR model only once
ocr = PaddleOCR(lang="en", show_log=False)

image_path = sys.argv[1]

img = cv2.imread(image_path)

result = ocr.ocr(img)

text_list = []

if result:
    for line in result:
        for word in line:
            text_list.append(word[1][0])

# Clean text
clean_text = "\n".join(text_list)

print(clean_text)