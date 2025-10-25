# scripts/predictSuccess.py
import sys
import json
import joblib
import numpy as np

# Load model
model = joblib.load('models/success_classifier.pkl')

# Load metadata for feature order
with open('models/success_classifier_metadata.json', 'r') as f:
    metadata = json.load(f)

feature_columns = metadata['feature_columns']

# Parse input
input_data = json.loads(sys.argv[1])

# Build feature vector
features = []
for col in feature_columns:
    if col == 'program_jupiter':
        features.append(1 if 'JUP6' in input_data.get('programId', '') else 0)
    elif col == 'program_raydium':
        features.append(1 if '675k' in input_data.get('programId', '') else 0)
    else:
        features.append(input_data.get(col, 0))

# Predict
prediction = model.predict([features])[0]
probability = model.predict_proba([features])[0]

# Output
result = {
    'will_succeed': bool(prediction),
    'confidence': float(probability[1]) if prediction else float(probability[0])
}

print(json.dumps(result))