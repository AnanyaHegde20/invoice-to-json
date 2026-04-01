import sys
import cv2
import os
from paddleocr import PaddleOCR

image_path = sys.argv[1]

print("📂 Checking file:", image_path)
print("Exists:", os.path.exists(image_path))

# Read image
img = cv2.imread(image_path)

if img is None:
    print("❌ Image not loaded. Check path.")
    sys.exit(1)

# ✅ Resize SMALLER (reduce memory)
# img = cv2.resize(img, (400, 600))

# ✅ FIX: Use writable model directory
MODEL_DIR = "/home/appuser/.paddleocr"
os.makedirs(MODEL_DIR, exist_ok=True)

# ✅ LOW MEMORY + FIXED PATH OCR CONFIG
ocr = PaddleOCR(
    use_angle_cls=False,
    lang="en",
    show_log=False,
    use_gpu=False,
    det_model_dir=f"{MODEL_DIR}/whl/det",
    rec_model_dir=f"{MODEL_DIR}/whl/rec",
    cls_model_dir=f"{MODEL_DIR}/whl/cls"
)

# Run OCR
result = ocr.ocr(img, cls=False)

text_list = []

if result:
    for line in result:
        for word in line:
            text_list.append(word[1][0])

print("\n".join(text_list))

import gc
gc.collect()