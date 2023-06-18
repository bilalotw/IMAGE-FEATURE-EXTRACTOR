from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from fe import extract_features
import concurrent.futures

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024 * 5  # 5GB limit
CORS(app)

from waitress import serve

@app.route("/", methods=['POST'])
def main():
    body = request.form.get("0")
    b_json = json.loads(body)
    files = b_json["files"]
    print("Processing received files...")

    if "extract" not in b_json or b_json["extract"] is None:
        extract = []
    else:
        extract = b_json["extract"]

    response = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=5000) as executor:
        dat = []
        for x in files:
            dat.append(
                executor.submit(
                    extract_features, x["dataURL"], extract
                )
            )

        for i, x in enumerate(files):
            filename = x["filename"]
            features = dat[i].result()
            response.append({"filename": filename, "features": features})
    print(response)
    return jsonify(response)


@app.route("/extractable", methods=['GET'])
def all_extractable():
    print("Requested all features!")
    all_features = [
        "aspect_ratio", "contrast", "correlation",
        "edge_density", "energy", "homogeneity",
        "max_intensity", "mean", "min_intensity",
        "perimeter", "std_dev", "variance", "x_center",
        "x_range", "x_std", "y_center", "y_range",
        "y_std","area", "dissimilarity", "entropy","skewness"
    ]
    all_features.sort()
    return jsonify(all_features)


if __name__ == "__main__":
    app.run()
