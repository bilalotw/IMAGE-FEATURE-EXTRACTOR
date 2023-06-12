from io import BytesIO
from PIL import Image
import numpy as np
from skimage import feature
from skimage.feature import graycomatrix, graycoprops
from io import BytesIO
import base64


def extract_features(data_url, req=["mean"]):
    image_data = base64.b64decode(data_url.split(",")[1])

    with Image.open(BytesIO(image_data)) as img:
        gray = img.convert("L")
        gray_array = np.array(gray)

    features = {}

    if "mean" in req:
        mean = np.mean(gray)
        features["mean"] = mean

    if "std_dev" in req:
        std_dev = np.std(gray)
        features["std_dev"] = std_dev

    if "variance" in req:
        variance = np.var(gray)
        features["variance"] = variance

    if "min_intensity" in req:
        min_intensity = np.min(gray)
        features["min_intensity"] = str(min_intensity)

    if "max_intensity" in req:
        max_intensity = np.max(gray)
        features["max_intensity"] = str(max_intensity)

    width, height = img.size

    if "aspect_ratio" in req:
        aspect_ratio = width / height
        features["aspect_ratio"] = aspect_ratio

    area = width * height
    features["area"] = area

    bbox = img.getbbox()

    if "perimeter" in req:
        if bbox is None:
            perimeter = 0
        else:
            bbox_width = bbox[2] - bbox[0]
            bbox_height = bbox[3] - bbox[1]
            perimeter = 2 * (bbox_width + bbox_height)
        features["perimeter"] = perimeter

    edges = feature.canny(gray_array)

    if "edge_density" in req:
        edge_density = np.sum(edges) / area
        features["edge_density"] = edge_density

    glcm = graycomatrix(gray_array, [5], [0],
                        levels=256, symmetric=True, normed=True)

    if "contrast" in req:
        contrast = graycoprops(glcm, "contrast")[0, 0]
        features["contrast"] = contrast

    if "correlation" in req:
        correlation = graycoprops(glcm, "correlation")[0, 0]
        features["correlation"] = correlation

    if "energy" in req:
        energy = graycoprops(glcm, "energy")[0, 0]
        features["energy"] = energy

    if "homogeneity" in req:
        homogeneity = graycoprops(glcm, "homogeneity")[0, 0]
        features["homogeneity"] = homogeneity

    x, y = np.meshgrid(np.arange(width), np.arange(height))
    x_center = np.mean(x[gray_array > 0])
    y_center = np.mean(y[gray_array > 0])
    x_std = np.std(x[gray_array > 0])
    y_std = np.std(y[gray_array > 0])
    x_range = np.max(x[gray_array > 0]) - np.min(x[gray_array > 0])
    y_range = np.max(y[gray_array > 0]) - np.min(y[gray_array > 0])

    if "x_center" in req:
        features["x_center"] = x_center

    if "y_center" in req:
        features["y_center"] = y_center

    if "x_std" in req:
        features["x_std"] = x_std

    if "y_std" in req:
        features["y_std"] = y_std

    if "x_range" in req:
        features["x_range"] = str(x_range)

    if "y_range" in req:
        features["y_range"] = str(y_range)
    return features
