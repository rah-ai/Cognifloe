"""
AI-Powered Workflow Analysis Engine
Analyzes workflows for complexity, bottlenecks, optimization opportunities, and risks
"""

import re
from typing import Dict, List, Any
from datetime import datetime

class WorkflowAnalyzer:
    """Advanced workflow analysis engine"""
    
    def __init__(self):
        # Keywords that indicate complexity
        self.complexity_keywords = {
            'high': ['integrate', 'synchronize', 'parallel', 'coordinate', 'orchestrate', 'complex', 'multiple'],
            'medium': ['process', 'transform', 'validate', 'filter', 'analyze', 'calculate'],
            'low': ['send', 'receive', 'store', 'retrieve', 'display', 'show']
        }
        
        # Bottleneck indicators
        self.bottleneck_indicators = [
            'manual', 'approval', 'review', 'wait', 'queue', 'pending', 'human', 'verify'
        ]
        
        # Risk indicators
        self.risk_keywords = [
            'critical', 'sensitive', 'security', 'compliance', 'regulation', 'legal', 'financial'
        ]
    
    def analyze_workflow(self, workflow_description: str, workflow_steps: List[str] = None) -> Dict[str, Any]:
        """
        Comprehensive workflow analysis
        
        Args:
            workflow_description: Natural language description of workflow
            workflow_steps: List of workflow steps (optional)
        
        Returns:
            Complete analysis results dictionary
        """
        description_lower = workflow_description.lower()
        steps = workflow_steps or []
        
        # Run all analysis components
        complexity = self._analyze_complexity(description_lower, steps)
        bottlenecks = self._detect_bottlenecks(description_lower, steps)
        optimizations = self._suggest_optimizations(description_lower, steps, bottlenecks)
        cost_benefit = self._estimate_cost_benefit(complexity, len(steps))
        risks = self._analyze_risks(description_lower, steps)
        
        return {
            'complexity': complexity,
            'bottlenecks': bottlenecks,
            'optimizations': optimizations,
            'cost_benefit': cost_benefit,
            'risks': risks,
            'overall_score': self._calculate_overall_score(complexity, bottlenecks, risks),
            'analyzed_at': datetime.now().isoformat()
        }
    
    def _analyze_complexity(self, description: str, steps: List[str]) -> Dict[str, Any]:
        """Analyze workflow complexity"""
        score = 0
        factors = []
        
        # Step count complexity
        if len(steps) > 10:
            score += 3
            factors.append("High step count (>10 steps)")
        elif len(steps) > 5:
            score += 2
            factors.append("Medium step count (6-10 steps)")
        else:
            score += 1
        
        # Keyword-based complexity
        for level, keywords in self.complexity_keywords.items():
            matches = sum(1 for kw in keywords if kw in description)
            if level == 'high':
                score += matches * 0.5
                if matches > 0:
                    factors.append(f"Contains {matches} high-complexity indicators")
            elif level == 'medium':
                score += matches * 0.3
            else:
                score += matches * 0.1
        
        # Normalize score to 1-10
        complexity_score = min(10, max(1, int(score)))
        
        # Determine level
        if complexity_score >= 8:
            level = "Very High"
            color = "#EF4444"  # red
        elif complexity_score >= 6:
            level = "High"
            color = "#F59E0B"  # orange
        elif complexity_score >= 4:
            level = "Medium"
            color = "#3B82F6"  # blue
        else:
            level = "Low"
            color = "#10B981"  # green
        
        return {
            'score': complexity_score,
            'level': level,
            'color': color,
            'factors': factors,
            'description': f"This workflow has {level.lower()} complexity with a score of {complexity_score}/10"
        }
    
    def _detect_bottlenecks(self, description: str, steps: List[str]) -> Dict[str, Any]:
        """Detect potential bottlenecks"""
        detected = []
        
        # Check for manual interventions
        for indicator in self.bottleneck_indicators:
            if indicator in description:
                detected.append({
                    'type': 'Manual Intervention',
                    'indicator': indicator,
                    'severity': 'High',
                    'description': f"Requires {indicator} which may slow down the workflow",
                    'suggestion': f"Consider automating the {indicator} step"
                })
        
        # Check for sequential dependencies
        if 'then' in description or 'after' in description:
            count = description.count('then') + description.count('after')
            if count > 3:
                detected.append({
                    'type': 'Sequential Dependencies',
                    'indicator': 'Multiple sequential steps',
                    'severity': 'Medium',
                    'description': f"Workflow has {count} sequential dependencies",
                    'suggestion': "Look for opportunities to parallelize independent tasks"
                })
        
        return {
            'count': len(detected),
            'detected': detected,
            'hasBottlenecks': len(detected) > 0
        }
    
    def _suggest_optimizations(self, description: str, steps: List[str], bottlenecks: Dict) -> List[Dict[str, str]]:
        """Generate optimization suggestions"""
        suggestions = []
        
        # Automation opportunities from bottlenecks
        if bottlenecks['count'] > 0:
            suggestions.append({
                'title': 'Automate Manual Steps',
                'description': f"Found {bottlenecks['count']} manual intervention points that could be automated",
                'impact': 'High',
                'effort': 'Medium',
                'time_savings': f"{bottlenecks['count'] * 15}% reduction in processing time"
            })
        
        # Parallelization opportunities
        if len(steps) > 3:
            suggestions.append({
                'title': 'Parallelize Independent Tasks',
                'description': "Some workflow steps may be able to run in parallel",
                'impact': 'Medium',
                'effort': 'Low',
                'time_savings': "20-30% faster execution"
            })
        
        # Data caching
        if 'data' in description or 'information' in description:
            suggestions.append({
                'title': 'Implement Data Caching',
                'description': "Cache frequently accessed data to reduce processing time",
                'impact': 'Medium',
                'effort': 'Low',
                'time_savings': "15% reduction in data retrieval time"
            })
        
        # Error handling
        suggestions.append({
            'title': 'Add Robust Error Handling',
            'description': "Implement retry logic and fallback mechanisms",
            'impact': 'High',
            'effort': 'Medium',
            'time_savings': "Prevent workflow failures and reduce manual intervention"
        })
        
        return suggestions
    
    def _estimate_cost_benefit(self, complexity: Dict, step_count: int) -> Dict[str, Any]:
        """Estimate cost savings and ROI"""
        # Base estimates on complexity and step count
        manual_hours_per_execution = step_count * 0.5  # 30 min per step
        executions_per_month = 20  # Assumption
        
        time_saved_per_execution = manual_hours_per_execution * 0.7  # 70% automation
        monthly_time_savings = time_saved_per_execution * executions_per_month
        
        # Cost calculations (assuming $50/hour)
        hourly_rate = 50
        monthly_savings = monthly_time_savings * hourly_rate
        annual_savings = monthly_savings * 12
        
        return {
            'manual_hours_per_execution': round(manual_hours_per_execution, 1),
            'automated_hours_per_execution': round(manual_hours_per_execution * 0.3, 1),
            'time_saved_percentage': 70,
            'monthly_time_savings_hours': round(monthly_time_savings, 1),
            'monthly_cost_savings': round(monthly_savings, 2),
            'annual_cost_savings': round(annual_savings, 2),
            'roi_months': 3,  # Assumption: 3 months to break even
            'productivity_boost': "3x faster execution"
        }
    
    def _analyze_risks(self, description: str, steps: List[str]) -> Dict[str, Any]:
        """Analyze potential risks"""
        risks = []
        risk_score = 0
        
        # Check for risk keywords
        for keyword in self.risk_keywords:
            if keyword in description:
                risks.append({
                    'type': 'Compliance/Security',
                    'description': f"Workflow involves {keyword} operations",
                    'severity': 'High',
                    'mitigation': f"Ensure proper {keyword} protocols are in place"
                })
                risk_score += 2
        
        # Data handling risks
        if 'data' in description or 'database' in description:
            risks.append({
                'type': 'Data Integrity',
                'description': "Workflow processes data",
                'severity': 'Medium',
                'mitigation': "Implement data validation and backup procedures"
            })
            risk_score += 1
        
        # Integration risks
        if 'integrate' in description or 'api' in description:
            risks.append({
                'type': 'Integration Failure',
                'description': "Workflow depends on external systems",
                'severity': 'Medium',
                'mitigation': "Add retry logic and failover mechanisms"
            })
            risk_score += 1
        
        # Determine overall risk level
        if risk_score >= 5:
            level = "High"
            color = "#EF4444"
        elif risk_score >= 3:
            level = "Medium"
            color = "#F59E0B"
        else:
            level = "Low"
            color = "#10B981"
        
        return {
            'score': min(10, risk_score),
            'level': level,
            'color': color,
            'identified_risks': risks,
            'risk_count': len(risks)
        }
    
    def _calculate_overall_score(self, complexity: Dict, bottlenecks: Dict, risks: Dict) -> Dict[str, Any]:
        """Calculate overall workflow health score"""
        # Weighted scoring
        complexity_weight = 0.3
        bottleneck_weight = 0.4
        risk_weight = 0.3
        
        # Invert scores (lower is better for bottlenecks and risks)
        complexity_score = (10 - complexity['score']) * complexity_weight
        bottleneck_score = (10 - bottlenecks['count']) * bottleneck_weight
        risk_score = (10 - risks['score']) * risk_weight
        
        overall = complexity_score + bottleneck_score + risk_score
        overall_normalized = int((overall / 10) * 100)  # Convert to 0-100
        
        # Determine health status
        if overall_normalized >= 80:
            status = "Excellent"
            color = "#10B981"
            recommendation = "Workflow is well-designed and ready for automation"
        elif overall_normalized >= 60:
            status = "Good"
            color = "#3B82F6"
            recommendation = "Workflow is solid with minor optimization opportunities"
        elif overall_normalized >= 40:
            status = "Fair"
            color = "#F59E0B"
            recommendation = "Workflow needs optimization before full automation"
        else:
            status = "Needs Improvement"
            color = "#EF4444"
            recommendation = "Significant optimization required for successful automation"
        
        return {
            'score': overall_normalized,
            'status': status,
            'color': color,
            'recommendation': recommendation
        }

# Create singleton instance
workflow_analyzer = WorkflowAnalyzer()
