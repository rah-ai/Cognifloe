"""
Train Real ML Models for CogniFloe Workflow Predictions
Uses scikit-learn RandomForest trained on synthetic workflow data
"""

import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score, r2_score
from pathlib import Path

MODEL_DIR = Path(__file__).parent / "trained_models"
MODEL_DIR.mkdir(exist_ok=True)

np.random.seed(42)


def generate_synthetic_data(n_samples=5000):
    """Generate realistic synthetic workflow data for training"""
    
    # Features: word_count, complexity_keywords, agent_count, step_count, historical_avg_time
    word_counts = np.random.randint(3, 80, n_samples)
    complexity_keywords = np.random.randint(0, 6, n_samples)
    agent_counts = np.random.randint(1, 15, n_samples)
    step_counts = np.random.randint(1, 25, n_samples)
    historical_avg_times = np.random.uniform(0.5, 10.0, n_samples)
    confidence_scores = np.random.uniform(0.4, 1.0, n_samples)
    workflow_age_days = np.random.randint(1, 365, n_samples)
    agent_performance = np.random.uniform(0.5, 1.0, n_samples)
    
    X = np.column_stack([
        word_counts, complexity_keywords, agent_counts, step_counts,
        historical_avg_times, confidence_scores, workflow_age_days, agent_performance
    ])
    
    # Target 1: Completion time (hours) - realistic formula with noise
    base_time = (
        0.3 * complexity_keywords +        # complexity adds time
        0.15 * step_counts +                # more steps = more time
        0.5 * historical_avg_times +        # historical baseline matters most
        0.02 * word_counts -                # longer descriptions = more complex
        0.08 * agent_counts +               # more agents = slightly faster (parallelism)
        0.1 * (1 - agent_performance) * 10  # poor performance = more time
    )
    noise = np.random.normal(0, 0.3, n_samples)
    completion_times = np.maximum(0.5, base_time + noise)
    
    # Target 2: Success (binary) - realistic probability
    success_logit = (
        2.0 * confidence_scores +
        1.5 * agent_performance +
        0.005 * workflow_age_days -
        0.3 * complexity_keywords -
        0.05 * step_counts -
        0.01 * word_counts +
        0.02 * agent_counts
    )
    success_prob = 1 / (1 + np.exp(-success_logit + 2))
    success_labels = (np.random.random(n_samples) < success_prob).astype(int)
    
    return X, completion_times, success_labels, success_prob


def train_time_model(X, y):
    """Train RandomForest + GradientBoosting ensemble for completion time prediction"""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # RandomForest
    rf = RandomForestRegressor(
        n_estimators=100, max_depth=12, min_samples_split=5,
        random_state=42, n_jobs=-1
    )
    rf.fit(X_train, y_train)
    
    # GradientBoosting
    gb = GradientBoostingRegressor(
        n_estimators=100, max_depth=6, learning_rate=0.1,
        random_state=42
    )
    gb.fit(X_train, y_train)
    
    # Evaluate
    rf_pred = rf.predict(X_test)
    gb_pred = gb.predict(X_test)
    ensemble_pred = 0.6 * rf_pred + 0.4 * gb_pred
    
    print(f"  RandomForest MAE: {mean_absolute_error(y_test, rf_pred):.3f}h, R²: {r2_score(y_test, rf_pred):.3f}")
    print(f"  GradientBoosting MAE: {mean_absolute_error(y_test, gb_pred):.3f}h, R²: {r2_score(y_test, gb_pred):.3f}")
    print(f"  Ensemble MAE: {mean_absolute_error(y_test, ensemble_pred):.3f}h, R²: {r2_score(y_test, ensemble_pred):.3f}")
    
    return rf, gb


def train_success_model(X, y):
    """Train RandomForest classifier for success prediction"""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(
        n_estimators=100, max_depth=10, min_samples_split=5,
        random_state=42, n_jobs=-1
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    print(f"  Success Classifier Accuracy: {accuracy_score(y_test, y_pred):.3f}")
    
    return clf


def main():
    print("=" * 50)
    print("CogniFloe ML Model Training Pipeline")
    print("=" * 50)
    
    print("\n1. Generating synthetic workflow data (5000 samples)...")
    X, completion_times, success_labels, success_probs = generate_synthetic_data(5000)
    print(f"   Features shape: {X.shape}")
    print(f"   Completion time range: {completion_times.min():.2f}h - {completion_times.max():.2f}h")
    print(f"   Success rate: {success_labels.mean():.1%}")
    
    print("\n2. Training Time Prediction Models...")
    rf_time, gb_time = train_time_model(X, completion_times)
    
    print("\n3. Training Success Classifier...")
    success_clf = train_success_model(X, success_labels)
    
    print("\n4. Saving trained models...")
    joblib.dump(rf_time, MODEL_DIR / "rf_time_model.joblib")
    joblib.dump(gb_time, MODEL_DIR / "gb_time_model.joblib")
    joblib.dump(success_clf, MODEL_DIR / "success_classifier.joblib")
    
    # Save feature names for reference
    feature_names = [
        "word_count", "complexity_keywords", "agent_count", "step_count",
        "historical_avg_time", "confidence_score", "workflow_age_days", "agent_performance"
    ]
    joblib.dump(feature_names, MODEL_DIR / "feature_names.joblib")
    
    # Print feature importances
    print("\n5. Feature Importances (Time Prediction):")
    for name, imp in sorted(zip(feature_names, rf_time.feature_importances_), key=lambda x: -x[1]):
        print(f"   {name:25s}: {imp:.3f} {'█' * int(imp * 50)}")
    
    print("\n   Feature Importances (Success Prediction):")
    for name, imp in sorted(zip(feature_names, success_clf.feature_importances_), key=lambda x: -x[1]):
        print(f"   {name:25s}: {imp:.3f} {'█' * int(imp * 50)}")
    
    print(f"\n✅ Models saved to: {MODEL_DIR}")
    print("=" * 50)


if __name__ == "__main__":
    main()
