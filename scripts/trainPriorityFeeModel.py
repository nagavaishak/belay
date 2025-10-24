# scripts/trainPriorityFeeModel.py
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

print("🚀 Training Priority Fee ML Model for BELAY...\n")

# Load data
print("📂 Loading transaction data...")
with open('data/labeled_transactions.json', 'r') as f:
    data = json.load(f)

print(f"✅ Loaded {len(data)} transactions\n")

# Convert to DataFrame
df = pd.DataFrame(data)

# Filter successful transactions with priority fee data
df_success = df[df['success'] == True].copy()
df_success = df_success[df_success['priorityFee'] > 0]  # Only txs that paid fees

print(f"✅ {len(df_success)} successful transactions with priority fees\n")

if len(df_success) < 20:
    print("❌ Not enough data! Need at least 20 transactions.")
    print("   Using fallback heuristic model...")
    exit(1)

# Feature engineering
print("📊 Engineering features...")

# Add program encoding
df_success['program_jupiter'] = (df_success['program'] == 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4').astype(int)
df_success['program_raydium'] = (df_success['program'] == '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8').astype(int)

# Feature columns
feature_columns = [
    'instructionCount',
    'accountCount',
    'dataSize',
    'networkCongestion',
    'program_jupiter',
    'program_raydium'
]

# If we have CU data, add it
if 'computeUnitsUsed' in df_success.columns:
    df_success['computeUnitsUsed'] = df_success['computeUnitsUsed'].fillna(df_success['computeUnitsUsed'].median())
    feature_columns.append('computeUnitsUsed')

# Prepare X and y
X = df_success[feature_columns].values
y = df_success['priorityFee'].values

print(f"Feature shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"Features: {feature_columns}\n")

# Handle small dataset
if len(X) < 30:
    print("⚠️ Small dataset - using 80/20 split with no validation")
    test_size = 0.2
else:
    test_size = 0.2

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=test_size, random_state=42
)

print(f"📊 Train: {len(X_train)} | Test: {len(X_test)}\n")

# Train model
print("🌳 Training Random Forest...")
model = RandomForestRegressor(
    n_estimators=50,  # Reduced for small dataset
    max_depth=10,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
print("✅ Training complete!\n")

# Evaluate
print("📈 Evaluating model...")
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\n📊 Model Performance:")
print(f"   Mean Absolute Error: {mae:.8f} SOL")
print(f"   R² Score: {r2:.3f}")
print(f"   Accuracy: {r2 * 100:.1f}%\n")

# Feature importance
print("🎯 Feature Importance:")
importance_df = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for _, row in importance_df.iterrows():
    print(f"   {row['feature']}: {row['importance']:.3f}")
print()

# Sample predictions
if len(X_test) > 0:
    print("🔍 Sample Predictions:")
    for i in range(min(5, len(X_test))):
        actual = y_test[i]
        predicted = y_pred[i]
        error = abs(actual - predicted)
        error_pct = (error / actual) * 100 if actual > 0 else 0
        print(f"   Actual: {actual:.8f} SOL | Predicted: {predicted:.8f} SOL | Error: {error_pct:.1f}%")
    print()

# Save model
os.makedirs('models', exist_ok=True)
model_path = 'models/priority_fee_model.pkl'
print(f"💾 Saving model to {model_path}...")
joblib.dump(model, model_path)

# Save metadata
metadata = {
    'model_type': 'RandomForestRegressor',
    'n_estimators': 50,
    'feature_columns': feature_columns,
    'train_samples': len(X_train),
    'test_samples': len(X_test),
    'mae': float(mae),
    'r2_score': float(r2),
    'accuracy_percent': float(r2 * 100),
    'trained_on_transactions': len(df_success)
}

metadata_path = 'models/priority_fee_metadata.json'
print(f"💾 Saving metadata to {metadata_path}...")
with open(metadata_path, 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n🎉 Priority Fee Model Training Complete!")
print(f"   Model: {model_path}")
print(f"   Metadata: {metadata_path}")
print(f"\n✅ Ready for hackathon demo!")