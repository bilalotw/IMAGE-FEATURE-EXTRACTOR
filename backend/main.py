from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from fe import extract_features
import concurrent.futures

app = Flask(__name__)
CORS(app)  # add this line to enable CORS


@app.route("/", methods=['POST'])
def main():
    body = request.data.decode('utf-8')
    b_json = json.loads(body)
    files = b_json["files"]

    if "extract" not in b_json or b_json["extract"] is None:
        extract = []
    else:
        extract = b_json["extract"]

    response = []

    with concurrent.futures.ThreadPoolExecutor() as executor:
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

    return jsonify(response)


@app.route("/extractable", methods=['GET'])
def all_extractable():
    all_features = [
        "aspect_ratio", "contrast", "correlation",
        "edge_density", "energy", "homogeneity",
        "max_intensity", "mean", "min_intensity",
        "perimeter", "std_dev", "variance", "x_center",
        "x_range", "x_std", "y_center", "y_range",
        "y_std"
    ]
    all_features.sort()
    print(all_features)
    return jsonify(all_features)


if __name__ == "__main__":
    app.run()
