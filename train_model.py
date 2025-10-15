import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_crop_model():
    print("Starting model training...")
    
    # Load dataset
    data_path = os.path.join('..', 'data', 'Crop_recommendation.csv')
    df = pd.read_csv(data_path)
    
    print(f"Dataset loaded: {df.shape[0]} samples, {df.shape[1]} features")
    print(f"Crops in dataset: {df['label'].unique()}")
    
    # Features and target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nTraining set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # Train Random Forest model
    print("\nTraining Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"\nModel Training Complete!")
    print(f"Training Accuracy: {train_score * 100:.2f}%")
    print(f"Testing Accuracy: {test_score * 100:.2f}%")
    
    # Predictions
    y_pred = model.predict(X_test)
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Save model
    model_path = 'crop_model.pkl'
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")
    
    return model, test_score

if __name__ == '__main__':
    model, accuracy = train_crop_model()
    print(f"\n✓ Model training completed with {accuracy*100:.2f}% accuracy")