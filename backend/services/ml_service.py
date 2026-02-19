"""
Enhanced ML Service with OpenAI GPT-4 Integration
Now includes real AI-powered NLP analysis and recommendations
"""

import numpy as np
from typing import Dict, Any, List, Optional
from datetime import datetime
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
# Try both backend/.env and root .env
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class AdvancedNLPAnalyzer:
    """GPT-4 powered NLP analysis for workflows"""
    
    @staticmethod
    def analyze_complexity_with_gpt(description: str, step_count: int) -> Dict[str, Any]:
        """
        Use GPT-4 to analyze workflow complexity with deep understanding
        
        Returns:
            {
                'complexity_score': float (0-1),
                'complexity_level': str,
                'key_challenges': List[str],
                'recommendation': str
            }
        """
        try:
            prompt = f"""Analyze this workflow description and provide complexity assessment:

Workflow: "{description}"
Number of steps: {step_count}

Please provide:
1. Complexity score (0.0 to 1.0, where 1.0 is most complex)
2. Complexity level (Simple/Moderate/Complex/Very Complex)
3. Key challenges (list 2-3 main challenges)
4. Brief optimization recommendation

Respond in JSON format:
{{
  "complexity_score": 0.0,
  "complexity_level": "...",
  "key_challenges": ["...", "..."],
  "recommendation": "..."
}}"""
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert workflow analyst. Provide concise, actionable insights in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback to heuristic if API fails
            print(f"GPT-4 analysis failed: {e}")
            return {
                'complexity_score': min(len(description.split()) / 100 + step_count / 20, 1.0),
                'complexity_level': 'Moderate',
                'key_challenges': ['Data validation', 'Process coordination'],
                'recommendation': 'Consider breaking into smaller sub-workflows'
            }
    
    @staticmethod
    def generate_smart_recommendations(workflow_data: Dict[str, Any]) -> List[str]:
        """Generate AI-powered optimization recommendations"""
        try:
            prompt = f"""Given this workflow analysis:
- Success Probability: {workflow_data.get('success_prob', 0.85):.1%}
- Completion Time: {workflow_data.get('predicted_hours', 3)} hours
- Agent Count: {workflow_data.get('agent_count', 2)}
- Risk Level: {workflow_data.get('risk_level', 'Medium')}

Provide 3 specific, actionable recommendations to improve this workflow. Be concise.

Format as JSON array: ["recommendation 1", "recommendation 2", "recommendation 3"]"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a workflow optimization expert. Provide specific, actionable advice."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=200
            )
            
            import json
            recommendations = json.loads(response.choices[0].message.content)
            return recommendations
            
        except Exception as e:
            print(f"GPT-4 recommendations failed: {e}")
            return [
                "Add checkpoints for incremental validation",
                "Consider parallel agent execution",
                "Implement automated error recovery"
            ]


class PredictiveModel:
    """ML model for workflow predictions - Uses REAL trained scikit-learn models"""
    
    def __init__(self):
        self.nlp_analyzer = AdvancedNLPAnalyzer()
        self.rf_time = None
        self.gb_time = None
        self.success_clf = None
        self.models_loaded = False
        self._load_models()
        
        # Fallback weights (used only if models fail to load)
        self.time_model_weights = {
            'complexity': 0.45,
            'agent_count': 0.25,
            'historical_avg': 0.20,
            'step_count': 0.10
        }
        self.success_model_weights = {
            'confidence_score': 0.40,
            'workflow_age': 0.20,
            'agent_performance': 0.25,
            'complexity_score': 0.15
        }
    
    def _load_models(self):
        """Load trained ML models from disk"""
        try:
            import joblib
            model_dir = Path(__file__).parent.parent / "ml" / "trained_models"
            
            if (model_dir / "rf_time_model.joblib").exists():
                self.rf_time = joblib.load(model_dir / "rf_time_model.joblib")
                self.gb_time = joblib.load(model_dir / "gb_time_model.joblib")
                self.success_clf = joblib.load(model_dir / "success_classifier.joblib")
                self.models_loaded = True
                print(f"✅ Real ML models loaded from {model_dir}")
            else:
                print(f"⚠️ No trained models found at {model_dir}, using heuristic fallback")
        except Exception as e:
            print(f"⚠️ Failed to load ML models: {e}, using heuristic fallback")
    
    def _extract_features(self, description: str, agent_count: int, step_count: int,
                          historical_avg_time: float, confidence_score: float = 0.8,
                          workflow_age_days: int = 30, agent_performance: float = 0.85) -> list:
        """Extract feature vector for ML model input"""
        word_count = len(description.split())
        
        complexity_keywords = ['complex', 'multiple', 'integration', 'advanced', 'critical',
                               'extract', 'validate', 'monitor', 'real-time', 'security']
        keyword_count = sum(1 for word in complexity_keywords if word in description.lower())
        
        return [word_count, keyword_count, agent_count, step_count,
                historical_avg_time, confidence_score, workflow_age_days, agent_performance]
    
    def _calculate_complexity(self, description: str, step_count: int, use_gpt: bool = True) -> tuple:
        """Calculate workflow complexity with optional GPT-4 enhancement"""
        if use_gpt and os.getenv("OPENAI_API_KEY"):
            gpt_analysis = self.nlp_analyzer.analyze_complexity_with_gpt(description, step_count)
            return gpt_analysis['complexity_score'], gpt_analysis
        else:
            word_count = len(description.split())
            complexity_keywords = ['complex', 'multiple', 'integration', 'advanced', 'critical']
            keyword_count = sum(1 for word in complexity_keywords if word in description.lower())
            
            base_complexity = min(word_count / 50, 1.0)
            keyword_bonus = keyword_count * 0.1
            step_penalty = min(step_count / 20, 0.5)
            
            score = min(base_complexity + keyword_bonus + step_penalty, 1.0)
            return score, None
    
    def predict_completion_time(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict workflow completion time using REAL trained ML models"""
        description = workflow_data.get('description', '')
        agent_count = workflow_data.get('agent_count', 1)
        step_count = workflow_data.get('step_count', 5)
        historical_avg = workflow_data.get('historical_avg_time', 2.0)
        
        if self.models_loaded:
            # USE REAL ML MODELS
            features = self._extract_features(
                description, agent_count, step_count, historical_avg
            )
            feature_array = np.array([features])
            
            # Ensemble prediction: 60% RandomForest + 40% GradientBoosting
            rf_pred = self.rf_time.predict(feature_array)[0]
            gb_pred = self.gb_time.predict(feature_array)[0]
            predicted_hours = 0.6 * rf_pred + 0.4 * gb_pred
            predicted_hours = max(0.5, predicted_hours)
            
            # Feature importances from the model
            feature_names = ["word_count", "complexity_keywords", "agent_count", "step_count",
                           "historical_avg_time", "confidence_score", "workflow_age_days", "agent_performance"]
            importances = dict(zip(feature_names, self.rf_time.feature_importances_))
            
            uncertainty = 0.12 * predicted_hours
            confidence = 0.82 + min(historical_avg, 10) / 50
            
            result = {
                'predicted_hours': round(predicted_hours, 2),
                'confidence': round(min(confidence, 0.95), 3),
                'range': {
                    'min': round(max(predicted_hours - uncertainty, 0.5), 2),
                    'max': round(predicted_hours + uncertainty, 2)
                },
                'factors': {
                    'complexity_impact': round(importances.get('complexity_keywords', 0) * 10, 2),
                    'agent_impact': round(-importances.get('agent_count', 0) * agent_count * 0.3, 2),
                    'historical_baseline': round(historical_avg, 2)
                },
                'model_type': 'RandomForest + GradientBoosting Ensemble (scikit-learn)'
            }
        else:
            # FALLBACK: Heuristic model
            complexity, gpt_insights = self._calculate_complexity(description, step_count, use_gpt=True)
            features = {
                'complexity': complexity * 10,
                'agent_count': agent_count * 0.5,
                'historical_avg': historical_avg,
                'step_count': step_count * 0.3
            }
            predicted_hours = sum(features[key] * self.time_model_weights[key] for key in self.time_model_weights)
            uncertainty = 0.15 * predicted_hours
            confidence = 0.75 + (min(historical_avg, 10) / 40)
            
            result = {
                'predicted_hours': round(predicted_hours, 2),
                'confidence': round(confidence, 3),
                'range': {
                    'min': round(max(predicted_hours - uncertainty, 0.5), 2),
                    'max': round(predicted_hours + uncertainty, 2)
                },
                'factors': {
                    'complexity_impact': round(features['complexity'], 2),
                    'agent_impact': round(-features['agent_count'] * 0.3, 2),
                    'historical_baseline': round(features['historical_avg'], 2)
                },
                'model_type': 'Heuristic (fallback)'
            }
            
            if gpt_insights:
                result['ai_insights'] = {
                    'complexity_level': gpt_insights['complexity_level'],
                    'key_challenges': gpt_insights['key_challenges'],
                    'gpt_recommendation': gpt_insights['recommendation']
                }
        
        return result
    
    def predict_success_probability(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict workflow success probability using REAL trained classifier"""
        confidence_scores = workflow_data.get('confidence_scores', [0.8])
        workflow_age = workflow_data.get('workflow_age_days', 30)
        agent_perf = workflow_data.get('agent_performance_avg', 0.85)
        description = workflow_data.get('description', '')
        step_count = workflow_data.get('step_count', 5)
        agent_count = workflow_data.get('agent_count', 2)
        historical_avg = workflow_data.get('historical_avg_time', 2.0)
        
        avg_confidence = float(np.mean(confidence_scores)) if confidence_scores else 0.8
        
        if self.models_loaded:
            # USE REAL ML CLASSIFIER
            features = self._extract_features(
                description, agent_count, step_count, historical_avg,
                avg_confidence, workflow_age, agent_perf
            )
            feature_array = np.array([features])
            
            # Get probability from classifier
            proba = self.success_clf.predict_proba(feature_array)[0]
            success_prob = float(proba[1]) if len(proba) > 1 else float(proba[0])
            success_prob = max(0.1, min(success_prob, 0.99))
            
            model_type = 'RandomForest Classifier (scikit-learn)'
        else:
            # FALLBACK: Weighted heuristic
            complexity, _ = self._calculate_complexity(description, step_count, use_gpt=False)
            age_factor = min(workflow_age / 90, 1.0)
            features_dict = {
                'confidence_score': avg_confidence,
                'workflow_age': age_factor,
                'agent_performance': agent_perf,
                'complexity_score': 1 - complexity
            }
            success_prob = sum(features_dict[key] * self.success_model_weights[key] for key in self.success_model_weights)
            success_prob = max(0.1, min(success_prob, 0.99))
            model_type = 'Heuristic (fallback)'
        
        # Risk assessment
        if success_prob >= 0.85:
            risk_level = 'Low'
        elif success_prob >= 0.70:
            risk_level = 'Medium'
        else:
            risk_level = 'High'
        
        # Risk factors analysis
        risk_factors = []
        if avg_confidence < 0.7:
            risk_factors.append({
                'factor': 'Low Agent Confidence',
                'impact': 'High',
                'value': round(avg_confidence, 2)
            })
        
        complexity_score, _ = self._calculate_complexity(description, step_count, use_gpt=False)
        if complexity_score > 0.7:
            risk_factors.append({
                'factor': 'High Complexity',
                'impact': 'Medium',
                'value': round(complexity_score, 2)
            })
        if agent_perf < 0.75:
            risk_factors.append({
                'factor': 'Low Agent Performance',
                'impact': 'High',
                'value': round(agent_perf, 2)
            })
        
        result = {
            'success_probability': round(success_prob, 3),
            'risk_level': risk_level,
            'confidence': round(0.80 + (min(workflow_age / 90, 1.0) * 0.15), 3),
            'risk_factors': risk_factors,
            'contributing_factors': {
                'agent_confidence': round(avg_confidence, 2),
                'workflow_maturity': round(min(workflow_age / 90, 1.0), 2),
                'agent_performance': round(agent_perf, 2)
            },
            'model_type': model_type
        }
        
        # Add GPT-4 recommendations if API key available
        if os.getenv("OPENAI_API_KEY"):
            try:
                recommendations = self.nlp_analyzer.generate_smart_recommendations({
                    'success_prob': success_prob,
                    'predicted_hours': workflow_data.get('predicted_hours', 3),
                    'agent_count': agent_count,
                    'risk_level': risk_level
                })
                result['ai_recommendations'] = recommendations
            except Exception as e:
                print(f"Failed to generate AI recommendations: {e}")
        
        return result


class AnomalyDetector:
    """Anomaly detection for workflow patterns"""
    
    def __init__(self):
        self.baseline_metrics = {
            'avg_completion_time': 3.5,
            'std_completion_time': 1.2,
            'avg_agent_count': 2.5,
            'std_agent_count': 0.8,
            'success_rate': 0.92
        }
    
    def detect_anomalies(self, workflow_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Detect anomalies with z-score analysis"""
        completion_time = workflow_metrics.get('completion_time', 3.0)
        agent_count = workflow_metrics.get('agent_count', 2)
        success_rate = workflow_metrics.get('success_rate', 0.9)
        error_count = workflow_metrics.get('error_count', 0)
        
        anomalies = []
        anomaly_scores = []
        
        # Time anomaly
        time_z_score = abs(
            (completion_time - self.baseline_metrics['avg_completion_time']) /
            self.baseline_metrics['std_completion_time']
        )
        if time_z_score > 2:
            anomalies.append({
                'type': 'Abnormal Completion Time',
                'severity': 'High' if time_z_score > 3 else 'Medium',
                'details': f'Completion time {completion_time}h is {time_z_score:.1f}σ from baseline',
                'baseline': self.baseline_metrics['avg_completion_time']
            })
            anomaly_scores.append(min(time_z_score / 3, 1.0))
        
        # Agent count anomaly
        agent_z_score = abs(
            (agent_count - self.baseline_metrics['avg_agent_count']) /
            self.baseline_metrics['std_agent_count']
        )
        if agent_z_score > 2:
            anomalies.append({
                'type': 'Unusual Agent Count',
                'severity': 'Low',
                'details': f'Agent count {agent_count} deviates from typical {self.baseline_metrics["avg_agent_count"]:.1f}',
                'baseline': self.baseline_metrics['avg_agent_count']
            })
            anomaly_scores.append(min(agent_z_score / 4, 0.5))
        
        # Success rate anomaly
        if success_rate < 0.7:
            anomalies.append({
                'type': 'Low Success Rate',
                'severity': 'Critical' if success_rate < 0.5 else 'High',
                'details': f'Success rate {success_rate:.1%} is critically low',
                'baseline': self.baseline_metrics['success_rate']
            })
            anomaly_scores.append(1 - success_rate)
        
        # Error count
        if error_count > 5:
            anomalies.append({
                'type': 'High Error Count',
                'severity': 'Critical' if error_count > 10 else 'High',
                'details': f'{error_count} errors detected',
                'baseline': 0
            })
            anomaly_scores.append(min(error_count / 15, 1.0))
        
        overall_score = np.mean(anomaly_scores) if anomaly_scores else 0.0
        
        if overall_score > 0.7:
            severity = 'Critical'
        elif overall_score > 0.4:
            severity = 'High'
        elif overall_score > 0.2:
            severity = 'Medium'
        else:
            severity = 'Low'
        
        return {
            'is_anomaly': len(anomalies) > 0,
            'anomaly_score': round(overall_score, 3),
            'anomalies_detected': anomalies,
            'severity': severity,
            'timestamp': workflow_metrics.get('timestamp', datetime.now().isoformat()),
            'recommendation': self._get_recommendation(anomalies) if anomalies else None
        }
    
    def _get_recommendation(self, anomalies: List[Dict]) -> str:
        """Generate recommendation"""
        severity_count = sum(1 for a in anomalies if a['severity'] in ['Critical', 'High'])
        
        if severity_count >= 2:
            return "Immediate investigation required. Multiple critical issues detected."
        elif severity_count == 1:
            return "Review workflow configuration and agent performance."
        else:
            return "Monitor workflow for recurring patterns."


# Singleton instances
predictive_model = PredictiveModel()
anomaly_detector = AnomalyDetector()
